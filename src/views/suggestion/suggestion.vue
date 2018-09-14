<template>
    <div class="searchTable">
        <h2 class="assignTitle">意见反馈历史记录</h2>
        <el-button type="primary" class="newAdd" icon="el-icon-edit" @click="addSuggestion">新增意见反馈</el-button>
        <el-table :data="suggestionList" border style="width: 100%">
            <el-table-column label="建议人">
                <template slot-scope="scope">
                    <span>{{ scope.row.Name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="发布日期">
                <template slot-scope="scope">
                    <span>{{ scope.row.PushTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="建议内容" width="180">
                <template slot-scope="scope">
                    <p class="suggestionContent">
                        {{ scope.row.SuggestionDiscrible}}</p>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="success" @click="checkDetail(scope.$index, scope.row)">
                        查看建议内容详情</el-button>
                </template>
           </el-table-column>
        </el-table>
        <div class="pages" v-show="pages">
            <el-pagination @current-change="suggestionCurrentChange" background
            :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next" :total="pageTotal">
            </el-pagination>
         </div>
         <!--查看建议内容详情-->
         <el-dialog title="建议内容详情" :visible.sync="suggestionTableVisible" :append-to-body="true" width="60%">
           <p class="suggestionDetail">{{suggestionDetail}}</p>
        </el-dialog>
        <!--新增意见反馈-->
        <el-dialog title="建议内容详情" :visible.sync="newSuggestionVisible" :append-to-body="true" width="60%">
            <el-form ref="form" :model="suggestionForm" label-width="80px">
                <el-form-item label="建议内容">
                    <el-input type="textarea" v-model="suggestionForm.desc" :rows="8"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitNewSuggest">提 交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    export default {
        name: 'suggestion',
        data() {
            return {
                token: "",
                myPhoneNum: "",
                pages: false,
                currentPage: 1,
                pageTotal: null,
                suggestionList: [],
                suggestionDetail: "",
                publisher: "",
                suggestionTableVisible: false,
                newSuggestionVisible: false,
                suggestionForm: {
                    desc: ''
                }
            }
        },
        created() {
            //获取token
            this.token = Cookies.get('myToken');
            //获取登录手机号码
            this.myPhoneNum = Cookies.get('myPhoneNum');
            console.log(this.token);
            console.log(this.myPhoneNum);
            //发布者姓名
            this.publisher = Cookies.get('userName');
            console.log(this.publisher);
            //加载意见反馈历史记录
            this.showSuggestionList({
                token: this.token,
                phonenumber: this.myPhoneNum,
                curnum: "0"
            });
        },
        methods: {
            //意见反馈历史记录
            showSuggestionList: function(obj) {
                this.$http
                    .get(this.serverIP + "/suggestion/suggestiongetlist", {
                        params: obj
                    }).then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.suggestionList = response.data.data.pagedata;
                            this.pages = true;
                            this.pageTotal = response.data.data.total;
                            for(var i=0;i<this.suggestionList.length;i++){
                                this.suggestionList[i].PushTime =  this.suggestionList[i].PushTime.substring(0,10);
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
            //页数改变显示
            suggestionCurrentChange(val) {
                let newVal = (val - 1) * 10 + '';
                console.log(newVal);
                this.showSuggestionList({
                    token: this.token,
                    phonenumber: this.myPhoneNum,
                    curnum: newVal
                });
            },
            //查看建议内容详情
            checkDetail: function(index, row) {
                console.log(index, row);
                this.suggestionTableVisible = true;
                this.suggestionDetail = row.SuggestionDiscrible;
            },
            //新增意见反馈
            addSuggestion: function() {
                this.newSuggestionVisible = true;
            },
            //提交新增的意见反馈
            submitNewSuggest: function() {
                this.$confirm('确定提交意见反馈?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http
                        .post(this.serverIP + "/suggestion/suggestionpush", {
                            token: this.token,
                            phonenumber: this.myPhoneNum,
                            SuggestionDiscrible:this.suggestionForm.desc,
                            Name:this.publisher
                        })
                        .then(response => {
                            console.log(response);
                            if (response.data.errno == 0) {
                                this.fullscreenLoading = false;
                                this.$notify({
                                    title: '提交成功',
                                    message: response.data.errmsg,
                                    type: 'success',
                                    duration: 3000
                                });
                                this.newSuggestionVisible = false;
                                //提交成功后刷新页面
                                this.showSuggestionList({
                                    token: this.token,
                                    phonenumber: this.myPhoneNum,
                                    curnum: "0"
                                });
                            }else{
                                this.$notify({
                                    title: '提交失败',
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
                        message: '已取消提交'
                    });
                });
            }
        }
    }
</script>

<style scoped>
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
    .newAdd {
        margin-bottom: 30px;
    }
    .pages {
        margin: 20px 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
    .suggestionContent {
        width: 100%;
        display: block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .suggestionDetail {
        height: 300px;
        padding: 15px;
        border-radius: 3px;
        line-height: 30px;
        text-indent: 30px;
        overflow-y: auto;
        border: 1px solid #bacee2;
    }
    .dialog-footer {
        display: flex;
        justify-content: center;
    }
</style>
