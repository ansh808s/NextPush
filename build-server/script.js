const { exec } = require("child_process")
const path = require("path")





const init = async () => {
    console.log("Executing script.js")
    const outDirPath = path.join(__dirname, 'output')
    const p = exec(`cd {outDirPath} && npm install && npm run build`)

    p.stdout.on('data', (data) => {
        console.log(data.toString())
    })

    p.stdout.on('error', (data) => {
        console.log(data.toString())
    })
    p.on('close', uploadFiles())
}