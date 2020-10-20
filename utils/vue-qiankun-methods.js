import store from '../store'
import router from '../router'
import {Alert} from 'element-ui'
import {MessageBox} from 'element-ui'
import {
    registerMicroApps, // 注册子应用
    runAfterFirstMounted, // 当地一个子应用装载完毕
    setDefaultMountApp, // 设置默认装载的子应用
    initGlobalState, // 微前端之间的通信
    start, // 启动
} from 'qiankun'
export default {
    install(Vue) {
        Vue.prototype.$qiankunMethods = {
          async initQiankun(childrenApp=[],config={}){
              if(!childrenApp instanceof Array){
                  console.error('childrenApp isnot Array ---childrenApp参数必须为数组')
                  return
              }
              let {firstApp,beforeLoad,beforeMount,beforeUnmount,afterUnmount,firstAppLoad}=config
              // 注册子应用
              registerMicroApps(
                  childrenApp,
                  {
                      beforeLoad: [
                          app => {
                              console.log('beforeLoad');
                              beforeLoad instanceof Function && beforeLoad()
                          }
                      ],
                      beforeMount: [
                          app => {
                              console.log('beforeMount');
                              beforeMount instanceof Function && beforeMount()
                          }
                      ],
                      beforeUnmount: [
                          app => {
                              console.log('beforeUnmount');
                              beforeUnmount instanceof Function && beforeUnmount()
                          }
                      ],
                      afterUnmount: [
                          app => {
                              console.log('afterUnmount');
                              afterUnmount instanceof Function && afterUnmount()
                          }
                      ]
                  })

              setDefaultMountApp(firstApp)
              // 第一个子应用加载完毕后回调
              runAfterFirstMounted(()=>{
                  console.log('第一个子应用加载完毕后的回调')
                  firstAppLoad instanceof Function && firstAppLoad()
              })

             // 启动qiankun
              start()

          }
        }
    }
}
