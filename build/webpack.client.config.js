const webpack = require('webpack')
const path = require('path')
const base = require('./webpack.base.config')
const vueConfig = require('./vue-loader.config')
const HTMLPlugin = require('html-webpack-plugin')
// Use ExtractTextPlugin to extract CSS into a single file
// so it's applied on initial render
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const config = Object.assign({}, base, {
  plugins: base.plugins.concat([
    // strip comments in Vue code
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.VUE_ENV': "client"
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new ExtractTextPlugin('[name].css'),
    new OptimizeCSSPlugin(),
    // generate output HTML
    new HTMLPlugin({
      template: 'index.template.html',
      inject: true,
    }),
    new VueSSRClientPlugin()
  ])
})

if (process.env.NODE_ENV === 'PRD' || process.env.NODE_ENV === 'PRE') {
  const PurifyCSSPlugin = require('purifycss-webpack')
  const glob = require('glob')

  const APP_PATH = path.resolve(__dirname, '..')

  let paths = glob.sync(path.join(APP_PATH, 'views', '**', '*'), {
    nodir: true
  })
  paths = paths.concat(glob.sync(path.join(APP_PATH, 'components', '**', '*'), {
    nodir: true
  }))
  paths = paths.concat(glob.sync(path.join(APP_PATH, 'assets', '**', '*.js'), {
    nodir: true
  }))


  config.plugins.push(
    // clean unused CSS
    new PurifyCSSPlugin({
      verbose: true,
      paths: paths
    }),
    // this is needed in webpack 2 for minifying CSS
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    // // minify JS
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
}

module.exports = config
