#龙马UI lm-ui
## 安装
首先创建项目，使用vue-cli3创建项目
````javascript
vue create lm-ui-element-test
````
创建好后，进入项目文件夹lm-ui-element-test，先安装element-ui，然后安装lm-ui-element

安装element-ui
````npm
npm i element-ui
````

使用npm安装
````npm
npm i lm-ui-element
````
使用cnpm安装
````npm
cnpm i lm-ui-element
````
main.js
````javascript
import Vue from 'vue'
import App from './App.vue'
/**
* 除了lm-calendar组件，其他组件均依赖element-ui，所以请先引入element-ui
*/
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import LmUIElement from 'lm-ui-element'  //引入lm-ui-element
import 'lm-ui-element/lib/lm-ui-element-style/index.css' //引入样式文件
Vue.use(ElementUi)
Vue.use(LmUIElement)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

````
## 使用
安装好后可直接在项目中使用
App.vue
````html
<template>
    <div class="exampleBox">
        <div class="lm-ui-title rowCenter">
            <strong>龙马-ui</strong>
        </div>
        <div class="componentsBox">
            <div class="componentItemBox columnCenter">
                <lm-calendar></lm-calendar>
                <el-button type="text">日历</el-button>
            </div>
            <el-form width="1000">
                <el-row>
                    <lm-input></lm-input>
                    <lm-select></lm-select>
                </el-row>
                <el-row>
                    <lm-date-time></lm-date-time>
                    <lm-cascader></lm-cascader>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
````
## 自定义主题
lm-ui-element基于element-ui，除了不依赖element-ui的组件，其他组件的主题，请直接使用element-ui的主题设定方式

## 组件
### lm-calendar 日历
日历组件，提供日历基础显示功能以及数据插入功能(有数据标志)，日期点击，月份切换等

#### <strong style="font-size:14px;color:#333333">基础用法</strong>

````html
<lm-calendar></lm-calendar>
````

#### <strong style="font-size:14px;color:#333333">Attributes</strong>

参数	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
initDate|初始化日期值|String / Date / Number|--|new Date()
width|日历宽度|String / Number| --|100%
height|日历高度|String/ Number| --|100%
calendarClass|日历自定义样式类名|String|--|--
 titleClass|年月标题自定义样式类名|String|--|--
titleH|年月标题高度|String / Number|--|35px
titleBk|年月标题颜色|String|--|#ffffff
bodyBk|日历体背景|String|--|#ffffff
bodyClass|日历体自定义样式类名|String|--|--
dateDefaultClass|自定义日期默认类名|String|--|--
dateActivDateClass|自定义日期选中类名|String|--|--
dateDisabledDateClass|自定义日期不可用类名|String|--|--
 titleDateConnector|标题日期连接符|String|--|--
insertData|插入的数据|Array|--|[]
weeks|日历头部周数据|Array|--|['日','一','二','三','四','五','六']
 dateProp|自定义表示时间的字段|String|--|--
calenCellClass|日历单元格自定义样式|String|--|--
firstRowCellClass|日历第一行单元格自定义样式|String|--|--
cellBorder|是否有边框|Boolean|--|--
cellTitleHeight|日历标题高度|String / Number|--|40px
cellTitleColor|日历标题颜色|String|--|#333333
options|配置|Object|--| { range:[] }


#### <strong style="font-size:14px;color:#333333">Slots</strong>

name| 说明 
:---|:---:
calendarTitle|日历顶部标题内容
calendarHead|日历头内容
changeMonthBtn|月份切换按钮
weeks|日历头部周数据
day|日期
haveDataTag|有数据标志

#### <strong style="font-size:14px;color:#333333">Events</strong>
事件名	| 说明 |	 回调参数
:---|:---:|:---
getChooseDate|选择日期|(date:String)
monthChange|月份改变|(date:String)

#### <strong style="font-size:14px;color:#333333">使用示例</strong>
````html
<template>
    <div class="canlendarExample">
        <lm-calendar ref="canlendar" @getChooseDate="checkDate=>date=checkDate" :insert-data="insertData" :options="{range:['',new Date()]}" date-prop="hasDataDate" @monthChange="v=>date=v">
            <template #weeks>
                <div class="weeksBox rowCenter">
                    <div class="weekItem rowCenter font16" v-for="(week,index) in weeks" :key="week">
                        <span class="week">{{week}}</span>
                        <span class="rightLine verticalLine"></span>
                        <span class="leftLine verticalLine" v-if="index===0"></span>
                    </div>
                </div>
            </template>
            <template #calendarHead="{currentYear,currentMonth,changeMonth}">
                <div class="canlendar-top-box">
                    <div class="canlendar-top-inner-box rowCenter">
                        <div class="rowCenter year-back-box">
                            <span class="changeMonth rowCenter el-icon-caret-left" @click="changeMonth(0)"></span>
                            <strong style="margin:0 20px;">{{date}}</strong>
                            <span class="changeMonth rowCenter el-icon-caret-right" @click="changeMonth(1)"></span>
                        </div>
                        <span class="violet back-today font14 rowCenter" @click="changeMonth(2)">返回今天</span>
                    </div>
                </div>
            </template>
            <template #haveDataTag="{day}">
                <div class="haveDataTag rowCenter font12 violet"></div>
            </template>
            <template #day="{day,index}">
                <div class="dayBox columnStart" :class="[day.dateClass,index%7===0 ? 'dayBorderLeft' : '',index<7 ? 'dayBorderTop' : '']">
                    <span class="font30 daySpan">{{day.day}}</span>
                    <div class="otherDataBox font20 rowBtween">
                        <i class="iconfont icon-weather-qing" :style="{color:'#333333'}"></i>
                        <i class="iconfont icon-weather-duoyun" :style="{color:'#333333'}"></i>
                        <i class="iconfont icon-weather-xiaoyu" :style="{color:'#333333'}"></i>
                        <i class="iconfont icon-weather-yin" :style="{color:'#333333'}"></i>
                    </div>
                </div>
            </template>
        </lm-calendar>
    </div>

