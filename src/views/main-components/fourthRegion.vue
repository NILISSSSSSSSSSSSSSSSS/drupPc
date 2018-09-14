<template>
    <div class="index">

        <div class="page-content">
            <div>
                <select name="" id="" @change="getProvice" v-model="selectProvice">
                    <option :value="item" v-for="item in province" :key="item">{{item}}</option>
                </select>
                <select name="" id="" @change="getCity" v-model="selectCity">
                    <option :value="item" v-for="item in city" :key="item">{{item}}</option>
                </select>
                <select name="" id="" @change="getArea" v-model="selectArea">
                    <option :value="item" v-for="item in area" :key="item">{{item}}</option>
                </select>
                <select name="" id="" @change="getStreet" v-model="selectStreet">
                    <option :value="item" v-for="item in street" :key="item">{{item}}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
    // 导入数据
    import data from '../../assets/region/data.json'
    export default {
        name: 'index',
        data() {
        return {
            areaVisible: false,
            streetVisible: false,
            areaString: '请选择',
            streetString: '请选择',
            selectProviceIndex: 0,
            selectCityIndex: 0,
            selectProvice: '',
            selectCity: '',
            selectArea: '',
            selectStreet: '',
            selectAll:"",
            province: [],
            city: [],
            area: [],
            street: []

        }
    },
    methods: {
        handlerArea() {
            this.areaVisible = true
        },
        handlerStreet() {
            if (this.slotstree[0].values.length === 0) {
                this.streetString = '无可选街道'
                return
            }
            this.streetVisible = true
        },

        getProvice() {
            this.selectProviceIndex = this.province.indexOf(this.selectProvice);
            this.selectCityIndex = 0;
            this.selectCity = '';
            let i = this.province.indexOf(this.selectProvice)
            this.city = data[i].childs.map(res => {
                        return res.name
                    })
            console.log(this.city)
            this.area = data[i].childs[0].childs.map(res => {
                        return res.name
                    })
            this.street = data[i].childs[0].childs[0].childs.map(res => {
                        return res.name
                    })
        },
        getCity() {
            this.selectCityIndex = this.city.indexOf(this.selectCity);
            let i = this.city.indexOf(this.selectCity)
            console.log(i);
            this.area = data[this.selectProviceIndex].childs[i].childs.map(res => {
                        return res.name
                    })
            this.street = data[this.selectProviceIndex].childs[i].childs[0].childs.map(res => {
                        return res.name
                    })
        },
        getArea() {
            let i = this.area.indexOf(this.selectArea);
            this.street = data[this.selectProviceIndex].childs[this.selectCityIndex].childs[i].childs.map(res => {
                        return res.name
                    })
        },
        getStreet() {
            this.selectAll=this.selectProvice+"-"+this.selectCity+"-"+this.selectArea+"-"+this.selectStreet
            console.log("eee"+this.selectAll)
            //处理选择完最后一级的操作
        },
        onStreeChange(picker, values) {
            this.streetString = values.join(',')
        }
    },
    created() {
        this.province = data.map(res => {

        return res.name
    })
    // 初始化市
    this.city = data[0].childs.map(res => {
                return res.name
            })
    // 初始化区
    this.area = data[0].childs[0].childs.map(res => {
                return res.name
            })
    // 初始化街
    this.street = data[0].childs[0].childs[0].childs.map(res => {
                return res.name
            })
    }
    }
</script>
<style>
    .area-class {
        width: 100%;
        height: 50%;
    }
</style>
