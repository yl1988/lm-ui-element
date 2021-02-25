<!--图片预览弹窗-->
<template>
    <lm-dialog @close="$emit('closeDialog')" title="图片预览" width="800" @cancel="$emit('closeDialog')">
        <div id="previewLargImgBox" class="rowCenter previewLargImgBox" ref="previewLargImgBox">
            <img :src="previewImgSrc" ref="previewImg" class="previewLargImg" :style="{width:previewImgWidth+'%',transform:`rotate(${imgRotate}deg)`}" />
        </div>
        <template #footer>
            <div class="imgUtil rowCenter">
                <span class="iconBox rowCenter" @click="imgRotateFun(0)"> <i class="icon el-icon-refresh-left"></i></span>
                <span class="iconBox rowCenter" @click="imgRotateFun(1)"> <i class="icon el-icon-refresh-right"></i></span>
                <span class="iconBox rowCenter" @click="imZoom(1)"><i class="icon el-icon-plus"></i></span>
                <span class="iconBox rowCenter" @click="imZoom(0)"><i class="icon el-icon-minus"></i></span>
            </div>
        </template>
    </lm-dialog>
</template>
<script>
    import LmDialog from '../lm-dialog/lm-dialog'
    export default {
        name: 'PreviewImgDialog',
        components:{
            LmDialog
        },
        props:{
            previewImgSrc:String,//预览图片地址
        },
        data() {
            return {
                previewImgWidth:100,//预览图片宽度
                imgRotate:0,//图片选择读书
            }
        },
        methods: {
            //图片旋转
            imgRotateFun(type){
                //type 0左旋 1右旋
                //console.log(this.$refs.previewImg)
                type ? this.imgRotate+=90 : this.imgRotate-=90
            },
            //图片放大缩小
            imZoom(type){
                if(type){
                    this.previewImgWidth+=10
                    ;(this.previewImgWidth>100) && (this.previewImgWidth=100)
                }else{
                    this.previewImgWidth-=10
                    ;(this.previewImgWidth<10) && (this.previewImgWidth=10)
                }
            },
        },

    }
</script>
