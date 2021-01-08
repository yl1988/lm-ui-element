<!--表单项：级联选择-->
<template>
    <el-col :span="span" class="lm-form-item-col" ref="lmCol">
        <el-form-item :label="label" :prop="prop" :label-width="lmFormLabelWidth" ref="formItemRef" :required="required" :style="{'margin-bottom':marginBottom || (isEdit ? '22px' : '0')}">
            <el-cascader :value="lmFormValue" v-if="isEdit"
                         :options="options"
                         :style="{width:lmFormItemWidth}"
                         @change="lmFormItemChange"
                         :props="pickerOptions"
                         :filterable="filterable"
                         :id="lmRef[0]"
                         v-bind="$attrs"
                         v-on="$listeners"
            ></el-cascader>
            <div class="lmTexts rowStart" v-else>
                <span class="textSpan" :style="{margin:multiMargin,...spanStyle}" v-if="text">{{text}}</span>
                <div v-if="lmTexts.length">
                    <span class="textSpan" :style="{margin:multiMargin,...spanStyle}"  v-for="(value,index) in lmTexts" :key="index">{{value}}</span>
                </div>
            </div>
        </el-form-item>
    </el-col>
</template>
<script>
    import {lmFormItemChangeFun} from "./util";
    import mixin from './mixin'
    export default {
        name: 'LmCascader',
        mixins:[mixin],
        props:{
            value:{
                type:Array
            },//值
            placeholder:{
                type:String,
                default:'请选择'
            },//placeholder
            options:{
                type:Array,
                default:()=>[]
            },//数据
            filterable:{
                type:Boolean,
                default:true
            },//是否可搜索
            pickerOptions:{
                type:Object,
                default:()=>{
                    return {
                        label:'name'
                    }
                }
            },//日期配置，级联配置
        },
        data() {
            return {
                lmFormValue:[],//值
                text:'',//显示的文字值
                lmTexts:[],////显示的文字值数组
            }
        },
        mounted() {
            if(this.value instanceof Array){
                this.lmFormValue=this.value
                this.optionText(this.value)
            }
        },
        methods: {
            //选择框，单选框，时间，级联选择等改变
            lmFormItemChange(value){
                lmFormItemChangeFun(value,this)
            },
            // 操作文字数据
            optionText(valueList){
                if(!(valueList instanceof Array) || !valueList.length){
                    this.lmTexts=[]
                    this.text=''
                    return
                }
                let {label='name',value='value'}=this.pickerOptions
                for(let i=0;i<valueList.length;i++){
                    if(value[i][value]===valueList[i]){
                        this.lmTexts.push(valueList[label])
                        if(value[i].children instanceof Array && value[i].children.length){
                            this.optionText(value[i].children)
                        }
                        break
                    }
                }
            }
        },
        watch:{
            value:function (v) {
                if(v instanceof Array){
                    this.lmFormValue=v
                    this.optionText(v)
                }
            },
        },
    }
</script>
