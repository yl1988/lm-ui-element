<!--上传文件，并显示进度条-->
<template>
  <div>
    <el-form-item :label="label" label-position="top">
      <el-upload class="avatar-uploader" :action="`${fileBaseUrl}?projId=${projInfo.projId}`"
                 :show-file-list="false"
                 :multiple="true"
                 :before-upload="(file)=>this.$globalMethods.beforeUploadWithProgress(file,fileList)"
                 :on-success="fileSuccessWithProgress"
                 :accept="fileAccept"
                 :on-progress="(event,file)=>this.$globalMethods.fileProgress(event,file,fileList)"
                 v-if="showUpBtn"
      >
        <el-button type="primary" size="mini">{{btnText}}</el-button>
      </el-upload>
    </el-form-item>
    <div class="fileList">
      <div class="fileListBox" v-for="(file,index) in fileList" :key="index">
        <div class="rowBtween">
          <div class="rowStart">
            <a class="file blue" :href="file.fullFileUrl">
              {{`${file.fileId}`}}
              <i class="el-icon-document blue" style="margin-left:5px;" v-if="showEdit"></i>
            </a>
            <i class="el-icon-loading yellow" style="margin-left:10px;" v-if="file.loading"></i>
          </div>
          <i class="el-icon-delete" style="color:red" @click="$globalMethods.removeDescFile(index,file,fileList)" v-if="!showEdit"></i>
        </div>
        <el-progress :percentage="file.percentage" :status="file.percentage===100 ? 'success' : ''" v-if="!showEdit"></el-progress>
      </div>
    </div>
  </div>

</template>

<script>
  import {mapState} from 'vuex'
  import {upLoadFileUrl,imgAccept} from "../utils/const-datas"
  export default {
    name: 'UpfileWithProgress',
    props:{
      label:{
        type:String,
        default:'上传文件'
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
        default:`.${imgAccept.join(',.')}`
      },//文件类型
      showEdit:Boolean,//显示编辑状态
      showUpBtn:{
        type:Boolean,
        default:true
      },//是否编辑状态
    },
    data() {
      return {
        fileBaseUrl:upLoadFileUrl,
      }
    },
    computed: {
        ...mapState(['projInfo'])
    },
    created(){
      this.$globalMethods.getProjInfo()
    },
    mounted() {
    },
    methods: {
      //文件上传成功
      fileSuccessWithProgress(res,file){
        let {canICommit,fileList}=this.$globalMethods.fileSuccessWithProgress(res,file,this.fileList)
        this.$emit('fileSuccess',{canICommit,fileList})
      },
    },

  }
</script>

<style scoped lang="scss">
  .fileList{
    .fileListBox{
      padding:0 30px;
      margin-bottom:10px;
      p{
        cursor:pointer;
      }
    }
  }
</style>
