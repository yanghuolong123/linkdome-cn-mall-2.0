/*=========================================================================================
  File Name: i18n.js
  Description: i18n configuration file. Imports i18n data.
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Version: 1.1
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import VueI18n from 'vue-i18n'
// import store from '@/store/store'

// console.log(store)
import zh from './lang/zh'
import en from './lang/en'
import ivuZh from 'view-design/dist/locale/zh-CN';
import ivuEn from 'view-design/dist/locale/en-US';
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
Vue.use(VueI18n);

Vue.locale = () => {};
const i18n = new VueI18n({
  locale: 'zh-CN', // set default locale
  messages: {
		'zh-CN': Object.assign(zh, zhLocale,ivuZh),
		'en-US': Object.assign(en, enLocale,ivuEn)
	},
  silentFallbackWarn: true
})



export default i18n
