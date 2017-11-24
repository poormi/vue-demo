const path = require('path')
const webpack = require('webpack')
const MFS = require('memory-fs')
const port = require('../config').port
const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')
const proxy = clientConfig.devServer.proxy

module.exports = function setupDevServer(app, opts) {
  // setup on the fly compilation + hot-reload
  clientConfig.entry.app.unshift('webpack-hot-middleware/client');
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )

  const clientCompiler = webpack(clientConfig)
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  })
  app.use(devMiddleware);

  clientCompiler.plugin('done', () => {
      const fs = devMiddleware.fileSystem
      const filePath = path.join(clientConfig.output.path, 'index.html')
      if (fs.existsSync(filePath)) {
        const index = fs.readFileSync(filePath, 'utf-8')
        opts.indexUpdated(index)
      }
    })
    // hot middleware
  app.use(require('webpack-hot-middleware')(clientCompiler))

  //proxy api request
  Object.keys(proxy).forEach(function(context) {
    var options = proxy[context]
    if (typeof options === 'string') {
      options = {
        target: options
      }
    }
    app.use(require('http-proxy-middleware')(options.filter || context, options))
  })

  // watch and update server renderer
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  const outputPath = path.join(serverConfig.output.path, serverConfig.output.filename)
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    console.log('server render is change.........');

    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    opts.bundleUpdated(mfs.readFileSync(outputPath, 'utf-8'))
  })
}