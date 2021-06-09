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
  if(!(date instanceof Date)){
    return ''
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
  if(!(date instanceof Date)){
    return ''
  }
  return `${date.getFullYear()}${connector}${(date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)}${connector}${date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()} ${date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours()}:${date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes()}:${date.getSeconds() < 10 ? ("0" + date.getSeconds()) : date.getSeconds()}`;
}
/**
 *带对象的数组去重
 */
export const noRepeatArrHasObject=(arr=[],onlyId='id')=>{
  if(!(arr instanceof Array)){
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
export const compressImageFun=async ({file, width, height, quality = 0.8, maxWidth = 1920, maxHeight = 1080,compressSize=200000,maxSize=9000000}) =>{

  //判断类型
  let compressConfig = {
    maxWidth, // 限制最大宽度
    maxHeight, // 限制最大高度，若宽高都限制了，按原图比例最小边为主
    width, // 压缩后图片的宽 宽高若只传一个，则按图片原比例进行压缩
    quality, // 压缩后图片的清晰度，取值0-1，值越小，所绘制出的图像越模糊
    imgType:file.type,//文件后缀格式
  }
  height && (compressConfig.height = height)
  // //console.log(compressConfig)
  let imgFile = file
  // ie和edg不支持new File
  if(!isEdgFun() && !isIEFun()){
    if (file.size > compressSize) {
      //大于200kb，开启图片压缩
      let result = await compressImage(file, compressConfig)
      // //console.log(blob)
      // 判断压缩后图片尺寸是否符合要求，不符合的过滤掉
      imgFile = result.file
      if (imgFile.size > maxSize) {
        return new Promise(resolve => {
          resolve({
            code: 2,
            msg: `压缩后的图片大于${maxSize}`,
            data: imgFile
          })
        })
      }
    }
  }
  return new Promise(resolve => {
    resolve({
      code:1,
      msg:'success',
      data:imgFile
    })
  })
}
// 将base64转换为blob
export function convertBase64UrlToBlob(urlData) {
  let arr = urlData.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

export function dataURLtoFile(dataurl, filename = 'file') {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let suffix = mime.split('/')[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
}

// 压缩图片
export function compressImage(path, config) {
  //console.log(config)
  if((typeof path !=='string' || !(path instanceof Blob)) && path instanceof File){
    path=URL.createObjectURL(path)
  }
  return new Promise((resolve) => {
    // 生成canvas
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    let img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = function() {
      let w = this.width
      let h = this.height
      let scale = w / h
      w = config.width || config.height * scale || w
      h = config.height || config.width / scale || h
      // 最大宽高如有限制时的处理
      w = config.maxWidth && w > config.maxWidth ? config.maxWidth : w
      h = config.maxHeight && h > config.maxHeight ? config.maxHeight : h
      w = Math.min(w, h * scale) || w
      h = Math.min(h, w / scale) || h

      let quality = 0.7 // 默认图片质量为0.7
      // 创建属性节点
      let anw = document.createAttribute('width')
      anw.nodeValue = w
      let anh = document.createAttribute('height')
      anh.nodeValue = h
      canvas.setAttributeNode(anw)
      canvas.setAttributeNode(anh)
      // 将canvas的透明背景设置成白色
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      for(let i = 0; i < imageData.data.length; i += 4) {
        // 当该像素是透明的,则设置成白色
        if(imageData.data[i + 3] === 0) {
          imageData.data[i] = 255
          imageData.data[i + 1] = 255
          imageData.data[i + 2] = 255
          imageData.data[i + 3] = 255
        }
      }
      ctx.putImageData(imageData, 0, 0)
      ctx.drawImage(this, 0, 0, w, h)
      if (config.quality && config.quality <= 1 && config.quality > 0) {
        quality = config.quality
      }
      config.imgType==='image/jpg' && (config.imgType='image/jpeg')
      let base64 = canvas.toDataURL(config.imgType, quality)
      // 在指定图片格式为 image/jpeg 或 image/webp的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。其他参数会被忽略。
      // //console.log(base64.length)
      let blob = convertBase64UrlToBlob(base64)
      let file = dataURLtoFile(base64)
      // 回调函数返回base64的值，也可根据自己的需求返回blob的值
      // //console.log(file)
      resolve({blob,base64,file})
      canvas = null
    }
    img.src = path
  })
}
//保留小数点位数
export const toFixed=(n,fixed)=>~~(Math.pow(10,fixed)*n)/Math.pow(10,fixed)
