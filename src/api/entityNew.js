import naxios from '@/libs/api.request'
import qs from 'qs'
//实体客流分析（通用 新）
export const entityFlow = params => {
  return naxios.request({
    url: 'flow/trendBatch',
    params
  })
}
