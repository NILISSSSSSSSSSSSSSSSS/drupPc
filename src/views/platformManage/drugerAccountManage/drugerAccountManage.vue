<template>
   <div v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中">
    <div class="drugerWrapper searchTable">
       <!--  <div class="villageChecked">
            <el-checkbox v-model="registerChecked" @change="isRegister">已注册</el-checkbox>
            <span class="info">（只能对已注册的吸毒人员进行帐号管理操作）</span>
        </div> -->
        <el-table :data="drugerList" style="width: 100%" border>
            <el-table-column label="姓名" width="180">
                <template slot-scope="scope">
                    <span>{{ scope.row.Name}}</span>
                </template>
                    </el-table-column>
                    <el-table-column  label="身份证号码">
                <template slot-scope="scope">
                    <span>{{ scope.row.CardId}}</span>
                </template>
                    </el-table-column>
                    <el-table-column  label="注册时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.CreateTime}}</span>
                </template>
                    </el-table-column>
                <el-table-column  label="手机号码" v-if="showPhone">
                <template slot-scope="scope">
                    <span>{{ scope.row.DrugRegisterPhone}}</span>
                </template>
                    </el-table-column>
                    <el-table-column  label="所属区域">
                <template slot-scope="scope">
                    <span>{{ scope.row.Villages}}</span>
                </template>
                    </el-table-column>
                    <el-table-column label="操作" v-if="showHandle">
                <template slot-scope="scope">
                    <div v-show="handle">
                        <!-- <el-button size="mini" type="primary" plain @click="handleEdit(scope.$index, scope.row)">修改手机号码</el-button>
                            <el-button size="mini" type="danger"  @click="handleReset(scope.$index, scope.row)">重置密码</el-button> -->
                        <el-button size="mini" type="success" @click="handleAccount(scope.$index, scope.row)">帐号管理</el-button>
                    </div>
                </template>
            </el-table-column>
            </el-table>
        <div class="pages">
            <el-pagination @current-change="drugerCurrentChange" background
                :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next" :total="pageTotal">
            </el-pagination>
        </div>
    <!--帐号管理弹出窗口-->
    <el-dialog title="帐号管理" :visible.sync="accoutManageVisible" :append-to-body="true">
        <div class="accoutHandle">
        <el-switch  v-model="switchChecked" :active-text="switchInfo" @change="isSwitchPhone"></el-switch>
        </div>
        <div class="accoutHandle">
            <el-button size="mini" type="primary" @click="handleEdit()">修改手机号码</el-button>
            <el-button size="mini" type="danger"  @click="handleReset()">修改密码</el-button>
        </div>
              <div>
                <h2 class="historyTitle">历史记录</h2>
                <p v-show="noData" class="noData">暂无数据</p>
                <ul class="historyArr">
                    <li v-for="(item,index) in historyArr" :key="index">
                        操作人：{{item.OP}}，操作时间：{{item.createTime}}，操作的手机号码：{{item.DrugOldPhoneNumber}}
                    </li>
                </ul>
            </div>
    </el-dialog>
    <!--重置密码弹出窗口-->
     <el-dialog title="修改密码" :visible.sync="resetPassFormVisible" :append-to-body="true">
        <el-form :model="resetForm">
            <el-form-item label="新密码" :label-width="formLabelWidth">
            <el-input v-model="resetForm.newPassword" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="resetPassFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmReset">确定修改</el-button>
        </div>
    </el-dialog>
    <!--修改手机号码弹出窗口-->
    <el-dialog title="修改手机号码" :visible.sync="editPhoneFormVisible" :append-to-body="true">
        <el-form :model="form">
            <el-form-item label="新手机号码" :label-width="formLabelWidth">
            <el-input v-model="form.phoneNum" auto-complete="off" :maxlength="11"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="editPhoneFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmEdit">确定修改</el-button>
        </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
    import Cookies from 'js-cookie';
    var _this;
    export default {
        name: 'drugerAccountManage',
        data() {
            return {
                fullscreenLoading:false,
                switchInfo:"禁用当前手机号码",
                noData:true,
                registerChecked: false,
                accoutManageVisible: false,
                editPhoneFormVisible: false,
                formLabelWidth: '120px',
                drugerList: [],
                token: "",
                myPhoneNum: "",
                form: {
                    phoneNum: ""
                },
                showPhone:false,
                // showHandle: false,
                showHandle: true,
                pageTotal: null,
                resetForm: {
                    newPassword: ""
                },
                chooseObj: {},
                currentPage: 1,
                switchChecked: false,
                resetPassFormVisible: false,
                drugerName: "",
                drugerPhone: "",
                drugerId: "",
                name: "",
                activeHistory: '1',
                historyArr:[],
                handle: true
            };
        },
        created() {
            this.fullscreenLoading = true;
            _this = this;
            //获取token
            this.token = Cookies.get('myToken');
            console.log(this.token);
            //获取登录手机号码
            this.myPhoneNum = Cookies.get('myPhoneNum');
            console.log(this.myPhoneNum);
            //获取吸毒人员的信息
            this.chooseObj.ToKen = this.token;
            this.chooseObj.PhoneNumber = this.myPhoneNum;
            this.chooseObj.Skip = 0;
            this.chooseObj.isRegister = 1;
            this.showDrugerList(this.chooseObj);
        },
        methods: {
            //封装是否启用手机号码
            switchPhone: function(obj) {
                this.$http
                    .post(this.serverIP + "/query/writedrugstate", obj).then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.$notify({
                                title: '成功',
                                message: response.data.data,
                                type: 'success',
                                duration: 3000
                            });
                            this.accoutManageVisible = false;
                        } else {
                            this.$notify({
                                title: '失败',
                                message: response.data.data,
                                type: 'warning',
                                duration: 3000
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            //是否启用当前手机号码
            isSwitchPhone: function() {
                console.log(this.switchChecked);
                if (this.switchChecked) {
                     this.$confirm(`确定禁用${this.drugerName}的手机号码？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        _this.switchPhone({
                            PhoneNumber: this.myPhoneNum,
                            ToKen: this.token,
                            Type: "True",
                            DrugCardId: this.drugerId
                        });
                        this.switchInfo = "启用当前帐号";
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消启用'
                        });
                        this.switchChecked = false;
                    });
                } else {
                    console.log(333);
                     this.$confirm(`确定启用${this.drugerName}的手机号码？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        _this.switchPhone({
                            PhoneNumber: this.myPhoneNum,
                            ToKen: this.token,
                            Type: "False",
                            DrugCardId: this.drugerId
                        });
                        this.switchInfo = "禁用当前帐号";
                        this.switchChecked = false;
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消禁用'
                        });
                        this.switchChecked = true;
                    });
                }
            },
            //是否注册
            /* isRegister: function() {
                if (this.registerChecked) {
                    //已注册
                    this.fullscreenLoading = true;
                    this.chooseObj.isRegister = 1;
                    this.showHandle = true;
                    this.showPhone = true;
                    this.showDrugerList(this.chooseObj);
                } else {
                    //未注册
                    this.fullscreenLoading = true;
                    delete this.chooseObj.isRegister;
                    this.showHandle = false;
                    this.showPhone = false;
                    this.showDrugerList(this.chooseObj);
                }
            }, */
            //加载历史记录
            showHistory:function(){
                     this.$http
                        .post(this.serverIP + "/query/readdrugstate", {
                                PhoneNumber:this.myPhoneNum,
                                ToKen:this.token,
                                DrugCardId:this.drugerId
                        }).then(response => {
                            console.log(response);
                            if (response.data.errno == 0) {
                               this.historyArr = response.data.data.TelephoneHistory;
                               this.switchChecked = response.data.data.DrugState;
                               if(this.historyArr.length > 0){
                                   this.noData = false;
                               }else{
                                   this.noData = true;
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
            //加载吸毒人员信息列表
            showDrugerList: function(obj) {
                this.$http
                    .post(this.serverIP + "/query/querydruginfo", obj).then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.fullscreenLoading = false;
                            this.drugerList = response.data.data.druguser;
                            this.pageTotal = response.data.data.count;
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
            //改变吸毒人员当前页
            drugerCurrentChange(val) {
                this.fullscreenLoading = true;
                let newVal = (val - 1) * 10;
                this.chooseObj.Skip = newVal;
                this.showDrugerList(this.chooseObj);
            },
            //帐号管理
            handleAccount: function(index, row) {
                console.log(index, row);
                this.accoutManageVisible = true;
                this.drugerName = row.Name;
                this.drugerPhone = row.DrugRegisterPhone;
                this.drugerId = row.CardId;
                //加载历史记录
                this.showHistory();
            },
            //修改吸毒人员手机号码
            handleEdit: function() {
                this.editPhoneFormVisible = true;
                console.log(this.drugerName);
                console.log(this.drugerPhone);
            },
            //重置密码
            handleReset: function() {
                console.log(this.drugerName);
                console.log(this.drugerPhone);
                this.resetPassFormVisible = true;
            },
            //确定重置密码
            confirmReset: function() {
                this.$confirm(`确定修改${this.drugerName}的密码吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http
                        .post(this.serverIP + "/index/fixdrugppassword", {
                            ToKen: this.token,
                            PhoneNumber: this.myPhoneNum,
                            DrugPhoneNumber: this.drugerPhone,
                            PassWord: this.hexSha1(_this.resetForm.newPassword)
                        }).then(response => {
                            console.log(response);
                            if (response.data.errno == 0) {
                                this.$notify({
                                    title: '修改成功',
                                    message: response.data.errmsg,
                                    type: 'success',
                                    duration: 3000
                                });
                                this.resetPassFormVisible = false;
                                this.resetForm.newPassword = "";
                            } else {
                                this.$notify({
                                    title: '修改失败',
                                    message: response.data.errmsg,
                                    type: 'warning',
                                    duration: 3000
                                });
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消重置'
                    });
                });
            },
            //确定修改手机号码
            confirmEdit: function() {
                this.$confirm(`确定修改${this.drugerName}的手机号码吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http
                        .post(this.serverIP + "/index/fixdrugphonenumber", {
                            ToKen: this.token,
                            PhoneNumber: this.myPhoneNum,
                            DrugOldPhoneNumber: this.drugerPhone,
                            DrugNewPhoneNumber: this.form.phoneNum
                        }).then(response => {
                            console.log(response);
                            if (response.data.errno == 0) {
                                this.$notify({
                                    title: '修改成功',
                                    message: response.data.errmsg,
                                    type: 'success',
                                    duration: 3000
                                });
                                this.editPhoneFormVisible = false;
                                this.form.phoneNum = "";
                                this.accoutManageVisible = false;
                                // this.backBtn();
                                //刷新
                                this.showDrugerList(this.chooseObj);
                            } else {
                                this.$notify({
                                    title: '修改失败',
                                    message: response.data.errmsg,
                                    type: 'warning',
                                    duration: 3000
                                });
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消重置'
                    });
                });
            }
        }
    };
</script>

<style scoped>
    .info{
        font-size: 14px;
        color: #ee4750;
        margin-left: 10px;
    }
    .drugerWrapper {
        margin-top: 30px;
    }
    .historyTitle{
        line-height: 32px;
        font-size: 14px;
        border-bottom: 1px dotted #ccc;
        margin-bottom: 10px;
        font-weight: normal;
    }
    .historyArr li{
        line-height: 30px;
    }
    .noData{
        width: 100%;
        line-height: 30px;
        font-size: 12px;
    }
    .pages {
        margin: 20px 0;
        display: flex;
        justify-content: flex-end;
    }
    .btnBack {
        font-size: 14px;
    }
    .villageChecked {
        margin-bottom: 15px;
    }
    .accoutHandle {
        margin-bottom: 20px;
    }
    .accoutManage {
        height: 300px;
        overflow-y: auto;
    }
</style>
