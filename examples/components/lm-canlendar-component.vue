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
            <template #calendarTop="{currentYear,currentMonth,changeMonth}">
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
    import {formatDate} from "../../packages/utils/global-methods";

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
                console.log(currentYear,currentMonth)
                let currentMonthArr=[currentMonth-1,currentMonth+1]
                this.$sunRainMethods.getMonthChange(changeMonth,type,{currentYear,currentMonth:currentMonthArr[type],that:this})
            },
        },

        watch: {}
    }
</script>
<style lang="scss" scoped type="text/scss">
    @import "../../packages/lm-ui-element-style/src/common/mix";
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
