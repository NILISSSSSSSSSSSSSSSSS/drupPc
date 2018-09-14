<template>
    <div v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中">
        <!--查询输入框-->
        <div v-show="showDrugers">
        <div class="searchBox">
            <el-form ref="form" :model="form" label-width="200px" size="small">
                <!--  <div class="chooseValue">
                    <el-select v-model="checkedValue" placeholder="请先选择后再进行搜索" @change="chooseChange()">
                    <el-option v-for="item in chooseOption" :key="item.checkedValue" :label="item.label" :value="item.checkedValue"></el-option></el-select>
                </div> -->
                <el-input v-model="form.drugAccount" class="searchInput" placeholder="请输入内容进行查询"></el-input>
                <el-button type="primary" @click="searchResult()" class="searchBtn">查询</el-button>
                <el-button type="primary" @click="createDruger">录入</el-button>
                <!--创建吸毒人员帐号-->
                <el-dialog title="创建吸毒人员帐号" :visible.sync="drugFormVisible" :append-to-body="true">
                    <el-form :model="drugForm">
                        <el-form-item label="姓名" :label-width="formLabelWidth">
                            <el-input v-model="drugForm.name" auto-complete="off" placeholder="请输入吸毒人员姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号码" :label-width="formLabelWidth">
                            <el-input v-model="drugForm.IDNO" auto-complete="off" :maxlength=18 placeholder="请输入吸毒人员身份证号码"></el-input>
                        </el-form-item>
                        <el-form-item label="人员类别" :label-width="formLabelWidth">
                            <el-select v-model="categoryValue" placeholder="请选择吸毒人员类别">
                                <el-option v-for="item in personalCategory" :key="item.categoryValue" :label="item.label" :value="item.categoryValue">
                                </el-option>
                            </el-select>
                            <!-- <span>{{categoryValue}}</span> -->
                        </el-form-item>
                        <el-form-item label="原籍" :label-width="formLabelWidth">
                            <el-input v-model="drugForm.PermanentAddress" auto-complete="off" placeholder="请输入吸毒人员原籍"></el-input>
                        </el-form-item>
                        <el-form-item label="所属区域" :label-width="formLabelWidth">
                            <div class="block">
                                <el-cascader :options="areaArr" v-model="selectedOptions" @change="handleChange" :props="props">
                                </el-cascader>
                            </div>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="drugFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="drugSave">确 定</el-button>
                    </div>
                </el-dialog>
            </el-form>
        </div>
         <div class="chooseRole villageChecked">
        <el-checkbox-group v-model="checkedRole" @change="handleRole">
            <el-checkbox label="社区戒毒"></el-checkbox>
            <el-checkbox label="社区康复"></el-checkbox>
            <el-checkbox label="重点关注"></el-checkbox>
        </el-checkbox-group>
        </div>    
        <!--查询结果表格-->
        <div class="searchTable">
            <el-table :data="druguser" style="width: 100%" class="searchTable" border>
                  <el-table-column type="index" :index="indexMethod">
                  </el-table-column>
                <el-table-column label="姓名" width="120" sortable="custom">
                    <template slot-scope="scope">
                        <span>{{ scope.row.Name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="性别" width="80" sortable="custom">
                    <template slot-scope="scope">
                        <span>{{ scope.row.Sex}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="民族" width="80" sortable="custom">
                    <template slot-scope="scope">
                        <span>{{ scope.row.Ethnicity}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="身份证号码" width="165" sortable="custom">
                    <template slot-scope="scope">
                        <span>{{ scope.row.CardId}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="录入时间" width="150" sortable="custom">
                    <template slot-scope="scope">
                        <span>{{ scope.row.CreateTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="录入来源" width="150" sortable="custom">
                    <template slot-scope="scope">
                        <span>{{ scope.row.From}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="工作人员" width="120" sortable="custom">
                    <template slot-scope="scope">
                        <span>{{ scope.row.BindWorkerName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="所在地" sortable="custom">
                    <template slot-scope="scope">
                        <span>{{ scope.row.area}}</span>
                    </template>
                </el-table-column>
                 <el-table-column label="户籍地址" sortable="custom">
                    <template slot-scope="scope">
                        <span>{{ scope.row.PermanentAddress}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div v-show="handle">
                            <!-- <el-button @click="handleDetail(scope.$index,scope.row)" type="text" size="small">详情</el-button> -->
                            <el-button size="mini" type="success" @click="handleDetail(scope.$index, scope.row)">电子档案</el-button>
                            <!-- <el-button size="mini" type="success" @click="accoutMange(scope.$index, scope.row)">帐号管理</el-button> -->
                            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                        </div>
                    </template>
                </el-table-column>
             </el-table>
        </div>
         <div class="pages" v-show="pages">
            <el-pagination @current-change="drugerCurrentChange" background
            :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next" :total="pageTotal">
            </el-pagination>
         </div>
    </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import messageData from '../../../assets/region/message.json';
    var _this;
    export default {
        name: 'drugTreat',
        data() {
            return {
                form: {
                    drugAccount: ''
                },
                regionData:messageData,
                showDrugers:true,
                // checkedRole: 'first',
                checkedRole: ['社区戒毒','社区康复','重点关注'],
                pages:false,
                currentPage:1,
                pageTotal:null,
                categoryValue:'',
                personalCategory: [{
                    categoryValue: '社区康复',
                    label: '社区康复'
                }, {
                    categoryValue: '社区戒毒',
                    label: '社区戒毒'
                }],
                drugTreatState:true,
                drugRecoveryState:true,
                drugPointState:true,
                selectedOptions: [],
                handle: false,
                areaArr: [],
                fullscreenLoading: false,
                drugFormVisible: false,
                dialogFormVisible: false,
                mapFormVisible:false,
                drugForm: {
                    name: '',
                    IDNO: '',
                    token: '',
                    PermanentAddress: ''
                },
                props: {
                    value: 'label'
                },
                chooseOption:[{
                label:"姓名",
                checkedValue:"姓名"
                },{
                label:"手机号码",
                checkedValue:"手机号码"
                },{
                label:"身份证号码",
                checkedValue:"身份证号码"
                }],
                choosePhone:false,
                chooseID:false,
                chooseName:false,
                checkedValue:"",
                region: '',
                myPhoneNum: '',
                formLabelWidth: '120px',
                res: [],
                druguser: [],
                 zoom: 12,
                formLabelWidth: '120px',
                activeName: '1',
                editState:"",
                Jurisdiction:"",
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                chooseRoleObj:{}
            }
        },
        created() {
            _this = this;
            this.fullscreenLoading = true;
            //进入页面默认显示
            for (var i = 0; i < this.druguser.length; i++) {
                if (this.druguser[i].Name && this.druguser[i].drugsterPass && this.druguser[i].drugsterName &&
                    this.druguser[i].CardId && this.druguser[i].County) {
                    this.handle = true;
                } else {
                    this.handle = false;
                }
            }
            //获取管理区域json文件
            this.areaArr = this.regionData;
           /*  this.$http.get(this.serverIP + '/query/message').then(response => {
                this.areaArr = response.data;
            }, response => {
                console.log('error');
            }); */
            //获取token
            this.token = Cookies.get('myToken');
            console.log(this.token);
            //获取登录手机号码
            this.myPhoneNum = Cookies.get('myPhoneNum');
            console.log(this.myPhoneNum);
            //获取县
            this.myCounty = Cookies.get('myCounty');
            //获取工作站
            this.myStation = Cookies.get('myStation');
            //进入页面查询吸毒人员
            this.chooseRoleObj.CardId = this.form.drugAccount;
            this.chooseRoleObj.PhoneNumber = this.myPhoneNum;
            this.chooseRoleObj.ToKen = this.token;
            this.chooseRoleObj.Skip = 0;
            this.searchDruger(this.chooseRoleObj);
        },
        watch: {
            //监听吸毒人员查询
            "form.drugAccount": function(value) {
                if (value) {
                    this.druguser = [];
                    this.handle = false;
                    this.pages=false;
                }
            }
        },
        methods: {
             //序号
            indexMethod(index) {
                return 10*(this.currentPage-1) + index +1;
            },
             //切换角色
             handleRole:function(){
                 if(this.checkedRole.length > 1){
                     delete this.chooseRoleObj.Drugategory;
                 }else{
                     this.chooseRoleObj.Drugategory = this.checkedRole[0];
                 }
                 this.searchDruger(this.chooseRoleObj);
             },
             //社区戒毒状态改变
             drugTreatChange:function(){
                 console.log(this.drugTreatState);
                 console.log('社区戒毒');
                 if(this.drugTreatState){
                     this.chooseRoleObj.Drugategory = "社区戒毒";
                     this.searchDruger(this.chooseRoleObj);
                 }else{
                     delete this.chooseRoleObj.Drugategory; 
                     this.searchDruger(this.chooseRoleObj);
                 }
             },
             //社区康复状态改变
             drugRecoveryChange:function(){
                  console.log(this.drugRecoveryState);
                  console.log('社区康复');
                   if(this.drugTreatState){
                     this.chooseRoleObj.Drugategory = "社区康复";
                     this.searchDruger(this.chooseRoleObj);
                 }else{
                     delete this.chooseRoleObj.Drugategory; 
                     this.searchDruger(this.chooseRoleObj);
                 }
             },
             //重点关注状态
             drugPointChange:function(){
                  console.log(this.drugPointState);
                 console.log('重点关注');
                  if(this.drugTreatState){
                     this.chooseRoleObj.Drugategory = "重点关注";
                     this.searchDruger(this.chooseRoleObj);
                 }else{
                     delete this.chooseRoleObj.Drugategory; 
                     this.searchDruger(this.chooseRoleObj);
                 }
             },
            //选择条件改变
            chooseChange:function(){
                this.form.drugAccount="";
                if(this.checkedValue == "身份证号码"){
                this.choosePhone = false;
                this.chooseID = true;
                this.chooseName = false;
                }else if(this.checkedValue == "手机号码"){
                this.choosePhone = true;
                this.chooseID = false;
                this.chooseName = false;
                }else if(this.checkedValue == "姓名"){
                this.chooseName = true;
                this.choosePhone = false;
                this.chooseID = false;
                }
            },
            //查看吸毒人员电子档案
            handleDetail(index, row) {
                console.log(row);
                console.log(row.State);
                this.Tool.state = row.State;
                this.$router.push({
                    path: '/detail',
                    query:{
                        drugerId:row.CardId,
                        drugerState:row.State
                    }
                });
            },
            //进入吸毒人员帐号管理
            accoutMange:function(index,row){
                // console.log(index,row);
                this.$router.push({
                    path: '/drugerAccountManage',
                    query:{
                        accoutInfo:row.DrugUserInfo
                    }
                });
            },
            //删除吸毒人员
            handleDelete:function(index,row){
                // console.log(index,row);
                this.$confirm(`确定删除吸毒人员${row.Name}?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                       
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                     });          
                });
            },
            //具体地址选择
            handleChange(value) {
                this.region = value;
            },
            //录入吸毒人员帐号
            createDruger:function(){
                this.drugFormVisible = true
                // this.selectedOptions=[`${this.myCounty}`,`${this.myStation}`];
            },
            //创建吸毒人员帐号保存
            drugSave: function() {
                this.druguser = [{
                    Name: "",
                    OldName: "",
                    Sex: "",
                    CardId: "",
                    County: ""
                }];
                this.$http
                    .post(this.serverIP + "/index/druguseradd", {
                        DirugUserName: this.drugForm.name,
                        DirugUserCardId: this.drugForm.IDNO,
                        MyPhoneNumber: this.myPhoneNum,
                        PermanentAddress: this.drugForm.PermanentAddress,
                        Drugategory: this.categoryValue,
                        County: this.region[0],
                        Station: this.region[1],
                        Villages: this.region[2],
                        ToKen: this.token
                    })
                    .then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.fullscreenLoading = false;
                            this.$notify({
                                title: '创建成功',
                                message: response.data.errmsg,
                                type: 'success',
                                duration: 3000
                            });
                            this.drugFormVisible = false;
                            this.drugForm = {
                                name: '',
                                IDNO: '',
                                token: '',
                                PermanentAddress: ''
                            }
                            this.handle = false;
                            this.pages=false;
                            this.selectedOptions = [];
                            this.categoryValue = '';
                            //创建成功刷新
                            this.searchDruger(this.chooseRoleObj);
                        } else {
                            this.fullscreenLoading = false;
                            this.$notify({
                                title: '创建失败',
                                message: response.data.errmsg,
                                type: 'warning',
                                duration: 3000
                            });
                            this.pages=false;
                            this.handle=false;
                            this.drugFormVisible = false;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            //改变吸毒人员当前页
            drugerCurrentChange(val) {
                this.fullscreenLoading = true;
                let newVal = (val - 1)*10;
                this.chooseRoleObj.Skip = newVal;
                this.searchDruger(this.chooseRoleObj);
            },
            //根据电话或者身份证查询吸毒人员
            searchDruger:function(obj){
               this.$http
                .post(this.serverIP + "/query/querydruginfo", obj)
                .then(response => {
                    console.log(response);
                    if (response.data.errno == 0) {
                        this.fullscreenLoading = false;
                        this.handle = true;
                        this.res = response.data.data.druguser;
                        this.druguser = response.data.data.druguser;
                        this.pages=true;
                        this.pageTotal = response.data.data.count;
                        for (var i = 0; i < this.druguser.length; i++) {
                            this.druguser[i].area = this.res[i].County + ' - ' + this.res[i].Station + ' - ' + this.res[i].Villages;
                            switch (this.druguser[i].Sex) {
                                case 0:
                                    this.druguser[i].Sex = "";
                                    break;
                                case 1:
                                    this.druguser[i].Sex = "男";
                                    break;
                                case 2:
                                    this.druguser[i].Sex = "女";
                                    break;
                            }
                            switch (this.druguser[i].From) {
                                case "1":
                                    this.druguser[i].From = "系统分发";
                                    break;
                                case "2":
                                    this.druguser[i].From = "人工分发";
                                    break;
                                case "3":
                                    this.druguser[i].From = "pc手动录入";
                                    break;
                                 case "4":
                                   this.druguser[i].From = "app手动录入";
                                    break;
                            }
                        }
                    } else {
                        this.fullscreenLoading = false;
                        this.$notify({
                            title: '查询失败',
                            message: response.data.errmsg,
                            type: 'warning',
                            duration: 2500
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            },
            //根据电话或身份证查询吸毒人员查询吸毒人员
            searchResult: function() {
                this.fullscreenLoading = true;
                delete this.chooseRoleObj.CardId;
                delete this.chooseRoleObj.Phone;
                delete this.chooseRoleObj.Name;
                delete this.chooseRoleObj.Vague;
                if(this.form.drugAccount){
                        this.chooseRoleObj.Vague = this.form.drugAccount;
                        this.searchDruger(this.chooseRoleObj);
                        this.currentPage=1;
                    }else{
                        this.searchDruger(this.chooseRoleObj);
                        this.currentPage=1
                }
            }
        }
    };
</script>

<style lang="less">
    @import "../../table.less";
</style>
<style scoped>
   .changePerson{
       color:rgb(248, 0, 0);
   }
   .chooseRole{
       margin-bottom: 20px;
   }
    .pages{
      margin:20px 0;
      display: flex;
      justify-content: flex-end;
   }
   .el-pagination__total{
       color: #fff !important;
   }
    .el-button--text {
        font-size: 14px !important;
    }
    .searchBox {
        width: 100%;
        text-align: center;
        margin: 30px 0;
    }
    .chooseValue{
        display: inline-block;
        margin-right: 10px;
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
    .searchTable {
        position: relative;
    }
    .noData {
        width: 100%;
        text-align: center;
        height: 30px;
        line-height: 30px;
        position: absolute;
        top: 45px;
        left: 0;
        font-size: 14px;
        z-index: 9;
        color: #979B9F;
    }
    .detailWrapper {
        width: 100%;
        overflow-x: hidden;
        height: 500px;
        overflow-y: auto;
    }
    .infoTable {
        width: 100%;
        border-bottom: 1px solid #eee;
        border-left: 1px solid #eee;
    }
    .infoTable td,
    .infoTable th {
        width: 12%;
        text-align: center;
        height: 40px;
        padding: 0 10px;
        border-top: 1px solid #eee;
        border-right: 1px solid #eee;
        font-size: 14px;
        font-weight: normal;
    }
    .infoTable .tHeader {
        background: #ECF5FF;
    }
    .el-collapse-item__header {
        font-size: 16px !important;
    }
    .finishHeader {
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        font-weight: normal;
        color: #096dd5;
        /* border-left: 3px solid #00BFB0; */
    }
    .el-cascader{
        width: 100%;
    }
    .finishTable {
        margin-bottom: 20px;
    }
    .endDeclare {
        text-indent: 26px;
        margin-top: 20px;
    }
    .endDeclare b,
    .workStationInfo p b {
        border-bottom: 1px solid #bbb;
        padding: 0 12px;
        font-weight: normal;
        color: #333;
    }
    .workStationInfo {
        margin-top: 50px;
    }
    .workStationInfo p {
        text-align: right;
        ;
        margin-bottom: 20px;
    }
    .amap-demo {
      width: 100%;
      height: 450px;
    }
</style>
