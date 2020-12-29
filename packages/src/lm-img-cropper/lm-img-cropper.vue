<!--图片裁剪-->
<template>
    <lm-dialog :width="width" :title="title" ref="customDialog">
        <div class="cropper-component">
            <slot name="sizeWarning">
                <div class="rowCenter" v-if="fileSize && maxSize && fileSize>maxSize">
                    <strong class="red">*提示：</strong>
                    <span class="gray666">头像要求小于</span>
                    <strong class="red" style="margin:0 5px;"> 200 </strong>
                    <span class="gray666"> kb，当前图片为 </span>
                    <strong class="red" style="margin:0 5px;"> {{fileSize}} </strong>
                    <span class="gray666">kb，请裁剪后再上传</span>
                </div>
            </slot>
            <div class="info-item rowBtween">
                <div class="columnStart">
                    <div class="btn-box">
                        <el-button size="mini" class="operation-btn" icon="el-icon-plus" value="+"  @click="changeScale(1)"/>
                        <el-button size="mini" class="operation-btn" icon="el-icon-minus" @click="changeScale(-1)"></el-button>
                        <el-button size="mini" class="operation-btn" icon="el-icon-refresh-left"  @click="rotate(0)"></el-button>
                        <el-button size="mini" class="operation-btn" icon="el-icon-refresh-right" @click="rotate(1)"></el-button>
                    </div>
                    <div class="operation-box">
                        <div class="cropper" :style="{width:autoCropWidth+60+'px',height:priveImgHeight+60+'px'}">
                            <vueCropper
                                ref="cropper"
                                :img="imgSrc"
                                :outputSize="outputSize"
                                :outputType="outputType"
                                :info="info"
                                :full="full"
                                :canMove="canMove"
                                :canMoveBox="canMoveBox"
                                :original="original"
                                :autoCrop="autoCrop"
                                :autoCropWidth="priveImgWidth"
                                :autoCropHeight="priveImgHeight"
                                :fixedBox="fixedBox"
                                @realTime="realTime"
                                @imgLoad="imgLoad"
                            ></vueCropper>
                            <div class="rowCenter loadingBox" v-if="showLoading">
                                <i class="el-icon-loading font40 gray666"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="preview-box columnStart">
                    <div class="font16" style="margin-bottom:20px;">{{previewText}}</div>
                    <div :style="{width:autoCropWidth+'px',height:priveImgHeight+'px'}" class="preview">
                        <img :src="previews.url" :style="previews.img">
                        <div class="rowCenter loadingBox" v-if="showLoading">
                            <i class="el-icon-loading font40 gray666"></i>
                        </div>
                    </div>
                </div>
                <div class="preview-box columnStart">
                    <div class="font16" style="margin-bottom:20px;">{{exampleText}}</div>
                    <div :style="{width:autoCropWidth+'px',height:priveImgHeight+'px'}" class="preview">
                        <img :src="exampleImg" :style="{width:autoCropWidth+'px',height:priveImgHeight+'px'}">
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <slot name="footer">
                <div class="rowCenter">
                    <div ref="complete" style="margin-right:20px;">
                        <el-button type="primary" style="width:90px;height:40px;">{{completeBtnText}}</el-button>
                    </div>
                    <div ref="cancel" >
                        <el-button style="width:90px;height:40px;">{{cancelBtnText}}</el-button>
                    </div>
                </div>
            </slot>
        </template>
    </lm-dialog>
</template>

<script>
import { VueCropper }  from 'vue-cropper'
import LmDialog from '../lm-dialog'
export default {
    name: 'LmImgCropper',
    components:{
        LmDialog
    },
    props:{
        imgSrc:[String,Blob],// 裁剪图片的地址
        info: {
            type:Boolean,
            default:true
        }, // 显示裁剪框的大小信息
        outputSize: {
            type:Number,
            default:1
        }, // 剪切后的图片质量（0.1-1）
        full: {
            type:Boolean,
            default:true
        }, // 输出原图比例截图 props名full
        outputType: String, // 裁剪生成额图片的格式
        canMove: {
            type:Boolean,
            default:true
        },  // 能否拖动图片
        original: Boolean,  // 上传图片是否显示原始宽高
        canMoveBox: {
            type:Boolean,
            default:true
        },  // 能否拖动截图框
        autoCrop: {
            type:Boolean,
            default:true
        }, // 是否默认生成截图框
        autoCropWidth: {
            type:Number,
            default:200
        },//裁剪框宽度
        autoCropHeight: {
            type:Number,
            default:260
        },//裁剪框宽度
        fixedBox: Boolean, // 截图框固定大小
        fileSize:Number,//文件尺寸
        exampleImg:{
            type:String,
            default:require('./exampleImg.svg')
        },//示例图片路径
        maxSize:{
            type:[Number,String],
            default:200
        },//允许的最大尺寸
        title:{
            type:String,
            default:'图片裁剪'
        },//标题
        width:{
            type:[Number,String],
            default:850
        },//宽度
        previewText:{
            type:String,
            default:'预览'
        },//预览文字
        exampleText:{
            type:String,
            default:'示例'
        },//是例文字
        completeBtnText:{
            type:String,
            default:'裁剪完成'
        },//裁剪完成按钮
        cancelBtnText:{
            type:String,
            default:'不裁剪'
        },//裁剪完成按钮
    },
    comments:{
        VueCropper
    },
    data() {
        return {
            previews: {},//图片预览数据
            showLoading:true,//是否显示加载
            priveImgHeight:0,//预览图高度
            priveImgWidth:0,//预览图宽度
        }
    },
    created(){
        console.log(this.imgSrc)
        this.priveImgHeight=this.autoCropWidth*374/264
        this.priveImgWidth=this.autoCropWidth
    },
    methods: {
        // 放大/缩小
        changeScale(num) {
            num = num || 1
            this.$refs.cropper.changeScale(num)
        },
        // 旋转
        rotate(type) {
            //type 0 左旋 1右旋
            type ? this.$refs.cropper.rotateRight() : this.$refs.cropper.rotateLeft()
        },
        // 实时预览函数
        realTime(data) {
            // console.log('realTime')
            // console.log(data)
            this.previews = data
        },
        //绑定监听函数
        openDialog(){
            this.showLoading=true
            // console.log(this.$refs.customDialog)
            let {overy,closeIcon}=this.$refs.customDialog.$refs
            // console.log(overy)
            // console.log(closeIcon)
            return new Promise((resolve,reject)=>{
                this.$refs.complete.addEventListener('click',async ()=>{
                    let file=await this.getCropBlob()
                    this.$emit('cropperSuccess',file)
                    resolve(file)
                },true)
                this.$refs.cancel.addEventListener('click',async ()=>{
                    this.$emit('close')
                    resolve(false)
                },true)
                overy.addEventListener('click',async ()=>{
                    this.$emit('close')
                    resolve(false)
                },true)
                closeIcon.addEventListener('click',async ()=>{
                    this.$emit('close')
                    resolve(false)
                },true)
            })
        },
        //获取裁剪文件信息
        getCropBlob(){
            let {outputType}=this
            return new Promise(resolve => {
                this.$refs.cropper.getCropBlob(data=>{
                    let file = new File([data], `cropper.${outputType.split('/')[1]}`,{type: outputType, lastModified: Date.now()})
                    this.$emit('cropperSuccess',file)
                    resolve(file)
                })
            })
        },
        imgLoad(){
            console.log('imgLoad')
            this.showLoading=false
        },
    }
}
</script>
