<template>
    <div class="searchTable">
        <el-table :data="approvePeople" border style="width: 100%">
            <el-table-column label="姓名" width="120">
                <template slot-scope="scope">
                        <span>{{ scope.row.Name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="身份证号码" width="150">
                <template slot-scope="scope">
                    <span>{{ scope.row.CardId}}</span>
                </template>
            </el-table-column>
             <el-table-column label="已变更地点" width="150">
                <template slot-scope="scope">
                    <span>{{ scope.row.ExecutorAddress}}</span>
                </template>
            </el-table-column>
            <el-table-column label="乡审批状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.villageState}}</span>
                </template>
            </el-table-column>
            <el-table-column label="工作站审批状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.stationState}}</span>
                </template>
            </el-table-column>
            <el-table-column label="县审批状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.countyState}}</span>
                </template>
            </el-table-column>
            <el-table-column label="州审批状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.cityState}}</span>
                </template>
            </el-table-column>                 
        </el-table>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    export default {
        name: 'toOtherPlace',
        data() {
            return {
                token: "",
                myPhoneNum: "",
                villageHandle: false,
                countyHandle: false,
                stationHandle: false,
                villageState: "",
                countyState: "",
                stationState: "",
                cityState:"",
                approvePeople: []
            }
        },
        created() {
            //获取token
            this.token = Cookies.get('myToken');
            //获取登录手机号码
            this.myPhoneNum = Cookies.get('myPhoneNum');
            //获取变更到外地人员信息
            this.showApprove();
        },
        methods: {
            //获取变更到外地人员信息
            showApprove: function() {
                this.$http
                    .post(this.serverIP + "/query/queryoutdrug", {
                        PhoneNumber: this.myPhoneNum,
                        ToKen: this.token
                    })
                    .then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.fullscreenLoading = false;
                            this.approvePeople = response.data.data.druguser;
                            let druguser = response.data.data.druguser;
                            for (var i = 0; i < druguser.length; i++) {
                                druguser[i].villageState = '已通过，审批人：' + druguser[i].villages.ExamineWorkName + '，审批时间：' + druguser[i].villages.createTime;
                                druguser[i].stationState = '已通过，审批人：' + druguser[i].station.ExamineWorkName + '，审批时间：' + druguser[i].station.createTime;
                                druguser[i].countyState = '已通过，审批人：' + druguser[i].county.ExamineWorkName + '，审批时间：' + druguser[i].county.createTime;
                                druguser[i].cityState = '已通过，审批人：' + druguser[i].city.ExamineWorkName + '，审批时间：' + druguser[i].city.createTime;
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
            }
        }
    }
</script>

<style scoped>
    .searchTable {
        margin-top: 30px;
    }
</style>
