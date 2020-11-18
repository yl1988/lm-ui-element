import LmInput from './lm-input'
import LmSelect from './lm-select'
import LmCascader from './lm-cascader'
import LmDateTime from './lm-date-time'
LmInput.install=function (Vue) {
    Vue.component(LmInput.name,LmInput)
}
LmSelect.install=function (Vue) {
    Vue.component(LmSelect.name,LmSelect)
}
LmCascader.install=function (Vue) {
    Vue.component(LmCascader.name,LmCascader)
}
LmDateTime.install=function (Vue) {
    Vue.component(LmDateTime.name,LmDateTime)
}
export {
    LmInput,
    LmSelect,
    LmDateTime,
    LmCascader
}
