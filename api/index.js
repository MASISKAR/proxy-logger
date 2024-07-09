const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require('cors');
const Logger = require("./logger");
const http = require('http');
const initSocket = require('./socket');

const SELF_PORT = 4000;
const SELF_HOST = "127.0.0.1";
const TARGET_API_URL = "http://127.0.0.1:8443"; // fixme for PC
// const TARGET_API_URL = "http://127.0.0.1:8000"; // fixme for MT

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



const axiosInstance = axios.create({
    baseURL: TARGET_API_URL,
});

const logger = new Logger('access.log');
const io = initSocket(server, logger);

app.use(async (req, res)=> {
    const { method, url, headers, body } = req;
  try {
      const response = await axiosInstance({
          method,
          url,
          headers,
          data: body
      });
      const {status, headers: resHeaders, data} = response;
    const logMessage = logger.createLog({ method, url: TARGET_API_URL+url, body, status });
    res.set(resHeaders);
      res.status(status).json(data);
      io.emit('log-receive', logMessage);
  }
  catch (error) {
    const logMessage = logger.createLog({ method, url: TARGET_API_URL+url, body, error, status: 500 });
      res.status(500).json(error);
      io.emit('log-receive', logMessage);
  }
});

app.listen(SELF_PORT, SELF_HOST, () => {
    console.log(`Starting Proxy at ${SELF_HOST}:${SELF_PORT}`);
});
