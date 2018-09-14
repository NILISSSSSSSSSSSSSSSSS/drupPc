 <template>
     <div class="typeIn">
         <el-button type="primary" class="returnButton" @click="$router.go(-1)">返回</el-button>
         <el-tabs type="border-card">
             <el-tab-pane label="谈话录入">
                 <talk-vue></talk-vue>
             </el-tab-pane>
             <el-tab-pane label="尿检录入">
                 <liaojian-vue></liaojian-vue>
             </el-tab-pane>
             <el-tab-pane label="请假录入">
                 <qingjia-vue></qingjia-vue>
             </el-tab-pane>
             <el-tab-pane label="变更执行地录入">
                 <change-vue></change-vue>
             </el-tab-pane>
             <el-tab-pane label="综合评估录入">
                 <pinggu-vue></pinggu-vue>
             </el-tab-pane>
             <el-tab-pane label="违反协议">
                 <weifan-xieyi></weifan-xieyi>
             </el-tab-pane>
             <el-tab-pane label="人员状态录入">
                 <people-state></people-state>
             </el-tab-pane>
         </el-tabs>


     </div>
 </template>
<script type="text/ecmascript-6">
import talkVue from "./typeInComponent/talk";
import liaoJianVue from "./typeInComponent/liaoJian";
import qingJiaVue from "./typeInComponent/qingJia";
import changePlace from "./typeInComponent/changePlace";
import pingGu from "./typeInComponent/pingGu";
import weiFanXieYi from "./typeInComponent/weiFanXieYi";
import peopleState from "./typeInComponent/peopleState";
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
      "talk-vue": talkVue,
      "liaojian-vue": liaoJianVue,
      "qingjia-vue": qingJiaVue,
      "change-vue": changePlace,
       "pinggu-vue": pingGu,
        "weifan-xieyi": weiFanXieYi,
        "people-state": peopleState
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


