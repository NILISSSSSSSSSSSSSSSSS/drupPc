<template>
    <div v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中">
        <h2 class="assignTitle">历史帮扶记录</h2>
        <el-button type="primary" icon="el-icon-edit" @click="addHelp">新增帮扶</el-button>
        <!--搜索框-->
        <div class="searchBox">
            <el-input v-model="form.searchInfo" class="searchInput" placeholder="请输入发布人姓名或者发布人的电话号码进行查询"></el-input>
            <el-date-picker v-model="startDate" type="date" placeholder="开始时间" class="chooseDate">
            </el-date-picker>
            <el-date-picker v-model="endDate" type="date" placeholder="结束时间" class="chooseDate">
            </el-date-picker>
            <el-button type="primary" class="searchBtn" @click="searchBtn">查询</el-button>
        </div>
        <div class="searchTable">
            <!--历史记录表格-->
            <el-table :data="helpHistory" border style="width: 100%">
                <el-table-column label="帮扶人" width="180">
                    <template slot-scope="scope">
                            <span>{{ scope.row.HelpPeaple}}</span>
                   </template>
            </el-table-column>
            <el-table-column label="帮扶时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.PushTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="帮扶对象">
                <template slot-scope="scope">
                    <span>{{ scope.row.HelpObject}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                    <el-button size="mini" type="success" @click="showDetail(scope.$index, scope.row)">详情</el-button>
                </template>
           </el-table-column>
        </el-table>
         <div class="pages" v-show="pages">
            <el-pagination @current-change="helpCurrentChange" background
            :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next" :total="pageTotal">
            </el-pagination>
         </div>
         <!--查询条件的分页-->
          <div class="searchPages" v-show="searchPages">
            <el-pagination @current-change="searchCurrentChange" background
            :current-page.sync="searchCurrentPage" :page-size="10" layout="total, prev, pager, next" :total="searchPageTotal">
            </el-pagination>
         </div>
        <!--详情弹窗-->
            <el-dialog title="帮扶详情" :visible.sync="dialogDetailVisible" :append-to-body="true">
                <ul class="helpDetail">
                <li>帮扶时间：{{helpDetail.PushTime}}</li>
                <li>帮扶人：{{helpDetail.HelpPeaple}}</li>
                <li>被帮扶人：{{helpDetail.HelpObject}}</li>
                <li>发布者：{{helpDetail.Name}}</li>
                <li>帮扶内容: {{helpDetail.Discrible}}</li>
                </ul>
            </el-dialog>
        <!--新增弹窗-->
        <el-dialog title="新增帮扶" :visible.sync="dialogHelpVisible" :append-to-body="true">
            <el-form :model="helpForm">
                <el-form-item label="被帮扶人" :label-width="formLabelWidth">
                <el-input v-model="helpForm.helpDruger" auto-complete="off" placeholder="请输入被帮扶人姓名">
                     <i slot="suffix" class="el-icon-circle-plus-outline iconAdd" @click="choosePeople"></i>
                </el-input>
                </el-form-item>
                <el-form-item label="帮扶人" :label-width="formLabelWidth">
                <el-input v-model="helpForm.helper" auto-complete="off" placeholder="请输入帮扶人姓名"></el-input>
                </el-form-item>
                <el-form-item label="帮扶内容" :label-width="formLabelWidth">
                  <el-input type="textarea" v-model="helpForm.content" :rows="4" resize="none" placeholder="请输入帮扶内容"></el-input>
                </el-form-item>
                <el-form-item label="帮扶时间" :label-width="formLabelWidth">
                  <el-date-picker v-model="dateValue" type="date" placeholder="选择日期">
                  </el-date-picker> 
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addBtn">新 增</el-button>
            </div>
        </el-dialog>
        <!--查询帮扶人弹窗-->
        <el-dialog title="查询" :visible.sync="choosePeopleVisible" :append-to-body="true">
            <!--上边查询人员-->
            <div class="searchDruger">
                <el-input placeholder="请输入被帮扶人员的姓名" v-model="searchDruger" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="searchName"></el-button>
                </el-input>
                <div class="drugerChecked" v-show="showCheckedDruger">
                   <el-checkbox v-model="drugerChecked">{{checkedDruger}}</el-checkbox>
                </div>
                <div class="addToHelp">
                    <el-button @click="addToHelp" type="primary" size="small">添加到被帮扶人</el-button>
                </div>
            </div>
            <div class="beHelped">
                <h3>被帮扶人</h3>
                <ul class="drugerList">
                     <li v-for="(item,index) in chooseDrugerList" :key="index">
                      <!-- <span>张三<i class="el-icon-circle-close-outline" @click="deleteChooseDruger"></i></span> -->
                      <span>{{item}}<i class="el-icon-circle-close-outline" @click="deleteChooseDruger(index)"></i></span>
                    </li>   
                </ul>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmChoose">确 定</el-button>
            </div>
        </el-dialog>
    </div>
   </div>
</template>

<script>
    import Cookies from 'js-cookie';
    export default {
        name: 'help',
        data() {
            return {
                form: {
                    searchInfo: ''
                },
                fullscreenLoading:false,
                publisher:'',
                checkedDruger:'',
                chooseDrugerList:[],
                showCheckedDruger:false,
                searchDruger: '',
                drugerChecked:false,
                choosePeopleVisible: false,
                helpDetail: {},
                pageTotal: null,
                searchPageTotal:null,
                currentPage: 1,
                searchCurrentPage:1,
                startDate: '',
                endDate: '',
                dateValue: '',
                saveDateTime:'',
                helpHistory: [],
                dialogDetailVisible: false,
                dialogHelpVisible: false,
                formLabelWidth: '150px',
                helpForm: {
                    helpDruger:'',
                    helper: '',
                    content: ''
                },
                searchPages:false,
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
                pages: false,
                token: '',
                myPhoneNum: ''
            }
        },
         watch: {
            //监听查询的电话号码或者姓名
            /* "form.searchInfo": function(value) {
                if (value == '') {
                    this.showHistory({
                        token: this.token,
                        phonenumber: this.myPhoneNum,
                        curnum: "0"
                    });
                    this.searchPages=false;
                }
            } */
        },
        created() {
            this.fullscreenLoading = true;
            //获取token
            this.token = Cookies.get('myToken');
            //获取登录手机号码
            this.myPhoneNum = Cookies.get('myPhoneNum');
            console.log(this.token);
            console.log(this.myPhoneNum);
            //发布者姓名
            this.publisher = Cookies.get('userName');
            console.log(this.publisher);
            //进入页面加载历史帮扶记录
            this.showHistory({
                token: this.token,
                phonenumber: this.myPhoneNum,
                curnum: "0"
            });
        },
        methods: {
            //加载历史帮扶记录
            showHistory: function(obj) {
                this.$http
                    .get(this.serverIP + "/help/helpgetlist", {
                        params: obj
                    }).then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.fullscreenLoading = false;
                            this.pages = true;
                            this.pageTotal = response.data.data.total;
                            this.helpHistory = response.data.data.pagedata;
                            for (var i = 0; i < this.helpHistory.length; i++) {
                                this.helpHistory[i].PushTime = this.helpHistory[i].PushTime.substring(0, 10);
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
            //查询结果显示
            showSearchResult:function(obj){
                this.$http
                    .get(this.serverIP + "/help/helpgetlist", {
                        params: obj
                    }).then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.pages=false;
                            this.searchPages = true;
                            this.searchPageTotal = response.data.data.total;
                            this.helpHistory = response.data.data.pagedata;
                            for (var i = 0; i < this.helpHistory.length; i++) {
                                this.helpHistory[i].PushTime = this.helpHistory[i].PushTime.substring(0, 10);
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
            //查看历史帮扶记录当前页改变
            helpCurrentChange(val) {
                let newVal = (val - 1) * 10 + '';
                console.log(newVal);
                this.showHistory({
                    token: this.token,
                    phonenumber: this.myPhoneNum,
                    curnum: newVal
                });
            },
            //查询结果的分页改变当前页
            searchCurrentChange(val){
                let newVal = (val - 1) * 10 + '';
                console.log(newVal);
                this.queryCondition({
                    token: this.token,
                    phonenumber: this.myPhoneNum,
                    filtername:this.form.searchInfo,
                    curnum: newVal
                },{
                    token: this.token,
                    phonenumber: this.myPhoneNum,
                    filterphone:this.form.searchInfo,
                    curnum: newVal
                },{
                    token: this.token,
                    phonenumber: this.myPhoneNum,
                    filtername:this.form.searchInfo,
                    filterbegintime:this.formatTime(this.startDate,0),
                    filterendtime:this.queryFormatTime(this.endDate),
                    curnum: newVal
                },{
                    token: this.token,
                    phonenumber: this.myPhoneNum,
                    filterphone:this.form.searchInfo,
                    filterbegintime:this.formatTime(this.startDate,0),
                    filterendtime:this.queryFormatTime(this.endDate),
                    curnum: newVal
                },{
                    token: this.token,
                    phonenumber: this.myPhoneNum,
                    filterbegintime:this.formatTime(this.startDate,0),
                    filterendtime:this.queryFormatTime(this.endDate),
                    curnum: newVal
              },{
                token: this.token,
                phonenumber: this.myPhoneNum,
                curnum: newVal
             });
            },
            //查询条件
            queryCondition:function(obj1,obj2,obj3,obj4,obj5,obj6){
                if(this.form.searchInfo && !this.startDate && !this.endDate){
                    //姓名
                    if(/^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/.test(this.form.searchInfo)){
                        console.log('姓名');
                        this.showSearchResult(obj1);
                    }else if(/^\d{11}$/.test(this.form.searchInfo)){
                        //电话号码
                        console.log('电话号码');
                        this.showSearchResult(obj2);
                    }else{
                         this.$notify({
                                title: '查询失败',
                                message: '请检查输入内容后重试',
                                type: 'warning',
                                duration: 3000
                        });
                    }
                }else if(this.form.searchInfo && this.startDate && this.endDate){
                    console.log(77777);
                    if(/^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/.test(this.form.searchInfo)){
                           this.showSearchResult(obj3);
                    }else if(/^\d{11}$/.test(this.form.searchInfo)){
                         this.showSearchResult(obj4);
                    }else{
                         this.$notify({
                                title: '查询失败',
                                message: '请检查输入内容后重试',
                                type: 'warning',
                                duration: 3000
                        });
                    }
                }else if(!this.form.searchInfo && this.startDate && this.endDate){
                    this.showSearchResult(obj5);
                }else{
                      this.showSearchResult(obj6);
                }
            },
            //查询被帮扶人员
            searchBtn:function(){
                this.queryCondition({
                    token: this.token,
                    phonenumber: this.myPhoneNum,
                    curnum: "0",
                    filtername:this.form.searchInfo
                },{
                    token: this.token,
                    phonenumber: this.myPhoneNum,
                    curnum: "0",
                    filterphone:this.form.searchInfo
                },{
                    token: this.token,
                    phonenumber: this.myPhoneNum,
                    curnum: "0",
                    filtername:this.form.searchInfo,
                    filterbegintime:this.formatTime(this.startDate,0),
                    filterendtime:this.queryFormatTime(this.endDate)
                },{
                    token: this.token,
                    phonenumber: this.myPhoneNum,
                    curnum: "0",
                    filterphone:this.form.searchInfo,
                    filterbegintime:this.formatTime(this.startDate,0),
                    filterendtime:this.queryFormatTime(this.endDate)
                },{
                    token: this.token,
                    phonenumber: this.myPhoneNum,
                    curnum: "0",
                    filterbegintime:this.formatTime(this.startDate,0),
                    filterendtime:this.queryFormatTime(this.endDate)
              },{
                token: this.token,
                phonenumber: this.myPhoneNum,
                curnum: "0"
            });
            },
            //打开新增帮扶窗口
            addHelp: function() {
                this.dialogHelpVisible = true;
            },
            //新增帮扶
            addBtn: function() {
                    this.saveDateTime = this.formatTime(this.dateValue,12);
                    this.$http
                        .post(this.serverIP + "/help/helpinfopush", {
                            token: this.token,
                            phonenumber: this.myPhoneNum,
                            Name:this.publisher,
                            pushtime:this.saveDateTime,
                            helpobject:this.helpForm.helpDruger,
                            helppeaple:this.helpForm.helper,
                            helpdiscrible:this.helpForm.content

                        }).then(response => {
                            console.log(response);
                            if (response.data.errno == 0) {
                                this.$notify({
                                    title: '新增成功',
                                    message: response.data.errmsg,
                                    type: 'success',
                                    duration: 3000
                                });
                                this.helpForm ={};
                                this.dateValue='';
                                this.showHistory({
                                    token: this.token,
                                    phonenumber: this.myPhoneNum,
                                    curnum: "0"
                                });
                                this.currentPage=1;
                                this.dialogHelpVisible=false;
                            } else {
                                this.$notify({
                                    title: '新增失败',
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
            //时间格式转换
            formatTime:function(ms,num){ 
                var date = new Date(ms);
                var year, month, day, hour, min,second;
                year = date.getFullYear();
                month = date.getMonth() + 1;
                day = date.getDate();
                hour = date.getHours()+num;
                min = date.getMinutes();
                second = date.getSeconds();
                month < 10 ? (month = '0' + month) : month;
                day < 10 ? (day = '0' + day) : day;
                hour < 10 ? (hour = '0' + hour) : hour;
                min < 10 ? (min = '0' + min) : min;
                second < 10 ? (second = '0' + second) : second;
                return `${year}-${month}-${day} ${hour}:${min}:${second}`;
            },
            //查询时间格式转换
             queryFormatTime:function(ms){ 
                var date = new Date(ms);
                var year, month, day, hour, min,second;
                year = date.getFullYear();
                month = date.getMonth() + 1;
                day = date.getDate();
                hour = date.getHours()+23;
                min = date.getMinutes()+59;
                second = date.getSeconds()+59;
                month < 10 ? (month = '0' + month) : month;
                day < 10 ? (day = '0' + day) : day;
               /*  hour < 10 ? (hour = '0' + hour) : hour;
                min < 10 ? (min = '0' + min) : min;
                second < 10 ? (second = '0' + second) : second; */
                return `${year}-${month}-${day} ${hour}:${min}:${second}`;
            },
            //查看详情
            showDetail: function(index, row) {
                // console.log(index, row);
                this.$http
                    .get(this.serverIP + "/help/helpgetinfo", {
                        params: {
                            token: this.token,
                            phonenumber: this.myPhoneNum,
                            helpid: row.id
                        }
                    }).then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.dialogDetailVisible = true;
                            this.helpDetail = response.data.data;
                            this.helpDetail.PushTime = response.data.data.PushTime.substring(0,10);
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
            //选择帮扶人员
            choosePeople: function() {
                this.choosePeopleVisible = true;
            },
            //搜索被帮扶人员的名字
            searchName: function() {
                if (this.searchDruger !== "") {
                    this.$http
                        .post(this.serverIP + "/help/helpobjectcheck", {
                                token: this.token,
                                phonenumber: this.myPhoneNum,
                                Name:this.searchDruger
                        }).then(response => {
                            console.log(response);
                            if (response.data.errno == 0) {
                                this.showCheckedDruger = true;
                                this.checkedDruger = this.searchDruger;
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
                } else {
                    this.$notify({
                        title: '查询失败',
                        message: '被帮扶人员姓名不能为空',
                        type: 'warning',
                        duration: 3000
                    });
                }
            },
            //添加到被帮扶人按钮
            addToHelp:function(){
                if(this.drugerChecked){
                    this.chooseDrugerList.push(this.checkedDruger);
                    this.checkedDruger ="";
                    this.searchDruger="";
                    this.drugerChecked=false;
                    this.showCheckedDruger=false;
                    // console.log(this.chooseDrugerList);
                }else{
                    this.$notify({
                        title: '添加失败',
                        message: '请先勾选被帮扶人员',
                        type: 'warning',
                        duration: 3000
                    });
                }
            },
            //删除被帮扶人员
            deleteChooseDruger:function(index){
                // console.log(index)
                this.chooseDrugerList.splice(index,1);
            },
            //确定保存选择的被帮扶人员
            confirmChoose:function(){
                if(this.chooseDrugerList.length>0){
                    for(var i=0;i<this.chooseDrugerList.length;i++){
                        this.helpForm.helpDruger = '';
                        this.helpForm.helpDruger += this.chooseDrugerList+',';
                        this.helpForm.helpDruger = this.helpForm.helpDruger.substring(0,this.helpForm.helpDruger.length-1);
                    }
                    this.choosePeopleVisible=false; 
                }else{
                    this.choosePeopleVisible=false;
                }
            }
        }
    }
</script>

<style scoped>
    .searchTable {
        margin-top: 30px;
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
    .dialog-footer {
        display: flex;
        justify-content: center;
    }
    .chooseDate {
        margin-left: 10px;
    }
    .iconAdd {
        font-size: 20px;
    }
    .searchInput {
        width: 500px !important;
        display: inline-block;
    }
    .searchBtn {
        display: inline-block;
        margin-left: 10px !important;
    }
    .searchBox {
        margin-top: 20px;
    }
    .pages,.searchPages{
        margin: 20px 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
    .helpDetail {
        width: 100%;
        height: 300px;
        overflow-x: hidden;
        overflow-y: auto;
        border: 1px solid #bacee2;
        border-radius: 3px;
        padding: 15px;
    }
    .helpDetail li {
        line-height: 30px;
    }
    .searchDruger,
    .beHelped {
        padding: 20px;
        background: #eef4fb;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    .beHelped h3 {
        line-height: 30px;
        font-size: 14px;
        font-weight: normal;
    }
    .beHelped .drugerList {
        /* height: 100px; */
        padding: 20px 15px;
        border: 1px solid #60ADFD;
        margin-top: 10px;
    }
    .drugerChecked{
        margin-top: 20px;
    }
    .drugerList li {
        display: inline-block;
        margin: 0 10px 10px 0;
    }
    .drugerList li span {
        height: 30px;
        line-height: 30px;
        padding: 0 18px;
        background: #3399FF;
        position: relative;
        display: inline-block;
        border-radius: 20px;
        color: #fff;
    }
    .drugerList li span i {
        position: absolute;
        font-size: 18px;
        padding: 5px;
        right: -10px;
        top: -12px;
        color: #FF0000;
        cursor: pointer;
    }
    .addToHelp{
        margin-top: 30px;
        display: flex;
        justify-content: flex-end;
    }
    .drugerChecked .el-checkbox{
       height: 30px;
       line-height: 30px;
       padding: 0 14px;
       border:1px solid #3399FF;
       border-radius: 20px; 
 }
</style>
