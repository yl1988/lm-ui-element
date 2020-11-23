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
                    <img class="fileImg" :src="file.blob || (fileBaseUrl ? fileBaseUrl+file.fileId : file.fileId)">
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
                         :action="action"
                         :multiple="limit!==1 || multiple"
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
                    <el-image class="fileImg" :src="file.blob || (fileBaseUrl ? fileBaseUrl+file.fileId : file.fileId)" fit="contain"/>
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
                <img class="fileImg" :src="file.blob || (fileBaseUrl ? fileBaseUrl+file.fileId : file.fileId)">
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
    import {isNumber} from "../../utils/validate"
    import LmImgCropper from '../lm-img-cropper/lm-img-cropper'

    export default {
        name: 'LmUpImg',
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
            action:{
                type:String,
                default:''
            },//上传地址
            fileBaseUrl:String,//文件域名
        },
        components:{
            LmImgCropper
        },
        data() {
            return {
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
            //文件预览
            filePreview(file){
                this.previewImgSrc=fileBaseUrl ? fileBaseUrl+file.fileId : file.fileId
                this.showPreviewDialog=true
            },
            //关闭图片预览弹窗
            cancel(){
                this.showPreviewDialog=false
                this.previewImgSrc=''
            },
        },

    }
</script>
