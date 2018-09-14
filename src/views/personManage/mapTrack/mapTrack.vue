<template>
    <div>
        <h2 class="assignTitle">人员轨迹</h2>
        <div class="selectList">
            <div class="slTitle">地图筛选:</div>
            <RegionSelector :hide="hide" :fn="getmapdata" ref="trackSelect" :county="county" :station="station"></RegionSelector>
            <div style="color: #fff;line-height: 40px" v-show="this.Jurisdiction == 2||this.Jurisdiction==3">{{station}}</div>
            <!--<el-select v-model="selcectdata" :disabled="options.length === 1" clearable placeholder="请选择">-->
                <!--<el-option-->
                        <!--v-for="item in options"-->
                        <!--:key="item.value"-->
                        <!--:label="item.label"-->
                        <!--:value="item.value">-->
                <!--</el-option>-->
            <!--</el-select>-->
        </div>

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
</template>
<script>
    import drugMap from '@/views/drugMap'
    import Cookies from 'js-cookie'
    import RegionSelector from '../../TrackSelect/RegionSelector'
    var  cluster;
    export default {
        name: "mapTrack",
        data() {
            let _this = this;
            return {
                hide:{
                    county:false,
                    station:false,
                    village:false,
                },
                plugin: [],
                zoom: 5,
                center: [103.838224, 36.067702],
                markers: [],
                markerRefs: [],
                windows: [],
                window: '',
                events: {
                    init(o) {
                        async function initClusterer() {
                            await _this.getmapdata();
                            _this._setTimer();
                            cluster = new AMap.MarkerClusterer(o, _this.markerRefs, {
                                gridSize: 60,
                                maxZoom:17,
                                renderCluserMarker: _this._renderCluserMarker
                            });
                        }
                        initClusterer();
                    }
                },
                options:
                    [
                        {
                            value: '全州',
                            label: '全州'
                        },
                        {
                            value: '县市',
                            label: '县市'
                        },
                        {
                            value: '工作站',
                            label: '工作站'
                        }
                    ],
                selcectdata: '',
                storgedata: [],
                ckechedObj:{},
                county:'',
                station:'',
                ma:'',
                mb:'',
                mc:'',
                Jurisdiction:''
            }
        },
        components:{
            RegionSelector
        },
        destroyed() {
            clearTimeout(this.timer)
        },
        created() {
            this.token = Cookies.get('myToken');
            this.phonenumber = Cookies.get('myPhoneNum');
            let Jurisdiction = Cookies.get('Jurisdiction');
            if (Jurisdiction == 1) {
               this.hide={
                   county:true,
                   station:false,
                   village:false,
               };
                this.station = Cookies.get('myStation');
                this.county = Cookies.get('myCounty');
            } else if (Jurisdiction == 'ADMIN') {
                this.hide={
                    county:false,
                    station:false,
                    village:false,
                }
            } else {
                this.hide={
                    county:true,
                    station:true,
                    village:true,
                };
                this.station = Cookies.get('myStation');
                this.county = Cookies.get('myCounty');
            }
            this.Jurisdiction=Jurisdiction;
            this.getmapdata();
        },
        methods: {
            _setTimer(paramobj) {
                let _this = this;
                if(_this.timer) clearTimeout(_this.timer);
                var startTime = new Date().getTime();
                var count = 0;
                let waiteTime=30000;
                function fixed() {
                    _this.getmapdata(paramobj);
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
            //获取数据
            _getdata(actionname, paramobj) {
                let _this = this;
                if(paramobj){
                    cluster.clearMarkers();
                    this.markers=[];
                    this.windows=[];
                    this.window='';
                    this.markerRefs=[];
                    this.storgedata=[];
                    clearTimeout(_this.timer);
                }
                let params = Object.assign({}, paramobj, {
                    ToKen: _this.token,
                    PhoneNumber: _this.phonenumber
                });
                return this.$http.get(this.serverIP + '/drugusercomplexdetails/' + actionname, {
                    params: params
                }).then((res) => {
                    console.log(res);
                    if (!res.data.errno) {
                        return Promise.resolve(res.data.data)
                    } else {
                        this.$notify({
                            title: '数据获取失败',
                            message: res.data.errmsg,
                            type: 'warning',
                            duration: 3000
                        });
                        return Promise.reject(res.data.errno);
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
            //            添加标志公用部分
            handlecommon(cposdata) {
                let _this = this;
                cposdata.forEach((item, index) => {
                    if (this.storgedata.indexOf(item.Card_Id) !== -1) {
                        this.markers.forEach((markitem, ky) => {
                            if (markitem.Card_Id === item.Card_Id) {
                                if (item.longtitude && item.lattitude&&item.longtitude !== '未允许定位') {
                                    console.log(item);
                                    let address=item.address ? `${item.address}(${item.longtitude},${item.lattitude})` : '无记录';
                                    this.markers[ky].position = [item.longtitude, item.lattitude];
                                    this.windows[ky].content =  `<div class="prompt" style="padding: 5px;display:flex">
                                                            <div style="flex:1;">
                                                               <p style="line-height:30px">身份证：${item.Card_Id}</p>
                                                               <p style="line-height:30px">名字：${item.Name}</p>
                                                               <p style="line-height:30px">定位地址：${address}</p>
                                                               <p style="line-height:30px">工作站：${item.station}</p>
                                                            </div>
                                                            <div style="flex:0 0 80px;display:flex;align-items: center ">
                                                                <img width="80" height="80"  style="margin-left: 10px;margin-bottom: 5px" src="${item.headPhoto}" alt="">
                                                            </div>
                                                        </div>`
                                }
                            }
                        })
                    } else {
                        if (item.longtitude && item.lattitude&&item.longtitude !== '未允许定位') {
                            this.storgedata.push(item.Card_Id);
                            let dqpos = [item.longtitude, item.lattitude];
                            let ind = this.storgedata.indexOf(item.Card_Id);
                            let address=item.address ? `${item.address}(${item.longtitude},${item.lattitude})` : '无记录';
//                            let drugcurpos =
//                                {
//                                    Card_Id:res[i].Coordinatelogs.Card_Id,//身份证
//                                    address:res[i].Coordinatelogs.address,//定位地址
//                                    longtitude:res[i].Coordinatelogs.longtitude,//经度
//                                    lattitude:res[i].Coordinatelogs.lattitude,//纬度
//                                    Name:res[i].Name,//名字
//                                    headPhoto:res[i].DrugUserInfo.HeadImageUrl,//头像
//                                    station:res[i].station//工作站
//                                };
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
                            this.windows.push({
                                Card_Id: item.Card_Id,
                                position: dqpos,
                                content:  `<div class="prompt" style="padding: 5px;display:flex">
                                                            <div style="flex:1;">
                                                               <p style="line-height:30px">身份证：${item.Card_Id}</p>
                                                               <p style="line-height:30px">名字：${item.Name}</p>
                                                               <p style="line-height:30px">定位地址：${address}</p>
                                                               <p style="line-height:30px">工作站：${item.station}</p>
                                                            </div>
                                                            <div style="flex:0 0 80px;display:flex;align-items: center ">
                                                                <img width="80" height="80"  style="margin-left: 10px;margin-bottom: 5px" src="${item.headPhoto}" alt="">
                                                            </div>
                                                        </div>`,
                                visible: false
                            });
                        }
                    }

                    console.log(this.markers)
                });
            },
            getmapdata(selcetdata) {
                this._getdata('statisticstotalmanlocus', selcetdata).then((res) => {
                    if(selcetdata) this._setTimer(selcetdata);
                    let data =
                        [
                            {
                        "Card_Id": "542427199606095527",
                        "longtitude": "104.055794",
                        "lattitude": "30.538646",
                        "Name": "王二",
                        "headPhoto": "https://xcgk20180320-1256236574.cos.ap-chengdu.myqcloud.com/pic/cn_jj_cn_jj_mobile_lobby_view_Main.png",
                        "address:": '凉山',
                        "station": '凉山工作站'
                    },
                        {
                            "Card_Id": "552427199606095527",
                            "longtitude": "104.155794",
                            "lattitude": "30.738646",
                            "Name": "王二",
                            "headPhoto": "https://xcgk20180320-1256236574.cos.ap-chengdu.myqcloud.com/pic/cn_jj_cn_jj_mobile_lobby_view_Main.png",
                            "address:": '凉山',
                            "station": '凉山工作站'
                        },
                        {
                            "Card_Id": "562427199606095527",
                            "longtitude": "104.255794",
                            "lattitude": "30.838646",
                            "Name": "王二",
                            "headPhoto": "https://xcgk20180320-1256236574.cos.ap-chengdu.myqcloud.com/pic/cn_jj_cn_jj_mobile_lobby_view_Main.png",
                            "address:": '凉山',
                            "station": '凉山工作站'
                        }
                    ];
                    this.handlecommon(res)
                })
            },
            _renderCluserMarker(context) {
                context.marker.setContent(`<div style="width: 10px;height: 10px;border-radius: 10px;background-color: #00c2ff"></div>`)
            },
        },
        watch: {
            selcectdata(val) {
                let parms={};
                switch (val) {
                    case '全州':
                        parms.county ='';
                        break;
                    case '县市':
                        parms.county = val;
                        break;
                    case '工作站':
                        parms.station  = val;
                        break
                }
                console.log(parms);
                this.getmapdata(parms)
            }
        }
    }
</script>
<style scoped>
    .assignTitle {
        height: 30px;
        line-height: 30px;
        margin: 30px 0 20px;
        font-size: 16px;
        color: #fff;
        font-weight: normal;
        border-left: 3px solid #096dd5;
        padding-left: 12px;
    }

    .selectList {
        display: flex;
        justify-content: center;
        padding-bottom: 20px;
    }

    .selectList .slTitle {
        color: #fff;
        line-height: 40px;
        font-size: 16px;
        padding-right: 10px;
    }
</style>


