<!--自定义弹窗-->
<template>
  <div class="customDialogBox">
    <div class="overy" @click="closeDialog" ref="overy"></div>
    <div class="customDialogWhiteBox" :style="{width:width+'px',background,'padding-bottom':bottomPadding+'px'}">
      <div class="customDialogTitleBox rowBtween" :style="{background:titleBk}">
        <span :style="{color:titleTextColor}">{{title}}</span>
        <div class="rowCenter closeBox"  @click="closeDialog" ref="closeIcon">
          <i class="el-icon-close" :style="{color:titleTextColor}"></i>
        </div>
      </div>
      <div class="customDialogContentBox" ref="customDialogContentBox" :style="{'margin-bottom':contentMarginBottom+'px',padding:contentPadding}">
        <slot></slot>
      </div>
      <div class="confirmCancelFotterBox" v-if="showFooter">
        <slot name="footer">
          <div class="rowCenter">
            <el-button @click="$emit('cancel')" :style="{width:btnWidth,height:btnHeight}">{{backText || '返回'}}</el-button>
            <el-button type="primary" @click="$emit('sure')" :style="{width:btnWidth,height:btnHeight}">{{saveText || '保存'}}</el-button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'CustomDialog',
        props:{
            title:{
                type:String,
                default:''
            },//标题
            width:{
                type:[Number,String],
                default:400
            },//宽度
            background:{
                type:String,
                default:'#ffffff'
            },//背景颜色
            titleHeight:{
                type:[String,Number],
                default:40
            },//标题高度
            titleBk:{
                type:String,
                default:'#545EBC'
            },//标题背景
            titleTextColor:{
                type:String,
                default:'#ffffff'
            },//标题文字颜色
            bottomPadding:{
                type:[Number,String],
                default:30
            },//底部内边距
            contentMarginBottom:{
                type:[Number,String],
                default:30
            },//内容底部外边距
            contentPadding:{
                type:[Number,String],
                default:'30px 20px 10px 20px'
            },//内容区域内边距
            showFooter:{
                type:Boolean,
                default:true
            },//是否显示底部
            saveText:String,//保存按钮文字
            backText:String,//返回按钮文字
            btnWidth:{
                type:String,
                default:'100px'
            },//按钮宽度
            btnHeight:{
                type:String,
                default:'40px'
            },//按钮高度
        },
        data() {
            return {}
        },
        computed: {},
        mounted() {
            // console.log(this.width)
        },
        methods: {
            //关闭弹窗
            closeDialog(){
                this.$emit('closeDialog')
            }
        },

    }
</script>

<style scoped lang="scss">
  @import "../utils/scss/mix";
  .customDialogBox{
    @include positionLeftTopSizeIndex($position:fixed,$z-index:999);
    .overy{
      @include positionLeftTopSizeIndex();
      background:rgba(0,0,0,0.5);
    }
    .customDialogWhiteBox{
      @include positionCenter();
      z-index: 10;
      .customDialogTitleBox{
        padding:0 0 0 20px;
        span{
          font-size:16px;
        }
        .closeBox{
          width:40px;
          height:40px;
        }
      }
      .customDialogContentBox{
        max-height:700px;
        overflow: auto;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }
    }

  }
</style>
