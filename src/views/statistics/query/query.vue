
<template>
    <div v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中">
        <!-- <h4>查询待开发</h4> -->
        <h2 class="assignTitle">展示的列</h2>
        <div class="searchBox">
        <el-form ref="form" :model="form" label-width="200px" size="small">
                <el-input v-model="form.drugAccount" class="searchInput" placeholder="请输入内容进行查询"></el-input>
                <el-button type="primary" @click="searchResult()" class="searchBtn">查询</el-button>
        </el-form>
        </div>
        <!--展示的列-->
        <div class="content">
            <div class="basicInfo clear">
                  <div class="basicTitle">
                      <h3>基本情况：</h3>
                      <h3>管控情况：</h3>
                      <h3>工作站：</h3>
                  </div>
                  <div class="checkDetail">
                   <el-checkbox-group v-model="basicInfoList" @change="chooseBasic">
                     <!-- <el-checkbox v-for="item in basicInfoArr" :label="item" :key="item"></el-checkbox> -->
                     <div class="status">
                     <el-checkbox label="曾用名"></el-checkbox>
                     <el-checkbox label="性别"></el-checkbox>
                     <el-checkbox label="年龄"></el-checkbox>
                     <el-checkbox label="手机号码"></el-checkbox>
                     <el-checkbox label="人员类别"></el-checkbox>
                     <el-checkbox label="民族"></el-checkbox>
                     <el-checkbox label="户籍地址"></el-checkbox>
                     <el-checkbox label="职业"></el-checkbox>
                     <el-checkbox label="现居住地"></el-checkbox>
                     <el-checkbox label="文化程度"></el-checkbox>
                     <el-checkbox label="滥用毒品类型"></el-checkbox>
                     </div>
                     <div class="status">
                     <el-checkbox label="签到次数"></el-checkbox>
                     </div>
                     <div class="status">
                     <el-checkbox label="尿检结果"></el-checkbox>
                     <el-checkbox label="报到情况"></el-checkbox>
                     </div>
                   </el-checkbox-group>
                  </div>
            </div>
        </div>
        <h2 class="assignTitle">匹配条件</h2>
        <div>
           <div class="addRemove">
           <el-button type="text" @click="addCondition">添加条件</el-button>
           <el-button type="text" @click="removeCondition">删除条件</el-button>
           </div>
           <div class="filterCondition">
               <div class="filerHeader">
                   <span>匹配字段</span>
                   <span>匹配类型</span>
                   <span style="border-right:0;">匹配值</span>
               </div>
               <div class="filterContent">
                   <div class="filterItem">
                       <el-select v-model="filterValue" placeholder="请选择" @change="filterChange">
                        <el-option v-for="item in filterArray" :key="item.filterValue" :label="item.label" :value="item.filterValue">
                        </el-option>
                    </el-select>
                   </div>
                   <div class="filterItem">
                       <el-select v-model="typeValue" placeholder="请选择">
                            <el-option v-for="item in filterType" :key="item.typeValue" :label="item.label" :value="item.typeValue">
                            </el-option>
                        </el-select>
                   </div>
                   <div class="filterItem filterTxtBox" v-show="commonTxtBox">
                       <el-input v-model="filterCondition" placeholder="请输入内容" @change="changeContent"></el-input>
                   </div>
                   <!--报到情况-->
                   <div class="filterItem" v-show="report">
                       <el-select v-model="reportValue" placeholder="请选择">
                            <el-option v-for="item in reportStatus" :key="item.reportValue" :label="item.label" :value="item.reportValue">
                            </el-option>
                        </el-select>
                   </div>
                   <!--签到次数-->
                   <div class="filterItem" v-show="signCount">
                       <el-select v-model="signCountValue" placeholder="请选择">
                            <el-option v-for="item in signStatus" :key="item.signCountValue" :label="item.label" :value="item.signCountValue">
                            </el-option>
                        </el-select>
                   </div>
                   <!--性别-->
                    <div class="filterItem" v-show="chooseSex">
                       <el-select v-model="sexValue" placeholder="请选择">
                            <el-option v-for="item in sexStatus" :key="item.sexValue" :label="item.label" :value="item.sexValue">
                            </el-option>
                        </el-select>
                   </div>
                   <!--人员类别-->
                    <!-- <div class="filterItem" v-show="personCategory">
                       <el-select v-model="categoryValue" placeholder="请选择">
                            <el-option v-for="item in categoryStatus" :key="item.categoryValue" :label="item.label" :value="item.categoryValue">
                            </el-option>
                        </el-select>
                   </div> -->
               </div>
           </div>
           <div class="queryArr">
               <ul>
                   <li v-for="(item,index) in queryArr" :key="index" @click="deleteQuery(index,item)">
                       <span class="queryCondition">
                           {{item.filterValue}} {{item.typeValue}} {{item.filterCondition}} {{item.reportValue}}{{item.signCountValue}}{{item.sexValue}}
                           </span>
                       <i class="el-icon-close"></i>
                    </li>
               </ul>
           </div>
            <div class="queryBtn">
             <el-button type="primary" @click="queryBtn">查询</el-button>
            </div>
        </div>
        <div class="searchTable">
        <el-form>
           <div class="searchArea">
           <el-form-item>
              <!--超级管理员-->
              <div class="block" v-if="superAdmin">
                <el-cascader :options="areaArr" v-model="selectedOptions" @change="handleChange" :props="props" change-on-select>
                </el-cascader>
              </div>
              <!--县级工作人员显示-->
              <div class="block" v-if="higherWorker">
                <el-cascader :options="areaArr" v-model="selectedOptions" @change="handleChange" :props="props" change-on-select>
                </el-cascader>
              </div>
              <!--工作站管理人员-->
              <div class="block" v-if="stationWorker">
                <el-select v-model="value" placeholder="请选择" @change="changeValue">
                  <el-option v-for="item in stationWorkerArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
           </div>
           <div class="searchBtn">
            <el-button type="primary" icon="el-icon-search" @click="searchBtn">搜索</el-button>
           </div>
           </el-form>
        </div>
        <div class="searchTable">
         <el-table ref="multipleDrugerTable" :data="drugerList" border tooltip-effect="dark"
             @row-click="selectRow" style="width: 100%" @selection-change="selectDruger">
            <!--  <el-table-column type="selection" width="55">
              </el-table-column> -->
          <el-table-column label="姓名">
               <template slot-scope="scope">
                    <span>{{scope.row.Name}}</span>
                </template>
          </el-table-column>
        <el-table-column label="身份证号码">
               <template slot-scope="scope">
                    <span>{{scope.row.CardId}}</span>
                </template>
          </el-table-column>
           <el-table-column label="性别" v-if="showSex">
               <template slot-scope="scope">
                    <span>{{scope.row.Sex}}</span>
                </template>
          </el-table-column>
          <el-table-column label="曾用名" v-if="showOldName">
               <template slot-scope="scope">
                    <span>{{scope.row.OldName}}</span>
                </template>
          </el-table-column>
          <el-table-column label="年龄" v-if="showAge">
               <template slot-scope="scope">
                    <span>{{scope.row.Age}}</span>
                </template>
          </el-table-column>
           <el-table-column label="手机号码" v-if="showContactNumber">
               <template slot-scope="scope">
                    <span>{{scope.row.ContactNumber}}</span>
                </template>
          </el-table-column>
          <el-table-column label="人员类别" v-if="showDrugategory">
               <template slot-scope="scope">
                    <span>{{scope.row.Drugategory}}</span>
                </template>
          </el-table-column>
          <el-table-column label="民族" v-if="showEthnicity">
               <template slot-scope="scope">
                    <span>{{scope.row.Ethnicity}}</span>
                </template>
          </el-table-column>
          <el-table-column label="户籍地址" v-if="showAddress">
               <template slot-scope="scope">
                    <span>{{scope.row.PermanentAddress}}</span>
                </template>
          </el-table-column>
          <el-table-column label="现居住地" v-if="showNowAddress">
               <template slot-scope="scope">
                    <span>{{scope.row.ResidentialAddress}}</span>
                </template>
          </el-table-column>
          <el-table-column label="文化程度" v-if="showCulture">
               <template slot-scope="scope">
                    <span>{{scope.row.Culture}}</span>
                </template>
          </el-table-column>
          <el-table-column label="职业" v-if="showOccupation">
               <template slot-scope="scope">
                    <span>{{scope.row.Occupation}}</span>
                </template>
          </el-table-column>
           <el-table-column label="滥用毒品类型" width="120" v-if="showDrug">
               <template slot-scope="scope">
                    <span>{{scope.row.Variety_of_drug}}</span>
                </template>
          </el-table-column>
          <el-table-column label="签到次数" v-if="showSign">
               <template slot-scope="scope">
                    <span>{{scope.row.Sign}}</span>
                </template>
          </el-table-column>
          <el-table-column label="尿检结果" width="120" v-if="showUrineTest">
               <template slot-scope="scope">
                    <span>{{scope.row.UrineTest}}</span>
                </template>
          </el-table-column>
          <el-table-column label="报到情况" width="120" v-if="showReport">
               <template slot-scope="scope">
                    <span>{{scope.row.Report}}</span>
                </template>
          </el-table-column>
          <el-table-column label="操作">
               <template slot-scope="scope">
                    <el-button size="mini" type="success" @click="showDetail(scope.$index, scope.row)">详情</el-button>
                </template>
          </el-table-column>
        </el-table>
        <div class="pages" v-show="pages">
            <el-pagination @current-change="drugerCurrentChange" background
            :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next" :total="pageTotal">
            </el-pagination>
         </div>
        </div>
        <!--详情-->
        <el-dialog title="详情" :visible.sync="detailTableVisible" :append-to-body="true" width="80%">
        <el-table :data="detailData"  border> 
            <el-table-column property="Name" label="姓名"></el-table-column>
            <el-table-column property="CardId" label="身份证号码" width="150px"></el-table-column>
            <el-table-column  property="Age" label="年龄"></el-table-column>
            <el-table-column property="Sex" label="性别"></el-table-column>
            <el-table-column property="Ethnicity" label="民族"></el-table-column>
            <el-table-column property="Drugategory" label="人员类别"></el-table-column>
            <el-table-column property="PermanentAddress" label="户籍地址"></el-table-column>
            <el-table-column property="OldName" label="曾用名"></el-table-column>
            <el-table-column property="ResidentialAddress" label="现居住地"></el-table-column>
            <el-table-column property="Culture" label="文化程度"></el-table-column>
            <el-table-column property="Occupation" label="职业"></el-table-column>
            <el-table-column property="ContactNumber" label="手机号码" width="150px"></el-table-column>
            <el-table-column property="Variety_of_drug" label="滥用毒品类型" width="150px"></el-table-column>
            <el-table-column property="UrineTest" label="尿检结果"></el-table-column>
            <el-table-column property="Report" label="报到情况"></el-table-column>
            <el-table-column property="Sign" label="签到次数"></el-table-column>
        </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import messageData from '../../../assets/region/message.json';
    export default {
        name: 'query',
        data() {
            return {
                props: {
                 value: 'label'
                },
                chooseSex:false,
                fullscreenLoading:false,
                form:{
                    drugAccount:""
                },
                personCategory:false,
                regionData:messageData,
                detailData:[],
                detailTableVisible:false,
                commonTxtBox:true,
                signCount:false,
                report:false,
                showOldName:false,
                showSex:false,
                formLabelWidth: '120px',
                superAdmin: false,
                higherWorker:false,
                stationWorkerArr:[],
                stationWorker:false,
                areaArr: [],
                selectedOptions: [],
                showSign:false,
                showReport:false,
                showUrineTest:false,
                showContactNumber:false,
                showAge:false,
                showDrugategory:false,
                showEthnicity:false,
                showAddress:false,
                showNowAddress:false,
                showCulture:false,
                showOccupation:false,
                showDrug:false,
                basicInfoList: ['户籍地址','滥用毒品类型','人员类别','年龄'],
                drugerList:[],
                drugerSelection:[],
                currentPage:1,
                pageTotal:null,
                queryArr:[],
                obj:{},
                myRegion:"",
                myCounty:"",
                myStation:"",
                pages:false,
                filterType:[],
                typeValue:'',
                chooseVillage:"",
                filterCondition:'',
                filterArray: [{
                    label:'姓名',
                    filterValue:'姓名'
                },{
                    label:'身份证号码',
                    filterValue:'身份证号码'
                },{
                    label:"年龄",
                    filterValue:"年龄"
                },{
                    label:"性别",
                    filterValue:"性别"
                },{
                    label:"民族",
                    filterValue:"民族"
                },{
                    label:"曾用名",
                    filterValue:'曾用名'
                },{
                    label:"手机号码",
                    filterValue:'手机号码'
                },{
                    label:"人员类别",
                    filterValue:'人员类别'
                },{
                    label:"户籍地址",
                    filterValue:'户籍地址'
                },{
                    label:"职业",
                    filterValue:'职业'
                },{
                    label:"现居住地",
                    filterValue:'现居住地'
                },{
                    label:"文化程度",
                    filterValue:'文化程度'
                },{
                    label:"滥用毒品类型",
                    filterValue:'滥用毒品类型'
                },{
                    label:"签到次数",
                    filterValue:'签到次数'
                },{
                    label:"尿检结果",
                    filterValue:'尿检结果'
                },{
                    label:"报到情况",
                    filterValue:'报到情况'
                }],
                reportStatus:[{
                    label:"已报到",
                    reportValue:"已报到"
                },{
                    label:"未报到",
                    reportValue:"未报到"
                }],
                signStatus:[{
                    label:"本周",
                    signCountValue:"本周"
                },{
                    label:"上周",
                    signCountValue:"上周"
                },{
                    label:"本月",
                    signCountValue:"本月"
                },{
                    label:"上月",
                    signCountValue:"上月"
                },{
                    label:"本年",
                    signCountValue:"本年"
                }],
              /*   categoryStatus:[{
                  label:"社区戒毒",
                  category:"社区戒毒",  
                }], */
                sexStatus:[{
                    label:"男",
                    sexValue:"男"
                },{
                    label:"女",
                    sexValue:"女"
                }],
                sexValue:"",
                signCountValue:"",
                reportValue:"",
                value: '',
                filterValue:'',
                token:'',
                myPhoneNum:''
            }
        },
        created() {
            this.fullscreenLoading = true;
             //获取token
            this.token = Cookies.get('myToken');
            //获取登录手机号码
            this.myPhoneNum = Cookies.get('myPhoneNum');
            console.log(this.token);
            console.log(this.myPhoneNum);
             //获取区域
            this.myRegion = Cookies.get('myRegion');
            console.log(this.myRegion);
            //获取县
            this.myCounty = Cookies.get('myCounty');
            console.log(this.myCounty);
            //获取工作站
            this.myStation = Cookies.get('myStation');
            console.log(this.myStation);
            //获取管理区域json文件
            this.areaArr = this.regionData;
             if (this.myRegion == '超级管理员') {
                //超级管理员
                this.stationWorker = false;
                this.higherWorker = false;
                this.superAdmin = true;
                } else {
                if (this.myCounty && !this.myStation) {
                    //判断为县级帐号
                    this.superAdmin = false;
                    this.higherWorker = true;
                    for (var i = 0; i < this.areaArr.length; i++) {
                    if (this.areaArr[i].label == this.myCounty) {
                        this.areaArr = this.areaArr[i].children;
                    }
                    }
                } else if (this.myCounty && this.myStation) {
                    //判断为工作站帐号
                    this.higherWorker = false;
                    this.stationWorker = true;
                    for (var i = 0; i < this.areaArr.length; i++) {
                    for (var j = 0; j < this.areaArr[i].children.length; j++) {
                        if (this.areaArr[i].children[j].label == this.myStation) {
                        this.stationWorkerArr = this.areaArr[i].children[j].children;
                        }
                    }
                    }
                }
            }
           /*  this.$http.get(this.serverIP + '/query/message').then(response => {
                this.areaArr = response.data;
                if (this.myRegion == '超级管理员') {
                //超级管理员
                this.stationWorker = false;
                this.higherWorker = false;
                this.superAdmin = true;
                } else {
                if (this.myCounty && !this.myStation) {
                    //判断为县级帐号
                    this.superAdmin = false;
                    this.higherWorker = true;
                    for (var i = 0; i < this.areaArr.length; i++) {
                    if (this.areaArr[i].label == this.myCounty) {
                        this.areaArr = this.areaArr[i].children;
                    }
                    }
                } else if (this.myCounty && this.myStation) {
                    //判断为工作站帐号
                    this.higherWorker = false;
                    this.stationWorker = true;
                    for (var i = 0; i < this.areaArr.length; i++) {
                    for (var j = 0; j < this.areaArr[i].children.length; j++) {
                        if (this.areaArr[i].children[j].label == this.myStation) {
                        this.stationWorkerArr = this.areaArr[i].children[j].children;
                        }
                    }
                    }
                }
                }
            }, response => {
                console.log('error');
            }); */
            //进入页面加载
            this.showAge = true;
            this.showAddress = true;
            this.showDrug = true;
            this.showDrugategory = true;
            this.obj = {
                PhoneNumber:this.myPhoneNum,
                ToKen:this.token,
                PermanentAddress:"1",
                Variety_of_drug:"1",
                Drugategory:"1",
                Age:"1",
                Skip:"0"
            };
            this.showQueryResult(this.obj);
       },
        methods: {
            //查询
            searchResult:function(){
                console.log(this.obj);
                this.fullscreenLoading = true;
                if(this.form.drugAccount){
                    this.obj.Vague = this.form.drugAccount;
                    this.showQueryResult(this.obj);
                }else{
                    delete this.obj.Vague;
                    this.showQueryResult(this.obj);
                }
            },
            //删除点击的条件
            deleteQuery:function(index,item){
                 if(item.filterValue == "曾用名"){
                    delete this.obj.OldName;
                }else if(item.filterValue == '年龄'){
                    delete this.obj.Age;
                }else if(item.filterValue == '性别'){
                    delete this.obj.Sex;
                }else if(item.filterValue == '民族'){
                    delete this.obj.Ethnicity;
                }else if(item.filterValue == '人员类别'){
                    delete this.obj.Drugategory;
                }else if(item.filterValue == '户籍地址'){
                    delete this.obj.PermanentAddress;
                }else if(item.filterValue == '现居住地'){
                    delete this.obj.ResidentialAddress;
                }else if(item.filterValue == '文化程度'){
                    delete this.obj.Culture;
                }else if(item.filterValue == '职业'){
                    delete this.obj.Occupation;
                }else if(item.filterValue == '手机号码'){
                    delete this.obj.ContactNumber;
                }else if(item.filterValue == '滥用毒品类型'){
                    delete this.obj.Variety_of_drug;
                }else if(item.filterValue == '签到次数'){
                    delete this.obj.Sign;
                }else if(item.filterValue == '尿检结果'){
                    delete this.obj.UrineTest;
                }else if(item.filterValue == '报到情况'){
                    delete this.obj.Report;
                }
                this.queryArr.splice(index,1);
            },
             //工作站人员选择管理区域改变
            changeValue: function(value) {
                let obj = {};
                obj = this.stationWorkerArr.find((item) => {
                return item.value === value;
                });
                this.chooseVillage = obj.label;
                console.log(this.chooseVillage);
            },
            //输入内容改变
            changeContent:function(){
                if(this.filterValue == '年龄' || this.filterValue == '签到次数'){
                if(this.filterCondition && !(/\d+/.test(this.filterCondition))){
                    this.$notify({
                        title: '提示',
                        message: '年龄或者签到次数的输入内容只能是数字',
                        type: 'warning',
                        duration: 3000
                    }); 
                }
             }
            },
            //改变区域
            handleChange(value) {
                this.Region = value;
                console.log(this.Region);
            },
            //添加条件
            addCondition:function(){
               console.log('添加条件');
               if(this.filterValue && this.typeValue && this.filterCondition){
                   console.log(this.obj);
                       this.queryArr.push({
                            filterValue:this.filterValue,
                            typeValue:this.typeValue,
                            filterCondition:this.filterCondition
                        });
                        this.filterValue = "";
                        this.typeValue = "";
                        this.filterCondition = "";
               }else if(this.filterValue && this.typeValue && this.reportValue){
                    this.queryArr.push({
                            filterValue:this.filterValue,
                            typeValue:this.typeValue,
                            reportValue:this.reportValue
                        });
                    this.filterValue = "";
                    this.typeValue = "";
                    this.reportValue = "";
               }else if(this.filterValue && this.typeValue && this.signCountValue){
                    this.queryArr.push({
                            filterValue:this.filterValue,
                            typeValue:this.typeValue,
                            signCountValue:this.signCountValue
                        });
                    this.filterValue = "";
                    this.typeValue = "";
                    this.signCountValue = "";
               }else if(this.filterValue && this.typeValue && this.sexValue){
                    this.queryArr.push({
                            filterValue:this.filterValue,
                            typeValue:this.typeValue,
                            sexValue:this.sexValue
                        });
                    this.filterValue = "";
                    this.typeValue = "";
                    this.sexValue = "";
                }else{
                   this.$notify({
                        title: '添加失败',
                        message: '请先选择后再添加',
                        type: 'warning',
                        duration: 3000
                    }); 
               }
            },
            //点击查询按钮
            queryBtn:function(){
                this.fullscreenLoading = true;
                console.log(this.queryArr);
                if(this.queryArr.length > 0){
                console.log(this.obj);
                this.obj.PhoneNumber = this.myPhoneNum;
                this.obj.ToKen = this.token;
                this.obj.Skip = "0";
                console.log(this.obj);
                this.queryArr.forEach ((item)=>{
                   if(item.filterValue == "曾用名"){
                       console.log(1111);
                       this.obj.OldName = item.typeValue + item.filterCondition;
                       this.showOldName = true;
                       this.basicInfoList.push("曾用名");
                   }else if(item.filterValue == '姓名'){
                       this.obj.Name = item.typeValue + item.filterCondition;
                   }else if(item.filterValue == '身份证号码'){
                       this.obj.CardId = item.typeValue + item.filterCondition;
                   }else if(item.filterValue == '年龄'){
                       this.obj.Age = item.typeValue + item.filterCondition;
                   }else if(item.filterValue == '性别'){
                      /*  let sex = "";
                       if(item.filterCondition == "男"){
                           sex = "1"
                       }else if(item.filterCondition == "女"){
                           sex = "2"
                       } */
                       let sex ="";
                       if(item.sexValue == "男"){
                           sex = "1";
                       }else if(item.sexValue == "女"){
                           sex = "2";
                       }
                       this.obj.Sex = item.typeValue + sex;
                       this.showSex = true;
                       this.basicInfoList.push("性别");
                   }else if(item.filterValue == '民族'){
                       this.obj.Ethnicity = item.typeValue + item.filterCondition;
                       this.showEthnicity = true;
                       this.basicInfoList.push("民族");
                   }else if(item.filterValue == '人员类别'){
                       this.obj.Drugategory = item.typeValue + item.filterCondition;
                    //    this.showDrugategory = true;
                   }else if(item.filterValue == '户籍地址'){
                       this.obj.PermanentAddress = item.typeValue + item.filterCondition;
                    //    this.showAddress = true;
                   }else if(item.filterValue == '现居住地'){
                       this.obj.ResidentialAddress = item.typeValue + item.filterCondition;
                       this.showNowAddress = true;
                       this.basicInfoList.push("现居住地");
                   }else if(item.filterValue == '文化程度'){
                       this.obj.Culture = item.typeValue + item.filterCondition;
                       this.showCulture = true;
                       this.basicInfoList.push("文化程度");
                   }else if(item.filterValue == '职业'){
                       this.obj.Occupation = item.typeValue + item.filterCondition;
                       this.showOccupation = true;
                       this.basicInfoList.push("职业");
                   }else if(item.filterValue == '手机号码'){
                       this.obj.ContactNumber = item.typeValue + item.filterCondition;
                       this.showContactNumber = true;
                       this.basicInfoList.push("手机号码");
                   }else if(item.filterValue == '滥用毒品类型'){
                       this.obj.Variety_of_drug = item.typeValue + item.filterCondition;
                       this.showDrug = true;
                   }else if(item.filterValue == '签到次数'){
                       let sign ="";
                       if(item.signCountValue == "本周"){
                           sign = "This_Week";
                       }else if(item.signCountValue == "上周"){
                           sign = "Last_Week";
                       }else if(item.signCountValue == "本月"){
                           sign = "This_Month";
                       }else if(item.signCountValue == "上月"){
                           sign = "Last_Month";
                       }else if(item.signCountValue == "本年"){
                           sign = "This_Year";
                       }
                       this.obj.Sign = item.typeValue + sign;
                       this.showSign = true;
                       this.basicInfoList.push("签到次数");
                   }else if(item.filterValue == '尿检结果'){
                       this.obj.UrineTest = item.typeValue + item.filterCondition;
                       this.showUrineTest = true;
                       this.basicInfoList.push("性别");
                   }else if(item.filterValue == '报到情况'){
                       console.log('这是报到情况');
                       this.obj.Report = item.typeValue + item.reportValue;
                       this.showReport = true;
                       this.basicInfoList.push("报到情况");
                   }
                });
                this.showQueryResult(this.obj);
                }else{
                   this.$notify({
                        title: '查询失败',
                        message: '添加的条件不能为空',
                        type: 'warning',
                        duration: 3000
                    }); 
                }
            },
            //匹配字段改变的回调
            filterChange:function(){
                this.typeValue = "";
                if(this.filterValue == '年龄'){
                // if(this.filterValue == '年龄' || this.filterValue == '签到次数'){
                  this.commonTxtBox = true;
                  this.signCount = false;
                  this.report = false;
                  this.chooseSex = false;
                   this.filterType = [{
                    typeValue:'=',
                    label:'等于'
                    },{
                        typeValue:'>',
                        label:'大于'
                    },{
                        typeValue:'<',
                        label:'小于'
                    }];
                }else if(this.filterValue == "报到情况"){
                    this.commonTxtBox = false;
                    this.report = true;
                    this.signCount = false;
                    this.chooseSex = false;
                    this.filterType =[{
                        typeValue:'=',
                        label:'等于'
                    }];
                   /*  this.typeValue = "等于"; */
                }else if(this.filterValue == '签到次数'){
                    this.commonTxtBox = false;
                    this.report = false;
                    this.signCount = true;
                    this.chooseSex = false;
                    this.filterType =[{
                        typeValue:'=',
                        label:'等于'
                    }];
                   /*  this.typeValue = "等于"; */
                }else if(this.filterValue == '性别'){
                    this.commonTxtBox = false;
                    this.report = false;
                    this.signCount = false;
                    this.chooseSex = true;
                     this.filterType =[{
                        typeValue:'=',
                        label:'等于'
                    }];
                }else{
                    this.commonTxtBox = true;
                    this.signCount = false;
                    this.chooseSex = false;
                    this.report = false;
                    this.filterType =[{
                        typeValue:'=',
                        label:'等于'
                    }]
                   /*  this.typeValue = "等于"; */
                }
            },
            //删除条件
            removeCondition:function(){
                // this.queryArr.pop();
                console.log(this.obj);  
                let arrEnd = this.queryArr[this.queryArr.length-1];
                console.log(arrEnd);
                if(arrEnd.filterValue == "曾用名"){
                    delete this.obj.OldName;
                }else if(arrEnd.filterValue == '年龄'){
                    delete this.obj.Age;
                }else if(arrEnd.filterValue == '性别'){
                    delete this.obj.Sex;
                }else if(arrEnd.filterValue == '民族'){
                    delete this.obj.Ethnicity;
                }else if(arrEnd.filterValue == '人员类别'){
                    delete this.obj.Drugategory;
                }else if(arrEnd.filterValue == '户籍地址'){
                    delete this.obj.PermanentAddress;
                }else if(arrEnd.filterValue == '现居住地'){
                    delete this.obj.ResidentialAddress;
                }else if(arrEnd.filterValue == '文化程度'){
                    delete this.obj.Culture;
                }else if(arrEnd.filterValue == '职业'){
                    delete this.obj.Occupation;
                }else if(arrEnd.filterValue == '手机号码'){
                    delete this.obj.ContactNumber;
                }else if(arrEnd.filterValue == '滥用毒品类型'){
                    delete this.obj.Variety_of_drug;
                }else if(arrEnd.filterValue == '签到次数'){
                    delete this.obj.Sign;
                }else if(arrEnd.filterValue == '尿检结果'){
                    delete this.obj.UrineTest;
                }else if(arrEnd.filterValue == '报到情况'){
                    delete this.obj.Report;
                }
                this.queryArr.pop();
                console.log(this.obj);
            },
            //查看详情
            showDetail:function(index,row){
                console.log(index,row);
                this.detailData = [];
                this.detailTableVisible = true;
                this.detailData.push(row);
            },
            //根据查询条件不同显示不同的内容
            showQueryResult:function(obj){
                this.$http
                    .post(this.serverIP+"/query/index", obj).then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.fullscreenLoading = false;
                            this.drugerList = response.data.data.druguser;
                            this.pages = true;
                            this.pageTotal = response.data.data.count;
                            for(var i=0;i<this.drugerList.length;i++){
                                switch(this.drugerList[i].Sex){
                                    case 0:
                                    this.drugerList[i].Sex = "";
                                    break;
                                    case 1:
                                    this.drugerList[i].Sex = "男";
                                    break;
                                    case 2:
                                    this.drugerList[i].Sex = "女";
                                    break;
                                }
                            }
                        } else {
                            this.$notify({
                                title: '查询失败',
                                message: response.data.errmsg,
                                type: 'warning',
                                duration: 3000
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });    
            },
            //整行选择
            selectRow:function(row){
                console.log(row);
                this.$refs.multipleDrugerTable.toggleRowSelection(row);
            },
            //点击吸毒人员前面复选框
            selectDruger(val) {
                this.drugerSelection = val;
                console.log(this.drugerSelection);
            },
             //吸毒人员列表当前页改变
            drugerCurrentChange(val) {
                this.fullscreenLoading = true;
                let newVal = (val - 1) * 10 + '';
                // console.log(newVal);
                this.obj.Skip = newVal;
                // console.log(this.obj);
                this.showQueryResult(this.obj);
            },
            //点击搜索按钮
            searchBtn:function(){
                 /* console.log(this.obj);
                 console.log(this.Region);
                 console.log(this.selectedOptions); */
                 //根据选择区域，加载对应的工作人员
                // this.obj = {};
                this.obj.PhoneNumber = this.myPhoneNum;
                this.obj.ToKen = this.token;
                this.obj.Skip = "0";
                if (this.myRegion == '超级管理员') {
                    //超级管理员
                    this.obj.county = this.Region[0];
                    this.obj.station = this.Region[1];
                    this.obj.villages = this.Region[2];
                    this.showQueryResult(this.obj);
                } else {
                    if (this.myCounty && !this.myStation) {
                    //判断为县级帐号
                    this.obj.county = this.myCounty;
                    this.obj.station = this.Region[0];
                    this.obj.villages = this.Region[1];
                    this.showQueryResult(this.obj);
                  } else if (this.myCounty && this.myStation) {
                    //判断为工作站帐号
                     this.obj.county = this.myCounty;
                    this.obj.station = this.myStation;
                    this.obj.villages = this.chooseVillage;
                    this.showQueryResult(this.obj);
                }
              }
            },
            //选择基本情况
            chooseBasic:function(){
                if(this.basicInfoList.length > 0){
               /*  console.log(this.basicInfoList);
                console.log(this.obj); */
                /* this.obj = {}; */
                this.showOldName=false;
                this.showSex=false;
                this.showSign=false;
                this.showReport=false;
                this.showUrineTest=false;
                this.showContactNumber=false;
                this.showAge=false;
                this.showDrugategory=false;
                this.showEthnicity=false;
                this.showAddress=false;
                this.showNowAddress=false;
                this.showCulture=false;
                this.showOccupation=false;
                this.showDrug=false;
                // console.log(this.showOldName);
                this.obj.PhoneNumber = this.myPhoneNum;
                this.obj.ToKen = this.token;
                this.obj.Skip = "0";
                console.log(this.obj);
                this.basicInfoList.forEach ((item)=>{
                   if(item == "曾用名"){
                    //    this.obj.OldName = "1";
                       this.showOldName = true;
                   }else if(item == '年龄'){
                    //    this.obj.Age = "1";
                       this.showAge= true;
                   }else if(item == '性别'){
                    //    this.obj.Sex = "1";
                       this.showSex = true;
                   }else if(item == '民族'){
                    //    this.obj.Ethnicity = "1";
                       this.showEthnicity = true;
                   }else if(item == '人员类别'){
                    //    this.obj.Drugategory = "1";
                       this.showDrugategory = true;
                   }else if(item == '户籍地址'){
                    //    this.obj.PermanentAddress = "1";
                       this.showAddress = true;
                   }else if(item == '现居住地'){
                    //    this.obj.ResidentialAddress = "1";
                       this.showNowAddress = true;
                   }else if(item == '文化程度'){
                    //    this.obj.Culture = "1";
                       this.showCulture = true;
                   }else if(item == '职业'){
                    //    this.obj.Occupation = "1";
                       this.showOccupation = true;
                   }else if(item == '手机号码'){
                    //    this.obj.ContactNumber = "1";
                       this.showContactNumber = true;
                   }else if(item == '滥用毒品类型'){
                    //    this.obj.Variety_of_drug = "1";
                       this.showDrug = true;
                   }else if(item == '签到次数'){
                    //    this.obj.Sign = "1";
                       this.showSign = true;
                   }else if(item == '尿检结果'){
                    //    this.obj.UrineTest = "1";
                       this.showUrineTest = true;
                   }else if(item == '报到情况'){
                    //    this.Report = "1";
                       this.showReport = true;
                   }
                });
                console.log(this.basicInfoList);
                this.showQueryResult(this.obj);
                }else{
                   this.showOldName=false;
                    this.showSex=false;
                    this.showSign=false;
                    this.showReport=false;
                    this.showUrineTest=false;
                    this.showContactNumber=false;
                    this.showAge=false;
                    this.showDrugategory=false;
                    this.showEthnicity=false;
                    this.showAddress=false;
                    this.showNowAddress=false;
                    this.showCulture=false;
                    this.showOccupation=false;
                    this.showDrug=false;
                }
            }
        }
    };
