import Vue from 'vue'
import App from './App.vue'
import ElementUi from 'element-ui'
import LmUI from '../packages/index'
import 'element-ui/lib/theme-chalk/index.css'
// import '../lib/lm-ui-element-style/index.css'
Vue.use(ElementUi)
console.log(LmUI)
Vue.use(LmUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
