<template>
    <div class="searchTable" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中">
        <div v-show="uploadShow">
        <h2 class="assignTitle">上传资料</h2>
        <div class="chooseFile">
            <input type="file" ref="file">
        </div>
        <el-form ref="form" :model="dataForm">
            <el-form-item>
                <el-input type="textarea" v-model="dataForm.desc" placeholder="请输入上传资料的简要说明(不超过100字)" :maxlength="100"></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click.native="uploadBtn" class="uploadBtn">提交</el-button>
        </div>
        <h2 class="assignTitle">资料列表</h2>
        <el-table :data="resourceList" border style="width: 100%">
            <el-table-column label="上传者" width="120">
                <template slot-scope="scope">
                        <span>{{ scope.row.Name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="上传时间" width="200px">
                <template slot-scope="scope">
                    <span>{{ scope.row.PushTime}}</span>
                </template>
            </el-table-column>
             <el-table-column label="资料简要说明">
                <template slot-scope="scope">
                    <span>{{ scope.row.ResourceDiscrible}}</span>
                </template>
            </el-table-column>
             <el-table-column label="操作">
                <template slot-scope="scope">
                    <!-- <div @click="downloadResource(scope.$index, scope.row)" class="download">
                      <a :href="handleDownloadUrl" download class="downloadBtn">下载</a>
                    </div> -->
                    <div style="width:124px;display:inline-block;text-align:left;">
                      <a :href="scope.row.DownloadUrl" download class="downloadBtn">下载</a>
                      <el-button size="mini" type="danger" @click="delVideoByFilename(scope.row)" v-show="scope.row.showDelete">删除</el-button>
                    </div>
                </template>
           </el-table-column>
        </el-table>
        <div class="pages" v-show="pages">
            <el-pagination @current-change="resourceCurrentChange" background
            :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next" :total="pageTotal">
            </el-pagination>
         </div>
    </div>
</template>

<script>
    import Cos from 'cos-js-sdk-v5';
    import Cookies from 'js-cookie';
    export default {
        name: 'download',
        data() {
            return {
                token: '',
                currentPage: 1,
                pages: false,
                pageTotal: null,
                myPhoneNum: '',
                publisher: '',
                downloadUrl: '',
                dataForm: {
                    desc: ''
                },
                fullscreenLoading:false,
                showDelete:true,
                uploadShow:true,
                myRegion:"",
                myCounty:"",
                myStation:"",
                resourceList: [],
                fileSize: "",
                limitSize: 30 * 1024 * 1024
            }
        },
        created() {
            this.fullscreenLoading = true;
            //获取token
            this.token = Cookies.get('myToken');
            //获取登录手机号码
            this.myPhoneNum = Cookies.get('myPhoneNum');
            //发布者姓名
            this.publisher = Cookies.get('userName');
            //加载资料列表
            this.showResource( {
                    token: this.token,
                    phonenumber: this.myPhoneNum,
                    curnum: "0"
                });
            //获取区域
            this.myRegion = Cookies.get('myRegion');
            //获取县
            this.myCounty = Cookies.get('myCounty');
            //获取工作站
            this.myStation = Cookies.get('myStation');
        },
        methods: {
            //时间格式转换
            formatTime:function(ms){ 
                var date = new Date(ms);
                var year, month, day, hour, min,second;
                year = date.getFullYear();
                month = date.getMonth() + 1;
                day = date.getDate();
                hour = date.getHours();
                min = date.getMinutes();
                second = date.getSeconds();
                month < 10 ? (month = '0' + month) : month;
                day < 10 ? (day = '0' + day) : day;
                hour < 10 ? (hour = '0' + hour) : hour;
                min < 10 ? (min = '0' + min) : min;
                second < 10 ? (second = '0' + second) : second;
                return `${year}-${month}-${day} ${hour}:${min}:${second}`;
            },
            //点击上传资料按钮
            uploadBtn: function() {
                //判断简要说明是否为空
                if (this.dataForm.desc) {
                    this.uploadData();
                    this.$confirm('确定上传该文件吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if (this.fileSize > this.limitSize) {
                            this.$notify({
                                title: '上传失败',
                                message: '上传资料大小不能超过30M!',
                                type: 'warning',
                                duration: 3000
                            });
                        } else {
                            this.$http
                                .post(this.serverIP + "/resourcedownload/resourcepush", {
                                    token: this.token,
                                    phonenumber: this.myPhoneNum,
                                    ResourceDiscrible: this.dataForm.desc,
                                    DownloadUrl: this.downloadUrl
                                }).then(response => {
                                    console.log(response);
                                    if (response.data.errno == 0) {
                                        this.$notify({
                                            title: '提交成功',
                                            message: response.data.errmsg,
                                            type: 'success',
                                            duration: 3000
                                        });
                                        this.dataForm.desc = "";
                                        //刷新
                                        this.showResource({
                                            token: this.token,
                                            phonenumber: this.myPhoneNum,
                                            curnum: "0"
                                        });
                                        this.currentPage = 1;
                                    } else {
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
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消上传'
                        });
                    });
                } else {
                    this.$notify({
                        title: '上传失败',
                        message: '上传资料的简要说明不能为空!',
                        type: 'warning',
                        duration: 3000
                    });
                }
            },
            //资料列表当前页改变
            resourceCurrentChange(val) {
                this.fullscreenLoading = true;
                let newVal = (val - 1) * 10 + '';
                console.log(newVal);
                this.showResource({
                    token: this.token,
                    phonenumber: this.myPhoneNum,
                    curnum: newVal
                });
            },
            //上传资料到服务器
            upload: function() {
                this.$http
                    .post(this.serverIP + "/resourcedownload/resourcepush", {
                        token: this.token,
                        phonenumber: this.myPhoneNum,
                        Name: this.searchDruger
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
            },
            //上传资料到腾讯云
            uploadData: function() {
                const _this = this;
                var cos = new Cos({
                    getAuthorization: function(options, callback) {
                        var method = (options.Method || 'get').toLowerCase();
                        var key = options.Key || '';
                        var pathname = key.indexOf('/') === 0 ? key : '/' + key;
                        _this.$http.get(_this.httpUrl + '/home/auth', {
                            params: {
                                method: method,
                                pathname: pathname,
                                PhoneNumber:_this.myPhoneNum,
                                ToKen:_this.token
                            }
                        }).then(function(res) {
                            if (res['data']['errno'] == 0) {
                                callback(res['data']);
                            } else {
                                callback(res['data']);
                            }
                        }).catch(function(err) {
                            callback(err);
                        });
                    },
                    FileParallelLimit: 1, // 控制文件上传并发数
                    ChunkParallelLimit: 3, // 控制单个文件下分片上传并发数
                    // ProgressInterval: 1000,  // 控制上传的 onProgress 回调的间隔
                })
                let file = this.$refs.file.files[0];
                console.log(file);
                this.fileSize = file.size;
                cos.putObject({
                    Bucket: 'xcgk20180320-1256236574',
                    /* 必须 */
                    Region: 'ap-chengdu',
                    /* 必须 */
                    Key: 'file/' + new Date().getTime() + this.myPhoneNum + file.name,
                    /* 必须 */
                    StorageClass: 'STANDARD',
                    Body: file, // 上传文件对象
                }, function(err, data) {
                    /*  console.log(err || data); */
                    console.log('上传成功', data);
                    _this.downloadUrl = data.Location;
                });
            },
            //获取资料列表
            showResource: function(obj) {
                this.$http
                    .get(this.serverIP + "/resourcedownload/resourcegetlist", {
                        params: obj
                    }).then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.fullscreenLoading = false;
                            this.resourceList = response.data.data.data;
                            this.pages = true;
                            this.pageTotal = response.data.data.total;
                            for(var i=0;i<this.resourceList.length;i++){
                                this.resourceList[i].PushTime = this.formatTime(this.resourceList[i].PushTime);
                                    //判断登录者权限
                                if (this.myRegion == '超级管理员') {
                                //超级管理员
                                    this.uploadShow = true;
                                    this.resourceList[i].showDelete = true;
                                } else {
                                if (this.myCounty && !this.myStation) {
                                    //判断为县级帐号
                                    this.uploadShow = true;
                                    if(this.resourceList[i].Name == this.publisher){
                                        this.resourceList[i].showDelete = true;
                                    }else{
                                        this.resourceList[i].showDelete = false;
                                    }
                                } else if (this.myCounty && this.myStation) {
                                    //判断为工作站帐号
                                    this.uploadShow = false;
                                    this.resourceList[i].showDelete = false;
                               }
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
             //通过文件名删除对象存储服务对应的对象
            delVideoByFilename(row){
                let urlName = row.DownloadUrl.split("file/");
                let urlName1 = urlName[1].substring(24).split('.');
                let urlName2 = urlName1[0]
                console.log(row);
                let _this=this
                const cos=new Cos({
                    getAuthorization: function(options, callback) {
                        var method = (options.Method || 'get').toLowerCase();
                        var key = options.Key || '';
                        var pathname = key.indexOf('/') === 0 ? key : '/' + key;
                        _this.$http.get(_this.httpUrl + '/home/auth', {
                            params: {
                                method: method,
                                pathname: pathname,
                                PhoneNumber:_this.myPhoneNum,
                                ToKen:_this.token
                            }
                        }).then(function(res) {
                            console.log('成功', res);
                            if (res['data']['errno'] == 0) {
                                callback(res['data']);
                            } else {
                                console.log('成功中的失败', res)
                                callback(res['data']);
                            }
                        }).catch(function(err) {
                            console.log('失败');
                            callback(err);
                        });
                    },
                    FileParallelLimit: 1, // 控制文件上传并发数
                    ChunkParallelLimit: 3, // 控制单个文件下分片上传并发数
                    // ProgressInterval: 1000,  // 控制上传的 onProgress 回调的间隔
                });
                cos.deleteObject({
                    Bucket: 'xcgk20180320-1256236574', /* 必须 */
                    Region: 'ap-chengdu',    /* 必须 */
                    Key: urlName2                      /* 必须 */
                },(err, data)=> {
                    console.log(err , data);
                    if(!err){
                        this.deleteResource(row.id);
                    }else {
                        this.$notify({
                            title: '提示',
                            message: err,
                            type: 'warning',
                            duration: 2000
                        });
                    }
                });
            },
            //删除
            deleteResource: function(val) {
                this.$confirm('确定删除该资料吗', '提示', {
                   confirmButtonText: '确定',
                   cancelButtonText: '取消',
                   type: 'warning'
                }).then(() => {
                     this.$http
                    .post(this.serverIP + "/resourcedownload/resourcedel", {
                        token: this.token,
                        phonenumber: this.myPhoneNum,
                        id:val
                    }).then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration:3000,
                        });
                            //刷新
                             this.showResource({
                                token: this.token,
                                phonenumber: this.myPhoneNum,
                                curnum: "0"
                            });
                            this.currentPage = 1;
                        } else {
                            this.$notify({
                                title: '删除失败',
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
                    message: '已取消删除'
                });          
                });
            }
        }
    }
</script>

<style scoped>
    h4 {
        font-size: 16px;
        font-weight: normal;
        color: #fff;
    }
    .chooseFile {
        margin: 30px 0;
    }
    .chooseFile input {
        color: #fff;
        cursor: pointer;
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
    .pages {
        margin: 20px 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
    .download{
        display: inline-block;
    }
    .downloadBtn{
        padding: 0 15px;
        height: 28px;
        line-height: 28px;
        border-radius: 3px;
        background: #409eff;
        color:#fff;
        border-color:#409eff;
        display: inline-block;
        margin-right: 10px;
        font-size: 12px;
    }
</style>
