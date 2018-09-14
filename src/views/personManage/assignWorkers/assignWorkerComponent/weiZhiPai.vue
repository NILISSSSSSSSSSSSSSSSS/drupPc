

<template>
  <div class="selectTransferView">
         <div class="selectTransferHeader">
          <div>
              <div class="zhiPai_item"  :class="{isActive:index==nowIndex}"    v-for="(item,index) in countyArr"  @click="countyChange(item.Name,index)">{{item.Name}}{{item.Count}}人</div>
            </div>
          </div>
        <!-- 表格数据 -->
         <div class="searchTable">
           <!-- 搜索框 -->
                <div class="searchBox">
                    <!-- <span class="needAllotCount">共有<b> {{needAllotCount}} </b>个吸毒人员待分发</span> -->
                    <el-input v-model="leftInputValue" class="searchInput" placeholder="请输入内容进行查询"></el-input>
                    <el-button type="primary" @click="search()" class="searchBtn">查询</el-button>
                </div>
                <div class="drugerWrapper">
                  <!-- 表格数据 -->
                <el-table ref="multipleDrugerTable" :data="druggerList" border tooltip-effect="dark"
                  @row-click="selectRow" style="width: 100%" @selection-change="selectDruger">
                   <el-table-column type="index" :index="indexMethod" width="50">
                   </el-table-column>
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column label="姓名" :label-width="drugLabelWidth" sortable="custom">
                    <template slot-scope="scope">
                        {{ scope.row.Name }}
                    </template>
                    </el-table-column>
                    <el-table-column label="身份证号码" :label-width="drugLabelWidth" sortable="custom">
                    <template slot-scope="scope">
                        {{ scope.row.Card_Id}}
                    </template>
                    </el-table-column>
                    <el-table-column label="人员类型" :label-width="drugLabelWidth" sortable="custom">
                    <template slot-scope="scope">
                        {{ scope.row.Drugategory}}
                    </template>
                    </el-table-column>
                    <el-table-column label="民族" :label-width="drugLabelWidth" sortable="custom">
                    <template slot-scope="scope">
                        {{ scope.row.Ethnicity}}
                    </template>
                    </el-table-column>
                    <el-table-column label="性别" :label-width="drugLabelWidth" sortable="custom">
                    <template slot-scope="scope">
                        {{ scope.row.Sex | handleSex}}
                    </template>
                    </el-table-column>
                
                    <el-table-column label="吸食毒品类型" :label-width="drugLabelWidth" sortable="custom">
                    <template slot-scope="scope">
                        {{ scope.row.Variety_of_drugString}}
                    </template>
                    </el-table-column>
                    <el-table-column label="户籍地址" :label-width="drugLabelWidth" sortable="custom">
                    <template slot-scope="scope">
                        {{ scope.row.PermanentAddress}}
                    </template>
                    </el-table-column>
               
                </el-table>
               
               </div>
                  <!--默认状态下的分页-->
                <div class="pages" >
                    <el-pagination @current-change="pageChange"  background 
                    :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal">
                    </el-pagination>
                    <!--  -->
                </div>

               <div class="block searchArea" v-if="workList.length!==0">
                 <el-select  v-model="currentSelectWorkPerson" placeholder="请选择工作人员">
                    <el-option
                      v-for="(item,index) in workList"
                      :key="index"
                      :label="item.Name"
                      :value="item.PhoneNumber">
                      <span style="float: left">{{ item.Name }}</span>
                      <!-- <span style="float: right; color: #8492a6; font-size: 13px">电话号码：{{ item.PhoneNumber }}</span> -->
                    </el-option>
                </el-select>
                  <el-button type="primary" @click="addPerson()">指派</el-button>
                </div>
            </div>
            </div>
   
     
       
      
   
    </div>
  </div>
