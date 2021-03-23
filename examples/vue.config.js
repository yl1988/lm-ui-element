
const path = require('path')
function resolve(dir){
  return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}
module.exports = {
  pages:{
    index:{
      entry:'src/examples-main.js'
    }
  },
  devServer: {
    open: false,                                 //配置自动启动浏览器
    port: 6060,                                 // 端口号
    https: false,
    hotOnly: false,                             // 设置代理
    proxy:'http://10.2.100.242',// 配置多个代理
    before: app => { }
  },

}
