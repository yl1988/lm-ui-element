<!--ProgressView-->
<template>
    <div class="progressViewBox rowBtween">
        <div class="custom-card-box progress-canlendar-box">
            <calendar ref="canlendar" @getChooseDate="(checkDate)=>$sunRainMethods.getChooseDate(checkDate,this,false)" :insert-data="insertData" :options="{range:['',new Date()]}" date-prop="hasDataDate">
                <template #weeks>
                    <div class="weeksBox rowCenter">
                        <div class="weekItem rowCenter font16" v-for="(week,index) in weeks" :key="week">
                            <span class="week">{{week}}</span>
                            <span class="rightLine verticalLine"></span>
                            <span class="leftLine verticalLine" v-if="index===0"></span>
                        </div>
                    </div>
                </template>
                <template #calendarTop="{currentYear,currentMonth,changeMonth}">
                    <div class="canlendar-top-box">
                        <div class="canlendar-top-inner-box rowCenter">
                            <div class="rowCenter year-back-box">
               <span class="changeMonth rowCenter font28">&lt;</span>
                                <input type="date" v-model="date">
                                <!--<el-date-picker type="month" v-model="date" style="margin:0 5px;" :clearable="false" @change="(pDate)=>dateChange(pDate,changeMonth)" :picker-options="{disabledDate:time=>time>new Date()}"/>-->
                                <span class="changeMonth rowCenter font18" @click="getMonthChange({changeMonth,currentYear,currentMonth,type:1})">&gt;</span>
                            </div>
                            <span class="violet back-today font14 rowCenter" @click="getMonthChange({changeMonth,type:2})">返回今天</span>
                        </div>
                    </div>
                </template>
                <template #haveDataTag="{day}">
                    <div class="haveDataTag rowCenter font12 violet" @click.stop="showProgressImgFun(day)">形象进度</div>
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
            </calendar>
        </div>
    </div>
</template>

<script>
    import {formatDate} from "../utils/global-methods";

    export default {
        name: 'ProgressView',
        data() {
            return {
                sunRainInfo:{},//形象进度数据晴雨表
                insertData: [],
                isShow: false,
                barometer: {pushDate:formatDate(new Date(),'-')},// 晴雨表数据
                date:new Date(),//日期
                changeMonth:null,//月份改变函数
                weeks:['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
                fileList:[],//预览图片
                showPhotoPreview:false,//是否显示形象进度弹窗
                progressImgDate:'',//形象进度图片弹窗日期
            }
        },
        computed: {
        },
        mounted() {
        },
        methods: {
            //月份改变
            getMonthChange({changeMonth,currentYear,currentMonth,type}){
                console.log(currentYear,currentMonth)
                let currentMonthArr=[currentMonth-1,currentMonth+1]
                this.$sunRainMethods.getMonthChange(changeMonth,type,{currentYear,currentMonth:currentMonthArr[type],that:this})
            },
            //日期改变
            dateChange(date,changeMonth){
                console.log(date)
                let currentYear=new Date(date).getFullYear()
                let currentMonth=new Date(date).getMonth()+1
                console.log(currentYear,currentMonth)
                this.$sunRainMethods.getMonthChange(changeMonth,date,{currentYear,currentMonth,that:this})
            },
            //显示形象进度弹窗
            async showProgressImgFun(dayInfo){
                console.log(dayInfo)
                let {day,calendarAddYear,calendarAddMonth}=dayInfo
                this.showPhotoPreview=true
                ;(day<10) && (day='0'+day)
                ;(calendarAddMonth<10) && (calendarAddMonth='0'+calendarAddMonth)
                let progressImgDate=`${calendarAddYear}-${calendarAddMonth}-${day}`
                this.progressImgDate=progressImgDate
                let dayDetailInfo=await getBarometer({findDate:progressImgDate})
                console.log(dayDetailInfo)
                this.fileList=dayDetailInfo.pushImg ? dayDetailInfo.pushImg.split(',').reduce((result,current)=>{
                    result.push({
                        fileId:current
                    })
                    return result
                },[]) : []

            },
            //关闭图片预览弹窗
            closePhoteDialog(){
                this.showPhotoPreview=false
                this.fileList=[]
            }
        },

    }
</script>

<style scoped lang="scss">
    @import "../utils/scss/mix";
    .progressViewBox{
        width:100%;
        align-items:flex-start;
        .progress-canlendar-box{
            flex:1;
            min-width:830px;
        }
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
        .sunRainInfoBox{
            flex-shrink:0;
            margin-left:20px;
            width:460px;
            background: #FFFFFF;
            border: 1px solid #DDE4EC;
            .sunRainHead{
                background:#DDE4EC;
                height:40px;
                padding-left:20px;
            }
            .sunRainContentBox{
                padding:20px;
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
            height:120px;
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
            border-left:solid 1px #E7E9FC;
        }
        .dayBorderTop{
            border-Top:solid 1px #E7E9FC;
        }
        .haveDataTag{
            @include positionLeftBottomSizeIndex($width:70px,$height:20px,$radius:10px,$bottom:10px,$left:10px);
            border: 1px solid #545EBC;
            cursor:pointer;
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
    .progressViewBox .calen-cell{
        margin-bottom:0 !important;
    }
    .progressViewBox .body-title{
        border-bottom:solid 1px #cccccc;
        border-top:solid 1px #cccccc;
        background:#eeeeee;
    }
</style>

