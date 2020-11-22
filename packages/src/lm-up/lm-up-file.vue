<!--上传文件，并显示进度条-->
<template>
  <div class="upfile-with-progress">
    <el-form-item :label="label" label-position="top" :required="!!required">
      <div class="rowStart" v-if="showUpBtn" style="min-height:40px;">
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
        <slot name="fileMethod" v-if="!hiddenCamera && !showEdit">
          <el-radio-group  v-model="getFileMethod" style="margin-left:20px;" @change="fileMethodChange">
            <div class="fileMethodBox">
              <el-radio :label="1">上传 <el-icon class="el-icon-upload2"/></el-radio>
              <el-radio :label="0">拍照  <el-icon class="el-icon-camera"/></el-radio>
            </div>
          </el-radio-group>
        </slot>
      </div>
      <span class="red" v-if="toastColumn">{{toastText}}</span>
    </el-form-item>
    <div class="fileList" :style="{...fileListStyle}">
      <div class="fileListBox" v-for="(file,index) in fileList" :key="index">
        <slot name="fileView" :index="index" :file="file">
          <div class="rowStart" style="width:100%;">
            <el-form ref="fileViewForm" :model="fileViewForm" style="width:100%;">
              <div class="rowStart">
                <slot name="filePrev" :fileViewForm="fileViewForm" :file="file"></slot>
                <div style="flex:1;">
                  <div class="rowBtween">
                    <div class="rowStart">
                      <a class="file blue" :href="fileBaseUrl ? fileBaseUrl+file.fileId : file.fileId" :download="file.name || file.fileName">
                        {{file.name || file.fileName}}
                        <i class="el-icon-document blue" style="margin-left:5px;" v-if="showEdit"></i>
                      </a>
                      <i class="el-icon-loading yellow" style="margin-left:10px;" v-if="file.loading"></i>
                    </div>
                    <div class="rowEnd">
                      <i class="el-icon-view blue" style="font-size:18px;margin-right:10px;" @click="filePreview(file)" v-if="file.fileType && overViewAccept.indexOf(file.fileType)>-1"></i>
                      <i class="el-icon-delete" style="color:red" @click="removeDescFile(index,file)" v-if="!showEdit"></i>
                    </div>
                  </div>
                  <el-progress :percentage="file.percentage" :status="file.percentage===100 ? 'success' : undefined" v-if="file.blob"/>
                </div>
              </div>
            </el-form>
          </div>
        </slot>
      </div>
    </div>
    <preview-img-dialog v-if="showPreviewDialog" :preview-img-src="previewImgSrc" @closeDialog="cancel"/>
  </div>
</template>

<script>
    export default {
        name: 'LmUpFile',
        props:{
            label:{
                type:String,
                default:'上传文件：'
            },//标题
            btnText:{
                type:String,
                default:'选择文件'
            },//按钮名称
            fileList:{
                type:Array,
                default:()=>[]
            },//文件数据
            fileAccept:{
                type:String,
                default:`.jpg,.jpeg,.png`
            },//文件类型
            showEdit:Boolean,//显示编辑状态
            showUpBtn:{
                type:Boolean,
                default:true
            },//是否显示上传按钮
            drag:{
                type:Boolean,
                default:false
            },//是否可以拖拽上传
            imgWidth:{
                type:[String,Number],
                default:'600px'
            },//图片宽度
            imgHeight:{
                type:[String,Number],
                default:'360px'
            },//图片高度
            limit:{
                type:Number,
                default:undefined
            },//图片限制张数
            imgBorder:{
                type:String,
                default:'dashed 1px #eeeeee'
            },//图片边框
            otherData:{
                type:Object,
                default:()=>{
                    return {}
                }
            },//上传附带的额外参数
            required:Boolean,//是否必须
            toastText:String,//提示文字
            cameraText:{
                type:String,
                default:'点击拍照'
            },//相机按钮文字
            hiddenCamera:Boolean,//是否隐藏拍照
            toastColumn:Boolean,//提示文字是否竖排
            checkText:{
                type:String,
                default:'附件'
            },
            fileListStyle:{
                type:Object,
                default:()=>{
                    return {}
                }
            },//文件列表样式
            action:{
                type:String,
                default:''
            },//上传地址
            fileBaseUrl:String,//文件域名
        },
        data() {
            return {
                previewImgSrc:'',//预览图片地址
                showPreviewDialog:false,//是否显示大图
                progressWidth:126,//进度条宽度
                getFileMethod:0,//获取文件类型
                fileViewForm:{},//预览文件表单
                overViewAccept:['.png','.jpg','.jpeg','.webp','.pdf','.docx'],//可预览的文件类型
            }
        },
        computed: {
        },
        methods: {
            //文件获取
            fileChange(file,fileList){
                this.$emit('fileChange',{file,fileList})
            },
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
                    blob:URL.createObjectURL(file),
                    fileType:file.name.split('.')[1]
                })
                this.$emit('beforeUpload')
                return file

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
                console.log(res)
                console.log(file)
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
                    percentage:100,
                    name:file.name,
                    fileSize:data.fileSize,
                    fileType:data.fileType
                }
                fileList.splice(fileIndex,1,fileObj)
                let noUpFiles=fileList.filter(item=>/javascript:;/.test(item.fullFileUrl))
                console.log(noUpFiles)
                this.$emit('fileSuccess',{canICommit:!noUpFiles.length,fileList})
            },
            //删除文件（描述文件）
            async removeDescFile(index,{fileName,name}){
                await this.$confirm(
                    `确定删除 ${name || fileName} 吗？`,
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
                console.log(url)
                this.previewImgSrc=url
                this.showPreviewDialog=true
            },
            //拍照成功
            onCameraSuc(fileInfo){
                console.log(fileInfo)
                let {url,fileName,name}=fileInfo
                this.fileList.unshift({
                    fullFileUrl:`${fileBaseUrl}${url}`,
                    fileId:url,
                    loading:false,
                    percentage:100,
                    fileName,
                    name
                })
                this.$emit('fileSuccess',{canICommit:true,fileList:this.fileList})
            },
            //文件预览
            filePreview(file){
                let {fileBaseUrl}=this
                let {fileId,fileType}=file
                if(fileType){
                    if(!/\./.test(fileType)){
                        fileType=`.${fileType}`
                    }
                }else{
                    fileType='.'+url.split('.')[1]
                }
                if(['.jpg','.png','.jpeg','.webp'].indexOf(fileType)>-1){
                    let url=fileBaseUrl ? fileBaseUrl+fileId : fileId
                    this.imgPreview(url)
                    return
                }
                this.$emit('filePreview',file)
            },
            //关闭图片预览弹窗
            cancel(){
                this.showPreviewDialog=false
                this.previewImgSrc=''
            },
            //文件方式改变
            fileMethodChange(v){
                if(v===0){
                    this.$refs.doccameraoc.doccameraocxv = true
                }
            }
        },

    }
</script>
