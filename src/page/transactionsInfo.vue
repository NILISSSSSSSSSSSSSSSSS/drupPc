<template>
  <div>
    <!--//状态栏显示-->
    <router-states></router-states>
    <!--info-->
    <div class="commonInfoBox routerShow_width">
      <div class="commonInfoHeader lightYellow">
        {{ $t('commonStr.transactionInfo')}}
      </div>
      <div class="commonInfoBody">
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.TxHash')}}:</span><span>{{infobody.TxHash}}</span>
        </div>
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.TxReceiptStatus')}}:</span><span>{{infobody.States}} </span>
        </div>
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.height')}}:</span>
          <span>
            <router-link :to="{path:'/blocks/blocksInfo',query:{block:infobody.Height}}" class="lightYellow"> {{infobody.Height}}</router-link>(3 block confirmations)
         </span>
        </div>
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.TimeStamp')}}:</span><span>{{infobody.TimeStamp}}</span>
        </div>
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.from')}}:</span><span>
           <router-link :to="{path:'/accounts/accountsInfo',query:{Account:infobody.From}}" class="lightYellow">  {{infobody.From}}</router-link>
         </span>
        </div>
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.to')}}:</span><span>
           <router-link :to="{path:'/accounts/accountsInfo',query:{Account:infobody.To}}" class="lightYellow">  {{infobody.To}}</router-link>
         </span>
        </div>
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.value')}}:</span><span>{{infobody.Value}}</span>
        </div>
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.fee')}}:</span><span>{{infobody.Fee}}</span>
        </div>

      </div>
    </div>
  </div>

</template>

<style scoped>
  /*@import '../commonStyle/common.css';*/

</style>

<script>
  import routerStates from "../components/routerStates.vue"

  export default {
    name:"transactionsInfoView",

    data:function(){
      return{
        infobody: {"TxHash":'0x770d3adbfrertdddddddddddddd',"States":'Succes',"Height":'544982',"TimeStamp":'1 min ago wqw',"From":'0xesdgrr'
          ,"To":'oxddddddde',"Value":'0.832',"Fee":'21000'}
      }
    },
    components: {
      'router-states': routerStates,
    },
    mounted:function(){

    },
    methods:{

    }
  };
</script>