</template>
<script>
    import {formatDate} from "lm-ui-element/lib/utils/global-methods";

    export default {
        name: "LmCanlendarComponent",
        components: {},
        props: {},
        data() {
            return {
                insertData: [],//插入的数据
                date:'',//日期
                changeMonth:null,//月份改变函数
                weeks:['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
            }
        },
        computed: {},
        created() {
            this.date=formatDate(new Date(),'-')
            let roundNumArr=[]
            for(let i=0;i<10;i++){
                let roundNum=Math.floor(Math.random()*(28-1+1)+1)
                roundNum<0 && (roundNum='0'+roundNum)
                roundNumArr.push(roundNum)
            }
            let year=new Date().getFullYear()
            let month=new Date().getMonth()+1
            month<0 && (month='0'+month)
            for(let i=0;i<roundNumArr.length;i++){
                this.insertData.push({
                    hasDataDate:`${year}-${month}-${roundNumArr[i]}`
                })
            }

        },
        mounted() {

        },
        methods: {
            //月份改变
            getMonthChange({changeMonth,currentYear,currentMonth,type}){
                //console.log(currentYear,currentMonth)
                let currentMonthArr=[currentMonth-1,currentMonth+1]
                this.$sunRainMethods.getMonthChange(changeMonth,type,{currentYear,currentMonth:currentMonthArr[type],that:this})
            },
        },

        watch: {}
    }
</script>
<style lang="scss" scoped type="text/scss">
    @import "lm-ui-element/lm-ui-element-style/src/common/mix";
    .canlendarExample{
        .customCalendarHeadBox{
            background:#ffffff;
            padding:20px;
            border-bottom:solid 1px #dddddd;
            .monthBox{
                .changeMonthBtnBox{
                    width:50px;
                    font-weight: bold;
                    margin-right:20px;
                    cursor:pointer;
                }
                .monthTextBox{
                    strong{
                        cursor:default;
                        letter-spacing: 2px;
                    }
                }
            }
        }
        .canlendar-top-box{
            margin-bottom:20px;
            .canlendar-top-inner-box{
                width:100%;
                position: relative;
                .year-back-box{
                    .changeMonth{
                        width: 38px;
                        height: 38px;
                        background: #FFFFFF;
                        border: 1px solid #CCCCCC;
                        border-radius: 2px;
                        cursor:pointer;
                    }
                }
                .back-today{
                    margin-right:10px;
                    cursor:pointer;
                    @include positionTopRightSizeIndex($width:auto,$height:auto,$translateX:-50%,$translateY:-50%,$top:50%);
                }
            }

        }
        .dayBox{
            height:40px;
            border-right:solid 1px #cccccc;
            border-bottom:solid 1px #cccccc;
            padding:10px 0 10px 15px;
            align-items: flex-start;
            position: relative;
        }
        .dateDefaultCss{
            .daySpan{
                color:#333333;
            }
        }
        .dateActiveCss{
            background:rgba(84, 94, 188, 0.2);
            .daySpan{
                color:#333333;
            }
        }
        .disableDateCss{

        }
        .dayBorderLeft{
            border-left:solid 1px #cccccc;
        }
        .dayBorderTop{
            border-Top:solid 1px #E7E9FC;
        }
        .haveDataTag{
            @include positionLeftBottomSizeIndex($width:6px,$height:6px,$radius:50%,$bottom:10px,$left:50%,$translateX:-50%);
            background:#37C37C;
        }
        .otherDataBox{
            flex-wrap:wrap;
            @include positionTopRightSizeIndex($width:50%,$height:72px,$top:5px,$right:1px);
            .iconfont{
                width:50%;
            }
        }
        .weeksBox{
            width:100%;
            .weekItem{
                height:48px;
                width:14%;
                border-top:solid 1px #cccccc;
                border-bottom:solid 1px #cccccc;
                background:#ebeef5;
                position: relative;
                .week{

                }
                .verticalLine{
                    background:#cccccc;
                    @include positionTopRightSizeIndex($width:1px,$height:48px);
                }
                .leftLine{
                    left:0;
                }
            }
        }
    }

</style>
<style>
    .canlendarExample .calen-cell{
        margin-bottom:0 !important;
    }
    .canlendarExample .body-title{
        border-bottom:solid 1px #cccccc;
        border-top:solid 1px #cccccc;
        background:#eeeeee;
    }
</style>

````

### 表单组件
表单组件共有lm-input输入框，lm-select选择框（包含单个下拉选择，多个下拉先选择，单项选择radio，）,lm-date-time时间日期选择器，lm-cascader级联选择器

*lm-form* 表单组件包含 *lm-input*、*lm-select*、*lm-date-time* 、*lm-cascader* 组件
表单组件必须包含在 *element-ui* 的 *el-form* 组件和 *el-row* 组件中，请确保引入了*element-ui* 的 *ElFrom、ElFormItem、ElRow* 组件
表单组件支持表单状态（可编辑修改）和查看状态，不可见状态的切换，只需根据条件设置is-edit属性和disabled属性即可。
#### <strong style="font-size:14px;color:#333333">所有表单组件Attributes</strong>

参数	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
span|位置占位|Number|同 el-col 的span属性|12
label|标题|String| --|''
prop|验证属性值|String| --|''
width|宽度|Number / String|--|--
height|高度|Number / String|--|--
size|尺寸|String|medium / small / mini|--
labelWidth|表单项文字宽度|String|--|--
isEdit|是否是编辑状态|Boolean| -- |true
spanStyle|查看状态下样式|Object|--|{}
lmRef|标志以及按回车下一次跳转标志|Array|--|[]
disabled|是否禁用|Boolean|--|--
required|是否必须|Boolean|--|--
marginBottom|表单项下边距|String|--|--

#### lm-input 输入框
##### <strong style="font-size:14px;color:#333333">Attributes</strong>
            
参数	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
value|值|String / Number|--|--
appendText|尾部文字|String| --|--
appendIcon|尾部图标|String| --|--
placeholder|placeholder|String|--|请输入
type|类型|String|text，textarea 和其他 原生 input 的 type 值|text
prefixIcon|输入框前置图标|String|--|--
maxlength|最大长度|String / Number|--|--
minlength|最小长度|String / Number|--|--
min|最小值|Number|--|--
max|最大值|Number|--|--
toFixed|保留的小数|Number|--|--
autosize|type="textarea"有效，自动尺寸|Boolean / Object|--|{ minRows: 2 }
elAuto|是否启用el-autocomplete组件|Boolean|--|--
valueKey|elAuto=true 有效，el-autocomplete输入建议对象中用于显示的键名|String|--|name
placement|elAuto=true 有效，el-autocomplete菜单弹出位置|String|--|--
triggerOnFocus|elAuto=true 有效，el-autocomplete组件是否在输入框 focus 时显示建议列表|Boolean|--|false
inputQueryData|elAuto=true 有效，el-autocomplete输入框建议数据|Array|--|[]

##### <strong style="font-size:14px;color:#333333">Events</strong>
事件名	| 说明 |	 回调参数
:---|:---:|:---
change|输入框改变|(any)
enter|回车事件|--

#### lm-select 下拉选择框和单选按钮
##### <strong style="font-size:14px;color:#333333">Attributes</strong>
            
参数	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
value|值|String / Number /Array|--|--
formType|表单类型|String| radio / multiSelect|select
list|尾部图标|Array| --|['否','是']
placeholder|placeholder|String / Array|--|请选择
selectClass|select类名|String|--|--
oName|选项文字|String / Array|--|name
oValue|选项值|String / Array|--|value
filterable|是否可搜索|Boolean|--|true
changeFun|下拉框改变的函数|Function / Array|--|--
multiMargin|多个下拉框的边距|String|--|0 10px 0 0
multiList|多个下拉框的数据|Array|--|--

##### <strong style="font-size:14px;color:#333333">Events</strong>
事件名	| 说明 |	 回调参数
:---|:---:|:---
change|下拉框，单选框改变|(value:Object/Array)

#### lm-date-time 日期时间选择器
##### <strong style="font-size:14px;color:#333333">Attributes</strong>
            
参数	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
value|值|String / Number /Array / Date|--|--
formType|表单类型|String| rangeDateTime|dateTime
dateTimeType|日期时间类型（同element-ui el-date-picker）|String| year/month/date/dates/ week/datetime/datetimerange/ daterange/monthrange|date
placeholder|placeholder|String / Array|--|请选择
defaultDateTimeValue|默认值|String / Array / Date / Number|--|--
dateTimeValueFormat|时间格式（格式同element-ui el-date-picker）|String|--|--
dateTimeFormat|时间格式（格式同element-ui el-date-picker）|String|--|--
pickerOptions|时间日期配置（配置内容同element-ui el-date-picker配置，formType=rangeDateTime时晴传数组）|Object / Array|--|--
conectionText|formType=rangeDateTime有效，时间范围连接符|String|--|-

##### <strong style="font-size:14px;color:#333333">Events</strong>
事件名	| 说明 |	 回调参数
:---|:---:|:---
change|事件日期改变|(date:String/Number/Date/Array)

#### lm-cascader 级联选择器
##### <strong style="font-size:14px;color:#333333">Attributes</strong>
            
参数	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
value|值|String / Number |--|--
placeholder|placeholder|请选择
options|数据|Array|--|--
oName|选项文字|String|--|name
oValue|选项值|String|--|value
filterable|是否可搜索|Boolean|--|true
pickerOptions|级联配置（配置内容同element-ui el-cascader配置 props）|Object|--|--

##### <strong style="font-size:14px;color:#333333">代码示例</strong>
````html
<template>
 <el-form :model="form" ref="form" :rules="rules" class="form" label-width="110px"  size="mini">  
        <el-row >
          <lm-input label="姓名：" v-model="form.name" prop="name" :lm-ref="['name','phoneNum']" :maxlength="20"/>
          <lm-input label="手机号：" v-model="form.phoneNum" prop="phoneNum" type="tel" :lm-ref="['phoneNum','orgId']" v-if="!isCert"/>
        </el-row>
        <el-row >
          <lm-select form-type="select" label="公司：" v-model="form.orgId" :list="addPersonCompanys" prop="orgId"  :lm-ref="['orgId','idcard']" @change="companyChange" :disabled="!!personDetailInfo.position"/>
            <lm-input label="身份证号：" v-model="form.idcard" prop="idcard" :lm-ref="['idcard','sex']" type="idcard"/>
        </el-row>
        <el-row>        
          <lm-select form-type="radio" label="性别：" v-model="form.sex" :list="['女','男']" prop="sex"/>
            <lm-date-time             
                            label="出生日期："
                            prop="birthday"
                            v-model="form.birthday"                 
                            :picker-options="{disabledDate:birthdayDisableFun}"
                            :default-date-time-value="Date.now()-10*365*24*60*60*1000"
                    />
        </el-row>
        <el-row>
                 <lm-date-time :span="16" form-type="rangeDateTime" label="有效时间：" prop="effectiveTime" :placeholder="['请选择开始时间','请选择结束时间']"  :disabled="[false,true]" v-model="form.effectiveTime"  :width="220">
                      <template #dateTimeConection><span style="display: inline-block; margin:auto 10px;">至</span></template>
                    </lm-date-time>
        </el-row>
        <el-row>
         <el-button type="primary" @click="savePersonInfo" style="width:90px;height:40px;">保存</el-button>
</el-row>
      </el-form>
</template>
<script>
import {validPhone,validIDCard} from 'lm-ui-element/lib/utils/lm-validate-methods'
export default {
   
    data(){
        return {
                     form:{},//表单
                     rules: {
                           orgId: [{required: true, message: "请选择公司", trigger: ['blur', 'change']}],
                          name: [{required: true,message: '请输入姓名'},{min: 1,max: 10,message: '长度在 1 到 10 个字符'}],
                          phoneNum: [{required: true,message: '请输入联系方式',validator: validPhone},{min: 11,max: 11,message: '11位长度'}],
                          sex: [{required: true,message:'请选择性别',trigger: ['blur', 'change']}],
                          idcard: [{required: true,validator:validIDCard, trigger: ['blur', 'change']}],
                          birthday: [{required: true,message: '请选择出生日期', trigger: ['blur', 'change']}],
                         effectiveTime:[{
                                              required: true,
                                               validator:(rule, value, callback)=> validRangeDateTime(rule, value, callback,'请选择有效日期',this.idcardIsLongPeriod,{startRequired:true}),
                               trigger: ['blur', 'change']}],
                     },//实名表单验证
                     inputWidth:300,
                },
        
    },
     methods: {
                //保存信息
                async savePersonInfo(){
                    await  this.$refs.form.validate()
                    //console.log(this.form)
                },
                //分包单位改变
                companyChange({value}){
                   //console.log(value)
                },               
            },
    
}
</script>

````



### 地址选择组件
自带中国省市区县地址数据，组件较大，请按需引入。提供地址选择，地址搜索，根据地址获取经纬度功能

使用地址组件，请确保在项目中引入高德地图或者百度地图（0.7.6版本开始支持），确保**AMap**或者**BMapGL**或者**BMap**实例正确初始化,也可以不初始化地图实例，使用web服务api

以高德地图为例，实例初始化可在入口html文件，即index.html中引入
示例：
````html
<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.15&key=你的key"></script>
````
如果使用vue-amap的则要在main.js中引入
示例：
````javascript
import VueAMap from 'vue-amap'; // 高德地图
VueAMap.initAMapApiLoader({
    key:'你的key',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation', 'AMap.DistrictSearch'],
    v: '1.4.4',
    uiVersion: '1.0.11', // 版本号
})
````
严格来说地址组件也属于表单组件,**lm-address**组件必须包含在**element-ui**的**el-form**组件内部，**lm-address**默认占一行的位置，所以通常情况下，你不需要在**lm-address**外面套上**el-row**，也没有**span**属性
需要做表单校验的，可以从'lm-ui-element/lib/utils/lm-validate-methods'引入validAddressInfo进行校验，校验rule规则同**element-ui**的表单校验。或者自定义校验方法。

**lm-address**支持表单状态（可编辑修改）和查看状态，不可见状态的切换，只需根据条件设置**is-edit**属性和**disabled**属性即可。

当你在页面中直接从编辑状态切换到查看状态时，地址显示数据可能不能正确更新，可以使用**setFullAddress**方法解决

由于获取经纬度是异步的，有可能用户点击保存的时候，经纬度还没获取到或者还没更新，这时候如果直接保存，经纬度数据就不正确。
解决方案：**lm-address** 提供了**addressChange**事件，你可以在使用的组件中声明变量来确定是否获取到了经纬度，默认false，当获取到经纬度后改为true,**addressChange**事件触发时，改为false，这样就可以确保用户提交后的经纬度数据为正确数据

通过web api调用高德配置amap-key属性，百度地图配置bmap-key属性

当高德地图和百度地图均有配置时，只会使用高德地图

#### <strong style="font-size:14px;color:#333333">基础用法</strong>
````html
<template>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <lm-address v-model="form.address"/>
    </el-form>
</template>
<script>
import {validAddressInfo} from 'lm-ui-element/lib/utils/lm-validate-methods'
export default {
    data(){
        return {
            form:{},//表单
             rules: {
                address:[{validator:validAddressInfo,trigger:['blur']}],                                          
              },
        }
    }
}
</script>
````
#### <strong style="font-size:14px;color:#333333">Attributes</strong>

参数	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
required|是否必须|Boolean|--|true
title|标题|String| --|选择地址
maxlength|最大长度|String / Number|--|--
showStreet|是否显示输入详情地址|Boolean| --|true
defaultAddress|默认地址|Object| --|--
isEdit|是否为编辑状态|Boolean| --|true
size|尺寸|String| --|--
inputWidth|详情地址输入框宽度|Number / String| --|'auto'
filterable|省市区选择栏是否可搜索|Boolean| --|true
elAuto|是否选择el-autocomplete组件（用于自动搜索匹配的目标地址）|Boolean| --|true
valueKey|elAuto为true有效，el-autocomplete组件输入建议对象中用于显示的键名|String| --|name
placement|elAuto为true有效，el-autocomplete组件菜单弹出位置|String| --|--
triggerOnFocus|elAuto为true有效，el-autocomplete组件是否在输入框 focus 时显示建议列表|Boolean| --|--
maxlength|地址输入框的最大长度|String,Number| --|--
selectWidth|下拉框宽度|String,Number| --|--
disabled|是否可见|Boolean,Array| --|--
getLngLat|是否获取默认经纬度|Boolean| false|true
amapKey|高德地图web服务api key|String| --|--
bmapKey|百度地图web服务api key|String| --|--
bmapRetCoordtype|百度地图经纬度类型|String| --|gcj02ll

#### <strong style="font-size:14px;color:#333333">Events</strong>
事件名	| 说明 |	 回调参数	
:---|:---:|:---
addressChange|地址发生变化|(address:Object)
getLngLatInfo|获取经纬度|({lng:String,lat:String}:Object)
provinceChange|省发生改变回调|(address:Object)
cityChange|市发生改变回调|(address:Object)
districtChange|区县发生改变回调|(address:Object)
streetChange|详细地址发生改变回调|(address:Object)

#### <strong style="font-size:14px;color:#333333">Methods</strong>
方法名	| 说明 |	 参数	
:---|:---:|:---
setFullAddress|设置地址全名（用于查看状态下）|(address:String)

#### <strong style="font-size:14px;color:#333333">使用示例</strong>
````html
<template>
    <div>
         <el-button @click="isEdit=!isEdit">{{isEdit ? '查看' : '编辑'}}</div>
         <el-form ref="form" :rules="rules" :model="form" label-width="120px">
              <lm-address 
              v-model="form.companyAddress" 
              :is-edit="isEdit" 
               ref="address" 
               @getLngLatFun="getLngLatInfo"
               title="公司地址："
               input-width="300px"
               address-prop="companyAddress" 
               @addressChange="isGetLonLat=false"
              :disabled="[true,false,true,fasle]"
               />
          </el-form>
          <div>
            <el-button @click="cancel"></el-button>
            <el-button type="primary" @click="save"></el-button>           
         </div>
    </div>
   
</template>
<script>
import {validAddressInfo} from 'lm-ui-element/lib/utils/lm-validate-methods'
import axios from 'axios'
export default {
    data(){
        return {
            form:{},//表单
             rules: {
                    companyAddress:[{validator:validAddressInfo,trigger:['blur']}],
              },
              isEdit:false,//是否编辑
              lngLatInfo:{},//经纬度信息
              isGetLonLat:false,//是否获取到经纬度
        }
    },
    methods:{
        //获取经纬度
       getLngLatInfo(lngLatInfo){
            this.lngLatInfo=lngLatInfo
            // 获取到了经纬度后将isGetLonLat设为true
            this.isGetLonLat=true
        },
        //保存
        async save(){
              await this.$refs.form.validate()
              let {lngLatInfo,form,isGetLonLat}=this
              if(!isGetLonLat){
                  //确保已经获取到了经纬度或者经纬度数据已经更新
                  this.$message.warning('正在努力获取经纬度，请稍后再试！')
              }
              let {msg,code}=await axios({
                  url:'/save',
                  data:{
                      ...form,
                      ...lngLatInfo
                  },
                  method:'POST'
              })
              this.isEdit=false
              //console.log(code+msg)
              if(code===1){
                  //成功
                  this.$refs.address.setFullAddress(form.addressArea.join(' '))
              }
              
        }
        
    }
}
</script>
````


### 自定义弹窗组件

使用时请确保引入了*element-ui* 的 *ElButton* 组件
#### <strong style="font-size:14px;color:#333333">基础用法</strong>
````html
<template>
    <div class="exampleBox">
        <el-button type="primary" @click="showDialog=true">打开弹窗</el-button>
        <lm-dialog v-if="showDialog" @cancel="showDialog=false" @close="showDialog=false" @sure="sure">
            <span>弹窗内容</span>
        </lm-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                showDialog:false,//是否显示弹窗
            }
        },
        methods: {
            sure(){
                this.showDialog=false
            },
        },

    }
