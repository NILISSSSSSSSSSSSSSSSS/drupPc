<template>
  <el-container class="indexBox" style="height: 100%; border: 1px solid #eee" >
    <tap-header></tap-header>

    <div class="routerBox">
      <keep-alive>
        <router-view>

        </router-view>
      </keep-alive>
    </div>

    <tap-footer></tap-footer>
  </el-container>

</template>

<style scoped>
  /*@import '../commonStyle/common.css';*/
  .indexBox{
   flex-direction: column;align-items: center;border: 0;
  }
  .indexBox>.el-container,.el-container>div{
    width: 100%;
  }
  .routerBox{
     box-sizing: border-box;
  }
</style>

<script>
//  import baseUrl from "../config/url.js"
import tapHeader from "../components/tapHeader.vue"
import tapFooter from "../components/tapFooter.vue"
  export default {
    name:"index",
    data(){
      return {
         menuData:[],
        dataAct:true
      }
    },
    components: {
      // <my-component> 将只在父组件模板中可用
      'tap-header': tapHeader,
       'tap-footer': tapFooter
    },
    mounted(){
    this.$nextTick(function () {
//     this.getMenu()
    })

    },
    methods:{
//      getMenu:function(){
//        this.$http.get(baseUrl.baseUrl+baseUrl.dataApi.menu)
//          .then(response => {
//            if(response.data.code==200){
//              console.log("1111"+this.menuData);
//              this.menuData=response.data.menu
//
//            }
//            else{
//              console.log("失败")
//            }
//          })
//          .catch(function (error) {
//            console.log(error);
//          });
//      }
    }
  };
</script>
