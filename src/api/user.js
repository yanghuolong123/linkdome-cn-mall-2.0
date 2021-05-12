import axios from 'axios'
import config from '@/config/index.js'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
const naxios = axios.create({
  baseURL: baseUrl,
  timeout: 5000
})
export const login = ({ userName, password }) => {
  const data = {
    name: userName,
    password
  }
  return naxios.request({
    url: 'login',
    data,
    method: 'post'
  })
}
export const logout = token => {
  return naxios.request({
    url: 'logout',
    method: 'post'
  })
}
export const userCheck = email => {
  return naxios.request({
    url: 'findPassword',
    data: email,
    method: 'post'

  })
}
export const resetPassword = params => {
  return naxios.request({
    url: 'resetPassword',
    data: params,
    method: 'post'
  })
}