</script>
````
#### <strong style="font-size:14px;color:#333333">Attributes</strong>

参数	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
title|标题|String|--|--
width|宽度|String / Number|--|400
background|背景色|String / Number|--|40
titleHeight|标题栏高度|String|--|--
titleBk|标题背景色|String|--|--
titleTextColor|标题文字颜色|String|--|--
bottomPadding|底部内边距|String / Number|--|30
contentMarginBottom|内容底部外边距|String / Number|--|30
contentPadding|内容区域内边距|String / Number|--|'30px 20px 10px 20px'
showFooter|是否显示底部|Boolean|--|true
saveText|保存按钮文字|String|--|--
backText|返回按钮文字|String|--|--
btnWidth|按钮宽度|String|--|100px
btnHeight|按钮高度|String|--|40px
showLoading|是否显示保存按钮的加载状态|Boolean|--|--
contentBoxStyle|内容框样式|Object|--|--

#### <strong style="font-size:14px;color:#333333">Slots</strong>

name| 说明
:---|:---:
footer|底部内容

#### <strong style="font-size:14px;color:#333333">Events</strong>
事件名	| 说明 |	 回调参数
:---|:---:|:---
close|关闭弹窗|--
sure|点击确定|--
cancel|点击取消|--


### 文件图片上传组件

