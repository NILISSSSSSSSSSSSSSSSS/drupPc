<template>
    <div style="position: relative" class="mapWrap" id="mapWrap">
        <div id="mapContainer" ref="mapContainer"></div>
        <div id="mapContainer1" ref="mapContainer1"></div>
        <div class="mapslide slide01">
            <i class="rotate1" :style="slide01"></i>
            <p :style="titlebg">工作站总数</p>
            <span>{{stationNub}}个</span>
        </div>
        <div class="mapslide slide02">
            <i class="rotate2" :style="slide02"></i>
            <p :style="titlebg">工作人员总数</p>
            <span>{{allstationmamNub}}个</span>
        </div>
        <div id="back" ref="back" v-show="backShow" @click="backall">返回</div>
    </div>
</template>

<script>
    import echarts from 'echarts';
    import Cookies from 'js-cookie'

    export default {
        data() {
            return {
                token: '',
                phonenumber: '',
                stationdata: '',
                contentobj: {},
                resStr: '查询中！',
                tagetData: null,
                stationNub: 0,
                allstationmamNub: 0,
                offtop: 600,
                mapContainer1: null,
                Jurisdiction: '',
                backShow: false,
                titlebg: {
                    backgroundImage: "url(" + require("../../images/title-bg.jpg") + ")",
                    backgroundSize: '100%',
                },
                slide02: {
                    backgroundImage: "url(" + require("../../images/slide02.jpg") + ")",
                    backgroundSize: '100%',
                },
                slide01: {
                    backgroundImage: "url(" + require("../../images/slide01.jpg") + ")",
                    backgroundSize: '100%',
                }

            }
        },
        mounted() {
            let offtop = window.innerHeight - 185;
            if (offtop < 600) offtop = 600;
            this.offtop = offtop;
            this.$refs.mapContainer.style.height = offtop + 'px';
            this.$refs.mapContainer1.style.height = offtop + 'px';
            this.token = Cookies.get('myToken');
            this.phonenumber = Cookies.get('myPhoneNum');
            this.Jurisdiction = Cookies.get('Jurisdiction');
            this.getPreviewgetallstationData();
            this.getstateToallData()
        },
        methods: {
            _removeDom(dom) {
                while (dom.hasChildNodes()) {
                    dom.removeChild(dom.firstChild);
                }
            },
            _setstr(val, resdata) {

                window.gotoManage=function () {
                    window.location.hash = '#/statistics/statistics'
                };
                this.resStr = `<div onclick="gotoManage()" style="cursor: pointer">
                                <p>${val}信息统计</p>
                                <p><span style="display:inline-block;border-radius:10px;
                                   width: 10px;height: 10px;background-color: #19be6b!important;}"></span> 工作人员数量: ${resdata.workernum}人</p>
                                <p><span style="display:inline-block;border-radius:10px;
                                    width: 10px;height: 10px;background-color: #eb5137!important;}"></span> 吸毒人员数量: ${resdata.drugnum}人</p>
                                <p><span style="display:inline-block;border-radius:10px;
                                    width: 10px;height: 10px;background-color: #52a3f5!important;}"></span> 工作站数量: ${resdata.stationnum}个</p>
                                 <p><span style="display:inline-block;border-radius:10px;
                                    width: 10px;height: 10px;background-color: #0051cb!important;}"></span> 乡镇数量: ${resdata.villagesnum}个</p>
                                </div>
                                                                    `;
            },
            getstateToallData(contry) {
                let _this=this;
                let params;
                if (contry) {
                    params = {
                        ToKen: this.token,
                        PhoneNumber: this.phonenumber,
                        county: contry
                    }
                } else {
                    params = {
                        ToKen: this.token,
                        PhoneNumber: this.phonenumber
                    };
                }
                this.$http.get(this.serverIP + '/headerpriview/previewgetinstituroleinfo', {
                    params: params
                }).then((res) => {
                    console.log(res);
                    if (!res.data.errno) {
                        this.allstationmamNub = res.data.data.workernum;
                        this.stationNub = res.data.data.stationnum
                    } else {
                        this.$message({
                            message: res.data.errno,
                            type: 'warning'
                        });
                        console.log(res.data.errno)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            getPreviewgetallstationData() {
                let _this=this;
                let params = {
                    ToKen: this.token,
                    PhoneNumber: this.phonenumber
                };
                this.$http.get(this.serverIP + '/headerpriview/previewgetallstation', {
                    params: params
                }).then((res) => {
                    if (!res.data.errno) {
                        this.stationdata = res.data.data;
                        this.highmaps();
                        console.log(this.stationdata);
                    } else {
                        this.$message({
                            message: res.data.errno,
                            type: 'warning'
                        });
                        console.log(res.data.errno)
                    }
                }).catch((err) => {
                    this.$message.error(err);
                    console.log(err)
                })
            },
            highmaps() {
                let _this = this;
                this.map = echarts.init(document.getElementById('mapContainer'));
                _this.$refs.mapContainer1.style.display = 'none';
                this.map.showLoading();
                this.$http.get(this.serverIP + '/query/liangshan').then(geoJson => {
                        geoJson = geoJson.data;
                        console.log(geoJson);
                        var geoCoordMap = {
                            "德昌县": [102.17567, 27.402839],
                            "会理县": [102.249711, 26.692491],
                            "冕宁县": [102.058174, 28.486055],
                            "木里藏族自治县": [100.882345, 28.3171230292969],
                            "普格县": [102.538548, 27.455845],
                            "西昌市": [102.173784, 27.759815],
                            "喜德县": [102.456117, 28.116017],
                            "盐源县": [101.366579, 27.600977],
                            "金阳县": [103.255699, 27.751377],
                            "雷波县": [103.580154, 28.269715],
                            "美姑县": [103.140886, 28.337327],
                            "布拖县": [102.893304, 27.532385],
                            "甘洛县": [102.776872, 28.895581],
                            "会东县": [102.686762, 26.641599],
                            "宁南县": [102.707927, 27.136407],
                            "越西县": [102.601599, 28.506589],
                            "昭觉县": [102.846548, 28.001271],
                            "绿色家园": [102.746548, 28.101271]
                        };
                        var data =
                            [
                                {
                                    name: '德昌县',
                                    value: 199
                                },
                                {
                                    name: '会理县',
                                    value: 39
                                },
                                {
                                    name: '冕宁县',
                                    value: 152
                                },
                                {
                                    name: '木里藏族自治县',
                                    value: 299
                                },
                                {
                                    name: '普格县',
                                    value: 89
                                },
                                {
                                    name: '西昌市',
                                    value: 52
                                },
                                {
                                    name: '喜德县',
                                    value: 9
                                },
                                {
                                    name: '盐源县',
                                    value: 352
                                },
                                {
                                    name: '金阳县',
                                    value: 99
                                },
                                {
                                    name: '雷波县',
                                    value: 39
                                },
                                {
                                    name: '美姑县',
                                    value: 480
                                },
                                {
                                    name: '布拖县',
                                    value: 99
                                },
                                {
                                    name: '甘洛县',
                                    value: 225
                                },
                                {
                                    name: '会东县',
                                    value: 66
                                },
                                {
                                    name: '宁南县',
                                    value: 79
                                },
                                {
                                    name: '越西县',
                                    value: 250
                                },
                                {
                                    name: '昭觉县',
                                    value: 123
                                } ,
                                {
                                    name: '绿色家园',
                                    value: 123
                                }
                            ];
                        var data1=[];

                        function normornizeConvertData() {
                            let stationdata = _this.stationdata;
                            var res = [];
                            var countydata={};
                            var storgestation=[];
                            for (var i = 0; i < stationdata.length; i++) {
                                if(!countydata.hasOwnProperty(stationdata[i].county)){
                                    let arr=[];
                                    arr.push(stationdata[i].station);
                                    countydata[stationdata[i].county]=arr
                                }else {
                                    if(countydata[stationdata[i].county].indexOf(stationdata[i].station) === -1){
                                        countydata[stationdata[i].county].push(stationdata[i].station)
                                    }
                                }

                                var ssvdata = [stationdata[i].county, stationdata[i].station, stationdata[i].villages];
                                if(storgestation.indexOf(stationdata[i].station) === -1){
                                    res.push({
                                        name: stationdata[i].id,
                                        value: [stationdata[i].longtitude, stationdata[i].lattitude, ssvdata],
                                    });
                                    storgestation.push(stationdata[i].station)
                                }
                            }
                            return [res,countydata];
                        }

                        const stationdata = normornizeConvertData()[0];
                        const cdata = normornizeConvertData()[1];
                        function getMapCenterData() {
                            let res = [];
                            data.forEach((item) => {
                                if (cdata[item.name]) {
                                    res.push({
                                        name: item.name,
                                        value: [...geoCoordMap[item.name], [item.name,cdata[item.name].length]]
                                    })
                                }
                            });
                            return res
                        }

                        const MapCenterData = getMapCenterData();

                        var max = 400,
                            min = 9; // todo
                        var maxSize4Pin = 55,
                            minSize4Pin = 25;
                        if (_this.Jurisdiction === 'ADMIN') {
                            setbigMap();
                            function setbigMap() {
                                echarts.registerMap('liangshan', geoJson);
                                _this.map.hideLoading();
                                _this.map.setOption(
                                    {
                                        title: {
                                            text: '凉山州社区康复工作站分布图',
                                            x: 'center',
                                            textStyle: {
                                                color: '#2b8ef5',
                                                fontWeight: 'normal'
                                            },
                                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                                            shadowBlur: 10,
                                        },
                                        tooltip: {
                                            trigger: 'item',
                                            position: function (point, params, dom, rect, size) {
                                                let x = rect.x + rect.width / 2;
                                                let y = rect.y + rect.height / 2;
                                                return [x, y];
                                            },
                                            enterable: true,
                                            formatter: function (params, ticket, callback) {
                                                console.log(params);
                                                _this.resStr = '查询中';
                                                const param = {
                                                    ToKen: _this.token,
                                                    PhoneNumber: _this.phonenumber,
                                                    county: params.data.value[2][0],
                                                };
//
                                                if (!_this.contentobj.hasOwnProperty(params.data.name)) {
                                                    _this.$http.get(_this.serverIP + '/headerpriview/previewgetinstituroleinfo', {
                                                        params: param
                                                    }).then((res) => {
                                                        if (!res.data.errno) {
                                                            console.log(res.data.data);
                                                            let resdata = res.data.data;
                                                            _this.contentobj[params.data.name] = resdata;
                                                            _this._setstr(params.data.value[2][0],resdata);
                                                            callback(ticket, _this.resStr);
                                                        }
                                                    })
                                                } else {
                                                    _this._setstr(params.data.value[2][0],_this.contentobj[params.data.name]);
                                                    callback(ticket, _this.resStr);
                                                }

                                                return _this.resStr
                                            }
                                        },
                                        visualMap: {
                                            show: false,
                                            min: 0,
                                            max: 400,
                                            left: 'left',
                                            top: 'bottom',
                                            text: ['高', '低'], // 文本，默认为数值文本
                                            calculable: true,
                                            seriesIndex: [1],
                                            inRange: {
                                                color: ['#0758bc', '#0732bc', '#07a0bc', '#e79300', '#07bc14', '#07bc8b', '#07bc5c', '#e7b900', '#e7c900',
                                                    '#07bc7e', '#1407bc', '#e76700', '#e73c00', '#4b07bc', '#00ffa2', '#ee4750', '#0e3264']
                                            }
                                        },
                                        geo: {
                                            show: true,
                                            map: 'liangshan',
                                            label: {
                                                normal: {
                                                    show: true,
                                                    color: '#fff'
                                                },
                                                emphasis: {
                                                    show: true,
                                                    color: '#fff'
                                                }
                                            },
                                            roam: true,
                                            itemStyle: {
                                                normal: {
                                                    areaColor: '#1b609a',
                                                    shadowBlur: 15,
                                                    shadowColor: 'rgba(4, 22, 64, 0.3)'
                                                },
                                                emphasis: {
                                                    areaColor: '#52a3f5'
                                                }
                                            }
                                        },
                                        animation: false,
//                                    aspectScale: 2, //长宽比
                                        series:
                                            [
                                                {
                                                    name: '工作站个数1',
                                                    type: 'scatter',
                                                    coordinateSystem: 'geo',
                                                    data: MapCenterData,
                                                    label: {
                                                        normal: {
                                                            formatter: function (params) {
                                                                return params.data.value[2][1]
                                                            },
                                                            position: 'center',
                                                            show: true,
                                                            color:"#fff"
                                                        },
                                                        emphasis: {
                                                            show: false
                                                        }
                                                    },
                                                    animation: false,
                                                    rippleEffect: {
                                                        brushType: 'stroke'
                                                    },
                                                    symbolSize: 30,
                                                    symbol: 'pin'

                                                },
                                                {
                                                    type: 'map',
                                                    map: 'liangshan',
                                                    geoIndex: 0,
                                                    showLegendSymbol: false, // 存在legend时显示
                                                    tooltip: {
                                                        show: false,
                                                        formatter: function (params) {
                                                            console.log(params)
                                                        }
                                                    },
                                                    label: {
                                                        normal: {
                                                            show: true,
                                                            color: '#fff'
                                                        },
                                                        emphasis: {
                                                            show: true,
                                                            textStyle: {
                                                                color: '#fff'
                                                            }
                                                        }
                                                    },
                                                    roam: true,
                                                    itemStyle: {
                                                        normal: {
                                                            areaColor: '#031525',
                                                            borderColor: '#3B5077',
                                                            color: '#fff'
                                                        },
                                                        emphasis: {
                                                            areaColor: '#2B91B7'
                                                        }
                                                    },
                                                    animation: false,
                                                    data: data

                                                },
                                                {
                                                    name: '工作站个数',
                                                    type: 'effectScatter',
                                                    coordinateSystem: 'geo',
                                                    data: MapCenterData,
                                                    label: {
                                                        normal: {
                                                            formatter: function (params) {
                                                                return params.data.value[2][1]
                                                            },
                                                            position: 'center',
                                                            show: false,
                                                            color:"red"
                                                        },
                                                        emphasis: {
                                                            show: false
                                                        }
                                                    },
                                                    itemStyle: {
                                                        normal: {
                                                            color: '#68EBE1'
                                                        }
                                                    },
                                                    animation: false,
                                                    rippleEffect: {
                                                        brushType: 'stroke'
                                                    },
                                                    symbolSize: 12,
//                                                    symbol: 'image://'+water

                                                },
                                            ]
                                    }
                                );
                            }

                            _this.map.on('click', (res) => {
                                if (res.componentSubType === 'map') {
                                    //                            删除旧的节点
                                    let odlodom = document.getElementsByClassName('mapContainer1')[0];
                                    if (odlodom) odlodom.parentNode.removeChild(odlodom);
//                            创建新的县市级地图节点
                                    let dom = document.createElement('div');
                                    dom.className = 'mapContainer1';
                                    dom.style.height = _this.offtop + 'px';
                                    _this.mapContainer1 = dom;
                                    let targetElement = _this.$refs.mapContainer;
                                    let parent = targetElement.parentNode;
//                            在大地图后面插入小地图的元素
                                    parent.insertBefore(dom, targetElement.nextSibling);
                                    let echarts1 = echarts.init(dom);
                                    _this.$refs.mapContainer.style.display = 'none';
                                    let name = res.data.name;
                                    console.log(name)
                                    _this.getstateToallData(name);
                                    let geoJsonarr = geoJson.features.filter((item) => {
                                        return item.properties.name === name;
                                    });
                                    const childdata = [];
//                                    if (name == '木里藏族自治县') name = '木里县';
                                    stationdata.forEach((item) => {
                                        if (item.value[2][0] === name) {
                                            childdata.push(item)
                                        }
                                    });
                                    _this.$emit('getPreview', name);
                                    console.log(childdata);
                                    echarts.registerMap(name, {
                                        type: 'MultiPolygon',
                                        features: geoJsonarr
                                    });
                                    echarts1.setOption({
                                        title: {
                                            text: name + '社区康复工作站分布图',
                                            subtext: '',
                                            x: 'center',
                                            textStyle: {
                                                color: '#fff',
                                                fontWeight: 'normal'
                                            },
                                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                                            shadowBlur: 10
                                        },
                                        tooltip: {
                                            trigger: 'item',
                                            position: function (point, params, dom, rect, size) {
                                                let x = rect.x + rect.width / 2;
                                                let y = rect.y + rect.height / 2;
                                                return [x, y];
                                            },
                                            enterable: true,
                                            formatter: function (params, ticket, callback) {
                                                _this.resStr = '查询中';
                                                const param = {
                                                    ToKen: _this.token,
                                                    PhoneNumber: _this.phonenumber,
                                                    county: params.data.value[2][0],
                                                    station: params.data.value[2][1],
                                                    villages: params.data.value[2][2]
                                                };
                                                let para = JSON.stringify(
                                                    {
                                                        county: params.data.value[2][0],
                                                        station: params.data.value[2][1],
                                                        villages: params.data.value[2][2]
                                                    });

                                                if (_this.contentobj.hasOwnProperty(params.data.name)) {
                                                    _this._setstr(params.data.value[2][1],_this.contentobj[params.data.name]);
                                                    callback(ticket, _this.resStr);
                                                } else {
                                                    _this.$http.get(_this.serverIP + '/headerpriview/previewgetinstituroleinfo', {
                                                        params: param
                                                    }).then((res) => {
                                                        if (!res.data.errno) {
                                                            console.log(res.data.data);
                                                            let resdata = res.data.data;
                                                            _this.contentobj[params.data.name] = resdata;
                                                            _this._setstr(params.data.value[2][1],resdata);
                                                            callback(ticket, _this.resStr);
                                                        }
                                                    })

                                                }
                                                return _this.resStr
                                            }
                                        },
//                                    legend: {
//                                        orient: 'vertical',
//                                        x: 'right',
//                                        y: 'center',
//                                        data: ['工作站个数'],
//                                        textStyle: {
//                                            color: '#e8eb00'
//                                        }
//                                    },
                                        visualMap: {
                                            show: false,
                                            min: 0,
                                            max: 400,
                                            left: 'left',
                                            top: 'bottom',
                                            text: ['高', '低'], // 文本，默认为数值文本
                                            calculable: true,
                                            seriesIndex: [1],
                                            inRange: {
                                                color: ['#498DF5']
                                            }
                                        },
                                        geo: {
                                            show: true,
                                            map: name,
                                            label: {
                                                normal: {
                                                    show: true,
                                                    color: '#fff'
                                                },
                                                emphasis: {
                                                    show: true,
                                                    color: '#fff'
                                                }
                                            },
                                            roam: true,
                                            itemStyle: {
                                                normal: {
                                                    areaColor: '#52a3f5',
                                                    shadowBlur: 15,
                                                    shadowColor: 'rgba(4, 22, 64, 0.3)'
                                                },
                                                emphasis: {
                                                    areaColor: '#52a3f5'
                                                }
                                            }
                                        },
                                        animation: false,
                                        series:
                                            [
                                                {
                                                    name: '工作站个数',
                                                    type: 'effectScatter',
                                                    coordinateSystem: 'geo',
                                                    data: childdata,
                                                    label: {
                                                        normal: {
                                                            formatter: function (params) {
                                                                return params.data.value[2][2]
                                                            },
                                                            position: 'right',

                                                            show: true
                                                        },
                                                        emphasis: {
                                                            show: true
                                                        }
                                                    },
                                                    itemStyle: {
                                                        normal: {
                                                            color: '#68EBE1'
                                                        }
                                                    },
                                                    animation: false
                                                },
                                                {
                                                    type: 'map',
                                                    map: 'liangshan',
                                                    geoIndex: 0,
//                                            aspectScale: 1, //长宽比
                                                    showLegendSymbol: false, // 存在legend时显示
                                                    tooltip: {
                                                        show: false
//                                                            formatter: function (params) {
//                                                                return params.name
//                                                            }
                                                    },
                                                    label: {
                                                        normal: {
                                                            show: false
                                                        },
                                                        emphasis: {
                                                            show: true,
                                                            textStyle: {
                                                                color: '#fff'
                                                            }
                                                        }
                                                    },
                                                    roam: true,
                                                    itemStyle: {
                                                        normal: {
                                                            areaColor: '#031525',
                                                            borderColor: '#3B5077'
                                                        },
                                                        emphasis: {
                                                            areaColor: '#2B91B7'
                                                        }
                                                    },
                                                    animation: false,
                                                    data: data.filter((item) => item.name === name)
                                                }
                                            ]
                                    });

                                    _this.backShow = true
                                }

                            });
                        } else {
                            let name = _this.stationdata[0].county;
                            let geoJsonarr = geoJson.features.filter((item) => {
                                return item.properties.name === name;
                            });
                            const childdata = [];
                            if (name == '木里藏族自治县') name = '木里县';
                            stationdata.forEach((item) => {
                                if (item.value[2][0] === name) {
                                    childdata.push(item)
                                }
                            });
                            _this.stationNub = childdata.length;
                            echarts.registerMap(name, {
                                type: 'MultiPolygon',
                                features: geoJsonarr
                            });
                            _this.map.hideLoading();
                            this.map.setOption({
                                title: {
                                    text: name + '社区康复工作站分布图',
                                    subtext: '',
                                    x: 'center',
                                    textStyle: {
                                        color: '#fff',
                                        fontWeight: 'normal'
                                    },
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                    shadowBlur: 10
                                },
                                tooltip: {
                                    trigger: 'item',
                                    position: function (point, params, dom, rect, size) {
                                        let x = rect.x + rect.width / 2;
                                        let y = rect.y + rect.height / 2;
                                        return [x, y];
                                    },
                                    enterable: true,
                                    formatter: function (params,ticket,callback) {
                                        _this.resStr = '查询中';
                                        const param = {
                                            ToKen: _this.token,
                                            PhoneNumber: _this.phonenumber,
                                            county: params.data.value[2][0],
                                            station: params.data.value[2][1],
                                            villages: params.data.value[2][2]
                                        };
                                        let para = JSON.stringify(
                                            {
                                                county: params.data.value[2][0],
                                                station: params.data.value[2][1],
                                                villages: params.data.value[2][2]
                                            });
                                        window.gotoManage = (item) => {
                                            let paramsstr = JSON.stringify(item);
                                            window.location.hash = `#/statistics/statistics?manageparam=${paramsstr}`
                                        };
                                        if (_this.contentobj.hasOwnProperty(params.data.name)) {
                                            _this._setstr(params.data.value[2][1],_this.contentobj[params.data.name]);
                                            callback(ticket, _this.resStr);
                                        } else {
                                            _this.$http.get(_this.serverIP + '/headerpriview/previewgetinstituroleinfo', {
                                                params: param
                                            }).then((res) => {
                                                if (!res.data.errno) {
                                                    console.log(res.data.data);
                                                    let resdata = res.data.data;
                                                    _this.contentobj[params.data.name] = resdata;
                                                    _this._setstr(params.data.value[2][1],resdata);
                                                    callback(ticket, _this.resStr);
                                                }
                                            })

                                        }
                                        return _this.resStr
                                    }
                                },
//                                    legend: {
//                                        orient: 'vertical',
//                                        x: 'right',
//                                        y: 'center',
//                                        data: ['工作站个数'],
//                                        textStyle: {
//                                            color: '#e8eb00'
//                                        }
//                                    },
                                visualMap: {
                                    show: false,
                                    min: 0,
                                    max: 400,
                                    left: 'left',
                                    top: 'bottom',
                                    text: ['高', '低'], // 文本，默认为数值文本
                                    calculable: true,
                                    seriesIndex: [1],
                                    inRange: {
                                        color: ['#498DF5']
                                    }
                                },
                                geo: {
                                    show: true,
                                    map: name,
                                    label: {
                                        normal: {
                                            show: true
                                        },
                                        emphasis: {
                                            show: true,
                                        }
                                    },
                                    roam: true,
                                    itemStyle: {
                                        normal: {
                                            areaColor: '#1b609a',
                                            shadowBlur: 15,
                                            shadowColor: 'rgba(4, 22, 64, 0.3)'
                                        },
                                        emphasis: {
                                            areaColor: '#52a3f5'
                                        }
                                    }
                                },
                                animation: false,
                                series:
                                    [
                                        {
                                            name: '工作站个数',
                                            type: 'effectScatter',
                                            coordinateSystem: 'geo',
                                            data: childdata,
                                            label: {
                                                normal: {
                                                    formatter: function (params) {
                                                        return params.data.value[2][2]
                                                    },
                                                    position: 'right',

                                                    show: true
                                                },
                                                emphasis: {
                                                    show: true
                                                }
                                            },
                                            itemStyle: {
                                                normal: {
                                                    color: '#68EBE1'
                                                }
                                            },
                                            animation: false
                                        },
                                        {
                                            type: 'map',
                                            map: 'liangshan',
                                            geoIndex: 0,
//                                            aspectScale: 1, //长宽比
                                            showLegendSymbol: false, // 存在legend时显示
                                            tooltip: {
                                                show: false,
                                                formatter: function (params) {
                                                    return params.name
                                                }
                                            },
                                            label: {
                                                normal: {
                                                    show: false
                                                },
                                                emphasis: {
                                                    show: true,
                                                    textStyle: {
                                                        color: '#fff'
                                                    }
                                                }
                                            },
                                            roam: true,
                                            itemStyle: {
                                                normal: {
                                                    areaColor: '#031525',
                                                    borderColor: '#3B5077'
                                                },
                                                emphasis: {
                                                    areaColor: '#2B91B7'
                                                }
                                            },
                                            animation: false,
                                            data: data.filter((item) => item.name === name)
                                        }
                                    ]
                            })
                        }
                    },
                    response => {
                        console.log(response);
                    });
            },
            backall() {
                this.getstateToallData();
                this.$emit('getPreview');
                this.mapContainer1.style.display = 'none';
                this.$refs.mapContainer.style.display = 'block';
                this.backShow = false
            },
        }
    }
</script>

<style>
    .mapWrap {
        min-height: 600px;
    }

    .mapslide {
        position: absolute;
        width: 150px;
        height: 150px;
    }

    .mapslide.slide01 {
        left: 10%;
        bottom: 4%;
    }

    .mapslide.slide02 {
        right: 9%;
        bottom: 4%;
        width: 120px;
        height: 120px;
    }

    .mapslide .rotate1 {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        /*background: url("/src/images/slide01.jpg") no-repeat;*/
        /*background-size: 100%;*/
        animation: rotate01 10s linear infinite;
    }

    .mapslide .rotate2 {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        /*background: url("/src/images/slide02.jpg") no-repeat;*/
        /*background-size: 100%;*/
        animation: rotate02 20s linear infinite;
    }

    /*旋转动画*/
    @keyframes rotate01 {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    /*旋转动画*/
    @keyframes rotate02 {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .mapslide p {
        font-size: 16px;
        color: #fff;
        text-align: center;
        /*background: url("/src/images/title-bg.jpg") no-repeat;*/
        /*background-size: 100% 100%;*/
    }

    .mapslide.slide01 p {
        margin-top: -22px;
    }

    .mapslide.slide02 p {
        margin-top: -10px;
        font-size: 14px;
    }

    .mapslide span {
        position: absolute;
        top: 50%;
        margin-top: -18px;
        width: 100%;
        text-align: center;
        color: #5c9ae2;
        font-size: 20px;
        font-weight: bold;
    }

    .mapslide.slide02 span {
        margin-top: -12px;
        font-size: 16px;
    }

    #back {
        position: absolute;
        left: 10%;
        top: 10%;
        width: 66px;
        height: 66px;
        background-color: #1d3e61;
        border-radius: 66px;
        line-height: 66px;
        text-align: center;
        color: #fff;
    }

    #back:hover {
        background-color: #0051cb;
    }
</style>
