import naxios from '@/libs/api.request'

//实体客流分析（通用 新）
export const entityFlow = params => {
  return naxios.request({
    url: 'flow/trendBatch',
    params
  })
}
//店员/顾客客流趋势（通用 新）
export const staffEntityFlow = params => {
  return naxios.request({
    url: 'flow/trendBatch2',
    params
  })
}
