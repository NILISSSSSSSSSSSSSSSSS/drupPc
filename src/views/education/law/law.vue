<template>
    <div>
        <h2 class="assignTitle">法律法规</h2>
        <el-row style="justify-content: flex-end;display: flex;margin-right: 50px">
            <el-button type="primary" icon="el-icon-edit" @click="setContent">添加法律教育</el-button>
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
                            <el-button size="mini" type="danger" @click.native="delEduTransferData(scope.row.id)">删除</el-button>
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
            <el-dialog title="上传预防教育资料" :visible.sync="dialogFormVisible" :append-to-body="true">
                <el-form :model="form" style="height: 500px;overflow: scroll">
                    <el-form-item label="标题" :label-width="formLabelWidth">
                        <el-input v-model="form.title" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="活动区域" :label-width="formLabelWidth">
                        <quill-editor :content="form.txtinfo"
                                      :options="editorOption"
                                      style="height: 300px"
                                      @change="onEditorChange($event)">
                        </quill-editor>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="setEduTransferData">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <div>
            <el-dialog title="预防教育正文" :visible.sync="dialogFormVisible1" :append-to-body="true">
                <el-card class="box-card" style="height: 500px;overflow: scroll">
                    <h1 style="text-align: center;line-height: 40px;padding-bottom: 10px;">{{articleTitle}}</h1>
                    <div v-html="articleTxt"></div>
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
    export default {
        name: 'law',
        data() {
            return {
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
                dialogFormVisible: false,
                dialogFormVisible1: false,
                articleTitle:'',
                articleTxt:'',
                form: {
                    title: '',
                    txtinfo: '',
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
            getEduTransferData(paramsCurnum) {
                let nowCurnum=0;
                if(paramsCurnum){
                     nowCurnum=(paramsCurnum-1)*this.pagesize;
                    this.currentPage=paramsCurnum;
                }
                // console.log(nowCurnum);
                const params = Object.assign({},{curnum:nowCurnum}, {
                    token: this.token,
                    phonenumber:this.phonenumber,
                    txttype: '0',
                });
                this.$http.get(this.serverIP + '/preventeducation/edugetfilelist',
                    {
                        params: params
                    }).then(response => {
                    // console.log(response);
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
            setEduTransferData() {
                this.form.txttype = '0';
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
            getEdugetFilearTicle(iemtId) {
                this.$http.get(this.serverIP + '/preventeducation/edugetfilearticle',
                    {
                        params: {
                            token: this.token,
                            phonenumber:this.phonenumber,
                            artdbid: iemtId,
                        }
                    }).then(response => {
                    // console.log(response);
                    if (response.data.errno === 0) {
                        this.articleTitle = response.data.data.title;
                        this.articleTxt= response.data.data.txt;
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
            delEduTransferData(iemtId){
                this.$confirm(`确定删除本项吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$http.post(this.serverIP + '/preventeducation/edudelarticle', {
                        token: this.token,
                        phonenumber:this.phonenumber,
                        artdbid: iemtId,
                    })
                        .then((response) =>{
                            if(response.data.errno === 0){
                                this.$notify({
                                    title: '成功',
                                    message: '删除成功',
                                    type: 'success',
                                    duration:3000,
                                });
                                this.getEduTransferData()
                            }
                        }).catch(function (error) {
                        console.log(error);
                    });
                });
            },
            setContent() {
                this.dialogFormVisible = true;
            },
            onEditorChange({quill, html, text}) {
                // console.log('editor change!', quill, html, text);
                this.form.txtinfo = html
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
