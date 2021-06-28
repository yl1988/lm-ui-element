import Vue from 'vue'
import lmLoading from './lm-loading'
const LmLoadingConstructor=Vue.extend(lmLoading)
let instance
const initInstance = () => {
  instance = new LmLoadingConstructor({
    el: document.createElement('div'),
    data(){
      return {
        visible: false,
        color:'',//颜色
        size:'',//尺寸
      }
    }
  })
}
const LmLoading=function (){
  if (!instance) {
    initInstance()
  }
}
LmLoading.show=function (config={}){
  let {timeout,color,size}=config
  return new Promise((resolve,reject)=>{
    document.body.appendChild(instance.$el)
    instance.visible = true
    color && (instance.color=color)
    size && (instance.size=size)
    if(typeof timeout==='number'){
      let timeNum=setTimeout(()=>{
        clearTimeout(timeNum)
        instance.visible=false
      },timeout)
    }
    resolve(true)
  })
}
LmLoading.hidden=function (){
  instance.visible =false
}
export default LmLoading