</template>
<script>
  import Cookies from 'js-cookie';
 let _this;
  export default {
    data() {
      return {
      countyArr:[],
       fullscreenLoading: false,
       leftInputValue:"",
       druggerList:"",
       workList:"",
       drugLabelWidth: '120px',
       currentSelectWorkPerson:"",
       currentCountyType:"",
       nowIndex:0,
       drugerSelection: [],

          currentPage: 1,
        //  pages: false,
          pageTotal: 0,
          pageSize:10,//一页显示多少个
          
      };
    }
    ,filters: {  
         handleSex: function (value) {  
                 if(value === 0) {
                    return '无';
                }else if(value === 1){
                    return '男';
                }else {
                    return '女';
                }
            }  
        }
    ,created() {
        _this=this;
       _this.loadAllCounty();
       this.loadAllDrugger()
    }
    ,methods: {
        //序号
        indexMethod(index) {
          return 10 * (this.currentPage - 1) + index + 1;
        },
        //分发吸毒人员的时候选择一行
            selectRow: function(row) {
                this.$refs.multipleDrugerTable.toggleRowSelection(row);
            },
          //加载所有乡数据
            loadAllCounty:function(){
              var paramData={
                  ToKen:Cookies.get('myToken'),
                  PhoneNumber:Cookies.get('myPhoneNum'),
              };
              _this.$http.post(_this.httpUrl+"/backstage/query/getvillages",paramData)
                      .then(res => {
                  if(res.data.errno === 0){
                      console.log(res.data.data)
                      _this.countyArr=res.data.data;
                      console.log(_this.countyArr)
                  }
                  else{
                      _this.$notify.error({
                          title: '错误',
                          message:res.data.errmsg
                      });
                  }
              })
              .catch(function (error) {
                      console.log(error);
                  });
        },
        //加载所有毒品数据
       loadAllDrugger(){
            var curentPa="0";
             _this.searchAssignDruger({
                Skip:curentPa
            }) 
       },

       //点击吸毒人员前面复选框
            selectDruger(val) {
                this.drugerSelection = val;
            },
      //封装搜索需要指派的吸毒人员
      searchAssignDruger: function(obj) {
           obj["ToKen"]=Cookies.get('myToken');
           obj["PhoneNumber"]=Cookies.get('myPhoneNum');
          this.$http
              .post(this.httpUrl + "/backstage/query/queryvillagesdruginfo", obj)
              .then(res => {
                  console.log(res);
                  if (res.data.errno == 0) {
                      this.fullscreenLoading = false;
                      this.druggerList = res.data.data.DrugUser.user;
                      this.workList = res.data.data.WorkUser;
                      // 分页
                      this.pageTotal = res.data.data.DrugUser.count;
                      // this.pages = true;
                    
                  } else {
                      this.fullscreenLoading = false;
                      this.$notify({
                          title: '查询失败',
                          message: res.data.errmsg,
                          type: 'warning',
                          duration: 3000
                      });
                  }
              })
              .catch(error => {
                  console.log(error);
              });
      },

       //搜索方法
      search() {
        // 请求搜索接口
        // 传递参数  当前乡的类型currentCountyType 和 输入的value
        var curentPa="0";
         let _formData={
                 Vague:_this.leftInputValue,
                Skip:curentPa
            };
            this.nowIndex !==0 ? _formData["villages"]=_this.currentCountyType : ""
            _this.searchAssignDruger(_formData); 
        
      },
      //点击乡
      countyChange(type,index){
        this.paramReset();//重置参数
        this.nowIndex=index;
        this.currentCountyType=type;
        let _formData={
                 Skip:"0"
            }
            //如果不是全部乡，则传递 villages 字段
          this.nowIndex !==0 ? _formData["villages"]=_this.currentCountyType : ""
         
         _this.searchAssignDruger(_formData);
          
      },
 
     
       //指派工作人员
      addPerson() {
     
        if ( this.currentSelectWorkPerson === '' ) {
          this.$message.warning('请选择工作人员');
          return;
        }
        if (this.drugerSelection.length === 0 ) {
          this.$message.warning('请选择吸毒人员');
          return;
        }
         let newDrugCradId="";
         console.log(_this.drugerSelection)
         _this.drugerSelection.forEach(element => {
            (newDrugCradId=="") ? newDrugCradId=newDrugCradId+element.Card_Id : newDrugCradId=newDrugCradId+"@"+element.Card_Id
         });
         console.log("工作电话:"+_this.currentSelectWorkPerson+"选中id:"+newDrugCradId)


        var paramData={
                ToKen:Cookies.get('myToken'),
                PhoneNumber:Cookies.get('myPhoneNum'),
                DrugCradId:newDrugCradId,
                WorkPhoneNumber: _this.currentSelectWorkPerson
            };
            _this.$http.post(_this.httpUrl+"/backstage/query/binddrug",paramData)
                    .then(res => {
                if(res.data.errno === 0){
                      _this.$notify({
                             duration:1500,
                            title: '指派成功',
                            message:res.data.errmsg,
                            type: 'success'
                        });
                      var curentPa="0";
                      //刷新数据
                    _this.searchAssignDruger({
                            villages: _this.currentCountyType,
                            Skip:curentPa
                        })   
               
                }
                else{
                    _this.$notify.error({
                        title: '错误',
                        message:res.data.errmsg
                    });
                }

            })
        .catch(function (error) {
                console.log(error);
            });
      },

      //分页
      pageChange(val){
           this.currentPage=val;
         var curentPa=JSON.stringify((parseInt(this.currentPage)-1)* parseInt(this.pageSize));
           _this.searchAssignDruger({
                 Skip:curentPa
            })   
      },
      paramReset(){
        this.currentSelectWorkPerson=""  ;
        this.leftInputValue="";
      }
    
    }
  };
