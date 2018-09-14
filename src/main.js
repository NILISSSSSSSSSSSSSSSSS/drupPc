<<<<<<< HEAD
import Vue from 'vue';
import iView from 'iview';
import { router } from './router/index';
import store from './store';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import axios from 'axios';
import { Tool } from './common/common';
import hex_sha1 from './common/sha1';
import { url, resourcesUrl, httpUrl } from '../build/serverurl';
import iviewArea from 'iview-area';
// 引入vue-amap
import AMap from 'vue-amap';
var reg_image = /(pic|pic&video)\/.+\.(jpg|png)/;

Vue.use(iView);
Vue.use(ElementUI);
Vue.use(AMap);
Vue.use(iviewArea);
Vue.prototype.hexSha1 = hex_sha1;
Vue.prototype.$http = axios;
Vue.prototype.serverIP = url;
Vue.prototype.resourcesUrl = resourcesUrl;
Vue.prototype.httpUrl = httpUrl;
Vue.prototype.Tool = new Tool();
Vue.directive('cosauth', {
    bind: function(el) {
        var url = el.src;
        console.log(el.src)
        var key = url.match(reg_image)[0];
        var cb = function(signed_url) {
            el.src = signed_url;
        }
        Tool.prototype.getCos(key, cb);
    }
});

// 初始化vue-amap
AMap.initAMapApiLoader({
    // 高德的key
    key: '953819687d6f4eaba7ff3d6e4a1a96cb',
    // 插件集合 （插件按需引入）
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.MarkerClusterer', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
});
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    mounted() {
        this.$store.commit('updateMenulist');
    }
});
=======
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import axios from 'axios'
var VueCookie = require('vue-cookie');
import echarts from 'echarts'
import router from './router'
import VueI18n from 'vue-i18n'
require ('./commonStyle/common.css');

Vue.prototype.$echarts = echarts
Vue.prototype.$http = axios  //axios并不是vue插件，所以不能 使用Vue.use()
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueCookie);//cookie插件
Vue.use(VueI18n) // 语言翻译
import RegionPicker from 'vue-region-picker'
import CHINA_REGION from 'china-area-data'

Vue.use(RegionPicker, {
  region: CHINA_REGION,
  vueVersion: 2
})

const i18n = new VueI18n({
  locale: 'zh',    // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh': require('./lang/zh'),   // 中文语言包
    'en': require('./lang/en')    // 英文语言包
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,  // 不要忘记
  router,
  components: { App },
  template: '<App/>'
})



>>>>>>> 6f119ba70fdcf9e1323186b1bb352adaf497b22c
