const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "assets",
  indexPath: "index.html",
  filenameHashing: true,
  pages: {
    index: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
      title: "Index Page",
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
  },
  lintOnSave: true,
  runtimeCompiler: false,
  transpileDependencies: [],
  productionSourceMap: false,
  integrity: false,
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "test" ||
      process.env.NODE_ENV === "development") {
      config.output.filename = 'assets/js/[name]-[hash:8].js'
      config.output.chunkFilename = 'assets/js/[name]-[hash:8].js'
    }
    config.plugins.push(
      new CompressionWebpackPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    )
  },
  chainWebpack: config => {
    console.log('config：' + process.env.NODE_ENV);
    if (process.env.NODE_ENV == 'test') {}
  },
  css: {
    extract: true,
    modules: false,
    sourceMap: false,
    loaderOptions: {
      css: {
      },
      postcss: {
      },
    },
  },
  parallel: require("os").cpus().length > 1,
  pluginOptions: {},
};
