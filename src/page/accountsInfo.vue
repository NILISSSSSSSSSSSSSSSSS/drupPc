<template>
  <div>
    <!--//状态栏显示-->
    <router-states></router-states>
    <!--info-->
    <div class="commonInfoBox routerShow_width">
      <div class="commonInfoHeader lightYellow">
        {{ $t('commonStr.addressInfo')}}
      </div>
      <div class="commonInfoBody">
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL"> {{ $t('commonStr.hash')}}:</span><span>{{infobody.Hash}}</span>
        </div>
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL"> {{ $t('commonStr.value')}}:</span><span>{{infobody.Value}}</span>
        </div>
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.TotalTxt')}}:</span>
          <span>
           {{infobody.TotalTxt}}
         </span>
        </div>


      </div>
    </div>
    <!--//表格-->
    <div class="routerShow_width">
      <div class="infoTit">
        <span>{{ $t('commonStr.transactions')}}</span>
        <span> <router-link to="/transactions">{{ $t('commonStr.viewAll')}}</router-link></span>
      </div>
      <!--//表格-->
      <el-table
        :data="tabAll.tableData"
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
    </div>

  </div>

</template>

<style scoped>
  /*@import '../commonStyle/common.css';*/

  .infoTit{
   display: flex;margin-top: 40px;line-height: 2;
    height: 30px;justify-content: space-between;
  }
  .infoTit>span:nth-child(1){
    font-size: 15px;color: black;
  }
  .infoTit>span:nth-child(2)>a{
    color: #585f69;font-size: 14px;
  }

  .el-table__header th>.cell {
    text-transform: capitalize!important;
  }
</style>

<script>
  import routerStates from "../components/routerStates.vue"
  export default {
    name:"transactionsInfoView",

    data:function(){
      return {
        infobody: {"Hash": 'sdgfrtgtrytyty', "Value": '0.897', "TotalTxt": '12343'},
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
      'router-states': routerStates,
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
