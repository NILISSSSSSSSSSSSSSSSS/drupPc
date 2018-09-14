<template>
    <!--<h2>待办</h2>-->
    <div>
        <div class="searchBox">
            <el-form ref="form" :model="form" label-width="200px" size="small">
                <div class="chooseValue">
                    <el-select v-model="checkedValue" clearable placeholder="请选择">
                        <el-option v-for="item in chooseOption" :key="item.checkedValue" :label="item.label"
                                   :value="item.checkedValue"></el-option>
                    </el-select>

                </div>
                <el-input v-model="form.drugAccount" class="searchInput" placeholder="请输入查询条件(必选)"></el-input>
                <el-button type="primary" class="searchBtn" @click="searchByKeywords">查询</el-button>
            </el-form>
        </div>

        <div class="backlogBtn">
            <span class="title">待办类型:</span>
            <el-checkbox-group v-model="checkList" style="text-align: center;height: 40px">
                <el-checkbox :label="item.title" v-for="item in titleArr">{{item.title}}
                    <span style="color: red">({{item.nub}})</span> </el-checkbox>
            </el-checkbox-group>
        </div>
        <!--查询结果表格-->
        <div class="searchTable">
            <el-table :data="this.cruentdata"  style="width: 100%"  :default-sort = "{prop: 'Name', order: 'descending'}"class="searchTable" border>
                <el-table-column type="index" :index="indexMethod">
                </el-table-column>
                <el-table-column label="姓名" :sortable="true" prop="Name">
                    <template slot-scope="scope">
                        <span v-html="scope.row.Name ? scope.row.Name : '无数据'"></span>
                    </template>
                </el-table-column>
                <el-table-column label="身份证" :sortable="true" prop="Card_Id">
                    <template slot-scope="scope">
                        <span v-html="scope.row.Card_Id ? scope.row.Card_Id : '无数据'">></span>
                    </template>
                </el-table-column>
                <el-table-column label="户籍地址" :sortable="true" prop="Address">
                    <template slot-scope="scope">
                        <span v-html="scope.row.Address ? scope.row.Address : '无数据'"></span>
                    </template>
                </el-table-column>
                <el-table-column label="所属工作站" :sortable="true" prop="Station">
                    <template slot-scope="scope">
                        <span v-html=" scope.row.Station ? scope.row.Station : '无数据'"></span>
                    </template>
                </el-table-column>
                <el-table-column label="工作人员" :sortable="true" prop="WorkName">
                    <template slot-scope="scope">
                        <span v-html="scope.row.WorkName ? scope.row.WorkName : '无数据'"></span>
                    </template>
                </el-table-column>
                <el-table-column label="代办类型">
                    <template slot-scope="scope">
                        <span v-html=" scope.row.key ? scope.row.key : '无数据'"></span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pages" style="padding-top: 20px">
            <el-pagination @current-change="backLogCurrentChange" background style="float: right"
                           :current-page.sync="currentPage" :page-size="pagesize" layout="total, prev, pager, next"
                           :total="totlepagesize">
            </el-pagination>
        </div>
    </div>

