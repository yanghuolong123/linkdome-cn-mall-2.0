import axios from '@/libs/api.request'
var userApi = '/mananger/user'
var activeApi = '/activity'
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

export const getActiveDays = (params) => {
  return axios.request({
    url: activeApi,
    method: 'get',
    params
  })
}

export const addActiveDays = event => {
  return axios.request({
    url: activeApi,
    method: 'post',

    data: event
  })
}
export const updateActiveDays = (data,id) => {
  return axios.request({
    url: activeApi+`/${id}`,
    method: 'put',
    data
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

//数据补录列表
export const getRecordList = params => {
  return axios.request({
    url: '/addcounting/task',
    params
  })
}
export const delRecordData = (data) => {
  return axios.request({
    method: 'delete',
    url: `/addcounting/task`,
    data
  })
}
export const createRecord = (data) => {
  return axios.request({
    method: 'post',
    url: `/addcounting/task`,
    data
  })
}
export const updateRecord = (id,data) => {
  return axios.request({
    method: 'put',
    url: `/addcounting/task/${id}`,
    data
  })
}
//热力图虚拟点位配置
export const configPoint =  (data) => {
  return  axios.request({
    url: '/heatmap/configPoint',
    method:'post',
    data
  })
}
export const heatmapShow =  (params) => {
  return  axios.request({
    url: '/heatmap/show',
    params
  })
}
export const getConfigPoint =  (params) => {
  return  axios.request({
    url: '/heatmap/configPoint',
    params
  })
}
//路径动线　点位列表
export const getTrailPoint =  (params) => {
  return  axios.request({
    url: '/trail/points',
    params
  })
}
export const setTrailPoint =  (data) => {
  return  axios.request({
    url: '/trail/conf',
    method:'post',
    data
  })
}
export const getTrailPointConfig =  (params) => {
  return  axios.request({
    url: '/trail/conf',
    params
  })
}
