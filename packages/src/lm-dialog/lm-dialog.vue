<!--自定义弹窗-->
<template>
  <div class="customDialogBox">
    <div class="overy" @click="close" ref="overy"></div>
    <div class="customDialogWhiteBox" :style="{width:width+'px',background,'padding-bottom':bottomPadding+'px'}">
      <div class="customDialogTitleBox rowBtween">
        <el-button type="primary" :style="{background:titleBk}" class="titleBk"></el-button>
        <span class="title font16" :style="{color:titleTextColor}">{{title}}</span>
        <div class="rowCenter closeBox"  @click="close" ref="closeIcon">
          <i class="el-icon-close" :style="{color:titleTextColor}"></i>
        </div>
      </div>
      <div class="customDialogContentBox" ref="customDialogContentBox" :style="{'margin-bottom':contentMarginBottom+'px',padding:contentPadding,...contentBoxStyle}">
        <slot></slot>
      </div>
      <div class="confirmCancelFotterBox" v-if="showFooter">
        <slot name="footer">
          <div class="rowCenter">
            <el-button @click="$emit('cancel')" :style="{width:btnWidth,height:btnHeight}">{{backText || '返回'}}</el-button>
            <el-button type="primary" @click="$emit('sure')" :style="{width:btnWidth,height:btnHeight}" :icon="showLoading ? 'el-icon-loading' : ''">{{saveText || '保存'}}</el-button>
          </div>
        </slot>
      </div>
    </div>
  </div>
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
        },
        methods: {
            //关闭弹窗
            close(){
                this.$emit('close')
            },
        },

    }
</script>
