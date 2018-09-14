<template>
  <div>
    <!--//状态栏显示-->
    <router-states></router-states>
    <!-- blocks列表-->
    <div class="routerShow_width">
      <div class="pageBox">
        <p>{{ $t('accounts.tit', { msg1: tabAll.tableData[0].Rank,msg2:tabAll.tableData[tabAll.tableData.length-1].Rank,msg3: tabAll.count }) }}</p>

        <!--<p>Showing ({{tabAll.tableData[0].height}} to {{tabAll.tableData[tabAll.tableData.length-1].height}})  of {{tabAll.count}} Accounts</p>-->
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
        <el-table-column prop="Rank" :label="$t('commonStr.rank')" width="180" align="center"></el-table-column>
        <el-table-column prop="Address" :label="$t('commonStr.address')" width="180" align="center">
          <template slot-scope="scope">
            <router-link class="lightYellow"  :to="{path:'/accounts/accountsInfo',query: {accounts: scope.row.Address}}" >{{scope.row.Address}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="Value" :label="$t('commonStr.value')" align="center"></el-table-column>
        <el-table-column prop="TxCount" :label="$t('commonStr.TxCount')" align="center"></el-table-column>
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
    name:"accounts",
    data:function(){
      return {
        tabAll:{
          currentPage1: 1,
          count:2,
          tableData: [
            {
              Rank: '1',
              Address: 'oxseeeeherhftgtdfh',
              Value: '12312.2',
              TxCount: '1.246',
            }
            ,{
              Rank: '1',
              Address: 'oxseeeeherhftgtdfh',
              Value: '12312.2',
              TxCount: '1.246',
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
