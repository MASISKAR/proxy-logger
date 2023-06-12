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

app.use(async (req, res)=> {
    const { method, url, headers, body } = req;
  try {
      const response = await axiosInstance({
          method,
          url,
          headers,
          data: body
      });
    logger.createLog({ method, url: TARGET_API_URL+url, body });
      const {status, headers: resHeaders, data} = response;
      res.set(resHeaders);
      res.status(status).json(data);
  }
  catch (error) {
    logger.createLog({ method, url: TARGET_API_URL+url, body, error });
      res.status(500).json(error);
  }
});

app.listen(SELF_PORT, SELF_HOST, () => {
    console.log(`Starting Proxy at ${SELF_HOST}:${SELF_PORT}`);
});
