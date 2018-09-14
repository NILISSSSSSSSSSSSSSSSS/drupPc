<template>
    <div class="inputStyle">
        <el-form  ref="ruleForm" label-width="139px" class="demo-ruleForm">
            <el-form-item label="尿检时间" >
                <el-col :span="11">
                    <el-form-item prop="">
                        <el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期" v-model="niaoJianTime" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="尿检地点" prop="">
                <fourth-region ref="niaoJianPlace"></fourth-region>
            </el-form-item>
            <el-form-item label="尿检结果" prop="">
                <el-select v-model="niaoJianResult" placeholder="请选择">
                    <el-option label="阴性" value="阴性"></el-option>
                    <el-option label="阳性" value="阳性"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="尿检人" prop="" >
                <el-input v-model="niaoJianRen" placeholder="请输入尿检人"></el-input>
            </el-form-item>
            <el-form-item label="尿检照片" prop="">
                <el-upload
                        class="upload-demo" ref="upload" multiple action="" :on-remove="getFile1" :on-change="getFile1" :file-list="fileList1" :auto-upload="false"  >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="现场检测报告单照片" prop="">
                <el-upload
                        class="upload-demo" ref="upload" multiple action="" :on-remove="getFile2" :on-change="getFile2" :file-list="fileList2" :auto-upload="false"  >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">上报</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script type="text/ecmascript-6">
    import fourthRegion from "../../main-components/fourthRegion";
    var _this;
    export default {
        data: function() {
            return {
                niaoJianTime: "",
                niaoJianResult:"",
                niaoJianRen:"",
                fileList1:[],
                fileList2:[],
            };
        },
        created() {
        _this = this;
    },
    components: {
        // <my-component> 将只在父组件模板中可用
        "fourth-region": fourthRegion
    },
    methods: {
        submitForm: function(formName) {
            if(_this.$refs.niaoJianPlace.selectAll=="" || this.niaoJianTime ==""  || this.niaoJianRen=="" || this.niaoJianResult=="" || _this.fileList1.length==0){
                _this.$notify.error({
                    title: '错误',
                    message: '请填写完整信息'
                });
                return;
            }
            else{
                var _fileList = {
                    UrineTestPhoto: _this.fileList1,
                    UrineTestPhotoRP: _this.fileList2,
                };
                var formData = {
                    DrugUserCardId: this.$route.query.drugerId,
                    UrineTestAddress: _this.$refs.niaoJianPlace.selectAll,
                    UrineTestTime: _this.niaoJianTime,
                    UrineTestResults:  _this.niaoJianResult,
                    UrineWorkerName: _this.niaoJianRen,
                };
                var params_myUpload = {
                    fileType: 'pic',
                    fileList: _fileList
                };
                console.log("------------------"+JSON.stringify(params_myUpload)+JSON.stringify(formData))
                var params_postForm = {
                    url: "/home/data/urineupload",
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
                    },
                };
                _this.Tool.submit(params_myUpload, params_postForm);
            }

    },

    getFile1:function(file, fileList) {
//        console.log("888888888"+JSON.stringify(fileList))
        _this.fileList1 = fileList;
    },
    getFile2:function(file, fileList) {
//        console.log("888888888"+JSON.stringify(fileList))
        _this.fileList2= fileList;
    }
    }
    };
</script>
<style scoped>
    div table td {
        border-right: 0 !important;
    }
</style>

