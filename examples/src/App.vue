
<template>
  <div class="exampleBox">
    <div class="lm-ui-title rowCenter">
      <strong>lm-ui</strong>
    </div>
    <div style="width:200px;">
      <lm-calendar></lm-calendar>
    </div>
    <div class="componentsBox rowAround">
      <div class="componentItemBox columnCenter">
        <lm-canlendar-component style="width:500px;"/>
        <el-button type="text">日历</el-button>
      </div>
      <example-form/>
    </div>
    <div>
      <el-button type="primary" @click="showDialog=true">{{ dialogText || '打开弹窗' }}</el-button>
    </div>
    <lm-dialog v-show="showDialog" @cancel="showDialog=false" @close="closeDialog" @sure="sure" title="标题">
      <span>弹窗内容</span>
    </lm-dialog>
    <el-form v-model="form" :model="form" ref="form" :rules="rules" label-width="120px">
      <lm-up-file v-model="form.fileList"
                  file-prop="fileList"
                  action="/admin/sys-file/upload"
                  :other-data="{ bucketName: 'smart-park'}"
                  :fields="{fileId:'fileUrl',fileType:'type',fileSize:'size'}"
                  ref="fileList"
      />
      <lm-up-img
        v-model="form.imgList"
        file-prop="imgList"
        action="/admin/sys-file/upload"
        :other-data="{ bucketName: 'smart-park'}"
        :fields="{fileId:'fileUrl',fileType:'type',fileSize:'size'}"
        ref="imgList"
      />
      <lm-up-file :fileList="fileList"
                  file-prop="fileList"
                  action="/admin/sys-file/upload"
                  :other-data="{ bucketName: 'smart-park'}"
                  :fields="{fileId:'fileUrl',fileType:'type',fileSize:'size'}"
                  ref="fileList"
      />
      <lm-up-img
        :fileList="imgList"
        file-prop="imgList"
        action="/admin/sys-file/upload"
        :other-data="{ bucketName: 'smart-park'}"
        :fields="{fileId:'fileUrl',fileType:'type',fileSize:'size'}"
        ref="imgList"
      />
      <el-row>
        <el-button @click="save">保存</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import LmCanlendarComponent from '../components/lm-canlendar-component'
import ExampleForm from "../components/example-form";


export default {
  components: {
    ExampleForm,
    LmCanlendarComponent
  },
  data() {
    return {
      showDialog:false,//是否显示弹窗
      dialogText:'',//弹窗文字
      form:{},//
      rules:{
        imgList:[{required:true,message:'请上传图片',trigger:['change','blue']}],
        fileList:[{required:true,message:'请上传文件',trigger:['change','blue']}],
      },
      fileList:[],
      imgList:[]
    }
  },
  computed: {
  },
  mounted() {

    //
    // console.log(this.$lmLoading.show())
    // this.$lmLoading.show()
    // this.$lmLoading.show({color:'#ffffff',size:32})
  },
  methods: {
    async sure(callback){
      await callback()
      this.showDialog=false

    },
    closeDialog(){
      this.showDialog=false

    },
    async save(){
      await this.$refs.form.validate()
      await this.$refs.fileList.validIsEnd()
      await this.$refs.imgList.validIsEnd()
      console.log(this.form)
      console.log(this.fileList)
      console.log(this.imgList)
    },
    beforeUp(data){
      console.log(data)
      console.log(this.form)
    }


  },

}
</script>

<style scoped lang="scss">
.exampleBox{
  padding:20px;
  .lm-ui-title{
    font-size:20px;
    margin-bottom:20px;
  }
  .componentBtnBox{
    padding:20px;
    background:#dddddd;
  }
  .componentsBox{
    flex-wrap:wrap;
    align-items: flex-start;
  }

}
</style>


