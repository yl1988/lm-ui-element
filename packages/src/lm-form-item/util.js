

/*
选择框，单选框，时间，级联选择等改变
 */
export function lmFormItemChangeFun(value,that){
    let valueIndex=(that.list[0] instanceof Object) ? that.list.findIndex(item=>item[that.oValue]===value) : value
    // //console.log(valueIndex)
    let itemData=that.list[valueIndex]
    that.$emit('input',value)
    //console.log(value,itemData)
    // //console.log(this.oValue)
    // //console.log(this.list)
    that.$emit('change',{value,itemData})
}
/*
选择框，单选框，时间，级联选择等值发生变化
 */
export function lmFormItemWatch(v,formType,that) {
    if(that.formType===formType){
        if(v){
            if(that.getDefaultData){
                return
            }
            // //console.log(v)
            that.lmFormMultiValues=v
            that.getDefaultData=true
            // this.getLmTexts(v)
        }else{
            that.lmFormMultiValues=[]
            that.getDefaultData=false
        }
    }else{
        // //console.log(v)
        that.lmFormValue=v
        // this.getLmTexts(v)
    }
}