</script>

<style scoped>
    .queryBtn,.addRemove{
        width: 100%;
        display: flex;
        justify-content:flex-end;
        margin-bottom: 20px;
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
    .searchBtn {
        margin-left: 10px !important;
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
    .content {
        width: 100%;
        padding: 20px 10px;
        background: #2c5aa0;
        margin-bottom: 20px;
    }
    .filterCondition{
        background: #2c5aa0;
        margin: 10px 0 20px;
    }
    .searchArea{
        width:500px;
        margin-right: 20px;
    }
    .searchArea .el-cascader{
        width: 100%;
    }
    .searchArea,.searchBtn{
        display: inline-block;
    }
    .basicInfo{
        margin-bottom: 20px;
        width: 100%;
    }
    .basicInfo .basicTitle{
        width: 8%;
        margin-right: 2%;
        float: left;
        line-height: 35px;
    }
    .basicTitle h3{
        font-weight: normal;
        color:#9ec5f5;
        text-align: right;
    }
    .basicInfo .checkDetail{
        width: 90%;
        line-height: 30px;
        float: left;
    }
    .checkDetail .el-checkbox+.el-checkbox{
        margin-left: 15px;
    }
    .pages{
        margin: 20px 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
    .filerHeader,.filterContent{
        width: 100%;
        border:1px solid #022c6d;
        font-size: 14px;
    }
    .filterContent{
        border-top: 0;
    }
    .filerHeader span{
        width: 33%;
        line-height: 40px;
        border-right:1px solid #022c6d;
        display: inline-block;
        text-align: center;
        color:#fff;
    }
    .filterContent .filterItem{
        padding: 20px 0;
        width: 33%;
        border-right:1px solid #022c6d;
        text-align: center;
        display: inline-block;
    }
    .filterTxtBox{
        border-right: 0 !important;
    }
    h4{
        font-size: 16px;
        font-weight: normal;
        color: #fff;
    }
    .clear:after {  
        content: "."; 
        display: block;
         height: 0;
          clear: both; 
          visibility: hidden;
    }
    .clearfix { *zoom:1; }
    .queryArr{
        border:1px solid #7ab4f3;
        border-radius: 3px;
        padding: 20px 10px;
        margin-bottom: 20px;
    }  
    .queryArr li{
        line-height: 30px;
        color: #fff;
        cursor: pointer;
        font-size: 14px;
    }
    .queryArr li span,.queryArr li i{
       display: inline-block;
    }
    .queryArr .queryCondition{
        width: 300px;
    }
    .el-icon-close{
        color: #fff;
    }
</style>
