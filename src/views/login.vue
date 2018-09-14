<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit" :style="{backgroundImage: 'url('+require('../images/bg.png')+')'}">
        <!--最顶部区域-->
        <div class="loginHeader">
            <div class="appDownload">
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                                    APP下载<i class="el-icon-arrow-down el-icon--right"></i>
                                 </span>
                    <el-dropdown-menu slot="dropdown">
                        <!--  <el-dropdown-item>培训版2018-05-03</el-dropdown-item>
                                <el-dropdown-item>
                                    <img src="../images/testVersion.jpg" class="versionImg" title="培训版">
                                </el-dropdown-item> 
                                <el-dropdown-item>
                                    <img src="../images/officialVersion.jpg" class="versionImg"  @click="enlargeImg" title="正式版">
                                </el-dropdown-item>-->
                        <el-dropdown-item>正式版2018-05-12</el-dropdown-item>
                        <!-- <el-dropdown-item>培训版2018-05-12</el-dropdown-item> -->
                        <el-dropdown-item>
                            <img src="../images/officialVersion.jpg" class="versionImg" @click="enlargeImg">
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <!--放大图片-->
                <el-dialog :visible.sync="enlargeImgVisible">
                    <div class="enlargeImg">
                        <img src="../images/officialVersion.jpg" width="280" height="280">
                    </div>
                </el-dialog>
            </div>
        </div>
        <div class="login-wrapper">
            <div class="loginLogo">
                <img src="../images/logo.png">
            </div>
            <div class="loginTitle">
                <img src="../images/title.png">
                <span>正式版2018-05-12</span>
                <!-- <span>培训版2018-05-12</span> -->
            </div>
            <div class="login-con">
                <Card :bordered="false">
                    <div class="form-con">
                        <Form ref="loginForm" :model="form" :rules="rules">
                            <FormItem prop="PhoneNumber">
                                <Input v-model="form.PhoneNumber" placeholder="请输入手机号码" :maxlength=11>
                                <span slot="prepend">
                                                    <Icon :size="16" type="person" width="50" height="50"></Icon>
                                                </span>
                                </Input>
                            </FormItem>
                            <FormItem prop="password">
                                <Input type="password" v-model="form.PassWord" placeholder="请输入密码">
                                <span slot="prepend">
                                                    <Icon :size="14" type="locked"></Icon>
                                                </span>
                                </Input>
                            </FormItem>
                            <FormItem>
                                <a class="forgetPass" @click="forgetPass" href="javascript:;">忘记密码？</a>
                            </FormItem>
                            <FormItem>
                                <Button @click="handleSubmit" type="primary" :style="{backgroundImage: 'url('+require('../images/loginBg.png')+')'}" v-loading.fullscreen.lock="fullscreenLoading" long>登录</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    var _this;
    export default {
        data() {
            return {
                fullscreenLoading: false,
                form: {
                    PhoneNumber: '',
                    PassWord: ''
                },
                enlargeImgVisible: false,
                rules: {
                    PhoneNumber: [{
                        required: true,
                        message: '账号不能为空',
                        trigger: 'blur'
                    }],
                    PassWord: [{
                        required: true,
                        message: '密码不能为空',
                        trigger: 'blur'
                    }]
                }
            };
        },
        created() {
            _this = this;
            if (navigator.userAgent.toLowerCase().indexOf("chrome") == -1) {
                console.log('您当前的浏览器不是谷歌浏览器');
                /* this.$confirm('当前浏览器不是谷歌，是否开始使用谷歌浏览器进行浏览?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    window.open('http://rj.baidu.com/soft/detail/14744.html?ald', '_blank');
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                }); */
            } else {
                console.log('您当前的浏览器是谷歌浏览器');
            }
        },
        watch: {
            //监听手机号码
            "form.PhoneNumber": function(val) {
                if (val.length == 11) {
                    if (!(/^1[345789]\d{9}$/.test(val))) {
                        this.$notify({
                            message: '请输入正确的手机格式',
                            type: 'warning',
                            duration: 3000
                        });
                    }
                }
            }
        },
        methods: {
            //登录
            handleSubmit() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.fullscreenLoading = true;
                        this.$http
                            .post(this.serverIP + "/index/pclogin", {
                                PhoneNumber: this.form.PhoneNumber,
                                version:'1.003',
                                PassWord: _this.hexSha1(_this.form.PassWord)
                            })
                            .then(response => {
                                this.fullscreenLoading = false;
                                console.log(response);
                                if (response.data.errno == 0) {
                                    this.$router.push({
                                        name: 'home'
                                    });
                                    Cookies.set('myToken', response.data.data.Token); //保存token
                                    Cookies.set('userName', response.data.data.Name); //保存用户名
                                    Cookies.set('myPhoneNum', this.form.PhoneNumber); //保存手机号码
                                    let regionPower  = response.data.data.Region;
                                    console.log(regionPower);
                                    if(regionPower instanceof Array){
                                        Cookies.set('myRegion', response.data.data.Region.join(",")); //保存管理区域
                                    }else{
                                        Cookies.set('myRegion', response.data.data.Region); //保存管理区域
                                    }
                                    // this.Tool.manageRegion = response.data.data.Region;
                                    Cookies.set('myCounty', response.data.data.County); //保存市
                                    Cookies.set('myStation', response.data.data.station); //保存工作站
                                    Cookies.set('myPic', response.data.data.HeadImage); //保存头像
                                    Cookies.set('UserType', response.data.data.UserType); //
                                    Cookies.set('Jurisdiction', response.data.data.Jurisdiction); //保存登录者的管辖权
                                    var ToKen = response.data.data.Token,
                                        PhoneNumber = this.form.PhoneNumber;
                                    this.Tool.newCos(PhoneNumber, ToKen);
                                    if (response.data.data.Jurisdiction == "3") {
                                        //乡镇工作人员
                                        Cookies.set('access', 0);
                                    } else {
                                        //非乡镇工作人员
                                        Cookies.set('access', 1);
                                    }
                                    this.$store.commit('updateMenulist');
                                     //判断版本号
                                    if(response.data.data.Update == 777){
                                        setTimeout(()=>{
                                            window.location.reload();
                                        },1000);
                                    }
                                }else{
                                    this.fullscreenLoading = false;
                                    this.$notify({
                                        title: '登录失败',
                                        message: response.data.errmsg,
                                        type: 'warning',
                                        duration: 3000
                                    });
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                });
            },
            //放大图片
            enlargeImg: function() {
                console.log('放大图片');
                this.enlargeImgVisible = true;
            },
            //忘记密码
            forgetPass: function() {
                this.$router.push({
                    path: '/forgetPass'
                });
            }
        }
    };
</script>

<style scoped>
    .forgetPass {
        color: #226ce0;
        margin-left: 20px;
    }
    .forgetPass:hover {
        color: #2D8CF0;
    }
    .enlargeImg {
        width: 100%;
        text-align: center;
    }
    .enlargeImg img {
        display: inline-block;
    }
    .loginHeader {
        width: 100%;
        height: 60px;
        line-height: 60px;
        background: rgba(0, 0, 0, 0.2);
    }
    .loginHeader .headerTitle {
        float: left;
        height: 60px;
    }
    .headerTitle img,
    .headerTitle span {
        display: block;
        float: left;
    }
    .headerTitle img {
        width: 50px;
        height: 51px;
        margin: 5px 10px 5px 20px;
    }
    .headerTitle span {
        color: #fff;
        font-size: 26px;
    }
    .appDownload {
        float: right;
        margin-right: 20px;
    }
    .el-dropdown-link {
        color: #fff;
        cursor: pointer;
        font-size: 16px;
    }
    .versionImg {
        width: 150px;
        height: 150px;
    }
</style>
