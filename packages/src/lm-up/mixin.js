import {compressImageFun} from "../../utils/lm-methods";

export default {
    props:{
        fileList:{
            type:Array,
            default:()=>[]
        },//文件数据
        showEdit:Boolean,//显示编辑状态
        drag:Boolean,//是否可以拖拽上传
        limit:Number,//文件限制数量
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
        action:{
            type:String,
            default:''
        },//上传地址
        fileBaseUrl:String,//文件域名
        showView:Boolean,//是否显示预览图标
    },
    data() {
        return {
            progressWidth:126,//进度条宽度
            getFileMethod:0,//获取文件类型
        }
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
        //文件上传进度带进度条
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
                compressFiile=await compressImageFun({file})
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
        onCameraSuccess(fileInfo){
            console.log(fileInfo)
            let {fileId,fileName,name}=fileInfo
            this.fileList.unshift({
                fullFileUrl:`${fileBaseUrl}${fileId}`,
                fileId,
                loading:false,
                percentage:100,
                fileName,
                name
            })
            this.$emit('fileSuccess',{canICommit:true,fileList:this.fileList})
        },

        //关闭图片预览弹窗
        cancel(){
            this.showPreviewDialog=false
            this.previewImgSrc=''
        },
        //文件方式改变
        fileMethodChange(v){
            this.$emit('fileMethodChange',v)
        }
    },
}
