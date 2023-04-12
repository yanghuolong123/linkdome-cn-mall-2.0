import naxios from "@/libs/api.request";

//实体客流分析（通用 新）
export const entityFlow = (params) => {
  return naxios.request({
    url: "flow/trendBatch",
    params,
  });
};
//实体客流分析 （按分钟查询）
export const entityFlowMin = (params) => {
  return naxios.request({
    url: "flow/dimensionTrend",
    params,
  });
};
//天气趋势
export const weatherTrend = (params) => {
  return naxios.request({
    url: "weather/trend",
    params,
  });
};
