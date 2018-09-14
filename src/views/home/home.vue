<template>
    <div class="home-main" ref="homeMain" style="color: #0a1e42">
        <div class="home-wrapper" :style="homebg">
            <div class="menu">
                <div class="mapbtn">
                    <span @click="showPerson=false" :class="{active:!showPerson}"
                    >{{titlebtn}}社区工作站情况</span>
                    <span @click="showPerson=true" style="margin-left: 0" :class="{active:showPerson}"
                    >{{titlebtn}}吸毒人员分布情况</span>
                </div>
            </div>
            <div v-show="!showPerson" class="mapContent">
                <div class="mapwrapleft">
                    <drugMap @getPreview="getSlideData"></drugMap>
                </div>
                <div class="mapslideright" id="mapslideright">
                    <div class="grid-content" :style="boxbg">
                        <h1 class="white fd-titleBig-g">{{this.myRegion}}</h1>
                        <h4 class="white title fd-title" :style="titlebg" style="margin-top: 20px">吸毒人员总数</h4>
                        <table border="0" class="slidetable" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>总人数<span style="color:#ef5656"> {{tagetData.drugtotal}} </span>人</td>
                                <td>戒毒人员 <span style="color: #07bc8b"> {{tagetData.drugdel}} </span>人</td>
                                <td>康复人 <span style="color: #07bc8b"> {{tagetData.drughealth}} </span>人</td>
                            </tr>
                            <tr>
                                <td>逾期未报道 <span style="color: #939624">{{tagetData.Overduetotal}} </span>人</td>
                                <td>戒毒逾期未报道 <span style="color: #ef5656">{{tagetData.Overduedel}}</span> 人</td>
                                <td>康复逾期未报道 <span style="color: #ef5656">{{tagetData.Overduehealth}}</span> 人 </td>
                            </tr>
                            <tr>
                                <td>违反协议 <span style="color: #939624">{{tagetData.manualentrytotal}} </span>人</td>
                                <td>戒毒违反协议 <span style="color: #ef5656">{{tagetData.manualentrydel}} </span> 人</td>
                                <td>康复违反协议 <span style="color: #ef5656">{{tagetData.manualentryhealth}} </span> 人
                                </td>
                            </tr>
                        </table>

                        <div class="person-count">
                            <div class="pcTitleWrap"><h4 class="white title fd-title" :style="titlebg">滥用毒品</h4>
                                <h4 class="white title fd-title" :style="titlebg">吸毒人数{{itemtypeData.total}}人</h4>
                            </div>
                            <table class="table-2 slidetable" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td>
                                        冰毒 <span
                                            style="color: #939624">{{ itemtypeData.total ? (itemtypeData.drugitem1 * 100 / itemtypeData.total).toFixed(2) : 0}}</span>% <span
                                            class="red">{{itemtypeData.drugitem1}}</span>人
                                    </td>

                                    <td>
                                        海洛因 <span
                                            style="color: #939624">{{itemtypeData.total ? (itemtypeData.drugitem2 * 100 / itemtypeData.total).toFixed(2) : 0}}</span>% <span
                                            class="red">{{itemtypeData.drugitem2}}</span>人
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        氯胺胴 <span
                                            style="color: #939624">{{itemtypeData.total ? (itemtypeData.drugitem3 * 100 / itemtypeData.total).toFixed(2) : 0}}</span>% <span
                                            class="red">{{itemtypeData.drugitem3}}</span>人
                                    </td>
                                    <td>
                                        杜冷丁 <span
                                            style="color: #939624">{{itemtypeData.total ? (itemtypeData.drugitem4 * 100 / itemtypeData.total).toFixed(2) : 0}}</span><% <span
                                            class="red">{{itemtypeData.drugitem4}}</span>人
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        可卡因 <span class="red"
                                                  style="color: #939624">{{itemtypeData.total ? (itemtypeData.drugitem5 * 100 / itemtypeData.total).toFixed(2) : 0}}</span>%  <span
                                            class="red">{{itemtypeData.drugitem5}}</span>人
                                    </td>
                                    <td>
                                        其他毒品 <span class="red"
                                                   style="color: #939624">{{itemtypeData.total ? (itemtypeData.drugitem6 * 100 / itemtypeData.total).toFixed(2) : 0}}</span>%  <span
                                            class="red">{{itemtypeData.drugitem6}}</span>人
                                    </td>
                                </tr>
                            </table>

                        </div>
                    </div>
                </div>
                <!--<el-col :span="17">-->
                <!---->
                <!--</el-col>-->
                <!--<el-col :span="7">-->
                <!---->
                <!--</el-col>-->
            </div>
            <!-- 人员轨迹分布 -->
            <div class="person-distribution" v-show="showPerson">
                <div class="amap-wrapper mapWrap" id="mapWrap" style="width:100%;height: 700px">
                    <el-amap vid="amapDemo" :plugin="plugin" :zoom="zoom" :center="center" :events="events"
                             class="amap-demo">
                        <el-amap-marker v-for="marker in markers" :position="marker.position"
                                        :events="marker.events"></el-amap-marker>
                        <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible"
                                             :content="window.content"></el-amap-info-window>
                    </el-amap>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import drugMap from '@/views/drugMap'
    import Cookies from 'js-cookie'
    import default_pic  from '@/images/default_pic.png'

    var titledata = '';
    var cluster;
    export default {
        data() {
            var _this = this;
            return {
                showPerson: false,
                tagetData: [],
                itemtypeData: [],
                zoom: 5,
                center: [103.838224, 36.067702],
                markers: [],
                windows: [],
                window: '',
                plugin: [],
                markerRefs: [],
                events: {
                    init(o) {
                        async function initClusterer() {
                            await _this.getPreviewgetdrugposinfobyinstituData();
                           cluster = new AMap.MarkerClusterer(o, _this.markerRefs, {
                                gridSize: 60,
                               maxZoom:17,
                                renderCluserMarker: _this._renderCluserMarker
                            });
                        }
                        initClusterer();
                    }
                },
                storgedata: [],
                homebg: {
                    backgroundImage: "url(" + require("../../images/home-bg.jpg") + ")",
                    backgroundRepeat: "no-repeat",
                },
                navbg04: {
                    backgroundImage: "url(" + require("../../images/nav-bg04.png") + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: '100%',
                },
                navbgactive: {
                    backgroundImage: "url(" + require("../../images/nav-bg-active.png") + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: '100%',
                },
                boxbg: {
                    backgroundImage: "url(" + require("../../images/box-bg.png") + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: '100%',
                    height: '100%',
                    positon: 'relative'
                },
                titlebg: {
                    backgroundImage: "url(" + require("../../images/title-bg.jpg") + ")",
                    backgroundSize: '100%',
                },
                myRegion: '',
                titlebtn: '',
                timer:null
            };
        },
        mounted() {
            let mapslideright = document.getElementById('mapslideright');
            let offset = window.innerHeight - 185;
            let ht = 600;
            if (offset > 600) ht = offset;
            mapslideright.style.height = offset + 'px';

            this.token = Cookies.get('myToken');
            this.phonenumber = Cookies.get('myPhoneNum');
            let Jurisdiction = Cookies.get('Jurisdiction');
            let myRegion = Cookies.get('myRegion');
            if (Jurisdiction == 1) {
                this.titlebtn = myRegion;
                myRegion = myRegion + '社区戒毒（康复）执行率';
            } else if (Jurisdiction == 'ADMIN') {
                this.titlebtn = '凉山州';
                myRegion = '凉山州社区戒毒（康复）执行率'
            } else {
                this.titlebtn = myRegion;
                myRegion += '执行率'
            }
            titledata = myRegion;
            this.myRegion = myRegion;
            this.getPreviewdrugdatagetData();
            this.getPreviewdrugitemtypeData();
//            this.getPreviewgetdrugposinfobyinstituData();
        },
        destroyed() {
            clearTimeout(this.timer)
        },
        methods: {
            //时间格式转换
            _formatTime(ms){
                var date = new Date(ms);
                var year, month, day, hour, min,second;
                year = date.getFullYear();
                month = date.getMonth() + 1;
                day = date.getDate();
                hour = date.getHours();
                min = date.getMinutes();
                second = date.getSeconds();
                month < 10 ? (month = '0' + month) : month;
                day < 10 ? (day = '0' + day) : day;
                hour < 10 ? (hour = '0' + hour) : hour;
                min < 10 ? (min = '0' + min) : min;
                second < 10 ? (second = '0' + second) : second;
                return `${year}-${month}-${day} ${hour}:${min}:${second}`;
            },
            _setTimer(county) {
                let _this = this;
                if(_this.timer) clearTimeout(_this.timer);
                var startTime = new Date().getTime();
                var count = 0;
                let waiteTime=30000;
                function fixed() {
                    _this.getPreviewgetdrugposinfobyinstituData(county);
                    count++;
                    var offset = new Date().getTime() - (startTime + count * waiteTime);
                    var nextTime = waiteTime - offset;
                    if (nextTime < 0) nextTime = 0;
                    _this.timer=setTimeout(fixed, nextTime);

                    console.log(new Date().getTime() - (startTime + count * waiteTime));
                }

                _this.timer=setTimeout(fixed, waiteTime);

//                setInterval(()=>{
//                    let data=[];
//                    for(let i=0;i<300;i++){
//                        let longtitude=104.055851+Math.random()*.5;
//                        let lattitude=30.538729+Math.random()*.5;
//                        data.push({
//                            "Card_Id": i,
//                            "longtitude":longtitude,
//                            "lattitude": lattitude,
//                            "Name": "赵一",
//                            "headPhoto": "https://xcgk20180320-1256236574.cos.ap-chengdu.myqcloud.com/pic/cn_jj_cn_jj_mobile_lobby_view_Main.png"
//                        })
//                    }
//                   _this.handlecommon(data);
//
//                },5000)
            },
            _renderCluserMarker(context) {
                let _this=this;
                let color;
                let lennub=40;
                if(context.count<=lennub/4){
                    color='#00c2ff'
                }else if(lennub/4<context.count && context.count<=lennub/2){
                    color='#eb5137'
                }else if(lennub/2<context.count && context.count<=3*lennub/4){
                    color='#fff100'
                }else{
                    color='red'
                }

                context.marker.setContent(`<div style="width: 15px;height: 15px;
                        border-radius: 10px;background-color:${color};position:relative;">
                        <span style="position: absolute;left: 0px;top: -15px;transform:translate(0%);color: red">${context.count}</span></div>
                   `)

            },
            getSlideData(county, station, villages) {
                let _this=this;
                this.county=county;
                if (county) {
                    this.titlebtn = county;
                    this.myRegion = county + '社区戒毒（康复）执行率';
                } else {
                    this.titlebtn = '凉山州';
                    this.myRegion = titledata;
                }

                this.getPreviewdrugdatagetData(county, station, villages);
                this.getPreviewdrugitemtypeData(county, station, villages);
            },
//            添加标志公用部分
            handlecommon(cposdata) {
                let _this = this;
//                cposdata=cposdata.filter((item)=>item.longtitude && item.lattitude&& item.longtitude !== '未允许定位');
                cposdata.forEach((item, index) => {
                    if (this.storgedata.indexOf(item.Card_Id) !== -1) {
                        this.markers.forEach((markitem, ky) => {
                            if (markitem.Card_Id === item.Card_Id) {
                                if (item.longtitude && item.lattitude&& item.longtitude !== '未允许定位') {
                                    this.markers[ky].position = [item.longtitude, item.lattitude];
                                    let address=item.address ? `${item.address}(${item.longtitude},${item.lattitude})` : '无记录';
                                    this.windows[ky].content = `<div class="prompt" style="padding: 5px;display:flex">
                                                            <div style="flex:1;">
                                                               <p style="line-height:30px">身份证：${item.Card_Id}</p>
                                                               <p style="line-height:30px">名字：${item.Name}</p>
                                                               <p style="line-height:30px">定位地址：${address}</p>
                                                               <p style="line-height:30px">定位时间：${this._formatTime(item.createTime)}</p>
                                                            </div>
                                                            <div style="flex:0 0 80px;display:flex;align-items: center ">
                                                                <img width="80" height="80"
                                                                style="margin-left: 10px;margin-bottom: 5px;border:1px solid #d1d1d1" src="${item.headPhoto ? item.headPhoto : default_pic}" alt="">
                                                            </div>
                                                        </div>`;
                                    this.windows[ky].position=[item.longtitude, item.lattitude]
                                }
                            }
                        })
                    } else {
                        if (item.longtitude && item.lattitude && item.longtitude !== '未允许定位') {
                            this.storgedata.push(item.Card_Id);
                            let dqpos = [item.longtitude, item.lattitude];
                            let ind = this.storgedata.indexOf(item.Card_Id);
                            let address=item.address ? `${item.address}(${item.longtitude},${item.lattitude})` : '无记录';
                            this.windows.push({
                                Card_Id: item.Card_Id,
                                position: dqpos,
                                content: `<div class="prompt" style="padding: 5px;display:flex">
                                                            <div style="flex:1;">
                                                               <p style="line-height:30px">身份证：${item.Card_Id}</p>
                                                               <p style="line-height:30px">名字：${item.Name}</p>
                                                               <p style="line-height:30px">定位地址：${address}</p>
                                                                <p style="line-height:30px">定位时间：${this._formatTime(item.createTime)}</p>
                                                            </div>
                                                            <div style="flex:0 0 80px;display:flex;align-items: center ">
                                                                <img width="80" height="80"
                                                                style="margin-left: 10px;margin-bottom: 5px;border:1px solid #d1d1d1"
                                                                 src="${item.headPhoto ? item.headPhoto : default_pic}" alt="">
                                                            </div>
                                                        </div>`,
                                visible: false
                            });
                            this.markers.push({
                                Card_Id: item.Card_Id,
                                position: dqpos,
                                events: {
                                    init(o) {
                                        _this.markerRefs.push(o);
                                        cluster && cluster.addMarker(o)
                                    },
                                    mouseover(e) {
                                        _this.windows.forEach(window => {
                                            window.visible = false;
                                        });
                                        _this.window = _this.windows[ind];
                                        _this.$nextTick(() => {
                                            _this.window.visible = true;
                                        });
                                    },
                                    mouseout() {
                                        _this.window.visible = false;
                                    }
                                }
                            });
                        }
                    }
                });
            },
//            获取吸毒人员坐标信息生成标志
            getPreviewgetdrugposinfobyinstituData(county) {
                let _this = this;
                let params;
                if(county){
                    params = {
                        ToKen: this.token,
                        PhoneNumber: this.phonenumber,
                        county:county
                    };
                }else {
                    params = {
                        ToKen: this.token,
                        PhoneNumber: this.phonenumber
                    };
                }
                return this.$http.get(this.serverIP + '/headerpriview/previewgetdrugposinfobyinstitu', {
                    params: params
                }).then((res) => {
                    if (!res.data.errno) {
                        this.handlecommon(res.data.data.ressignposdata);
                        this.handlecommon(res.data.data.resrealposdata)
                    } else {
                        console.log(res.data.errno)
                    }
                    return Promise.resolve(res.data.data);
                }).catch((err) => {
                    console.log(err)
                })
            },
            getPreviewdrugdatagetData(county, station, villages) {
                let _this = this;
                let params = {
                    ToKen: this.token,
                    PhoneNumber: this.phonenumber
                };

                if (county) {
                    params.county = county
                }
                if (station) {
                    params.station = station
                }
                if (villages) {
                    params.station = villages
                }
                this.$http.get(this.serverIP + '/headerpriview/previewdrugdataget', {
                    params: params
                }).then((res) => {
                    if (!res.data.errno) {
                        console.log(res);
                        this.tagetData = res.data.data
                    } else {
                        console.log(res.data.errno)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            getPreviewdrugitemtypeData(county, station, villages) {
                let _this = this
                let params = {
                    ToKen: this.token,
                    PhoneNumber: this.phonenumber
                };

                if (county) {
                    params.county = county
                }
                if (station) {
                    params.station = station
                }
                if (villages) {

                    params.station = villages
                }

                this.$http.get(this.serverIP + '/headerpriview/previewdrugitemtype', {
                    params: params
                }).then((res) => {
                    if (!res.data.errno) {
                        console.log(res);
                        this.itemtypeData = res.data.data
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        components: {
            drugMap
        },
        watch:{
            showPerson(val){
                let _this=this;
                if(this.county) {
                    cluster.clearMarkers();
                    this.markers=[];
                    this.windows=[];
                    this.window='';
                    this.markerRefs=[];
                    this.storgedata=[];
                }
                if(val){
                    async function initmapdata() {
                        await _this.getPreviewgetdrugposinfobyinstituData(_this.county);
                        _this._setTimer(_this.county);
                    }
                    initmapdata()
                }else {
                    clearTimeout(this.timer)
                }
            }
        }
    };
</script>
<style lang="less">
    @import "./home.less";

    .red {
        color: rgb(239, 86, 86);
    }

    .mapContent {
        display: flex;
    }

    .mapContent .mapwrapleft {
        flex: 1;
    }

    .mapContent .mapslideright {
        width: 420px;
        flex: 0 0 420px;
    }

    .menu {
        width: 50%;
        margin: 25px auto;
        text-align: center;
        .el-button.is-round {
            border-radius: 45px;
            padding: 23px 30px;
            font-size: 18px;
        }
    }

    .white {
        color: #2b8ef5;
        padding: 5px;
    }

    .person-distribution {
        width: 100%;
    }

    table {
        width: 100%;
    }

    table td {
        border-right: 1px solid #2b8ef5;
        padding: 5px 10px;
    }

    table td:last-child {
        border-right: none;
    }

    .slidetable {
        background-color: transparent;
        color: #94c8fd;
    }

    .slidetable td {
        border-color: #001e3e;
        background: rgba(255, 255, 255, 0.1);
    }

    .menu button {
        background-color: #022c6d !important;
        height: 30px;
        padding: 0 5px;
    }

    .mapbtn {
        padding-top: 20px;
    }

    .mapbtn span {
        display: inline-block;
        color: #7f98b5;
        height: 40px;
        line-height: 36px;
        cursor: pointer;
        padding: 0 10px;
        box-shadow: 1px 4px 10px #fff;
        border-radius: 3px;
        background-color: #0c3158;
    }

    .mapbtn span:nth-child(1) {
        margin-right: 5px;
    }

    .mapbtn span:hover {
        opacity: 0.9;
    }

    .mapbtn span.active {
        /*background: url("/src/images/nav-bg-active.png") no-repeat;*/
        /*background-size: 100%;*/
        background-color: #012e5d;
        color: #fff;
        font-weight: bold;
        font-size: 14px;
    }

    .pcTitleWrap {
        width: 100%;
        display: flex;
        justify-content: space-around;
    }

    .person-count {
        padding-top: 30px;
    }

    .main .home-wrapper {
        /*background:url("/src/images/home-bg.jpg");*/
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .main-header {
        background: #2d5088;
    }

    .grid-content {
        min-height: 600px;
        padding: 8px;
        /*background:url("/src/images/box-bg.png");*/
        /*background-size: 100% 100%;*/
        /*background-repeat: no-repeat;*/
    }

    /*  .main .single-page-con .single-page{
         margin: 0;
     } */
    /* .main .single-page-con{
        top: 35px;
    } */
    .fd-titleBig-g.white {
        color: #fff;
        font-size: 14px;
        font-weight: bold;
    }

    .white.title.fd-title {
        display: inline-block;
        padding: 0 38px;
        margin: 4px 0;
        color: #cfdae8;
        /*background: url("/src/images/title-bg.jpg");*/
        /*background-size: 100%;*/
    }

    .table-2 tr td {
        width: 50%;
    }
</style>