import naxios from '@/libs/api.request'
import qs from 'qs'
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
