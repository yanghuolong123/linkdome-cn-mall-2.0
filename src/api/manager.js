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

export const getAllDate = model => {
  return axios.request({
    url: groupApi,
    method: 'post',
    data: {
      name: model.name,
      address: model.address
    }
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

// 添加排队 区域 出入口
export const addAreas = (ids, property_id, name, parent_id, zones, business_type_id, area_size, description) => {
  return axios.request({
    url: businesstreeApi,
    method: 'post',
    data: {
      itype: ids,
      property_id: property_id,
      name: name,
      parent_id: parent_id,
      zones: zones,
      business_type_id: business_type_id,
      area_size: area_size,
      description: description
    }
  })
}
// 修改商铺
export const updateAreas = (ids, property_id, name, parent_id, zones, business_type_id, area_size, description, bzid) => {
  return axios.request({
    url: businesstreeApi,
    method: 'put',
    data: {
      itype: ids,
      property_id: property_id,
      name: name,
      parent_id: parent_id,
      zones: zones,
      business_type_id: business_type_id,
      area_size: area_size,
      bzid: bzid,
      description: description
    }
  })
}
// 添加出入口
export const addGate = (property_id, name, parent_id, gateId, description) => {
  return axios.request({
    url: businesstreeApi,
    method: 'post',
    data: {
      itype: 'gate',
      property_id: property_id,
      name: name,
      parent_id: parent_id,
      gate_id: gateId,
      description: description
    }
  })
}

// 添加商场
export const addmall = (ids, companyId, name, province, city, address, description,
  flowType, sumFlow, saleType, sumSale, zones, daily_start, daily_end, obj, obj2, area_size, years) => {
  return axios.request({
    url: businesstreeApi,
    method: 'post',
    data: {
      itype: ids,
      company_id: companyId,
      name: name,
      province: province,
      city: city,
      address: address,
      description: description,
      flow_type: flowType,
      sum_flow: sumFlow,
      sale_type: saleType,
      sum_sale: sumSale,
      zones: zones,
      daily_start: daily_start,
      daily_end: daily_end,
      flow_target_1: obj.Jan,
      flow_target_2: obj.Feb,
      flow_target_3: obj.Mar,
      flow_target_4: obj.Apr,
      flow_target_5: obj.May,
      flow_target_6: obj.Jun,
      flow_target_7: obj.Jul,
      flow_target_8: obj.Aug,
      flow_target_9: obj.Sep,
      flow_target_10: obj.Oct,
      flow_target_11: obj.Nov,
      flow_target_12: obj.Dec,
      sale_target_1: obj2.Jan,
      sale_target_2: obj2.Feb,
      sale_target_3: obj2.Mar,
      sale_target_4: obj2.Apr,
      sale_target_5: obj2.May,
      sale_target_6: obj2.Jun,
      sale_target_7: obj2.Jul,
      sale_target_8: obj2.Aug,
      sale_target_9: obj2.Sep,
      sale_target_10: obj2.Oct,
      sale_target_11: obj2.Nov,
      sale_target_12: obj2.Dec,
      area_size: area_size,
      year: years
    }
  })
}

// 编辑商场
export const updateMallrData = (ids, companyId, name, province, city, address, description,
  flowType, sumFlow, saleType, sumSale, zones, daily_start, daily_end, obj, obj2, area_size, years, bzid, property_id) => {
  return axios.request({
    url: businesstreeApi,
    method: 'put',
    params: {
      itype: ids,
      company_id: companyId,
      name: name,
      province: province,
      city: city,
      address: address,
      description: description,
      flow_type: flowType,
      sum_flow: sumFlow,
      sale_type: saleType,
      sum_sale: sumSale,
      zones: zones,
      daily_start: daily_start,
      daily_end: daily_end,
      flow_target_1: obj.Jan,
      flow_target_2: obj.Feb,
      flow_target_3: obj.Mar,
      flow_target_4: obj.Apr,
      flow_target_5: obj.May,
      flow_target_6: obj.Jun,
      flow_target_7: obj.Jul,
      flow_target_8: obj.Aug,
      flow_target_9: obj.Sep,
      flow_target_10: obj.Oct,
      flow_target_11: obj.Nov,
      flow_target_12: obj.Dec,
      sale_target_1: obj2.Jan,
      sale_target_2: obj2.Feb,
      sale_target_3: obj2.Mar,
      sale_target_4: obj2.Apr,
      sale_target_5: obj2.May,
      sale_target_6: obj2.Jun,
      sale_target_7: obj2.Jul,
      sale_target_8: obj2.Aug,
      sale_target_9: obj2.Sep,
      sale_target_10: obj2.Oct,
      sale_target_11: obj2.Nov,
      sale_target_12: obj2.Dec,
      area_size: area_size,
      year: years,
      bzid: bzid,
      property_id: property_id
    }
  })
}

// 添加楼层
export const addtype = (
  ids,
  propertyId,
  name,
  parent_id,
  zones,
  zone_index,
  description
) => {
  return axios.request({
    url: businesstreeApi,
    method: 'post',
    data: {
      itype: ids,
      property_id: propertyId,
      name: name,
      parent_id: parent_id,
      zones: zones,
      zone_index: zone_index,
      description: description
    }
  })
}

// 编辑楼层 区域
export const updateFloorData = (
  name,
  parent_id,
  zones,
  zone_index,
  description,
  bzid
) => {
  return axios.request({
    url: businesstreeApi,
    method: 'put',
    params: {
      name: name,
      parent_id: parent_id,
      zones: zones,
      zone_index: zone_index,
      description: description,
      bzid: bzid
    }
  })
}

// 编辑出入口
export const updateFloorGate = (property_id, name, parent_id, gateId, description, bzid) => {
  return axios.request({
    url: businesstreeApi,
    method: 'put',
    params: {
      itype: 'gate',
      property_id: property_id,
      name: name,
      parent_id: parent_id,
      gate_id: gateId,
      description: description,
      bzid: bzid
    }
  })
}

export const deleteData = bzid => {
  return axios.request({
    url: businesstreeApi,
    method: 'delete',
    params: {
      bzid: bzid
    }
  })
}
// 删除出入口
export const deleteGate = (gateId, itype) => {
  return axios.request({
    url: businesstreeApi,
    method: 'delete',
    params: {
      gate_id: gateId,
      itype: itype
    }
  })
}

// 删除商场
export const deletemall = (itype, propertyId, bzid) => {
  return axios.request({
    url: businesstreeApi,
    method: 'delete',
    params: {
      itype: itype,
      property_id: propertyId,
      bzid: bzid
    }
  })
}
// 删除楼层
export const deleteFloor = (itype, floorId) => {
  return axios.request({
    url: businesstreeApi,
    method: 'delete',
    params: {
      itype: itype,
      bzid: floorId
    }
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
