<template>
    <div>
        <h2 class="assignTitle">微视频</h2>
        <el-row style="justify-content: flex-end;display: flex;margin-right: 50px">
            <el-button type="primary" icon="el-icon-edit" @click="setContent">添加微视频</el-button>
        </el-row>
        <div class="searchTable">
            <el-table :data="resdata.pagedata" border style="width: 100%">
                <el-table-column label="标题">
                    <template slot-scope="scope">
                        <span>{{ scope.row.Title}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="姓名">
                    <template slot-scope="scope">
                        <span>{{ scope.row.Name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="日期">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createtime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div>
                            <el-button size="mini" type="success" @click.native="getEdugetFilearTicle(scope.row.id)">查看</el-button>
                            <el-button size="mini" type="danger" @click.native="delEduTransferData(scope.row.id,scope.row.VedioDownName)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pages" v-show="resdata.total >= resdata.count">
                <el-pagination @current-change="getEduTransferData" background
                               :current-page.sync="currentPage" :page-size="pagesize" layout="total, prev, pager, next" :total="resdata.total">
                </el-pagination>
            </div>
        </div>

        <div>
            <el-dialog title="上传微视频" :visible.sync="dialogFormVisible" :append-to-body="true">
                <el-form :model="form" style="height: 500px;overflow: scroll">
                    <el-form-item label="标题" :label-width="formLabelWidth">
                        <el-input v-model="form.title" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="内容"style="height: 200px" :label-width="formLabelWidth">
                        <quill-editor :content="form.txtinfo"
                                      :options="editorOption"
                                      style="height: 163px"
                                      @change="onEditorChange($event)">
                        </quill-editor>
                    </el-form-item>
                    <el-form-item label="上传视频" :label-width="formLabelWidth">
                        <el-upload
                                class="upload-demo"
                                action="https://zhs-1256460871.coscd.myqcloud.com"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :before-remove="beforeRemove"
                                :http-request="setfile"
                                :limit="1"
                                :on-exceed="handleExceed"
                                list-type="picture"
                                :file-list="fileList">
                            <el-button size="small" type="primary">添加上传视频</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传视频文件，且不超过50m</div>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="setEduTransferData">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <div>
            <el-dialog title="微视频" :visible.sync="dialogFormVisible1" :append-to-body="true">
                <el-card class="box-card" style="height: 500px;overflow: scroll">
                    <h1 style="text-align: center;line-height: 40px;padding-bottom: 10px;">{{articleTitle}}</h1>
                    <div v-html="articleTxt"></div>
                    <div v-show="VedioDownUrl"><video controls="controls" :src="VedioDownUrl"></video></div>
                </el-card>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import {quillEditor} from 'vue-quill-editor'
    import Cookies from 'js-cookie';
    import Cos from 'cos-js-sdk-v5';
    export default {
        name: 'law',
        data() {
            return {
                fileList: [],
                content: '',
                editorOption: {
                    modules: {
                        toolbar: [
                            [{ 'size': ['small', false, 'large'] }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            ['bold', 'italic'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['image','clean']
                        ]
                    }
                    // some quill options
                },      
                VedioDownUrl:'',
                dialogFormVisible: false,
                dialogFormVisible1: false,
                articleTitle:'',
                articleTxt:'',
                form: {
                    title: '',
                    txtinfo: '',
                    VedioDownUrl:'',
                    VedioDownName:''
                },
                pagesize:10,
                resdata:{},
                currentPage:1,
                formLabelWidth: '120px',
            }
        },
        created() {
            this.token = Cookies.get('myToken');
            this.phonenumber = Cookies.get('myPhoneNum');
            this.name = Cookies.get('userName');
            this.getEduTransferData()
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
//            获取列表
            getEduTransferData(paramsCurnum) {
                let nowCurnum=0;
                if(paramsCurnum){
                    nowCurnum=(paramsCurnum-1)*this.pagesize;
                    this.currentPage=paramsCurnum;
                }
                console.log(nowCurnum);
                const params = Object.assign({},{curnum:nowCurnum}, {
                    token: this.token,
                    phonenumber:this.phonenumber,
                    txttype: '2',
                });
                this.$http.get(this.serverIP + '/preventeducation/edugetfilelist',
                    {
                        params: params
                    }).then(response => {
                    console.log(response);
                    if (response.data.errno === 0) {
                        this.resdata = response.data.data;
                        let dataArr = response.data.data.pagedata;
                        for(var i=0;i<dataArr.length;i++){
                            dataArr[i].createtime = this.formatTime(dataArr[i].createtime);
                          }
                    } else {
                        let errmsg = response.data.errmsg;
                        this.$notify({
                            title: '提示',
                            message: errmsg,
                            type: 'warning',
                            duration: 3000
                        });
                    }
                }, response => {
                    console.log('error');
                });
            },
//            上传视频
            setEduTransferData() {
                if(!this.form.VedioDownName){
                    this.$notify({
                        title: '提示',
                        message: '文件上传中',
                        type: 'warning',
                        duration: 2000
                    });
                    return;
                }
                this.form.txttype = '2';
                this.form.token = this.token;
                this.form.phonenumber = this.phonenumber;
                this.form.Name = this.name;
                this.$http.post(this.serverIP + '/preventeducation/edutrannsfer', this.form)
                    .then((response) =>{
                        if(response.data.errno === 0){
                            this.$notify({
                                title: '成功',
                                message: '上传成功',
                                type: 'success',
                                duration:1000,
                            });
                            setTimeout(()=>{
                                this.dialogFormVisible=false;
                                this.form={
                                    title: '',
                                    txtinfo: ''
                                };
                                this.getEduTransferData()
                            },1000)
                        }
                    }).catch(function (error) {
                    console.log(error);
                });
            },
//            获取视频详情
            getEdugetFilearTicle(iemtId) {
                this.$http.get(this.serverIP + '/preventeducation/edugetfilearticle',
                    {
                        params: {
                            token: this.token,
                            phonenumber:this.phonenumber,
                            artdbid: iemtId,
                        }
                    }).then(response => {
                    console.log(response);
                    if (response.data.errno === 0) {
                        this.articleTitle = response.data.data.title;
                        this.articleTxt= response.data.data.txt;
                        this.VedioDownUrl= response.data.data.VedioDownUrl;
                        this.dialogFormVisible1=true;
                    } else {
                        let errmsg = response.data.errmsg;
                        this.$notify({
                            title: '提示',
                            message: errmsg,
                            type: 'warning',
                            duration: 2000
                        });
                    }
                }, response => {
                    console.log('error');
                });
            },
//            通过文件名删除对象存储服务对应的对象
            delVideoByFilename(filename){
                let _this=this
                console.log(_this.phonenumber)
//                const  cos=new Cos({
//                    getAuthorization: function(options, callback) {
//                        var method = (options.Method || 'get').toLowerCase();
//                        var key = options.Key || '';
//                        var pathname = key.indexOf('/') === 0 ? key : '/' + key;
//                        _this.$http.get(_this.reqUrl+'/home/auth', {
//                            params: {
//                                method: method,
//                                pathname: pathname,
//                                PhoneNumber:_this.phonenumber,
//                                ToKen:_this.token
//                            }
//                        }).then(function(res) {
//                            console.log('成功', res);
//                            if (res['data']['errno'] == 0) {
//                                callback(res['data']);
//                            } else {
//                                console.log('成功中的失败', res)
//                                callback(res['data']);
//                            }
//                        }).catch(function(err) {
//                            console.log('失败');
//                            callback(err);
//                        });
//                    },
//                    FileParallelLimit: 1, // 控制文件上传并发数
//                    ChunkParallelLimit: 3, // 控制单个文件下分片上传并发数
//                    // ProgressInterval: 1000,  // 控制上传的 onProgress 回调的间隔
//                });
                _this.cos.deleteObject({
                    Bucket: 'xcgk20180320-1256236574', /* 必须 */
                    Region: 'ap-chengdu',    /* 必须 */
                    Key: filename                          /* 必须 */
                },(err, data)=> {
                    console.log(err , data);
                    if(!err){
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration:3000,
                        });
                        this.getEduTransferData()
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
//            删除视频相关信息
            delEduTransferData(iemtId,filename){
                console.log(filename);
                this.$confirm(`确定删除本项吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$http.post(this.serverIP + '/preventeducation/edudelarticle', {
                        token: this.token,
                        phonenumber:this.phonenumber,
                        artdbid: iemtId,
                    }).then((response) =>{
                        if(response.data.errno === 0){
                            this.delVideoByFilename(filename);
                        }else{
                            let errmsg = response.data.errmsg;
                            this.$notify({
                                title: '提示',
                                message: errmsg,
                                type: 'warning',
                                duration: 3000
                            });
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                });
            },
//           打开富文本
            setContent() {
                this.dialogFormVisible = true;
            },
//            获取富文本编辑内容
            onEditorChange({quill, html, text}) {
                console.log('editor change!', quill, html, text);
                this.form.txtinfo = html
            },
//            删除视频文件触发的回调函数
            handleRemove(file, fileList) {
                console.log(file, fileList);
                this.delVideoByFilename(this.form.VedioDownName)
            },
//            点击已上传文件触发的函数
            handlePreview(file) {
                console.log(file);
            },
//            超过文件数量的回调
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
//         删除前的回调
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
//           上传视频控制函数
            setfile(fileObj){
                let _this=this;
                console.log(fileObj.file);
                console.log(fileObj);
                const namekey=Date.now().toString()+'_'+parseInt(Math.random()*1000)+'_'+fileObj.file.name;
//                if (!file) return;
                // 分片上传文件
                const  cos=new Cos({
                    getAuthorization: function(options, callback) {
                        var method = (options.Method || 'get').toLowerCase();
                        var key = options.Key || '';
                        var pathname = key.indexOf('/') === 0 ? key : '/' + key;
                        _this.$http.get(_this.httpUrl+'/home/auth', {
                            params: {
                                method: method,
                                pathname: pathname,
                                PhoneNumber:_this.phonenumber,
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
                this.cos=cos
                cos.putObject({
                    Bucket: 'xcgk20180320-1256236574', /* 必须 */
                    Region: 'ap-chengdu',    /* 必须 */
                    Key: namekey,              /* 必须 */
                    Body: fileObj.file,
                    StorageClass: 'STANDARD',
                }, (err, data)=>{
                    console.log(err, data);
                    if(!err){
                        this.$notify({
                            title: '成功',
                            message: '添加视频成功',
                            type: 'success',
                            duration:3000,
                        });
                        this.form.VedioDownUrl=data.Location;
                        this.form.VedioDownName=fileObj.file.name;
                    }else {
                        this.$notify({
                            title: '提示',
                            message: err,
                            type: 'warning',
                            duration: 2000
                        });
                    }
                });
            }
        },
        components: {
            quillEditor
        }
    };
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
    .pages{
        margin: 20px 0 30px;
        display: flex;
        justify-content: flex-end;
    }
</style>
