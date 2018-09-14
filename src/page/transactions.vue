<template>
  <div>
    <!--//状态栏显示-->
    <router-states></router-states>
    <!-- blocks列表-->

    <div class="routerShow_width">
      <div class="pageBox">
        <p>{{ $t('transactions.tit', { msg1: tabAll.tableData[0].Block,msg2:tabAll.tableData[tabAll.tableData.length-1].Block,msg3: tabAll.count }) }}</p>

        <!--<p>Showing {{tabAll.tableData[0].Block}} - {{tabAll.tableData[tabAll.tableData.length-1].Block}}  of {{tabAll.count}} Transactions</p>-->
        <!-- 分页-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :page-size="100" layout="total, prev, pager, next" :total="tabAll.count">
        </el-pagination>
      </div>
      <!--//表格-->
      <el-table
        :data="tabAll.tableData"
        height="500"
        style="width: 100%">
        <el-table-column prop="Hash"  :label="$t('commonStr.hash')"  width="180" align="center">
          <template slot-scope="scope">
            <router-link class="lightYellow"  :to="{path:'/transactions/transactionsInfo',query: {Hash: scope.row.Hash}}" >{{scope.row.Hash}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="Block"  :label="$t('commonStr.block')" width="180" align="center">
          <template slot-scope="scope">
            <router-link class="lightYellow"  :to="{path:'/blocks/blocksInfo',query: {Block: scope.row.Block}}" >{{scope.row.Block}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="TxType" :label="$t('commonStr.TxType')"  align="center"></el-table-column>
        <el-table-column prop="Ages" :label="$t('commonStr.ages')"  align="center"></el-table-column>
        <el-table-column prop="From" :label="$t('commonStr.from')" align="center"></el-table-column>
        <el-table-column prop="To" :label="$t('commonStr.to')" align="center"></el-table-column>
        <el-table-column prop="Value" :label="$t('commonStr.value')" align="center"></el-table-column>
        <el-table-column prop="Fee" :label="$t('commonStr.fee')" align="center"></el-table-column>
      </el-table>
      <!--//下边分页-->
      <!-- 分页-->
      <el-pagination class="bottomPage" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :page-size="100" layout="total, prev, pager, next" :total="tabAll.count">
      </el-pagination>
    </div>
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
    name:"transactions",
    data:function(){
      return {
        tabAll:{
          currentPage1: 1,
          count:2,
          tableData: [
            {
              Hash: '0xthtttttjeewwfr',
              Block: '1234',
              TxType: 'Reward',
              Ages: '1d 2h ago',
              From: 'abcfdsfrgttw',
              To: '0xtethsht',
              Value: '1.323424',
              Fee: '1.323424',
            }
            ,    {
              Hash: '0xthtttttjeewwfr',
              Block: '5678',
              TxType: 'Reward',
              Ages: '1d 2h ago',
              From: 'abcfdsfrgttw',
              To: '0xtethsht',
              Value: '1.323424',
              Fee: '1.323424',
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
