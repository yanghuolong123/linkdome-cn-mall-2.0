/* =========================================================================================
  File Name: store.js
  Description: Vuex store
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Version: 1.1
  Author: Pixinvent
  Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== */

import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

import moduleTodo from './todo/moduleTodo.js'
import moduleCalendar from './calendar/moduleCalendar.js'
import moduleChat from './chat/moduleChat.js'
import moduleEmail from './email/moduleEmail.js'
import moduleUser from './moudle/user.js'
import moduleHome from './moudle/home.js'
import moduleReport from './moudle/report.js'
import moduleFootFallAnalytics from './moudle/footFallAnalytics.js'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)
export default new Vuex.Store({
  getters,
  mutations,
  state,
  actions,
  modules: {
    todo: moduleTodo,
    calendar: moduleCalendar,
    chat: moduleChat,
    email: moduleEmail,
    user: moduleUser,
    home: moduleHome,
    report: moduleReport,
    footfall: moduleFootFallAnalytics
  },
  strict: process.env.NODE_ENV !== 'production',
  plugins: [createPersistedState()]
})
