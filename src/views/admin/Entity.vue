<template>
    <!-- 实体管理 -->
    <div>
        <empty-Page v-if="type == 1" @addCompany="addCompany"></empty-Page>
        <div v-if="type==2">
            <div style="position:relative">
                <div v-if="hasCover == 3" class="hasCover">
                    <img :src="noBuy" class="noBuy">
                </div>
                <div class="topArea" v-bind:class="{ mohu: hasCover==3 }">
                    <Cascader :data="dataList" v-model="defaultValue"
                              change-on-select @on-change="caseDidChange" class="cascader" style="width:230px">
                    </Cascader>
                    <div class="stall-header-right">
                      <span class="stall-add" v-if="isSuperAdmin" title="添加" @click="addEntity">
                        <Icon type="md-add"/>
                      </span>
                      <span class="stall-add" v-if="isSuperAdmin" title="删除" @click="delEntity">
                          <Icon type="md-remove"/>
                      </span>
                    </div>
                    <!-- 商场列表 -->
                    <market-list v-if="addType === 1" :userLvl="userLvl" @editMail="editMail" @delMail="delMail"
                                 ref="marketlist"></market-list>
                    <!-- 楼层列表 -->
                    <area-list v-if="addType === 2" :userLvl="userLvl" @editFloor="editFloor" @delFloor="delFloor"
                               @changeDoorway='changeDoorway'
                               ref="arealist" :floorInfo="floorInfo" :parent_id="parent_id"></area-list>
                    <!-- 商铺列表 -->
                    <group-list v-if="addType === 3" :userLvl="userLvl" @editStore="editStore" @delStore="delStore"
                                @changeDoorway='changeDoorway'
                                :storeInfo="storeInfo"></group-list>

                </div>
            </div>
            <!-- 业态管理 -->
            <formats :propertyId="addmall.property_id"></formats>
            <!-- 工作人员列表 -->
            <!-- <staff-list></staff-list> -->
        </div>
        <!-- 添加商场 -->
        <add-Entity
                v-show="showAddEntity"
                ref="entityModal"
                :addmall='addmall'
                :mallList='mallList'
                :editTitle="editTitle"
                :isEmptyPage="isEmptyPage"
                :userLvl="userLvl"
                :propertyId="addmall.property_id"
                @changeEditTitle="changeEditTitle"
                @init="init"
                @alertMessage="alertMessage"
                @closeEdit="closeEdit"
                @getData="getData"
                @addTypeData="addTypeData"
                @addFloorData="addFloorData"
                @addStoreData="addStoreData"
                @updateTypeData="updateTypeData"
                @updateFloorData="updateFloorData"
                @updateStoreData="updateStoreData"
                v-cloak
        ></add-Entity>
        <alert
                v-if="isAlert"
                @closeAlert='closeAlert'
                @alertConfirm='alertConfirm'
                :alertText='alertText'
        ></alert>
    </div>
</template>
<script>
import groupList from '_c/entity/groupList.vue'
import areaList from '_c/entity/areaList.vue'
import marketList from '_c/entity/marketList.vue'
import staffList from '_c/entity/staffList.vue'
import addEntity from '_c/entity/addEntity.vue'
import emptyPage from '_c/entity/components/emptyPage.vue'
import formats from '_c/entity/formats.vue'
import alert from '@/components/alert.vue'
import _ from 'lodash'
import { setTimeout } from 'timers'
import {
  getDataEntity,
  getbusinessDate,
  deletemall,
  deleteFloor,
  deleteData
} from '@/api/manager.js'
import { initMonthsData } from '@/libs/util'
import {getGroupOrganization} from '@/api/home.js'

