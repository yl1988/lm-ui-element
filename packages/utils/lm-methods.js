/**
 * 公共函数模块,用import引用，可对外暴露
  */

// 根据日期时间值获取字符串各是日期
export function formatDate(date, connector = '/') {
    if (typeof date === 'string'){
        date = date.replace(/-/g,'/')
        date = new Date(date)
    }else if(typeof date ==='number'){
        date = new Date(date)
    }
  return `${date.getFullYear()}${connector}${(date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)}${connector}${date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()}`;
}
// 根据日期时间值获取字符串各是日期时间
export function formatDateTime(date, connector = '/') {
    if (typeof date === 'string'){
        date = date.replace(/-/g,'/')
        date = new Date(date)
    }else if(typeof date ==='number'){
        date = new Date(date)
    }
    return `${date.getFullYear()}${connector}${(date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)}${connector}${date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()} ${date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours()}:${date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes()}:${date.getSeconds() < 10 ? ("0" + date.getSeconds()) : date.getSeconds()}`;
}
/**
*带对象的数组去重
 */
export const noRepeatArrHasObject=(arr=[],onlyId='id')=>{
    if(!arr instanceof Array){
        console.error('数据类型错误，请确保第一个参数是数组')
        return
    }
    let resultArr=[]
    let idArr=[]
    for(let i=0;i<arr.length;i++){
        if(!idArr.includes(arr[i][onlyId])){
            idArr.push(arr[i][onlyId])
            resultArr.push(arr[i])
        }
    }
    return resultArr
}

/**
 * 是否ie
 */
export const isIEFun=()=>{
    let userAgent = navigator.userAgent //取得浏览器的userAgent字符串
    let isOldIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 //判断是否IE<11浏览器
    let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1
    return isOldIE || isIE11
}

/**
 是否edg
 */
export const isEdgFun=()=>{
    let userAgent = navigator.userAgent //取得浏览器的userAgent字符串
    return userAgent.indexOf("Edge") > -1
}
//判断文件类型与压缩图片
export const compressImageFun=({file, width, height, quality = 0.8, maxWidth = 1920, maxHeight = 1080,compressSize=200000,maxSize=9000000}) =>{
    return new Promise(async (resolve, reject) => {
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
                imgFile = result.file
                if (imgFile.size > maxSize) {
                    resolve({
                        code:2,
                        msg:`压缩后的图片大于${maxSize}`,
                        data:imgFile
                    })
                }
            }
        }
        resolve({
            code:1,
            msg:'success',
            data:imgFile
        })
    })
}
