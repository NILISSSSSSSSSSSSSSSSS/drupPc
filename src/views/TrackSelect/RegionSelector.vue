<template>
  <div>
	  <select class="selector"  @change="selectA"  v-show="!hide['county'] && !county"  v-model="ma" name="">
		  <option v-for="(item, index) in a"  :key="index" :value="item">{{item}}</option>
	  </select>
	  <select class="selector" v-show="!hide['station'] && !station" @change="selectB" v-model="mb" name="">
		  <option v-for="(item, index) in b" :key="index" :value="item">{{item}}</option>
	  </select>
	  <select class="selector" v-show="!hide['village']" @change="selectC" v-model="mc" name="">
		  <option v-for="(item, index) in c" :key="index" :value="item">{{item}}</option>
	  </select>
  </div>
</template>

<script>
import regionData from '../../assets/region/specialRegionData.json';
var _this;
export default {
	name: "RegionSelector",
	data() {
		return {
			a: Object.keys(regionData),
			b: [],
			c: [],
			default_ma: '宁南县',
			default_mb: '披砂镇社区戒毒社区戒毒（康复）工作站',
			ma: '',
			mb: '',
			mc: '',
			is_hide_a: false,
			is_hide_b: false,
			isclick:false,
			isclick1:false
		};
	},
	props: {
		hide: Object,
		county: String,
		station: String,
		fn:Function
	},
	created() {
		_this = this;
		_this.ma = _this.county || _this.default_ma;
		_this.mb = _this.station || _this.default_mb;
		// _this.selectA();
		_this.initSelector();
	},
	methods: {
		initSelector() {
			_this.b = Object.keys(regionData[_this.ma]);
			if(_this.station) {
				_this.mb = _this.station;
			}else {
				_this.mb = _this.b[0];
			}
			_this.c = regionData[_this.ma][_this.mb];
			_this.mc = _this.c[0];
		},
		selectA() {
			_this.b = Object.keys(regionData[_this.ma]);
			_this.mb = _this.b[0];
			_this.c = regionData[_this.ma][_this.mb];
			_this.mc = _this.c[0];
			_this.fn({
                county:_this.ma
            })
		},
		selectB() {
			_this.c = regionData[_this.ma][_this.mb];
			_this.mc = _this.c[0];
            _this.fn({
                county:_this.ma,
                station:_this.mb,
            })
		},
        selectC() {
            _this.fn({
                county:_this.ma,
                station:_this.mb,
                villages:_this.mc,
            })
        },
		getRegion() {
			/* var res = {
				county: '',
				station: '',
				village: ''
			}; */
			var res = [];
			if(!_this.hide['county'] && !_this.county) {
				// res['county'] = _this.ma;
				res.push(_this.ma);
			}
			if(!_this.hide['station'] && !_this.station) {
				// res['station'] = _this.mb;
				res.push(_this.mb);
			}
			if(!_this.hide['village']) {
				// res['village'] = _this.mc;
				res.push(_this.mc);
			}
			return res;
		},
	},
//	watch:{
//        ma(val){
//			console.log(val);
//            _this.$emit('getcoutry',val)
//		},
//        mb(val){
//            if(_this.isclick){
//                _this.$emit('getstation',val)
//			}
//        },
//        mb(val){
//            if(_this.isclick1) {
//                _this.$emit('getvillage', val)
//            }
//        }
//	}
};
</script>

<style scoped>
select{
   outline: none;
}
.selector{
	height: 40px;
	border: 1px solid #dcdfe6;
	padding: 0 5px;
	color: #606266;
	border-radius: 4px;
	margin-right: 5px;
}
</style>
