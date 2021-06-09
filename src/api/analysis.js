import naxios from '@/libs/api.request'
import qs from 'qs'
export const postQueueData = params => {
  const { id, zones, type, range, innerRange } = params
  return naxios.request({
    url: 'data/queue',
    data: qs.stringify({
      id,
      zones,
      type,
      range,
      innerRange
    }),
    method: 'post'
  })
}
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
export const entityCompare = params => {
  const { id, bzid1, bzid2, type, range, innerRange } = params
  return naxios.request({
    url: 'analysis/entitycompare',
    data: qs.stringify({
      id,
      bzid1,
      bzid2,
      type,
      range,
      innerRange
    }),
    method: 'post'
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
export const getEffective = (bzid, start_time, end_time, innerRange) => {
  return naxios.request({
    url: 'passflow/visits',
    data: {
      bzid: bzid,
      start_time: start_time,
      end_time: end_time,
      innerRange: innerRange
    },
    method: 'post'
  })
}
export const getHeatMapData = params => {
  const { time, bzid, timeRange } = params
  return naxios.request({
    url: 'analysis/heat_map',
    data: qs.stringify({
      time,
      bzid,
      timeRange
    }),
    method: 'post'
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
// 时段客流分布热力
export const getTimePassengerFlowDistribution = params => {
  const { bzIds, begin_time, end_time } = params
  return naxios.request({
    url: 'flow/timeDistr',
    params: {
      bzIds,
      begin_time,
      end_time
    }
  })
}
// 热力地图分布
export const getHeatMapDistribution = params => {
  return naxios.request({
    url: 'judge/heatMap',
    params
  })
}

export const getHwellTimeData = params => {
  return naxios.request({
    url: 'judge/dwellHeatMap',
    params
  })
}
