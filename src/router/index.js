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
const LOGIN_PAGE_NAME = 'Login'
const NoLoginPages = ['Login', 'pageForgotPassword', 'pageResetPassword']
const pdfDownloadPages = ['downloadDayPdf', 'downloadWeekPdf', 'downloadMonthPdf', 'downloadStoreDayPdf','downloadCustomizePdf']
const whitelistPages = [...NoLoginPages, ...pdfDownloadPages]

router.beforeEach((to, from, next) => {
  let token = getToken() === 'undefined' ? undefined : getToken()// token 读出来的值会是字符类型的'undefined'
  if (!token && !whitelistPages.includes(to.name)) {
    // 未登录且要跳转的页面不是登录页
    next({ name: LOGIN_PAGE_NAME })// 跳转到登录页
  } else if (!token && whitelistPages.includes(to.name)) {
    next() // 未登陆且要跳转的页面是登录页
  } else if (token && NoLoginPages.includes(to.name)) {
    next({ name: 'Dashboard' })// 跳转到home页
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
router.onError(error => {
  console.log(error)
})
export default router
