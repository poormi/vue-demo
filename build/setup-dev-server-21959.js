const path = require('path')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const port = require('../config').port
const MFS = require('memory-fs')
const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')

module.exports = function setupDevServer(onUpdate) {
  // setup on the fly compilation + hot-reload
  clientConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:" + port);
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )

  const clientCompiler = webpack(clientConfig)
  const clientServer = new WebpackDevServer(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  })

  // watch and update server renderer
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  const outputPath = path.join(serverConfig.output.path, serverConfig.output.filename)
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    onUpdate(mfs.readFileSync(outputPath, 'utf-8'))
  })

  return clientServer;
}