const fs = require("fs");
const path = require("path");


class Logger{
    constructor(logFile){
        const logFilePath = path.join(__dirname, logFile);
        this.#logFilePath = logFilePath;
        if (!fs.existsSync(logFilePath)) {
            fs.writeFileSync(logFilePath, '');
        }
        this.#logger = fs.createWriteStream( path.join(__dirname, logFile), { flags: "a" });
    }
    #logFilePath = '';
    #logger = null;
    #logId = 1;
     createLog({ method='', url='', body, status, error }){
        const date = new Date().toString().slice(4, 24);
        let logStr = `< ${this.#logId} > ${date} ${method} ${url}`;
        if(body && Object.keys(body).length){
            logStr += `\n${JSON.stringify(body, null, 1)}`;
        }
         if(error){
             logStr += `\n${error.code} ${error.message}`;
         }
        logStr += `\n-> Status: ${status}\n`;
         this.#logger.write(logStr);
         this.#logId++;
         return logStr;
    }
  clearLogs(){
      fs.writeFileSync(this.#logFilePath, '');
  }
  getLogs(){
    if (fs.existsSync(this.#logFilePath)) {
     return fs.readFileSync(this.#logFilePath, 'UTF-8');
    }
    return '';
  }
}

module.exports = Logger;
