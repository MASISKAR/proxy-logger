const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logfile.log' })
    ]
});

const app = express();

// Configuration
const PORT = 4000;
const HOST = "127.0.0.1";
const API_SERVICE_URL = "http://127.0.0.1:8443";

// Logging
app.use(morgan('dev'));

// Info GET endpoint
app.get('/info', (req, res, next) => {
    res.send('This is a proxy service which proxies to JSONPlaceholder API.');
});

// Proxy endpoints
app.use('', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    logProvider: ()=>logger
/*    pathRewrite: {
        [`^/json_placeholder`]: '',
    },*/
}));

// Start Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
