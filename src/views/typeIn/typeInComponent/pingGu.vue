<template>
    <div>
        <el-tabs type="border-card">
            <el-tab-pane label="季度评估">
                <jidu-pinggu></jidu-pinggu>
            </el-tab-pane>
            <el-tab-pane label="年度评估">
                <niandu-pinggu></niandu-pinggu>
            </el-tab-pane>
        </el-tabs>


    </div>
</template>
<script type="text/ecmascript-6">
    import jiPingGu from "./pingGuComponent/jiPingGu";
    import nianPingGu from "./pingGuComponent/nianPingGu";
    var _this;
    export default {
        data: function() {
            return {

            };
        },
        created() {
        _this = this;
    },
    components: {
        // <my-component> 将只在父组件模板中可用
        "jidu-pinggu": jiPingGu,
        "niandu-pinggu": nianPingGu,

    },
    methods: {

    },
    }

</script>
<style scoped>
    div table td {
        border-right: 0 !important;
    }
    .el-tabs--border-card{
        background-color: #022c6d !important;
    }
   
    .el-tabs__nav-scroll {
        overflow: hidden;
        background:#022c6d
    }
    .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
        color: #409eff;
        background-color: #fff;
        border-right-color: #dcdfe6;
        border-left-color: #dcdfe6;
    }
    .returnButton{
        margin-bottom: 10px;
    }
 
    .el-tabs--border-card{
        border: 1px solid #3081da;
    }
</style>

