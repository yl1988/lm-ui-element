<!--上传文件，并显示进度条-->
<template>
  <div class="upSignImgBox">
    <el-form-item :label="label" label-position="top" :required="required">
      <div style="display:flex;" v-if="showUpBtn">
        <div style="margin-right:20px;">
          <div v-if="hiddenCamera || getFileMethod">
            <el-upload class="avatar-uploader" :action="upLoadFileUrl"
                       :multiple="false"
                       :before-upload="beforeUploadWithProgress"
                       :on-success="fileSuccessWithProgress"
                       accept="image/*"
                       :on-progress="fileProgress"
                       :drag="drag"
                       :show-file-list="false"
                       :data="otherData"
            >
              <div >
                <slot name="chooseFileBtn">
                  <div class="" v-if="fileList.length">
                    <div class="fileListBox rowCenter" v-for="(file,index) in fileList" :key="index" :style="{width:fileImgWidth,height:fileImgHeight}">
                      <slot name="fileView" :index="index" :file="file">
                        <img class="fileImg" :src="file.blob || file.fileId">
                        <div class="circleProgressBk rowCenter" v-if="file.loading">
                          <el-progress :width="progressWidth" type="circle" :percentage="file.percentage" :status="file.percentage===100 ? 'success' : undefined" v-if="!showEdit"></el-progress>
                        </div>
                      </slot>
                    </div>
                  </div>
                  <div v-else :style="{width:fileImgWidth,height:fileImgHeight}">
                    <i class="el-icon-upload" v-if="drag"></i>
                    <div class="el-upload__text" v-if="drag">将文件拖到此处，或<em>点击上传</em></div>
                    <i v-else class="el-icon-plus avatar-uploader-icon" :style="{width:fileImgWidth,height:fileImgHeight,'line-height':fileImgHeight}"></i>
                  </div>
                </slot>
              </div>
            </el-upload>
          </div>
          <slot name="cameraFile" v-else>
            <div class="rowCenter camera-box" @click="onCamera" :style="{width:fileImgWidth,height:fileImgHeight}">
              <div class="" v-if="fileList.length">
                <div class="fileListBox rowCenter" v-for="(file,index) in fileList" :key="index" :style="{width:fileImgWidth,height:fileImgHeight}">
                  <slot name="fileView" :index="index" :file="file">
                    <el-image class="fileImg" :src="file.blob || file.fileId" fit="contain"/>
                  </slot>
                </div>
              </div>
              <slot name="cameraBtn" v-else >
                <el-icon class="el-icon-camera gray666" />
              </slot>
            </div>
          </slot>
        </div>
        <slot name="fileMethod" v-if="!hiddenCamera">
          <el-radio-group  v-model="getFileMethod" :style="{height:fileImgHeight}" @change="fileMethodChange">
            <div class="fileMethodBox columnCenter">
              <p style="margin-bottom:20px;"> <el-radio :label="1">上传 <el-icon class="el-icon-upload2"/></el-radio></p>
              <p> <el-radio :label="0">拍照  <el-icon class="el-icon-camera"/></el-radio></p>
            </div>
          </el-radio-group>
        </slot>
      </div>
        <div v-else>
            <slot name="chooseFileBtn">
                <div class="" v-if="fileList.length">
                    <div class="fileListBox rowCenter" v-for="(file,index) in fileList" :key="index" :style="{width:fileImgWidth,height:fileImgHeight}">
                        <slot name="fileView" :index="index" :file="file">
                            <img class="fileImg" :src="file.blob || file.fileId">
                            <div class="circleProgressBk rowCenter" v-if="file.loading">
                                <el-progress :width="progressWidth" type="circle" :percentage="file.percentage" :status="file.percentage===100 ? 'success' : undefined" v-if="!showEdit"></el-progress>
                            </div>
                        </slot>
                    </div>
                </div>
            </slot>
        </div>
    </el-form-item>
    <lm-img-cropper v-if="!hiddenCropper" ref="imgCropper" v-show="showCropper" :img-src="cropperImg" @closeDialog="closeCropperDialog" :output-type="cropperImgType" :head-img="headImg" :file="file"/>
  </div>
</template>

