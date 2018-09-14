<template>
    <div class="inputStyle">
        <el-form ref="ruleForm" label-width="139px" class="demo-ruleForm">
            <el-form-item label="请假时间" prop="" >
                <el-date-picker
                        v-model="timeVal"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="请假开始时间"
                        end-placeholder="请假结束时间" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="请假目的地" prop="">
                <fourth-region ref="region"></fourth-region>
            </el-form-item>
            <el-form-item label="详细地址" prop="" >
                <el-input v-model="detailAddress" placeholder="请输详细地址"></el-input>
            </el-form-item>
            <el-form-item label="请假事由" prop="">
                <el-select v-model="reason" placeholder="请选择事由">
                    <el-option label="务工" value="务工"></el-option>
                    <el-option label="就医" value="就医"></el-option>
                    <el-option label="探亲" value="探亲"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="请假审批表照片" prop="">
                <el-upload
                        class="upload-demo" ref="upload" action="" multiple :on-remove="getFile1" :on-change="getFile1" :file-list="fileList1" :auto-upload="false"  >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
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
                timeVal:'',
                detailAddress:"",
                reason:"",
                fileList1:[],
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
            if(this.timeVal[0]=="" || this.timeVal[1] =="" ||_this.$refs.region.selectAll=="" || _this.reason=="" || _this.detailAddress=="" || _this.fileList1.length==0){
                _this.$notify.error({
                    title: '错误',
                    message: '请填写完整信息'
                });
                return;
            }
            else{
                var _fileList = {};
                _fileList['Photo'] =  _this.fileList1
                var formData = {
                    DrugUserCardId: this.$route.query.drugerId,
                    StartTime:_this.timeVal[0],
                    EndTime:_this.timeVal[1],
                    Destination: _this.$refs.region.selectAll,
                    Address: _this.detailAddress,
                    Reason: _this.reason,
                };
                var params_myUpload = {
                    fileType: 'pic',
                    fileList: _fileList
                };
                console.log(formData+_fileList)
                var params_postForm = {
                    url: "/home/data/leaveupload",
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
        _this.fileList1 = fileList;
    }
    }
    };
</script>
<style scoped>
    div table td {
        border-right: 0 !important;
    }
</style>

