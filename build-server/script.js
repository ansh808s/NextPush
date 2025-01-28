const { exec } = require("child_process")
const path = require("path")
const fs = require("fs")
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const mime = require('mime-types')
const PROJECT_ID = process.env.PROJECT_ID

const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
})


const uploadFiles = async (paths) => {
    console.log('Build Complete')
    const distDirPath = path.join(__dirname, 'output', ...paths, 'dist')
    const distContent = fs.readdirSync(distDirPath, { recursive: true })
    console.log('Starting Upload')
    for (const file of distContent) {
        const filePath = path.join(distDirPath, file)
        if (fs.lstatSync(filePath).isDirectory()) {
            continue;
        }
        console.log('Uploading', filePath)
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: `__outputs/${PROJECT_ID}/${file}`,
            Body: fs.createReadStream(filePath),
            ContentType: mime.lookup(filePath)
        })
        await s3Client.send(command)
    }
    console.log('Done')
}


const init = async () => {
    console.log("Executing script.js")
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
    console.log(outDirPath)
    let p
    if (process.env.FRAMEWORK == 'react') {
        p = exec(`cd ${outDirPath} && npm install && npm run build`)
    }
    if (process.env.FRAMEWORK == 'vanilla') {
        p = exec(`cd ${outDirPath} && npm install`)
    }
    p.stdout.on('data', (data) => {
        console.log(data.toString())
    })

    p.stdout.on('error', (data) => {
        console.log(data.toString())
    })
    p.on('close', (code) => {
        uploadFiles(paths);
    });
}

init()