import axios from '@/libs/api.request'
var userApi = '/mananger/user'
var activeApi = '/mananger/active'
var fetchCompanyApi = '/mananger/company'
var groupApi = '/mananger/organization'
var entityManagerApi = '/mananger/businesstree'
var typedicApi = '/typedic'
var businesstreeApi = '/mananger/businesstree'
var zonesApi = '/zones'
var gatesApi = '/gates'
var holidayAnalysisApi = '/data/holidayAnalysis'

// user manager
export const getUserData = () => {
  return axios.request({
    url: userApi,
    method: 'get',
    params: {
    }
  })
}

export const addUserData = user => {
  return axios.request({
    url: userApi,
    method: 'post',
    data: user,
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

export const updateUserData = user => {
  return axios.request({
    url: userApi,
    method: 'put',
    params: user
  })
}

export const deleteUserData = userId => {
  return axios.request({
    url: userApi,
    method: 'delete',
    params: {
      id: userId
    }
  })
}

// active manager
// 20 holiday 21 active

export const getActiveDays = (year, type, propertyId) => {
  return axios.request({
    url: activeApi,
    method: 'get',
    params: {
      date: year,
      type_id: type,
      property_id: propertyId
    }
  })
}

export const addActiveDays = event => {
  return axios.request({
    url: activeApi,
    method: 'post',

    data: event
  })
}
export const updateActiveDays = event => {
  return axios.request({
    url: activeApi,
    method: 'put',

    params: event
  })
}

export const deleteActiveDays = eventId => {
  return axios.request({
    url: activeApi,
    method: 'delete',

    params: {
      id: eventId
    }
  })
}

// entity manager
// company
export const fetchCompany = () => {
  return axios.request({
    url: entityManagerApi,
    method: 'get'
  })
}
export const setCompany = () => {
  return axios.request({
    url: fetchCompanyApi,
    method: 'post'
  })
}

export const delCompany = () => {
  return axios.request({
    url: fetchCompanyApi,
    method: 'del'
  })
}

export const addEntity = model => {
  return axios.request({
    url: groupApi,
    method: 'post',
    data: {
      name: model.name,
      address: model.address
    }
  })
}

export const getDataEntity = model => {
  return axios.request({
    url: typedicApi,
    method: 'get'
  })
}

export const getbusinessDate = entity => {
  return axios.request({
    url: businesstreeApi,
    method: 'get',
    params: {
      entity: entity
    }
  })
}

export const floorInfo = (ids, entitys) => {
  return axios.request({
    url: businesstreeApi,
    method: 'get',
    params: {
      id: ids,
      entity: entitys
    }
  })
}

export const zones = (id) => {
  return axios.request({
    url: zonesApi,
    method: 'get',
    params: {
      property_id: id
    }
  })
}

export const gatesList = () => {
  return axios.request({
    url: gatesApi,
    method: 'get'
  })
}

// 节日对比
export const holidayAnalysis = (type, bzid, year) => {
  return axios.request({
    url: holidayAnalysisApi,
    method: 'get',
    params: {
      type,
      bzid,
      year
    }
  })
}

//后台管理->配置图片，点位
export const configEntity =  (data) => {
  return  axios.request({
    url: '/config/entity',
    method:'post',
    data
  })
}

//摄像头图片查询
export const getCameraImageUrl =  (params) => {
  return  axios.request({
    url: '/config/camera',
    params
  })
}
//出入口类型
export const getGateTypeList =  (params) => {
  return  axios.request({
    url: '/mananger/gate',
    params
  })
}
export const getIndustry = params => {
  return axios.request({
    url: '/bzone/industry',
    params
  })
}
/*实体管理  20230309*/

//修改购物中心
export const updateShopmall = (id,data) => {
  return axios.request({
    method: 'put',
    url: `/property/${id}`,
    data
  })
}
//添加实体
export const createEntity = (data) => {
  return axios.request({
    method: 'post',
    url: `/bzone`,
    data
  })
}
//修改实体
export const updateEntity = (id,data) => {
  return axios.request({
    method: 'put',
    url: `/bzone/${id}`,
    data
  })
}
//删除实体
export const delEntity = (id) => {
  return axios.request({
    method: 'delete',
    url: `/bzone/${id}`,
  })
}

