<!--选择地址，搭配高德地图使用-->
<template>
  <el-row>
    <el-form-item :label="label" class="addressFormItemBox" :required="required" :prop="addressProp" :style="{'margin-bottom':isEdit ? '22px' : '0'}">
      <div v-if="isEdit" class="rowStart">
        <el-select class="addressFormItem" :size="size" :value="address.provinceId" @input="changeProvince" placeholder="请选择" :filterable="filterable" :style="{width:lmSelectWidth}" :disabled="typeof disabled==='boolean' ? disabled : (!!disabled[3] || !!disabled[2] || !!disabled[1] || !!disabled[0])">
          <el-option
              v-for="item in provinceList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
        <el-select class="addressFormItem" :size="size" :value="address.cityId" @change="changeCity" placeholder="请选择" :filterable="filterable" :style="{width:lmSelectWidth}" :disabled="typeof disabled==='boolean' ? disabled : (!!disabled[3] || !!disabled[2] || !!disabled[1])">
          <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
        <el-select class="addressFormItem" v-if="isNotTwoLevels" :size="size" :value="address.districtId" @change="changeDistrict" placeholder="请选择" :filterable="filterable" :style="{width:lmSelectWidth}" :disabled="typeof disabled==='boolean' ? disabled : (!!disabled[3] || !!disabled[2])">
          <el-option
              v-for="item in districtList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
        <div v-if="showStreet" style="flex:1;">
          <el-autocomplete
              class="addressFormInput"
              v-if="elAuto" :style="{width:streetInputWidth}" :size="size" placeholder="请输入"
              :value="address.street" :maxlength="maxlength"
              @blur="streetBlur" @input="streetInput"
              @select="inputAutoSelect" :fetch-suggestions="inputQuerySearch"
              :value-key="valueKey" :placement="placement" :trigger-on-focus="triggerOnFocus"
              :disabled="typeof disabled==='boolean' ? disabled : !!disabled[3]"
          >
            <template slot-scope="{ item }">
              <div class="autoCompleteBox columnStart" :style="{'max-width':streetInputWidth}">
                <span class="name" :style="{'max-width':streetInputWidth}">{{ item.addTitle }}</span>
                <span class="addr gray999" v-show="item.address">{{ item.address }}</span>
              </div>
            </template>
          </el-autocomplete>
          <el-input
              v-else
              class="addressFormInput"
              :style="{width:streetInputWidth}"
              :size="size" placeholder="请输入"
              :value="address.street"
              @blur="streetBlur" @input="streetInput"
              :maxlength="maxlength"
              :disabled="typeof disabled==='boolean' ? disabled : !!disabled[3]"
          ></el-input>
        </div>
      </div>
      <span v-else>{{fullAddress}}</span>
    </el-form-item>
  </el-row>
</template>

