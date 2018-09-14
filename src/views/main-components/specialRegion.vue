<template>
    <div class="specialRegion">
        <div class="page-content">
            <div>
                <select name="" @change="selectA" v-model="ma">
                    <option v-for="(item, index) in a" :key="index" :value="item">{{item}}</option>
                </select>
                <select name="" @change="selectB" v-model="mb">
                    <option v-for="(item, index) in b" :key="index" :value="item">{{item}}</option>
                </select>
                <select name="" @change="selectC" v-model="mc">
                    <option v-for="(item, index) in c" :key="index" :value="item">{{item}}</option>
                </select>
                <select name="" @change="selectD" v-model="md">
                    <option v-for="(item, index) in d" :key="index" :value="item">{{item | killStation}}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
import regionData from "../../assets/region/regionData.json";
var _this;
export default {
  name: "specialRegion",
  data() {
    return {
        a: Object.keys(regionData),
        b: [],
        c: [],
        d: [],
        reg: /.+\//,
        ma: '四川省',
        mb: '',
        mc: '',
        md: '',
        selectAll: ''
    }
  },
  filters: {
      killStation: function(value) {
          return value.replace(_this.reg, '');
      }
  },
  methods: {
      selectA() {
          _this.b = Object.keys(regionData[_this.ma]);
          _this.mb = _this.b[0];
          _this.c = Object.keys(regionData[_this.ma][_this.mb]);
          _this.mc = _this.c[0];
          _this.d = regionData[_this.ma][_this.mb][_this.mc];
          _this.md = _this.d[0];
          _this.selectAll = `${_this.ma}-${_this.mb}-${_this.mc}-${_this.md}`;
      },
      selectB() {
          _this.c = Object.keys(regionData[_this.ma][_this.mb]);
          _this.mc = _this.c[0];
          _this.d = regionData[_this.ma][_this.mb][_this.mc];
          _this.md = _this.d[0];
          _this.selectAll = `${_this.ma}-${_this.mb}-${_this.mc}-${_this.md}`;
      },
      selectC() {
          _this.d = regionData[_this.ma][_this.mb][_this.mc];
          _this.md = _this.d[0];
          _this.selectAll = `${_this.ma}-${_this.mb}-${_this.mc}-${_this.md}`;
      },
      selectD() {
          _this.selectAll = `${_this.ma}-${_this.mb}-${_this.mc}-${_this.md}`;
      }
  },
  created() {
      _this = this;
      _this.selectA();
  }
};
</script>
<style>
.area-class {
  width: 100%;
  height: 50%;
}
</style>
