<!--表单项：输入框-->
<template>
    <el-col :span="span" class="lm-form-item-col" ref="lmCol">
        <el-form-item :label="label" :prop="prop" :label-width="lmFormLabelWidth" ref="formItemRef" :required="required" :style="{'margin-bottom':marginBottom || (isEdit ? '22px' : '0')}">
            <div v-if="isEdit" style="text-align:left;">
                <el-autocomplete v-if="elAuto"
                                 :value="lmFormValue"
                                 :style="{width:lmFormItemWidth,height:lmFormItemHeight}"
                                 @input="lmInputInput"
                                 :type="type"
                                 :placeholder="placeholder"
                                 :size="size"
                                 :id="lmRef[0]"
                                 @keyup.native.13="$emit('enter')"
                                 :maxlength="lmInputMaxlength"
                                 :minlength="lmInputMinlength"
                                 @change="v=>this.$emit('change',v)"
                                 :min="min" :max="max"
                                 :autosize="autosize"
                                 :fetch-suggestions="inputQuerySearch"
                                 :value-key="valueKey"
                                 :placement="placement"
                                 :trigger-on-focus="triggerOnFocus"
                                 :disabled="disabled"
                                 :show-word-limit="lmShowWordLimit"
                                 @focus="v=>$emit('focus',v)"
                                 @keydown.native="v=>$emit('keydown',v)"
                                 @keyup.native="v=>$emit('keyup',v)"
                                 v-bind="$attrs"
                                 ref="lmInput"
                >
                    <template slot="append">
                        <slot name="append">
                            <span v-if="appendText">{{appendText}}</span>
                            <i v-if="appendIcon"  :class="appendIcon"></i>
                        </slot>
                    </template>
                    <template>
                        <slot name="prefix" class="rowCenter">
                            <i :class="prefixIcon"  v-if="prefixIcon"></i>
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
                          @change="v=>this.$emit('change',v)"
                          :min="min" :max="max"
                          :autosize="autosize"
                          :disabled="disabled"
                          :show-word-limit="lmShowWordLimit"
                          @focus="v=>$emit('focus',v)"
                          @keydown.native="v=>$emit('keydown',v)"
                          @keyup.native="v=>$emit('keyup',v)"
                          v-bind="$attrs"
                          ref="lmInput"

                >
                    <template slot="append">
                        <slot name="append">
                            <span v-if="appendText">{{appendText}}</span>
                            <i v-if="appendIcon"  :class="appendIcon"></i>
                        </slot>
                    </template>
                    <template slot="prefix">
                        <slot name="prefix">
                            <i :class="prefixIcon"  v-if="prefixIcon"></i>
                        </slot>
                    </template>
                </el-input>
            </div>
            <div class="lmTexts" v-else>
                <span :class="type==='textarea' ? 'textareaSpan' : 'textSpan'" :style="{...spanStyle}">{{value}}</span>
                <span class="textSpan" :style="{...spanStyle}" v-if="appendText">{{appendText}}</span>
            </div>
        </el-form-item>
    </el-col>
</template>
<script>

    import mixin from './mixin'

    export default {
        name: 'LmInput',
        mixins:[mixin],
        props:{
            value:{
                type:[String,Number]
            },//值
            type:{
                type:String,
                default:'text'
            },//类型
            appendText:String,//尾部文字
            appendIcon:String,//尾部图标
            placeholder:{
                type:String,
                default:'请输入'
            },//placeholder
            prefixIcon:String,//输入框前置图标
            maxlength:[Number,String],//最大长度
            minlength:[Number,String],//最小长度
            min:Number,//最小值
            max:Number,//最大值
            toFixed:[Number,String],//保留的小数
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
        },
        data() {
            return {
                lmFormValue:null,//值
                lmInputMaxlength:undefined,//输入框最大长度
                lmInputMinlength:undefined,//输入框最小长度
                lmShowWordLimit:false,//是否显示数字统计
            }
        },
        created(){
            let {maxlength,type,minlength}=this
            maxlength && (this.lmInputMaxlength=Math.abs(parseInt(maxlength)))
            minlength && (this.lmInputMinlength=Math.abs(parseInt(minlength)))
            this.lmShowWordLimit=!!minlength || !!maxlength
            // //console.log(this.lmShowWordLimit)
            type==='tel' && (this.lmInputMaxlength=11)
            type==='idcard' && (this.lmInputMaxlength=18)
            type==='number' && (this.lmInputMaxlength=maxlength || 15)
          if(this.lmShowWordLimit){
            this.$nextTick(()=>{
              let lmCol=this.$refs.lmCol.$el
              let wordLimitDom=lmCol.querySelector('.el-input__suffix')
              if(wordLimitDom){
                let inputDom=this.$refs.lmInput.$el.getElementsByTagName('input')
                if(inputDom[0]){
                  inputDom[0].style.paddingRight=wordLimitDom.clientWidth+10+'px'
                }
              }
            })
          }

        },
        mounted() {
            if(this.value || this.value===0){
                this.lmFormValue=this.value
            }
        },
        methods: {
            // 输入框，改变
            lmInputInput(v){
                let {type,min,toFixed,lmInputMaxlength}=this
                toFixed=Number(toFixed)
              lmInputMaxlength=Number(lmInputMaxlength)
                if(type==='tel'){
                    //电话
                    this.$emit('input',v.replace(/\D/g,''))
                }else if(type==='number'){
                    // 数字
                    if( typeof min==='number' ){
                        min===0 && (v<min && (v=min))
                    }
                    if(new RegExp(v.toString()).test('.')){
                        v=v.toString().replace(/\.\./g,'.')
                    }
                  let valueArr=v.toString().split('.')
                  let firstValue=valueArr[0]
                  let lastValue=valueArr[1]
                  if(!(isNaN(toFixed)) && toFixed>=0){
                    toFixed<0 && (toFixed=0)
                    lastValue=lastValue ? lastValue.substring(0,toFixed) : ''
                    v=lastValue ? `${firstValue}.${lastValue}` : firstValue
                  }
                  if(lmInputMaxlength){
                    if(firstValue.length>lmInputMaxlength){
                      let inLengthNum=firstValue.substring(0,lmInputMaxlength)
                      v=lastValue ? (inLengthNum+'.'+lastValue) : inLengthNum
                    }
                  }
                    this.$emit('input',v)
                }else if(type==='idcard'){
                    //身份证
                  v=v.replace(/[^\d|xX]/g,'')
                  ;/x/.test(v) && (v=v.replace(/x/g,'X'))
                  ;/XX/.test(v) && (v=v.replace(/XX/g,'X'))
                  this.$emit('input',v)
                }else{
                    v=v.replace(/(^\s*)/g, "") //sql注入
                    this.$emit('input',v)
                }

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
                this.lmFormValue=v
            },
        },
    }
</script>
