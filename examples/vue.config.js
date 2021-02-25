
const path = require('path')
function resolve(dir){
  return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}
module.exports = {
  pages:{
    index:{
      entry:'src/examples-main.js'
    }
  }

}
