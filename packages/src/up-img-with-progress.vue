<!--上传文件，并显示进度条-->
<template>
  <div class="upImgBox">
    <el-form-item :label="label" label-position="top" :required="required">
      <div style="display:flex;" v-if="showEdit">
        <div style="margin-right:20px;flex:1;">
          <div v-if="hiddenCamera || getFileMethod" class="rowStart" style="flex:1;">
            <div class="rowStart upImgListBox">
              <div class="fileOutBox rowCenter" v-for="(file,index) in fileList" :key="index">
                <div class="fileListBox rowCenter" :style="{width:fileImgWidth,height:fileImgHeight}">
                  <slot name="fileView" :index="index" :file="file">
                    <img class="fileImg" :src="file.blob || file.fileId">
                    <div class="circleProgressBk rowCenter" v-if="file.loading">
                      <el-progress :width="progressWidth" type="circle" :percentage="file.percentage" :status="file.percentage===100 ? 'success' : undefined"/>
                    </div>                  
                  </slot>
                </div>
                <slot name="delIcon">
                      <span class="delImgBox rowCenter" @click="removeDescFile(index,file)">
                    <i class="el-icon-plus delIcon"></i>
                  </span>
                </slot>
              </div>
              <el-upload class="avatar-uploader" v-if="typeof limit==='undefined' || (typeof limit==='number' && (fileList.length<limit))"
                         :action="upLoadFileUrl"
                         :multiple="multiple"
                         :before-upload="beforeUploadWithProgress"
                         :on-success="fileSuccessWithProgress"
                         accept="image/*"
                         :on-progress="fileProgress"
                         :drag="drag"
                         :show-file-list="false"
                         :data="otherData"
                         :on-exceed="handleExceed"
                         :limit="limit"
              >
                <div >
                  <slot name="chooseFileBtn">
                    <div :style="{width:fileImgWidth,height:fileImgHeight}">
                      <i class="el-icon-upload" v-if="drag"></i>
                      <div class="el-upload__text" v-if="drag">将文件拖到此处，或<em>点击上传</em></div>
                      <i v-else class="el-icon-plus avatar-uploader-icon" :style="{width:fileImgWidth,height:fileImgHeight,'line-height':fileImgHeight}"></i>
                    </div>
                  </slot>
                </div>
              </el-upload>
            </div>
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
              </slot>
            </div>
          </div>
        </slot>
      </div>
    </el-form-item>
    <lm-img-cropper v-if="!hiddenCropper || headImg" ref="imgCropper" v-show="showCropper" :img-src="cropperImg" @closeDialog="closeCropperDialog" :output-type="cropperImgType" :head-img="headImg" :file="file"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
    import {upLoadFileUrl,fileBaseUrl} from "../utils/const-datas"
    import {isNumber} from "../utils/validate"
    export default {
        name: 'UpImgWithProgress',
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
            showEdit:{
                type:Boolean,
                default:true
            },//是否编辑状态
            drag:{
                type:Boolean,
                default:false
            },//是否可以拖拽上传
            imgWidth:{
                type:[String,Number],
                default:'120px'
            },//图片宽度
            imgHeight:{
                type:[String,Number],
                default:'90px'
            },//图片高度
            otherData:{
                type:Object,
                default:()=>{
                    return {}
                }
            },//上传附带的额外参数
            required:Boolean,//是否必须
            hiddenCamera:{
                type:Boolean,
                default:true
            },//是否隐藏拍照
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
            multiple:{
                type:Boolean,
                default:false
            },//是否多张
            limit:Number,//图片限制张数
        },
        data() {
            return {
                upLoadFileUrl,
                projInfo:{},//项目信息
                strokeWidth:20,//进度条宽度
                fileImgWidth:'120px',//图片宽度
                fileImgHeight:'90px',//图片高度
                progressWidth:126,//进度条宽度
                getFileMethod:1,//获取文件类型
                showCropper:false,//显示裁剪框
                cropperImg:'',//裁剪图片路径
                cropperFile:null,//裁剪的文件
                cropperImgType:'',//裁剪文件后缀
                file:null,//文件
            }
        },
        computed: {
            ...mapState(['isIE'])
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
            //超出文件限制
            handleExceed(files, fileList) {
                let {limit}=this
                this.$message.warning(`当前限制选择 ${limit}个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
            },
            //文件上传之前带进度条
            async beforeUploadWithProgress(file){
                this.fileList.unshift({
                    fileId:file.name,
                    fileName:file.name,
                    fullFileUrl:'javascript:;',
                    uid:file.uid,
                    percentage:0,
                    loading:true,
                    blob:URL.createObjectURL(file)
                })
                this.$emit('beforeUpload')
                let compressFiile=file
                if(/image/.test(file.type)){
                    //图片，压缩
                    compressFiile=await this.$globalMethods.compressImageFun({file})
                }
                return compressFiile
                // if(!isIE){
                //     return compressFiile
                // }
            },
            //文件上传进度带进度条
            fileProgress(event,file){
                let {loaded,total}=event
                let {fileList}=this
                let fileIndex=fileList.findIndex(item=>item.uid===file.uid)
                let percentage=parseInt(loaded/total * 100)
                ;(percentage>99) && (percentage=99)
                fileList[fileIndex].percentage=percentage
            },
            //文件上传成功带进度条
            fileSuccessWithProgress(res,file){
                // console.log(res)
                let {code,data,msg} = res
                if(code!==0) {
                    this.$message.error(msg)
                    return false
                }
                let {fileList}=this
                let fileIndex=fileList.findIndex(item=>item.uid===file.uid)
                let fileObj={
                    ... fileList[fileIndex],
                    fullFileUrl:`${fileBaseUrl}${data.url}`,
                    fileId:data.url,
                    fileName:data.fileName,
                    loading:false,
                    percentage:100
                }
                fileList.splice(fileIndex,1,fileObj)
                let noUpFiles=fileList.filter(item=>/javascript:;/.test(item.fullFileUrl))
                console.log(noUpFiles)
                this.$emit('fileSuccess',{canICommit:!noUpFiles.length,fileList})
            },
            //删除文件（描述文件）
            async removeDescFile(index,{fileName}){
                await this.$confirm(
                    `确定删除${fileName || ''}吗？`,
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                this.fileList.splice(index,1)
                this.$emit('delFile')
            },
            //图片预览
            imgPreview(url){
                this.previewImgSrc=url
                this.showPreviewDialog=true
            },
            //文件预览
            filePreview(file){
                let url=file.fileId
                if(/.pdf/.test(url)){
                    let {href}=this.$router.resolve({
                        name: "FileOverView",
                        query:{
                            url
                        }
                    })
                    window.open(href,'_blank')
                    return
                }
                this.imgPreview(url)

            },
            //图片旋转
            imgRotateFun(type){
                //type 0左旋 1右旋
                console.log(this.$refs.previewImg)
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
            //关闭图片预览弹窗
            cancel(){
                this.showPreviewDialog=false
                this.previewImgWidth=100
                this.imgRotate=0
                this.previewImgSrc=''
            },
        },

    }
</script>

<style scoped lang="scss">
  @import "../../packages/lm-ui-element-style/src/common/mix";
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
  .fileOutBox{
    position: relative;
    margin-right:20px;
    margin-bottom:20px;
    .delImgBox{
      @include positionTopRightSizeIndex($top:-9px,$right:-9px,$width:18px,$height:18px,$z-index:99,$rotate:45deg,$radius:50%);
      background:#ED5A47;
      color:#ffffff;
      cursor:pointer;
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
  .upImgListBox{
    flex-wrap:wrap;
    flex:1;
  }
</style>
<style>
  .upImgBox .avatar-uploader .el-upload {
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background:rgba(250,250,250,1);
  }
  .upImgBox .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .upImgBox .avatar-uploader-icon {
    font-size: 40px;
    color: #8c939d;
    text-align: center;
  }
  .upImgBox .el-progress-circle{
    background:rgba(0,0,0,0.5);
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
  .upImgBox .el-progress__text{
    color:#ffffff;
  }
</style>
