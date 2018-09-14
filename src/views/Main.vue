<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'230px', overflow: shrink ? 'visible' : 'auto'}">
            <shrinkable-menu 
                :shrink="shrink"
                :menu-list="menuList">
                <div slot="top" class="logo-con">
                    <div class="logo" v-show="!shrink">
                        <img src="../images/logo.png" key="max-logo" />
                        <div class="title">
                        <span>索玛花工程正式版2018-05-12</span>
                        <!-- <span>索玛花工程培训版2018-05-12</span> -->
                        </div>
                    </div>
                    <img v-show="shrink" src="../images/logo.png" key="min-logo" />
                </div>
            </shrinkable-menu>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'230px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                 <div class="scrollBar">
                   <marquee style="height: 60px" scrollamount="4" direction="left" onmouseover=this.stop() onmouseout=this.start() align="Middle">
                        <ul>
                            <li v-for="(item ,key) in backlogdata" style="cursor: pointer" @click="goToPage(key)">{{key}}: <span style="color: #fff609;font-size: 14px;font-weight: bold">{{item}}</span>
                            </li>
                        </ul>
                    </marquee>
                </div>
                <div class="header-avator-con">
                    <p class="welcomeInfo">管理权限为<b>{{Region}}</b></p>
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <!-- <Avatar icon="person" style="background: #619fe7;margin-right:10px;"></Avatar> -->
                            <span v-show="defaultImg" style="display:inline-block;"><img src="../images/defaultImg.png" width="40" height="40" style="border-radius:50%;margin-right:5px"></span>
                            <span v-show="myImg"><img :src="showMyImg" v-cosauth width="45" height="45" style="border-radius:50%;margin-right:5px;display:inline-block"></span>
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="resetPass" divided>重置密码</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'230px'}">
            <div class="single-page">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie';
import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';

export default {
    components: {
        shrinkableMenu
    },
    data () {
        return {
            shrink: false,
            userName: '',
            Region:'',
            defaultImg:false,
            myImg:false,
            showMyImg:"",
            showImg:"",
            backlogdata:{}
        };
    },
    created(){
        
    },
    computed: {
        menuList () {
            return this.$store.state.app.menuList;
        }
    },
    methods: {
           goToPage(param){
            this.$router.push({path:'/personManage/backlog',query:{title:param}})
        },
        getScrolldata() {
                let _this = this;
                let params = {
                    ToKen: _this.token,
                    PhoneNumber: _this.phonenumber
                };
                return this.$http.get(this.serverIP + '/drugusercomplexdetails/waitdoingthingstotalnumber', {
                    params: params
                }).then((res) => {
                    if (!res.data.errno) {
                        let resobj = res.data.data;
                        let obj = {};
                        Object.keys(resobj).forEach((item) => {
                            switch (item) {
                                case 'WaitIssue':
                                    obj['待分发'] = resobj[item];
                                    break;
                                case 'WaitReportNum':
                                    obj['待报到'] = resobj[item];
                                    break;
                                case 'WaitTalkNum':
                                    obj['待谈话'] = resobj[item];
                                    break;
                                case 'WaitUrineNum':
                                    obj['待尿检'] = resobj[item];
                                    break;
                                case 'WaitComprehensiveNum':
                                    obj['待评估'] = resobj[item];
                                    break;
                                case 'WaitApprovalNum':
                                    obj['待审批'] = resobj[item];
                                    break;
                                case 'WaitVerificationNum':
                                    obj['待核实'] = resobj[item];
                                    break
                            }
                        });
                        this.backlogdata = obj
                    } else {
                        this.$notify({
                            title: '数据获取失败',
                            message: res.data.errmsg,
                            type: 'warning',
                            duration: 3000
                        });
                    }
                }).catch((error) => {
                    this.$notify({
                        title: '数据获取失败',
                        message: error,
                        type: 'warning',
                        duration: 3000
                    });
                })
            },
        init () {
            this.userName = Cookies.get('userName');
            // this.Region = Cookies.get('myRegion');
            let RegionPower = Cookies.get('myRegion');
            let str = '';
            if(RegionPower.indexOf(',') > -1){
                let arr =  RegionPower.split(",");
               if(arr.length > 1){
                for(var i=0;i<arr.length;i++){
                    str+= arr[i]+' - ';
                }
                this.Region = str.substring(0,str.length-3);
                }else{
                    this.Region = arr[0];
              }
            }else{
                this.Region = RegionPower;
            }   
        },
        toggleClick () {
            this.shrink = !this.shrink;
        },
        clearCookie(){ 
            var keys=document.cookie.match(/[^ =;]+(?=\=)/g); 
            if (keys) { 
            for (var i=0;i<keys.length;i++) 
               document.cookie=Cookies.remove(keys[i]); 
            } 
        } ,
        handleClickUserDropdown (name) {
            if(name == "loginout"){
                this.$router.push({
                name: 'login'
               });
               //清除所有Cookie
               this.clearCookie();
            }else{
                this.$router.push({
                    name: 'resetPass'
                });
            }
        }
    },
    mounted () {
        this.token = Cookies.get('myToken');
            this.phonenumber = Cookies.get('myPhoneNum');
            this.getScrolldata();
            // this._setTimer();
        this.init();
        this.showImg = Cookies.get("myPic");
        if(this.showImg.length == ""){
            this.myImg = false;
            this.defaultImg = true;
        }else{
            this.myImg = true;
            this.defaultImg = false;
            this.showMyImg = this.showImg;
        } 
    }

};
</script>
<style scoped>
  li {
        list-style: none
    }

    .main-header {
        display: flex;
    }

    .scrollBar {
        height: 100%;
        flex: 1;
        margin-right: 340px;
        /*overflow: hidden;*/
    }

    .scrollBar ul {
        float: left;
        background-color: #173f79;
        margin-top: 10px;
    }

    .scrollBar li {
        float: left;
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        color: #3595da;

    }
</style>


