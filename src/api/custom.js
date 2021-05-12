import naxios from '@/libs/api.request'

export const getCustomer = params => {
  const {page, limit, name, tel, range, times, isNew, sex, type, mendianid} = params
  return naxios.request({
    url: '/mananger/custom',
    method: 'get',
    params: {
      page,
      limit,
      name,
      tel,
      range,
      times,
      isNew,
      sex,
      type,
      mendianid
    }
  })
}
export const exportExcel = () => {
  // const {page, limit, name, tel, range, times, isNew, sex, type, mendianid} = params
  return naxios.request({
    url: '/excel',
    method: 'get',
    params: {
      // page,
      // limit,
      // name,
      // tel,
      // range,
      // times,
      // isNew,
      // sex,
      // type,
      // mendianid
    }
  })
}
export const getRolesList = (property_id) => {
  return  naxios.request({
    url: "/mananger/roles",
    method: 'get',
    params: {
      property_id
    }
   })
 }
 export const delRole = (id) => {
  return  naxios.request({
     url: "/mananger/roles",
     method: 'delete',
     params: {
       id
    }
   })
 }
export const addRoles = params => {
  const { name, describ, pages_privilege, metric_privilege, property_id} = params
  return naxios.request({
    url: '/mananger/roles',
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }
    ],
    data: {
      name,
      describ,
      pages_privilege,
      metric_privilege,
      property_id
    },
    method: 'post'
  })
}
export const updateRoles = params => {
  const { name, describ, pages_privilege, metric_privilege, property_id,id} = params
  return naxios.request({
    url: '/mananger/roles',
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }
    ],
    data: {
      name,
      describ,
      pages_privilege,
      metric_privilege,
      property_id,
      id
    },
    method: 'put'
  })
}


export const addCustomer = params => {
  const { avatar, name, age, mobile, ismale, type, feature, remark, mendianid } = params
  return naxios.request({
    url: '/mananger/custom',
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }
    ],
    data: {
      avatar,
      name,
      age,
      mobile,
      ismale,
      type,
      feature,
      remark,
      mendianid
    },
    method: 'post'
  })
}
export const updateCustomer = params => {
  const {avatar, name, age, mobile, ismale, type, feature, remark, mendianid, id} = params
  return naxios.request({
    url: '/mananger/customedit',
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }
    ],
    data: {
      avatar,
      name,
      age,
      mobile,
      ismale,
      type,
      feature,
      remark,
      mendianid,
      id
    },
    method: 'post'
  })
}
export const delCustomer = params => {
  const {id} = params
  return naxios.request({
    url: '/mananger/delcustom',
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }
    ],
    data: {
      id: id
    },
    method: 'post'
  })
}
export const clearAllVipRecord = () => {
  return naxios.request({
    url: "/customer/custom_tips_qingkong",
    transformRequest: [
      function(data) {
        let ret = "";
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        return ret;
      }
    ],
    data: {
    },
    method: "post"
  });
};
export const readVipRecord = params => {
  const { id } = params;
  return naxios.request({
    url: "/customer/custom_tips_all_readme",
    transformRequest: [
      function(data) {
        let ret = "";
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        return ret;
      }
    ],
    data: {
      id
    },
    method: "post"
  });
};

export const getVipRecord = (keyword,page,limit) => {
 return  naxios.request({
    url: "/customer/custom_tips",
    method: 'get',
    params: {
      keyword,
      page,
      limit
    }
  })
}
export const getComingData = (id,range) => {
  return  naxios.request({
     url: "/coming/list",
     method: 'get',
     params: {
      customer_object_id:id,
      range:range,
     }
   })
 }
 export const getMenuList = async () => {
  return  await naxios.request({
     url: "/authority",
     method: 'get',
   })
 }