<script>
import {isNumber} from "../../utils/lm-validate";
import provinceList from './province.json'
import citys from './city.json'
import districts from './district.json'
import xhlHttp from '../../utils/xml-http'
import { jsonp } from '../../utils/jsonp'
export default {
  name: 'LmAddress',
  props: {
    required: {
      type: Boolean,
      default: true
    },//是否必须
    label: {
      type: String,
      default: '选择地址：'
    },//标题
    showStreet: {
      type: Boolean,
      default: true
    },//是否显示输入详情地址
    defaultAddress: Object,//默认地址
    isEdit: {
      type: Boolean,
      default: true
    },//是否可编辑
    size: String,//尺寸
    inputWidth: {
      type: [Number, String],
      default: '100%'
    },
    addressProp: {
      type: String,
      default: 'address'
    },//用于校验的prop字段
    filterable: {
      type: Boolean,
      default: true
    },//是否可搜索
    elAuto: {
      type: Boolean,
      default: true
    },//是否选择el-autocomplete组件
    valueKey: {
      type: String,
      default: 'name'
    },//输入建议对象中用于显示的键名
    placement: String,//菜单弹出位置
    triggerOnFocus: Boolean,//是否在输入框 focus 时显示建议列表
    maxlength:[String,Number],//地址输入框的最大长度
    selectWidth:[Number,String],//下拉框宽度
    disabled:[Boolean,Array],//是否可见
    value:Object,//值
    getLngLat:{
      type:Boolean,
      default:true
    },//是否获取默认经纬度
    amapKey:String,//高德地图key
    bmapKey:String,//百度地图key
    bmapRetCoordtype:{
      type:String,
      default:'gcj02ll'
    },//坐标系类型
  },
  data() {
    return {
      address: {},//地址
      isNotTwoLevels: false,//是否直辖市
      provinceList:Object.freeze(provinceList),//省数据
      cityList: Object.freeze([]),//市
      districtList: Object.freeze([]),//县
      fullAddress: '',//地址全部信息
      addressArea: [],//地址数组数据
      streetInputWidth: 'auto',//地址输入框宽度
      getDefault: false,//是否获取了默认值
      isFilter: false,//是否是筛选
      hasLngLag: false,//是否有经纬度
      lmSelectWidth:'150px',//下拉框宽度
    }
  },
  async mounted() {
    let {inputWidth,selectWidth,lmSelectWidth} = this
    this.streetInputWidth = (typeof inputWidth === 'number' || isNumber(inputWidth)) ? (inputWidth + 'px') : inputWidth
    this.lmSelectWidth = (typeof selectWidth === 'number' || isNumber(selectWidth)) ? (selectWidth + 'px') : lmSelectWidth
    if(this.value){
      this.address =JSON.parse(JSON.stringify(this.value))
      this.handleGetCityAndDistrict(this.value)
    }else{
      if(this.defaultAddress){
        this.address =JSON.parse(JSON.stringify(this.defaultAddress))
        this.handleGetCityAndDistrict(this.defaultAddress)
      }
    }


  },
  methods: {
    // // 点击切换省份
    changeProvince(val) {
      this.$set(this.address, 'provinceId', val)
      this.$set(this.address, 'cityId', '')
      this.$set(this.address, 'districtId', '')
      this.$set(this.address, 'street', '')
      this.districtList = []
      this.cityList = citys[val]
      let thisProvince = this.provinceList.filter((item) => item.id === val)
      this.addressArea[1] = this.addressArea[2] = ''
      this.addressArea[0] = thisProvince[0].name
      this.address.addressArea = this.addressArea
      this.$emit('input', this.address)
      this.$emit('addressChange',this.address)
      this.$emit('provinceChange',this.address)
    },
    // // 点击切换城市
    changeCity(val) {
      this.districtList = districts[val] || []
      this.isNotTwoLevels=!!this.districtList.length
      this.$set(this.address, 'cityId', val)
      this.$set(this.address, 'districtId', '')
      let thisCity = this.cityList.filter(item => item.id === val)
      this.addressArea[2] = ''
      this.addressArea[1] = thisCity[0].name
      this.address.addressArea = this.addressArea
      this.$emit('input', this.address)
      this.$emit('addressChange',this.address)
      this.$emit('cityChange',this.address)
    },
    // 点击切换区县
    async changeDistrict(val) {
      let {districtList} = this
      this.$set(this.address, 'districtId', val)
      this.hasLngLag = false
      let thisdistrictList = districtList.filter(item => item.id === val)
      this.addressArea[2] = thisdistrictList[0].name
      this.getLngLat && !this.hasLngLag && this.addressArea[3] && this.getLngLatFun(this.addressArea.join(''))
      this.address.addressArea = this.addressArea
      this.address.showStreet = this.showStreet
      this.$emit('input', this.address)
      this.$emit('addressChange',this.address)
      this.$emit('districtChange',this.address)
    },
    //详细地址改变
    streetBlur(e) {
      this.addressArea[3] = e.target.value
      this.hasLngLag = false
      if (this.isNotTwoLevels) {
        this.getLngLat && !this.hasLngLag && this.addressArea[2] && this.addressArea[3] && this.getLngLatFun(this.addressArea.join(''))
      } else {
        this.getLngLat && !this.hasLngLag && this.addressArea[1] && this.addressArea[3] && this.getLngLatFun(this.addressArea.join(''))
        this.address.districtId = this.address.cityId
        this.addressArea[2] = this.addressArea[1]
      }
      // console.log(this.addressArea)
      this.address.addressArea = this.addressArea
      let {isNotTwoLevels, showStreet} = this
      this.address = {...this.address, addressArea: this.addressArea, isNotTwoLevels, showStreet}
      this.$emit('input', this.address)
      this.$emit('streetChange', this.address)
    },
    //输入框输入内容
    async streetInput(value){
      value=value.trim()
      this.$set(this.address,'street',value)
      this.$emit('input', this.address)
      this.$emit('addressChange',this.address)
    },
    //输入框搜索点击完成
    inputAutoSelect(item) {
      this.addressArea[3] = item.name
      this.hasLngLag = true
      this.$emit('getLngLatInfo', {
        lng: item.lng,
        lat: item.lat,
      })
    },
    //输入框返回建议数据
    async inputQuerySearch(queryString, cb) {
      let inputQueryData=[]
      if(queryString || this.addressArea.length){
        let searchAddressArea=JSON.parse(JSON.stringify(this.addressArea))
        searchAddressArea.splice(3)
        ;(searchAddressArea[1]===searchAddressArea[2]) && (searchAddressArea.splice(2,1))
        // console.log(searchAddressArea)
        let searchValue=searchAddressArea.join('')+(queryString || '')
        let addressInfos=await this.getSearchAddresList(searchValue,queryString)
        inputQueryData=addressInfos instanceof Array ? addressInfos.reduce((result,current)=>{
          let {name,address,location={},title,point={}}=current
          name=name || title
          typeof address !=='string' && (address='')
          if(typeof location==='string'){
            let locationArr=location.split(',')
            location={
              lng:locationArr[0],
              lat:locationArr[1]
            }
          }
          if(!(Object.keys(location).length)){
            location=point
          }
          result.push({
            name:name+' '+address,
            address,
            lng:location.lng,
            lat:location.lat,
            addTitle:name
          })
          return result
        },[]) : []
        cb(inputQueryData.filter(item=>item[this.valueKey].toLowerCase().indexOf(queryString.toLowerCase()) === 0))
      }
    },
    //搜索提示
    getSearchAddresList(keywords) {
      let {provinceId, cityId, districtId} = this.address
      let city = districtId || cityId || provinceId
      let {amapKey,bmapKey,bmapRetCoordtype}=this
      if(!window.AMap && !window.BMapGL && !window.BMap && !amapKey && !bmapKey){
        console.error('获取地图实例失败,请确保正确引入并初始化高德或者百度地图，或者传入正确的高德地图或者百度地图web api Key')
        return
      }
      return new Promise((resolve,reject) => {
        if(amapKey){
          //高德地图服务api
          xhlHttp({
            url:"https://restapi.amap.com/v3/place/text",
            params:{
              key:amapKey,
              keywords,
              city
            }
          }).then(res=>{
            let {status,info}=res
            if(status==='1'){
              resolve(res.pois)
            }else{
              reject(info)
            }
          })
          .catch(err=>{
            reject(err)
          })
        }else if(bmapKey){
          //百度地图服务api
          jsonp('http://api.map.baidu.com/place/v2/suggestion', {
            ak:bmapKey,
            query:keywords,
            region:this.addressArea[1],
            city_limit:true,
            output:'json',
            ret_coordtype:bmapRetCoordtype
          }).then(res=>{
            let {status,message,result}=res
            if(status===0){
              resolve(result)
            }else{
              reject(message)
            }
          }).catch(err=>{
            reject(err)
          })
        }else if(window.AMap){
          //高德地图实例
          let {version}=AMap
          window.AMap.plugin(/^2\./.test(version) ? 'AMap.AutoComplete' : 'AMap.Autocomplete', () => {
            // 实例化Autocomplete
            let autoComplete = /^2\./.test(version) ? new AMap.AutoComplete({city}) : new AMap.Autocomplete({city})
            autoComplete.search(keywords, (status, result) => {
              // 搜索成功时，result即是对应的匹配数据
              if (status === 'complete' && result.info === 'OK') {
                // result为对应的地理位置详细信息
                resolve(result.tips)
              }
            })
          })
        }else{
          //百度地图实例
          let option={onSearchComplete:result=> resolve(result.Br)}
          let local = window.BMapGL ? new BMapGL.LocalSearch(this.addressArea[1], option) : new BMap.LocalSearch(this.addressArea[1], option)
          local.search(keywords)
        }
      })
    },
    // 根据省ID获取市县
    async handleGetCityAndDistrict({provinceId, cityId, districtId, street}) {
      if (!(provinceId && cityId)){
        return
      }
      this.cityList = citys[provinceId] || []
      this.districtList = districts[cityId]
      this.isNotTwoLevels = !!this.districtList.length
      let provinceInfo=provinceId ? this.provinceList.filter(item => item.id === provinceId)[0] : null
      let province = provinceInfo ? provinceInfo.name : ''
      let cityInfo=cityId ? this.cityList.filter(item => item.id === cityId)[0] : null
      let city = cityInfo ? cityInfo.name : ''
      let district=''
      if(districtId){
        let districtInfo=this.districtList.filter(item => item.id === districtId)[0]
        districtInfo && (district=districtInfo.name )
      }
      this.fullAddress = `${province} ${city} ${district} ${street}`
      this.addressArea = [province, city]
      this.addressArea[3] = street
      if (district) {
        this.addressArea[2] = district
      } else {
        this.addressArea[2] = city
      }
      //有默认值，并且需要获取默认经纬度时，获取经纬度
      if(this.getLngLat){
        if(this.isNotTwoLevels){
          if(this.addressArea[0] && this.addressArea[1] && this.addressArea[2] && this.addressArea[3]){
            this.getLngLatFun(this.addressArea.join(''))
          }
        }else{
          if(this.addressArea[0] && this.addressArea[1] && this.addressArea[2]){
            this.getLngLatFun(this.addressArea.join(''))
          }
        }
      }
      this.address.addressArea=this.addressArea
      this.$emit("input", this.address)
    },
    //通过地址查询经纬度
    getLngLatFun(address) {
      if (!address) return
      let {amapKey,bmapKey,bmapRetCoordtype}=this
      if(!window.AMap && !window.BMapGL && !window.BMap && !amapKey && !bmapKey){
        console.error('获取地图实例失败,请确保正确引入并初始化高德或者百度地图，确保window.AMap 或 window.BMap有值，或者传入正确的web api Key:高德地图key amapKey或者百度地图bmapKey key')
        return
      }
      let {provinceId, cityId, districtId} = this.address
      let city = districtId || cityId || provinceId
      return new Promise((resolve,reject) => {
        if(amapKey){
          //高德地图服务api
          xhlHttp({
            url:"https://restapi.amap.com/v3/geocode/geo",
            params:{
              key:amapKey,
              address,
              city
            }
          }).then(res=>{
            let {status,info}=res
            if(status==='1'){
              let {location}=res.geocodes[0] || {}
              let locationArr=location.split(',')
              let lng=locationArr[0]
              let lat=locationArr[1]
              this.$emit('getLngLatInfo', {lng, lat})
              resolve({lng, lat})
            }else{
              reject(info)
            }
          })
            .catch(err=>{
              reject(err)
            })
        }else if(bmapKey){
          //百度地图服务api
          jsonp('http://api.map.baidu.com/geocoding/v3/', {
            ak:bmapKey,
            address,
            city,
            output:'json',
            ret_coordtype:bmapRetCoordtype
          }).then(res=>{
            let {status,result}=res
            if(status===0) {
              let {lng, lat} = result.location || {}
              this.$emit('getLngLatInfo', {lng, lat})
              resolve({lng, lat})
            }
          }).catch(err=>{
            reject(err)
          })
        }else if(window.AMap){
          //高德地图实例
          window.AMap.plugin('AMap.Geocoder', () => {
            let geocoder = new AMap.Geocoder({})
            geocoder.getLocation(address, (status, result) => {
              // console.log(result)
              let {geocodes = []} = result
              // //console.log(geocodes)
              if(!(geocodes instanceof Array) || !geocodes.length){
                resolve({})
              }
              let {lng, lat} = geocodes[0].location
              this.$emit('getLngLatInfo', {lng, lat})
              resolve({lng, lat})
            })
          })
        }else{
          //百度地图实例
          let bmapGeoInstance=window.BMapGL ? new BMapGL.Geocoder() : new BMap.Geocoder()
          bmapGeoInstance.getPoint(address, point=>{
            if(point){
              let {lng, lat} = point
              this.$emit('getLngLatInfo', {lng, lat})
              resolve({lng, lat})
            }
          }, this.addressArea[1])
        }

      })
    },
    //设置所有地址
    setFullAddress(fullAddress){
      this.fullAddress =fullAddress
    }
  },
  watch: {
    value:function (value,oldValue){
      if(JSON.stringify(value)===JSON.stringify(oldValue)){
        return
      }
      this.address = value
      if (!value || !Object.keys(value).length) {
        //没有数据时，清空
        this.address = {}
        this.cityList = []
        this.districtList = []
      }
      this.handleGetCityAndDistrict(value)
    },
  },
}
</script>
