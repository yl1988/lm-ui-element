<!--批量操作按钮-->
<template>
    <div class="multi-option-btns-box rowStart">
        <el-button type="primary" @click="showMultiOption" size="mini">{{optionTitle}}</el-button>
        <div v-if="showMulti" class="rowStart"  style="margin-left:20px;">
            <el-button
                    v-for="(btn,index) in options"
                    :key="index"
                    :type="activeOption===index ? btn.type : undefined"
                    @click="getMultiOption(index)"
                    :size="size"
            >{{btn.text}}</el-button>
            <slot name="appendContent"></slot>
            <div class="rowStart sureCancelBtn">
                <el-button type="primary" @click="sureMultiOption" size="mini">{{sureText || '确定'}}</el-button>
                <el-button @click="cancelMultiOption" size="mini">{{cancelText || '关闭'}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'LmMultiOptionBtns',
        props:{
            optionTitle:{
                type:String,
                default:'批量操作'
            },//操作按钮文字
            options:{
                type:Array,
                default:()=>[]
            },//操作配置
            size:{
                type:String,
                default:'mini'
            },//尺寸
            showIsOpenReport:Boolean,//是否显示是否开启上报
            selectData:{
                type:Array,
                default:()=>[]
            },//选择的数据
            sureToastText:String,//点击确定提示语
            activeIndex:Number,//默认选中的按钮
            sureText:String,//确定文字
            cancelText:String,//取消文字
        },
        data() {
            return {
                activeOption:null,//选中的操作
                showMulti:false,//是否显示批量操作
            }
        },
        computed: {},
        mounted() {
            if(typeof this.activeIndex==='number'){
                this.activeOption=this.activeIndex
            }
        },
        methods: {
            //显示批量操作
            showMultiOption(){
                if(this.showMulti){
                    this.cancelMultiOption()
                    return
                }
                this.showMulti=true
            },
            //确定批量操作
            sureMultiOption(){
                let {activeOption}=this
                if(activeOption===null){
                    return
                }
                if(!this.selectData.length){
                    this.$message.warning(this.sureToastText || '请先选择数据')
                    return
                }
                if(activeOption===null){
                    this.$message.warning('请先选择操作类型')
                    return
                }
                this.$emit('sure',activeOption)
            },
            //取消批量操作
            cancelMultiOption(){
                this.showMulti=false
                this.selectData.splice(0)
                this.activeOption=null
                this.$emit('cancel')
            },
            //获取多选操作类型
            getMultiOption(index){
                //type 0进场状态，退场操作 1退场状态，进场操作
                // this.$emit('setSelectData',[])
                this.selectData.splice(0)
                this.activeOption=index
                this.$emit('getMultiOptionIndex',index)
            },
        },
        watch:{
            activeIndex:function (v) {
                if(typeof v==='number'){
                    this.activeOption =v
                    this.showMulti=true
                }else{
                    this.activeOption =null
                    this.showMulti=false
                }
            },
        },

    }
</script>

<style scoped lang="scss">
    .multi-option-btns-box{
        margin-left:40px;
        .sureCancelBtn{
            margin:0 20px 0 40px;
        }
    }
</style>
