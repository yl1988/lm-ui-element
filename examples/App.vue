
<template>
    <div class="exampleBox">
        <div class="lm-ui-title rowCenter">
            <strong>龙马-ui</strong>
        </div>
        <div class="componentsBox">
            <div class="componentItemBox columnCenter">
                <lm-canlendar-component style="width:500px;"></lm-canlendar-component>
                <el-button type="text">日历</el-button>
            </div>
            <el-form width="1000" ref="form" :model="form">
                <el-row>
                    <lm-input label="姓名：" v-model="form.name"></lm-input>
                    <lm-select label="学历：" v-model="form.stuty" :lm-form-item-data="['文盲','小学','初中','高中','中专','大专','本科','硕士','博士']"></lm-select>
                </el-row>
                <el-row>
                    <lm-date-time label="入学日期：" v-model="form.date"></lm-date-time>
                    <lm-cascader label="证书："></lm-cascader>
                </el-row>
                <lm-address label="住址：" v-model="form.address" :required="false"></lm-address>
            </el-form>
        </div>


    </div>
</template>

<script>
    import {formatDate} from "../packages/utils/lm-methods";
    import LmCanlendarComponent from './components/lm-canlendar-component'
    export default {
        components: {
            LmCanlendarComponent
        },
        data() {
            return {
               form:{},//保单
            }
        },
        computed: {
        },
        mounted() {

        },
        methods: {

        },

    }
</script>

<style scoped lang="scss">
    /*@import "../packages/lm-ui-element-style/src/mix";*/
    /*@import "../packages/lm-ui-element-style/src/common";*/
    /*@import "../packages/lm-ui-element-style/src/color";*/
    /*@import "../packages/lm-ui-element-style/src/flex";*/
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
        }


    }
</style>


