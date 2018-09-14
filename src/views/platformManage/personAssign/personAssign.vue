<template>
    <div v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中">
        <!--系统分发-->
        <div v-show="systemAssign">
            <h2 class="assignTitle">系统分发</h2>
            <div class="systemAssign">
                <p>
                    <Icon type="alert"></Icon>请参照下面的图片所示内容，选择相应格式的excel进行导入
                    </p>
                 <p class="assignInfo">{{assignInfo}}</p>
                <img src="../../../images/example.png">
                <div>
                    <a :href="downloadUrl" download class="downloadBtn">下载模版</a>
                    <a :href="downloadResult" download class="downloadBtn">下载导入结果说明书</a>
                </div>
                <div class="importFile">
                    <input type="file" name="Excel" ref="Excel">
                </div>
                <el-button type="primary" size="small" @click="importBtn" v-loading.fullscreen.lock="loading2" :element-loading-text="countDown" class="importBtn">导入</el-button>
            </div>
        </div>
        <!--人工分发-->
        <h2 class="assignTitle">吸毒人员分发</h2>
        <div class="handworkAssign">
            <div class="searchTable">
                <div class="searchBox">
                    <span class="needAllotCount">共有<b> {{needAllotCount}} </b>个吸毒人员待分发</span>
                    <el-input v-model="allotForm.drugAccount" class="searchInput" placeholder="请输入内容进行查询"></el-input>
                    <el-button type="primary" @click="searchAllotDruger()" class="searchBtn">查询</el-button>
                </div>
                <div class="drugerWrapper">
                <el-table ref="multipleDrugerTable" :data="assignDrugerList" border tooltip-effect="dark"
                @row-click="selectRow" style="width: 100%" @selection-change="selectDruger">
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
                <el-table-column label="目前分发区域" :label-width="drugLabelWidth" sortable="custom">
                <template slot-scope="scope">
                    {{ scope.row.presentArea}}
                </template>
                </el-table-column>
                <el-table-column label="民族" :label-width="drugLabelWidth" sortable="custom">
                <template slot-scope="scope">
                    {{ scope.row.Ethnicity}}
                </template>
                </el-table-column>
                <el-table-column label="性别" :label-width="drugLabelWidth" sortable="custom">
                <template slot-scope="scope">
                    {{ scope.row.sex }}
                </template>
                </el-table-column>
                <el-table-column label="人员类型" :label-width="drugLabelWidth" sortable="custom">
                <template slot-scope="scope">
                    {{ scope.row.personnel_classification}}
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
               <!--超级管理员-->
               <div class="searchArea">
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
              <div class="block">
                <el-button type="primary" @click="sureAllot">分发</el-button>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import messageData from '../../../assets/region/message.json';
    var _this;
    export default {
        name: 'personAssign',
        data() {
            return {
                allotForm:{
                    drugAccount:""
                },
                downloadUrl:"",
                regionData:messageData,
                needAllotCount:0,
                higherWorker: false,
                superAdmin: false,
                stationWorker: false,
                countDown: "倒计时",
                countSecond: 21,
                areaArr: [],
                selectedOptions: [],
                loading2: false,
                drugerSelection: [],
                searchDruger: '',
                editFormVisible: false,
                checked: true,
                systemAssign: false,
                token: "",
                downloadResult:"",
                myPhoneNum: "",
                drugLabelWidth: '120px',
                assignCount: 0,
                value: '',
                value1: '',
                value2: '',
                DrugCradId: "",
                value3: '',
                currentPage: 1,
                pages: false,
                form: {
                    accountNo: ''
                },
                assignInfo:"",
                stationWorkerArr: [],
                fullscreenLoading: false,
                workerCounty: "",
                workerStation: "",
                workerVillages: "",
                presentArea: "",
                assignDrugerList: [],
                handworkAssignVisible: false,
                pageTotal: null,
                assignWorkerName: "",
                categoryValue: '',
                handle: true,
                myRegion: '',
                timer: null,
                props: {
                    value: 'label'
                },
                token: "",
                chooseObj:{},
                myPhoneNum: "",
                formLabelWidth: '120px',
                handleAllotTable: []
            }
        },
        created() {
            _this = this;
            this.downloadUrl = this.resourcesUrl + '/template.xls';
            this.downloadResult = this.resourcesUrl + '/inputresult.docx';
            this.fullscreenLoading = true;//遮罩
            //获取token
            this.token = Cookies.get('myToken');
            console.log(this.token);
            //获取登录手机号码
            this.myPhoneNum = Cookies.get('myPhoneNum');
            console.log(this.myPhoneNum);
            //获取区域
            this.myRegion = Cookies.get('myRegion');
            console.log(this.myRegion);
            //判断是否是超级管理员
            if (this.myRegion == '超级管理员') {
                this.systemAssign = true;
            } else {
                this.systemAssign = false;
            }
            this.assignInfo = Cookies.get('infos');
            //获取区域
            this.myRegion = Cookies.get('myRegion');
            //获取县
            this.myCounty = Cookies.get('myCounty');
            //获取工作站
            this.myStation = Cookies.get('myStation');
            //获取管理区域json文件
            this.areaArr = this.regionData;
            if (this.myRegion == '超级管理员') {
                //超级管理员
                console.log('超级管理员');
                this.stationWorker = false;
                this.higherWorker = false;
                this.superAdmin = true;
                } else {
                    if (this.myCounty && !this.myStation) {
                        console.log('县级管理员')
                        //判断为县级帐号
                        this.superAdmin = false;
                        this.higherWorker = true;
                        for (var i = 0; i < this.areaArr.length; i++) {
                            if (this.areaArr[i].label == this.myCounty) {
                                this.areaArr = this.areaArr[i].children;
                            }
                        }
                    } else if (this.myCounty && this.myStation) {
                        console.log('工作站管理员');
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
            this.chooseObj.PhoneNumber = this.myPhoneNum;
            this.chooseObj.ToKen = this.token;
            this.searchAssignDruger(this.chooseObj);
        },
        watch: {
            countSecond: function(newVal, oldVal) {
                if (newVal <= 0) {
                    this.loading2 = false;
                    clearInterval(_this.timer);
                    this.showImportResult(); //显示系统分发结果
                }
            }
        },
        methods: {
            //查询待分发吸毒人员
            searchAllotDruger:function(){
                if(this.allotForm.drugAccount){
                    this.chooseObj.Vague = this.allotForm.drugAccount;
                    this.searchAssignDruger(this.chooseObj);
                }else{
                    delete this.chooseObj.Vague;
                    this.searchAssignDruger(this.chooseObj);
                }
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
            //创建工作人员管理区域选中值
            handleChange(value) {
                this.Region = value;
                console.log(this.Region);
                this.workersList = [];
            },
            //点击吸毒人员前面复选框
            selectDruger(val) {
                this.drugerSelection = val;
            },
            //分发吸毒人员的时候选择一行
            selectRow: function(row) {
                this.$refs.multipleDrugerTable.toggleRowSelection(row);
            },
            //定时器
            setTimer: function() {
                _this.timer = setInterval(() => {
                    _this.countSecond--;
                    _this.countDown = `倒计时${_this.countSecond}秒`;
                }, 1000)
            },
            //系统分发，获取分发结果
            showImportResult: function() {
                //获取系统分发结果
                this.$http
                    .post(this.httpUrl + "/home/sysinputexcel/systeminputgetresult", {
                        ToKen: this.token,
                        PhoneNumber: this.myPhoneNum
                    }).then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            /* this.$notify({
                                message: `总共${response.data.data.total}条，已成功匹配${response.data.data.successnum}条，未匹配${response.data.data.falsenum}，插入异常${response.data.data.errornum}条`,
                                type: 'success',
                                duration: 6000
                            }); */
                            // this.assignInfo = `近期导入总共${response.data.data.total}条，导入正式库${response.data.data.successnum}条，导入未分发库${response.data.data.falsenum}条，错误${response.data.data.errornum}条`
                            let successTotal = response.data.data.formalsuc + response.data.data.unformalsuc;
                            let errorTotal = response.data.data.formalrepeatnum + response.data.data.unformalrepeatnum + response.data.data.exceptionnum;
                            this.assignInfo=`共导入数据${response.data.data.dbtotal}条，成功${successTotal}条(自动分发${response.data.data.formalsuc }条，需人工分发${response.data.data.unformalsuc}条)，
                            失败${errorTotal}条(自动分发重复导入${response.data.data.formalrepeatnum}条，人工分发重复导入${response.data.data.unformalrepeatnum}条，导入异常${response.data.data.exceptionnum}条)`;
                            Cookies.set('infos',this.assignInfo);
                           //刷新
                             this.searchAssignDruger({
                                PhoneNumber: this.myPhoneNum,
                                ToKen: this.token
                            });
                        } else {
                            this.$notify({
                                title: '导入失败',
                                message: response.data.errmsg,
                                type: 'warning',
                                duration: 4000
                          });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            //导入Excel
            importBtn: function() {
                this.$confirm('确定进行导入吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let fileitem = this.$refs.Excel.files[0];
                    let formData = new FormData(); 
                    let config = {              
                        headers: {                
                            'Content-Type': 'multipart/form-data'              
                        }            
                    }
                    formData.append('Excel', fileitem);
                    formData.append('PhoneNumber', this.myPhoneNum);
                    formData.append('ToKen', this.token);
                    console.log(fileitem);
                    if (!fileitem) {
                        this.$notify({
                            title: '导入失败',
                            message: '请首先选择文件',
                            type: 'warning',
                            duration: 3000
                        });
                    } else {
                        this.loading2 = true;
                         _this.setTimer();
                        this.$http
                            .post(this.httpUrl + '/home/sysinputexcel/systeminput', formData, config).then(response => {
                                console.log(response);
                                if (response.data.errno == 0) {
                                    /* this.fullscreenLoading = false;
                                    this.$notify({
                                        title: '导入成功',
                                        message: response.data.errmsg,
                                        type: 'success',
                                        duration: 3000
                                    }); */
                                    // this.fullscreenLoading = true;
                                } else if (response.data.errno == 20005) {
                                    this.$router.push({
                                        path: '/'
                                    });
                                } else {
                                    this.$notify({
                                        title: '导入失败',
                                        message: response.data.errmsg,
                                        type: 'warning',
                                        duration: 3000
                                    });
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消导入',
                        duration: 3000
                    });
                });
            },
            //改变工作人员当前页
            workerCurrentChange(val) {
                let newVal = (val - 1) * 10;
                console.log(newVal);
                this.assignWorker({
                    CardId: this.form.accountNo,
                    PhoneNumber: this.myPhoneNum,
                    ToKen: this.token,
                    Skip: newVal
                });
            },
            //确定分发
            sureAllot:function(){
                if (this.drugerSelection.length > 1) {
                    this.DrugCradId = "";
                    for (var i = 0; i < this.drugerSelection.length; i++) {
                        this.DrugCradId += this.drugerSelection[i].Card_Id + "@";
                    }
                    this.DrugCradId = this.DrugCradId.substring(0, this.DrugCradId.length - 1);
                } else {
                    this.DrugCradId = this.drugerSelection[0].Card_Id;
                }
                console.log(this.DrugCradId);
                 if (this.myRegion == '超级管理员') {
                    this.packAllot({
                        PhoneNumber:this.myPhoneNum,
                        ToKen:this.token,
                        DrugUserCardId:this.DrugCradId,
                        county:this.Region[0],
                        station:this.Region[1],
                        villages:this.Region[2]
                    });
                    } else {
                    if (this.myCounty && this.myStation) {
                        //保存工作站工作人员帐号
                        this.packAllot({
                            PhoneNumber:this.myPhoneNum,
                            ToKen:this.token,
                            DrugUserCardId:this.DrugCradId,
                            county:this.myCounty,
                            station:this.myStation,
                            villages:this.chooseVillage
                       });
                    } else if (this.myCounty && !this.myStation) {
                        //保存县级工作人员帐号
                        this.packAllot({
                            PhoneNumber:this.myPhoneNum,
                            ToKen:this.token,
                            DrugUserCardId:this.DrugCradId,
                            county:this.myCounty,
                            station:this.Region[0],
                            villages:this.Region[1]
                       })
                    }
                }
            },
            //封装分发函数
            packAllot: function(obj) {
                if (this.drugerSelection.length !== 0) {
                    this.$confirm(`确定要分发吗？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http
                            .post(this.serverIP + "/query/manualsetting", obj)
                            .then(response => {
                                console.log(response);
                                if(response.data.errno == 0){
                                    let errmsg = response.data.data;
                                    let str = "";
                                    let str1 = "";
                                    for (var i = 0; i < errmsg.length; i++) {
                                        if (errmsg[i].content.errmsg == 0) {
                                        str += errmsg[i].content.content;
                                        } else if (errmsg[i].content.errmsg == 1000) {
                                        str1 += errmsg[i].content.content;
                                        }
                                    }
                                    if(str){
                                        this.$notify({
                                            title: '分发成功',
                                            message: str,
                                            type: 'success',
                                            duration: 3000
                                            });
                                        //刷新
                                        this.searchAssignDruger({
                                            PhoneNumber: this.myPhoneNum,
                                            ToKen: this.token
                                        });
                                        this.Region = [];
                                      }else{
                                         this.$notify({
                                            title: '分发失败',
                                            message: str1,
                                            type: 'warning',
                                            duration: 3000
                                            });
                                      }
                                    }else{
                                       this.$notify({
                                            title: '分发失败',
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
                            message: '已取消分发'
                        });
                    });
                } else {
                    this.$notify({
                        title: '提示',
                        message: '请先选择要分发的吸毒人员',
                        type: 'warning',
                        duration: 3000
                    });
                }
            },
            //封装搜索需要人工分发的吸毒人员
            searchAssignDruger: function(obj) {
                this.$http
                    .post(this.serverIP + "/query/getdrugunkownlist", obj)
                    .then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.fullscreenLoading = false;
                            this.assignDrugerList = response.data.data.druguser;
                            this.assignCount = response.data.data.druguser.length;
                            this.needAllotCount = response.data.data.druguser.length;
                            for (var i = 0; i < this.assignDrugerList.length; i++) {
                                this.assignDrugerList[i].presentArea = this.assignDrugerList[i].county + ' - ' + this.assignDrugerList[i].station;
                                switch (this.assignDrugerList[i].sex) {
                                    case 0:
                                        this.assignDrugerList[i].sex = "";
                                        break;
                                    case 1:
                                        this.assignDrugerList[i].sex = "男";
                                        break;
                                    case 2:
                                        this.assignDrugerList[i].sex = "女";
                                }
                            }
                        } else {
                            this.fullscreenLoading = false;
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
            //人工分发点击分发，加载待分发的吸毒人员
            handworkAssign: function(index, row) {
                //获取要分发的工作人员的县、工作站和乡
                this.workerCounty = row.county;
                this.workerStation = row.station;
                this.workerVillages = row.villages;
                this.handworkAssignVisible = true;
                this.searchAssignDruger({
                    PhoneNumber: this.myPhoneNum,
                    ToKen: this.token
                });
                this.assignWorkerName = row.Name;
                console.log(row);
            },
            //查询工作人员信息
            assignWorker: function(obj) {
                this.$http
                    .post(this.serverIP + "/query/queryworkers", obj)
                    .then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.fullscreenLoading = false;
                            this.handleAllotTable = response.data.data.workersUser;
                            this.pageTotal = response.data.data.count;
                            this.pages = true;
                        } else {
                            this.fullscreenLoading = false;
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
            }
        }
    }
</script>

<style scoped>
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
        height: 500px;
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
