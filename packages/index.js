import LmCalendar from './src/lm-calendar/index'
import {
    LmInput,
    LmSelect,
    LmDateTime,
    LmCascader
} from './src/lm-form-item/index'
import './lm-ui-element-style/src/index.scss'
console.log(LmInput)
const components=[LmCalendar,LmInput,LmSelect,LmDateTime,LmCascader]
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