文件上传组件和图片上传组件虽然不是表单，但是是为表单设计的，必须放在element-ui的el-form标签中，基于element-ui的el-upload组件实现,带进度条，删除，预览功能。

0.7.6版本开始支持 v-model

请确保引入了*element-ui* 的 *ElFrom、ElFormItem、ElUpload、ElButton、ElProgress、ElIcon* 组件

若需要使用拍照功能，请确保引入element-ui的el-radio-group和el-radio组件

文件上传组件和图片上传组件支持表单状态（可编辑修改）和查看状态，只需根据条件设置is-edit属性即可

fileList属性和action属性必填

#### <strong style="font-size:14px;color:#333333">基础用法</strong>
````html
  <template>
    <div>
        <el-form>
            <lm-up-img :file-list="imgList" action="http:xxx.com/upload"/>
            <lm-up-file :file-list="fileList" action="http:xxx.com/upload"/>
        </el-form>      
    </div>
</template>
<script>
    export default {
        data(){
            return{
                fileList:[],//文件
                imgList:[],//图片
            }
        }
    }
</script>
````

#### <strong style="font-size:14px;color:#333333">文件和图片上传组件公用Attributes</strong>

参数	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
fileList|文件/图片数据|Array|--|--
isEdit|是否编辑状态|Boolean|--|true
drag|启用拖拽上传|Boolean|--|--
limit|文件限制数量|Number|--|--
otherData|上传附带的额外参数|Boolean|--|--
required|是否必须|Array|--|--
hiddenCamera|是否隐藏拍照|Boolean|--|true
action|上传地址|String|--|--
fileBaseUrl|文件域名|String|--|--
customPreviewImgMethod|自定义图片预览方法|Function|--|--
fileProp|校验的prop，使用v-model时有效|String|--|fileList
fields|字段配置，使用v-model时有效|Object|--|--
resConfig|返回值配置，使用v-model时有效|Object|--|--

