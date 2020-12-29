<!--上传图片，并显示进度条-->
<template>
  <div class="upImgBox">
    <el-form-item :label="label || (isEdit ? '上传图片：' : '图片：')" label-position="top" :required="required">
      <div style="display:flex;">
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
                <slot name="delIcon" v-if="isEdit">
                      <span class="delImgBox rowCenter" @click="removeDescFile(index,file)">
                    <i class="el-icon-plus delIcon"></i>
                  </span>
                </slot>
              </div>
              <el-upload class="avatar-uploader" v-if="isEdit && (typeof limit==='undefined' || (typeof limit==='number' && (fileList.length<limit)))"
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
                    <img class="fileImg" :src="file.blob || (fileBaseUrl ? fileBaseUrl+file.fileId : file.fileId)" @click="filePreview"/>
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
    </el-form-item>
    <lm-img-cropper ref="imgCropper" v-show="showCropper" :img-src="cropperImg" @closeDialog="closeCropperDialog" :output-type="cropperImgType" :file="file"/>
    <preview-img-dialog v-if="showPreviewDialog" :preview-img-src="previewImgSrc" @closeDialog="cancel"/>
  </div>
</template>

<script>
    import {isNumber} from "../../utils/lm-validate"
    import mixin from './mixin'
    import LmImgCropper from '../lm-img-cropper/lm-img-cropper'

    export default {
        name: 'LmUpImg',
        mixins:[mixin],
        components:{
            LmImgCropper
        },
        props:{
            label:String,//标题
            type:{
                type:Number,
                default:2,
            },
            imgWidth:{
                type:[String,Number],
                default:'120px'
            },//图片宽度
            imgHeight:{
                type:[String,Number],
                default:'90px'
            },//图片高度
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
            multiple:{
                type:Boolean,
                default:false
            },//是否多张

        },
        data() {
            return {
                strokeWidth:20,//进度条宽度
                fileImgWidth:'120px',//图片宽度
                fileImgHeight:'90px',//图片高度
                showCropper:false,//显示裁剪框
                cropperImg:'',//裁剪图片路径
                cropperFile:null,//裁剪的文件
                cropperImgType:'',//裁剪文件后缀
                file:null,//头像上传时用于裁剪的文件数据
                progressWidth:126,//进度条宽度

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
        methods:{
            // 文件预览
            filePreview(file){
                let {fileId}=file
                typeof this.customPreviewImgMethod==='function' ? this.customPreviewImgMethod(fileId) : this.imgPreview(fileId)
                this.$emit('filePreview',file)
            },
            //关闭图像裁剪弹窗
            closeCropperDialog(){
                this.showCropper=false
                this.cropperImg=''
                this.cropperFile=null
                this.file=null
            },
        }
    }
</script>
