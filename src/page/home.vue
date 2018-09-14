<template class="template">
    <div class="homeBox routerShow_width">
        <div :gutter="20" class="homeBox_row">
           <div id="myChart" ></div>
           <div class="serviceBlock" >
              <div class="blockColumn_item ">
                <h3 class="blockColumn_item_text">
                  <router-link to="blocks">{{$t('home.LASTBLOCKS')}}</router-link>
                </h3>
                <p class="blockColumn_item_text">
                  <router-link to="blocks" class="text_num"> 123456</router-link>
                  (13 days ago)
                </p>
              </div>
              <div class="blockColumn_item ">
                <h3 class="blockColumn_item_text">
                  <router-link to="transactions">{{$t('commonStr.transactions')}}</router-link>
                </h3>
                <p class="blockColumn_item_text">
                  <router-link to="transactions" class="text_num"> 123456M</router-link>
                </p>
              </div>
              <div class="blockColumn_item ">
                <h3 class="blockColumn_item_text">
                  <router-link to="blocks">{{$t('home.MINNERS')}} </router-link>
                </h3>
                <p class="blockColumn_item_text">
                  <router-link to="blocks" class="text_num"> 4532</router-link>
                </p>
              </div>
              <div class="blockColumn_item ">
                <h3 class="blockColumn_item_text">
                  <router-link to="blocks">{{$t('home.REWARD')}} </router-link>
                </h3>
                <p class="blockColumn_item_text">
                  <router-link to="blocks" class="text_num"> 123456</router-link>

                </p>
              </div>
              <div class="form">
                <input type="text" class="formInput" :placeholder="$t('home.inputPlaceholder')"/>
                <i class="el-icon-search formSearch"></i>
              </div>
            </div>
        </div>
        <div class="homeBox_row">
        <!-- 左边区块列表-->
        <div class="blockList">
           <div class="panel-heading">
              <h2 class="panel-title pull-left upperString">
                <i class="el-icon-sold-out"></i>{{$t('commonStr.blocks')}}
              </h2>
             <span class="pull-right">
                <router-link to="blocks" >{{$t('commonStr.viewAll')}}</router-link>
             </span>
           </div>
          <div class="panel-body">
            <div class="panel-box">
              <div class="panel-item" v-for="item in blockData">
                <h4>
                  <span class="upperString">{{$t('home.blockHash')}}</span> <router-link :to="{path:'/blocks/blocksInfo',query: {height: item.height}}" class="lightYellow">{{item.hash}}</router-link>
                </h4>
                <p>
                  <span class="pull-left"> <span class="upperString">{{$t('commonStr.height')}}</span>:{{item.height}}</span>
                  <span class="pull-right">{{item.time}} {{$t('commonStr.ago')}}</span>
                </p>
                 <p>

                   <span class="pull-left">{{item.Transactions}}  <span class="upperString">{{$t('commonStr.transactions')}}</span></span>
                   <span class="pull-right"><span class="upperString">{{$t('commonStr.totalFee')}}</span> {{item.totalFee}}</span>
                   </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 右边交易列表-->
        <div class="transationsList">
          <div class="panel-heading">
            <h2 class="panel-title pull-left">
              <i class="el-icon-sold-out"></i>
              <span class="upperString">
                {{$t('commonStr.transactions')}}
              </span>

            </h2>
             <span class="pull-right">
                <router-link to="transactions">{{$t('commonStr.viewAll')}}</router-link>
             </span>
          </div>
          <div class="panel-body">
            <div class="panel-box">
              <div class="panel-item" v-for="item in TransactionsData">
                <h4>
                  TX#: <router-link :to="{path:'/transactions/transactionsInfo',query: {TxHash: item.TxHash}}" class="lightYellow">{{item.TxHash}}</router-link>
                </h4>
                <p>
                  <span class="pull-left"> <span class="upperString">{{$t('commonStr.from')}}:</span><router-link :to="{path:'/accounts/accountsInfo',query: {Account: item.from}}" class="lightYellow">{{item.from}}</router-link> </span>
                  <span class="pull-right">{{item.time}} {{$t('commonStr.ago')}}</span>
                </p>
                <p>
                  <span class="pull-left"><span class="upperString">{{$t('commonStr.to')}}:</span><router-link :to="{path:'/accounts/accountsInfo',query: {Account: item.To}}" class="lightYellow">{{item.To}}</router-link></span>
                  <span class="pull-right"><span class="upperString">{{$t('commonStr.value')}}:</span>{{item.Value}} </span>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

</template>