export default {
  name: 'entity',
  components: {
    groupList,
    areaList,
    marketList,
    staffList,
    addEntity,
    alert,
    emptyPage,
    formats
  },
  data () {
    return {
      type: 0,
      mallList: [],
      noBuy: require('@/assets/images/pages/noBuy.webp'),
      isEmptyPage: false,
      isAlert: false,
      alertText: {
        title: '',
        text: '',
        bg: '',
        confirm: false
      },
      nowEntity: [], // 当前选中的实体
      theMail: '', // 当前选中的商场
      theFloor: '', // 当前选中的楼层
      theStore: '',
      addmall: [], // 把当前购物中心传递给添加实体组件中
      delType: '',
      addType: 0,
      editTitle: '添加购物中心',
      id: '',
      entity: '',
      floor_entity: '',
      entitydata: '',
      parent_id: '',
      shoppingInfoDate: [],
      floorInfo: [],
      storeInfo: [],
      showAddEntity: false,
      treeData: [],
      cascaderCanshow: false,
      defaultValue: [],
      userLvl: '',
      currentYear: new Date().getFullYear()
    }
  },
  created () {
    let theUser = this.$store.state.user
    if (theUser.role_id < 3) {
      this.userLvl = theUser.role_id == 1 ? 'admin' : 'common_admin'
    } else {
      let menulist = JSON.parse(window.localStorage.getItem('menulist'))
      let temp = _.find(menulist, ['name', 'Admin']).subpagesList
      temp = _.find(temp, ['name', 'EntityManage']).id + ''
      if (theUser.access.indexOf(temp) > -1) {
        this.userLvl = 'common_admin'
      }
    }
  },
  watch: {
    // 监听业态变化
    '$store.state.home.bussinessDict' () {
      this.getData()
    }
  },
  computed: {
    dataList () {
      return this.treeData
    },
    isSuperAdmin () {
      return this.$store.state.user.role_id == 1
    }
  },
  mounted () {
    this.getData()
    this.$store.commit('setMall', { shoppingInfoDate: this.shoppingInfoDate })
  },
  methods: {
    addCompany () {
      this.showAddEntity = true
      this.$refs.entityModal.gettype()
    },
    changeEditTitle (value) {
      this.editTitle = value
    },
    /*
             *@params1: pArray:级联数据
             *@description:格式化级联数据
             *@author: shiyulong
             *@date: 2019-05-16 17:54:45
            */
    addValuesToEle (pArray) {
      let that = this
      // this.$vs.loading.close()
      // this.$store.commit('loadingState', false)
      return pArray.map(function (ele) {
        ele.value = ele.id
        ele.label = ele.name
        if (_.has(ele, 'children') && !_.isNull(ele.children)) {
          that.addValuesToEle(ele.children)
        }
        return ele
      })
    },
    getData () {
      var that = this
      that.id = that.$route.params.id
      getDataEntity().then(function (res) {
        if (res.data.code == 200) {
          that.entity = res.data.data.zone_type[0].id
          that.floor_entity = res.data.data.zone_type[1].id
          getbusinessDate(52).then(function (resd) {
            if (resd.data.code == 200) {
              that.type = resd.data.data.length > 0 ? 2 : 1
              that.isEmptyPage = false
              let temp = resd.data.data
              if (that.$store.state.user.role_id < 3) {
                that.treeData = that.addValuesToEle(temp)
              } else {
                let checklist = that.$store.state.user.checklist
                if (checklist) {
                  temp = temp.map(function (mm) {
                    if (checklist.indexOf(mm.property_id) > -1) return mm
                  })
                }
                that.treeData = that.addValuesToEle(temp)
              }
              that.cascaderCanshow = true
              if (that.defaultValue.length === 0) {
                if (that.treeData[0]) {
                  that.defaultValue = [that.treeData[0].value]
                  that.caseDidChange([that.treeData[0].value], [that.treeData[0]])
                }
              } else {
                let dataArr = []
                let propertyData, floorData, storeData
                that.defaultValue.forEach((list, index) => {
                  switch (index) {
                    case 0:
                      propertyData = _.find(that.treeData, (val) => {
                        return val.value === list
                      })
                      dataArr.push(propertyData)
                      break
                    case 1:
                      floorData = _.find(propertyData.children, (val) => {
                        return val.value === list
                      })
                      dataArr.push(floorData)
                      break
                    case 2:
                      storeData = _.find(floorData.children, (val) => {
                        return val.value === list
                      })
                      dataArr.push(storeData)
                      break
                  }
                })
                that.caseDidChange(that.defaultValue, dataArr)
              }
              that.mallList = that.treeData
            } else {
              that.type = 1
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    closeAlert () {
      this.isAlert = false
    },
    alertMessage (value, alertText) {
      this.isAlert = value
      this.alertText = alertText
    },
    caseDidChange (value, selectedData) {
      let that = this
      that.nowEntity = selectedData
      that.addmall = _.find(that.treeData, ['id', selectedData[0].id])
      if (value.length == 0) {
        that.addType = 0
      } else if (value.length == 1) {
        getGroupOrganization().then(function (res) {
          if (res.data.code == 200) {
            var shopping = res.data.data.property
            for (var i = 0; i < shopping.length; i++) {
              if (selectedData[0].property_id == shopping[i].property_id) {
                that.shoppingInfoDate = shopping[i]
                that.$store.commit('setMall', {
                  shoppingInfoDate: that.shoppingInfoDate
                })
                if (that.$refs.marketlist != undefined) {
                  that.$refs.marketlist.init()
                }
              }
            }
            that.addType = 1
          }
        })
      } else if (value.length == 2) {
        that.floorInfo = selectedData
        that.parent_id = value
        that.addType = 2
      } else if (value.length == 3) {
        that.storeInfo = selectedData
        this.addType = 3
      } else if (value.length == 4) {
        this.addType = 4
      }
    },
    addTypeData (res) {
      if (this.isEmptyPage) {
        this.type = 2
      }
      this.getData()
      this.treeData.push(res)
    },
    updateTypeData (res) {
      var index = _.findIndex(this.treeData, ['id', res.id])
      res.children = this.treeData[index].children
      this.treeData.splice(index, 1)
      this.treeData.push(res)
      this.getData()
    },
    /*
                    *@method 新增楼层后修改级联数据
                    *@param {int} id 楼层的parent_id
                    *@param {obj} res 新增后的楼层的信息
                    */
    addFloorData (id, res) {
      var index = _.findIndex(this.treeData, ['id', id])
      this.treeData[index].children.push(res)
      this.treeData[index].children = _.orderBy(this.treeData[index].children, ['zone_index'])
      this.getData()
    },
    addStoreData (mallId, floorId, res) {
      var mallIndex = _.findIndex(this.treeData, ['id', mallId])
      var floorIndex = _.findIndex(this.treeData[mallIndex].children, ['id', floorId])
      if (this.treeData[mallIndex].children[floorIndex].children == undefined) {
        this.treeData[mallIndex].children[floorIndex].children = []
      }
      this.treeData[mallIndex].children[floorIndex].children.push(res)
      this.getData()
    },
    updateStoreData (mallId, floorId, res) {
      var mallIndex = _.findIndex(this.treeData, ['id', mallId])
      var floorIndex = _.findIndex(this.treeData[mallIndex].children, ['id', floorId])
      var storeIndex = _.findIndex(this.treeData[mallIndex].children[floorIndex].children, ['id', res.id])
      var storeInfo = _.cloneDeep(this.storeInfo)
      storeInfo[2] = res
      this.storeInfo = storeInfo
      this.treeData[mallIndex].children[floorIndex].children.splice(storeIndex, 1, res)
      this.getData()
    },
    /*
                    *@method 编辑楼层后修改级联数据
                    *@param {int} id 楼层的parent_id
                    *@param {obj} res 编辑后的楼层的信息
                    */
    updateFloorData (id, res) {
      var index = _.findIndex(this.treeData, ['id', id])// 找到楼层父类
      var index2 = _.findIndex(this.treeData[index].children, ['id', res.id])// 找到楼层在父类中的index
      this.treeData[index].children.splice(index2, 1, res)// 替换级联楼层信息
      this.treeData[index].children = _.orderBy(this.treeData[index].children, ['zone_index'])// 排序
      this.floorInfo.splice(1, 1, res)// 替换该楼层信息
    },
    closeEdit () {
      this.showAddEntity = false
    },
    init () {
      this.$refs.marketlist.init()
    },
    addEntity () {
      this.showAddEntity = true
      this.$refs.entityModal.gettype()
      // this.editTitle = '添加购物中心';
      var that = this
      let formValidate = {
        spc: 1,
        name: '',
        floor: '',
        timerange: ['', ''],
        zones: [],
        province: '',
        city: '',
        address: '',
        parentNode: '',
        description: '',
        modal5: '',
        area: ''
      }
      setTimeout(function () {
        that.$refs.entityModal.isModify = false
        that.$refs.entityModal.disabledSpc = false
        that.$refs.entityModal.getSelectValue(1)
        that.$refs.entityModal.disabledFloor = false
        that.$refs.entityModal.disabledParentNode = false
        that.$refs.entityModal.disabledZones = false
        that.$refs.entityModal.formValidate = formValidate
        that.$refs.entityModal.sumFlowYear = ''
        that.$refs.entityModal.sumSaleYear = ''
        that.$refs.entityModal.setSaleYearGoal()
        let monthsGoal = initMonthsData('name', 'modal')
        let monthsSale = _.cloneDeep(monthsGoal)
        that.$refs.entityModal.monthsGoal = monthsGoal
        that.$refs.entityModal.monthsSale = monthsSale
      }, 200)
    },
    editFloor (values) {
      var value = _.cloneDeep(values)
      this.editTitle = '编辑楼层'
      var that = this
      value.description = value.describe
      value.parentNode = value.parent_id
      value.floor = value.zone_index
      value.spc = 2
      that.$refs.entityModal.formValidate = value
      that.$refs.entityModal.isModify = true
      that.$refs.entityModal.getSelectValue(2)
      that.$refs.entityModal.disabledSpc = true
      that.$refs.entityModal.disabledFloor = false
      that.$refs.entityModal.disabledParentNode = false
      that.$refs.entityModal.disabledZones = false
      this.showAddEntity = true
    },
    editStore (values) {
      var value = _.cloneDeep(values)
      this.editTitle = '编辑商铺'
      var that = this
      value.description = value.describe
      value.parentNode = value.parent_id
      value.floor = value.zone_index
      value.spc = 3
      that.$refs.entityModal.isModify = true
      that.$refs.entityModal.getSelectValue(3)
      that.$refs.entityModal.formValidate = value
      that.$refs.entityModal.disabledSpc = true
      that.$refs.entityModal.disabledFloor = true
      that.$refs.entityModal.disabledParentNode = true
      that.$refs.entityModal.disabledZones = true
      that.$refs.entityModal.disabledModal5 = false
      this.showAddEntity = true
      this.$refs.entityModal.gettype()
    },
    editMail (values) {
      var value = _.cloneDeep(values)
      value.area = value.goal_sale[0].area_size
      this.showAddEntity = true
      this.editTitle = '编辑购物中心'
      var that = this
      let timerange = []
      timerange.push(value.daily_start)
      timerange.push(value.daily_end)
      value.timerange = timerange

      value.province = isNaN(Number(value.province)) ? 0 : Number(value.province)
      value.city = isNaN(Number(value.city)) ? 0 : Number(value.city)
      var zones = []
      if (value.zone_id) {
        var zone_id = _.cloneDeep(value.zone_id).split(',')
        zones = zone_id.map(Number)
      } else {
        zones = []
      }
      value.zones = zones
      setTimeout(() => {
        that.$refs.entityModal.isModify = true
        that.$refs.entityModal.currentYear = this.currentYear
        let goal_flow = value.goal_flow
        let goal_sale = value.goal_sale
        let sumFlowYear = null
        let sumSaleYear = null
        that.$refs.entityModal.getSelectValue(1)
        // 获取当年的客流目标
        const currentYearGoalFlow = goal_flow.find(f => {
          return f.year === this.currentYear
        })
        if (currentYearGoalFlow.is_year == 'year') {
          that.$refs.entityModal.disabled = true
          sumFlowYear = currentYearGoalFlow.flow_year
          that.$refs.entityModal.sumFlowYear = sumFlowYear
          that.$refs.entityModal.setFlowYearGoal()
        } else {
          that.$refs.entityModal.disabled = false
          sumFlowYear = currentYearGoalFlow.flow_year
          that.$refs.entityModal.sumFlowYear = sumFlowYear
          that.$refs.entityModal.setFlowMonthGoal()
        }
        var monthFlow = currentYearGoalFlow.detail.months
        var monthFlowData = []
        monthFlow.forEach(function (m) {
          monthFlowData.push(Object.values(m)[0])
        })
        let monthsGoal = initMonthsData('name', 'modal')
        monthsGoal.forEach(function (m, index) {
          m.modal = monthFlowData[index]
        })
        // 获取当年的销售目标
        const currentYearGoalSale = goal_sale.find(s => {
          return s.year === this.currentYear
        })
        if (currentYearGoalSale.is_year == 'year') {
          that.$refs.entityModal.disabledSale = true
          sumSaleYear = currentYearGoalSale.sale_year
          that.$refs.entityModal.sumSaleYear = sumSaleYear
          that.$refs.entityModal.setSaleYearGoal()
        } else {
          that.$refs.entityModal.disabledSale = false
          sumSaleYear = currentYearGoalSale.sale_year
          that.$refs.entityModal.sumSaleYear = sumSaleYear
          that.$refs.entityModal.setSaleMonthGoal()
        }
        var monthSale = currentYearGoalSale.detail.months
        var monthSaleData = []
        monthSale.forEach(function (m) {
          monthSaleData.push(Object.values(m)[0])
        })
        let monthsSale = initMonthsData('name', 'modal')
        monthsSale.forEach(function (m, index) {
          m.modal = monthSaleData[index]
        })
        that.$refs.entityModal.monthsGoal = monthsGoal
        that.$refs.entityModal.monthsSale = monthsSale
        value.spc = 1
        that.$refs.entityModal.changeProvince(value.province)
        that.$refs.entityModal.formValidate = value
        that.$refs.entityModal.isModify = true
        that.$refs.entityModal.disabledSpc = true
      }, 200)
    },
    delMail (value, alertText, obj) {
      this.isAlert = value
      this.alertText = alertText
      this.delType = 'mall'
      this.theMail = obj
    },
    delFloor (value, alertText, obj) {
      this.isAlert = value
      this.alertText = alertText
      this.delType = 'floor'
      this.theFloor = obj
    },
    delStore (value, alertText, obj) {
      this.isAlert = value
      this.alertText = alertText
      this.delType = 'store'
      this.theStore = obj
      //
    },
    alertConfirm (value) {
      var that = this
      if (value === true) {
        that.isAlert = false
        if (that.delType == 'mall') {
          var property_id = this.theMail.property_id
          var bzid = this.theMail.bzid
          var itype = 'mall'
          deletemall(itype, property_id, bzid).then(function (res) {
            if (res.data.code === 200) {
              that.isAlert = true
              that.alertText.bg = '#00A0E9'
              that.alertText.title = '删除购物中心'
              that.alertText.text = '删除购物中心成功'
              that.alertText.confirm = false
              that.defaultValue = []
              that.getData()
            }
          })
        } else if (that.delType == 'floor') {
          let bzid = that.theFloor.id
          let itype = 'floor'
          deleteFloor(itype, bzid).then(function (res) {
            if (res.data.code === 200) {
              that.isAlert = true
              that.alertText.bg = '#00A0E9'
              that.alertText.title = '删除楼层'
              that.alertText.text = '删除楼层成功'
              that.alertText.confirm = false
              that.defaultValue = [that.defaultValue[0]]

              that.getData()
            }
          })
        } else if (that.delType == 'store') {
          let bzid = that.theStore.id
          deleteData(bzid).then(function (res) {
            if (res.data.code === 200) {
              that.isAlert = true
              that.alertText.bg = '#00A0E9'
              that.alertText.title = '删除商铺'
              that.alertText.text = '删除商铺成功'
              that.alertText.confirm = false
              that.defaultValue = [that.defaultValue[0], that.defaultValue[1]]
              that.addType = 2
              that.getData()
            }
          })
        }
      } else {
        this.isAlert = false
      }
    },
    delEntity () {
      if (this.nowEntity.length == 1) {
        let alertText = {}
        alertText.title = this.editTitle
        alertText.text = '确认删除此购物中心信息？'
        alertText.bg = '#00A0E9'
        alertText.confirm = true
        this.theMail = this.addmall
        this.theMail.bzid = this.theMail.id
        this.delMail(true, alertText, this.theMail)
      } else if (this.nowEntity.length == 2) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>删除楼层</p>',
          onOk: () => {
            deleteFloor(floor, floor_id).then(function (res) {
            })
          }
        })
      } else if (this.nowEntity.length == 3) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>删除店铺</p>',
          onOk: () => {
            deleteFloor(store, floor_id).then(function (res) {
            })
          }
        })
      } else {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>请选择商场/楼层/店铺</p>',
          onOk: () => {

          }
        })
      }
    },
    changeDoorway () {
      this.getData()
    }
  }
}
</script>

