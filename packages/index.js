import LmCalendar from './src/lm-calendar/index'
import {
    LmInput,
    LmSelect,
    LmDateTime,
    LmCascader
} from './src/lm-form-item/index'
import LmMultiOptionBtns from './src/lm-multi-oprion-btns'
import './lm-ui-element-style/src/index.scss'

const components=[LmCalendar,LmInput,LmSelect,LmDateTime,LmCascader,LmMultiOptionBtns]
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
