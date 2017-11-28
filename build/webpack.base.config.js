const path = require('path')
const vueConfig = require('./vue-loader.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  devtool: '#source-map',
  entry: {
    app: ['./client-entry.js'],
    vendor: ['es6-promise', 'vue', 'vue-router', 'vuex', 'jquery','moment'],
    style: [path.resolve(__dirname, '../assets/css/common.scss'), path.resolve(__dirname, '../assets/css/yingyan.scss')]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  devServer: {
    historyApiFallback: true,
    inline: true,
    host: "loalhost",
    hot: true,
    port: 131,
    compress: true,
    stats: "errors-only",
    proxy: {
      '/server': {
        target: 'http://baidu.com',
        changeOrigin: true,
        secure: false
      }
    }
  },
  module: {
    loaders: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      options: vueConfig
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        objectAssign: 'Object.assign'
      }
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: '[name].[ext]?[hash]'
      }
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'vue-style-loader',
        use: 'css-loader?minimize!sass-loader?sourceMap'
      }),
      include: path.join(__dirname, '../assets')
    }]
  },
  plugins: []
}
