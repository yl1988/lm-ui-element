<!--表单项：输入框，选择框，单选按钮,时间选择-->
<template>
    <el-col :span="span" class="lm-form-item-col" ref="lmCol">
        <el-form-item :label="label" :prop="prop" :label-width="lmFormLabelWidth" ref="formItemRef" :required="required" :style="{'margin-bottom':marginBottom || (isEdit ? '22px' : '0')}">
            <div v-if="isEdit" style="text-align:left;">
                <!--输入框-->
                <div v-if="formType==='input'">
                    <el-autocomplete v-if="elAuto"
                                     :value="lmFormValue"
                                     :style="{width:lmFormItemWidth,height:lmFormItemHeight}"
                                     @input="lmInputInput" :type="type"
                                     :placeholder="placeholder" :size="size"
                                     :id="lmRef[0]"  @keyup.native.13="$emit('enter')"
                                     :maxlength="lmInputMaxlength" :minlength="lmInputMinlength"
                                     v-focus-next-on-enter:[focusHiddenData]="lmRef[1]"
                                     @change="v=>this.$emit('change',v)"
                                     :min="min" :max="max"
                                     :autosize="autosize" :fetch-suggestions="inputQuerySearch"
                                     :value-key="valueKey" :placement="placement" :trigger-on-focus="triggerOnFocus"
                                     :disabled="disabled"
                                     :show-word-limit="lmShowWordLimit"

                    >
                        <template slot="append">
                            <slot name="append">
                                <span v-if="appendText">{{appendText}}</span>
                                <i v-if="appendIcon" :class="appendIcon"></i>
                            </slot>
                        </template>
                        <template>
                            <slot name="prefix" class="rowCenter">
                                <i :class="prefixIcon" v-if="prefixIcon"></i>
                            </slot>
                        </template>
                    </el-autocomplete>
                    <el-input v-else
                              :value="lmFormValue"
                              :style="{width:lmFormItemWidth,height:lmFormItemHeight}"
                              @input="lmInputInput" :type="type"
                              :placeholder="placeholder" :size="size"
                              :id="lmRef[0]"  @keyup.native.13="$emit('enter')"
                              :maxlength="lmInputMaxlength" :minlength="lmInputMinlength"
                              v-focus-next-on-enter:[focusHiddenData]="lmRef[1]"
                              @change="v=>this.$emit('change',v)"
                              :min="min" :max="max"
                              :autosize="autosize"
                              :disabled="disabled"
                              :show-word-limit="lmShowWordLimit"

                    >
                        <template slot="append">
                            <slot name="append">
                                <span v-if="appendText">{{appendText}}</span>
                                <i v-if="appendIcon" :class="appendIcon"></i>
                            </slot>
                        </template>
                        <template slot="prefix">
                            <slot name="prefix">
                                <i :class="prefixIcon" v-if="prefixIcon"></i>
                            </slot>
                        </template>
                    </el-input>
                </div>
                <!--下拉框-->
                <el-select v-if="formType==='select'" :value="lmFormValue"
                           @input="lmFormItemChange"
                           :size="size" :class="selectClass"
                           :placeholder="selectPlaceholder"
                           :style="{width:lmFormItemWidth}"
                           :filterable="filterable" :disabled="disabled"
                           v-focus-next-on-enter:[focusHiddenData]="lmRef[1]"
                           :id="lmRef[0]" clearable
                >
                    <el-option :label="o[oName] || o" :value="o[oValue] || index" v-for="(o,index) in lmFormItemData" :key="index"></el-option>
                </el-select>
                <!--多个下拉框-->
                <div v-if="formType==='multiSelect'" class="rowStart">
                    <el-select
                            v-for="(lmItem,index) in lmMultiFormItemData" :key="index"
                            :value="lmFormMultiValues[index]"
                            @input="v=>lmFormMultiItemChange(v,index)"
                            :size="size"
                            :placeholder="lmDateMultiSelectPlaceholder[index]"
                            :style="{width:lmFormItemWidth,margin:multiMargin}"
                            :filterable="filterable" clearable
                            v-focus-next-on-enter:[focusHiddenData]="lmRef[1] ? lmRef[1][index] : undefined"
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
                    <el-radio style="margin-right:20px;color:#888888;" :label="o[oValue] || index" v-for="(o,index) in lmFormItemData" :key="index">{{o[oName] || o}}</el-radio>
                </el-radio-group>
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
                <!--级联选择器-->
                <el-cascader v-if="formType==='cascader'" :value="lmFormValue"
                             :options="lmFormItemData"
                             :style="{width:lmFormItemWidth}"
                             @change="lmFormItemChange"
                             :props="pickerOptions"
                             :filterable="filterable"
                             v-focus-next-on-enter:[focusHiddenData]="lmRef[1]"
                             :id="lmRef[0]"
                ></el-cascader>
                <!--开关-->
                <transition name="fade">
                    <el-switch
                            v-if="formType==='switch' && showSwitch"
                            :value="lmFormValue"
                            :active-color="switchColor[0]"
                            :inactive-color="switchColor[1]"
                            :active-value="switchValue[0]"
                            :inactive-value="switchValue[1]"
                            :active-text="showSwitchText ? lmFormItemData[0] : undefined"
                            :inactive-text="showSwitchText ? lmFormItemData[1] : undefined"
                            @change="lmFormItemChange"
                    ></el-switch>
                </transition>
            </div>
            <div class="lmTexts" v-else>
                <div v-if="formType==='rangeDateTime'">
                    <span>{{lmFormMultiValues[0]}}</span>
                    <slot name="conection">
                        <div class="dateTimeConnection">{{conectionText}}</div>
                    </slot>
                    <span>{{lmFormMultiValues[1]}}</span>
                </div>
                <span v-else-if="formType==='switch'">{{typeof lmFormValue==='number' ? lmFormItemData[lmFormValue] : ''}}</span>
                <span v-else class="textSpan" :style="{margin:multiMargin,...spanStyle}"  v-for="(value,index) in lmTexts" :key="index">{{value}}</span>
            </div>
        </el-form-item>
    </el-col>
