import {compressImageFun,} from "../../utils/lm-methods";
import PreviewImgDialog from './preview-img-dialog'
export default {
    components:{
        PreviewImgDialog
    },
    props:{
        fileList:{
            type:Array,
            default:()=>[]
        },//文件数据
        isEdit:{
            type:Boolean,
            default:true
        },//显示编辑状态
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
        headers:Object,//请求头信息
        filePreviewOption:Object,//文件预览配置
        customPreviewFun:Function,//自定义预览函数
    },
    data() {
        return {
            getFileMethod:0,//获取文件类型
            showPreviewDialog:false,//是否显示大图
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
            // //console.log(file)
            let blob=URL.createObjectURL(file)
            if(this.limit===1){
                //单张
                this.fileList.splice(0,1,{
                    fileId:'javascript:;',
                    fileName:file.name,
                    uid:file.uid,
                    percentage:0,
                    loading:true,
                    blob,
                    fileForm:{}
                })
            }else{
                this.fileList.unshift({
                    fileId:'javascript:;',
                    fileName:file.name,
                    uid:file.uid,
                    percentage:0,
                    loading:true,
                    blob
                })
            }

            this.$emit('beforeUpload')
            let compressFile=file
            let cropperFile=''
            if(/image/.test(file.type)){
                //图片，压缩
                if(!this.hiddenCropper && typeof this.hiddenCropper==='boolean'){
                    //启用裁剪
                    this.showCropper=true
                    this.cropperImg=blob
                    this.cropperImgType=file.type
                    cropperFile=await this.$refs.imgCropper.openDialog()
                    //console.log(cropperFile)
                    if(cropperFile){
                        this.fileList.splice(0,1,{
                            fileId:file.name,
                            fileName:file.name,
                            uid:file.uid,
                            percentage:0,
                            loading:true,
                            blob:URL.createObjectURL(cropperFile)
                        })
                    }
                    this.closeCropperDialog()
                }
                compressFile=await compressImageFun({file:cropperFile || file})
            }
            return compressFile
        },
        //文件上传进度带进度条
        fileProgress(event,file){
            //console.log(file)
            let {loaded,total}=event
            let {fileList}=this
            let fileIndex=fileList.findIndex(item=>item.uid===file.uid)
            let percentage=parseInt(loaded/total * 100)
            ;(percentage>99) && (percentage=99)
            fileList[fileIndex].percentage=percentage
        },
        //文件上传成功带进度条
        fileSuccessWithProgress(res,file){
            //console.log(res)
            //console.log(file)
            let {code,data,msg} = res
            if(code!==0) {
                this.$message.error(msg)
                return false
            }
            let {fileList}=this
            let fileIndex=fileList.findIndex(item=>item.uid===file.uid)
            let fileId=(/^http/.test(data.url) || /^\/\//.test(data.url) || !this.fileBaseUr) ? data.url : `${this.fileBaseUrl}${data.url}`
            let fileObj={
                ... fileList[fileIndex],
                fileId,
                fileName:data.fileName,
                loading:false,
                percentage:100,
                name:file.name,
                fileSize:data.fileSize,
                fileType:data.fileType,
            }
            Object.prototype.hasOwnProperty.call(fileObj, 'err') && delete fileObj.err
            fileList.splice(fileIndex,1,fileObj)
            let noUpFiles=fileList.filter(item=>/javascript:;/.test(item.fullurl))
            //console.log(noUpFiles)
            this.$emit('fileSuccess',{canICommit:!noUpFiles.length,fileList})
        },
        //删除文件（描述文件）
        async removeDescFile(index,fileInfo){
            let {fileName,name}=fileInfo
            await this.$confirm(
                `确定删除 ${name || fileName} 吗？`,
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            this.fileList.splice(index,1)
            this.$emit('delFile',fileInfo)
        },
        // 文件出错
        async fileErr(err,file){
            console.log(err)
            let {fileList}=this
            let fileIndex=fileList.findIndex(item=>item.uid===file.uid)
            console.log(fileIndex)
            let fileObj={
                ... fileList[fileIndex],
                err:true,
                loading:false,
            }
            this.fileList.splice(fileIndex,1,fileObj)
            this.$emit('fileErr',{err,file,fileList})
        },
        //图片预览
        imgPreview(url){
            //console.log(url)
            this.imgSrc=url
            this.showPreviewDialog=true
        },
        //关闭图片预览弹窗
        cancel(){
            this.showPreviewDialog=false
            this.imgSrc=''
        },
        //文件方式改变
        fileMethodChange(v){
            this.$emit('fileMethodChange',v)
        },
        //是否启用自定义预览
        hasFilePreviewOption(fileId,file){
            if(this.filePreviewOption instanceof Object){
                let {baseUrl,port}=this.filePreviewOption
                const isProduction = process.env.NODE_ENV === 'production'
                let hostname=window.location.hostname
                port =port ||  window.location.port
                ;!port && isIP(hostname) && (port='8012')
                if(!baseUrl){
                    baseUrl=hostname+port
                }
                /^http:/.test(baseUrl) && (baseUrl=baseUrl.replace('http:',''))
                ;/^https:/.test(baseUrl) && (baseUrl=baseUrl.replace('https:',''))
                fileId = encodeURIComponent(btoa(`http:${baseUrl}${fileId}`))
                fileId = isProduction ? `${baseUrl}${port ? ':' + port : ''}/onlinePreview?url=${fileId}` : `${baseUrl}:8012/onlinePreview?url=${fileId}`
                window.open(fileId,'_blank')
                return fileId
            }
            if(this.customPreviewFun){
                this.customPreviewFun(file)
                return true
            }
            return  false
        }
    },
}