<script>
    import {upLoadFileUrl,fileBaseUrl} from "../utils/const-datas"
    import {isNumber} from "../utils/validate"
    export default {
        name: 'UpSignImgWithProgress',
        props:{
            label:{
                type:String,
                default:'上传文件'
            },//标题
			type:{
				type:Number,
				default:2,
			},
            fileList:{
                type:Array,
                default:()=>[]
            },//文件数据
            showEdit:Boolean,//显示编辑状态
            showUpBtn:{
                type:Boolean,
                default:true
            },//是否编辑状态
            drag:{
                type:Boolean,
                default:false
            },//是否可以拖拽上传
            imgWidth:{
                type:[String,Number],
                default:'150px'
            },//图片宽度
           imgHeight:{
                type:[String,Number],
                default:'150px'
            },//图片高度
            otherData:{
                type:Object,
                default:()=>{
                    return {}
                }
            },//上传附带的额外参数
            required:Boolean,//是否必须
            hiddenCamera:Boolean,//是否隐藏拍照
            compressSize:{
                type:Object,
                default:()=>{
                    return {
                        width:400
                    }
                }
            },//压缩尺寸
            hiddenCropper:{
                type:Boolean,
                default:true
            },//不裁剪图片
            headImg:Boolean,//是否是头像
        },
        data() {
            return {
                upLoadFileUrl,
                strokeWidth:20,//进度条宽度
                fileImgWidth:'150px',//图片宽度
                fileImgHeight:'150px',//图片高度
                progressWidth:126,//进度条宽度
                getFileMethod:0,//获取文件类型
                showCropper:false,//显示裁剪框
                cropperImg:'',//裁剪图片路径
                cropperFile:null,//裁剪的文件
                cropperImgType:'',//裁剪文件后缀
                file:null,//文件
            }
        },
        computed: {
        },
        created(){
            let {imgWidth,imgHeight}=this
            this.fileImgWidth=(typeof imgWidth==='number' || isNumber(imgWidth)) ? (imgWidth+'px') : imgWidth
            this.fileImgHeight=(typeof imgHeight==='number' || isNumber(imgHeight)) ? (imgHeight+'px') : imgHeight
            if(typeof imgWidth==='number' || isNumber(imgWidth)){
                this.progressWidth=(Number(imgWidth)/2)
            }else{
                if(/px/.test(imgWidth)) {
                    this.progressWidth = (Number(imgWidth.replace('px', '')) / 2)
                }
            }
            if(this.progressWidth<126){
                this.strokeWidth=10
            }
        },
        mounted() {
            // console.log(this.fileList)
        },
        methods: {
            //文件上传之前带进度条
            async beforeUploadWithProgress(file){
                let {compressSize,headImg}=this
                let blob=URL.createObjectURL(file)
                this.file=file
                this.fileList.splice(0,1,{
                    fileId:file.name,
                    fullFileUrl:'javascript:;',
                    uid:file.uid,
                    percentage:0,
                    loading:true,
                    blob
                })
                this.$emit('beforeUpload')
                let cropperFile=''
                if(!this.hiddenCropper){
                    //启用裁剪
                    this.showCropper=true
                    this.cropperImg=blob
                    this.cropperImgType=file.type
                    cropperFile=await this.$refs.imgCropper.openDialog()
                    console.log(cropperFile)
                    if(cropperFile){
                        this.fileList.splice(0,1,{
                            fileId:file.name,
                            fullFileUrl:'javascript:;',
                            uid:file.uid,
                            percentage:0,
                            loading:true,
                            blob:URL.createObjectURL(cropperFile)
                        })
                        if(cropperFile.size>200000){
                            compressSize.width=300
                            delete compressSize.height
                        }
                    }else{
                        if(file.size>200000){
                            if(headImg){
                                this.fileList.splice(0)
                                this.$alert('头像大于200kb,上传失败').then(res=>{

                                })
                                return new Promise((resolve,reject) => {
                                    reject()
                                })
                            }
                        }
                    }
                    this.closeCropperDialog()
                }
                return await this.$globalMethods.compressImageFun({file:cropperFile || file,...compressSize})
            },
            //文件上传进度带进度条
            fileProgress(event){
                let {loaded,total}=event
                let percentage=parseInt(loaded/total * 100)
                ;(percentage>99) && (percentage=99)
                this.fileList[0].percentage=percentage
            },
            //文件上传成功带进度条
            fileSuccessWithProgress(res){
                let {code,data,msg} = res
                if(code!==0) {
                    this.$message.error(msg)
                    return false
                }
                let {fileList}=this
                fileList.splice(0,1,{
                    ... fileList[0],
                    fullFileUrl:`${fileBaseUrl}${data.url}`,
                    fileId:data.url,
                    loading:false,
                    percentage:100
                })
                this.$emit('fileSuccess',{canICommit:true,fileList})
            },
            //拍照
            onCamera(){
                this.$refs.doccameraoc.doccameraocxv = true
            },
            //拍照成功
            onCameraSuc(fileInfo){
                console.log(fileInfo)
                let {url,fileName}=fileInfo
                this.fileList.splice(0,1,{
                    fullFileUrl:`${fileBaseUrl}${url}`,
                    fileId:url,
                    loading:false,
                    percentage:100,
                    fileName
                })
            },
            //文件方式改变
            fileMethodChange(v){
                if(v===0){
                    this.$refs.doccameraoc.doccameraocxv = true
                }
            },
            //关闭图像裁剪弹窗
            closeCropperDialog(){
                this.showCropper=false
                this.cropperImg=''
                this.cropperFile=null
                this.file=null

            },
        },

    }
</script>

<style scoped lang="scss">
  @import "../utils/scss/mix";
  .fileListBox{
    position: relative;
    overflow: hidden;
    .fileImg{
      width:100%;
      z-index:1;
    }
    .circleProgressBk{
      @include positionCenter();
      z-index:10;
      width:100%;
      height:100%;
    }
  }
  .camera-box{
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
    .el-icon-camera{
      font-size:28px;
    }
  }
  .fileMethodBox{
    height:100%;
  }
</style>
<style>
  .upSignImgBox .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .upSignImgBox .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .upSignImgBox .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
  .upSignImgBox .el-progress-circle{
    background:rgba(0,0,0,0.5);
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
  .upSignImgBox .el-progress__text{
    color:#ffffff;
  }
</style>
