import naxios from '@/libs/api.request'

export const dateCompare = params => {
  return naxios.request({
    url: 'analysis/dateentityscompare',
    data: params,
    method: 'post'
  })
}
export const dwellTime = params => {
  const { time1, time2, bzid } = params
  return naxios.request({
    url: 'dwelltime/chart',
    params: {
      time1,
      time2,
      bzid
    },
    method: 'get'
  })
}

export const crossData = params => {
  const { time1, time2, from_bzid, to_bzid, range } = params
  return naxios.request({
    url: 'crossFlow/index',
    params: {
      time1,
      time2,
      from_bzid,
      to_bzid,
      range
    },
    method: 'get'
  })
}
export const relevanceData = params => {
  const { bzid, time } = params
  return naxios.request({
    url: 'flow/assoc',
    params: {
      bzid,
      time
    },
    method: 'get'
  })
}
export const directionData = params => {
  const { bzid, time } = params
  return naxios.request({
    url: 'cross/direction',
    params: {
      bzid,
      time
    },
    method: 'get'
  })
}

export const getEntityFlowBatch = params => {
  return naxios.request({
    url: 'stat/entityFlowBatch',
    params,
    method: 'get'
  })
}
export const activitiesList = params => {
  return naxios.request({
    url: 'dict/industry',
    params,
    method: 'get'
  })
}
export const goShopTen = params => {
  const { time1, time2, industry_id, property_id } = params
  return naxios.request({
    url: 'shop/enterRate/top',
    params: {
      time1,
      time2,
      industry_id,
      property_id
    },
    method: 'get'
  })
}

export const goShopTenLoading = params => {
  const { time1, time2, industry_id } = params
  return naxios.request({
    url: '/enterexcel',
    params: {
      time1,
      time2,
      industry_id
    },
    method: 'get'
  })
}

export const goShopTrend = params => {
  const { time1, time2, bzid, range } = params
  return naxios.request({
    url: 'shop/enterRate/trend',
    params: {
      time1,
      time2,
      bzid,
      range
    },
    method: 'get'
  })
}
//按店铺查
export const drainageData = params => {
  const { time, bzid } = params
  return naxios.request({
    url: 'flow/drainage',
    params: {
      time,
      bzid
    },
    method: 'get'
  })
}
//按业态查
export const drainageDataByBussiness = params => {
  return naxios.request({
    url: 'matrix/industryDrainage',
    params,
    method: 'get'
  })
}
export const flowMoving = params => {
  const { time, property_id } = params
  return naxios.request({
    url: 'flow/moving',
    params: {
      time,
      property_id
    },
    method: 'get'
  })
}
export const PathMovingData = params => {
  const { time, property_id, start, end, floor_id } = params
  return naxios.request({
    url: 'judge/keyPath',
    params: {
      time,
      property_id,
      start,
      end,
      floor_id
    },
    method: 'get'
  })
}

export const activityDataList = params => {
  const { date, property_id } = params
  return naxios.request({
    url: 'manager/query_active_target',
    params: {
      date,
      property_id
    },
    method: 'get'
  })
}
export const getEffective = (data) => {
  return naxios.request({
    url: 'passflow/visits',
    data,
    method: 'post'
  })
}
export const getHeatMapFloorData = params => {
  const { property_id, type } = params
  return naxios.request({
    url: 'judge/getHKBzids',
    params: {
      property_id,
      type
    },
    method: 'get'
  })
}
export const getEntityDrainage = params => {
  const { time1, range, from_bzids, to_bzids } = params
  return naxios.request({
    url: 'cross/trend',
    params: {
      time1,
      range,
      from_bzids,
      to_bzids
    },
    method: 'get'
  })
}
//时段客流分布热力
export const getTimePassengerFlowDistribution = params => {
  const { bzIds, begin_time, end_time } = params
  return naxios.request({
    url: 'flow/timeDistr',
    params: {
      bzIds,
      begin_time,
      end_time,
    },
  })
}
// 热力地图分布
export const getHeatMapDistribution = params => {
  return naxios.request({
    url: 'judge/heatMap',
    params
  })
}
export const Path3D = params => {
  const { time, property_id,type } = params
  return naxios.request({
    url: 'flow/movingTd',
    params: {
      time,
      property_id,
      type
    },
    method: 'get'
  })
}
//无效客流趋势
export const getInvalidFlowTrend = params => {
  return naxios.request({
    url: 'specialcounting/trend',
    params
  })
}
//无效客流
export const getInvalidFlow = params => {
  return naxios.request({
    url: 'invalid/flow',
    params
  })
}
//获取蜂鸟地图ID
export const getFengmapId = params => {
  return naxios.request({
    url: 'fmap/config',
    params
  })
}