#### <strong style="font-size:14px;color:#333333">fields配置说明</strong>

字段	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
fileId|文件路径|String|--|fileId
fileName|文件名称|String|--|fileName
fileType|文件类型|String|--|fileType

#### <strong style="font-size:14px;color:#333333">resConfig配置说明</strong>

字段	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
fileId|文件路径|String|--|url
fileType|文件类型|String|--|fileType
fileSize|文件大小|String|--|fileSize

#### <strong style="font-size:14px;color:#333333">文件和图片上传组件Slots</strong>

name| 说明
:---|:---:
fileView|文件/图片列表内容
chooseFileBtn|选择图片/文件按钮
cameraFile|拍照的文件/图片
dragCameraBtn|拖拽时相机图标
cameraBtn|相机按钮
fileMethod|文件图片上传方式（拍照还是上传）

#### <strong style="font-size:14px;color:#333333">文件和图片上传组件Events</strong>
事件名	| 说明 |	 回调参数
:---|:---:|:---
filePreview|图片文件预览|(file:File)
fileChange|图片文件改变|({file:File,fileList:Array})
beforeUpload|图片文件上传之前|--
fileSuccess|图片文件上传成功|({canICommit:Boolean,fileList:Array})
delFile|图片文件删除|--
fileMethodChange|拍照和上传切换|--
fileErr|上传出错|{err,file,fileList}

