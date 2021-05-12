import naxios from '@/libs/api.request'
var formatsApi = '/businesstype'
// 业态 api
export const getFormateData = id => {
  return naxios.request({
    url: formatsApi,
    method: 'get',
    params: {
      property_id: id
    }
  })
}
export const addFormateData = formatsData => {
  return naxios.request({
    url: formatsApi,
    method: 'post',
    data: formatsData,
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }
    ]
  })
}

export const updateFormateData = formatsData => {
  return naxios.request({
    url: formatsApi,
    method: 'put',
    params: formatsData
  })
}

export const deleteFormateData = (formatsData, propertyId) => {
  return naxios.request({
    url: formatsApi,
    method: 'delete',
    params: {
      id: formatsData,
      property_id: propertyId
    }
  })
}
// 获取X业态下的商铺
export const getStoreByDefaultEntity = params => {
  return naxios.request({
    url: '/get_entity_by_bt_name',
    method: 'get',
    params
  })
}
// 保存业态关联的商铺
export const saveFormateRelatedStore = data => {
  return naxios.request({
    url: '/change_bzs_type_id',
    method: 'post',
    data
  })
}
