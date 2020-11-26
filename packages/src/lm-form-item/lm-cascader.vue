<!--表单项：级联选择-->
<template>
    <el-col :span="span" class="lm-form-item-col" ref="lmCol">
        <el-form-item :label="label" :prop="prop" :label-width="lmFormLabelWidth" ref="formItemRef" :required="required" :style="{'margin-bottom':marginBottom || (isEdit ? '22px' : '0')}">
            <el-cascader :value="lmFormValue" v-if="isEdit"
                         :options="lmFormItemData"
                         :style="{width:lmFormItemWidth}"
                         @change="lmFormItemChange"
                         :props="pickerOptions"
                         :filterable="filterable"
                         :id="lmRef[0]"
            ></el-cascader>
            <div class="lmTexts" v-else>
                <span class="textSpan" :style="{margin:multiMargin,...spanStyle}"  v-for="(value,index) in lmTexts" :key="index">{{value}}</span>
            </div>
        </el-form-item>
    </el-col>
</template>
<script>
    // import {mapState} from 'vuex'
    import {commonProps,commonData,getSize,lmFormItemChangeFun} from "./util";
    export default {
        name: 'LmCascader',
        props:{
            ...commonProps,
            value:{
                type:Array
            },//值
            placeholder:{
                type:String,
                default:'请选择'
            },//placeholder
            lmFormItemData:{
                type:Array,
                default:()=>[]
            },//数据
            oName:{
                type:String,
                default:'name'
            },//选项文字
            oValue:{
                type:String,
                default:'value'
            },//选项值
            filterable:{
                type:Boolean,
                default:true
            },//是否可搜索
            pickerOptions:{
                type:[Object,Array],
                default:()=>{
                    return {}
                }
            },//日期配置，级联配置
        },
        data() {
            return {
                lmFormValue:[],//值
                ...commonData,
            }
        },
        computed: {
            // ...mapState(['focusHiddenData']),
            //查看状态下显示的文字
            lmTexts(){
                let {lmFormItemData,oName,oValue,lmFormValue}=this
                let texts=[]
                let cascaderText=''
                if(!(lmFormValue instanceof Array )|| !lmFormValue.length){
                    return []
                }
                if(lmFormItemData instanceof Array){
                    let parentIndex=lmFormItemData.findIndex(item=>item[oValue]===lmFormValue[0])
                    cascaderText=lmFormItemData[parentIndex] ? lmFormItemData[parentIndex][oName] : ''
                    let childIndex=lmFormItemData[parentIndex] ? lmFormItemData[parentIndex].children.findIndex(item=>item[oValue]===lmFormValue[1]) : undefined
                    if(lmFormItemData[parentIndex]){
                        if(lmFormItemData[parentIndex].children[childIndex]){
                            cascaderText+='/'+lmFormItemData[parentIndex].children[childIndex][oName]
                        }else{
                            cascaderText+=''
                        }
                    }else{
                        cascaderText+=''
                    }
                    texts.push(cascaderText)
                }
                return texts
            }
        },
        mounted() {
            getSize(this.width,this.labelWidth,this.height,this)
            if(this.value instanceof Array){
                this.lmFormValue=value
            }
        },
        methods: {
            //选择框，单选框，时间，级联选择等改变
            lmFormItemChange(value){
                lmFormItemChangeFun(value,this)
            },
        },
        watch:{
            value:function (v) {
                if(v instanceof Array){
                    this.lmFormValue=v
                }
            },
        },
    }
</script>
<style>
    .lm-form-item-col .el-cascader{
        width:100%;
    }
</style>
