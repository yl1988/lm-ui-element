<template>
  <div class="custom-calendar" :style="{width:calendarWidth,height:calendarHeight}" :class="calendarClass">
    <div class="calendar-topBox">
      <slot name="calendarTitle"></slot>
      <slot name="calendarHead" :currentYear="currentYear" :currentMonth="currentMonth+1" :changeMonth="changeMonth">
        <div class="calendar-title rowCenter" :style="{height:titleHeight,background:titleBk}" :class="titleClass">
          <strong class="left rowStart">{{currentYear}}{{titleDateConnector || '年'}}{{currentMonth+1}}{{titleDateConnector ? '' : '月'}}</strong>
          <span class="right rowBtween">
               <slot name="changeMonthBtn" :changeMonth="changeMonth" :currentYear="currentYear" :currentMonth="currentMonth+1">
                 <span class="changeMonth" @click="changeMonth(0)">&lt;</span>
                 <span class="changeMonth" @click="changeMonth(1)">&gt;</span>
               </slot>
           </span>
        </div>
      </slot>
    </div>
    <div class="calendar-body" :style="{background:bodyBk}" :class="bodyClass">
      <div class="bodyTitleBox rowCenter">
        <slot name="weeks">
          <span class="body-title rowCenter" :ref="index ? '' : 'calenCellTitle'" :style="{height:cellTitleHeight,color:cellTitleColor}" v-for="(week,index) in weeks" :key="index">{{week}}</span>
        </slot>
      </div>
      <div class="calen-content rowCenter">
        <div class="calen-cell" :id="'calen'+index" :ref="index ? '' : 'calenCell'" :class="[calenCellClass,index<7 ? 'firstRowCellClass': '',index%7===0 ? 'firstColumCellClass' : '']"  :style="{...calenCellStyle,...cellBorderStyle(index)}" v-for="(day,index) in calendarList" :key="index" @click="choose(day,index)">
          <slot name="day" :day="day" :index="index">
            <span class="dateSpan rowCenter" :class="day.dateClass">{{day.day}}</span>
          </slot>
          <div class="rowCenter" v-show="day.hasData && day.isThis">
            <slot name="haveDataTag" :hasData="day.hasData" :isThis="day.isThis">
              <div class="tag"></div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    import {isValidDate,isNumber} from "../../uitls/lm-validate"
    import {checkStartTimeEndTimeFun,insertDataToCalendar} from './util'
    export default {
        name: "LmCalendar",
        props: {
            initDate:{
                type:[String,Date,Number],
                default:()=>new Date()
            },//初始化日期
            width:{
                type:[String,Number],
                default:'100%'
            },//日历宽度
            height:{
                type:[String,Number],
                default:'100%'
            },//日历高度
            calendarClass:String,//日历自定义样式类
            titleClass:String,//年月标题自定义样式类
            titleH:{
                type:[String,Number],
                default:'35px'
            },//年月标题高度
            titleBk:{
                type:String,
                default:'#ffffff'
            },//年月标题颜色
            bodyBk:{
                type:String,
                default:'#ffffff'
            },//日历体背景
            bodyClass:String,//日历体自定义样式
            dateDefaultClass:String,//日期自定义默认类名
            dateActivDateClass:String,//日期自定义选中类名
            dateDisabledDateClass:String,//日期自定义不可见类名
            titleDateConnector:String,//标题日期连接符
            insertData:{
                type:Array,
                default:()=>[]
            },//自定义拼接数据
            weeks:{
                type:Array,
                default:()=>['日','一','二','三','四','五','六']
            },//周数据
            dateProp:String,//自定义表示时间的字段
            calenCellClass:String,//日历单元格自定义样式
            firstRowCellClass:String,//日历第一行单元格自定义样式
            firstColumCellClass:String,//日历第一列单元格自定义样式
            cellBorder:Boolean,//是否有边框
            cellTitleHeight:{
                type:[Number,String],
                default:'40px'
            },//日历标题高度
            cellTitleColor:{
                type:String,
                default:'#333333'
            },//日历标题颜色
            options:{
                type:Object,
                default:()=>{
                    return {
                        range:[],//日期范围
                    }
                }
            },//配置

        },
        data() {
            return {
                calendarList: [],//日历数据
                activeDay: {},//选中日期信息
                currentYear: '',//显示的年
                currentMonth: '',//显示的月
                chooseDate: '',//选择的日期
                calenCellHeight:0,//日历单元格高度
                calenBotyTitleCellStyle:{},//日历顶部单元格样式
                calenCellStyle:{},//日历单元格样式
                calendarWidth:'100%',//日历宽度
                calendarHeight:'100%',//日历高度
                titleHeight:'35px',//年月标题高度
                dateCellDefaultClass:'',//日历单元格默认类名
                dateCellActiClass:'',//日历单元格选中类名
                dateCellDisabledClass:'',//日历不可见单元格类名
                cellBorderStyle:(index)=>{return {}},//日历单元格边框样式
                bodyCellTitleHeight:'40px'
            }
        },
        async created(){
            let {width,height,titleH,dateDefaultClass,dateActivDateClass,dateDisabledDateClass,cellTitleHeight}=this
            this.calendarWidth=(typeof width==='number' || isNumber(width)) ? (width+'px') : width
            this.calendarHeight=(typeof height==='number' || isNumber(height)) ? (height+'px') : height
            this.titleHeight=(typeof cellTitleHeight==='number' || isNumber(cellTitleHeight)) ? (cellTitleHeight+'px') : cellTitleHeight
            this.bodyCellTitleHeight=(typeof titleH==='number' || isNumber(titleH)) ? (titleH+'px') : titleH
            this.dateCellDefaultClass=dateDefaultClass || 'dateDefaultCss'
            this.dateCellActiClass=dateActivDateClass || 'dateActiveCss'
            this.dateCellDisabledClass=dateDisabledDateClass || 'disableDateCss'
            let {dateTime,isValid}=isValidDate(this.initDate)
            if(!isValid) return
            let year=dateTime.getFullYear()
            let month=dateTime.getMonth()
            let date=dateTime.getDate()
            await this.init(year,month,date)
            insertDataToCalendar(this.insertData,this.calendarList,this.dateProp)
        },
        methods: {
            //初始化日历
            async init(year, month, date,config={}) {
                this.currentYear = year
                this.currentMonth = month
                let daysInMonth = new Date(year, month+1,0).getDate()//得到当前月份的天数  28,29,30,31
                let firstDayInWeek = new Date(year, month,1).getDay()//获取当月的一号是星期几
                let lastDayInWeek = new Date(year,month,daysInMonth).getDay()//获取当月最后一天是星期几
                this.calendarList = await this.createcalendarList(year, month, date, firstDayInWeek, lastDayInWeek, daysInMonth,config)
                return this.calendarList
            },
            //创建日历
            createcalendarList(year, month, date, firstDayInWeek, lastDayInWeek, daysInMonth,config={}) {
                return new Promise((resolve)=>{
                    let thisYear=new Date().getFullYear()
                    let thisMonth=new Date().getMonth()
                    if(thisYear===year && thisMonth===month){
                        date=new Date().getDate()
                    }
                    let {range=[],endEqual,startEqual}=this.options
                    let start=checkStartTimeEndTimeFun(range[0])
                    let end=checkStartTimeEndTimeFun(range[1])
                    let calendarList = []
                    //1号不在星期天,补全前面的日期信息
                    if (firstDayInWeek !== 0) {
                        let prevMonthLastDate=new Date(year,month,0).getDate()
                        for (let j = firstDayInWeek-1; j >= 0; j--) {
                            calendarList.push({
                                dateClass: this.dateCellDisabledClass,
                                year,
                                month,
                                day: prevMonthLastDate - j,
                                week: new Date(year,month-1,prevMonthLastDate - j).getDay(),
                                isThis: false
                            })
                        }
                    }
                    // 添加日期信息
                    for (let i = 0; i < daysInMonth; i++) {
                        let dateClass=''
                        let isRange=true
                        let day=i+1
                        let thisDateTime=new Date(year,month,day).getTime()
                        let startDateTime=start ? new Date(start).getTime() : NaN
                        let endDateTime=end ? new Date(end).getTime() : NaN
                        if(startDateTime && endDateTime){
                            if(day===date && (startDateTime<=thisDateTime && thisDateTime<=endDateTime)){
                                dateClass=this.dateCellActiClass
                            }
                        }else if(startDateTime){
                            dateClass=(startEqual ? thisDateTime>startDateTime : thisDateTime>=startDateTime) ? (day===date ? this.dateCellActiClass : this.dateCellDefaultClass) : this.dateCellDisabledClass
                            isRange=startEqual ? thisDateTime>startDateTime : thisDateTime>=startDateTime
                        }else if(endDateTime){
                            dateClass=(endEqual ? thisDateTime<=endDateTime: thisDateTime<endDateTime) ? (day===date ? this.dateCellActiClass : this.dateCellDefaultClass) : this.dateCellDisabledClass
                            isRange=endEqual ? thisDateTime<=endDateTime: thisDateTime<endDateTime
                        }
                        let dayData = {
                                dateClass,
                                year,
                                month:month+1,
                                day,
                                week:new Date(year,month,i + 1).getDay(),
                                isThis: true,
                                isRange
                            }
                        ;(day === date) && (this.activeDay = dayData)
                        calendarList.push(dayData)
                    }
                    //如果当月的最后一天不是星期六,后面补全日期信息
                    if (lastDayInWeek !== 6) {
                        for (let i = 0; i < 6 - lastDayInWeek; i++) {
                            calendarList.push({
                                dateClass: this.dateCellDisabledClass,
                                year,
                                month: month + 2,
                                day: i + 1,
                                week: new Date(year,month+1,i + 1).getDay(),
                                isThis: false
                            })
                        }
                    }
                    // 如果单元格有边框，执行边框函数
                    if(this.cellBorder){
                        this.cellBorderStyle=index=> {
                            return {
                                'border-right-style':'solid',
                                'border-bottom-style':'solid',
                                'border-width':'1px',
                                'border-color':'#dddddd',
                                'border-top-style':index<7 ? 'solid' : '',
                                'border-left-style':index%7===0 ? 'solid' : '',
                            }
                        }
                    }
                    resolve(calendarList)
                })

            },
            //点击选择日期
            choose(day,index) {
                let {isRange,isThis}=day
                if (isThis && isRange){
                    //本月
                    this.calendarList.map(item=>{
                        item.dateClass=(item.isThis && item.isRange) ? this.dateCellDefaultClass : this.dateCellDisabledClass
                        return item
                    })
                    this.activeDay.dateClass = this.dateCellDefaultClass
                    this.activeDay = day
                    day.dateClass = this.dateCellActiClass
                    let month=day.month <10 ? '0'+day.month : day.month
                    let myDay=day.day <10 ? '0'+day.day : day.day
                    this.chooseDate = day.year + '-' + month + '-' + myDay
                    this.$emit('getChooseDate', this.chooseDate)
                }
            },
            // 月份改变
            async changeMonth(value) {
                let year=null
                let month=null
                let day=1
                if(value===1 || value===0){
                    //翻页操作
                    if(value){
                        //向上翻
                        if (this.currentMonth === 11) {
                            this.currentYear++
                            this.currentMonth = 0
                        } else {
                            this.currentMonth++
                        }
                    }else{
                        // 向下翻
                        if (this.currentMonth === 0) {
                            this.currentYear--
                            this.currentMonth = 11
                        } else {
                            this.currentMonth--
                        }
                    }
                    year=this.currentYear
                    month=this.currentMonth
                }else{
                    //时间格式
                    if(typeof value !=='number' && typeof value !=='string' && !(value instanceof Date)){
                        console.error(`${value} 时间格式错误 `)
                        return
                    }
                    if(typeof value ==='string'){
                        value=value.replace(/-/g,'/')
                    }
                    if(value===2){
                        //今天
                        year=new Date().getFullYear()
                        month=new Date().getMonth()
                        day=new Date().getDate()
                    }else{
                        year=new Date(value).getFullYear()
                        month=new Date(value).getMonth()
                        day=new Date(value).getDate()
                    }

                }
                await this.init(year, month,day,{isChangeMonth:true})//等待日历先创建完成
                insertDataToCalendar(this.insertData,this.calendarList,this.dateProp)
                month=month+1
                month<10 && (month='0'+month)
                day<10 && (day='0'+day)
                this.$emit('monthChange',`${year}-${month}-${day}`)
            },

        },
        watch:{
            //监听插入数据
            insertData:{
                deep:true,
                handler:function (value) {
                    insertDataToCalendar(value,this.calendarList,this.dateProp)
                },
            },
            //监听日期范围变化
            range:{
                deep:true,
                handler:async function ([startTime,endTime]) {
                    if(startTime && endTime){
                        await this.init(this.currentYear, this.currentMonth,1,)//等待日历先创建完成
                        insertDataToCalendar(this.insertData,this.calendarList,this.dateProp)
                    }
                },
            }
        }
    }
</script>

