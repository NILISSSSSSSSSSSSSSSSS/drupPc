 <template>
    <div class="inputStyle">
        <el-form  ref="ruleForm" label-width="139px" class="demo-ruleForm">
             <el-form-item label="评估开始时间" >
                <el-col :span="11">
                    <el-form-item prop="">
                        <el-date-picker  @change="confirmCallback"  format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期" v-model="time1" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="评估结束时间" >
                <el-col :span="11">
                    <el-form-item prop="">
                        <el-date-picker  disabled  format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期" v-model="time2" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>
         
            <el-form-item label="评估表照片" prop="">
                <el-upload
                        class="upload-demo" ref="upload" multiple action="" :on-remove="getFile1" :on-change="getFile1" :file-list="fileList1" :auto-upload="false"  >
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
    var _this;
    export default {
        name:"jiPingGu",
        data: function() {
            return {
                time1:"",
                time2:"",
                fileList1:[],

            };
        },
        created() {
        _this = this;
       
    },
    components: {
        // <my-component> 将只在父组件模板中可用

    },
    methods: {
             //年度评估时间转换
            confirmCallback:function(date) {
                var tranDate = new Date(date);
                tranDate.setMonth(tranDate.getMonth() + 12);
                _this.time2= _this.formatDate(tranDate);
            },
             formatDate(date) {  
                debugger;
                var y = date.getFullYear();  
                var m = date.getMonth() + 1;  
                m = m < 10 ? '0' + m : m;  
                var d = date.getDate();  
                d = d < 10 ? ('0' + d) : d;  
                return y + '-' + m + '-' + d;  
            }, 
        submitForm: function(formName) {
            if(_this.time1=="" ||  _this.time2=="" ||_this.fileList1.length==0 ){
                _this.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '请填写完整信息'
                });
                return;
            }

           else{
                var _fileList = {};
                _fileList['ComprehensivePhoto'] =  _this.fileList1

                var formData = {
                    DrugUserCardId: _this.$route.query.drugerId,
                    // ComprehensiveStartTime: _this.time1,
                    // ComprehensiveEndTime:  _this.time2,
                }
                var params_myUpload = {
                    fileType: 'pic',
                    fileList: _fileList
                };
                var params_postForm = {
                    // url: '/home/data/comprehensiveupload',
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
    },

    getFile1:function(file, fileList) {
        _this.fileList1= fileList;
    }
    }
    };
</script>
<style scoped>
    div table td {
        border-right: 0 !important;
    }
</style>

