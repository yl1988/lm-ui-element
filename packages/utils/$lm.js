/**
 * 挂在原型链上的方法
 */
import {formatDate} from "./lm-methods";

export default {
    install(Vue) {
        Vue.prototype.$lmMethods = {
            //日期范围开始日期 结束日期配置
            disabledDate(time,type,values){
                let value=values ? values[type] : ''
                let date = new Date(formatDate(value)).getTime()
                let timeDate=new Date(formatDate(time)).getTime()
                if (date) {
                    return type ? (timeDate > date) : (timeDate < date)
                }
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
