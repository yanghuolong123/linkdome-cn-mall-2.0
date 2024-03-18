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

import zh from './lang/zh_CN.json'
import en from './lang/en.json'
import ja from './lang/ja.json'
import ivuZh from 'view-design/dist/locale/zh-CN';
import ivuEn from 'view-design/dist/locale/en-US';
import ivuJa from 'view-design/dist/locale/ja-JP';
import enLocale from 'element-ui/lib/locale/lang/en'
import jaLocale from 'element-ui/lib/locale/lang/ja'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
Vue.use(VueI18n);

Vue.locale = () => {};
const i18n = new VueI18n({
  locale: 'zh-CN', // set default locale
	silentTranslationWarn: true,
  messages: {
		'zh-CN': Object.assign(zh, zhLocale,ivuZh),
		'en-US': Object.assign(en, enLocale,ivuEn),
		'ja-JP': Object.assign(ja, jaLocale,ivuJa),
	}
})



export default i18n
