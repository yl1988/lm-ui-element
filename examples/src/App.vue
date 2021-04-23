
<template>
    <div class="exampleBox">
        <div class="lm-ui-title rowCenter">
            <strong>龙马-ui</strong>
        </div>
        <div class="componentsBox rowAround">
            <div class="componentItemBox columnCenter">
                <lm-canlendar-component style="width:500px;"/>
                <el-button type="text">日历</el-button>
            </div>
            <div style="padding-top:60px;">
                <el-form width="1000" ref="form" :model="form" label-width="100px">
                    <el-row>
<!--                        <lm-input label="姓名：" v-model="form.name" maxlength="50"></lm-input>-->
<!--                        <lm-select label="学历：" v-model="form.stuty" :list="['文盲','小学','初中','高中','中专','大专','本科','硕士','博士']"/>-->
                      <lm-select form-type="radio" label="类型：" v-model="form.type " disabled/>
                    </el-row>
                  <el-row v-if="form.type===0">
                    <lm-input label="姓名：" v-model="form.name"></lm-input>
                    <lm-select label="学历：" v-model="form.stuty" :list="['文盲','小学','初中','高中','中专','大专','本科','硕士','博士']"/>
                  </el-row>
                    <el-row>
                        <lm-cascader label="证书：" :options="cascaders"/>
                    </el-row>
                  <el-row>
                    <lm-date-time :span="24" label="周范围：" v-model="form.week" form-type="rangeDateTime" width="200"
                                  :picker-options="[
                                      {disabledDate:time=>disableDate(time,form.week ? form.week[1] : 0,'start','week')},
                                      {disabledDate:time=>disableDate(time,form.week ? form.week[0] : 0,'end','week')}
                                      ]"/>
                  </el-row>
                  <el-row>
                    <lm-date-time :span="24" label="月范围：" v-model="form.month" form-type="rangeDateTime" width="200"
                                  :picker-options="[
                                      {disabledDate:time=>disableDate(time,form.month ? form.month[1] : 0,'start','month')},
                                      {disabledDate:time=>disableDate(time,form.month ? form.month[0] : 0,'end','month')}
                                      ]"/>
                  </el-row>
                  <el-row>
                    <lm-date-time :span="24" label="上半月范围：" v-model="form.halfMonthFirst" form-type="rangeDateTime" width="200"
                                  :picker-options="[
                                      {disabledDate:time=>disableDate(time,form.halfMonthFirst ? form.halfMonthFirst[1] : 0,'start','halfMonthFirst')},
                                      {disabledDate:time=>disableDate(time,form.halfMonthFirst ? form.halfMonthFirst[0] : 0,'end','halfMonthFirst')}
                                      ]"/>
                  </el-row>
                  <el-row>
                    <lm-date-time :span="24" label="下半月范围：" v-model="form.halfMonthTwo" form-type="rangeDateTime" width="200"
                                  :picker-options="[
                                      {disabledDate:time=>disableDate(time,form.halfMonthTwo ? form.halfMonthTwo[1] : 0,'start','halfMonthTwo')},
                                      {disabledDate:time=>disableDate(time,form.halfMonthTwo ? form.halfMonthTwo[0] : 0,'end','halfMonthTwo')}
                                      ]"/>
                  </el-row>
                  <el-row>
                    <lm-date-time :span="24" label="年范围：" v-model="form.year" form-type="rangeDateTime" width="200"
                                  :picker-options="[
                                      {disabledDate:time=>disableDate(time,form.year ? form.year[1] : 0,'start','year')},
                                      {disabledDate:time=>disableDate(time,form.year ? form.year[0] : 0,'end','year')}
                                      ]"/>
                  </el-row>
                    <lm-address label="住址："
                                v-model="form.address" :required="false"
                                @getLngLatInfo="getLngLatInfo"
                                @addressChange="addressChange"
                                :disabled="[false,false,false,false]"
                    />
                  <el-row>
                    <lm-input label="经度：" v-model="form.lng" type="number" maxlength="10" to-fixed="4"/>
                    <lm-input label="纬度：" v-model="form.lat" type="idcard"/>
                  </el-row>
                  <el-row>
                    <lm-input label="电话：" v-model="form.tess " type="tel"/>
                    <lm-input label="身份证：" v-model="form.idcard" type="idcard"/>
                  </el-row>
                    <lm-up-img :limit="6" action="/admin/sys-file/upload" :other-data="otherData" :file-list="imgList"/>
                    <lm-up-file action="/admin/sys-file/upload" :other-data="otherData" :file-list="fileList">
                      <template #filePrev="{file}">
                        <lm-input v-model="file.fileText"></lm-input>
                      </template>
                    </lm-up-file>
                </el-form>
                <div class="rowCenter">
                    <el-button type="primary" @click="save" style="width:120px;">保存</el-button>
                </div>
            </div>
        </div>
        <div>
            <el-button type="primary" @click="showDialog=true">{{ dialogText || '打开弹窗' }}</el-button>
        </div>
        <lm-dialog v-if="showDialog" @cancel="showDialog=false" @closeDialog="closeDialog" @sure="sure">
            <span>弹窗内容</span>
        </lm-dialog>
    </div>
</template>

