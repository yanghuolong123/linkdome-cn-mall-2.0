import naxios from '@/libs/api.request'

export const getTableData = () => {
  return naxios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return naxios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}
