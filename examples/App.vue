
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
            <el-form width="1000">
                <el-row>
                    <lm-input></lm-input>
                    <lm-select></lm-select>
                </el-row>
                <el-row>
                    <lm-date-time></lm-date-time>
                    <lm-cascader></lm-cascader>
                </el-row>
                <lm-address v-model="address" :required="false"></lm-address>
            </el-form>
            <div>{{address}}</div>
        </div>


    </div>
</template>

<script>
    import {formatDate} from "../packages/uitls/lm-methods";
    import LmCanlendarComponent from './components/lm-canlendar-component'
    export default {
        components: {
            LmCanlendarComponent
        },
        data() {
            return {
                address:'',//地址
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


