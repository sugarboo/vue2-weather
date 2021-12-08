'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = 'Vue-weather' // page title

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false, // close eslint
  productionSourceMap: false,
  devServer: {
    // 跨域配置
    proxy: 'http://api.weatherdt.com/',
    overlay: {
      warnings: false,
      errors: true
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      // '@' 别名配置
      alias: {
        '@': resolve('src')
      }
    }
  }
}