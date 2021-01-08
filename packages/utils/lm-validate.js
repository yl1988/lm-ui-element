/**
 * 封装isvalidPhone方法
 * 电话号码验证
 * @param str
 * @return {Boolean}
 */
export function isvalidPhone(str) {
  const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
  return reg.test(str)
}
/**
 * 封装isvalidCardNo方法
 * 身份证验证
 * @param idCard
 * @return {Boolean}
 */
export function isvalidCardNo(idCard) {
    //15位和18位身份证号码的正则表达式
    let regIdCard=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    if(regIdCard.test(idCard)){
        if(idCard.length===18){
            let idCardWi=[7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] //将前17位加权因子保存在数组里
            let idCardY=[1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] //这是除以11后，可能产生的11位余数、验证码，也保存成数组
            let idCardWiSum=0 //用来保存前17位各自乖以加权因子后的总和
            for(let i=0;i<17;i++){
                idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i]
            }
            let idCardMod=idCardWiSum%11;//计算出校验码所在数组的位置
            let idCardLast=idCard.substring(17);//得到最后一位身份证号码
            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if(idCardMod===2){
                return idCardLast==="X"||idCardLast==="x"
            }
            //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
            return parseInt(idCardLast)===idCardY[idCardMod]
        }
    }
    return false
}
/**
 * 封装isvalidBankNo方法
 * 简单普通的银行卡校验
 * @param str
 * @return {Boolean}
 */
export function isvalidBankNo(str) {
  const reg = /^([1-9]{1}\d{14,18})$/
  return reg.test(str)
}

/**
 * 封装isvalidNan方法
 * 非数字证验证
 * @param str
 * @return {Boolean}
 */
export function isvalidNan(str){
  return isNaN(str)
}

/**
 * 封装isvalidNo方法
 * 非数字证验证
 * @param str
 * @return {Boolean}
 */
export function isvalidNo(str){
	const reg = /[\u4E00-\u9FA5]/g
  return reg.test(str)
}

/**
 * 封装toThousands方法
 * 金额格式（分隔）
 * @param num
 * @return {String}
 */
export function toThousands(num,isFloat=true) {
  if(isFloat){
    let numStr = num.toString().split(".")
    let int = numStr[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    let dotEnd = numStr[1]
    return int+"."+dotEnd
  }else{
    let int = num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    return int
  }

}

/**
 * 判断日期格式是否正确，正确返回日期
 */
export function isValidDate(dateTime) {
    let yourDate=dateTime
    try {
        (typeof dateTime === 'string') && (dateTime=dateTime.replace(/-/g,'/'))
        dateTime=new Date(dateTime)
        if(dateTime instanceof Date && !isNaN(dateTime.getTime())){
            return {
                dateTime,
                isValid:true,
            }
        }else{
            console.error(`日期 ${yourDate} 格式错误`)
            return {
                isValid:false,
            }
        }
    }catch (err){
        console.error(err)
    }

}

/**
 * 判断是否为数字，整数或者小数
 */
export function isNumber(val) {
    let regPos = /^\d+(\.\d+)?$/ //非负浮点数
    let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ //负浮点数
    return regPos.test(val) || regNeg.test(val)
}

