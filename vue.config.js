// const CompressionPlugin = require('compression-webpack-plugin') //引入compression-webpack-plugin

module.exports = {
  publicPath: './',
  lintOnSave: true,
  //静态资源(js、css、img、fonts)目录
  assetsDir: 'static',
  //sourceMap
  productionSourceMap: false,
  devServer: {
    proxy: {
      //配置跨域
      '/api': {
        target: 'http://localhost:8888', //这里后台的地址模拟的;应该填写你们真实的后台接口
        changOrigin: true, //允许跨域
        ws: false, // 这里把ws代理给关闭
        secure: false,
        pathRewrite: {
          /* 重写路径，当我们在浏览器中看到请求的地址为：http://localhost:8080/api/core/getData/userInfo 时
            实际上访问的地址是：http://121.121.67.254:8185/core/getData/userInfo,因为重写了 /api
           */
          '^/api': '',
        },
      },
    },
  },
  //css处理
  // css: {
  //   extract: process.env.NODE_ENV === 'development' ? false : true,
  // },
  // configureWebpack: (config) => {
  //   //打包时对js/css文件进行压缩
  //   if (process.env.NODE_ENV === 'production') {
  //     //生产环境
  //     config.plugins.push(
  //       new CompressionPlugin({
  //         /* [file]被替换为原始资产文件名。
  //                      [path]替换为原始资产的路径。
  //                      [dir]替换为原始资产的目录。
  //                      [name]被替换为原始资产的文件名。
  //                      [ext]替换为原始资产的扩展名。
  //                      [query]被查询替换。*/
  //         filename: '[path].gz[query]',
  //         //压缩算法
  //         algorithm: 'gzip',
  //         //匹配文件
  //         test: /\.js$|\.css$|\.html$/,
  //         //压缩超过此大小的文件,以字节为单位
  //         threshold: 10240,
  //         minRatio: 0.8,
  //         //删除原始文件只保留压缩后的文件
  //         //deleteOriginalAssets: false
  //       })
  //     )
  //   }
  // },
}
