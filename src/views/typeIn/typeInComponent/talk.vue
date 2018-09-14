<template>
    <div class="inputStyle">
        <el-form   ref="ruleForm" label-width="130px" class="demo-ruleForm">
            <el-form-item label="谈话时间" >
                <el-col :span="11">
                    <el-form-item prop="TalkTime">
                        <el-date-picker   format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期" v-model="TalkTime" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="谈话地点" prop="">
                <fourth-region ref="talkRegion1"></fourth-region>
                <span class="errorRule"  v-if="regionErrorShow1">请选择地址</span>
            </el-form-item>
            <el-form-item label="谈话方式" prop="">
                <el-select v-model="TalkMode" placeholder="请选择谈话方式">
                    <el-option label="面谈" value="面谈"></el-option>
                    <el-option label="电话" value="电话"></el-option>
                    <el-option label="视频" value="视频"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="谈话内容照片" prop="">
                <el-upload
                        multiple class="upload-demo" ref="upload" action="" :on-remove="getFile1" :on-change="getFile1" :file-list="fileList1" :auto-upload="false"  >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
            </el-form-item>

            <el-form-item label="居住地有无变更"  >
                <el-select v-model="pickerChange" placeholder="请选择" @change="pickerCb">
                    <el-option label="有" value="有"></el-option>
                    <el-option label="无" value="无"></el-option>
                </el-select>
            </el-form-item>
            <div v-if="hasChange">
                <!--</el-form-item>//居住地址-->
                <el-form-item label="居住地址" prop="">
                    <fourth-region ref="talkRegion2"></fourth-region>
                </el-form-item>
                <!--</el-form-item>//请输入详细地址-->
                <el-form-item label="居住地址详细地址" prop="" >
                    <el-input v-model="DetailAddress"></el-input>
                </el-form-item>
            </div>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">上报</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script type="text/ecmascript-6">
    import Cookies from 'js-cookie';
    import fourthRegion from "../../main-components/fourthRegion";
    var _this;
    export default {
        data: function() {
            return {

                hasChange: false,
                fileErrorShow1:false,
                regionErrorShow1:false,

                pickerChange:"",
                fileList1: [],
                name: "",
                //                region: '',
                TalkMode: "",
                TalkTime: "",
                DetailAddress: "",
                ResidentialAddress: ""

            };
        },
        created() {
        _this = this;
         this.Tool.newCos(Cookies.get('myPhoneNum'), Cookies.get('myToken'));//实例化
         },

    components: {
        // <my-component> 将只在父组件模板中可用
        "fourth-region": fourthRegion
    },
    methods: {
        pickerCb: function() {
            if (this.pickerChange === "有") {
                this.hasChange = true;
            } else if (this.pickerChange === "无") {
                this.hasChange = false;
            }
        },
         submitForm(formName) {

            if(this.TalkMode=="" || this.TalkTime =="" || this.$refs.talkRegion1.selectAll=="" || _this.fileList1.length==0 || this.pickerChange==""){
                _this.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '请填写完整信息'
                });
                return false;
            }
            if(this.pickerChange == "有" ) {
                if( _this.DetailAddress == "" || this.$refs.talkRegion2.selectAll==""){
                    _this.$notify.error({
                        duration: 2000,
                        title: '错误',
                        message: '请填写完整信息'
                    });
                    return false;
                }
            }
            var formData = {//传入数据库的参数
                DrugUserCardId: this.$route.query.drugerId,
                TalkPlace: this.$refs.talkRegion1.selectAll,
                TalkMode: this.TalkMode,
                TalkTime: this.TalkTime
            };
            if (this.pickerChange) {
                if (this.pickerChange === "有") {
                    formData["ResidentialAddress"] = this.$refs.talkRegion2.selectAll + this.DetailAddress;
                }
            }
            var _fileList = {};
            _fileList['TalkPhoto'] =  _this.fileList1

            var params_myUpload = {//图片对象参数
                fileType: 'pic',
                fileList: _fileList
            };
            console.log(params_myUpload)
            //服务器的回调函数
            var params_postForm = {
                url: "/home/data/settalk",
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


    },



    }


</script>
<style scoped>
    div table td {
        border-right: 0 !important;
    }
</style>

