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
      }
    }
  })
}
const LmLoading=function (){
  if (!instance) {
    initInstance()
  }
}
LmLoading.show=function (timeout){
  return new Promise((resolve,reject)=>{
    document.body.appendChild(instance.$el)
    instance.visible = true
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
