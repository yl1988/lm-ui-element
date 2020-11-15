import Vue from 'vue'
import App from './App.vue'
import ElementUi from 'element-ui'
import LmUI from '../packages/index'
// import '../lib/lm-ui-element-style/index.css'
console.log(LmUI)
Vue.use(LmUI)
Vue.use(ElementUi)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
