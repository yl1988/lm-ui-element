import LmCalendar from './src/lm-calendar/index'
import './lm-ui-element-style/src/index.scss'
const components=[LmCalendar]
const install=function (Vue) {
    if(install.installed){
        return
    }
    components.map(component=>Vue.component(component.name,component))
}
if(typeof window!=='undefined' && window.Vue){
  install(window.Vue)
}
export default {
    install,
}
