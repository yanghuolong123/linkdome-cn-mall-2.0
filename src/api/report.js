import naxios from '@/libs/api.request'
import qs from 'qs'
import axios from 'axios'
export const fetchEntity = (timeRange, entityType, propertyId) => {
  return naxios.request({
    url: 'report/daily/entity',
    data: qs.stringify({
      timeRange, entityType, propertyId
    }),
    method: 'post'
  })
}

export const fetchCompany = (timeRange, queryType, bzid) => {
  return naxios.request({
    url: 'report/daily/company',
    data: qs.stringify({
      timeRange, queryType, bzid
    }),
    method: 'post'
  })
}
export const reportAgender = (bzid, range) => {
  return naxios.request({
    url: 'analysis/agender',
    data: qs.stringify({
      bzid, range
    }),
    method: 'post'
  })
}

export const reportCompare = (bzid, type, range, innerRange, entity) => {
  return naxios.request({
    url: 'analysis/entityscompare',
    data: qs.stringify({
      bzid, type, range, innerRange, entity
    }),
    method: 'post'
  })
}

export const monthlyCameraList = (propertyid, timeRange) => {
  return naxios.request({
    url: 'report/monthly/gate',
    data: qs.stringify({
      propertyid, timeRange
    }),
    method: 'post'
  })
}
export const eeoComputed = params => {
  return naxios.request({
    url: 'report/weekly/property',
    data: qs.stringify(params),
    method: 'post'
  })
}
export const getReportArea = params => {
  return naxios.request({
    url: 'flow/topArea',
    params,
    method: 'get'
  })
}
export const getReportFormat = params => {
  return naxios.request({
    url: 'flow/topShopByIndustry',
    params,
    method: 'get'
  })
}
export const monthlySequential = (params, _this = {}) => {
  const CancelToken = axios.CancelToken
  return naxios.request({
    url: 'report/month/contrast',
    data: qs.stringify(params),
    method: 'post',
    cancelToken: new CancelToken(function executor (c) {
      _this.cancelPostHistorycomputeAjax = c
    })
  })
}
export const newReportEnter = (params, _this = {}) => {
  const CancelToken = axios.CancelToken
  return naxios.request({
    url: 'report/dailyReport',
    data: qs.stringify(params),
    method: 'post',
    cancelToken: new CancelToken(function executor (c) {
      _this.cancelPostHistorycomputeAjax = c
    })
  })
}
export const newReportSuggest = params => {
  return naxios.request({
    url: 'report/suggest',
    params,
    method: 'get'
  })
}
export const newReportSuggestPost = params => {
  return naxios.request({
    url: 'report/suggest',
    data: qs.stringify(params),
    method: 'post'
  })
}
export const newReportGate = params => {
  return naxios.request({
    url: 'report/entrance',
    data: qs.stringify(params),
    method: 'post'
  })
}
export const newReportShop = params => {
  return naxios.request({
    url: 'report/daily/topShop',
    data: qs.stringify(params),
    method: 'post'
  })
}
export const newReportMonthRemark = params => {
  return naxios.request({
    url: 'report/month/trend',
    data: qs.stringify(params),
    method: 'post'
  })
}
export const newReportFloorShop = params => {
  return naxios.request({
    url: 'report/month/shop',
    data: qs.stringify(params),
    method: 'post'
  })
}

export const newReportFormatShop = params => {
  return naxios.request({
    url: 'report/month/formatShop',
    data: qs.stringify(params),
    method: 'post'
  })
}
//性别年龄　客流趋势
export const ageGenderTrend = params => {
  return naxios.request({
    url: 'flow/agender/trend',
    params,
  })
}
//路经客流趋势
export const passbyTrend = params => {
  return naxios.request({
    url: 'flow/passby/trend',
    params,
  })
}
//性别年龄　路经　客流趋势
export const ageGenderPassbyTrend = params => {
  return naxios.request({
    url: 'flow/agenderpassby/trend',
    params,
  })
}
//停留时间
export const getDwellTime = params => {
  return naxios.request({
    url: 'dwell/trend',
    params,
  })
}