#### <strong style="font-size:14px;color:#333333">文件和图片上传校验</strong>
校验函数为 validIsEnd，返回Promise，可以使用ref调用

#### lm-up-file 文件上传
##### <strong style="font-size:14px;color:#333333">Attributes</strong>

参数	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
label|表单项标题|String|--|isEdit 为true时： '上传文件：，false时: '文件：'
btnText|按钮名称|String|--|选择文件
fileAccept|文件类型|String|--|`.jpg,.jpeg,.png,.pdf,.webp'`
toastText|提示文字|String|--|--
cameraText|相机按钮文字|String|--|点击拍照
toastColumn|相机按钮文字|String|--|点击拍照
cameraText|提示文字是否竖排|Boolean|--|--
fileListStyle|文件列表样式|Object|--|--
multiple|是否多张|Boolean|false|true
overViewAccept|可预览文件|Array|-- |['.png','.jpg','.jpeg','.webp','.pdf','.docx']

##### <strong style="font-size:14px;color:#333333">Slots</strong>

name| 说明
:---|:---:
filePrev|文件前置内容

#### lm-up-file 图片上传

图片上传组件，如果需要图片裁剪，确保引入lm-ui-element的lm-img-cropper组件。

当图片大于200kb时，默认开启图片压缩

headImg属性为true时，默认开启图片裁剪

##### <strong style="font-size:14px;color:#333333">Attributes</strong>


参数	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
label|表单项标题|String|--|isEdit 为true时： '上传图片：，false时: '图片：'
imgWidth|图片宽度|String / Number|--|120px
imgHeight|图片高度|String / Number|--|90px
compressSize|压缩尺寸|Object|--|{ width:400 }
hiddenCropper|不裁剪图片|Boolean|--|true
headImg|是否是头像|Boolean|--|--
multiple|是否多张|Boolean|--|--

##### <strong style="font-size:14px;color:#333333">Slots</strong>

name| 说明
:---|:---:
delIcon|图片删除按钮


##### <strong style="font-size:14px;color:#333333">代码示例</strong>
````html
<template>
    <div>
        <el-form ref="uploadMaterial"  label-width="120px" size="small">
            <el-row>
                <lm-up-img 
                        label="项目鸟瞰图" 
                        :fileList="fileList" 
                        :otherData="{bucketName:'project'}" 
                        @fileSuccess="v=>canICommitImg=v.canICommitImg" 
                        @beforeUpload="canICommitImg=false" multiple 
                        @delFile="canICommitImg=true"
                />
            </el-row>
            <el-row>
                <lm-up-file  
                        :hiddenCamera="true" 
                        :file-list="fileList" 
                        :other-data="{bucketName:'material'}" 
                        @fileSuccess="v=>canICommit=v.canICommit" 
                        @beforeUpload="canICommit=false" 
                        label="上传资料：" 
                        fileAccept="*"  
                        :file-list-style="{'padding-left':'40px'}"
                        @delFile="canICommitImg=true"
                >
                    <template #filePrev="{fileViewForm,file}">
                        <el-row style="width:40%;" class="fileViewFormRow">
                            <lm-input width="200" :span="24" label="文件名称：" v-model="file.name" margin-bottom="0"/>
                        </el-row>
                    </template>
                </lm-up-file>
            </el-row>
        </el-form>
        <div>
            <el-button @click="save">保存</el-button>
        </div>
    </div>
   
</template>
<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                fileList:[],//文件
                canICommit:true,//是否可以提交文件
                imgList:[],//图片
                canICommitImg:true,//是否可以提交图片
            }
        },
        methods: {
            //确定上传
            async save(){
                let {fileList,imgList,canICommitImg,canICommit}=this
                if(!canICommit){
                    this.$message.warning('请等待文件上传完成')
                    return
                }
                if(!canICommitImg){
                    this.$message.warning('请等待文件上传完成')
                    return
                }
                let res=await axios.post('/save',{fileList,imgList})
                code===0 ? this.$message.success(res.data.msg) : this.$message.warning(res.data.msg)
                
            }
        },
    }
</script>

````

