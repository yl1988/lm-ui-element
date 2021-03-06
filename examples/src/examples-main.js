import Vue from 'vue'
import App from './App.vue'
import ElementUi from 'element-ui'
import LmUI from '../../packages/index'
import 'element-ui/lib/theme-chalk/index.css'
import $lm from '../../packages/utils/$lm'
import {LmLoading} from '../../packages/index'
Vue.use($lm)
Vue.use(LmLoading)

Vue.use(ElementUi)
//console.log(LmUI)
Vue.use(LmUI)
Vue.prototype.$lmLoading=LmLoading

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
