import LmCalendar from './src/lm-calendar/index'
import {
    LmInput,
    LmSelect,
    LmDateTime,
    LmCascader
} from './src/lm-form-item/index'
import LmMultiOptionBtns from './src/lm-multi-option-btns'
import LmAddress from './src/lm-address'
import './lm-ui-element-style/src/index.scss'

const components=[LmCalendar,LmInput,LmSelect,LmDateTime,LmCascader,LmMultiOptionBtns,LmAddress]
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