使用v-model（0.7.6版本开始支持）
````html
<template>
    <el-form v-model="form" :model="form" ref="form" :rules="rules" label-width="120px">
        <lm-up-file v-model="form.fileList"
                    action="/admin/sys-file/upload"
                    :fields="{fileId:'fileUrl',fileType:'type',fileSize:'size'}"
                    ref="fileList"
        />
        <lm-up-img
                v-model="form.imgList"
                file-prop="imgList"
                action="/admin/sys-file/upload"
                :fields="{fileId:'fileUrl',fileType:'type',fileSize:'size'}"
                ref="imgList"
        />
        <el-row>
            <el-button @click="save">保存</el-button>
        </el-row>
    </el-form>
</template>

<script>
    export default {
        data() {
            return {
                form:{},//
                rules:{
                    imgList:[{required:true,message:'请上传图片',trigger:['change','blue']}],
                    fileList:[{required:true,message:'请上传文件',trigger:['change','blue']}],
                },
            }
        },
        methods: {
            async save(){
                await this.$refs.form.validate()
                await this.$refs.fileList.validIsEnd()
                await this.$refs.imgList.validIsEnd()
                console.log(this.form)
            },
        },

    }
</script>
````


### 图片裁剪组件

图片裁剪弹窗组件，基于vue-cropper插件，同时组件内部使用lm-dialog弹窗组件，使用时确保引入element-ui的el-button组件，lm-ui-element的lm-dialog组件
#### <strong style="font-size:14px;color:#333333">Attributes</strong>


参数	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
imgSrc|裁剪图片的地址|String / Blob|--|--
info|显示裁剪框的大小信息|Boolean|--|true
outputSize|剪切后的图片质量|Number|0.1~1|1
full|输出原图比例截图|Boolean|--|true
outputType|裁剪生成额图片的格式|String|--|--
canMove|能否拖动图片|Boolean|--|true
original|上传图片是否显示原始宽高|Boolean|--|true
canMoveBox|能否拖动截图框|Boolean|--|true
autoCrop|是否默认生成截图框|Boolean|--|true
autoCropWidth|裁剪框宽度|Number|--|200
autoCropHeight|裁剪框高度|Number|--|260
fixedBox|截图框固定大小|Boolean|--|true
fileSize|文件尺寸|Number|--|--
exampleImg|示例图片路径|String|--|--
maxSize|图片最大值|String / Number|--|200
title|标题|String|--|图片裁剪
width|截图弹窗宽度|String / Number|--|850
previewText|预览文字|String|--|预览
exampleText|示例文字|String|--|示例
completeBtnText|裁剪完成按钮|String|--|裁剪完成
cancelBtnText|取消裁剪按钮|String|--|不裁剪

#### <strong style="font-size:14px;color:#333333">Slots</strong>

name| 说明
:---|:---:
footer|底部内容
sizeWarning|尺寸超出时提示内容

#### <strong style="font-size:14px;color:#333333">Methods</strong>
方法名	| 说明 |	 参数 | 返回值
:---|:---:|:---|: ---
openDialog|打开裁剪弹窗|--| 点击裁剪成功，返回裁剪的文件对象file，点击关闭无返回值

#### <strong style="font-size:14px;color:#333333">Events</strong>
事件名	| 说明 |	 回调参数
:---|:---:|:---
cropperSuccess|裁剪成功事件|(file:File)
close|关闭弹窗|--

### loading组件
可在main.js中全局引入

````javascript
import {LmLoading} from 'lm-ui-element'

Vue.use(LmLoading)

Vue.prototype.$lmLoading=LmLoading
````

页面调用

````javascript
//显示加载
 this.$lmLoading.show() 
//改变加载图标颜色，大小
this.$lmLoading.show({color:'#ffffff',size:32})
//关闭加载
this.$lmLoading.hidden()
````


#### <strong style="font-size:14px;color:#333333">Slots</strong>

name| 说明
:---|:---:
footer|底部内容
sizeWarning|尺寸超出时提示内容

#### <strong style="font-size:14px;color:#333333">Methods</strong>
方法名	| 说明 |	 参数 | 返回值
:---|:---:|:---|: ---
openDialog|打开裁剪弹窗|--| 点击裁剪成功，返回裁剪的文件对象file，点击关闭无返回值

#### <strong style="font-size:14px;color:#333333">Events</strong>
事件名	| 说明 |	 回调参数
:---|:---:|:---
cropperSuccess|裁剪成功事件|(file:File)
close|关闭弹窗|--



## 公用方法,lm_methods，lm-validate，lm-validate-methods

[返回首页](README.md)  [返回上一级](architect/lm-ui/lm-ui-element/lm-ui-element.md)

### lm-methods
提供部分公共函数
引用示例：
````javascript
import {formatDate} from "lm-ui-element/lib/utils/global-methods";
````

函数名	| 说明 |	 参数说明	| 返回值
:---|:---:|:---|:---
formatDate|日期格式化，年月日 | 接收两个参数，第一个参数为时间(date:String/Number/Date,connector)，第二个参数为日期连接符，默认为'/' | 字符串格式日期
formatDateTime|日期格式化，年月日 时分秒|接收两个参数，第一个参数为时间(date:String/Number/Date,connector)，第二个参数为日期连接符，默认为'/' | 字符串格式日期
noRepeatArrHasObject|带对象的数组去重|接收两个参数，第一个参数为需要去重的目标数组(arr:Array)，第二个参数为用于比较的具有唯一值的id属性名(onlyId:String)，默认为"id"|去重后的数组
isIEFun|是否是ie浏览器|--|true或false
isEdgFun|是否是edg浏览器|--|true或false
compressImageFun|判断文件类型与压缩图片|接收一个对象做参数：{file, width, height, quality = 0.8, maxWidth = 1920, maxHeight = 1080,compressSize=200000,maxSize=9000000},file:File,二进制图片数据；width:Number,图片宽度；height:Number,图片高度；quality:Number,压缩质量，默认0.8，可选值0.1~1；maxWidth:Number,最大宽度，默认1920；maxHeight:Number,最大高度，默认1080；compressSize:Number,图片大于多少开始压缩，单位字节，默认200000字节；maxSize:Number,可接受的最大大小，单位字节，默认9000000字节|返回对象:{code:Number,msg:String,data:File}。code=1，成功；code=2成功但压缩后的图片大小大于maxSize；data为二进制文件数据
base64ToBlob|将base64转换为blob|接收一个参数，base64字符串（base64Str:String）|Blob
base64ToFile|将base64转换为file|接收一个参数，base64字符串（base64Str:String）|File
toThousands|金额格式（分隔）|接收两个参数，第一个参数是数字num:Number，第二个参数是是否带小数isFloat:Boolean,默认true|File