</script>

  <style scoped>
  .selectTransferView .selectTransferHeader{
        background-color: #2c5aa0;
    border-bottom: 0;
  }
    .selectTransferView  .zhiPai_item{
      padding: 0 20px;
      height: 40px;
      box-sizing: border-box;
      line-height: 40px;
      display: inline-block;
      list-style: none;
      font-size: 14px;
      font-weight: 500;
      color:white;
      position: relative;
      cursor: pointer;
    }
    .selectTransferView  .isActive{
          color: #fff;
        background: #508ce6;
        border: 0;
    }

    /* -------------------拷贝------------- */
      .needAllotCount{
        display: inline-block;
        font-size: 14px;
        color: #fff;
        margin-right: 20px;
    }
    .importFile{
        margin-top: 20px;
    }
    .needAllotCount b{
        color: #ee4750;
    }
    .assignInfo{
        line-height: 34px;
        color: #ee4750 !important;
    }
    .pages {
        margin: 20px 0 30px;
        display: flex;
        justify-content: flex-end;
    }
    .downloadBtn{
        padding: 0 15px;
        height: 32px;
        line-height: 32px;
        border-radius: 3px;
        background: #409eff;
        color:#fff;
        border-color:#409eff;
        display: inline-block;
        margin-right: 10px;
        font-size: 12px;
    }
    .block{
        display: inline-block;
        margin-left: 10px;
    }
    .searchBox {
        width: 100%;
        text-align: center;
        margin: 30px 0;
    }
    .searchInput {
        width: 500px !important;
    }
    .searchInput,
    .searchBtn {
        display: inline-block;
    }
    .searchArea{
        width:100%;
        margin: 20px 0;
    }
    .searchArea .el-cascader{
        width: 100%;
    }
    .searchArea,.searchBtn{
        display: inline-block;
    }
    .drugerSearchBox {
        margin-bottom: 20px;
    }
    .drugerSearchBox .searchDrugerBox {
        width: 500px;
        display: inline-block;
        margin-right: 10px;
    }
    .drugerSearchBox .searchDrugerBtn {
        display: inline-block;
    }
    .searchBtn {
        margin-left: 10px !important;
    }
    .dialogFooter {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
    .allotCount {
        line-height: 40px;
        margin-right: 16px;
    }
    .assignTitle {
        height: 30px;
        line-height: 30px;
        margin: 30px 0 20px;
        font-size: 16px;
        color: #fff;
        font-weight: normal;
        border-left: 3px solid #096dd5;
        padding-left: 12px;
    }
    .drugerWrapper {
        width: 100%;
        overflow-x: hidden;
        height: 470px;
        overflow-y: auto;
    }
    /*系统分发*/
    .systemAssign {
        padding: 20px 15px;
        border: 1px solid #26477c;
    }
    .systemAssign p {
        font-size: 14px;
        color: #fff;
    }
    .systemAssign p i {
        color: #ee4750 !important;
        margin-right: 5px;
        font-size: 18px;
    }
    .systemAssign p b {
        color: #ee4750;
    }
    .systemAssign img {
        width: 939px;
        display: block;
        margin: 20px 0;
    }
    .uploadBtn {
        height: 30px;
        line-height: 30px;
        background: #ee4750;
    }
    input {
        color: #3089cb;
    }
    .importBtn {
        margin-top: 20px;
    }
    /*人工分发*/
    .handworkAssign {
        margin-top: 20px;
    }
    .chooseAssign {
        margin-top: 25px;
    }
    .chooseAssign .chooseSelect {
        margin-right: 10px;
    }
    .assignBtn {
        margin-left: 10px;
    }
    .area {
        width: 500px;
        display: inline-block;
    }
    .el-cascader {
        width: 100%;
    }
  </style>