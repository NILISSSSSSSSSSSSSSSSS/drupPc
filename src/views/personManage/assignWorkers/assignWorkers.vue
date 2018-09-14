 <template>
     <div class="typeIn">
         <el-button type="primary" class="returnButton" @click="$router.go(-1)">返回</el-button>
         <el-tabs type="border-card">
             <el-tab-pane label="未指派">
                 <wei-zhipai></wei-zhipai>
             </el-tab-pane>
             <el-tab-pane label="已指派">
                 <yi-zhipai></yi-zhipai>
             </el-tab-pane>
         </el-tabs>


     </div>
 </template>
<script type="text/ecmascript-6">
import weiZhiPai from "./assignWorkerComponent/weiZhiPai";
import yiZhiPai from "./assignWorkerComponent/yiZhiPai";

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
      "wei-zhipai": weiZhiPai,
      "yi-zhipai": yiZhiPai,
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