<style scope lang="scss">
    .topArea {
        .ivu-input {
            font-size: 14px;
            font-family: "source_han_sans_cn", "Roboto", sans-serif;
        }

        position: relative;
        padding: 32px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 9px 1px rgba(175, 175, 176, 0.25);
        -moz-box-shadow: 0px 2px 9px 1px rgba(175, 175, 176, 0.25);
        -webkit-box-shadow: 0px 2px 9px 1px rgba(175, 175, 176, 0.25);
        border-radius: 6px;
        -moz-border-radius: 6px;
        -webkit-border-radius: 6px;

        .stall-header-right {
            position: absolute;
            top: 40px;
            right: 20px;
            margin-top: 3.5px;

            span {
                display: inline-block;
                float: left;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                text-align: center;
                font-size: 16px;
                color: #fff;
                margin-left: 20px;
                cursor: pointer;
                margin-top: 9px;
                background-color: #00A0E9;
                position: relative;
                i{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }
                &:nth-child(1) {
                    margin-top: 9px;
                    background-color: #2BD9CF;
                }

                &:nth-child(2) {
                    margin-top: 9px;
                    background-color: #FEB33D;
                }
            }
        }

        .entity-query {
            width: 103px;
            height: 50px;
            text-align: center;
            line-height: 50px;
            border: 1px solid rgba(0, 160, 233, 1);
            border-radius: 6px;
            -moz-border-radius: 6px;
            -webkit-border-radius: 6px;
            float: left;
            margin-left: 45px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            color: rgba(0, 160, 233, 1);
            cursor: pointer;
        }
    }

    .cascader {
        .ivu-input-wrapper {
            width: 100%;

            .ivu-input {
                width: 230px;
                height: 43px;
                border: 1px solid rgba(0, 0, 0, .2);
                font-family: "source_han_sans_cn", "Roboto", sans-serif;
            }
        }
    }

    [v-cloak] {
        display: none;
    }
</style>
