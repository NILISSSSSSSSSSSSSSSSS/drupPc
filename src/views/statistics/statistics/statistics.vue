<template>
    <div style="margin:10px">
        <div class="basicMes">
            <h2 class="assignTitle">统计</h2>
            <div class="topMapWrap">
                <div class="mapMian" id="mapMian" style="height: 500px;overflow: scroll">
                    <!--<div id="defaultMap" style="height:400px">-->

                    <!--</div>-->
                </div>
                <div class="mapSlide">
                    <ul class="slideList">
                        <li><a href="javascript:"
                               @click="drawDefaultMap('各市县总人数','statisticstotalman',0,'del','health',itemarrs[0])"
                               :class="{active:index === 0}">各市县总人数</a></li>
                        <li><a href="javascript:"
                               @click="drawDefaultMap('托管失控人数','statisticsuncontrolman',1,'reportnum','urinenum',itemarrs[1])"
                               :class="{active:index === 1}">托管失控人数</a></li>
                        <li><a href="javascript:" :class="{active:index === 2}"
                               @click="drawDefaultMap('谈话尿检工作量','statisticstalkandurine',2,'talknum','urinenum',itemarrs[2])">谈话尿检工作量</a></li>
                        <li><a href="javascript:" @click="drawDefaultMap1('statisticsstationsort',3,'工作排名',itemarrs[3])"
                               :class="{active:index === 3}">工作排名</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie'
    import echarts from 'echarts';

    export default {
        name: 'statistics',
        data() {
            return {
                defaultMapData: [],//
                index: 0,
                xdata: ['德昌县', '会理县', '冕宁县', '木里县', '普格县', '西昌市',
                    '喜德县', '盐源县', '金阳县', '雷波县', '美姑县', '布拖县',
                    '甘洛县', '会东县', '宁南县', '越西县', '昭觉县'],//17个县市x轴
                itemarrs: [
                    ['社区康复总人数', '社区戒毒总人数'],
                    ['逾期未报到人数', '逾期未尿检人数'],
                    ['谈话次数', '尿检次数'],
                    ['工作完成总人数']
                ],//查询的目标
                dom: null,
                rankXdata: [],
                talknums: {},
                urinenums: {},
                tatols: {},
            }
        },
        mounted() {
            this.token = Cookies.get('myToken');
            this.phonenumber = Cookies.get('myPhoneNum');
            this.getRankXdata();
            this.drawDefaultMap('各市县总人数', 'statisticstotalman', 0, 'del', 'health', this.itemarrs[0])
        },
        methods: {
//            获取排名的x轴;
            getRankXdata() {
                let arr = new Array(15);
                for (let i = 0; i < arr.length; i++) {
                    let index = i + 1;
                    arr[i] = '第' + index + '名';
                }
                this.rankXdata = arr;
                console.log(arr)
            },
//            dom操作
            _handleDom(ht) {
                let height = ht || '400px';
                let odlodom = document.getElementById('defaultMap');
                if (odlodom) odlodom.parentNode.removeChild(odlodom);
                const pdom = document.getElementById('mapMian');
                const dom = document.createElement('div');
                dom.id = 'defaultMap';
                dom.style.height = height;
                this.dom = dom;
                pdom.appendChild(dom);
            },
//          获取数据
            _getmapdata(name) {
                let params = {
                    ToKen: this.token,
                    PhoneNumber: this.phonenumber
                };
                let actionname = name || 'statisticstotalman';
                return this.$http.get(this.serverIP + '/drugusercomplexdetails/' + actionname, {
                    params: params
                }).then((res) => {
                    console.log(res);
                    if (!res.data.errno) {
                        this.$message({
                            message: '数据获取成功',
                            type: 'success'
                        });
                        return Promise.resolve(res.data.data)
                    } else {
                        this.$message({
                            message: '数据获取失败',
                            type: 'warning'
                        });
                        return Promise.reject(res.data.errno);
                    }
                })
            },
//            切换option数据
            drawmapcommon(titlename, itemarr, Ydata, Ydata1) {
                let _this = this;
                this._handleDom();
                const defaultEcharts = echarts.init(_this.dom);
                const option = {
                    title: {
                        show: true,
                        text: titlename,
                        x: 'center',
                        y: '5px',
                        textStyle: {
                            verticalAlign: 'middle'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: function (params) {
                            console.log(params);
                            let param1 = params[0];
                            let param2 = params[1];
                            let total = param1.data[1] + param2.data[1];
                            return `<p>${param1.axisValue}</p>
                                     <p><span style="display:inline-block;border-radius:10px;
                                     width: 10px;height: 10px;background-color: #19be6b!important;}"></span> ${param1.seriesName}:${param1.data[1]}人</p>
                                     <p><span  style="display:inline-block;border-radius:10px;
                                     width: 10px;height: 10px;background-color: #95ccd9!important;}"></span> ${param1.seriesName}:${param2.data[1]}人</p>
                                     <p><span  style="display:inline-block;border-radius:10px;
                                     width: 10px;height: 10px;background-color: #52a3f5!important;}"></span> 总人数:${total}人</p>
                                        `
                        }
                    },
                    legend: {
                        data: itemarr,
                        top: '35px'
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        right: '20px',
                        top: 'center',
                        feature: {
                            dataView: {readOnly: false},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
//                    grid: {
//                        left: '3%',
//                        right: '4%',
//                        bottom: '3%',
//                        containLabel: true
//                    },
                    grid: { // 控制图的大小，调整下面这些值就可以，
                        y2: 80,// y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisLabel: {
                                interval: 0,
                                rotate: 45,
                            },
                            data: _this.xdata
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: itemarr[0],
                            type: 'bar',
                            stack: '总人数',
                            barWidth: 35,
                            data: Ydata,
                            label: {
                                normal: {
                                    show: true,
                                }
                            },
                            itemStyle: {
                                color: "#33cc70"
                            }
                        },
                        {
                            name: itemarr[1],
                            type: 'bar',
                            stack: '总人数',
                            barWidth: 35,
                            label: {
                                normal: {
                                    show: true,
                                }
                            },
                            itemStyle: {
                                color: "#95ccd9"
                            },
                            data: Ydata1
                        }
                    ]
                };
                defaultEcharts.setOption(option);
//                console.log(defaultEcharts.getDataURL("png"))

            },
//            切换不同的地图 执行函数
            drawDefaultMap(titlename, actionName, index, key1, key2, itemarr) {
                this.index = index;
                this._getmapdata(actionName).then((res) => {
                    if (res !== 0) {
                        this.defaultMapData = res;
                        const BASIC_STANCE = 0.04762;
                        const Ydata = [];
                        const Ydata1 = [];
                        res.forEach((item, indx) => {
                            let itemindex = this.xdata.indexOf(item.county);
                            if (itemindex !== -1) {
                                let itemdata = [itemindex, item[key1]];
                                let itemdata1 = [itemindex, item[key2]];
                                Ydata.push(itemdata);
                                Ydata1.push(itemdata1);
                                this.tatols[itemindex] = item.total
                            }
                        });
                        this.drawmapcommon(titlename, itemarr, Ydata, Ydata1)
                    }
                });

            },
            drawDefaultMap1(actionname, index, titlename, itemarr) {
                let _this = this;
                this._handleDom('900px');
                this.index = index;
                this._getmapdata(actionname).then((res) => {
                    let rankdata = res.slice(0, 15);
                    let xdata = [];
                    let ydata = [];
                    const defaultEcharts = echarts.init(_this.dom);
                    rankdata.forEach((item, index) => {
                        _this.talknums[item.station] = item.talknum;
                        _this.urinenums[item.station] = item.urinenum;
                        if (item.station) xdata.push(item.station);
//                        if(item.tatol) {
                        ydata.unshift({
                            name: item.station,
                            value: item.tatol,
                        })
//                        }
                    });
                    const option = {
                        title: {
                            show: true,
                            text: titlename,
                            x: 'center',
                            y: '5px',
                            textStyle: {
                                verticalAlign: 'middle'
                            }
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            },
                            formatter: function (params) {
                                let param = params[0];

                                return `<p>${param.axisValue} ${param.data.name}</p>
                                         <p><span style="display:inline-block;border-radius:10px;
                                     width: 10px;height: 10px;background-color: #19be6b!important;}"></span>${param.seriesName}:${param.data.value}人</p>
                                         <p><span style="display:inline-block;border-radius:10px;
                                     width: 10px;height: 10px;background-color: #2c5aa1!important;}"></span>谈话人数:${_this.talknums[param.data.name]}人</p>
                                         <p><span  style="display:inline-block;border-radius:10px;
                                     width: 10px;height: 10px;background-color: #52a3f5!important;}"></span>尿检人数:${_this.urinenums[param.data.name]}人</p>
                                        `
                            }
                        },
                        legend: {
                            data: itemarr,
                            top: '35px'
                        },
                        toolbox: {
                            show: true,
                            orient: 'vertical',
                            right: '20px',
                            top: 'center',
                            feature: {
                                dataView: {readOnly: false},
                                restore: {},
                                saveAsImage: {}
                            }
                        },
//                    grid: {
//                        left: '3%',
//                        right: '4%',
//                        bottom: '3%',
//                        containLabel: true
//                    },
                        grid: { // 控制图的大小，调整下面这些值就可以，
                            y2: 80,// y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
                        },
                        xAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        yAxis: [
                            {
                                type: 'category',
                                axisLabel: {
                                    interval: 0,
//                                    rotate: 45,
                                },
                                data: _this.rankXdata.reverse()
                            }
                        ],
                        series: [
                            {
                                name: itemarr[0],
                                type: 'bar',
//                                stack: '总人数',
                                barWidth: 35,
                                data: ydata,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'insideLeft',
                                        color: '#fff',
                                        backgroundColor: 'rgba(0,0,0,.5)',
                                        distance: 50,
                                        formatter: function (params) {
//                                            console.log(params);
                                            return params.data.value ? `${params.data.name} 总人数 ${params.data.value}` : ''
                                        }
                                    }
                                },
                                itemStyle: {
                                    color: function (params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                            '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                            '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                        ];
                                        return colorList[params.dataIndex]
                                    }
                                }
                            }
                        ]
                    };
                    defaultEcharts.setOption(option);
                })
            }
        }

    };
</script>

<style scoped>
    li {
        list-style: none
    }

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

    .topMapWrap {
        min-height: 400px;
        display: flex;
        align-items: center;
        border: 1px solid #dcdcdc;
        background-color: rgb(255, 255, 255);
    }

    .topMapWrap .mapMian {
        flex: 1;
        overflow: hidden;
    }

    .topMapWrap .mapSlide {
        width: 120px;
        margin-right: 20px;
        text-align: center;
    }

    .topMapWrap .slideList a {
        display: block;
        height: 30px;
        border: 1px solid #dcdcdc;
        line-height: 30px;
        color: #000;
    }

    .topMapWrap .slideList a.active {
        color: #fff;
        background-color: #19be6b;
    }

    .topMapWrap .slideList a:hover {
        color: #fff;
        background-color: #19be6b;
    }
</style>
