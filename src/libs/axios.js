import axios from 'axios'
import { getToken } from '@/libs/util'
import store from '@/store/store.js'
import router from '@/router'
import i18n from '@/i18n/i18n'
const alertfn = _.debounce((text) => {
  alert(text)
}, 500)

let reqNum = 0
class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {}
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    var requestNumber = store.state.user.requestNumber
    requestNumber--
    if (requestNumber !== 0) {
      store.commit('setRequestNumber', requestNumber)
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    const pageUrl = window.location ? window.location.href.split('#')[1] : ''
    const notTarget = !pageUrl.match(/\/admin/)
    instance.interceptors.request.use(
      config => {
        notTarget && store.commit('UPDATE_LOADING_STATUS', true)
        this.queue[url] = true
        config.headers['Authorization'] = 'Bearer ' + getToken()
        reqNum++
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        reqNum--
        if (reqNum <= 0) {
          store.commit('UPDATE_LOADING_STATUS', false)
        }
        notTarget && this.destroy(url)
        if (res.status === 200) {
          const { data, status } = res
          if(data.code === 200){
            return { data, status }
          }else {
            return Promise.reject({ data, status })
          }

        }
      },
      error => {
        reqNum--
        if (reqNum <= 0) {
          store.commit('UPDATE_LOADING_STATUS', false)
        }
        if (axios.isCancel(error)) {
          return new Promise(() => {})
        } else if ((error.response.status === 401 && error.response.data.error === 'token_expired') || error.response.data.error === 'token_invalid' || error.response.data.error === 'user_not_found') {
          store.commit('setToken', '')
          router.push({ name: 'Login' })
          let outSize = store.state.home.outSize
          if (outSize == 0) {
            alertfn(i18n.t('error.tokenExpired'))
            store.commit('outSize', 1)
          }
        }
        this.destroy(url)
        return Promise.reject(error)
      }
    )
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
