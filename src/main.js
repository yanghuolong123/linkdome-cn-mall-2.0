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

// VeeValidate
import VeeValidate from 'vee-validate'
// import { Carousel, DatePicker, Tooltip, Icon, Badge, CarouselItem, Card, Row, Col, Button, Form, FormItem, Input, Radio, Checkbox, Select, Option, Upload, Cascader, Dropdown, TimePicker, DropdownItem, DropdownMenu } from 'iview'
// import 'view-design/dist/styles/iview.css'
import 'iview/dist/styles/iview.css'
// 全局过滤器
import * as custom from '@/filters/custom'
import VueAMap from 'vue-amap'
import icons from '_c/icons'
// PrismJS
import 'prismjs'
import 'prismjs/themes/prism.css'
// iview
// import ViewUI from 'view-design'
// Vue.use(ViewUI)
import iview from 'iview'
import htmlToPdf from '@/router/htmlToPdf'

import 'element-ui/lib/theme-chalk/index.css'
import elementUi from 'element-ui'
import vuescroll from 'vuescroll';
Vue.use(vuescroll);
Vue.use(iview)
Vue.use(elementUi)



Vue.component('icons', icons)
Vue.use(Vuesax)
Object.keys(custom).forEach(key => {
  Vue.filter(key, custom[key])
})

Vue.use(htmlToPdf)
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
require('./assets/css/iconfont.css')
// 思源宋体
// require('./assets/fonts/Roboto/style.css')
// require('./assets/fonts/soucehasfont/style.css')
Vue.config.productionTip = false

const config = {
  errorBagName: 'errorBags', // change if property conflicts.
  fieldsBagName: 'fieldBags'
}
Vue.use(VeeValidate, config)
// 控制是否显示遮罩层
Vue.prototype.hasCover = process.env.NODE_ENV === 'development' ? '' : ''
require('./assets/css/config.css')
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
