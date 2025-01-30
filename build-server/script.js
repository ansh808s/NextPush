const { exec } = require("child_process")
const path = require("path")
const fs = require("fs")
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const mime = require('mime-types')
const { Kafka } = require("kafkajs")
const PROJECT_ID = process.env.PROJECT_ID
const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID

const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
})

const kafka = new Kafka({
    brokers: process.env.KAFKA_BROKERS.split(','),
    clientId: `build-server-${DEPLOYMENT_ID}`,
    ssl: {
        ca: [fs.readFileSync(path.join(__dirname, "kafka.pem"), "utf-8")],
    },
    sasl: {
        username: process.env.KAFKA_USER,
        password: process.env.KAFKA_PASS,
        mechanism: "plain"
    }
})

const producer = kafka.producer()

async function publishLog(log) {
    await producer.send({ topic: `container-logs`, messages: [{ key: 'log', value: JSON.stringify({ PROJECT_ID, DEPLOYMENT_ID, log }) }] })
}

const uploadFiles = async (paths) => {
    console.log('Build Complete')
    await publishLog("Build Complete")
    try {
        const distDirPath = path.join(__dirname, 'output', ...paths, 'dist')
        const distContent = fs.readdirSync(distDirPath, { recursive: true })
        console.log('Starting Upload')
        await publishLog("Starting Uploading")
        for (const file of distContent) {
            const filePath = path.join(distDirPath, file)
            if (fs.lstatSync(filePath).isDirectory()) {
                continue;
            }
            console.log('Uploading', filePath)
            await publishLog(`Uploading ${filePath}`)
            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            })
            await s3Client.send(command)
        }
    } catch (error) {
        console.log(error)
        await publishLog(`ERROR: ${error}`)
    }

    console.log('Done')
    await publishLog(`Deployment successfull`)
}


const init = async () => {
    await producer.connect()
    await publishLog(`Starting build`)
    let outDirPath
    let paths
    if (process.env.ROOT_DIR) {
        paths = process.env.ROOT_DIR.split('/').filter((path) => path != "")
        outDirPath = path.join(__dirname, "output", ...paths)
    }
    else {
        outDirPath = path.join(__dirname, "output")
        paths = []
    }
    let p
    if (process.env.FRAMEWORK == 'react') {
        p = exec(`cd ${outDirPath} && npm install && npm run build`)
    }
    if (process.env.FRAMEWORK == 'vanilla') {
        p = exec(`cd ${outDirPath} && npm install`)
    }
    p.stdout.on('data', async (data) => {
        console.log(data.toString())
        await publishLog(data.toString())
    })

    p.stdout.on('error', async (data) => {
        console.log(data.toString())
        await publishLog(`ERROR: ${data.toString()}`)
    })
    p.on('close', async (code) => {
        await uploadFiles(paths);
        process.exit(0)
    });
}

init()