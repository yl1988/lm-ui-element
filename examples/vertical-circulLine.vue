<!--// 点线组件-->
<template>
    <div class="columnCenter verticalCirculLineBox" :style="{height:(index===(length-1)) ? (lastHeight || height) : height,top:offsetTop,}">
        <span class="verticalCirculLineCircle" :style="{background:color,width:size,height:size}"></span>
        <span class="verticalCirculLine" :style="{background:color,width:lineWidth}"></span>
    </div>
</template>
<script>
    // 点线组件
    export default {
        name: "VerticalCirculLine",
        components: {},
        props: {
            color:{
                type:String,
                default:'#248BFE'
            },//颜色
            height:{
                type:String,
                default:"20px"
            },//每一个分段高度
            lastHeight:String,//最后一段的高度
            index:Number,//下标
            length:Number,//总长度
            size:{
                type:[String,Number],
                default:'10px'
            },//圆点大小
            lineWidth:{
                type:[String,Number],
                default:'1px'
            },//线宽度
            offsetTop:{
                type:String,
                default:'0'
            },//离顶部移动距离
        },
        data() {
            return {}
        },
        computed: {},
        methods: {},
        mounted() {

        },
        watch: {}
    }
</script>
<style scoped lang="scss">
    .verticalCirculLineBox{
        align-self: flex-start;
        position: relative;
        .verticalCirculLineCircle{
            border-radius:50%;
        }
        .verticalCirculLine{
            flex:1;
        }
    }
    
</style>
