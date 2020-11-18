<!--表单项：输入框，选择框，单选按钮,时间选择-->
<template>
    <el-col :span="span" class="lm-form-item-col" ref="lmCol">
        <el-form-item :label="label" :prop="prop" :label-width="lmFormLabelWidth" ref="formItemRef" :required="required" :style="{'margin-bottom':marginBottom || (isEdit ? '22px' : '0')}">
            <div v-if="isEdit" style="text-align:left;">
                <!--日期选择-->
                <el-date-picker v-if="formType==='dateTime'" :type="dateTimeType"
                                :value="lmFormValue" :size="size"
                                :placeholder="lmDateTimePlaceholder"
                                :value-format="lmDateTimeValueFormat"
                                :format="lmDateTimeFormat"
                                :style="{width:lmFormItemWidth}"
                                @input="lmFormItemChange" :picker-options="pickerOptions"
                                :default-value="defaultDateTimeValue"
                                v-focus-next-on-enter:[focusHiddenData]="lmRef[1]"
                                :id="lmRef[0]"
                                :disabled="disabled"
                ></el-date-picker>
                <!--日期范围选择-->
                <div v-if="formType==='rangeDateTime'">
                    <el-date-picker
                            :type="dateTimeType"
                            :placeholder="lmDateTimePlaceholder[0]"
                            :value="lmFormMultiValues[0]"
                            :value-format="lmDateTimeValueFormat"
                            :format="lmDateTimeFormat"
                            :style="{width:lmFormItemWidth}"
                            @input="v=>rangeTimeFormItemChange(v,0)"
                            :picker-options="pickerOptions[0]"
                            :size="size" :disabled="disabled"
                            :default-value="defaultDateTimeValue[0]"
                    ></el-date-picker>
                    <slot name="conection">
                        <div class="dateTimeConnection">{{conectionText}}</div>
                    </slot>
                    <el-date-picker
                            :type="dateTimeType"
                            :placeholder="lmDateTimePlaceholder[1]"
                            :value="lmFormMultiValues[1]"
                            :value-format="lmDateTimeValueFormat"
                            :format="lmDateTimeFormat"
                            :style="{width:lmFormItemWidth}"
                            @input="v=>rangeTimeFormItemChange(v,1)"
                            :picker-options="pickerOptions[1]"
                            :size="size" :disabled="disabled"
                            :default-value="defaultDateTimeValue[1]"
                    ></el-date-picker>
                </div>
            </div>
            <div class="lmTexts" v-else>
                <div v-if="formType==='rangeDateTime'">
                    <span>{{lmFormMultiValues[0]}}</span>
                    <slot name="conection">
                        <div class="dateTimeConnection">{{conectionText}}</div>
                    </slot>
                    <span>{{lmFormMultiValues[1]}}</span>
                </div>
                <span v-else class="textSpan" :style="{...spanStyle}" >{{value}}</span>
            </div>
        </el-form-item>
    </el-col>
</template>
<script>
    // import {mapState} from 'vuex'
    import {commonProps,commonData,getSize,lmFormItemChangeFun,lmFormItemWatch} from "./util";
    export default {
        name: 'LmDateTime',
        props:{
            ...commonProps,
            formType:{
                type:String,
                default:'dateTime'
            },//表单类型
            value:{
                type:[String,Number,Object,Array,Date]
            },//值
            dateTimeType:{
                type:String,
                default:'date'
            },//时间类型
            defaultDateTimeValue:{
                type:[String,Array,Date,Number],
                default:''
            },//时间类型默认值
            dateTimeValueFormat:String,//时间格式
            dateTimeFormat:String,//时间格式
            pickerOptions:{
                type:[Object,Array],
                default:()=>{
                    return {}
                }
            },//日期配置，级联配置
            conectionText:{
                type:String,
                default:'-'
            },//时间范围连接符
        },
        data() {
            return {
                lmFormValue:null,//值
                ...commonData,
                lmFormMultiValues:[],//选择好的多选数据
                startDatePlaceholder:'',//起始日期日期placeholder
                endDatePlaceholder:'',//结束日期日期placeholder
                lmDateTimePlaceholder:'请选择',//时间范围placeholder
                lmDateMultiSelectPlaceholder:'请选择',//多个下拉框选择placeholder
                selectPlaceholder:'请选择',//下拉框placeholder
                getDefaultData:false,//是否获取默认值（多选框或时间范围）
                lmDateTimeFormat:'yyyy-MM-dd',//时间显示格式
                lmDateTimeValueFormat:'yyyy-MM-dd',//时间值格式
            }
        },
        computed: {
            // ...mapState(['focusHiddenData']),
        },
        created(){
            let {formType,placeholder,dateTimeType,dateTimeValueFormat,dateTimeFormat}=this
            if(formType==='dateTime'){
                placeholder !=='请选择' && (this.lmDateTimePlaceholder=placeholder)
                if(dateTimeType==='datetime'){
                    this.lmDateTimeFormat=dateTimeFormat || 'yyyy-MM-dd HH:mm:ss'
                    this.lmDateTimeValueFormat=dateTimeValueFormat ||  'yyyy-MM-dd HH:mm:ss'
                }else{
                    this.lmDateTimeFormat=dateTimeFormat || 'yyyy-MM-dd'
                    this.lmDateTimeValueFormat=dateTimeValueFormat|| 'yyyy-MM-dd'
                }
            }
            if(formType==='rangeDateTime'){
                placeholder instanceof Array ? (this.lmDateTimePlaceholder=placeholder) : (this.lmDateTimePlaceholder=['请选择','请选择'])
            }
        },
        mounted() {
            this.getSize(this.width,this.labelWidth,this.height,this)
            if(this.value){
                if(formType==='rangeDateTime'){
                    this.lmFormMultiValues=value
                }else{
                    this.lmFormValue=value
                }
            }

        },
        methods: {
            //选择框，单选框，时间，级联选择等改变
            lmFormItemChange(value){
                lmFormItemChangeFun(value,this)
            },
            //时间范围改变
            rangeTimeFormItemChange(value,type){
                this.$set(this.lmFormMultiValues,type,value)
                this.$emit('input',this.lmFormMultiValues)
                this.$emit('change',this.lmFormMultiValues)
            },
        },
        watch:{
            value:function (v) {
                lmFormItemWatch(v,'rangeDateTime',this)
            },
        },
    }
</script>
<style>
    @import "../../lm-ui-element-style/src/lm-form-item/lm-form-item.css";
</style>
