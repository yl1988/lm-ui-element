
import {formatDate,isIEFun,isEdgFun} from "./global-methods";
import {Alert} from 'element-ui'
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
        }
    }
}