<script>
    import {formatDate} from "../../packages/utils/lm-methods";
    import LmCanlendarComponent from '../components/lm-canlendar-component'
    export default {
        components: {
            LmCanlendarComponent
        },
        data() {
            return {
              otherData:{ bucketName: 'smart-park'},
              form:{address:{cityId:'520100',provinceId:'520000',districtId:'520102',street:'dd',}},//保单
                cascaders:[
                    {
                        name:'建筑工程',
                        value:'jz',
                        children:[
                            {
                                name:'一级',
                                value:'jzc1'
                            },
                            {
                                name:'二级',
                                value:'jzc2'
                            }
                        ]
                    },
                    {
                        name:'水利工程',
                        value:'sl',
                        children:[
                            {
                                name:'一级',
                                value:'slc1',
                                children:[
                                    {
                                        name:'一级AA',
                                        value:'slc1aa'
                                    },
                                    {
                                        name:'一级AB',
                                        value:'slc1ab'
                                    },
                                    {
                                        name:'一级AC',
                                        value:'slc1ac'
                                    },
                                ]
                            }
                        ]
                    }
                ],
                showDialog:false,//是否显示弹窗
                dialogText:'',//弹窗文字
              fileList:[],//
              imgList:[]
            }
        },
        computed: {
        },
        mounted() {
          // setTimeout(()=>{
          //   this.form={
          //     address:{cityId:'520100',provinceId:'520000',districtId:'520102',street:'dd',}
          //   }//保单
          // },1000)
          //

        },
        methods: {
          disableDate(time,cDate,type,planType){
            if(!cDate){
              // if(/First/.test(planType) || /Two/.test(planType)){
              //   let timeYear=time.getFullYear()
              //   let timeMonth=time.getMonth()
              //   let timeDate=time.getDate()
              //   let timeDay=time.getDay()
              //   let timeMonthStart=new Date(timeYear,timeMonth,1)
              //   let timeMonthEnd=new Date((new Date(timeYear,timeMonth + 1,1)).getTime() - 1000 * 60 * 60* 24)
              //   if(/First/.test(planType)){
              //     if(time<timeMonthStart){
              //       return  true
              //     }
              //     if(time>timeMonthEnd){
              //       return  true
              //     }
              //   }
              // }

              return  false
            }
            let chooseDate=new Date(cDate)
            let nowYear=chooseDate.getFullYear()
            let nowMonth=chooseDate.getMonth()
            let nowDate=chooseDate.getDate()
            let nowDay=chooseDate.getDay()
            let weekStart=new Date(nowYear,nowMonth,nowDate - nowDay +1)
            let weekEnd=new Date(nowYear,nowMonth,nowDate + (7 - nowDay))
            let monthStart=new Date(nowYear,nowMonth,1)
            let monthEnd=new Date((new Date(nowYear,nowMonth + 1,1)).getTime() - 1000 * 60 * 60* 24)
            let monthMiddle=monthStart.getTime()+(monthEnd.getTime()-monthStart.getTime())/2
            let yearStart = new Date(nowYear, 0, 1);
            let yearEnd = new Date((new Date(nowYear + 1, 1, 1)).getTime() - 1000 * 60 * 60* 24)
            let dateObj={
              weekStart,
              weekEnd,
              monthStart,
              monthEnd,
              halfMonthFirstStart:monthStart,
              halfMonthFirstEnd:monthMiddle,
              halfMonthTwoStart:monthMiddle,
              halfMonthTwoEnd:monthEnd,
              yearStart,
              yearEnd
            }

            if(time<dateObj[`${planType}Start`]){
              return true
            }
            if(time>dateObj[`${planType}End`]){
              return  true
            }
            if(type==='end'){
              //判断的是后一个
              if(time<chooseDate){
                return  true
              }
            }
            if(type==='start'){
              //判断的是前一个
              if(time>chooseDate){
                return  true
              }
            }
            return  false
          },
          // 获取本月
          getMonth (nowYear,nowMonth,nowDate,nowDay) {
            var MonthStart = new Date(nowYear,nowMonth,1);
            var MonthEnd = new Date((new Date(nowYear,nowMonth + 1,1)).getTime() - 1000 * 60 * 60* 24);
            return [formatDate(MonthStart),formatDate(MonthEnd)];
          },
            save(){
              console.log(this.fileList)
              console.log(this.imgList)
            },
            sure(){
                this.dialogText='点击确定'
                this.showDialog=false
                setTimeout(()=>{
                    this.dialogText='打开弹窗'
                },2000)
            },
            closeDialog(){
                this.dialogText='点击取消或关闭'
                this.showDialog=false
                setTimeout(()=>{
                    this.dialogText='打开弹窗'
                },2000)
            },
          getLngLatInfo({lng,lat}){
              this.$set(this.form,'lng',lng)
              this.$set(this.form,'lat',lat)
          },
          addressChange(value){
              console.log(value)
          },
          onkeydown(event){
              console.log(event)
          }

        },

    }
</script>

<style scoped lang="scss">
    .exampleBox{
        padding:20px;
        .lm-ui-title{
            font-size:20px;
            margin-bottom:20px;
        }
        .componentBtnBox{
            padding:20px;
            background:#dddddd;
        }
        .componentsBox{
            flex-wrap:wrap;
            align-items: flex-start;
        }


    }
</style>


