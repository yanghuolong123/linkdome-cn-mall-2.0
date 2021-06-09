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
