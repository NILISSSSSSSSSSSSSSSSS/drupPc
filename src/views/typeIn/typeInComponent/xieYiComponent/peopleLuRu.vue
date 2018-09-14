<style scoped>
    div table td {
        border-right: 0 !important;
    }

</style>
<template>
    <div class="inputStyle">
        <el-form  ref="ruleForm" label-width="208px" class="demo-ruleForm">
            <!-- 1-->
            <el-form-item label="逃避、拒绝接受检测" prop="">
                <el-checkbox v-model="check_1" ></el-checkbox>
                <span class="refuse" style="color: white; margin-left: 10px;">拒检{{num_1}}次</span>
            </el-form-item>
            <div  v-if="check_1" style="padding: 5px;">
                <el-form-item label="当前日期" prop=""><el-input  v-model="now"  disabled ></el-input></el-form-item>
                <el-form-item label="通知尿检日期"   prop="">
                    <el-col :span="11">
                        <el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期" v-model="time_1" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="尿检通知照片" prop="">
                    <el-upload class="upload-demo" ref="upload" multiple action="" :on-remove="getFile1" :on-change="getFile1" :file-list="fileList1" :auto-upload="false"  >
                       <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
                </el-form-item>
                <el-form-item  :label="title_1" prop="">
                    <el-upload class="upload-demo" ref="upload" multiple action="" :on-remove="getFile2" :on-change="getFile2" :file-list="fileList2" :auto-upload="false"  >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>

                    </el-upload>
                </el-form-item>
            </div>

            <!-- 2-->
            <el-form-item label="擅自离开执行地" prop="">
                <el-checkbox v-model="check_2" ></el-checkbox>
                <span class="refuse" style="color: white; margin-left: 10px;">离开{{num_2}}次</span>
            </el-form-item>
            <div  v-if="check_2" style="padding: 5px;">
                <el-form-item label="当前日期" prop=""><el-input  v-model="now"  disabled ></el-input></el-form-item>
                <el-form-item label="离开日期"   prop="">
                    <el-col :span="11">
                        <el-date-picker @change="confirmCallback"  format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期" v-model="time_2"
                                        :picker-options="pickerOptions0"  style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="离开天数" prop=""><el-input  v-model="leave_days"  disabled ></el-input></el-form-item>

                <el-form-item  :label="title_2" prop="">
                    <el-upload class="upload-demo" ref="upload" multiple action="" :on-remove="getFile3" :on-change="getFile3" :file-list="fileList3" :auto-upload="false"  >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                       
                    </el-upload>
                </el-form-item>
            </div>

            <!-- 3-->
            <el-form-item label="通讯地址/联系电话变更未报到" prop="">
                <el-checkbox v-model="check_3" ></el-checkbox>
            </el-form-item>
            <div  v-if="check_3" style="padding: 5px;">
                <el-form-item label="当前日期" prop=""><el-input  v-model="now"  disabled ></el-input></el-form-item>
                <el-form-item label="发现日期"   prop="">
                    <el-col :span="11">
                        <el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期" v-model="time_3" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="上传证明" prop="">
                    <el-upload class="upload-demo" ref="upload" multiple action="" :on-remove="getFile4" :on-change="getFile4" :file-list="fileList4" :auto-upload="false"  >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                       
                    </el-upload>
                </el-form-item>
                <el-form-item label="劝诫书" prop="">
                    <el-upload class="upload-demo" ref="upload" multiple action="" :on-remove="getFile5" :on-change="getFile5" :file-list="fileList5" :auto-upload="false"  >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                       
                    </el-upload>
                </el-form-item>
                 </div>

                <!-- 4-->
                <el-form-item label="联系电话非本人使用或无法联系" prop="">
                    <el-checkbox v-model="check_4" ></el-checkbox>
                </el-form-item>
                <div  v-if="check_4" style="padding: 5px;">
                    <el-form-item label="当前日期" prop=""><el-input  v-model="now"  disabled ></el-input></el-form-item>
                    <el-form-item label="发现日期"   prop="time_4">
                        <el-col :span="11">
                            <el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期" v-model="time_4" style="width: 100%;"></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="上传证明" prop="">
                        <el-upload class="upload-demo" ref="upload" multiple action="" :on-remove="getFile6" :on-change="getFile6" :file-list="fileList6" :auto-upload="false"  >
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                           
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="劝诫书" prop="">
                        <el-upload class="upload-demo" ref="upload" multiple action="" :on-remove="getFile7" :on-change="getFile7" :file-list="fileList7" :auto-upload="false"  >
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                           
                        </el-upload>
                    </el-form-item>
                </div>

            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>
