import naxios from '@/libs/api.request'
import axios from 'axios'

import qs from 'qs'
// 获取集团组织架构
export const getGroupOrganization = (_this={}) => {
  const CancelToken= axios.CancelToken
  return naxios.request({
    url: '/mananger/organization',
    method: 'get',
    cancelToken: new CancelToken(function executor(c) {
      _this.cancelGetGroupOrganizationAjax = c
    })
  })
}
// 根据几个zone和时间段区间获取在这个区间的enter exit occupancy数据
export const geteeo = params => {
  const { id, zones, type, range, innerRange } = params
  return naxios.request({
    url: 'data/eeo',
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
    data: {
      id,
      zones,
      type,
      range,
      innerRange
    },
    method: 'post'
  })
}
export const getcompute = params => {
  const { id, zones, type, range, innerRange } = params
  return naxios.request({
    url: 'data/compute',
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
    data: {
      id,
      zones,
      type,
      range,
      innerRange
    },
    method: 'post'
  })
}
/**
     * @description 获取排行榜
     * @param
     */
export const getAnalysisCompute = params => {
  const { bzid, type, range, innerRange } = params
  return naxios.request({
    url: 'analysis/compute',
    data: qs.stringify({
      bzid,
      type,
      range,
      innerRange
    }),
    method: 'post'
  })
}
export const getTopmall = params => {
  return naxios.request({
    url: 'home/topmall',
    params,
    method: 'get'
  })
}
export const postAgender = params => {
  return naxios.request({
    url: '/analysis/agender',
    data: qs.stringify(params),
    method: 'post'
  })
}
export const getCurrent = (params,_this={}) => {
  let { time, companyId, offset } = params;
    const CancelToken= axios.CancelToken;
    return naxios.request({
    url: '/data/current',
    data: qs.stringify({
      time,
      companyId,
      offset
    }),
    method: 'post',
      cancelToken: new CancelToken(function executor(c) {
          _this.cancelGetCurrentAjax = c
      })
  })
}
export const postEntitysCompare = params => {
  let { type, bzid, innerRange, range } = params
  return naxios.request({
    url: 'analysis/entityscompare',
    data: qs.stringify({ type, bzid, innerRange, range }),
    method: 'post'
  })
}
export const postHistorycompute = (params,_this={}) => {
  const CancelToken= axios.CancelToken;
  return naxios.request({
    url: 'analysis/historycompute',
    data: qs.stringify(params),
    method: 'post',
    cancelToken: new CancelToken(function executor(c) {
      _this.cancelPostHistorycomputeAjax = c
    })
  })
}
export const getAgeandGender = params => {
  return naxios.request({
    url: 'analysis/agedenrTops',
    data: qs.stringify(params),
    method: 'post'
  })
}
export const getanalysiseeo = params => {
  return naxios.request({
    url: 'analysis/eeo',
    data: qs.stringify(params),
    method: 'post'
  })
}
// 集团业态
export const getCompanyFormat = params => {
  return naxios.request({
    url: 'home/topcompany',
    params,
    method: 'get'
  })
}
// 出入口实时数据params(companyId,time)
// export const getCurrentGate = params => {
//   return naxios.request({
//     url: 'data/currentgate',
//     params,
//     method: 'get'
//   })
// }
export const clearAllVipRecord = params => {
  return naxios.request({
    url: 'customer/custom_tips_qingkong',
    data: qs.stringify(params),
    method: 'post'
  })
}
export const readVipRecord = params => {
  return naxios.request({
    url: 'customer/custom_tips_all_readme',
    data: qs.stringify(params),
    method: 'post'
  })
}
export const getVipRecord = (keyword, page, limit) => {
  return naxios.request({
    url: 'customer/custom_tips',
    params: {
      keyword,
      page,
      limit
    },
    method: 'get'
  })
}
// 获取不同顾客类型数据
export const getEntityFlow = params => {
  return naxios.request({
    url: 'stat/entityFlow',
    params,
    method: 'get'
  })
}
// 获取销售指标数据
export const getSaleIndicators = (params,_this={}) => {
  const CancelToken= axios.CancelToken;
  return naxios.request({
    url: 'sale/summary',
    params,
    cancelToken: new CancelToken(function executor(c) {
      _this.cancelGetSaleIndicatorsAjax = c
    })
  })
}
// 销售趋势数据
export const getSalesTrend = params => {
  return naxios.request({
    url: 'sale/trend',
    params,
    method: 'get'
  })
}
// 业态排行
export const getTopBussinessType = params => {
  return naxios.request({
    url: 'sale/topIndustry',
    params,
    method: 'get'
  })
}
// 店铺排行
export const getTopShop = (params,_this={}) => {
  const CancelToken= axios.CancelToken
  return naxios.request({
    url: 'sale/topShop',
    params,
    cancelToken: new CancelToken(function executor(c) {
      _this.cancelGetTopShopAjax = c
    })
  })
}
// 实体引流 店铺排行
export const getDrainageShop = params => {
  return naxios.request({
    url: '/cross/topShop',
    params,
    method: 'get'
  })
}

