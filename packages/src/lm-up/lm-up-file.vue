<!--上传文件，并显示进度条-->
<template>
  <div class="upfile-with-progress">
    <el-form-item :label="label || (isEdit ? '上传文件：' : '文件：')" label-position="top" :required="required">
      <div class="rowStart" style="min-height:40px;">
        <div>
          <div v-if="hiddenCamera || getFileMethod">
            <el-upload class="avatar-uploader" :action="action"
                       :multiple="true"
                       :before-upload="beforeUploadWithProgress"
                       :on-success="fileSuccessWithProgress"
                       :accept="fileAccept"
                       :on-progress="fileProgress"
                       :limit="limit"
                       :drag="drag"
                       :show-file-list="false"
                       :on-exceed="handleExceed"
                       :data="otherData"
                       :auto-upload="true"
                       :on-change="fileChange"
                       v-if="isEdit && (typeof limit==='undefined' || (typeof limit==='number' && (fileList.length<limit)))"
                       v-bind="$attrs"
                       v-on="$listeners"
            >
              <div >
                <slot name="chooseFileBtn">
                  <i class="el-icon-upload" v-if="drag"></i>
                  <div class="el-upload__text" v-if="drag">
                    <p>将文件拖到此处，或<em>点击上传</em></p>
                    <span class="red" style="margin-left:10px;" v-if="toastText">{{toastText}}</span>
                  </div>
                  <div class="rowStart" v-else>
                    <el-button type="primary" size="mini">{{btnText}}</el-button>
                    <span class="red" style="margin-left:10px;" v-if="toastText && !toastColumn">{{toastText}}</span>
                  </div>
                </slot>
              </div>
            </el-upload>
          </div>
          <slot name="cameraFile" v-else>
            <div class="rowCenter camera-box" @click="$refs.doccameraoc.doccameraocxv = true" :style="{'margin-bottom':drag ? '12px' : 0,}">
              <slot name="dragCameraBtn" v-if="drag" >
                <div class="rowCenter dragCameraBtn">
                  <el-icon class="el-icon-camera gray666" />
                </div>
              </slot>
              <slot name="cameraBtn" v-else>
                <el-button type="primary" size="mini" icon="el-icon-camera">{{cameraText}}</el-button>
              </slot>
            </div>
          </slot>
        </div>
        <slot name="fileMethod" v-if="!hiddenCamera && !isEdit">
          <el-radio-group  v-model="getFileMethod" style="margin-left:20px;" @change="fileMethodChange"  v-bind="$attrs" v-on="$listeners">
            <div class="fileMethodBox">
              <el-radio :label="1">上传 <el-icon class="el-icon-upload2"/></el-radio>
              <el-radio :label="0">拍照  <el-icon class="el-icon-camera"/></el-radio>
            </div>
          </el-radio-group>
        </slot>
      </div>
      <span class="red" v-if="toastColumn">{{toastText}}</span>
      <div class="fileList" :style="{...fileListStyle}">
        <div class="fileListBox" v-for="(file,index) in fileList" :key="index">
          <slot name="fileView" :index="index" :file="file">
            <el-form ref="fileForm" :model="fileForm" style="width:100%;">
              <div class="rowStart">
                <slot name="filePrev" :fileForm="fileForm" :file="file"></slot>
                <div style="flex:1;">
                  <div class="rowBtween" style="padding-right:20px;">
                    <div class="rowStart">
                      <a class="file blue" :href="file.fileId" :download="file.name || file.fileName">
                        <el-button type="text"> {{file.name || file.fileName}}</el-button>
                      </a>
                      <i class="el-icon-loading yellow" style="margin-left:10px;" v-if="file.loading"></i>
                    </div>
                    <div class="rowEnd">
                      <i class="el-icon-view blue" style="font-size:18px;margin-right:10px;" @click="filePreview(file)" v-if="file.fileType && overViewAccept.indexOf(file.fileType)>-1"></i>
                      <i class="el-icon-delete" style="color:red" @click="removeDescFile(index,file)" v-if="isEdit"></i>
                    </div>
                  </div>
                  <el-progress :percentage="file.percentage" :status="file.percentage===100 ? 'success' : undefined" v-if="file.blob"/>
                </div>
              </div>
            </el-form>
          </slot>
        </div>
      </div>
    </el-form-item>
    <preview-img-dialog v-if="showPreviewDialog" :preview-img-src="imgSrc" @closeDialog="cancel"/>
  </div>
</template>

<script>
import mixin from './mixin'
export default {
  name: 'LmUpFile',
  mixins: [mixin],
  props:{
    label:String,//标题
    btnText:{
      type:String,
      default:'选择文件'
    },//按钮名称
    fileAccept:{
      type:String,
      default:`.jpg,.jpeg,.png,.pdf,.webp'`
    },//文件类型
    toastText:String,//提示文字
    cameraText:{
      type:String,
      default:'点击拍照'
    },//相机按钮文字
    toastColumn:Boolean,//提示文字是否竖排
    fileListStyle:{
      type:Object,
      default:()=>{
        return {}
      }
    },//文件列表样式
  },
  data() {
    return {
      fileForm:{},//预览文件表单
      overViewAccept:['.png','.jpg','.jpeg','.webp','.pdf','.docx'],//可预览的文件类型
    }
  },
  methods: {
    //文件预览
    filePreview(file){
      let {fileId,fileType}=file
      if(fileType){
        if(!/\./.test(fileType)){
          fileType=`.${fileType}`
        }
      }else{
        fileType='.'+fileId.split('.')[1]
      }
      this.$emit('filePreview',file)
      let hasFileOption=this.hasFilePreviewOption(fileId)
      if(!hasFileOption) return
      if(['.jpg','.png','.jpeg','.webp'].indexOf(fileType)>-1){
        this.imgPreview(fileId)
      }
    },
  },

}
</script>
