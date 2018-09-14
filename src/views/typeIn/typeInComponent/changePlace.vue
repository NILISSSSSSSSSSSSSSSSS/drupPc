<template>
    <div class="inputStyle">
        <el-form  ref="ruleForm" label-width="139px" class="demo-ruleForm">
            <el-form-item label="" prop="" >
                <el-radio-group v-model="radioVal" @change="getRadioVal" size="small">
                    <el-radio  label="1">普通</el-radio>
                    <el-radio  label="2">绿色家园</el-radio>
                </el-radio-group>

            </el-form-item>
            <el-form-item label="执行地" prop="" v-if="regionIsShow">
                <fourth-region ref="region"></fourth-region>
            </el-form-item>
            <!-- 绿色家园 -->
            <el-form-item label="执行地" prop="" v-if="!regionIsShow">
                <el-select v-model="green_value" placeholder="请选择">
                    <el-option  v-for="(item, index) in greenHome" :key="index" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="变更原因" prop="reason">
                <el-select v-model="reason" placeholder="请选择">
                    <el-option label="居住" value="居住"></el-option>
                    <el-option label="从业" value="从业"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="变更时间" >
                <el-col :span="11">
                    <el-form-item prop="ChangeTime">
                        <el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期" v-model="ChangeTime" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="委托书照片" prop="fileList1">
                <el-upload
                        class="upload-demo" ref="upload" multiple action="" :on-remove="getFile1" :on-change="getFile1" :file-list="fileList1" :auto-upload="false"  >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">录入</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script type="text/ecmascript-6">
    import specialRegion from "../../main-components/specialRegion.vue";
    var _this;
    export default {
        data: function() {
            return {
                ChangeTime: "",
                reason:"",
                fileList1:[],
                radioVal:"1",
                regionIsShow:true,
                green_value:"",
                greenHome:[{
                    value: '凉山州绿色家园语录塔社区',
                }],
            };
        },
        created() {
        _this = this;
    },
    components: {
        // <my-component> 将只在父组件模板中可用
        "fourth-region": specialRegion
    },
    methods: {
        getRadioVal:function(){
            if(this.radioVal=="2"){
              _this.regionIsShow=false;
             _this.reason="从业"
            }
            else{
                _this.regionIsShow=true;
            }
        },
        submitForm: function(formName) {
            if( _this.reason =="" ||_this.ChangeTime=="" ||  _this.fileList1.length==0){
                _this.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '请填写完整信息'
                });
                return;
            }
            var zhiXingDiVal;
            if(_this.regionIsShow){
                if(_this.$refs.region.selectAll==""){
                    _this.$notify.error({
                        duration:2000,
                        title: '错误',
                        message: '请填写完整信息'
                    });
                    return;
                }
                zhiXingDiVal=_this.$refs.region.selectAll;
            }
            else{
                if(_this.green_value==""){
                    _this.$notify.error({
                        duration:2000,
                        title: '错误',
                        message: '请填写完整信息'
                    });
                    return;
                }
                zhiXingDiVal="凉山彝族自治州-绿色家园-凉山州绿色家园-语录塔社区";
            }
               console.log("***********"+zhiXingDiVal)
                var _fileList = {
                    Photo: _this.fileList1,
                };

                var formData = {
                    DrugUserCardId:this.$route.query.drugerId,
                    ExecutorAddress:zhiXingDiVal,
                    Reason:_this.reason,
                    ChangeTime: _this.ChangeTime,

                }
                var params_myUpload = {
                    fileType: 'pic',
                    fileList: _fileList
                };
                console.log(formData+_fileList)
                var params_postForm = {
                    url: "/home/data/changeexecutorupload",
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

