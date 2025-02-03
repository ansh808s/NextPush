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

})

const producer = kafka.producer()

async function publishLog(message, type = 'info') {
    const logEntry = {
        type,
        message,
        timestamp: new Date().toISOString(),
        deployment_id: DEPLOYMENT_ID
    };

    console.log(`[${type.toUpperCase()}] ${message}`);

    await producer.send({
        topic: 'container-logs',
        messages: [{
            key: type,
            value: JSON.stringify(logEntry)
        }]
    });
}


const uploadFiles = async (paths) => {
    console.log('Build Complete')
    await publishLog("Build Complete", "success");
    try {
        const distDirPath = path.join(__dirname, 'output', ...paths, 'dist')
        const distContent = fs.readdirSync(distDirPath, { recursive: true })
        console.log('Starting Upload')
        await publishLog("Starting Upload", "info");
        for (const file of distContent) {
            const filePath = path.join(distDirPath, file)
            if (fs.lstatSync(filePath).isDirectory()) {
                continue;
            }
            console.log('Uploading', filePath)
            await publishLog(`Uploading ${filePath}`, "info");
            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            })
            await s3Client.send(command)
        }
    } catch (error) {
        await publishLog(error.message, "error");
        throw error;
    }

    console.log('Done')
    await publishLog("Deployment successful", "success");
}


const init = async () => {
    try {
        await producer.connect()
        await publishLog("Starting build", "info");
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
            await publishLog(data.toString().trim(), "info");
        })

        p.stdout.on('error', async (data) => {
            console.log(data.toString())
            await publishLog(data.toString().trim(), "error");
        })
        p.on('close', async (code) => {
            if (code === 0) {
                await uploadFiles(paths);
                process.exit(0);
            } else {
                await publishLog(`Process exited with code ${code}`, "error");
                process.exit(1);
            }
        });
    }
    catch (error) {
        await publishLog(error.message, "error");
        process.exit(1);
    }
}

init()