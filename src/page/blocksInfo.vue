<template>
  <div>
    <!--//状态栏显示-->
    <router-states></router-states>
    <!--info-->
    <div class="commonInfoBox routerShow_width">
      <div class="commonInfoHeader lightYellow">
       {{ $t('commonStr.blockInfo')}}
      </div>
      <div class="commonInfoBody">
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.height')}}: </span><span>{{infobody.Height}}</span>
        </div>
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.TimeStamp')}}:</span><span>{{infobody.TimeStamp}}</span>
        </div>
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.transactions')}}:</span>
          <span>
            <router-link :to="{path:'/transactions',query:{block:infobody.Height}}" class="lightYellow"> {{infobody.Transactions}} transactions</router-link>
         </span>
        </div>
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.hash')}}:</span><span>{{infobody.Hash}}</span>
        </div>
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.ParentHash')}}:</span><span>
           <router-link :to="{path:'/blocks/blocksInfo',query:{ParentHash:infobody.ParentHash}}" class="lightYellow">  {{infobody.ParentHash}}</router-link>
         </span>
        </div>
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.size')}}:</span><span>{{infobody.Size}}</span>
        </div>
        <div class="commonInfoRow" >
          <span class="commonInfo_itemL">{{ $t('commonStr.blockReward')}}:</span><span>{{infobody.BlockReward}}</span>
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
    name:"blocksInfoView",
    data:function(){
      return{
        infobody: {"Height":'12334',"TimeStamp":'9 mins',"Transactions":'145',"Hash":'vgdsthhyrrt',"ParentHash":'rthdthyy',"Size":'12334 bytes',"BlockReward":'12334'}
    }},
    components: {
      'router-states': routerStates,
    },
    mounted:function(){

    },
    methods:{

    }
  };
</script>
