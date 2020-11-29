import {isNumber} from "../../uitls/lm-validate"
/**
 * 公用的参数对象
 */
export const commonProps= {
    span:{
        type:Number,
        default:12
    },//位置站位
    label:{
        type:String,
        default:''
    },//标题
    prop:{
        type:String,
        default:''
    },//验证属性值
    width:[Number,String],//宽度
    height:[Number,String],//宽度
    size:String,//尺寸
    labelWidth:String,//表单项文字宽度
    isEdit:{
        type:Boolean,
        default:true
    },//是否是编辑状态
    spanStyle:{
        type:Object,
        default:()=>{
            return {}
        }
    },//查看状态下样式
    lmRef:{
        type:Array,
        default:()=>[]
    },//标志以及下一次跳转标志
    disabled:Boolean,//是否禁用
    required:Boolean,//是否必须
    marginBottom:String,//表单项下边距
}//
/*
公共data数据
 */
export const commonData={
    lmFormItemWidth:undefined,//表单行宽度
    lmFormItemHeight:undefined,//表单行高度
    lmFormLabelWidth:undefined,//表单标题宽度
}

/**
 * 获取尺寸
 */
export function getSize(width,labelWidth,height,that) {
    that.lmFormItemWidth=(typeof width==='number' || isNumber(width)) ? (width+'px') : width
    that.lmFormItemHeight=(typeof height==='number' || isNumber(height)) ? (height+'px') : height
    that.lmFormLabelWidth=(typeof labelWidth==='number' || isNumber(labelWidth)) ? (labelWidth+'px') : labelWidth
}
/*
选择框，单选框，时间，级联选择等改变
 */
export function lmFormItemChangeFun(value,that){
    let valueIndex=(that.lmFormItemData[0] instanceof Object) ? that.lmFormItemData.findIndex(item=>item[that.oValue]===value) : value
    // console.log(valueIndex)
    let itemData=that.lmFormItemData[valueIndex]
    that.$emit('input',value)
    console.log(value,itemData)
    // console.log(this.oValue)
    // console.log(this.lmFormItemData)
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
            // console.log(v)
            that.lmFormMultiValues=v
            that.getDefaultData=true
            // this.getLmTexts(v)
        }else{
            that.lmFormMultiValues=[]
            that.getDefaultData=false
        }
    }else{
        // console.log(v)
        that.lmFormValue=v
        // this.getLmTexts(v)
    }
}
