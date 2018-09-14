<template>
  <div>
    <!--//状态栏显示-->
    <router-states></router-states>
    <!-- blocks列表-->
    <div class="routerShow_width">
      <div class="pageBox">
          <p>{{ $t('blocks.tit', { msg1: tabAll.tableData[0].height,msg2:tabAll.tableData[tabAll.tableData.length-1].height,msg3: tabAll.count }) }}</p>
          <!--<p>Showing Block (#{{tabAll.tableData[0].height}} to #{{tabAll.tableData[tabAll.tableData.length-1].height}}) out of {{tabAll.count}} total blocks</p>-->
        <!-- 分页-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" current-page.sync=1
          :page-size="100" layout="total, prev, pager, next" :total="tabAll.count">
        </el-pagination>
      </div>
      <!--//表格-->
      <el-table
        :data="tabAll.tableData"
        height="500"
        style="width: 100%">
        <el-table-column prop="hash"  :label="$t('commonStr.hash')"   width="280" align="center"></el-table-column>
        <el-table-column prop="height" :label="$t('commonStr.height')"  width="180" align="center">
          <template slot-scope="scope">
              <router-link class="lightYellow"  :to="{path:'/blocks/blocksInfo',query: {height: scope.row.height}}" >{{scope.row.height}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="ages" :label="$t('commonStr.ages')"  align="center"></el-table-column>
        <el-table-column prop="txn" label="Txn" align="center"></el-table-column>
        <el-table-column prop="totalFee"  :label="$t('commonStr.totalFee')"  align="center"></el-table-column>
      </el-table>
      <!--//下边分页-->
      <el-pagination class="bottomPage" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :page-size="100" layout="total, prev, pager, next" :total="tabAll.count">
      </el-pagination>
    </div>

      <router-view></router-view>
  </div>

</template>

<style scoped>
  /*@import '../commonStyle/common.css';*/
  .el-table__body{
    width: 100%;
  }
  .el-table th {
    background: gray;
  }
  .bottomPage{
    margin-bottom: 20px;text-align: right;
  }
  .el-table tr{
    background: transparent;
  }
  .pageBox{
    padding: 16px 0;    justify-content: space-between;
    display: flex;border-bottom: 1px solid #ebeef5;
  }
</style>

<script>
  import routerStates from "../components/routerStates.vue"
  export default {
    name:"blocks",
    data:function(){
      return {
       tabAll:{
         currentPage1: 1,
         count:2,
         tableData: [
           {
             hash: 'asjkdhkajdkjashdjkajhdkakjdhjk',
             height: '1234',
             ages: '1d 3d',
             txn: '3433',
             totalFee: '1.323424'
           }
           ,{
             hash: 'asjkdhkajdkjashdjkajhdkakjdhj',
             height: '5678',
             ages: '1d 3d',
             txn: '3433',
             totalFee: '1.323424'
           }
         ]
       },

      }
    },
    components: {
      'router-states': routerStates
    },
    mounted:function(){

    },
    methods:{
      handleSizeChange:function(val) {
       console.log(`每页 ${val} 条`);
     },
      handleCurrentChange:function(val) {
        console.log(`当前页: ${val}`);
      }
    }
  };
</script>
