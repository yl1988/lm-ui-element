<!--ExampleForm-->
<template>
  <div>
    <div style="padding-top:60px; width: 1000px">
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <lm-input label="姓名：" v-model="form.name" maxlength="50"></lm-input>
          <lm-select label="学历：" v-model="form.stuty" :list="['文盲','小学','初中','高中','中专','大专','本科','硕士','博士']"/>
        </el-row>
        <el-row>
          <lm-select form-type="radio" label="类型：" v-model="form.type " disabled/>
          <lm-date-time  label="开始时间：" v-model="form.startDate " placeholder="请选择开始时间"/>
        </el-row>
        <el-row v-if="form.type===0">
          <lm-input label="姓名：" v-model="form.name"></lm-input>
          <lm-select label="学历：" v-model="form.stuty" :list="['文盲','小学','初中','高中','中专','大专','本科','硕士','博士']"/>
        </el-row>
        <el-row>
          <lm-cascader label="证书：" :options="cascaders"/>
        </el-row>
        <el-row>
          <lm-date-time :span="24" label="时间" form-type="rangeDateTime" v-model="form.rangeDate" placeholder="请选择时间" width="200"
                        :picker-options="[
                            {disabledDate:(time)=>$lm.dateRangeDisabled(time,[0, form.rangeDate ? (form.rangeDate[1] || new Date()) : new Date(),{endEqual:true}])},
                            {disabledDate:(time)=>$lm.dateRangeDisabled(time,[form.rangeDate ? (form.rangeDate[0] || 0) : 0, new Date(),{startEqual:true}])}
                            ]"/>
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
                    v-model="form.companyAddress" :required="false"
                    @getLngLatInfo="getLngLatInfo"
                    @addressChange="addressChange"
                    :disabled="[false,false,false,false]"
                    :get-lng-lat="getLngLat"
                    bmap-key="rDENPM5Fl6EGPpbdbZGxtzp09NVrMKRB"
        />
        <el-row>
          <lm-input label="经度：" v-model="form.lng" type="number" maxlength="10" to-fixed="4"/>
          <lm-input label="纬度：" v-model="form.lat" type="idcard"/>
        </el-row>
        <el-row>
          <lm-input label="电话：" v-model="form.tess " type="tel" @change="phoneChange"/>
          <lm-input label="身份证：" v-model="form.idcard" type="idcard"/>
        </el-row>
        <lm-up-img :limit="6" action="/admin/sys-file/upload" :other-data="otherData" :file-list="imgList"/>
        <lm-up-file action="/admin/sys-file/upload" :other-data="otherData" :file-list="fileList"/>
      </el-form>
      <div class="rowCenter">
        <el-button type="primary" @click="save" style="width:120px;">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExampleForm',
  data() {
    return {
      otherData:{ bucketName: 'smart-park'},
      form:{},//保单
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
      fileList:[],//
      imgList:[],
      getLngLat:true,
      isStart:false,//
    }
  },
  computed: {},
  mounted() {
    setTimeout(()=>{
      this.form={
        companyAddress:{cityId:'520100',provinceId:'520000',districtId:'520102',street:'dd',}
      }//保单
    },1000)
  },
  methods: {
    disableDate(time,userDate,type,planType){
      if(!userDate){
        if(/First/.test(planType) || /Two/.test(planType)){
          //上半月下半月控制
          let timeYear=time.getFullYear()
          let timeMonth=time.getMonth()
          let timeMonthStart=new Date(timeYear,timeMonth,1)
          let timeMonthEnd=new Date((new Date(timeYear,timeMonth + 1,1)).getTime() - 1000 * 60 * 60* 24)
          let timeMiddle=timeMonthStart.getTime()+(timeMonthEnd.getTime()-timeMonthStart.getTime())/2
          if(/First/.test(planType)){
            if(time>timeMiddle){
              return  true
            }
          }
          if(/Two/.test(planType)){
            if(time<timeMiddle){
              return  true
            }
          }
        }
        return  false
      }
      let chooseDate=new Date(userDate)
      let cYear=chooseDate.getFullYear()
      let cMonth=chooseDate.getMonth()
      let cDate=chooseDate.getDate()
      let cDay=chooseDate.getDay()
      let monthStart=new Date(cYear,cMonth,1)
      let monthEnd=new Date((new Date(cYear,cMonth + 1,1)).getTime() - 1000 * 60 * 60* 24)
      let monthMiddle=monthStart.getTime()+(monthEnd.getTime()-monthStart.getTime())/2
      let dateObj={
        weekStart:new Date(cYear,cMonth,cDate - cDay +1),
        weekEnd:new Date(cYear,cMonth,cDate + (7 - cDay)),
        monthStart,
        monthEnd,
        halfMonthFirstStart:monthStart,
        halfMonthFirstEnd:monthMiddle,
        halfMonthTwoStart:monthMiddle,
        halfMonthTwoEnd:monthEnd,
        yearStart:new Date(cYear, 0, 1),
        yearEnd:new Date((new Date(cYear + 1, 1, 1)).getTime() - 1000 * 60 * 60* 24)
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
    save(){
      console.log(this.fileList)
      console.log(this.imgList)
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
    },
    phoneChange(){
      this.getLngLat=false
    }
  },

}
</script>

<style scoped lang="scss">

</style>
