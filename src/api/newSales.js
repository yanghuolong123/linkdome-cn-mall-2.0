import naxios from '@/libs/api.request'
import axios from 'axios'
import qs from 'qs'

export const getNewbusiness = params => {
  return naxios.request({
    url: 'hubang/trend',
    params,
    method: 'get'
  })
}

export const getNewfloor = params => {
  return naxios.request({
    url: 'hubang/floorAnalysis',
    params,
    method: 'get'
  })
}

export const getNewbrand = params => {
  return naxios.request({
    url: 'hubang/brandAnalysis',
    params,
    method: 'get'
  })
}
export const gethotGoode = params => {
  return naxios.request({
    url: 'hubang/hotGoods',
    params,
    method: 'get'
  })
}
export const getchange = params => {
  return naxios.request({
    url: 'hubang/changeTop',
    params,
    method: 'get'
  })
}
