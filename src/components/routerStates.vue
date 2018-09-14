<template>
     <div class="routerShow">
       <div class="routerShow_box routerShow_width">
         <span class="leftPath">{{routLeftPath}}</span>
         <div class="rightPath">
           <template v-for="(item,index) in routRightPath">
             <router-link   :to="{ path: '/'+item.link }"  v-if="index!=routRightPath.length-1">{{item.text}} <span >/ </span> </router-link>
             <span  v-else class="lightYellow">{{item.text}} </span>
           </template>

           <!--<span>/</span>-->
         </div>
       </div>

     </div>
</template>

<script>
    export default {
      name:"routerStates",
      data:function(){
        return {
          routLeftPath:"",
          routRightPath:"",
          routLeftPathObj:{
            '/blocks':'Blocks',
            '/blocks/blocksInfo':'Block'
            ,'/transactions':'Transcations'
            ,'/transactions/transactionsInfo':'Transcation'
            ,'/accounts':'Accounts'
            ,'/accounts/accountsInfo':'Address'
          },
//          routRightPathObj:{
//            '/blocks':[{"link":"home","text":"home"},{"link":"blocks","text":"blocks"}],
//            '/blocks/blocksInfo':[{"link":"home","text":"home"},{"link":"blocks","text":this.$t('commonStr.blocks')},{"link":"/blocks/blocksInfo","text":this.$t('commonStr.blockInfo')}]
//            ,'/transactions':[{"link":"home","text":this.$t('commonStr.home')},{"link":"transactions","text":this.$t('commonStr.transactions')}]
//            ,'/transactions/transactionsInfo':[{"link":"home","text":this.$t('commonStr.home')},{"link":"transactions","text":this.$t('commonStr.transactions')},{"link":"/transactions/transactionsInfo","text":this.$t('commonStr.transactionInfo')}]
//            ,'/accounts':[{"link":"home","text":this.$t('commonStr.home')},{"link":"accounts","text":this.$t('commonStr.accounts')}]
//            ,'/accounts/accountsInfo':[{"link":"home","text":this.$t('commonStr.home')},{"link":"accounts","text":this.$t('commonStr.accounts')},{"link":"/accounts/accountsInfo","text":this.$t('commonStr.addressInfo')}],
//          },
        }
      },
      created:function(){
        this.getRightPath();//获取路由里面的值，以便赋值给面包屑
//        this.routRightPath[0].text=this.$t('commonStr.home')
      },
      mounted:function(){

        this.getLeftRoutePath()
      },
      watch: {
        // 如果路由有变化，会再次执行该方法
        "$route": ["getLeftRoutePath"]
      },
      updated: function () {
        this.$nextTick(function () {
//          alert(3)
//          this.routRightPath[0].text=this.$t('commonStr.home')
        })
      },
      methods:{
        //获取左边路径和参数
        getLeftRoutePath:function() {
          this.routLeftPath=this.$route.path;
          let canShu="";
          if(this.$route.query.length!==0){
            console.log(this.$route)
            for(let i in this.$route.query){
              canShu=this.$route.query[i];
            }
          }

          this.routLeftPath = this.routLeftPathObj[this.$route.path]+"  "+canShu
        },
        //获取右边路径参数
        getRightPath:function() {
          this.routRightPath= this.$route.meta.title;
        },
      }
    }
</script>

<style scoped>
  @import '../commonStyle/common.css';
  .routerBox{
    max-width: 100%;
  }
.routerShow_box{
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;color: #868686;
}
.leftPath{
  font-size: 22px;

}
.rightPath{
  text-transform: capitalize;
}
.rightPath{
  color: #868686;
}
  a:visited{
    color: #868686;
  }
</style>
