import LmUpFile from './lm-up-file'
import LmUpImg from './lm-up-img'
LmUpFile.install=function (Vue) {
    Vue.component(LmUpFile.name,LmUpFile)
}
LmUpImg.install=function (Vue) {
    Vue.component(LmUpImg.name,LmUpImg)
}
export default {
    LmUpFile,
    LmUpImg
}
