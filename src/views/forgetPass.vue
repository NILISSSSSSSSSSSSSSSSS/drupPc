<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit" :style="{backgroundImage: 'url('+require('../images/bg.png')+')'}">
        <div class="login-wrapper">
            <!-- <img src="../images/loginLogo.png"> -->
            <div class="login-con">
                <Card :bordered="false">
                    <span slot="title" style="color:#fff;">
                            <Icon type="log-in"></Icon>
                            忘记密码
                        </span>
                    <span slot="extra" @click="back" class="extra" style="color:#fff;">
                             <Icon type="arrow-left-c"></Icon>
                             返回
                        </span>
                    <div class="form-con">
                        <Form ref="loginForm" :model="form" :rules="rules">
                            <FormItem prop="PhoneNumber">
                                <Input v-model="form.PhoneNumber" placeholder="请输入手机号码" :maxlength=11>
                                <span slot="prepend">
                                            <Icon :size="16" type="person"></Icon>
                                        </span>
                                </Input>
                            </FormItem>
                            <FormItem prop="verfiyCode">
                                <Input v-model="form.verfiyCode" placeholder="请输入验证码">
                                <Button slot="append" @click="getVeriyCode">获取验证码</Button>
                                </Input>
                            </FormItem>
                            <FormItem prop="newPassword">
                                <Input type="password" v-model="form.newPassword" placeholder="请输入新密码">
                                <span slot="prepend">
                                            <Icon :size="14" type="locked"></Icon>
                                        </span>
                                </Input>
                            </FormItem>
                            <FormItem prop="confirmPass">
                                <Input type="password" v-model="form.confirmPass" placeholder="请再次输入新密码">
                                <span slot="prepend">
                                            <Icon :size="14" type="locked"></Icon>
                                        </span>
                                </Input>
                            </FormItem>
                            <FormItem>
                                <Button @click="changePassword" :style="{backgroundImage: 'url('+require('../images/loginBg.png')+')'}" type="primary" v-loading.fullscreen.lock="fullscreenLoading" long>修改</Button>
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
        name: 'forgetPass',
        data() {
            return {
                fullscreenLoading: false,
                verifyCode: '',
                form: {
                    PhoneNumber: '',
                    newPassword: '',
                    verfiyCode: '',
                    confirmPass: ''
                },
                rules: {
                    PhoneNumber: [{
                        required: true,
                        message: '账号不能为空',
                        trigger: 'blur'
                    }],
                    verfiyCode: [{
                        required: true,
                        message: '验证码不能为空',
                        trigger: 'blur'
                    }],
                    newPassword: [{
                        required: true,
                        message: '新密码不能为空',
                        trigger: 'blur'
                    }],
                    confirmPass: [{
                        required: true,
                        message: '确认密码不能为空',
                        trigger: 'blur'
                    }]
                }
            };
        },
        created() {
           _this = this;
        },
        watch:{
            //监听手机号码
            "form.PhoneNumber":function(val){
                if(val.length == 11){
                    if(!(/^1[345789]\d{9}$/.test(val))){
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
            //返回
            back: function() {
                this.$router.push({
                    path: '/'
                });
            },
            //修改密码
            changePassword: function() {
                if (this.form.PhoneNumber && this.form.newPassword && this.form.verfiyCode && this.form.confirmPass) {
                    if (this.form.newPassword !== this.form.confirmPass) {
                        this.$notify({
                            title: '密码修改失败',
                            message: '两次输入的密码不一致',
                            type: 'warning',
                            duration: 3000
                        });
                    } else {
                        this.$http
                            .post(this.httpUrl + "/home/index/setpwd", {
                                PhoneNumber: this.form.PhoneNumber,
                                PassWord: this.hexSha1(_this.form.newPassword),
                                Code: this.form.verfiyCode
                            })
                            .then(response => {
                                console.log(response);
                                if (response.data.errno == 0) {
                                    this.$notify({
                                        title: '密码修改成功',
                                        message: response.data.errmsg,
                                        type: 'success',
                                        duration: 3000
                                    });
                                    this.$router.push({
                                        path: '/'
                                    });
                                } else {
                                    this.$notify({
                                        title: '密码修改失败',
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
                } else {
                    this.$notify({
                        title: '密码修改失败',
                        message: '填写内容不能为空',
                        type: 'warning',
                        duration: 3000
                    });
                }
            },
            //获取验证码
            getVeriyCode: function() {
                console.log(this.form.PhoneNumber);
                if (this.form.PhoneNumber) {
                    console.log('测试');
                    console.log(this.httpUrl);
                    this.$http
                        .get(this.httpUrl + "/home/sms/sms", {
                            params: {
                                PhoneNumber: this.form.PhoneNumber
                            }
                        })
                        .then(response => {
                            console.log(response);
                            if (response.data.errno == 0) {
                                this.$notify({
                                    title: '验证码获取成功，请在手机上查看',
                                    message: response.data.errmsg,
                                    type: 'success',
                                    duration: 2500
                                });
                            } else {
                                this.$notify({
                                    title: '获取验证码失败',
                                    message: response.data.errmsg,
                                    type: 'warning',
                                    duration: 3000
                                });
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    this.$notify({
                        title: '获取验证码失败',
                        message: '手机号码不能为空',
                        type: 'warning',
                        duration: 3000
                    });
                }
            }
        }
    };
</script>

<style scoped>
    .forgetPass {
        color: #5f6671;
        margin-left: 20px;
    }
    .forgetPass:hover {
        color: #2D8CF0;
    }
    .extra {
        cursor: pointer;
    }
    .ivu-btn{
        color:#d4e1f1 !important;
    }
    .ivu-card-head{
        border-bottom:1px solid red !important;
    }
    .ivu-icon-log-in,.ivu-icon-arrow-left-c{
        color: rgb(153, 196, 248) !important;
    }
</style>
