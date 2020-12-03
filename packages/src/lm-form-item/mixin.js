import {isNumber} from "../../utils/lm-validate";

export default {
    props:{
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
    },
    data(){
        return{
            lmFormItemWidth:undefined,//表单行宽度
            lmFormItemHeight:undefined,//表单行高度
            lmFormLabelWidth:undefined,//表单标题宽度
        }
    },
    mounted() {
        this.getSize()
    },
    methods:{
        /**
         * 获取尺寸
         */
        getSize() {
            let {width,labelWidth,height}=this
            this.lmFormItemWidth=(typeof width==='number' || isNumber(width)) ? (width+'px') : width
            this.lmFormItemHeight=(typeof height==='number' || isNumber(height)) ? (height+'px') : height
            this.lmFormLabelWidth=(typeof labelWidth==='number' || isNumber(labelWidth)) ? (labelWidth+'px') : labelWidth
        }
    }
}
