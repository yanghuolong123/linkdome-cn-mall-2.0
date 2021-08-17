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
import ViewUI from 'view-design';
import zh from './lang/zh'
import en from './lang/en'
import ivuZh from 'view-design/dist/locale/zh-CN';
import ivuEn from 'view-design/dist/locale/en-US';

Vue.use(VueI18n);
Vue.use(ViewUI);
Vue.locale = () => {};

export default new VueI18n({
  locale: 'zh-CN', // set default locale
  messages: {
		'zh-CN': Object.assign(zh, ivuZh),
		'en-US': Object.assign(en, ivuEn)
	}
})