/* =========================================================================================
  File Name: getters.js
  Description: Vuex Store - getters
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Version: 1.1
  Author: Pixinvent
  Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== */

import { getMenuByRouter } from '@/libs/util.js'
import routers from '@/router/router.js'
// console.log(routers);

const getters = {
  starredPages: state => state.navbarSearchAndPinList.data.filter((page) => page.highlightAction),
  menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access,rootState.home.saleStatus,rootState.home.menuList)
}

export default getters
