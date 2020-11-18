
<template>
    <div class="exampleBox">
        <div class="lm-ui-title rowCenter">
            <strong>龙马-ui</strong>
        </div>
        <div class="componentsBox">
            <div class="componentItemBox columnCenter">
                <lm-canlendar-component style="width:500px;"></lm-canlendar-component>
                <el-button type="text">日历</el-button>
                <lm-input></lm-input>
                <!--<el-input></el-input>-->
            </div>

        </div>


    </div>
</template>

<script>
    import {formatDate} from "../packages/utils/global-methods";
    import LmCanlendarComponent from './components/lm-canlendar-component'
    export default {
        components: {
            LmCanlendarComponent
        },
        data() {
            return {
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


