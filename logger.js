const fs = require("fs");
const path = require("path");

class Logger{
    constructor(logFile){
        const logFilePath = path.join(__dirname, logFile);
        console.log('logFilePath', logFilePath); // fixme m
        console.log('fs.existsSync(logFilePath)', fs.existsSync(logFilePath)); // fixme m
        if (!fs.existsSync(logFilePath)) {
            fs.writeFileSync(logFilePath, '');
        }
    this.logger = fs.createWriteStream( path.join(__dirname, logFile), { flags: "a" });
    }
    write(msg){
        this.logger.write(msg);
    }
    static create({ method='', url='', logId=0, body }){
        const date = new Date().toString().slice(4, 24);
        let logStr = `< ${logId} > ${date} ${method} ${url}`;
        if(body && Object.keys(body).length){
            logStr += `\n${JSON.stringify(body, null, 1)}`;
        }
        logStr +="\n\n";
        return logStr;
    }
}

module.exports = Logger;
