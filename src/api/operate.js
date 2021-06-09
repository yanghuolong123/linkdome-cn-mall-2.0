import naxios from '@/libs/api.request'
export const getDateCompare = (params) => {
  return naxios.request({
    url: 'analysis/datecompare',
    data: params,
    method: 'post'
  })
}

export const changeExportOne = (params) => {
  const { bzid, year, type } = params
  return naxios.request({
    url: 'festivalexcel',
    'responseType': 'blob',
    headers: {
      'contentType': 'application/vnd.ms-excel;charset=UTF-8'
    },
    params: {
      type,
      bzid,
      year
    },
    method: 'get'
  })
}

export const changeExport = (params) => {
  return naxios.request({
    url: 'festivalcomexcel',
    'responseType': 'blob',
    headers: {
      'contentType': 'application/vnd.ms-excel;charset=UTF-8'
    },
    data: params,
    method: 'post'
  })
}

export const ExcelDataApi = params => {
  const { bzid, year } = params
  return naxios.request({
    url: 'flow/moving',
    params: {
      bzid,
      year
    },
    method: 'get'
  })
}

export const getShopPortrait = params =>{
  return naxios.request({
    url: 'sale/shopPortrait',
    params,
  })
}
//运营指数对比
export const getOperateIndex = params =>{
  return naxios.request({
    url: 'sale/operateIndex',
    params,
  })
}
//店铺画像
export const getIndexMap = params =>{
  return naxios.request({
    url: 'sale/indexMap',
    params,
  })
}
//获取位置列表
export const getPositonOpiton = () =>{
  return naxios.request({
    url: 'sale/location',
  })
}
export const getStoreOpiton = () =>{
  return naxios.request({
    url: 'sale/storeList',
  })
}
//调铺效果分析（新） 基于店铺

export const getShopChange = (id) =>{
  return naxios.request({
    url: 'sale/shopChange',
    params:{
      id
    }
  })
}
//调铺效果分析（新） 基于位置
export const getShopChangeByPosition = (id) =>{
  return naxios.request({
    url: 'sale/storeChange',
    params:{
      id
    }
  })
}
//调铺销售趋势
export const getShopChangeSaleTrend = (data) =>{
  return naxios.request({
    url: 'sale/saleTrend',
    data,
    method:'post'
  })
}