<script>
    export default {
        name: 'homeView',
        data:function(){
            return{
              blockData:[
               {
                 "hash":"1111111",
                 "height":"12345",
                 "Transactions":"20",
                 "time":"13mins",
                 "totalFee":"2"

               },
               {
                 "hash":"2222222",
                 "height":"67895",
                 "Transactions":"4",
                 "time":"3mins",
                 "totalFee":"16"
               },
               {
                 "hash":"33333",
                 "height":"66666",
                 "Transactions":"8",
                 "time":"88mins",
                 "totalFee":"14"
               }

             ],
              TransactionsData:[
                {
                  "TxHash":" 0X16BEDF6F9B963BE35635297E7",
                  "from":"0x6cace0528324a8",
                  "time":"13",
                  "To":"0xa3c1e324ca1ce40",
                  "Value":"12345556"

                },
                {
                  "TxHash":" 0X16BEDF6F9B963BE35635297E7",
                  "from":"0x6cace0528324a8",
                  "time":"13",
                  "To":"0xa3c1e324ca1ce40",
                  "Value":"12345556"

                },
                {
                  "TxHash":" 0X16BEDF6F9B963BE35635297E7",
                  "from":"0x6cace0528324a8",
                  "time":"13",
                  "To":"0xa3c1e324ca1ce40",
                  "Value":"12345556"

                },
              ]
            }
        },
        mounted:function(){
           this.drawLine();
         },
      computed:{

      },
      methods: {
        //绘制echart
        drawLine:function(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption({
              title : {
                text: '14 days Transation History',
                subtext: '',
                x:'center',
                textStyle:{
                  fontSize:14,
                  fontWeight:"normal",
                },
                y:"19"
              },
              grid: {
                left: '20px',
                right: '65px',
                bottom: '20px',
                y:54,
                containLabel: true,
              },

              tooltip : {
                trigger: 'axis'
              },
              toolbox: {
                show : false,
                feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {show: true, type: ['line', 'bar']},
                  restore : {show: true},
                  saveAsImage : {show: true}
                }
              },
              calculable : true,
              xAxis : [
                {
                  name:"",
                  type : 'category',
//               boundaryGap: ['10%', '10%'],//设置刻度线不从零开始,
                  nameTextStyle:{//修改坐标轴单位的字体颜色
                    color:'black',
                  },
                  axisLine:{
                    show:false
                  },
                  axisTick:{alignWithLabel:true},//设置值和刻度线对齐
                  axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                      color: 'black'//修改坐标轴上值的字体颜色
                    }
                  },
                  'data':[
                    '4/2','4/3','4/4','4/5',
                    '4/6','4/7','4/8','4/9','4/10','4/11','4/12','4/13','4/14','4/15']
                }
              ],
              yAxis : [
                {
                  'name':'',
                  type : 'value',
                  //隐藏刻度线
                  axisTick: {
                    show: false
                  },
                  axisLine:{
                    show:false
                  },
                  nameTextStyle:{//修改坐标轴单位的字体颜色
                    color:'black',
                  },
                  axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                      color: 'black'//修改坐标轴上值的字体颜色
                    }
                  }

                }
              ],

              series : [
                {
                  name:'骨科',
                  type:'line',
                  data:[5, 6, 7, 6, 7,8,8,12,78,3,8,11,66,88],
                  symbol:"circle",
                  symbolSize:5,
                  itemStyle : {
                    normal : {
                      color:'#da9d67',
                      label : {show: false},
                      lineStyle:{//折现颜色
                        color:'#da9d67'
                      }
                    }
                  },

                }
              ]
            });
        }
    },
    }
</script>

<style scoped>
  /*@import '../commonStyle/common.css';*/
    .homeBox{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
      padding: 20px;
        width: 100%!important;
    }
    section{
        max-width: 1200px!important;
    }
    .homeBox{
     background: #ededed;
    }
    .homeBox_row{
      display: flex;flex-direction: row; justify-content: space-around;
    }
   .echart{
        width: 100%;height: 221px;
    }
    #myChart{
      height: 221px;background: white; border-left: 2px solid #d5bf8e;
      border-right: 2px solid #d5bf8e;

    }
  #myChart>div{
    /*background: white;   */
  }
  .serviceBlock{
    padding: 19px 28px; background: #e7a537;color: white;height: 221px;    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .blockList{

  }
  .homeBox_row>div{
    width: 48%;
  }
 .blockColumn_item_text  a{
    color: #f7ddb2;text-transform: uppercase;font-size: 15px;
  }
  a{
    text-decoration: none;
  }
    a:hover{
      text-decoration: underline;
    }
  .blockColumn_item_text{
    margin-bottom: 10px;font-size: 15px;
  }
  .blockColumn_item{
    text-align: left;width: 45%;
  }
  .text_num{
    font-size: 15px;
  }
  .form{
    width: 100%;
    position: relative;
    height: 40px;
  }
  .formInput{
    width: 100%;
    /* height: 30px; */
    width: 100%;
    /* height: 40px; */
    background: #efbc6d;
    /* width: 80%; */
    color: white;
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    border: 0;
    align-items: center;
    box-sizing: border-box;
    HEIGHT: 100%;
  }
  .formSearch{
    font-size: 19px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);cursor: pointer;
  }
  p>a{
    color:white;
  }
    input::-webkit-input-placeholder{
      color:white;font-size: 15px;
    }
    input::-moz-placeholder{   /* Mozilla Firefox 19+ */
      color:white;font-size: 15px;
    }
    input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
      color:white;font-size: 15px;
    }
    input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
      color:white;font-size: 15px;
    }
  .panel-heading{
    color: #585f69;
    background: #fff;font-size: 15px!important;
    padding: 7px 15px;    overflow: hidden;
    border-bottom: solid 1px #e4e3e8;
  }
  .panel-heading a,.panel-item h4, .panel-item p{
    color: #868686;
  }
  .panel-title{
    font-size: 15px!important;
    font-weight: normal;

  }
  .panel-title i{
    font-size: 20px;
    margin-right: 7px;
  }
  .panel-item>h4>a{
    margin-left: 4px;
  }
  .homeBox_row{
    margin-bottom: 20px;
  }
  .panel-item{
    padding: 9px 15px 6px 42px;  border-bottom: 2px solid #f8f3f0;
    background: white;position: relative;
    font-size: 15px;
    font-family: element-icons!important;
  }
  .panel-box{

  }
  .panel-item h4{

    text-align: left;
        font-size: 14px;
  }
  .panel-item h4, .panel-item p{
    margin-bottom: 11px;
  }
 .panel-item p{
   overflow: hidden;
 }
  .panel-item:before{
    position: absolute;
    content: "\E62F";
    left: 18px;
    top: 11px;
  }
  .panel-body{
    height: 500px;overflow: auto;
  }

</style>
