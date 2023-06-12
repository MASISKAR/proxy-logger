const fs = require("fs");
const path = require("path");

class Logger{
    constructor(logFile){
        const logFilePath = path.join(__dirname, logFile);
        if (!fs.existsSync(logFilePath)) {
            fs.writeFileSync(logFilePath, '');
        }
        this.#logger = fs.createWriteStream( path.join(__dirname, logFile), { flags: "a" });
    }
    #logger = null;
    #logId = 1;
     createLog({ method='', url='', body, error }){
        const date = new Date().toString().slice(4, 24);
        let logStr = `< ${this.#logId} > ${date} ${method} ${url}`;
        if(body && Object.keys(body).length){
            logStr += `\n${JSON.stringify(body, null, 1)}`;
        }
         if(error){
             logStr += `\n${error.toString()}`;
         }
        logStr +="\n\n";
         this.#logger.write(logStr);
         this.#logId++;
    }
}

module.exports = Logger;
