<!--导入按钮-->
<template>
    <el-upload
               :action="action"
               :accept="accept"
               :show-file-list="false"
               :headers="{authorization}"
               style="margin:0 10px;"
               :on-success="importSuccess"
    >
        <slot>
            <el-button size="mini" type="primary">{{text}}</el-button>
        </slot>
    </el-upload>
</template>

<script>
    export default {
        name: 'LmImportFile',
        props:{
            action:String,//路径
            accept:{
                type:String,
                default:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
            },//文件类型
            text:{
                type:String,
                default:'导入'
            },//导入文字
        },
        data() {
            return {
                authorization:'',//权限
                fileAction:'',//文件上传路径
                userInfo:{},//用户信息
            }
        },
        computed: {},
        created(){
            let userInfo=this.$globalMethods.getUserInfoFromLocalStorage(this)
            let {access_token}=userInfo
            this.authorization=`Bearer ${access_token}`
        },
        mounted() {
        },
        methods: {
            importSuccess(res,file){
                // console.log(res)
                let {code,data,msg} = res
                if(code!==0) {
                    this.$message.error(msg)
                    return false
                }
                this.$message.success(msg || '导入成功')
                this.$emit('importSuccess')
            }
        },

    }
</script>

<style scoped lang="scss">

</style>
