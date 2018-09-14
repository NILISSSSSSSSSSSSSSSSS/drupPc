<template>
    <div class="inputStyle">
        <el-form  ref="ruleForm" label-width="139px" class="demo-ruleForm" v-if="allIsShow">
            <!--//逾期未报到-->
            <div  v-if='JSON.stringify(ReportOverdue) !== "{}" '>
                <el-form-item label="逾期未报到" >
                    <el-checkbox v-model="check_1"></el-checkbox>
                </el-form-item>
                <div  v-if="check_1" style="padding: 5px;">
                    <el-form-item label="决定日期" prop="">
                        <el-input  v-model="ReportOverdue.StartTime" disabled ></el-input>
                    </el-form-item>
                    <el-form-item label="当前日期" prop="">
                        <el-input  v-model="ReportOverdue.NowTime" disabled ></el-input>
                    </el-form-item>
                    <el-form-item label="逾期天数" prop="">
                        <el-input  v-model="ReportOverdue.ReportOverdueDays" disabled ></el-input>
                    </el-form-item>
                    <!-- 图片-->
                    <el-form-item label="严重违法协议通知" prop="fileList1" v-if="fileObjShow1">
                        <el-upload
                                class="upload-demo" ref="upload" multiple action="" :on-remove="getFile1" :on-change="getFile1" :file-list="fileList1" :auto-upload="false"  >
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>

                        </el-upload>
                    </el-form-item>
                    <!-- -未逾期原因-->
                    <el-form-item label="请输入未逾期原因" prop="reason1" v-if="unYuQiReasonObj1">
                        <el-input  v-model="reason1"  ></el-input>
                    </el-form-item>
                    <!--逾期按钮 -->
                    <el-form-item>
                        <!-- -确定逾期弹框 -->
                        <el-popover
                                ref="popover1"
                                placement="top"
                                width="360" height="500"
                                v-model="visible1">
                            <p style="margin-bottom: 10px">确定逾期吗？</p>
                            <p style="margin-bottom: 10px">确定点击上传按钮</p>
                            <p style="margin-bottom: 10px">上传严重违法协议通知</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="visible1=false">取消</el-button>
                                <el-button type="primary" size="mini" @click="yuSure(1)">确定</el-button>
                            </div>
                        </el-popover>
                        <el-button type="primary"  v-popover:popover1>确定逾期</el-button><el-button type="info" @click="unDue(1)">未逾期</el-button>
                    </el-form-item>

                </div>
            </div>
            <!--//逾期未检测-->
            <div v-if='JSON.stringify(UrineTestOverdue) !== "{}" '>
                <el-form-item label="逾期未检测" >
                    <el-checkbox v-model="check_2"></el-checkbox>
                </el-form-item>
                <div  v-if="check_2" style="padding: 5px;">
                    <el-form-item label="决定日期" prop="">
                        <el-input  v-model="UrineTestOverdue.StartTime" disabled ></el-input>
                    </el-form-item>
                    <el-form-item label="当前日期" prop="">
                        <el-input  v-model="UrineTestOverdue.NowTime" disabled ></el-input>
                    </el-form-item>
                    <el-form-item label="逾期天数" prop="">
                        <el-input  v-model="UrineTestOverdue.UrineTestOverdueDays" disabled ></el-input>
                    </el-form-item>
                     <!-- 图片 -->
                    <el-form-item label="严重违法协议通知" prop="fileList2" v-if="fileObjShow2">
                        <el-upload
                                class="upload-demo" ref="upload" multiple action="" :on-remove="getFile2" :on-change="getFile2" :file-list="fileList2" :auto-upload="false"  >
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>

                        </el-upload>
                    </el-form-item>
                    <!-- -未逾期原因-->
                    <el-form-item label="请输入未逾期原因" prop="reason2" v-if="unYuQiReasonObj2">
                        <el-input  v-model="reason2"  ></el-input>
                    </el-form-item>
                    <!--逾期按钮和弹框 -->
                    <el-form-item>
                        <!-- 确定逾期弹框-->
                        <el-popover
                                ref="popover2"
                                placement="top"
                                width="360" height="500"
                                v-model="visible2">
                            <p style="margin-bottom: 10px">确定逾期吗？</p>
                            <p style="margin-bottom: 10px">确定点击上传按钮</p>
                            <p style="margin-bottom: 10px">上传严重违法协议通知</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="visible2=false">取消</el-button>
                                <el-button type="primary" size="mini" @click="yuSure(2)">确定</el-button>
                            </div>
                        </el-popover>
                        <el-button type="primary"  v-popover:popover2>确定逾期</el-button><el-button type="info" @click="unDue(2)">未逾期</el-button>
                    </el-form-item>

                </div>

                <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                </el-form-item>
           </div>
        </el-form>
        <div v-else style="text-align: center;color: white;">
            暂无数据
        </div>
    </div>
