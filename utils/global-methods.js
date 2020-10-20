// 公共函数模块,用import引用
// 根据日期时间值获取字符串各是日期
import Layout from '../views/layout/layout'
import ChildAppLayout from '../views/child-app-layout/child-app-layout'
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
//字符串日期格式切换
export function switchDateTimeFormat(date,dateTime) {
  let formatFun = dateTime ? formatDateTime : formatDate
  if (typeof date === 'string'){
    date = date.replace(/-/g,'/')
    date = formatFun(new Date(date),'-')
  } else {
    date = formatFun(date,'-')
  }
  // console.log(date)
  return date
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
//获取并筛选菜单
export const getAndFilterMenus=(menus)=> {
    // console.log(menus)
    menus=hanldeChildAppRoute(menus)
    for(let i=0;i<menus.length;i++){
        delete menus[i].component
        if(!parseInt(menus[i].isLeftMenu)){
            menus.splice(i,1)
            i--
        }
        if(menus[i] && menus[i].children){
            getAndFilterMenus(menus[i].children)
        }
    }
    return menus
}
//从本地获取用户信息
export const getUserInfoFromLocalStorage=that=> {
    let userInfo = sessionStorage.getItem("userInfo")
    userInfo = userInfo ? JSON.parse(userInfo) : {}
    that && (that.userInfo = userInfo)
    return userInfo
}
//操作获取子应用路由
export const hanldeChildAppRoute=(routes)=>{
    routes.map(item=>{
        let {isContainer,children}=item
        if(parseInt(isContainer)===2){
            item.isChildApp=true
            if(children instanceof Array && children.length){
                children.map(child=>{
                    child.isChildApp=true
                    return child
                })
                item.children=children
                hanldeChildAppRoute(children)
            }
        }
        return item
    })
    return routes
}
//处理用户路由数据
export const setUserRoutesData=(routes,isChild)=>{
    // console.log(routes)
    !isChild && (routes=hanldeChildAppRoute(routes))
    for(let i=0;i<routes.length;i++){
        let {component,isContainer,routeName,webpackChunkName,keepAlive}=routes[i]
        // console.log(routes[i])
        if(parseInt(isContainer)){
            routes[i].component=['',Layout,ChildAppLayout][isContainer]
            // console.log(routes[i])
        }else{
            if(!routes[i].isChildApp){
                switch(webpackChunkName){
                    case 'Video':
                        routes[i].component= () => import(/* webpackChunkName: "Video" */ `../views${component}`)
                        break
                    case 'EnvCenter':
                        routes[i].component= () => import(/* webpackChunkName: "EnvCenter" */ `../views${component}`)
                        break
                    case 'LabourManage':
                        routes[i].component= () => import(/* webpackChunkName: "LabourManage" */ `../views${component}`)
                        break
                    case 'BaseSet':
                        routes[i].component= () => import(/* webpackChunkName: "BaseSet" */ `../views${component}`)
                        break
                    default:
                        routes[i].component= () => import( `../views${component}`)
                }
            }
        }
        routes[i].name=routeName
        if(keepAlive==='0'){
            routes[i].meta={
                $keepAlive:true
            }
        }
        if((routes[i].children instanceof Array) && routes[i].children.length){
            setUserRoutesData(routes[i].children,isChild)
        }
    }
    return routes
}
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
    let random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, len || 4)
    if (date) random = random + Date.now()
    return random
}
/**
 * 接收对象数据操作
 */
export const optionReceverUserTreeData=tree=>{
    tree.map(item=>{
        let {users,children,deptType,id}=item
        if(deptType){
            item.id='d-'+id
        }
        if(users instanceof Array && users.length){
            users.map(u=>{
                u.id=u.userId
                u.name=u.realName
                return u
            })
        }
        children=children || []
        item.children=[...children,...users]
        if(children.length){
            optionReceverUserTreeData(children)
        }
        return item
    })
    return tree
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
