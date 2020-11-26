#龙马UI lm-ui
## 安装
首先创建项目，使用vue-cli3创建项目
````javascript
vue create lm-ui-element-test
````
创建好后，进入项目文件夹lm-ui-element-test，先安装element-ui，然后安装lm-ui-element

安装element-ui
````npm
npm i element-ui
````

使用npm安装
````npm
npm i lm-ui-element
````
使用cnpm安装
````npm
cnpm i lm-ui-element
````
main.js
````javascript
import Vue from 'vue'
import App from './App.vue'
/**
* 除了lm-calendar组件，其他组件均依赖element-ui，所以请先引入element-ui
*/
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import LmUIElement from 'lm-ui-element'  //引入lm-ui-element
import 'lm-ui-element/lib/lm-ui-element-style/index.css' //引入样式文件
Vue.use(ElementUi)
Vue.use(LmUIElement)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

````
## 使用
安装好后可直接在项目中使用
App.vue
````html
<template>
    <div class="exampleBox">
        <div class="lm-ui-title rowCenter">
            <strong>龙马-ui</strong>
        </div>
        <div class="componentsBox">
            <div class="componentItemBox columnCenter">
                <lm-calendar></lm-calendar>
                <el-button type="text">日历</el-button>
            </div>
            <el-form width="1000">
                <el-row>
                    <lm-input></lm-input>
                    <lm-select></lm-select>
                </el-row>
                <el-row>
                    <lm-date-time></lm-date-time>
                    <lm-cascader></lm-cascader>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
````
## 自定义主题
lm-ui-element基于element-ui，除了不依赖element-ui的组件，其他组件的主题，请直接使用element-ui的主题设定方式
