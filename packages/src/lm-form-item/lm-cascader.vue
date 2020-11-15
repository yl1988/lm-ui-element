<!--表单项：输入框，选择框，单选按钮,时间选择-->
<template>
    <el-col :span="span" class="lm-form-item-col" ref="lmCol">
        <el-form-item :label="label" :prop="prop" :label-width="lmFormLabelWidth" ref="formItemRef" :required="required" :style="{'margin-bottom':marginBottom || (isEdit ? '22px' : '0')}">
            <div class="editInputBox" v-if="isEdit" style="text-align:left;">
                <!--级联选择器-->
                <el-cascader :value="lmFormValue"
                             :options="lmFormItemData"
                             :style="{width:lmFormItemWidth}"
                             @change="lmFormItemChange"
                             :props="pickerOptions"
                             :filterable="filterable"
                             v-focus-next-on-enter:[focusHiddenData]="lmRef[1]"
                             :id="lmRef[0]"
                ></el-cascader>
            </div>
            <div class="lmTexts" v-else>
                <span class="textSpan" :style="{margin:multiMargin,...spanStyle}"  v-for="(value,index) in lmTexts" :key="index">{{value}}</span>
            </div>
        </el-form-item>
    </el-col>
</template>
<script>
    import {mapState} from 'vuex'
    import {commonProps,commonData,getSize,lmFormItemChangeFun} from "./util";
    export default {
        name: 'LmCascader',
        props:{
            ...commonProps,
            value:{
                type:[String,Number,Object,Array,Date]
            },//值
            placeholder:{
                type:[String,Array],
                default:'请选择'
            },//placeholder
            lmFormItemData:{
                type:Array,
                default:()=>['否','是']
            },//数据
            oName:{
                type:[String,Array],
                default:'name'
            },//选项文字
            oValue:{
                type:[String,Array],
                default:'value'
            },//选项值
            filterable:{
                type:Boolean,
                default:true
            },//是否可搜索
        },
        data() {
            return {
                lmFormValue:null,//值
                ...commonData,
            }
        },
        computed: {
            ...mapState(['focusHiddenData']),
            //查看状态下显示的文字
            lmTexts(){
                let {lmFormItemData,oName,oValue,lmFormValue}=this
                if(!lmFormValue && (lmFormValue!==0)){
                    return []
                }
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
            this.getSize(this.width,this.labelWidth,this.height,this)
            if(this.value){
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
                this.lmFormValue=v
            },
        },
    }
</script>
<style>
    @import "../../lm-ui-element-style/src/lm-form-item/lm-form-item.css";
</style>
