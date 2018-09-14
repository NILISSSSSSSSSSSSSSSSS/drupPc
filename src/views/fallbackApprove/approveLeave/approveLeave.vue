<template>
    <div class="searchTable">
        <el-table :data="approvePeople" border style="width: 100%">
            <el-table-column label="姓名" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.Name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="身份证号码">
                <template slot-scope="scope">
                    <span>{{ scope.row.CardId}}</span>
                </template>
            </el-table-column>
             <el-table-column label="现在地">
                 <template slot-scope="scope">
                    <span>{{ scope.row.NowAddress}}</span>
                </template>
            </el-table-column>
            <el-table-column label="请假开始时间" width="120">
                 <template slot-scope="scope">
                    <span>{{ scope.row.StartTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="请假结束时间" width="120">
                 <template slot-scope="scope">
                    <span>{{ scope.row.EndTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="请假目的地">
                 <template slot-scope="scope">
                    <span>{{ scope.row.Destination}}</span>
                </template>
            </el-table-column>
            <el-table-column label="详细地址">
                 <template slot-scope="scope">
                    <span>{{ scope.row.Address}}</span>
                </template>
            </el-table-column>
            <el-table-column label="请假原因"  width="80">
                 <template slot-scope="scope">
                    <span>{{ scope.row.Reason}}</span>
                </template>
            </el-table-column>
             <el-table-column label="乡审批状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.villageState}}</span>
                    <div v-if="scope.row.villageHandle">
                      <el-button size="mini" type="success" @click="villageAgree(scope.$index,scope.row)">同意</el-button>
                      <el-button size="mini" type="danger" @click="villageDisagree(scope.$index,scope.row)">不同意</el-button>
                   </div>
                </template>
            </el-table-column>
            <el-table-column label="工作站审批状态">
                 <template slot-scope="scope">
                    <span>{{ scope.row.stationState}}</span>
                    <div v-if="scope.row.stationHandle">
                      <el-button size="mini" type="success" @click="stationAgree(scope.$index,scope.row)">同意</el-button>
                      <el-button size="mini" type="danger" @click="stationDisagree(scope.$index,scope.row)">不同意</el-button>
                   </div>
                </template>
            </el-table-column>
            <el-table-column label="县审批状态" v-if="showCounty">
                <template slot-scope="scope">
                    <span>{{ scope.row.countyState}}</span>
                    <div v-if="scope.row.countyHandle">
                      <el-button size="mini" type="success" @click="countyAgree(scope.$index,scope.row)">同意</el-button>
                      <el-button size="mini" type="danger" @click="countyDisagree(scope.$index,scope.row)">不同意</el-button>
                  </div>
                </template>
            </el-table-column>
            <el-table-column label="州审批状态" v-if="showCity">
                <template slot-scope="scope">
                    <span>{{ scope.row.cityState}}</span>
                    <div v-if="scope.row.cityHandle">
                      <el-button size="mini" type="success" @click="cityAgree(scope.$index,scope.row)">同意</el-button>
                      <el-button size="mini" type="danger" @click="cityDisagree(scope.$index,scope.row)">不同意</el-button>
                  </div>
                </template>
            </el-table-column>              
        </el-table>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    export default {
        name: 'approveLeave',
        data() {
            return {
                token: "",
                myPhoneNum: "",
                villageHandle:false,
                countyHandle:false,
                stationHandle:false,
                cityHandle:false,
                showCounty:false,
                showCity:false,
                villageState:"",
                stationState:"",
                countyState:"",
                cityState:"",
                approvePeople: []
            }
        },
        created() {
            //获取token
            this.token = Cookies.get('myToken');
            //获取登录手机号码
            this.myPhoneNum = Cookies.get('myPhoneNum');
            console.log(this.token);
            console.log(this.myPhoneNum);
            //获取需要请假的审批请求
            this.showApprove();
        },
        methods:{
            //获取需要请假的审批请求
            showApprove:function(){
                 this.$http
                .post(this.serverIP + "/query/queryexamineleave", {
                    PhoneNumber: this.myPhoneNum,
                    ToKen: this.token
                })
                .then(response => {
                    console.log(response);
                    if (response.data.errno == 0) {
                        this.fullscreenLoading = false;
                        this.approvePeople = response.data.data.druguser;
                        let druguser = response.data.data.druguser;
                        for(var i=0;i<druguser.length;i++){
                           if(druguser[i].State.station){
                               //工作站审批状态
                                switch (druguser[i].State.station.State){
                                    case "0":
                                    // druguser[i].stationState="当前工作站："+druguser[i].State.station.Address;
                                    this.approvePeople[i].stationHandle=true;
                                    break;
                                    case "1":
                                    this.approvePeople[i].stationHandle=false;
                                    this.approvePeople[i].stationState="等待审批";
                                    break;
                                    case "2":
                                    this.approvePeople[i].stationHandle=false;
                                    this.approvePeople[i].stationState = "已同意,审批人："+ 
                                    this.approvePeople[i].State.station.WorkName+'，审批时间：'+druguser[i].State.station.createTime;
                                    break;
                                    case "3":
                                    this.approvePeople[i].stationState ="不同意,审批人："+ druguser[i].State.station.WorkName;
                                    break;
                                }
                            }
                            if(druguser[i].State.villages){
                                //乡审批状态
                                 switch (druguser[i].State.villages.State){
                                    case "0":
                                    this.approvePeople[i].villageHandle=true;
                                    break;
                                    case "1":
                                    this.approvePeople[i].villageHandle=false;
                                    this.approvePeople[i].villageState="等待审批";
                                    break;
                                    case "2":
                                    this.approvePeople[i].villageHandle=false;
                                    this.approvePeople[i].villageState ="已同意,审批人："+ 
                                    this.approvePeople[i].State.villages.WorkName+'，审批时间：'+druguser[i].State.villages.createTime;
                                    break;
                                    case "3":
                                    this.approvePeople[i].villageState ="不同意,审批人："+ druguser[i].State.villages.WorkName;
                                    break;
                                }
                            }
                            if(druguser[i].State.county){
                                this.showCounty = true;
                                //县审批状态
                                 switch (druguser[i].State.county.State){
                                    case "0":
                                    // druguser[i].stationState="当前县："+druguser[i].State.county.Address;
                                    this.approvePeople[i].countyHandle=true;
                                    break;
                                    case "1":
                                    this.approvePeople[i].countyHandle=false;
                                    this.approvePeople[i].countyState="等待审批";
                                    break;
                                    case "2":
                                    this.approvePeople[i].countyHandle=false;
                                    this.approvePeople[i].countyState ="已同意,审批人："+
                                    this.approvePeople[i].State.county.WorkName+'，审批时间：'+druguser[i].State.county.createTime;
                                    break;
                                    case "3":
                                    this.approvePeople[i].countyState ="不同意,审批人："+"不同意,审批人："+ druguser[i].State.county.WorkName;
                                    break;
                                }
                            }else{
                                this.showCounty = false;
                            }

                            if(druguser[i].State.city){
                                this.showCity = true;
                                //州审批状态
                                 switch (druguser[i].State.city.State){
                                    case "0":
                                    // druguser[i].stationState="当前乡："+druguser[i].State.villages.Address;
                                    this.approvePeople[i].cityHandle=true;
                                    break;
                                    case "1":
                                    this.approvePeople[i].cityHandle=false;
                                    this.approvePeople[i].cityState="等待审批";
                                    break;
                                    case "2":
                                    this.approvePeople[i].cityHandle=false;
                                    this.approvePeople[i].cityState ="已同意,审批人："+ 
                                    this.approvePeople[i].State.city.WorkName+'，审批时间：'+druguser[i].State.city.createTime;
                                    break;
                                    case "3":
                                    this.approvePeople[i].cityState ="不同意,审批人："+ druguser[i].State.city.WorkName;
                                    break;
                                }
                            }else{
                                this.showCity = false;
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
            //审批请假人员
            approveChangePlace:function(type,CardId){
                this.$http
                .post(this.serverIP + "/index/pcsetleave", {
                    PhoneNumber:this.myPhoneNum,
                    ToKen:this.token,
                    DrugUserCardId:CardId,
                    ExamineType:type
                })
                .then(response => {
                    console.log(response);   
                        if(response.data.errno == 0){
                            this.$notify({
                                title: '审批成功',
                                message: response.data.errmsg,
                                type: 'success',
                                duration: 3000
                            });
                            this.showApprove();
                        }else{
                            this.$notify({
                                title: '审批失败',
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
            //乡级审批同意
            villageAgree:function(index,row){
                // console.log(index,row);
                this.$confirm(`确定同意${row.Name}的请假请求吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   this.approveChangePlace(2,row.CardId);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消审批'
                    });          
                });
            },
            //乡级审批不同意
            villageDisagree:function(index,row){
                // console.log(index,row);
                this.$confirm(`确定同意${row.Name}的请假审批请求吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   this.approveChangePlace(3,row.CardId);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消审批'
                    });          
                });
            },
            //县级审批同意
            countyAgree:function(index,row){
                // console.log(index,row);
                 this.$confirm(`确定同意${row.Name}的请假请求吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.approveChangePlace(2,row.CardId);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消审批'
                    });          
                });
            },
            //县级审批不同意
            countyDisagree:function(index,row){
                // console.log(index,row);
                this.$confirm(`确定不同意${row.Name}的请假请求吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.approveChangePlace(3,row.CardId);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消审批'
                    });          
                });
            },
            //工作站审批同意
            stationAgree:function(index,row){
                // console.log(index,row);
                this.$confirm(`确定同意${row.Name}的请假请求吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.approveChangePlace(2,row.CardId);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消审批'
                    });          
                });
            },
            //工作站审批不同意
            stationDisagree:function(index,row){
                // console.log(index,row);
                this.$confirm(`确定不同意${row.Name}的请假请求吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.approveChangePlace(3,row.CardId);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消审批'
                    });          
                });
            },
             //县审批同意
            cityAgree:function(index,row){
                // console.log(index,row);
                this.$confirm(`确定同意${row.Name}的请假请求吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.approveChangePlace(2,row.CardId);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消审批'
                    });          
                });
            },
            //县审批不同意
            cityDisagree:function(index,row){
                // console.log(index,row);
                this.$confirm(`确定不同意${row.Name}的请假请求吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.approveChangePlace(3,row.CardId);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消审批'
                    });          
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