### lm-validate
提供验证函数
引用示例：
````javascript
import {isvalidPhone} from "lm-ui-element/lib/utils/lm-validate";
````

函数名	| 说明 |	 参数说明	| 返回值
:---|:---:|:---|:---
isvalidPhone|验证手机号 | (phone:any) | true或false
isvalidCardNo|验证身份证 | (idCard:any) | true或false
isvalidBankNo|验证银行卡 | (bankNo:any) | true或false
isvalidNo|非数字证验证 | (str:any) | true或false
isValidDate|判断日期格式是否正确 | (dateTime:any) | 返回对象，正确时返回{dateTime:Date,isValid:true},错误时返回{isValid:false}
isNumber|判断是否为数字，整数或者小数 | (val:any) | true或false

### lm-validate-methods
封装elememt-ui的自定义表单验证方法,rule, value, callback是element-ui自定义验证回调参数
引用用法示例：
````javascript
import {validPhone} from "lm-ui-element/lib/utils/lm-validate-methods";
data(){
    return {
        rules:{
            mobile: [{required: true, validator:validPhone,trigger: ['blur', 'change']}],
        }
  }
}
````
函数名	| 说明 |	 参数说明	
:---|:---:|:---
validPhone|验证手机号 | (rule, value, callback) 
validIDCard|验证身份证 | (rule, value, callback,config) ，其中config为配置项，可选配置参数为：maxAge 最大年龄 Number，默认81 ；minAge 最小年龄 Number，默认15
validBankNo|验证银行卡 | (rule, value, callback) 
towPassIsAlike|两次密码是否一致校验 | (rule, value, callback,confirmPass) ,其中confirmPass为确认密码
validAddressInfo|检查地址是否完善，通常和地址组件lm-address配套使用 | (rule, value, callback,config) ，config为配置对象，可配置参数为：msg 错误信息 String，默认值“请完善地址信息”；isReset 是否是重置表单 Boolean
validMultiSelect|多个级联下拉框校验，通常配合lm-select form-type="multiSelect"使用 | (rule, value, callback,length,msg) ，length是下拉框个数 Number，msg是信息 String，默认为“请完善信息”
validRangeDateTime|验证时间范围，通常配合lm-date-time form-type="rangeDateTime" 使用，| (rule, value, callback，msg,stopValid) ，其中msg时错误信息 String，默认为“请完善信息”，stopValid为是否停止验证的条件 Boolean
validateChinese|中文校验 | (rule, value, callback,config) ，其中config为配置对象，可选参数为：msgs 错误信息，Array，默认值是['请输入'] ； min 字符最小长度 Number ；max 字符最大长度 Number ； required 是否必须 Boolean ,默认值true
validateAbcAndNumber|字母数字校验 | (rule, value, callback,config) ,其中config为配置对象，可选参数为：msg 错误信息 String，默认值是"请输入数字或者字母" ； min 字符最小长度 Number ；max 字符最大长度 Number ； required 是否必须 Boolean ,默认值true
validateCertificateNo|企业资质编号校验 | (rule, value, callback,config) ,其中config为配置对象，可选参数为：msg 错误信息 String，默认值"企业资质编号为中文开头的13~20位字符串"； required 是否必须 Boolean ,默认值true
validateLngLat|经纬度校验 | (rule, value, callback,isLgnOrLat) ,isLgnOrLat用于区分 是经度还是纬度 String，可选值有lng 经度,lat 纬度
validateAbcAnd_|验证字母和下划线正则 | (rule, value, callback,config) ,其中config为配置对象，可选参数为：msg 错误信息 String，默认值是"请输入字母和下划线组成的字符串" ； required 是否必须 Boolean ,默认值true

## 挂在在vue原型链上的方法 $lm
有些函数需要挂载到原型链上，主要方便在dom中使用,当然在生命周期和方法中也可以使用。这部分方法统一挂在到$lm下

函数名	| 说明 |	 参数说明	
:---|:---:|:---
dateRangeDisabled|日期范围内不可见设置 | 接收三个参数，(time, range, config) ，time是时间组件返回的时间 Date；range是时间范围值，由开始时间和结束时间组成的一个数组 Array，第一个值是开始时间 String/Date/Number，第二个值是结束时间 String/Date/Number；config 配置信息,包含startEqual 开始日期是否可以相等 Boolean,endEqual 结束日期是否可以相等 Boolean

使用示例：
首先在main.js中添加如下代码
````javascript
import $lm from 'lm-ui-element/lib/utils/$lm'
Vue.use($lm)
````
使用
````html
<template>
<el-form width="1000" ref="form" :model="form" label-width="100px">
          <el-row>
            <lm-date-time label="日期范围：" v-model="form.date"   form-type="rangeDateTime" width="46%"
                          date-time-type="datetime"
                          :picker-options="[
                            {
                                disabledDate:(time)=>$lm.dateRangeDisabled(time,[0,form.date ? form.date[1] : new Date()],{endEqual:true})
                                },
                                {
                                    disabledDate:time=> $lm.dateRangeDisabled(time,[form.date ? form.date[0] : 0,new Date()],{endEqual:true,startEqual:true})
                                }
                                ]"
            />
          </el-row>
        </el-form>
</template>
<script>
export default {
    data(){
       return{
           form:{},//表单
       }
     }
}
</script>

````
