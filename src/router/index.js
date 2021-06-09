import Vue from 'vue'
import Router from 'vue-router'
import routes from './router'
import { getToken } from '@/libs/util'
import store from '../store/store'

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'hash'
})
const LOGIN_PAGE_NAME = 'pageLogin'
const NoLoginPages = ['pageLogin', 'pageForgotPassword', 'pageResetPassword', 'downloadDayPdf', 'downloadWeekPdf', 'downloadMonthPdf']
router.beforeEach((to, from, next) => {
  let token = getToken() === 'undefined' ? undefined : getToken()// token 读出来的值会是字符类型的'undefined'
  if (!token && !NoLoginPages.includes(to.name)) {
    // 未登录且要跳转的页面不是登录页
    next({ name: LOGIN_PAGE_NAME })// 跳转到登录页
  } else if (!token && NoLoginPages.includes(to.name)) {
    next() // 未登陆且要跳转的页面是登录页
  } else if (token && NoLoginPages.includes(to.name)) {
    // 已登录且要跳转的页面是登录页
    if (to.name === 'downloadDayPdf' || to.name === 'downloadWeekPdf' || to.name === 'downloadMonthPdf') next()
    else next({ name: 'Dashboard' })// 跳转到home页
  } else {
    let menuarr = JSON.parse(window.localStorage.getItem('menuarr'))
    let isFind = _.find(menuarr, ['name', to.name])
    if (isFind) {
      if (store.state.user.access.indexOf(isFind.id + '') == -1) {
        next({ name: 'error_404' })
      }
    }
    next()
  }
})
router.afterEach(to => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})
export default router