</template>
<script>
    import fourthRegion from "../../../main-components/fourthRegion";
    import Cookies from 'js-cookie';
    var _this;
    export default {
        data: function() {
            return {
                visible1:false,
                visible2:false,
                //未报道
                ReportOverdue:{
                    "ReportOverdueDays":"",
                    "StartTime":"",
                    "ReportOverdue_Label":"",
                    "NowTime":""
                },
                //未检测
                UrineTestOverdue:{
                    "UrineTestOverdueDays":"",
                    "UrineTestOverdue_Label":"",
                    "StartTime":"",
                    "NowTime":""
                },

                allIsShow:true,

                fileObjShow1:false,
                fileObjShow2:false,

                unYuQiReasonObj1:false,
                unYuQiReasonObj2:false,

                check_1:false,
                check_2:false,

                fileList1:[],
                fileList2:[],

                IsReportOverdue: '2',
                IsUrineTestOverdue: '2',

                reason1:"",
                reason2:"",


                type: [],
            };
        },
        created() {
        _this = this;
        _this.params = _this.$route.query;


    },
    components: {
        // <my-component> 将只在父组件模板中可用
        "fourth-region": fourthRegion
    },
     mounted:function(){
         _this.loadData()
     },
    methods: {

        loadData:function(){
            var paramData={
                ToKen:Cookies.get('myToken'),
                PhoneNumber:Cookies.get('myPhoneNum'),
                DrugUserCardId:this.$route.query.drugerId
            };
            _this.$http.post(_this.httpUrl+"/backstage/query/getdrugviolationlist",paramData)
                    .then(res => {
                console.log(res.data)
                if(res.data.errno === 0){
                    if(res.data.data.druguser.length==0){
                        _this.allIsShow=false;
                        return;
                    }
                    else{
                         var druggerInfo=res.data.data.druguser;
                        druggerInfo.forEach(element => {
                            if(element.CardId==_this.$route.query.drugerId && element.Name==_this.$route.query.name){
                                _this.ReportOverdue=element.ReportOverdue;
                                _this.UrineTestOverdue=element.UrineTestOverdue;

                                console.log( _this.UrineTestOverdue)
                            }
                        });

                       
                    }
                }
                else{
                    _this.$notify.error({
                        title: '错误',
                        message:res.data.errmsg
                    });
                }

            })
        .catch(function (error) {
                console.log(error);
            });

        },
        yuSure(type){
            switch (type) {
                case 1:
                    _this.IsReportOverdue = '1';
                    _this.visible1=false;
                    _this.fileObjShow1=true;
                    _this.unYuQiReasonObj1=false;
                    break;
                case 2:
                    _this.IsUrineTestOverdue = '1';
                    _this.visible2=false;
                    _this.fileObjShow2=true;
                    _this.unYuQiReasonObj2=false;
                    break;
            }
        },

        unDue:function(type){
            switch (type) {
                case 1:
                    _this.IsReportOverdue = '0';
                    this.fileObjShow1=false;
                    _this.fileList1=[];
                    this.unYuQiReasonObj1=true;
                    break;
                case 2:
                    _this.IsUrineTestOverdue = '0';
                    this.fileObjShow2=false;
                    _this.fileList2=[];
                    this.unYuQiReasonObj2=true;
                    break;
            }
        },
        submitForm: function(formName) {
            var formData = {DrugUserCardId:_this.$route.query.drugerId};
            var _fileList = {};

            if(_this.check_1==false && _this.check_2==false){
                  _this.$notify.error({
                      title: '错误',
                      message: '请填写完整信息'
                        });
                return false;
            }
            //如果点的是第一个钩钩
            if(_this.check_1==true){
                if(this.unYuQiReasonObj1 && _this.reason1==""){
                    _this.$notify.error({
                        title: '错误',
                        message: '请填写完整信息'
                    });
                    return false;
                };
                if(this.fileObjShow1 && _this.fileList1.length==0){
                    _this.$notify.error({
                        title: '错误',
                        message: '请填写完整信息'
                    });
                    return false;
                };
                formData['IsReportOverdue'] = _this.IsReportOverdue;
                if(_this.IsReportOverdue === '1') {
                    _fileList['ReportOverduePhoto'] = _this.fileList1;
                }else if(_this.IsReportOverdue === '0') {
                    formData['ReasonReport'] =_this.reason1;
                }
            }

            //如果点的是第二个钩钩
            if(_this.check_2==true){
                if(this.unYuQiReasonObj2 && _this.reason2==""){
                    _this.$notify.error({
                        title: '错误',
                        message: '请填写完整信息'
                    });
                    return false;
                };
                if(this.fileObjShow2 && _this.fileList2.length==0){
                    _this.$notify.error({
                        title: '错误',
                        message: '请填写完整信息'
                    });
                    return false;
                };
                formData['IsUrineTestOverdue'] = _this.IsUrineTestOverdue;
                if(_this.IsUrineTestOverdue === '1') {
                    _fileList['UrineTestOverduePhoto'] = _this.fileList2;
                }else if(_this.IsUrineTestOverdue === '0') {
                    formData['ReasonUrineTest'] =_this.reason2;
                }
            }

            console.log("******************"+formData+":::::::::::::"+_fileList)
            var keys = Object.keys(_fileList);
            //带图片提交
            if(keys.length != 0){
                var params_myUpload = {
                    fileType: 'pic',
                    fileList: _fileList,
                };
                var params_postForm = {
                    url: '/home/data/systemwarningupload',
                    data: formData,
                    success: function(res) {
                        if(res.data.errno === 0){
                            _this.$notify({
                                 duration:1500,
                                title: '成功',
                                message:res.data.errmsg,
                                type: 'success'
                            });

                            _this.$confirm('是否继续录入?', '提示', {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            type: 'success'
                            }).then(() => {
                               
                            }).catch(() => {
                                 _this.$router.go(-1)      
                            });

                        }
                        else{
                            _this.$notify.error({
                                title: '错误',
                                message:res.data.errmsg
                            });
                        }
                    }
                };
                _this.Tool.submit(params_myUpload, params_postForm);
            }

            //不带图片提交
            else{
               
                formData['ToKen']=Cookies.get('myToken');
                formData['PhoneNumber']=Cookies.get('myPhoneNum');
                console.log(formData)
                _this.$http.post(_this.httpUrl+"/home/data/systemwarningupload",formData)
                        .then(res => {
                    console.log(res.data)
                if(res.data.errno === 0){
                    _this.$notify({
                         duration:1500,
                        title: '成功',
                        message:res.data.errmsg,
                        type: 'success'
                    });
                    

                            _this.$confirm('是否继续录入?', '提示', {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            type: 'success'
                            }).then(() => {
                               
                            }).catch(() => {
                                 _this.$router.go(-1)      
                            });

                }
                else{
                    _this.$notify.error({
                        title: '错误',
                        message:res.data.errmsg
                    });
                }

            })
        .catch(function (error) {
                console.log(error);
            });

        }
    },

    getFile1:function(file, fileList) {
        _this.fileList1 = fileList;
    },
    getFile2:function(file, fileList) {
        _this.fileList2 = fileList;
    }
    }
    };
</script>
<style scoped>
    div table td {
        border-right: 0 !important;
    }
</style>

