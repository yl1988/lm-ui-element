<!--选择地址，搭配高德地图使用-->
<template>
    <el-row>
        <el-form-item :label="label" class="addressFormItemBox" :required="required" :prop="addressProp" :style="{'margin-bottom':isEdit ? '22px' : '0'}">
            <div v-if="isEdit" class="rowStart">
                <el-select class="addressFormItem" :size="size" :value="address.provinceId" @input="changeProvince" placeholder="请选择" :id="lmRef[0]" :filterable="filterable" :style="{width:lmSelectWidth}" >
                    <el-option
                            v-for="item in provinceList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-select class="addressFormItem" :size="size" :value="address.cityId" @change="changeCity" placeholder="请选择" :filterable="filterable" :style="{width:lmSelectWidth}" >
                    <el-option
                            v-for="item in cityList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-select class="addressFormItem" v-if="isNotTwoLevels" :size="size" :value="address.districtId" @change="changeDistrict" placeholder="请选择" :filterable="filterable" :style="{width:lmSelectWidth}" >
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
                            v-bind="$attrs"
                            v-on="$listeners"
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
                            v-bind="$attrs"
                            v-on="$listeners"
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
            defaultAddress: {
                type: Object,
                default: () => {
                    return {}
                }
            },//默认地址
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
            lmRef: {
                type: Array,
                default: () => []
            },//标志以及下一次跳转标志
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
                inputQueryData: Object.freeze([]),///输入框建议数据
                hasLngLag: false,//是否有经纬度
                lmSelectWidth:'150px',//下拉框宽度
            }
        },
        async mounted() {
            let {inputWidth,selectWidth,lmSelectWidth} = this
            this.streetInputWidth = (typeof inputWidth === 'number' || isNumber(inputWidth)) ? (inputWidth + 'px') : inputWidth
            this.lmSelectWidth = (typeof selectWidth === 'number' || isNumber(selectWidth)) ? (selectWidth + 'px') : lmSelectWidth
            this.address = this.defaultAddress
            let {cityId, provinceId, districtId, street} = this.defaultAddress
            this.handleGetCityAndDistrict(provinceId, cityId, districtId, street)
        },
        methods: {
            // // 点击切换省份
            changeProvince(val) {
                this.$set(this.address, 'provinceId', val)
                this.$set(this.address, 'cityId', '')
                this.$set(this.address, 'districtId', '')
                this.$set(this.address, 'street', '')
                this.districtList = []
                this.inputQueryData = []
                this.cityList = citys[val]
                let thisProvince = this.provinceList.filter((item) => item.id === val)
                this.addressArea[1] = this.addressArea[2] = ''
                this.addressArea[0] = thisProvince[0].name
                this.address.addressArea = this.addressArea
                this.$emit('input', this.address)
                this.$emit('addressChange',this.address)
            },
            // // 点击切换城市
            changeCity(val) {
                this.districtList = districts[val] || []
                this.isNotTwoLevels=!!this.districtList.length
                this.$set(this.address, 'cityId', val)
                this.$set(this.address, 'districtId', '')
                this.inputQueryData = []
                let thisCity = this.cityList.filter(item => item.id === val)
                this.addressArea[2] = ''
                this.addressArea[1] = thisCity[0].name
                this.address.addressArea = this.addressArea
                this.$emit('input', this.address)
                this.$emit('addressChange',this.address)
            },
            // 点击切换区县
            async changeDistrict(val) {
                let {districtList} = this
                this.$set(this.address, 'districtId', val)
                this.inputQueryData = []
                this.hasLngLag = false
                let thisdistrictList = districtList.filter(item => item.id === val)
                this.addressArea[2] = thisdistrictList[0].name
                !this.hasLngLag && this.addressArea[3] && this.getLngLatFun(this.addressArea.join(''))
                this.address.addressArea = this.addressArea
                this.address.showStreet = this.showStreet
                this.$emit('input', this.address)
                this.$emit('addressChange',this.address)
            },
            //详细地址改变
            streetBlur(e) {
                this.addressArea[3] = e.target.value
                this.hasLngLag = false
                if (this.isNotTwoLevels) {
                    !this.hasLngLag && this.addressArea[2] && this.addressArea[3] && this.getLngLatFun(this.addressArea.join(''))
                } else {
                    !this.hasLngLag && this.addressArea[1] && this.addressArea[3] && this.getLngLatFun(this.addressArea.join(''))
                    this.address.districtId = this.address.cityId
                }
                //console.log(this.addressArea)
                this.address.addressArea = this.addressArea
                let {isNotTwoLevels, showStreet} = this
                this.address = {...this.address, addressArea: this.addressArea, isNotTwoLevels, showStreet}
                this.$emit('input', this.address)
            },
            //输入框输入内容
            async streetInput(value) {
                this.$set(this.address, 'street', value)
                this.$emit('input', this.address)
                this.$emit('addressChange',this.address)
                if (value) {
                    let addressInfos = await this.getSearchAddresList(value)
                    this.inputQueryData = addressInfos instanceof Array ? addressInfos.reduce((result, current) => {
                        let {name, address, location = {}} = current
                        typeof address !== 'string' && (address = '')
                        result.push({
                            name: name + ' ' + address,
                            address,
                            lng: location.lng,
                            lat: location.lat,
                            addTitle: name
                        })
                        return result
                    }, []) : []
                }
            },
            //输入框搜索点击完成
            inputAutoSelect(item) {
                //console.log(item)
                this.addressArea[3] = item.name
                this.hasLngLag = true
                this.$emit('getLngLatInfo', {
                    lng: item.lng,
                    lat: item.lat,
                })
            },
            //输入框返回建议数据
            inputQuerySearch(queryString, cb) {
                let {inputQueryData} = this
                let results = queryString ? inputQueryData.filter(this.createFilter(queryString)) : inputQueryData
                // 调用 callback 返回建议列表的数据
                cb(results)
            },
            //筛选显示的输入框数据
            createFilter(queryString) {
                let {valueKey} = this
                return (restaurant) => {
                    return (restaurant[valueKey].toLowerCase().indexOf(queryString.toLowerCase()) === 0)
                }
            },
            //搜索提示
            getSearchAddresList(keyword) {
                let {provinceId, cityId, districtId} = this.address
                let city = districtId || cityId || provinceId
                if(!window.AMap){
                    console.error('获取高德地图实例window.AMap失败,请确保正确引入并初始化高德地图')
                    return
                }
                return new Promise((resolve) => {
                    window.AMap.plugin('AMap.Autocomplete', () => {
                        // 实例化Autocomplete
                        let autoOptions = {
                            //city 限定城市，默认全国
                            city
                        }
                        let autoComplete = new AMap.Autocomplete(autoOptions);
                        autoComplete.search(keyword, (status, result) => {
                            // 搜索成功时，result即是对应的匹配数据
                            if (status === 'complete' && result.info === 'OK') {
                                // result为对应的地理位置详细信息
                                resolve(result.tips)
                            }
                        })
                    })
                })

            },

            // 根据省ID获取市县
            async handleGetCityAndDistrict(provinceId, cityId, districtId, street) {
                if (provinceId && cityId) {
                    this.getDefault = true
                    this.cityList = citys[provinceId] || []
                    this.districtList = districts[cityId]
                    this.isNotTwoLevels = !!this.districtList.length
                    let province = provinceId ? this.provinceList.filter(item => item.id === provinceId)[0].name : ''
                    let city = cityId ? this.cityList.filter(item => item.id === cityId)[0].name : ''
                    let district = cityId === districtId ? '' : (districtId ? this.districtList.filter(item => item.id === districtId)[0].name : '')
                    this.fullAddress = `${province} ${city} ${district} ${street}`
                    this.addressArea = [province, city]
                    if (district) {
                        this.addressArea[2] = district
                        this.addressArea[3] = street
                    } else {
                        this.addressArea[2] = street
                    }
                }
            },
            //通过地址查询经纬度
            getLngLatFun(address) {
                if (!address) return
                if(!window.AMap){
                    console.error('获取高德地图实例window.AMap失败,请确保正确引入并初始化高德地图')
                    return
                }
                return new Promise((resolve) => {
                    window.AMap.plugin('AMap.Geocoder', () => {
                        let geocoder = new AMap.Geocoder({})
                        geocoder.getLocation(address, (status, result) => {
                            // //console.log(result)
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
                })
            },
            //设置所有地址
            setFullAddress(fullAddress){
                this.fullAddress =fullAddress
            }
        },
        watch: {
            defaultAddress: {
                deep: true,
                handler: async function (value) {
                    if (!value || !Object.keys(value).length) {
                        //没有数据时，清空
                        this.address = {}
                        this.cityList = []
                        this.districtList = []
                        this.getDefault = false
                    }
                  this.address = value || {}
                    let {cityId, provinceId, districtId, street} = value
                    //有数据时只允许更新一次
                    if (this.getDefault) return
                    this.handleGetCityAndDistrict(provinceId, cityId, districtId, street)
                }
            },
        },
    }
</script>