</template>
<script>
    import Cookies from 'js-cookie'

    let CHANGE_BY_TITLE = [];
    export default {
        name: "backlog",
        data() {
            return {
//                checkedValue:['姓名','身份证','户籍地','工作站','工作人员'],
                form: {
                    drugAccount: ''
                },
                chooseOption: [
                    {
                        label: "姓名",
                        checkedValue: "Name"
                    },
                    {
                        label: "身份证",
                        checkedValue: "Card_Id"
                    },
                    {
                        label: "户籍地址",
                        checkedValue: "Address"
                    },
                    {
                        label: "工作站",
                        checkedValue: "Station"
                    },
                    {
                        label: "工作人员",
                        checkedValue: "WorkName"
                    }
                ],
                currentPage:0,
                checkedValue: "",
                checkList: ['待分发','待报到','待谈话','待尿检','待评估','待审批','待核实'],
                reslistObj: {},
                reslistArr: [],
                cruentdata: [],
                itemsObj: {},
                token: '',
                phonenumber: '',
                pagesize: 10,
                titleArr: [],
                paramtitle:'',
                totlepagesize:0,
            }
        },
        created() {
            this.token = Cookies.get('myToken');
            this.phonenumber = Cookies.get('myPhoneNum');
            if(this.$route.query.title) {
                this.paramtitle=this.$route.query.title;
                this.checkList=[this.paramtitle];
            }
            this.getWaitdoingthingstotalroleinfoData()
        },
        methods: {
            handleSort(params){
                console.log(params)
            },
            indexMethod(index) {
                return (this.pagesize)*(this.currentPage-1) + index +1;
            },
            //          获取数据
            _getdata(actionname) {
                let params = {
                    ToKen: this.token,
                    PhoneNumber: this.phonenumber
                };
                return this.$http.get(this.serverIP + '/drugusercomplexdetails/' + actionname, {
                    params: params
                }).then((res) => {
                    console.log(res);
                    if (!res.data.errno) {
                        return Promise.resolve(res.data.data)
                    } else {
                        this.$notify({
                            title: '数据获取失败',
                            message: res.data.errmsg,
                            type: 'warning',
                            duration: 3000
                        });
                        return Promise.reject(res.data.errno);
                    }
                }).catch((error) => {
                    this.$notify({
                        title: '数据获取失败',
                        message: error,
                        type: 'warning',
                        duration: 3000
                    });
                })
            },
            getWaitdoingthingstotalroleinfoData() {
                const loading = this.$loading({
                    lock: true,
                    text: '数据加载中！',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.5)'
                });
                this._getdata('waitdoingthingstotalroleinfo').then((res) => {
                    loading.close();
                    if (res) {
                        Object.keys(res).forEach((key) => {
                            let tkey=this._qfswitchSelect(key);
                            this.titleArr.push({title:tkey,nub:res[key].length});
                            res[key].forEach((itemobj) => {
                                switch (key) {
                                    case 'WaitIssue':
                                        itemobj.key = '待分发';
                                        break;
                                    case 'WaitReportNum':
                                        itemobj.key = '待报到';
                                        break;
                                    case 'WaitTalkNum':
                                        itemobj.key = '待谈话';
                                        break;
                                    case 'WaitUrineNum':
                                        itemobj.key = '待尿检';
                                        break;
                                    case 'WaitComprehensiveNum':
                                        itemobj.key = '待评估';
                                        break;
                                    case 'WaitApprovalNum':
                                        itemobj.key = '待审批';
                                        break;
                                    case 'WaitVerificationNum':
                                        itemobj.key = '待核实';
                                        break;
                                }
                            });
                            this.reslistArr.push(...res[key]);
                        });
                        this.reslistObj = res;
                        if(this.paramtitle){
                            let titlekey=this._switchSelect(this.paramtitle);
                            let titledataArr=this.reslistObj[titlekey];
                            this.cruentdata = titledataArr.slice(0, 10);
                            CHANGE_BY_TITLE = titledataArr;

                        }else {
                            this.cruentdata = this.reslistArr.slice(0, 10);
                            CHANGE_BY_TITLE = this.reslistArr;
                        }
                        this.totlepagesize=CHANGE_BY_TITLE.length;
                        console.log(this.reslistArr)
                    }
                })
            },
            backLogCurrentChange(index) {
                let start = (index - 1) * this.pagesize;
                let end = start + this.pagesize;
                this.cruentdata = this.reslistArr.slice(start, end)
            },
            searchByKeywords() {
                if (!this.form.drugAccount) {
                    this.$message({
                        message: '请输入查询条件',
                        type: 'warning'
                    });
                    return
                }
                let keyWords = this.form.drugAccount;
                let reg = new RegExp(keyWords);
                let resarr = [];
                if (!this.checkedValue) {
                    CHANGE_BY_TITLE.forEach((item) => {
                        let vals = Object.entries(item);
                        let resobj = Object.assign({}, item);
                        let nub = 0;
                        for (let i = 0; i < vals.length; i++) {
                            if (reg.test(vals[i][1])) {
                                nub++;
                                resobj[vals[i][0]] = vals[i][1].replace(reg, `<font style="color: red">${keyWords}</font>`);
                            }
                        }
                        if (nub > 0) {
                            resarr.push(resobj);
                        }
                    });
                    console.log(resarr);
                } else {
                    let key = this.checkedValue;
                    this.reslistArr = CHANGE_BY_TITLE.forEach((item) => {
                        let resobj = Object.assign({}, item);
                        if (reg.test(item[key])) {
                            resobj[key] = item[key].replace(reg, `<font style="color: red">${keyWords}</font>`);
                            resarr.push(resobj);
                        }
                    });
                }
                this.reslistArr = resarr;
                this.totlepagesize=resarr.length;
                this.currentPage=1;
                this.backLogCurrentChange(this.currentPage)
            },
            getSrrNotSame(array1, array2) {
                return getdiffarr(array1, array2);

                function getdiffarr(A, B) {
                    var C = new Array();
                    var D = new Array();
                    var E = new Array();
                    var Astr = "," + A.toString() + ",";
                    var Bstr = "," + B.toString() + ",";
                    for (var i in A) {
                        if (Bstr.indexOf("," + A[i] + ",") >= 0) {

                        } else {
                            C.push(A[i]);
                        }
                    }
                    for (var p in B) {
                        if (Astr.indexOf("," + B[p] + ",") >= 0) {

                        } else {
                            D.push(B[p]);
                        }
                    }
                    E.push(C);
                    E.push(D);
                    return E;
                }

            },
            _changgepagedata() {
                if (this.reslistArr.length > this.pagesize) {
                    this.cruentdata = this.reslistArr.slice(0, this.pagesize)
                } else {
                    this.cruentdata = this.reslistArr
                }
            },
            _switchSelect(select){
                let key;
                switch (select) {
                    case '待分发':
                        key = 'WaitIssue';
                        break;
                    case '待报到':
                        key = 'WaitReportNum';
                        break;
                    case '待谈话':
                        key = 'WaitTalkNum';
                        break;
                    case '待尿检':
                        key = 'WaitUrineNum';
                        break;
                    case '待评估':
                        key = 'WaitComprehensiveNum';
                        break;
                    case '待审批':
                        key = 'WaitApprovalNum';
                        break;
                    case '待核实':
                        key = 'WaitVerificationNum';
                        break;
                }
                return key;
            },
            _qfswitchSelect(select){
                let key;
                switch (select) {
                    case 'WaitIssue':
                        key = '待分发';
                        break;
                    case 'WaitReportNum':
                        key = '待报到';
                        break;
                    case 'WaitTalkNum':
                        key = '待谈话';
                        break;
                    case 'WaitUrineNum':
                        key = '待尿检';
                        break;
                    case 'WaitComprehensiveNum':
                        key = '待评估';
                        break;
                    case 'WaitApprovalNum':
                        key = '待审批';
                        break;
                    case 'WaitVerificationNum':
                        key = '待核实';
                        break;
                }
                return key
            }
        },
        watch: {
            'form.drugAccount'(val) {
                if (val === '') {
                    this.reslistArr = CHANGE_BY_TITLE;
                    this.totlepagesize=CHANGE_BY_TITLE.length
                    this.currentPage=1;
                    this.backLogCurrentChange(this.currentPage);

                }
            },
             checkList(val, oldval){
                console.log(val);
                console.log(oldval);
                let select = '';
                let key = '';
                if (val.length < oldval.length) {
                    select = this.getSrrNotSame(oldval, val)[0][0];
                    this.reslistArr = CHANGE_BY_TITLE.filter((item) => {
                        return item.key !== select
                    });
                    console.log(this.reslistArr);
                    this.currentPage=1;
                    this.backLogCurrentChange(this.currentPage)
                } else {
                    if(this.getSrrNotSame(oldval, val)[1].length === 0) return;
                    select = this.getSrrNotSame(oldval, val)[1][0] ? this.getSrrNotSame(oldval, val)[1][0] : '';
                    console.log(select);
                    key=this._switchSelect(select);
                    console.log(key);
                    this.reslistArr = [...this.reslistObj[key], ...CHANGE_BY_TITLE];
                    this.currentPage=1;
                    this.backLogCurrentChange(this.currentPage)
                }
                CHANGE_BY_TITLE = this.reslistArr;
                this.totlepagesize=CHANGE_BY_TITLE.length;
                if (this.form.drugAccount) this.searchByKeywords();
            },

        },
        destroyed(){
            CHANGE_BY_TITLE=[];
        }
    }
</script>
<style scoped>
    .searchBox {
        width: 100%;
        text-align: center;
        margin: 30px 0;
    }

    .chooseValue {
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

    .backlogBtn {
        display: flex;
        color: #fff;
    }

    .backlogBtn .el-checkbox {
        color: #fff;
        padding-top: 2px;
    }

    .backlogBtn .title {
        font-size: 16px;
        padding-right: 10px;
    }
</style>

