import {isvalidNan,isvalidPhone, isvalidCardNo,isvalidBankNo} from "./lm-validate.js";
// 严重是否是数字
export const validNan = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入"));
  } else if (isvalidNan(value)) {
    callback(new Error("请输入正确的数字"));
  } else {
    callback();
  }
}
// 验证手机号
export const validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
}
// 验证身份证
export const validIDCard = (rule, value, callback,config={}) => {
    let {maxAge,minAge}=config
  if (!value) {
    callback(new Error("请输入身份证号码"));
  } else if (!isvalidCardNo(value)) {
    callback(new Error("请输入正确的18位身份证号码"))
  } else {
      let birthday=value.slice(6,14)
      // //console.log(birthday)
      let year=birthday.slice(0,4)
      let month=birthday.slice(4,6)
      let day=birthday.slice(6)
      // //console.log(year,month,day)
      let birthdayDate=`${year}/${month}/${day}`
      let now=Date.now()
      let birthdayDateTime=new Date(birthdayDate).getTime()
      typeof maxAge!=='number' && (maxAge=81)
      typeof minAge!=='number' && (minAge=15)
      let max=now-365*24*60*60*1000*maxAge //年龄最大80岁
      let min=now-365*24*60*60*1000*minAge //年龄最小15岁
      if(birthdayDateTime>min || birthdayDateTime<max){
          callback(new Error(`请输入年龄在${minAge}岁到${maxAge}岁之间身份证号码`))
          return
      }
    callback()
  }
}
//验证银行卡
export const validBankNo= (rule, value, callback) => {
    if (!value) {
        callback(new Error("请输入银行卡"))
    } else if (!isvalidBankNo(value)) {
        callback(new Error("请输入正确的银行卡号"))
    } else {
        callback()
    }
}
// 两次密码是否一致校验
export const towPassIsAlike = (rule, value, callback,pass,confirmPass) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (confirmPass ? (confirmPass!==pass) : (value !== pass)) {
      //console.log(value)
      //console.log(pass)
      //console.log(confirmPass)
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}
//检查地址是否完善——地址封装组件
export const validAddressInfo=(rule, value, callback,config={})=>{
    let {msg='请完善地址信息',isReset}=config
    // //console.log(value)
    //isReset 是否为重置表单
    if(isReset){
      return
    }
    if(!value || !(value instanceof Object)){
        callback(new Error(msg))
        return
    }
    let {districtId,showStreet,street}=value
    // //console.log(districtId,showStreet,street)
    if(showStreet){
        if(!street){
            callback(new Error(msg))
            return
        }
    }
    // //console.log(districtId)
    if(!districtId){
        callback(new Error(msg))
        return
    }
    callback()
}
//检查多个下拉框
export const validMultiSelect=(rule, value, callback,length,msg='请完善信息')=>{
    if(!value || !(value instanceof Array)){
        callback(new Error(msg))
        return
    }
    if(!length || value.length !==length){
        callback(new Error(msg))
        return
    }
    return new Promise((resolve,reject)=>{
        resolve(true)
    })
}
//检查时间范围
export const validRangeDateTime=(rule, value, callback,msg='请完善信息',stopValid)=>{
   if(stopValid) {
       return new Promise((resolve,reject)=>{
           resolve(true)
       })
   } //停止验证
    if(!value || !(value instanceof Array)){
        callback(new Error(msg))
        return
    }
    if(!value[0]){
        callback(new Error( msg instanceof Array ? msg[0] : msg))
        return
    }
    if(!value[1]){
        callback(new Error( msg instanceof Array ? msg[1] : msg))
        return
    }
    return new Promise((resolve,reject)=>{
        resolve(true)
    })
}


//中文校验
export const validateChinese=(rule, value, callback,config={})=>{
    // //console.log(value)
    let {msgs=['请输入'],min,max,required=true}=config
    if(!(msgs instanceof Array)){
        msgs=['请输入']
    }
    if(!required && !value){
        return new Promise((resolve,reject)=>{
            resolve(true)
        })
    }
    if(!value){
        callback(new Error(msgs[0]))
        return
    }
    if(!(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(value))){
        callback(new Error(msgs[1]))
        return
    }
    if(!(value.length<=max && value.length>=min)){
        callback(new Error(msgs[1]))
        return
    }
    //特殊字符串
    let specialRegStr=new RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/)
    if( specialRegStr.test(value)){
        callback(new Error(msgs[1]))
        return
    }
    // 字母和数字
    if( /[0-9a-z]/i.test(value)){
        callback(new Error(msgs[1]))
        return
    }
    return new Promise((resolve,reject)=>{
        resolve(true)
    })
}
//字母数字校验
export const validateAbcAndNumber=(rule, value, callback,config={})=>{
    let {min,max,msg="请输入数字或者字母",required=true}=config
    if(!required && !value){
        return new Promise((resolve,reject)=>{
            resolve(true)
        })
    }
    if(!value){
        callback(new Error(msg))
        return
    }
    if(!(new RegExp(`^[a-zA-Z0-9]{${min || max},${max || min}}$`).test(value))){
        callback(new Error(msg))
        return
    }
    return new Promise((resolve,reject)=>{
        resolve(true)
    })
}
//企业资质编号校验
export const validateCertificateNo=(rule, value, callback,config={})=>{
    let {msg="企业资质编号为中文开头的13~20位字符串",required=true}=config
    if(!required && !value){
        callback()
    }
    // //console.log(value)
    if(!value){
        callback(new Error(msg))
        return
    }
    if(!(/^[\u4e00-\u9fa5]{1}[0-9]{12}$/.test(value))){
        callback(new Error(msg))
        return
    }
    callback()
}
//经纬度校验
export const validateLngLat=(rule, value, callback,isLgnOrLat)=>{
    let lngMsg='请输入经度,范围:-180.00~180.00(最⼤保留8位⼩数)'
    let latMsg="请输入纬度,范围:-90.00~90.00(最⼤保留8位⼩数)"
    let longReg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/
    let latReg =  /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/
    // //console.log(value)
    if(!value){
        callback(new Error(msg))
        return
    }
   if(isLgnOrLat==='lng'){
       if(!longReg.test(value)){
           callback(new Error(lngMsg))
           return
       }
   }
    if(isLgnOrLat==='lat'){
        if(!latReg.test(value)){
            callback(new Error(latMsg))
            return
        }
    }
    return new Promise((resolve,reject)=>{
        resolve(true)
    })
}
//验证字母和下划线正则
export const validateAbcAnd_=(rule, value, callback,config={})=>{
    let {msg="请输入字母和下划线组成的字符串",required=true}=config
    const reg=/^[a-zA-Z_]+$/
    if(!required && !value){
        callback()
    }
    // //console.log(value)
    if(!value){
        callback(new Error(msg))
        return
    }
    if(!(reg.test(value))){
        callback(new Error(msg))
        return
    }
    callback()
}

