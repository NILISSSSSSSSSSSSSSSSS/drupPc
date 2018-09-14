<template>
  <div class="tapHeaderArrView routerShow_width">
    <div>ICON</div>
    <div class="selectLang">
      <el-select v-model="value" placeholder="请选择语言" size="mini"  @change="changeLanguage()">
        <el-option
          v-for="item in options"
          :lable="item.lable"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      active-text-color="#ffd04b"  :router="isRoute">
        <el-menu-item  v-if="item.children.length==0" :index="item.link" v-for="(item,index) in tapHeaderArr" > {{ item.text }}</el-menu-item>
        <el-submenu index="2" v-else>
          <template slot="title">{{item.text}}</template>
          <el-menu-item :index="subitem.link" v-for="(subitem,index) in item.children">{{ subitem.text }}</el-menu-item>
        </el-submenu>
    </el-menu>
  </div>
</template>


<script>
  export default {
    name: 'tapHeader',
    data:function(){
      return{
        isRoute:true,
        routPath:"",
        routObj:{
          '/home':'/home',
          '/blocks':'/blocks',
          '/blocks/blocksInfo':'/blocks'
          ,'/transactions':'/transactions'
          ,'/transactions/transactionsInfo':'/transactions'
          ,'/accounts':'/accounts'
          ,'/accounts/accountsInfo':'/accounts'
        },
        activeIndex: '/home',
        tapHeaderArr:[
          {
            link:'/home'
            ,text:this.$t('commonStr.home')
            ,children:[]
          }
          ,{
            link:'/blocks'
            ,text:this.$t('commonStr.blocks')
            ,children:[]
          }
          ,{
            link:'/transactions'
            ,text:this.$t('commonStr.transactions')
            ,children:[]
          }
          ,{
            link:'/accounts'
            ,text:this.$t('commonStr.accounts')
            ,children:[]
          }
        ],
        options: [{
          lable:"中文",
          value: 'zh',
        }, {
          lable:"English",
          value: 'en',
        }],
        value: ''
      }
    },
     updated:function(){  //更新双语切换的内容
       for(let i=0;i<this.tapHeaderArr.length;i++){
         this.tapHeaderArr[i].text=this.$t('header')[i]
       }
     },
    watch: {
      // 如果路由有变化，会再次执行该方法
      "$route": "changeMenu",
    },
    created:function(){
      this.changeMenu()
    },
    methods:{
      changeMenu:function(){
        this.activeIndex=this.routObj[this.$route.path];
      },
      changeLanguage:function(){
        let locale = this.value
        locale === 'zh' ? this.$i18n.locale = 'zh' : this.$i18n.locale = 'en';
      },
      handleSelect:function(key, keyPath) {

      }
    }
  }
</script>

<style scoped>

  .tapHeaderArrView{
    display: flex;position: relative;
    flex-direction: row;
    width: 100%;    justify-content: center;

  }
  .tapHeaderArrView[data-v-b8f97b60] {
    justify-content: space-between;       line-height: 78px;
    /*height: 70px;*/
  }
  .tapHeaderArrView li{
    text-transform: uppercase;
    font-size: 14px;color: black!important;height: 30px;line-height: 30px;
  }
  .el-menu{
    line-height: normal;
    /* margin-top: 30px; */line-height: normal;
    position: absolute;
    bottom: 0px;
    right: 0px;
  }
  .selectLang{
    height: 30px;line-height: 30px;margin-top: 4px;
  }
</style>
