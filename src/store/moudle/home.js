import Vue from 'vue'
import _ from 'lodash'
import { getBussinessDict,getBzoneTree,getGroupOrganization } from '@/api/home'

var savecomprotList
export default {
  state: {
    bussinessTree: null,
    propertMap: null,
    organizationData: null,///mananger/organization接口数据
    allTargetData: [],
    realTimeIndicator: {}, // 存储首页cards list 类型，数据结构如{addList:['xx','xx',],delList:['xx','xx']}
    historyIndicator: {}, // 首页历史数据指标
    bussinessDict: {},
    headerAction: '',
    headerImg: '',
    headerData: {},
    isGetDict: false,
    comprotList: [], // nav下拉框数据
    outSize: 0,
    intervalTime:'5分钟'
  },
  mutations: {
    outSize (state, value) {
      state.outSize = value
    },
    headerData (state, value) {
      state.headerData = value
    },
    headerAction (state, value) {
      state.headerAction = value
    },
    headerImg (state, value) {
      state.headerImg = value
    },
    saveBusinessTree (state, value) {
      state.bussinessTree = value
    },
    savePropertMap (state, value) {
      state.propertMap = value
    },
    saveAllTargetData (state, value) {
      state.allTargetData = value
    },
    addCard (state, { stateName, id, type }) {
      // 由于首页历史数据指标也是同样的功能，因此，add,del,init 需要多余传一个 stateName,默认是realTimeIndicator
      let tmlData = state[stateName][id].addList
      let typeIndex = _.findIndex(tmlData, o => o === type)
      state[stateName][id].delList.push(tmlData[typeIndex])
      tmlData.splice(typeIndex, 1)
    },
    delCard (state, { stateName, id, type }) {
      let tmlData = state[stateName][id].delList
      let typeIndex = _.findIndex(tmlData, o => o === type)
      if (tmlData.length <= 1) {
        alert('至少保留一项')
        return
      }
      state[stateName][id].addList.push(tmlData[typeIndex])
      tmlData.splice(typeIndex, 1)
    },
    initCardTypes (state, { stateName, id, addList, delList }) {
      // state[stateName][id] = {addList, delList}这种方法存在bug,对象新增属性是非响应式的
      Vue.set(state[stateName], id, { addList, delList })
    },
    saveBussinessType (state, value) {
      state.bussinessDict = value
    },
    isGetDict (state, value) {
      state.isGetDict = value
    },
    saveComprotList (state, arr) {
      state.comprotList = arr
    },
    saveOrganizationData (state,data){
      state.organizationData = data;
    },
    saveIntervalTime(state,intervalTime){
      state.intervalTime = intervalTime
    }
  },

  actions: {
    getDictOfBussiness ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getBussinessDict().then(res => {
          commit('saveBussinessType', res.data.data)
          resolve(res.data.data)
          commit('isGetDict', false)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateOrganizationData({state,commit}){
      return new Promise((resolve,reject)=>{
        getGroupOrganization().then(res=>{
          commit('saveOrganizationData',res.data.data||[])
          resolve(res.data.data)
        }).catch(err=>{
          reject(err)
        })
      })
    }
  }
}
