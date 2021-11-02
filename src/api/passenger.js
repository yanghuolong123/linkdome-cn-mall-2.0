import naxios from '@/libs/api.request'
import axios from "axios";
var eeoApi = '/data/eeo'
let bussinessTreeApi = '/mananger/businesstree'
let bussinessCommonApi = '/mananger/business'

// enter data
export const getEeoData = eeo => {
  return naxios.request({
    url: eeoApi,
    method: 'post',
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }
    ],
    data: eeo
  })
}
export const getBussinessTree = (entity,_this={}) => {
  const CancelToken= axios.CancelToken
  return naxios.request({
    url: bussinessTreeApi,
    method: 'get',
    params: entity,
    cancelToken: new CancelToken(function executor(c) {
      _this.cancelGetBussinessTreeAjax = c
    })
  })
}
export const getBussinessCommon = entity => {
  return naxios.request({
    url: bussinessCommonApi,
    method: 'get',
    params: entity
  })
}
export const getCascadeList = property => {
  return naxios.request({
    url: '/get_entity_list/',
    method: 'get',
    params: property
  })
}
export const getFootfallTrend = params => {
  /**
    time1	string	Y		2019-05-19,2019-05-22
    type	string	Y		入客流：enter, 集客量：occupancy
    range	string	Y		Hour,Date,Month
    property_id	string	N		购物中心id, 不传为全部购物中心
    bzid
   */
  return naxios.request({
    url: 'flow/trend',
    method: 'get',
    params
  })
}

export const getQueueAnalysis = property => {
  return naxios.request({
    url: '/queuecheckout/analysis',
    method: 'get',
    params: property
  })
}

export const getQueueList = property => {
  return naxios.request({
    url: '/queuecheckout/list',
    method: 'get',
    params: property
  })
}

export const getHuojiaAnalysis = payload => {

  return naxios.request({
    url: '/queuetouch/analysis',
    method: 'get',
    params: payload
  })
}

export const getHuojiaList = property => {
  return naxios.request({
    url: '/queuetouch/list',
    method: 'get',
    params: property
  })
}
//客户轨迹　
export const getCustomerTrailList = params => {
  return naxios.request({
    url: '/customer/trail',
    method: 'get',
    params
  })
}
