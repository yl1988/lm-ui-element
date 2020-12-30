<!--表单项：选择框，单选按钮,时间选择-->
<template>
    <el-col :span="span" class="lm-form-item-col" ref="lmCol">
        <el-form-item :label="label" :prop="prop" :label-width="lmFormLabelWidth" ref="formItemRef" :required="required" :style="{'margin-bottom':marginBottom || (isEdit ? '22px' : '0')}">
            <div v-if="isEdit" class="lmElSelectBox" style="text-align:left;">
                <!--下拉框-->
                <el-select v-if="formType==='select'" :value="lmFormValue"
                           @input="lmFormItemChange"
                           :size="size" :class="selectClass"
                           :placeholder="selectPlaceholder"
                           :style="{width:lmFormItemWidth}"
                           :filterable="filterable" :disabled="disabled"
                           :id="lmRef[0]" clearable
                >
                    <el-option :label="o[oName] || o" :value="o[oValue] || index" v-for="(o,index) in list" :key="index"></el-option>
                </el-select>
                <!--多个下拉框-->
                <div v-if="formType==='multiSelect'" class="rowStart">
                    <el-select
                            v-for="(lmItem,index) in multiList" :key="index"
                            :value="lmFormMultiValues[index]"
                            @input="v=>lmFormMultiItemChange(v,index)"
                            :size="size"
                            :placeholder="lmDateMultiSelectPlaceholder[index]"
                            :style="{width:lmFormItemWidth,margin:multiMargin}"
                            :filterable="filterable" clearable
                            :id="lmRef[0] ? lmRef[0][index] : undefined"
                    >
                        <el-option
                                :label="oName instanceof Array ? o[oName[index]] : (o[oName] || o)"
                                :value="oValue instanceof Array ? o[oValue[index]] : (o[oValue] || oIndex)"
                                v-for="(o,oIndex) in lmItem" :key="oIndex"
                        ></el-option>
                    </el-select>
                </div>
                <!--单选按钮-->
                <el-radio-group v-if="formType==='radio'"  :value="lmFormValue" @input="lmFormItemChange" :size="size" :style="{width:lmFormItemWidth}" >
                    <el-radio style="margin-right:20px;color:#888888;" :label="o[oValue] || index" v-for="(o,index) in list" :key="index">{{o[oName] || o}}</el-radio>
                </el-radio-group>
            </div>
            <div class="lmTexts" v-else>
                <span class="textSpan" :style="{margin:multiMargin,...spanStyle}"  v-for="(value,index) in lmTexts" :key="index">{{value}}</span>
            </div>
        </el-form-item>
    </el-col>
</template>
<script>
    // import {mapState} from 'vuex'
    import {lmFormItemChangeFun,lmFormItemWatch} from "./util";
    import mixin from './mixin'
    export default {
        name: 'LmSelect',
        mixins:[mixin],
        props:{
            formType:{
                type:String,
                default:'select'
            },//表单类型
            value:{
                type:[String,Number,Array]
            },//值
            placeholder:{
                type:[String,Array],
                default:'请选择'
            },//placeholder
            list:{
                type:Array,
                default:()=>['否','是']
            },//数据
            selectClass:String,//select类名
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
            changeFun:{
                type:[Function,Array],
                default:()=>{}
            },//下拉框改变的函数
            multiMargin:{
                type:String,
                default:'0 10px 0 0'
            },
            multiList:{
                type:Array,
                default:()=>[]
            },//多选数据
        },
        data() {
            return {
                lmFormValue:null,//值
                lmFormMultiValues:[],//选择好的多选数据
                lmFormMultiItemData:[],//选择好的多选数据
                lmDateMultiSelectPlaceholder:'请选择',//多个下拉框选择placeholder
                selectPlaceholder:'请选择',//下拉框选择placeholder
                getDefaultData:false,//是否获取默认值（多选框或时间范围）
                lmFormData:[],///数据
            }
        },
        computed: {
            // ...mapState(['focusHiddenData']),
            //查看状态下显示的文字
            lmTexts(){
                let {formType,list,oName,oValue,multiList,lmFormValue,lmFormMultiValues}=this
                if(formType==='multiSelect'){
                    if(!lmFormMultiValues.length){
                        return []
                    }
                }else{
                    if(!lmFormValue && (lmFormValue!==0)){
                        return []
                    }
                }
                let texts=[]
                let lmData=[...list]
                let forData=formType==='multiSelect' ? [...multiList]: [lmData]
                let forValue=formType==='multiSelect' ? [...lmFormMultiValues] : [lmFormValue]
                for(let i=0;i<forData.length;i++){
                    if(forData[i][0] instanceof Object){
                        //带对象的数组
                        let valueStr=oValue instanceof Array ? oValue[i] : oValue
                        let nameStr=oName instanceof Array ? oName[i] : oName
                        let textArr=forData[i].filter(item=>{
                            let filterValue=forValue[i]
                            typeof item[valueStr]==='number' && (filterValue=Number(forValue[i]))
                            if(typeof item[valueStr]==='string'){
                                typeof filterValue==='number' && (filterValue=filterValue.toString())
                            }
                            return item[valueStr]===filterValue
                        })
                        texts.push(textArr.length ? (textArr[0] ? textArr[0][nameStr] : '') : '')
                    }else{
                        texts.push(forData[i][forValue[i]])
                    }
                }
                return texts
            }
        },
        created(){
            let {formType,placeholder}=this
            // ['请选择开始时间','请选择结束时间']
            if(formType==='select'){
                placeholder !=='请选择' && (this.selectPlaceholder=placeholder)
            }
            if(formType==='multiSelect'){
                if( placeholder instanceof Array){
                    this.lmDateMultiSelectPlaceholder=placeholder
                }else{
                    this.lmDateMultiSelectPlaceholder=[]
                    for(let i=0;i<this.multiList.length;i++){
                        this.lmDateMultiSelectPlaceholder.push('请选择')
                    }
                }
            }
        },
        mounted() {
            if(this.value){
                if(this.formType==='multiSelect'){
                    this.lmFormMultiValues=this.value
                }else{
                    this.lmFormValue=this.value
                }
            }

        },
        methods: {
            //选择框，单选框改变
            lmFormItemChange(value){
                lmFormItemChangeFun(value,this)
            },
            //多个选择框改变
            async lmFormMultiItemChange(value,selectIndex){
                //console.log(value,selectIndex)
                this.lmFormMultiValues.splice(selectIndex)
                this.lmFormMultiValues.push(value)
                for(let i=0;i<this.multiList.length;i++){
                    if(i>selectIndex){
                        this.multiList.splice(i,1,[])
                    }
                }
                if(this.changeFun instanceof Array){
                    (this.changeFun[selectIndex] instanceof Function) && this.changeFun[selectIndex](value)
                }else{
                    // this.changeFun(value)
                    selectIndex<this.multiList.length-1 && this.changeFun(value)
                }

                let {oValue}=this
                let valueStr=typeof oValue==='string' ? oValue : oValue[selectIndex]
                let valueIndex=(this.multiList[selectIndex][0] instanceof Object) ? this.multiList[selectIndex].findIndex(item=>item[valueStr]===value) : value
                let itemData=this.multiList[selectIndex][valueIndex]
                // //console.log(value,itemData)
                this.lmFormMultiItemData.splice(selectIndex)
                this.lmFormMultiItemData.push(itemData)
                this.$emit('input',this.lmFormMultiValues)
                this.$emit('change',{value,itemData:this.lmFormMultiItemData})
            },
        },
        watch:{
            value:function (v) {
                lmFormItemWatch(v,'multiSelect',this)
            },
        },
    }
</script>

