
const path = require('path')
function resolve(dir){
  return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}
module.exports = {
  chainWebpack:config=>{
    config.module.rule('js')
      .include.add(resolve('packages')).end()
      .use('babel')
      .loader('babel-loader')
      .tap(options=>{
        return options
      })
  },
  // // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  parallel: require('os').cpus().length > 1,
}