<script type="text/ecmascript-6">
 import Cookies from 'js-cookie';
    var _this;
    export default {
        data: function() {
            return {
                //离开日期不能大于当前日期
                pickerOptions0: {
                    disabledDate:function(time) {
                        return time.getTime() > Date.now() - 8.64e6;
                    }
                 },

                now: '',
                leave_days: 0,
                time_1: '',
                time_2: '',
                time_3: '',
                time_4: '',
//                ruleForm:{
//               
//                },
                endDate: new Date(),
                title_1: '',
                title_2: '劝诫书照片',
                num_1: "4",
                num_2: "",

                check_1: false,
                check_2: false,
                check_3: false,
                check_4: false,

                fileList1:[],
                fileList2:[],
                fileList3:[],
                fileList4:[],
                fileList5:[],
                fileList6:[],
                fileList7:[],

            };
        },
        created() {
        _this = this;
        _this.now =this.handTime(new Date());
        _this.loadData()

    },
    methods: {
          //判断逃避接受检查的文字显示
            checkTit1(){
                if (_this.num_1 > 2) {
                    _this.title_1 = '违法/违规行为报告';
                    return;
                }
                else{
                    _this.title_1 = '劝诫书照片';
                    return;
                }
            },
             //判断擅自离开执行地的文字显示
            checkTit2(){
                 if (_this.leave_days > 30 || _this.num_2 > 2) {
                    _this.title_2 = '违法/违规行为报告';
                    return;
                }
               else{
                     _this.title_2 ='劝诫书照片';
                     return;
                }
            },
            //初始化数据
            loadData(){
                var paramData={
                    ToKen:Cookies.get('myToken'),
                    PhoneNumber:Cookies.get('myPhoneNum'),
                };
                _this.$http.post(_this.httpUrl+"/home/query/getmanualentrylist",paramData)
                        .then(res => {
                    console.log(res.data)
                    if(res.data.errno === 0){
                        var druggerInfo=res.data.data.druguser;
                        druggerInfo.forEach(element => {
                            if(element.Card_Id==_this.$route.query.drugerId && element.Name==_this.$route.query.name){
                                if(JSON.stringify(element.Manualentrylog) !== "{}"){
                                    _this.num_1=element.Manualentrylog.RefusalcheckLevel;//拒检次数
                                    _this.num_2=element.Manualentrylog.LeaveExecutorLevel;//离开次数
                                }
                                else{
                                    _this.num_1=0;
                                    _this.num_2=0;
                                }
                            _this.checkTit1();//检查title1的文字
                            _this.checkTit2();//检查title2的文字
                            }
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

        },
        confirmCallback:function(date) {
                var now = new Date();
                var currentDate = new Date(Date.parse(date.replace(/-/g, "/")));
                _this.leave_days = parseInt((now.getTime() - currentDate) / (1000 * 60 * 60 * 24));//获取剩余天数
                 _this.checkTit2();//检查title2的文字

        },
        handTime:// 处理时间格式
         function (date, separator) {
                    var year, month, day;
                    year = date.getFullYear();
                    month = date.getMonth() + 1;
                    day = date.getDate();
                    month < 10 ? (month = '0' + month) : month;
                    day < 10 ? (day = '0' + day) : day;
                    return year + (separator || '/') + month + (separator || '/') + day;
                },
        submitForm: function(formName) {
            if(_this.check_1==false && _this.check_2==false && _this.check_3==false && _this.check_4==false){
                _this.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '请填写完整信息'
                });
                return false;
            }

            //处理图片逻辑
            var formData = {
                DrugUserCardId:_this.$route.query.drugerId,
            };
            var _fileList = {};
            //校验
            if (_this.check_1) {
                if( _this.time_1=="" ||  _this.fileList1.length==0 || _this.fileList2.length==0){
                    _this.$notify.error({
                        duration:2000,
                        title: '错误',
                        message: '请填写完整信息'
                    });
                    return false;
                }
                formData['Refusalcheck_UrineTestTime'] = _this.time_1;
                _fileList['Refusalcheck_UrineTestNoticePhoto'] =  _this.fileList1
                _fileList['Refusalcheck_OralExhortPhoto'] = _this.fileList2
            }
            if (_this.check_2) {
                if( _this.time_2=="" ||  _this.fileList3.length==0 || _this.leave_days==""){
                    _this.$notify.error({
                        duration:2000,
                        title: '错误',
                        message: '请填写完整信息'
                    });
                    return false;
                }
                formData['LeaveExecutor_LeaveExecutorData'] = _this.time_2;
                formData['LeaveExecutor_Days'] = JSON.stringify(_this.leave_days);
                _fileList['LeaveExecutor_SVP'] = _this.fileList3
            }
            if (_this.check_3) {
                if( _this.time_3=="" ||  _this.fileList4.length==0 || _this.fileList5.length==0){
                    _this.$notify.error({
                        duration:2000,
                        title: '错误',
                        message: '请填写完整信息'
                    });
                    return false;
                }
                formData['AddressChangeReport_FindDate'] = _this.time_3;
                _fileList['AddressChangeReport_ProofUploadPhoto'] = _this.fileList4
                _fileList['AddressChangeReport_SVP'] = _this.fileList5
            }
            if (_this.check_4) {
                if( _this.time_4=="" ||  _this.fileList6.length==0 || _this.fileList7.length==0){
                    _this.$notify.error({
                        duration:2000,
                        title: '错误',
                        message: '请填写完整信息'
                    });
                    return false;
                }
                formData['TelephoneNoContact_FindDate'] = _this.time_4;
                _fileList['TelephoneNoContact_ProofUploadPhoto'] = _this.fileList6
                _fileList['TelephoneNoContact_SVP'] = _this.fileList7
            }
            console.log(formData+_fileList)
            //带图片的提交
            var params_myUpload = {
                fileType: 'pic',
                fileList: _fileList,
            };
            var params_postForm = {
                url: '/home/data/violationagreement',
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
    },

    getFile1:function(file, fileList) {
        _this.fileList1 = fileList;
    },
    getFile2:function(file, fileList) {
        _this.fileList2 = fileList;
    },
    getFile3:function(file, fileList) {
        _this.fileList3 = fileList;
    },
    getFile4:function(file, fileList) {
        _this.fileList4 = fileList;
    },
    getFile5:function(file, fileList) {
        _this.fileList5 = fileList;
    },
    getFile6:function(file, fileList) {
        _this.fileList6 = fileList;
    },
    getFile7:function(file, fileList) {
        _this.fileList7 = fileList;
    }
    }
    };
</script>