// 业态字典列表
export const getBussinessDict = params => {
  return naxios.request({
    url: 'dict/industry',
    params,
    method: 'get'
  })
}
//  实体引流 客流商铺排行
export const getShopTopDrainage = params => {
  return naxios.request({
    url: 'cross/topIndustry',
    method: 'get',
    params
  })
}
// 客流商铺排行
export const getShopTopFootFall = (params,_this={}) => {
  /**
                      time1	string	Y		time1
                      property_id	string	N		购物中心id, 不传为全部购物中心
                      type	string	N		入客流：enter, 集客量:occupancy, 不传默认为 enter
                      industry_id	int	N		业态id,不传为全部业态
                     */
  const CancelToken= axios.CancelToken
  return naxios.request({
    url: 'flow/topShop',
    params,
    cancelToken: new CancelToken(function executor(c) {
      _this.cancelGetShopTopFootFallAjax = c
    })
  })
}
// 客流业态排行
export const getBizTopFootFall = (params,_this={}) => {
  /**
                      time1	string	Y		2019-05-19,2019-05-22
                      property_id	string	N		购物中心id, 不传为全部购物中心
                      type	string	N		入客流：enter, 集客量:occupancy, 不传默认为 enter
                     */
  const CancelToken= axios.CancelToken
  return naxios.request({
    url: 'flow/topIndustry',
    params,
    cancelToken: new CancelToken(function executor(c) {
      _this.cancelGetBizTopFootFallAjax = c
    })
  })
}
// 商铺排行分析数据导出
export const exportShopXls = params => {
  /**
                      time1	string	Y		2019-05-19,2019-05-22
                      property_id	string	N		购物中心id, 不传为全部购物中心
                      type	string	N		入客流：enter, 集客量:occupancy, 不传默认为 enter
                     */
  return naxios.request({
    url: 'shoprankexcel',
    'responseType': 'blob',
    headers: {
      'contentType': 'application/vnd.ms-excel;charset=UTF-8'
    },
    method: 'get',
    params
  })
}
// 业态排行分析数据导出
export const exportBizXls = params => {
  /**
                      time1	string	Y		2019-05-19,2019-05-22
                      property_id	string	N		购物中心id, 不传为全部购物中心
                      type	string	N		入客流：enter, 集客量:occupancy, 不传默认为 enter
                     */
  return naxios.request({
    url: 'salerankexcel',
    'responseType': 'blob',
    headers: {
      'contentType': 'application/vnd.ms-excel;charset=UTF-8'
    },
    method: 'get',
    params
  })
}
// 实体引流分析下载
export const flowexcel = params => {
  // 业态类型
  return naxios.request({
    url: 'passflowexcel',
    'responseType': 'blob',
    headers: {
      'contentType': 'application/vnd.ms-excel;charset=UTF-8'
    },
    method: 'get',
    params
  })
}
export const flowstoreexcel = params => {
  // 商铺类型
  return naxios.request({
    url: 'passflowstoreexcel',
    'responseType': 'blob',
    headers: {
      'contentType': 'application/vnd.ms-excel;charset=UTF-8'
    },
    method: 'get',
    params
  })
}
// 进店率 下载
export const goShowFlow = params => {
  // 商铺类型
  return naxios.request({
    url: 'enterexcel',
    'responseType': 'blob',
    headers: {
      'contentType': 'application/vnd.ms-excel;charset=UTF-8'
    },
    method: 'get',
    params
  })
}
// 进店率 下载
export const goShowFlowTend = params => {
  // 商铺类型
  return naxios.request({
    url: 'trendexcel',
    'responseType': 'blob',
    headers: {
      'contentType': 'application/vnd.ms-excel;charset=UTF-8'
    },
    method: 'get',
    params
  })
}

export const exportEx = formatsData => {
  return naxios.request({
    url: 'entityenter',
    'responseType': 'blob',
    headers: {
      'contentType': 'application/vnd.ms-excel;charset=UTF-8'
    },
    method: 'post',
    data: formatsData
  })
}

export const userKpiList = () => {
  return naxios.request({
    url: 'carManage',
    method: 'get'
  })
}
// 购物中心 首页 轮播图 图片 和 出入口数据
export const homeImgGaet = () => {
  return naxios.request({
    url: 'propertyGate',
    method: 'get'
  })
}

export const postKpiList = params => {
  const { property_current, property_history, company_current, company_history } = params
  return naxios.request({
    url: 'carManage',
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
    data: {
      property_current,
      property_history,
      company_current,
      company_history
    },
    method: 'post'
  })
}
// bi url
export const getUrl = () => {
  return naxios.request({
    url: 'BIUrl',
    method: 'get'
  })
}
//首页当日销售&本月销售
export const getSaleReach = (params) => {
  return naxios.request({
    url: 'sale/saleReach',
    params
  })
}
