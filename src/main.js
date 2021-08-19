/* =========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Version: 1.1
  Author: Pixinvent
  Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== */

import Vue from 'vue'
import App from './App.vue'

// import './assets/siyuan/style.css'
// import './assets/roboto/style.css'
// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' // Material Icons
import 'vuesax/dist/vuesax.css'

// Theme Configurations
import '../themeConfig.js'

// Globally Registered Components
import './globalComponents.js'

// Styles: SCSS
import './assets/scss/main.scss'

// Tailwind
import '@/assets/css/main.css'

// Vue Router
import router from '@/router/index'

// Vuex Store
import store from './store/store'

// i18n
import i18n from './i18n/i18n'

// Vuesax Admin Filters
import './filters/filters'
import '@/assets/utils/prototype'
// VeeValidate
import VeeValidate from 'vee-validate'

import 'view-design/dist/styles/iview.css';
// 全局过滤器
import * as custom from '@/filters/custom'
import VueAMap from 'vue-amap'
import icons from '_c/icons'
// PrismJS
import 'prismjs'
import 'prismjs/themes/prism.css'
import '@/assets/css/sundry.css'
import '@/assets/css/components-style.less'

import ViewUI  from 'view-design'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import heatmapjsVue from 'heatmapjs-vue'
Vue.use(ViewUI)
Vue.use(ElementUI,{
  i18n: (key, value) => i18n.t(key, value)
})
import './my-theme/index.less';

import Alert from '@/components/alert/index'
Vue.prototype.$alert = Alert.install;
Vue.component('icons', icons)
Vue.use(Vuesax)
Object.keys(custom).forEach(key => {
  Vue.filter(key, custom[key])
})
// 连接线插件
import jsPlumb from 'jsplumb'
Vue.prototype.$jsPlumb = jsPlumb.jsPlumb
// 高德地图
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '256f485dca2b10552a5a17c3f69ae1c7',
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor'
  ],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})
// Feather font icon
Vue.config.productionTip = false

const config = {
  errorBagName: 'errorBags', // change if property conflicts.
  fieldsBagName: 'fieldBags'
}
Vue.use(VeeValidate, config)
Vue.use(heatmapjsVue)
import './libs/rem'
require('./assets/css/iconfont.css')
// 控制是否显示遮罩层
Vue.prototype.hasCover = process.env.NODE_ENV === 'development' ? '' : ''
require('./assets/css/common.css')
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
