const path = require('path')
// const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const entry = require('../config/entry.js')
function generateEntries() {
  const entries = {}
  entry.forEach(item => {
    entries[item.outpath] = './src/pages/'+ item.path
  })
  return entries
}

const makePlugins = () => {
  const plugin = [
    new CleanWebpackPlugin(),
    new copyWebpackPlugin([{
      from: path.resolve(__dirname, "../src/assets"),
      to: './assets',
      ignore: ['.*']
  }]),
  ]
  entry.forEach(item => {
    plugin.push(
      new HtmlWebpackPlugin({
        title: item.title,
        template: path.resolve(__dirname,'..','index.html'),
        filename: `${item.outpath}.html`,
        chunks: [item.outpath,'vendors'],
        minify: {
          // 压缩 HTML 文件
          removeComments: true, // 移除 HTML 中的注释
          collapseWhitespace: true, // 删除空白符与换行符
          minifyCSS: true // 压缩内联 css
        }
      })
    )
  })
  return plugin
}
const config = {
  entry: generateEntries(),
  output: {
    path: path.resolve(__dirname, '..', 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              limit: 1000, // size <= 1KB
              outputPath: 'images/'
            }
          },
          // img-loader for zip img
          {
            loader: 'image-webpack-loader',
            options: {
              // 压缩 jpg/jpeg 图片
              mozjpeg: {
                progressive: true,
                quality: 65 // 压缩率
              },
              // 压缩 png 图片
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash:5].min.[ext]',
            limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
            publicPath: 'fonts/',
            outputPath: 'fonts/'
          }
        }
      }
    ]
  },
  performance: false
}
makePlugins(config)
config.plugins = makePlugins(config)
module.exports = config