<template>
    <div class="inputStyle">
        <el-form   ref="ruleForm" label-width="139px" class="demo-ruleForm">
            <!-- 1-->
            <el-form-item label="解除社区康复" prop=""><el-checkbox v-model="check_1" @change="check('check_1', check_1)"></el-checkbox></el-form-item>
            <div  v-if="check_1" style="padding: 5px;">
                <el-form-item label="起始日期" prop=""><el-input  v-model="StartTime" disabled ></el-input></el-form-item>
                <el-form-item label="终止日期"   prop="">
                    <el-col :span="11">
                            <el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期" v-model="time_1" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="上传解除审批照片" prop="">
                    <el-upload class="upload-demo" ref="upload" action="" multiple :on-remove="getFile1" :on-change="getFile1" :file-list="fileList1" :auto-upload="false"  >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </el-form-item>
            </div>
            <!-- 2-->
            <el-form-item label="终止社区康复" prop=""><el-checkbox v-model="check_2" @change="check('check_2', check_2)"></el-checkbox></el-form-item>
            <div  v-if="check_2" style="padding: 5px;">
                <el-form-item label="起始日期" prop=""><el-input  v-model="StartTime" disabled ></el-input></el-form-item>
                <el-form-item label="终止日期"  prop="">
                     <el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期" v-model="time_2" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="终止原因" prop="" >
                    <el-select v-model="reason_2" placeholder="请选择终止原因" @change="pickerCb">
                        <el-option label="强制隔离戒毒" value="强制隔离戒毒"></el-option>
                        <el-option label="死亡" value="死亡"></el-option>
                         <el-option label="服刑" value="服刑"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  :label="text1" prop="">
                    <el-upload class="upload-demo" ref="upload" action="" multiple :on-remove="getFile1" :on-change="getFile2" :file-list="fileList2" :auto-upload="false"  >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </el-form-item>
            </div>
            <!-- 3-->
            <el-form-item label="中止社区康复" prop=""><el-checkbox v-model="check_3" @change="check('check_3', check_3)"></el-checkbox></el-form-item>
            <div  v-if="check_3" style="padding: 5px;">
                <el-form-item label="起始日期" prop=""><el-input  v-model="StartTime" disabled ></el-input></el-form-item>
                <el-form-item label="中止日期"  prop="">
                            <el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期" v-model="time_3" style="width: 100%;"></el-date-picker>              
                </el-form-item>
                <el-form-item label="中止原因" prop="">
                    <el-select v-model="reason_3" placeholder="请选择终止原因">
                        <el-option label="拘留" value="拘留"></el-option>
                        <el-option label="逮捕" value="逮捕"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上传中止说明照片" prop="">
                    <el-upload class="upload-demo" ref="upload" action="" multiple :on-remove="getFile3" :on-change="getFile3" :file-list="fileList3" :auto-upload="false"  >
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
    import fourthRegion from "../../main-components/fourthRegion";
     import Cookies from 'js-cookie';
    var _this;
    export default {
        data: function() {
            return {
                StartTime:"",

                text1:"上传终止说明照片",

                time_1: '',
                time_2: '',
                time_3: '',
                reason_2: '',
                reason_3: '',
                
                check_1: false,
                check_2: false,
                check_3: false,
                
                fileList1:[],
                fileList2:[],
                fileList3:[],

            };
        },
        created() {
        _this = this;
        _this.params = _this.$route.query;
         _this.loadData();
    },

    methods: {
               //初始化数据，获取开始时间
            loadData(){
                var paramData={
                    ToKen:Cookies.get('myToken'),
                    PhoneNumber:Cookies.get('myPhoneNum'),
                };
                _this.$http.post(_this.httpUrl+"/home/query/getpersonnelstatelist",paramData)
                        .then(res => {
                    console.log(res.data)
                    if(res.data.errno === 0){
                        var druggerInfo=res.data.data.druguser;
                        druggerInfo.forEach(element => {
                            if(element.CardId==_this.$route.query.drugerId && element.Name==_this.$route.query.name){
                                _this.StartTime=element.StartTime;//获取开始时间
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
        pickerCb: function() {
            if (this.reason_2 === "强制隔离戒毒") {
                this.text1 = "上传终止说明照片";
            } else if (this.reason_2 === "死亡") {
                this.text1 = "上传死亡证明照片";
            }
        },
        check:function(key, bool) {
            _this.check_1 = false;
            _this.check_2 = false;
            _this.check_3 = false;
            if (bool) {
                _this[key] = true;
            }
        },
        submitForm: function(formName) {
            if(_this.check_1==false && _this.check_2==false && _this.check_3==false){
                _this.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '请填写完整信息'
                });
                return false;
            }
            var formData = {
                DrugUserCardId:_this.params.drugerId,
            };
            var _fileList = {};
            //校验
            if (_this.check_1) {
                if(_this.time_1=="" ||  _this.fileList1.length==0){
                    _this.$notify.error({
                        duration:2000,
                        title: '错误',
                        message: '请填写完整信息'
                    });
                    return false;
                }
                formData['RelieveDrug'] ="1";
                formData['RelieveDrugDate'] = _this.time_1;
                _fileList = {//图片参数
                    ExaminePhotoupload: _this.fileList1
                };
            } else {
                formData['RelieveDrug'] = "0";
            }

            if (_this.check_2) {
                if(_this.time_2=="" || _this.reason_2=="" ||  _this.fileList2.length==0){
                    _this.$notify.error({
                        duration:2000,
                        title: '错误',
                        message: '请填写完整信息'
                    });
                    return false;
                }

                formData['OverDrug'] = "1";
                formData['OverDate'] = _this.time_2;
                formData['OverReason'] = _this.reason_2;
                _fileList = {//图片参数
                    OverReasonPhoto: _this.fileList2
                };
            } else {
                formData['OverDrug'] = "0";
            }

            if (_this.check_3) {
                if(_this.time_3=="" || _this.reason_3=="" ||  _this.fileList3.length==0){
                    _this.$notify.error({
                        duration:2000,
                        title: '错误',
                        message: '请填写完整信息'
                    });
                    return false;
                }

                formData['StopDrug'] = "1";
                formData['StopDate'] = _this.time_3;
                formData['StopReason'] = _this.reason_3;
                _fileList = {//图片参数
                    StopReasonPhoto: _this.fileList3
                };

            } else {
                formData['StopDrug'] = "0";
            }
            console.log(JSON.stringify(formData)+_fileList)
            //带图片提交
            var params_myUpload = {
                fileType: 'pic',
                fileList: _fileList,
            };
            var params_postForm = {
                url: '/home/data/personnelstateupload',
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
    }
    }
    };
</script>
<style scoped>
    div table td {
        border-right: 0 !important;
    }
</style>

