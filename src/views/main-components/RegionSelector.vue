<template>
	<div class="selectWrapper">
		<select class="selector" v-show="!hide['county'] && !county" @change="selectA" v-model="ma" name="">
			  <option v-for="(item, index) in a" :key="index" :value="item">{{item}}</option>
		  </select>
		<select class="selector" v-show="!hide['station'] && !station" @change="selectB" v-model="mb" name="">
			  <option v-for="(item, index) in b" :key="index" :value="item">{{item}}</option>
		  </select>
		<select class="selector" v-show="!hide['village']" v-model="mc" name="">
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
				// default_mc: '披砂镇',
				ma: '',
				mb: '',
				mc: '',
				is_hide_a: false,
				is_hide_b: false
			};
		},
		props: {
			hide: Object,
			county: String,
			station: String,
			defaults: Object
		},
		created() {
			_this = this;
			// _this.selectA();
			// _this.initSelector();
			if (this.defaults) {
				_this.ma = _this.county || _this.defaults ? _this.defaults.default_ma : _this.default_ma;
				_this.mb = _this.station || _this.defaults ? _this.defaults.default_mb : _this.default_mb;
				_this.mc = _this.station || _this.defaults ? _this.defaults.default_mc : _this.default_mc;
				// _this.mc = _this.defaults.default_mc
				_this.initSelector2()
			} else {
				_this.ma = _this.county || _this.default_ma;
				_this.mb = _this.station || _this.default_mb;
				_this.initSelector()
			}
		},
		watch: {
			'defaults': {
				handler(obj) {
					_this = this;
					_this.ma = obj.default_ma;
					_this.mb = obj.default_mb;
					_this.mc = obj.default_mc;
					this.initSelector2();
					// _this.selectA();
				},
				deep: true
			}
		},
		methods: {
			initSelector() {
				_this = this;
				_this.b = Object.keys(regionData[_this.ma]);
				if (_this.station) {
					_this.mb = _this.station;
				} else {
					_this.mb = _this.b[0];
				}
				_this.c = regionData[_this.ma][_this.mb];
				_this.mc = _this.c[0];
			},
			initSelector2() {
				_this = this;
				_this.b = Object.keys(regionData[_this.ma]);
				_this.c = regionData[_this.ma][_this.mb];
				// _this.mc = _this.c[0];
			},
			selectA() {
				_this.b = Object.keys(regionData[_this.ma]);
				_this.mb = _this.b[0];
				_this.c = regionData[_this.ma][_this.mb];
				_this.mc = _this.c[0];
			},
			selectB() {
				_this.c = regionData[_this.ma][_this.mb];
				_this.mc = _this.c[0];
			},
			getRegion() {
				/* var res = {
					county: '',
					station: '',
					village: ''
				}; */
				var res = [];
				if (!_this.hide['county'] && !_this.county) {
					// res['county'] = _this.ma;
					res.push(_this.ma);
				}
				if (!_this.hide['station'] && !_this.station) {
					// res['station'] = _this.mb;
					res.push(_this.mb);
				}
				if (!_this.hide['village']) {
					// res['village'] = _this.mc;
					res.push(_this.mc);
				}
				return res;
			}
		}
	};
</script>

<style scoped>
	.selectWrapper {
		display: inline-block;
	}
	select {
		outline: none;
	}
	.selector {
		height: 40px;
		border: 1px solid #dcdfe6;
		padding: 0 5px;
		color: #606266;
		border-radius: 4px;
		margin-right: 5px;
	}
</style>
