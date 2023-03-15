/* =========================================================================================
  File Name: vue.config.js
  Description: configuration file of vue
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - Clean Vue.js Dashboard Admin Template
  Version: 1.1
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== */
const path = require('path')
const moment = require('moment')
var Version = moment(new Date()).format('YYYYMMDDHH')

const resolve = dir => {
  return path.join(__dirname, dir)
}
var webpack = require('webpack')
// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : '/'
module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'publicPath
  baseUrl: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
    if (process.env.NODE_ENV === 'production') {
      if (process.env.npm_config_report) {
        config
          .plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end()
        config.plugins.delete('prefetch')
      }
    }
    config.externals({ // echarts 体积庞大，选择将其以CDN 方式加载，因为echart会全局暴漏变量，所以在此export
      echarts: 'echarts',
      VueECharts: 'VueECharts'
    })
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, "./src/assets/css/varibles.less")
      ]
    }
  },
  css: {

    extract: {
      filename: 'css/[name].' + Version + '.css',
      chunkFilename: 'css/[name].' + Version + '.css'
    },
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue:16,
            propList: ['*']
          }), // 换算的基数
        ]
      }
    },
  },
  configureWebpack: {
    output: {
      filename: 'js/[name].' + Version + '.js',
      chunkFilename: 'js/[name].' + Version + '.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/) // moment默认会加载全部语言，影响打包体积，所以只加载中文
    ]
  },
  transpileDependencies: ['vue-echarts', 'resize-detector'],
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    proxy: 'https://ai-mall.linkdome.cn/api/v1'
    // proxy: 'http://ai_mall_dev.linkdome.cn/api/v1'
    // proxy: 'https://enjoycity.linkdome.cn/api/v1'
    // proxy: 'http://wxmall.linkdome.cn/api/v1'
    // proxy:'https://chuangyigu.linkdome.cn/api/v1'
    // proxy: 'https://dev_mall.linkdome.cn/api/v1'
    // proxy: 'https://shopmall.linkdome.cn/api/v1'

    // proxy: 'https://sale_mall_dev.linkdome.cn/api/v1'
    // proxy: 'https://peacebird_v4.linkdome.cn/api/v1'
    // proxy: 'https://ai_mall_dev.linkdome.cn/api/v1'
    // proxy: 'https://taikoo.linkdome.cn/api/v1'
    // proxy: 'https://huijia.linkdome.shop/api/v1'
    // proxy:'https://csgc.linkdome.cn/api/v1'
    // proxy:'http://ship.linkdome.cn:8092/api/v1'
  }
}
