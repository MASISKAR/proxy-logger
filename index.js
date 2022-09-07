const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios");
const Logger = require("./logger");

const SELF_PORT = 4000;
const SELF_HOST = "127.0.0.1";
const TARGET_API_URL = "http://127.0.0.1:8443";

const app = express();
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const axiosInstance = axios.create({
    baseURL: TARGET_API_URL,
});

const logger = new Logger('access.log');
let logId = 1;

app.use(async (req, res, next)=> {
    const { method, url, headers, body } = req;
    const logStr = Logger.create({ method, url: TARGET_API_URL+url, logId, body });
    logger.write(logStr);
    logId++;
  try {
      const response = await axiosInstance({
          method,
          url,
          headers,
          data: body
      });
      const {status, headers: resHeaders, data} = response;
      res.set(resHeaders);
      res.status(status).json(data);
  }
  catch (err) {
      res.status(500).json(err);
  }
});

app.listen(SELF_PORT, SELF_HOST, () => {
    console.log(`Starting Proxy at ${SELF_HOST}:${SELF_PORT}`);
});
