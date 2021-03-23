
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
                        <lm-input label="姓名：" v-model="form.name" maxlength="50"></lm-input>
                        <lm-select label="学历：" v-model="form.stuty" :list="['文盲','小学','初中','高中','中专','大专','本科','硕士','博士']"/>
                    </el-row>
                    <el-row>
                        <lm-date-time label="入学日期：" v-model="form.date" form-type="rangeDateTime" date-time-type="datetime"/>
                        <lm-cascader label="证书：" :options="cascaders"/>
                    </el-row>
                    <lm-address label="住址："
                                v-model="form.address" :required="false"
                                @getLngLatInfo="getLngLatInfo"

                                @addressChange="addressChange"
                                :disabled="[false,false,false,false]"
                    />
<!--                  :defaultAddress="{cityId:'520100',provinceId:'520000',districtId:'520102',street:'dd',}"-->
                  <el-row>
                    <lm-input label="经度：" v-model="form.lng" type="number" maxlength="10" to-fixed="4"/>
                    <lm-input label="纬度：" v-model="form.lat" type="idcard"/>
                  </el-row>
                  <el-row>
                    <lm-input label="电话：" v-model="form.tess " type="tel"/>
                    <lm-input label="身份证：" v-model="form.idcard" type="idcard"/>
                  </el-row>
                    <lm-up-img :limit="6"/>
                    <lm-up-file :limit="4"/>
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
        },
        methods: {
            save(){},
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


