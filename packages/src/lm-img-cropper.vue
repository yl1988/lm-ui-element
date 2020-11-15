<!--图片裁剪-->
<template>
    <CustomDialog width="850" title="图片裁剪" ref="customDialog">
        <template #content>
            <div class="cropper-component">
                <div class="rowCenter" v-if="headImg && file && file.size/1000>200">
                    <strong class="red">*提示：</strong>
                    <span class="gray666">头像要求小于</span>
                    <strong class="red" style="margin:0 5px;"> 200 </strong>
                    <span class="gray666"> kb，当前图片为 </span>
                    <strong class="red" style="margin:0 5px;"> {{file.size/1000}} </strong>
                    <span class="gray666">kb，请裁剪后再上传</span>
                </div>
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
                        <div class="font16" style="margin-bottom:20px;">预览</div>
                        <div :style="{width:autoCropWidth+'px',height:priveImgHeight+'px'}" class="preview">
                            <img :src="previews.url" :style="previews.img">
                            <div class="rowCenter loadingBox" v-if="showLoading">
                                <i class="el-icon-loading font40 gray666"></i>
                            </div>
                        </div>
                    </div>
                    <div class="preview-box columnStart">
                        <div class="font16" style="margin-bottom:20px;">示例</div>
                        <div :style="{width:autoCropWidth+'px',height:priveImgHeight+'px'}" class="preview">
                            <img src="../assets/images/exampleHeadImg.png" :style="{width:autoCropWidth+'px',height:priveImgHeight+'px'}">
                        </div>
                    </div>
                </div>
            </div>
           
        </template>
        <template #footer>
            <div class="rowCenter">
                <div ref="complete" style="margin-right:20px;">
                    <el-button type="primary" style="width:90px;height:40px;">裁剪完成</el-button>
                </div>
                <!--v-if="!(headImg && file && file.size/1000>200)"-->
                <div ref="cancel" >
                    <el-button style="width:90px;height:40px;">不裁剪</el-button>
                </div>
            </div>
        </template>
    </CustomDialog>
</template>

<script>
    export default {
        name: 'cropper',
        props:{
            imgSrc:[String,Blob],// 裁剪图片的地址
            info: {
                type:Boolean,
                default:true
            }, // 裁剪框的大小信息
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
            headImg:Boolean,//是否是头像
            file:File
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
                        this.$emit('closeDialog')
                        resolve(false)
                    },true)
                    overy.addEventListener('click',async ()=>{
                        this.$emit('closeDialog')
                        resolve(false)
                    },true)
                    closeIcon.addEventListener('click',async ()=>{
                        this.$emit('closeDialog')
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

<style lang="scss" scoped>
    @import "../lm-ui-element-style/src/common/mix";
    .cropper-component {
        width: 100%;
        position: relative;
        padding:0 20px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        .btn-box {
            margin: 20px 0;
            .operation-btn {
                width: 30px;
                height: 30px;
                text-align: center;
                background-color: #fff;
                cursor: pointer;
                display: inline-block;
                font-size: 16px;
                color: #666;
                padding: 0;
                margin: 0 10px;
            }
        }
        .info-item {
            .operation-box {
                display: inline-block;
                .cropper {
                    position: relative;
                }
            }
            .preview-box {
                .preview {
                    width: 150px;
                    height: 150px;
                    border: 1px solid #ccc;
                    background-color: #ffffff;
                    margin: 5px;
                    overflow: hidden;
                    position: relative;
                }
            }
        }
    }
    .loadingBox{
        @include positionCenter();
        z-index: 999;
    }

</style>
