
import naxios from '@/libs/api.request'
import qs from 'qs'
import axios from 'axios'
// 楼层 前10的商铺
export const newReportFloorStore = params => {
    return naxios.request({
      url: 'report/floorShop',
      data: qs.stringify(params),
      method: 'post'
    })
}

// 业态 前10的商铺
export const newReportFormatStore = params => {
    return naxios.request({
      url: 'report/formatShop',
      data: qs.stringify(params),
      method: 'post'
    })
}
// 热力图
export const newReportHeatMap = params => {
  return naxios.request({
    url: 'report/timeDistr',
    params,
    method: 'get'
  })
}


// 关联度 无序
export const newReportOrderly = params => {
  return naxios.request({
    url: 'report/assoc',
    params,
    method: 'get'
  })
}


// 关联度 有序
export const newReportDisorder = params => {
  return naxios.request({
    url: 'report/direction',
    params,
    method: 'get'
  })
}


// 停留时间  业态下的商铺
export const newReportDwellStore = params => {
  return naxios.request({
    url: 'report/formatDwellShop',
    params,
    method: 'get'
  })
}
// 停留时间 业态
export const newReportDwellFormat = params => {
  return naxios.request({
    url: 'report/formatDwell',
    params,
    method: 'get'
  })
}
export const newReportGateLast= params => {
  return naxios.request({
    url: 'report/entranceCompare',
    data: qs.stringify(params),
    method: 'post'
  })
}
// 月报按周的出入口对比
export const newReportMonthlyGate = params => {
  return naxios.request({
    url: 'report/monthly/gate',
    params
  })
}
