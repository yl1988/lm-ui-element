import Vue from 'vue'
import App from './App.vue'
import LmUI from './../packages'
console.log(LmUI)
Vue.use(LmUI)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
