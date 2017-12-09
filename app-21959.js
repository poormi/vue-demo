"use strict";

const ENV = process.env.NODE_ENV || "PRE";
const express = require('express');
const fs = require('fs');
let server = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require("../servers/utils/logger").getLogger(__filename.split("/").pop());
const path = require('path')
const resolve = file => path.resolve(__dirname, file);
const favicon = require('serve-favicon');

const createBundleRenderer = require('vue-server-renderer').createBundleRenderer
const serialize = require('serialize-javascript')

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const port = require('./config').port
const MFS = require('memory-fs')
const clientConfig = require('./build/webpack.client.config')
const serverConfig = require('./build/webpack.server.config')

// setup the server renderer, depending on dev/prod environment
let renderer;
if (ENV === 'PRD' || ENV === 'PRE') {
    // create server renderer from real fs 打包后的路径
    const bundlePath = resolve('../dist/server-bundle.js')
    renderer = createBundleRenderer(fs.readFileSync(bundlePath, 'utf-8'))
} else {
    server = require('./build/setup-dev-server')(bundle => {
        renderer = createBundleRenderer(bundle);

        scanAction(resolve('./actions'));
    });
}
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
    extended: false
}));
server.use(favicon(resolve('../favicon.ico')));
server.use(express.static(path.join(__dirname, 'public')));

server.use(function(req, res, next) {
    var logerContent = req.method + '\t' + req.originalUrl + '\t' + JSON.stringify(req.body) + '\t' + JSON.stringify(req.query) + '\t' + JSON.stringify(req.params);
    logger.info(logerContent);

    return next();
});

// 扫描Action
function scanAction() {
    let args = arguments;
    for (var i in arguments) {
        let path = arguments[i];
        logger.debug(path);
        fs.readdir(path, function(err, files) {
            if (!err) {
                files.forEach(function(item) {
                    var tmpPath = path + '/' + item;
                    fs.stat(tmpPath, function(err1, stats) {
                        if (!err1 && !stats.isDirectory()) {
                            logger.info('load action :' + tmpPath);
                            require(tmpPath)(server.app, renderer);
                        }
                    })
                });
            }
        });
    }
};

process.on('uncaughtException', function(err) {
    logger.error(err);
    logger.error('uncaughtException : ' + err.message);
});

process.on('unhandledRejection', function(reason, p) {
    logger.error("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});


server.listen(port, function() {
    logger.info('yingyan_v2 listen at %s in %s', port, ENV);
});

exports.server = server;