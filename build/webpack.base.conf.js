const path = require('path')
const glob = require('glob')
// const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
let allPages = []
function generateEntries() {
  const entries = {}
  let arsLen = process.argv.length
  // 指定文件打包
  if (arsLen>4) {
    let argus = process.argv.slice(4,arsLen)
    allPages = argus
    argus.forEach(name => {
      let str = name + '/index'
      entries[str] = './src/'+ name +'/index.js'
    })
  } else {
    // 打包所以
    const pages = glob.sync("src/**/*.js")
    pages.forEach(item => {
      let arr = item.split('/')
      let len = arr.length
      let name = arr[len -1]
      name = name.substring(0,name.length-3)
      allPages = name
      let str = arr[len-2] + '/' + name
      entries[str] = './' + item
    })
  }
  console.log(entries)
  return entries
}

const makePlugins = configs => {
  const plugin = [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: allPages
  })
  ]
  Object.keys(configs.entry).forEach(item => {
    plugin.push(
      new HtmlWebpackPlugin({
        title: '1212',
        template: path.resolve(__dirname, '..', 'index.html'),
        filename: `${item}.html`,
        chunks: [item]
      })
    )
  })
  return plugin
}
// { 'list/index': './src/list/index.js' }
// { 'index/index': './src/index/index.js' }
// { 'index/index': './src/index/index.js',
//   'list/list': './src/list/list.js',
//   'list/list1': './src/list/list1.js',
//   'test1/test': './src/test/test1/test.js' }
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