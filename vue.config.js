const path = require('path')
// const HotHashWebpackPlugin = require('hot-hash-webpack-plugin')
const WebpackBar = require('webpackbar')
const webpackPluginCepLink = require('./build/webpackPlugin/cepLink')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const resolve = dir => path.join(__dirname, '.', dir)

module.exports = {
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist', // resolve(`dist/${process.env.VUE_APP_CEP_ID}`),
  assetsDir: 'assets', // resolve(`dist/${process.env.VUE_APP_CEP_ID}/assets`),
  lintOnSave: true,
  devServer: {
    port: 8902,
    host: 'localhost',
    https: false,
    open: true,
    hot: true
    // disableHostCheck: true
  },
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json', '.wasm']
    }
  },
  chainWebpack: config => {
    config.resolve.symlinks(true) // 修复HMR
    config.plugin('webpackPluginCepLink').use(webpackPluginCepLink, [
      {
        assets: './public/cep',
        cepId: process.env.VUE_APP_CEP_ID,
        cepFolderName: './cep',
        isDebug: process.env.VUE_APP_CEP_DEBUG,
        port: process.env.VUE_APP_CEP_PORT,
        build: process.env.VUE_APP_CEP_BUILD
      }
    ])

    // 重写 vue-loader 配置
    const vueRule = config.module.rule('vue')
    vueRule.uses.clear()
    vueRule.test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()

    if (process.env.NODE_ENV === 'production') {
      config.output
        .filename('./client/assets/js/[name].[chunkhash].js')
        .chunkFilename('./client/assets/js/[name].[chunkhash].js')
        .libraryTarget('umd')
        .library('CEP')

      // 处理ts文件 (新增loader)
      config.module
        .rule('ts')
        .test(/\.tsx?$/)
        .exclude
        .add(resolve('node_modules'))
        .end()
        .use('cache-loader')
        .loader('cache-loader')
        .options({
          cacheDirectory: resolve('node_modules/.cache/ts-loader')
        })
        .end()
        .use('babel-loader')
        .loader('babel-loader')
        .end()
        .use('ts-loader')
        .loader('ts-loader')
        .options({
          transpileOnly: true, // 关闭类型检查，即只进行转译(类型检查交给webpack插件(fork-ts-checker-webpack-plugin)在另一个进程中进行,这就是所谓的多进程方案,如果设置transpileOnly为false, 则编译和类型检查全部由ts-loader来做, 这就是单进程方案.显然多进程方案速度更快)
          appendTsSuffixTo: ['\\.vue$'],
          happyPackMode: true // 不加会报错 Syntax Error: Thread Loader (Worker 0) Cannot read property 'errors' of undefined
        })
        .end()

      // eslint 自动修复 (修改已经存在的loader)
      config.module
        .rule('eslint')
        .test(/\.(vue|(j|t)sx?)$/)
        .pre() // eslint是pre处理的
        .use('eslint-loader')
        .loader('eslint-loader')
        .tap(options => { // 修改已经存在loader的配置
          options.fix = true
          return options
        })
        .end()

      // 使用webpack 插件进行typescript 的类型检查 fork-ts-checker-webpack-plugin
      config
        .plugin('fork-ts-checker')
        .use(ForkTsCheckerWebpackPlugin)

      config.plugin('extract-css').tap(args => [
        {
          filename: './client/assets/css/[name].[contenthash:8].css',
          chunkFilename: './client/assets/css/[name].[contenthash:8].css'
        }
      ])

      config.plugin('webpackBar').use(WebpackBar)

      // 正式环境下，删除console和debugger
      config.optimization
        .minimize(true)
        .minimizer('terser')
        .tap(args => {
          const { terserOptions } = args[0]
          terserOptions.compress.drop_console = true
          terserOptions.compress.drop_debugger = true
          return args
        })

      config.optimization.splitChunks({
        cacheGroups: {
          common: {
            name: 'common',
            chunks: 'all',
            minSize: 1,
            minChunks: 2,
            priority: 1
          },
          vendor: {
            name: 'chunk-libs',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          }
        }
      })
    }
  }
}
