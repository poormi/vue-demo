"use strict";
let isProd = process.env.NODE_ENV === 'PRD';
let isPre = process.env.NODE_ENV === 'PRE';

const express = require('express');
const fs = require('fs');
let server = express();
const path = require('path')
const resolve = file => path.resolve(__dirname, file);
const favicon = require('serve-favicon');
const createBundleRenderer = require('vue-server-renderer').createBundleRenderer
const serialize = require('serialize-javascript')
const pkg = require('./package.json')

server.use(express.static(resolve('./assets')));
server.use('/dist', express.static(resolve('./dist')));



// setup the server renderer, depending on dev/prod environment
let renderer, indexHTML;
if (isProd || isPre) {
    // create server renderer from real fs 打包后的路径
    const bundlePath = resolve('./dist/server-bundle.js')
    renderer = createBundleRenderer(fs.readFileSync(bundlePath, 'utf-8'))
    indexHTML = parseIndex(fs.readFileSync(resolve('./dist/index.html'), 'utf-8'))
} else {
    // in development: setup the dev server with watch and hot-reload,
    // and update renderer / index HTML on file change.
    require('./build/setup-dev-server')(server, {
        bundleUpdated: bundle => {
            renderer = createBundleRenderer(bundle)
        },
        indexUpdated: index => {
            indexHTML = parseIndex(index)
        }
    })

}


function parseIndex(template) {
    const contentMarker = '<!-- APP -->'
    const i = template.indexOf(contentMarker)
    return {
        head: template.slice(0, i),
        tail: template.slice(i + contentMarker.length)
    }
}
server.use(favicon(resolve('./favicon.ico')));


server.get('*', (req, res, next) => {
    if (!renderer) {
        return res.end('waiting for compilation... refresh in a moment.')
    }



    const context = {
        url: req.url
        , cookie: req.headers.cookie
    }
    const renderStream = renderer.renderToStream(context)
    let firstChunk = true

    res.write(indexHTML.head)

    renderStream.on('data', chunk => {
        if (firstChunk) {
            // embed initial store state
            if (context.initialState) {
                res.write(
                    `<script>window.__INITIAL_STATE__=${
                        serialize(context.initialState, {isJSON: true})
                        }</script>`
                )
            }
            firstChunk = false
        }
        res.write(chunk)
    })

    renderStream.on('end', () => {
        res.end(indexHTML.tail)
    })

    renderStream.on('error', err => {
        if (err && err.code === '404') {
            return res.status(404).end('<h1 class="not-found">404 | Page Not Found</h1>')
        }

        // Render Error Page or Redirect
        console.error(`error during render : ${req.url}`)
        console.error(err)
        return res.status(500).end('<h1 class="not-found">500 | Internal Error</h1>');

    })
});


process.on('uncaughtException', function (err) {
    console.error(err);
    console.error('uncaughtException : ' + err.message);
});

process.on('unhandledRejection', function (reason, p) {
    console.error("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});


server.listen(pkg.port, function () {
    console.info(`${new Date()} ${pkg.name} listen at ${pkg.port} in ${process.env.NODE_ENV}`);
});