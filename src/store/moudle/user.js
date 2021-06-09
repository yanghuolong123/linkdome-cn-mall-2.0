import { logout } from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import { readVipRecord } from '@/api/home.js'
export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    lvl: '', // 废弃
    checklist: '',
    bzid: '',
    realName: '',
    mobile: '',
    email: '',
    sex: '',
    companyId: '',
    loading: false,
    vipRecordNumber: 0,
    shoppingInfoDate: '',
    VIPNoRead: '',
    allType: [],
    areaList: [],
    requestNumber: 0,
    role_id: '',
    role_name: '',
    role_property: '1',
    shopUserName: '',
    accountLvl:"",
    business_zone_privilege:[],//实体权限

  },
  mutations: {
    shopUserName (state, value) {
      state.shopUserName = value
    },
    allType (state, value) {
      state.allType = value
    },
    setRequestNumber (state, value) {
      state.requestNumber = value
    },
    setVIPNoRead (state, value) {
      state.VIPNoRead = value
    },
    setRole (state, value) {
      state.role_id = value
    },

    setRoleName (state, value) {
      state.role_name = value
    },
    setRoleProperty (state, value) {
      state.role_property = value
    },
    setMall (state, payload) {
      state.shoppingInfoDate = payload.shoppingInfoDate
    },
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setBzid (state, id) {
      state.bzid = id
    },
    setAreaList (state, obj) {
      state.areaList = obj
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccountLvl (state, obj) {
      state.accountLvl = obj
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, status) {
      // state.token = status.token
      const { token, isRememberMe } = status
      if (isRememberMe)setToken(token, 7)
      else setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setlvl (state, lvl) {
      state.lvl = lvl
    },
    setchecklist (state, checklist) {
      state.checklist = checklist
    },
    setrealName (state, realName) {
      state.realName = realName
    },
    setmobile (state, mobile) {
      state.mobile = mobile
    },
    setemail (state, email) {
      state.email = email
    },
    setSex (state, sex) {
      state.sex = sex
    },
    setCompanyId (state, companyId) {
      state.companyId = companyId
    },
    setLoading (state, status) {
      state.loading = status
    },
    setVipRecordNumber (state, number) { // 从retail移植
      state.vipRecordNumber = number
    },
    setEntityPrivilege (state, privilege){
      state.business_zone_privilege = privilege
    },
    decreasRecordNumber (state, isClearAll) {
      if (isClearAll)state.vipRecordNumber = 0
      else {
        state.vipRecordNumber--
        if (state.vipRecordNumber < 0)state.vipRecordNumber = 0
      }
    }

  },
  actions: {

    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('setToken', '')
            commit('setAccess', [])
            resolve()
          })
          .catch(err => {
            reject(err)
          })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    decreasRecordNumber ({ commit }, { id }) {
      return new Promise((resolve, reject) => {
        readVipRecord({ id }).then(res => {
          let isClearAll = false
          if (id.toString().split(',').length > 1)isClearAll = true// 判断用户是选择多个还是单选
          commit('decreasRecordNumber', isClearAll)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
