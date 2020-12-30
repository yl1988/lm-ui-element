import LmImgCropper from './lm-img-cropper'
import VueCropper  from 'vue-cropper'
LmImgCropper.install=function (Vue) {
    Vue.component(LmImgCropper.name,LmImgCropper)
    Vue.use(VueCropper)
}
export default LmImgCropper
