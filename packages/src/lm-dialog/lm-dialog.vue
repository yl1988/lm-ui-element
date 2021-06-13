<!--自定义弹窗-->
<template>
  <transition name="fade">
  <div class="customDialogBox">
    <div class="overy" @click="overyClick" ref="overy"></div>
    <div class="customDialogWhiteBox dialogTransition" :style="{width:width+'px',background,'padding-bottom':bottomPadding+'px'}" :class="{boxFullScreen:isFullScreen}">
      <div class="customDialogTitleBox rowBtween">
        <el-button type="primary" :style="{background:titleBk}" class="titleBk"></el-button>
        <span class="title font16" :style="{color:titleTextColor}">{{title}}</span>
        <div class="rightBox rowEnd">
          <i class="el-icon-full-screen fullScreenIcon" v-if="!hiddenFullScreen" :style="{color:titleTextColor}" @click="togetherFullScreen"></i>
          <div class="rowCenter closeBox"  @click="close('close')" ref="closeIcon">
            <i class="el-icon-close" :style="{color:titleTextColor}"></i>
          </div>
        </div>

      </div>
      <div class="customDialogContentBox dialogTransition"
           ref="customDialogContentBox"
           :style="{'margin-bottom':contentMarginBottom+'px',padding:contentPadding,...contentBoxStyle,height:contentOriginHeight || 'auto'}"
           :class="{fullScreenContent:isFullScreen}"
      >
        <slot></slot>
      </div>
      <div class="confirmCancelFotterBox" v-if="showFooter">
        <slot name="footer">
          <div class="rowCenter">
            <el-button v-if="showCancel" @click="close('cancel')" :style="{width:btnWidth,height:btnHeight}">{{backText || '返回'}}</el-button>
            <el-button type="primary" @click="sure" :style="{width:btnWidth,height:btnHeight}" :icon="showLoading ? 'el-icon-loading' : ''">{{saveText || '保存'}}</el-button>
          </div>
        </slot>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
    export default {
        name: 'LmDialog',
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
            titleBk:String,//标题背景
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
            showLoading:Boolean,//是否显示保存按钮的加载
            contentBoxStyle:{
                type:Object,
                default:()=>{
                    return {}
                }
            },//内容框样式
          showCancel:{
              type:Boolean,
            default:true
          },//显示返回、取消
          closeOnClickModal:{
            type:Boolean,
            default:true
          },//是否可以通过点击 modal 关闭 Dialog
          hiddenFullScreen:Boolean,//是否隐藏全屏
        },
      data(){
          return {
            isFullScreen:false,//是否是全屏
            contentOriginHeight:0,//内容框默认高度
            contentNochangeOriginHeight:0,//内容框默认高度
          }
      },
        methods: {
            //关闭弹窗
            async close(eventStr){
              await this.startCloseDialogAnimation()
              this.$emit(eventStr)
            },
          //开始关闭时动画
          async startCloseDialogAnimation(){
              return new Promise((resolve)=>{
                if(this.isFullScreen){
                  this.contentOriginHeight=this.contentNochangeOriginHeight+'px'
                  clearTimeout(this.timeOut)
                  clearTimeout(this.screenTime)
                  this.isFullScreen=false
                  let timeOut=setTimeout(()=>{
                    clearTimeout(timeOut)
                    this.contentOriginHeight=0
                    resolve(true)
                  },200)
                  return
                }
                resolve(true)
              })
          },
          //点击确定
          sure(){
              this.$emit('sure',this.startCloseDialogAnimation)
          },
          //遮罩点击
          overyClick(){
              if(this.closeOnClickModal){
                this.close('close')
                return
              }
            this.$emit('modalClick')
          },
          //全屏切换
          async togetherFullScreen(){
              await this.$lm.preventContinuePoint(this)
              let {isFullScreen,contentOriginHeight,contentNochangeOriginHeight}=this
            clearTimeout(this.timeOut)
            clearTimeout(this.screenTime)
            if(!isFullScreen){
              contentOriginHeight=this.$refs.customDialogContentBox.clientHeight
              this.contentOriginHeight=contentOriginHeight+'px'
              this.contentNochangeOriginHeight=contentOriginHeight
            }else{
              this.contentOriginHeight=contentNochangeOriginHeight+'px'
            }
            this.timeOut=setTimeout(()=>{
              this.contentOriginHeight=0
              clearTimeout(this.timeOut)
            },1000)
            this.screenTime=setTimeout(()=>{
              clearTimeout(this.screenTime)
              this.isFullScreen=!isFullScreen
            },50)

          }

        },

    }
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
