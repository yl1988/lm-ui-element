
const path = require('path')
function resolve(dir){
  return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}
let proxys=function (){
  let apiPathArr=['/code','/auth','/admin','/file-management','/property','/oa']
  let proxys={}
  for(let i=0;i<apiPathArr.length;i++){
    proxys[apiPathArr[i]]={
      target: 'http://10.2.100.28',
      ws: false,
      changeOrigin: true,
      pathRewrite:{
        [`^${apiPathArr[i]}`]:apiPathArr[i]
      }
    }
  }
  return proxys
}()
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
    proxy:proxys,// 配置多个代理
    before: app => { }
  },

}