</template>
<script>
    import {mapState} from 'vuex'
    import {isNumber} from "../utils/validate"
    export default {
        name: 'LmFormItemCol',
        props:{
            formType:{
                type:String,
                default:'input'
            },//表单类型
            value:{
                type:[String,Number,Object,Array,Date]
            },//值
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
            type:{
                type:String,
                default:'text'
            },//类型
            appendText:String,//尾部文字
            appendIcon:String,//尾部图标
            placeholder:{
                type:[String,Array],
                default:'请输入'
            },//placeholder
            size:String,//尺寸
            labelWidth:String,//表单项文字宽度
            lmFormItemData:{
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
            lmMultiFormItemData:{
                type:Array,
                default:()=>[]
            },//多选数据
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
            prefixIcon:String,//输入框前置图标
            maxlength:[Number,String],//最大长度
            minlength:[Number,String],//最小长度
            disabled:Boolean,//是否禁用
            conectionText:{
                type:String,
                default:'-'
            },//时间范围连接符
            switchColor:{
                type:Array,
                default:()=>['#13ce66','#ff4949']
            },//开关打开关闭颜色
            showSwitchText:Boolean,//是否显示开工文字
            switchIcon:{
                type:Array,
                default:()=>[]
            },//开关打开关闭文字
            switchValue:{
                type:Array,
                default:()=>[1,0]
            },//打开和关闭时的值
            required:Boolean,//是否必须
            min:Number,//最小值
            max:Number,//最大值
            int:Boolean,//是否是整数
            toFixed:Number,//保留的小数
            showSwitch:Boolean,//是否显示允许上报
            autosize:{
                type:[Boolean,Object],
                default:()=>{
                    return { minRows: 2 }
                }
            },//textarea的自动尺寸
            elAuto:Boolean,//是否启用el-autocomplete组件
            valueKey:{
                type:String,
                default:'name'
            },//输入建议对象中用于显示的键名
            placement:String,//菜单弹出位置
            triggerOnFocus:{
                type:Boolean,
                default:true
            },//是否在输入框 focus 时显示建议列表
            inputQueryData:{
                type:Array,
                default:()=>[]
            },///输入框建议数据
            marginBottom:String,//表单项下边距
        },
        data() {
            return {
                lmFormValue:null,//值
                lmFormItemWidth:undefined,//表单行宽度
                lmFormItemHeight:undefined,//表单行高度
                lmFormLabelWidth:undefined,//表单标题宽度
                lmFormMultiValues:[],//选择好的多选数据
                lmFormMultiItemData:[],//选择好的多选数据
                startDatePlaceholder:'',//起始日期日期placeholder
                endDatePlaceholder:'',//结束日期日期placeholder
                lmDateTimePlaceholder:'请选择',//时间范围placeholder
                lmDateMultiSelectPlaceholder:'请选择',//多个下拉框选择placeholder
                selectPlaceholder:'请选择',//下拉框placeholder
                getDefaultData:false,//是否获取默认值（多选框或时间范围）
                lmInputMaxlength:undefined,//输入框最大长度
                lmInputMinlength:undefined,//输入框最小长度
                lmDateTimeFormat:'yyyy-MM-dd',//时间显示格式
                lmDateTimeValueFormat:'yyyy-MM-dd',//时间值格式
                lmFormData:[],///数据
                lmShowWordLimit:false,//是否显示数字统计
            }
        },
        computed: {
            ...mapState(['focusHiddenData']),
            //查看状态下显示的文字
            lmTexts(){
                let {formType,lmFormItemData,oName,oValue,lmMultiFormItemData,appendText,lmFormValue,lmFormMultiValues}=this
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
                if((formType==='select') || (formType==='multiSelect') || formType==='radio'){
                    let lmData=[...lmFormItemData]
                    let forData=formType==='multiSelect' ? [...lmMultiFormItemData]: [lmData]
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
                    // console.log(this.lmTexts)
                }else if(formType==='cascader'){
                    // console.log(lmFormItemData)
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
                }else{
                    texts.push(lmFormValue)
                    texts.push(appendText)
                }
                return texts
            }
        },
        created(){
            let {formType,placeholder,maxlength,type,dateTimeType,dateTimeValueFormat,dateTimeFormat,minlength}=this
            // ['请选择开始时间','请选择结束时间']
            if(formType==='select'){
                placeholder !=='请输入' && (this.selectPlaceholder=placeholder)
            }
            if(formType==='dateTime'){
                placeholder !=='请输入' && (this.lmDateTimePlaceholder=placeholder)
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
            if(formType==='multiSelect'){
                if( placeholder instanceof Array){
                    this.lmDateMultiSelectPlaceholder=placeholder
                }else{
                    this.lmDateMultiSelectPlaceholder=[]
                    for(let i=0;i<this.lmMultiFormItemData.length;i++){
                        this.lmDateMultiSelectPlaceholder.push('请选择')
                    }
                }
            }
            if(formType==='input'){
                maxlength && (this.lmInputMaxlength=Math.abs(parseInt(maxlength)))
                minlength && (this.lmInputMinlength=Math.abs(parseInt(minlength)))
                this.lmShowWordLimit=!!minlength || !!maxlength
                console.log(this.lmShowWordLimit)
                type==='tel' && (this.lmInputMaxlength=11)
                type==='idcard' && (this.lmInputMaxlength=18)
            }

        },
        mounted() {
            let {width,labelWidth,height,value,formType,defaultDateTimeValue}=this
            this.lmFormItemWidth=(typeof width==='number' || isNumber(width)) ? (width+'px') : width
            this.lmFormItemHeight=(typeof height==='number' || isNumber(height)) ? (height+'px') : height
            this.lmFormLabelWidth=(typeof labelWidth==='number' || isNumber(labelWidth)) ? (labelWidth+'px') : labelWidth
            if(value){
                if(formType==='multiSelect' || formType==='rangeDateTime'){
                    this.lmFormMultiValues=value
                }else{
                    this.lmFormValue=value
                }
            }

        },
        methods: {
            // 输入框，改变
            lmInputInput(v){
                let {type,min,max,int,toFixed,maxlength}=this
                if(type==='tel'){
                    //电话
                    this.$emit('input',v.replace(/\D/g,''))
                }else if(type==='number'){
                    // 数字
                    if( typeof min==='number' ){
                        min===0 && (v<min && (v=min))
                    }
                    // typeof min==='number' && (v && (v<min && (v=min)))
                    // typeof max==='number' && (v && (v>max && (v=max)))
                    if(new RegExp(v.toString()).test('.')){
                        v=v.toString().replace(/\.\./g,'.')
                    }
                    toFixed && (v=Number(v).toFixed(toFixed))
                    int && (v=parseInt(v))
                    if(typeof maxlength==='number'){
                        v=v.toString().slice(0,maxlength)
                    }
                    this.$emit('input',Number(v))
                }else if(type==='idcard'){
                    //身份证
                    /x/.test(v) && (v=v.replace('x','X'))
                    this.$emit('input',v)
                }else{
                    v=v.replace(/(^\s*)/g, "")
                    this.$emit('input',v)
                }

            },
            //选择框，单选框，时间，级联选择等改变
            lmFormItemChange(value){
                let valueIndex=(this.lmFormItemData[0] instanceof Object) ? this.lmFormItemData.findIndex(item=>item[this.oValue]===value) : value
                // console.log(valueIndex)
                let itemData=this.lmFormItemData[valueIndex]
                this.$emit('input',value)
                console.log(value,itemData)
                // console.log(this.oValue)
                // console.log(this.lmFormItemData)
                this.$emit('change',{value,itemData})
            },
            //多个选择框改变
            async lmFormMultiItemChange(value,selectIndex){
                console.log(value,selectIndex)
                this.lmFormMultiValues.splice(selectIndex)
                this.lmFormMultiValues.push(value)
                for(let i=0;i<this.lmMultiFormItemData.length;i++){
                    if(i>selectIndex){
                        this.lmMultiFormItemData.splice(i,1,[])
                    }
                }
                if(this.changeFun instanceof Array){
                    (this.changeFun[selectIndex] instanceof Function) && this.changeFun[selectIndex](value)
                }else{
                    // this.changeFun(value)
                    selectIndex<this.lmMultiFormItemData.length-1 && this.changeFun(value)
                }

                let {oValue}=this
                let valueStr=typeof oValue==='string' ? oValue : oValue[selectIndex]
                let valueIndex=(this.lmMultiFormItemData[selectIndex][0] instanceof Object) ? this.lmMultiFormItemData[selectIndex].findIndex(item=>item[valueStr]===value) : value
                let itemData=this.lmMultiFormItemData[selectIndex][valueIndex]
                // console.log(value,itemData)
                this.lmFormMultiItemData.splice(selectIndex)
                this.lmFormMultiItemData.push(itemData)
                this.$emit('input',this.lmFormMultiValues)
                this.$emit('change',{value,itemData:this.lmFormMultiItemData})
            },
            //时间范围改变
            rangeTimeFormItemChange(value,type){
                this.$set(this.lmFormMultiValues,type,value)
                this.$emit('input',this.lmFormMultiValues)
                this.$emit('change',this.lmFormMultiValues)
            },
            //输入框返回建议数据
            inputQuerySearch(queryString,cb){
                let {inputQueryData}=this
                let results = queryString ? inputQueryData.filter(this.createFilter(queryString)) : inputQueryData
                // 调用 callback 返回建议列表的数据
                cb(results)
            },
            //筛选显示的输入框数据
            createFilter(queryString) {
                let {valueKey}=this
                return (restaurant) => {
                    return (restaurant[valueKey].toLowerCase().indexOf(queryString.toLowerCase()) === 0)
                }
            },
        },
        watch:{
            value:function (v) {
                if(this.formType==='multiSelect' || this.formType==='rangeDateTime'){
                    if(v){
                        if(this.getDefaultData){
                            return
                        }
                        // console.log(v)
                        this.lmFormMultiValues=v
                        this.getDefaultData=true
                        // this.getLmTexts(v)
                    }else{
                        this.lmFormMultiValues=[]
                        this.getDefaultData=false
                    }
                }else{
                    // console.log(v)
                    this.lmFormValue=v
                    // this.getLmTexts(v)
                }

            },
        },
    }
</script>

<style lang="scss">
    .lm-form-item-col textarea{
        height:inherit;
    }
    .lm-form-item-col{
        .dateTimeConnection{
            display:inline-block;
            text-align:center;
            padding:0 10px;
        }
    }
    .lmTexts {
        height:40px;
        .textSpan{
            display:inline-block;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            margin-right:10px;

        }
    }
</style>
<style>
    /* 去除input[type=number]浏览器默认的icon显示 */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
    }
    .el-input__inner{
        -moz-appearance:textfield; /* Firefox */
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity 1s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity:0;
    }
    .lm-form-item-col .el-input__prefix{
        display:flex;
        align-items: center;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width:100%;
    }
    .el-select{
        width:100%;
    }
</style>
