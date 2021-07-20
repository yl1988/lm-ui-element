export default function ({url, method = 'GET', data = {}, params = {}, type = 'json', headers = {}, userQs}){

  return new Promise((resolve,reject)=>{
    method=method.toUpperCase()
    // params 里的数据并且以一定的规则拼接到 url 后
    let paramsDataArr = []
    for(let key in params) {  // Object.keys.forEach
      paramsDataArr.push(''.concat(key, '=', params[key]))
    }
    let paramsData = paramsDataArr.join('&') //eg: a=b&c=d&e=f
    // 连接本身有参数的时候拼接params,如果本身没有参数拼接 ?params
    paramsDataArr.length && (url += (location.search.length ? '&' : '?') + paramsData)
    // 实例化 XMLHttpRequest 对象,并进行一些设置
    let xhr = new XMLHttpRequest()
    xhr.responseType = type
    xhr.withCredentials = false  //指示是否应使用Cookie或授权标头等凭据进行跨站点访问控制请求。
    //  处理请求回调
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4) {
        if(xhr.status === 200 || xhr.status === 304) {
          console.log(xhr.response)
          resolve(xhr.response)
        } else {
          reject(xhr.statusText)
        }
      }
    }
    xhr.open(method, url, true) // true 代表是异步请求

    !headers['Content-Type'] && (headers['Content-Type']='application/json')
    for(let i in headers){
      xhr.setRequestHeader(i, headers[i])
    }
    //  发送请求
    if(method==='POST' || method==='PUT'){
      userQs && (data=qsStringfy(data))
      xhr.send(data)
    }else{
      xhr.send( null)
    }
  })
}
function qsStringfy(obj){
  if(!(obj instanceof Object)){
    console.error('请传入对象')
    return
  }
  let str=''
  for(let i in obj){
    str+=(obj[i] instanceof Object) ? qsStringfy(obj[i]) : `${i}=${obj[i]}&`
  }
  return str.substring(0,str.length-1)
}
