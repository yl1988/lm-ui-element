import store from '../store'
import router from '../router'
import {getProjectInfo} from "../api/home-api";
import {reqUserRoutes} from "../api/common";
import {formatDate,getAndFilterMenus,isIEFun,isEdgFun} from "./global-methods";
import {Alert} from 'element-ui'
import {documentTitleAfterText} from "./const-datas";
import {compressImage} from "./compress-image";
import {MessageBox} from 'element-ui'

export default {
    install(Vue) {
        Vue.prototype.$globalMethods = {
            // 防止连点continueTime为多少秒以内不可以使用
            preventContinuePoint(that, continueTime = 2000) {
                return new Promise((resolve, reject) => {
                    let date = new Date()
                    let time = date.getTime()
                    let {lastTime} = that
                    if (lastTime && ((time - lastTime) < continueTime)) {
                        return
                    }
                    lastTime = time
                    that.lastTime = lastTime
                    let timeOut = setTimeout(() => {
                        clearTimeout(timeOut)
                        that.lastTime = 0
                    }, continueTime)
                    resolve(true)
                })
            },
            //获取项目信息
            async getProjInfo(projParams={}){
                let {callback,params,refresh}=projParams
                let projInfo = localStorage.getItem('projInfo')
                let projId=sessionStorage.getItem('projId')
                // console.log(refresh)
                if(projInfo !== 'null' && projInfo && !refresh){
                    projInfo = JSON.parse(projInfo)
                }else{
                    projInfo=await getProjectInfo(projId)
                    console.log(projInfo)
                    if(Object.keys(projInfo).length){
                        //确保projectInfo有项目信息值
                        document.tilte=projInfo.name+documentTitleAfterText
                        localStorage.setItem('projInfo',JSON.stringify(projInfo))
                    }
                }
                if (!(projInfo instanceof Object) || !Object.keys(projInfo).length){
                    console.warn('项目信息缺失，请先完善项目信息')
                    Alert('项目信息缺失，请先完善项目信息', '提示', {
                        confirmButtonText: '知道了',
                    })
                    callback && callback()
                    return
                }
                store.state.projInfo=projInfo
                return projInfo
            },
            //显示合同详情
            showContractDetail(that,contract){
                that.contract=contract
                that.showDetail=true
                that.showList=that.showAddEdit=false
            },
            //显示合同列表
            showContractList(that){
                that.showList=true
                that.showDetail=that.showAddEdit=false
            },
            //显示添加编辑合同
            showContractAddEdit(that,contract={}){
                that.contract=contract
                that.showDetail=that.showList=false
                that.showAddEdit=true
            },
            //通过地址查询经纬度
            getLngLat(AMap, address) {
                if (!address) return
                return new Promise((resolve, reject) => {
                    AMap.plugin('AMap.Geocoder', () => {
                        let geocoder = new AMap.Geocoder({})
                        geocoder.getLocation(address, (status, result) => {
                            // console.log(result)
                            let lngLatArr = []
                            let {geocodes = []} = result
                            geocodes.forEach((item, index) => {
                                let {lng, lat} = item.location
                                lngLatArr.push({lng, lat})
                            })
                            resolve(lngLatArr)
                        })
                    })
                })
            },
            //判断文件类型与压缩图片
            async compressImageFun({file, width, height, quality = 0.8, maxWidth = 1920, maxHeight = 1080,compressSize=200000,maxSize=9000000}) {
                //判断类型
                let compressConfig = {
                    maxWidth, // 限制最大宽度
                    maxHeight, // 限制最大高度，若宽高都限制了，按原图比例最小边为主
                    width, // 压缩后图片的宽 宽高若只传一个，则按图片原比例进行压缩
                    quality, // 压缩后图片的清晰度，取值0-1，值越小，所绘制出的图像越模糊
                    imgType:file.type,//文件后缀格式
                }
                height && (compressConfig.height = height)
                // console.log(compressConfig)
                let imgFile = file
                if(!isEdgFun() && !isIEFun()){
                    if (file.size > compressSize) {
                        //大于200kb，开启图片压缩
                        let result = await compressImage(file, compressConfig)
                        // console.log(blob)
                        // 判断压缩后图片尺寸是否符合要求，不符合的过滤掉
                        if (result.file.size > maxSize) {
                            await Dialog({
                                message: `图片不能大于${maxSize}M`,
                                confirmButtonText: '知道了'
                            })
                        }
                        imgFile = result.file
                    }
                }
                return new Promise((resolve, reject) => {
                    resolve(imgFile)
                })
            },
            //从本地获取用户信息
            getUserInfoFromLocalStorage(that) {
                let userInfo = sessionStorage.getItem("userInfo")
                userInfo = userInfo ? JSON.parse(userInfo) : {}
                that && (that.userInfo = userInfo)
                return userInfo
            },
            //日期范围开始日期 结束日期配置
            disabledDate(time,type,values){
                let value=values ? values[type] : ''
                let date = new Date(formatDate(value)).getTime()
                let timeDate=new Date(formatDate(time)).getTime()
                if (date) {
                    return type ? (timeDate > date) : (timeDate < date)
                }
            },
            //获取下载文件
            async getDowloadFile(url){
                return new Promise((resolve, reject) => {
                    store.state.instance({
                        url,
                        withCredentials:false,
                        responseType:'arraybuffer'
                    }).then(res=>{
                        resolve(res.data)
                    }).catch(err=>{
                        reject(err)
                    })
                })
            },
            //下载zip文件
            downloadZip(data,name="打包下载"){
                // data  // 需要下载打包的路径, 可以是本地相对路径, 也可以是跨域的全路径
                const zip = new JSZip()
                const cache = {}
                const promises = []
                data.forEach(item => {
                    const promise = this.getDowloadFile(item).then(data => { // 下载文件, 并存成ArrayBuffer对象
                        const arr_name = item.split("/")
                        const file_name = arr_name[arr_name.length - 1] // 获取文件名
                        zip.file(file_name, data, { binary: true }) // 逐个添加文件
                        cache[file_name] = data
                    })
                    promises.push(promise)
                })
                // console.log(promises)
                Promise.all(promises).then(() => {
                    zip.generateAsync({type:"blob"}).then(content => { // 生成二进制流
                        saveAs.saveAs(content, `${name}.zip`) // 利用file-saver保存文件
                    })
                })
            },
            //根据类型值获取对应的文字，用于从复杂列表中根据类型（通常为value，id等）获取显示值
            getListName(arr,value,config={}){
                let {valueStr='value',nameStr='name'}=config
                let filterData=arr.filter(item=>{
                    let listValue= item[valueStr]
                    if(typeof item[valueStr]==='number'){
                        value=Number(value)
                    }
                    if(typeof item[valueStr]==='string'){
                        if(typeof value==='number'){
                            value=value.toString()
                        }
                    }
                    return listValue===value
                })[0]
                // console.log(filterData)
                return filterData ? filterData[nameStr] : ''
            },
            // 控制在一个日期范围内不可见
            dateRangeDisabele(time,range=[],config={}){
                let {startEqual,endEqual}=config
                /**
                 *startEqual //开始时间是否可以相等
                 *endEqual //结束时间是可否以相等
                 */
                let [start,end]=range
                let startDate=start ? new Date(formatDate(start)).getTime() : NaN
                let endDate=end ? new Date(formatDate(end)).getTime() : NaN
                let date=new Date(formatDate(time)).getTime()
                if(startEqual && (date===startDate)){
                    return false
                }
                if(endEqual && (date===endDate)){
                    // console.log('endequal')
                    return false
                }
                if(startDate && endDate){
                    return  !(date>startDate && date<endDate)
                }
                if(startDate){
                    return date<startDate
                }
                if(endDate){
                    // console.log(date>=endDate)
                    return date>=endDate
                }
                return false
            },
            //平台跳转
            async goPlatForm(canIUsePlatForm={},projInfo={},callback){
                let {path,value}=canIUsePlatForm
                if(!path){
                    Alert('请先选择平台')
                    return
                }
                let userRoutes=await reqUserRoutes(value)
                // console.log(userRoutes)
                let routeMenuObj={
                    '1':{
                        userRoutes:'userRoutes',
                        menus:'menus',
                    },
                    '2':{
                        userRoutes:'projUserRoutes',
                        menus:'projMenus',
                        id:'projId',
                        info:'projInfo'
                    }
                }
                localStorage.setItem(routeMenuObj[value].userRoutes,JSON.stringify(userRoutes))
                let menus=[]
                // router.app._route.name==='Login' && sessionStorage.setItem('activeForm',value)
                let isProduction = process.env.NODE_ENV === 'production'//是否为生产环境
                ;(router.app._route.name==='Login' || isProduction) && sessionStorage.setItem('activeForm',value)
                //其他平台
                menus=getAndFilterMenus([...userRoutes])
                if(!menus.length){
                    MessageBox.alert('当前账户在目标平台没有任何权限','提示')
                    callback && callback()
                    return
                }
                localStorage.setItem(routeMenuObj[value].menus,JSON.stringify(menus))
                console.log(projInfo)
                if(Object.keys(projInfo).length){
                    sessionStorage.setItem(routeMenuObj[value].id,projInfo.id || projInfo.projId)
                    localStorage.setItem(routeMenuObj[value].info,JSON.stringify(projInfo))
                }
                window.open(path,'_self')
            },
            /**
             动态获取路由tab
             **/
           getDynamicTabRoutes(userRoutes=[],routeNames=[],that){
                function filterRoutes() {
                    let children=[]
                    let routes=[...userRoutes]
                    for(let i=0;i<routeNames.length;i++){
                        let childrenInfo=routes.filter(item=>item.name===routeNames[i])
                        console.log(childrenInfo)
                        children=childrenInfo[0] ? (childrenInfo[0].children || []) : []
                        routes=[...children]
                    }
                    return children
                }
                let children=filterRoutes()
                children=children.sort((a,b)=>a.sort-b.sort)
                let tabs= children.reduce((result,current)=>{
                    let {name,label,path}=current
                    result.push({
                        name,label,path
                    })
                    return result
                },[])
                if(that.$route.name!==tabs[0].name){
                    router.push(tabs[0].path)
                }
                return tabs
            }
        }
    }
}
