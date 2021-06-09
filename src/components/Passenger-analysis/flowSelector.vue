<template>
    <div class="flow-selector">
        <vs-row>
            <vs-col  style="width:230px;padding:0;margin-left:15px;" :vs-xs="12">
                <i-date-picker :value='queryParams.date1Array' :dType="1" @selectDate="dateSelect"></i-date-picker>
            </vs-col>
            <vs-col  style="width:230px;padding:0;margin-left:15px;" :vs-xs="12" v-if="compare" >
                 <vs-select v-model="compareType" width="230px;" autocomplete>
                    <vs-select-item
                                    v-for="(item,index) in typeOptions"
                                    :key="index"
                                    :value="item.value"
                                    :text="item.label"
                    />
                </vs-select>
            </vs-col>
            <template v-if="['time','onYear','onMonth'].includes(compareType)" >
                <vs-col  style="width:230px;padding:0;margin-left:15px;" :vs-xs="10">
                    <i-date-picker :disabled="['onYear','onMonth'].includes(compareType)"
                                   :dType="2"
                                   :value='queryParams.date2Array'
                                   @selectDate="dateSelect"></i-date-picker>
                </vs-col>
            </template>
        </vs-row>
        <vs-row  v-show="compareType === 'entity'">
            <vs-col class="mt-4">
                <vs-radio v-model="entityType" vs-value="shop" v-if="isShop" style="margin-right:1rem;">购物中心</vs-radio>
                <vs-radio v-model="entityType" vs-value="floor" v-if="isFloor" class="mr-4">楼层</vs-radio>
                <vs-radio v-model="entityType" vs-value="store" v-if="isStore" class="mr-4">商铺</vs-radio>
                <vs-radio v-model="entityType" vs-value="area" v-if="isArea" class="mr-4">区域</vs-radio>
                <vs-radio v-model="entityType" vs-value="gate" v-if="isGate">出入口</vs-radio>
            </vs-col>
        </vs-row>
        <vs-row>
          <vs-col v-if="isCascade"  style="width:230px;padding:0;margin-left:15px;" :vs-xs="12" class="mt-4">
            <div class="cascadeDom" v-if="isCascade">
                <el-cascader
                  class="cascadeSelect"
                  v-model="cascadeData"
                  collapse-tags
                  :props="{ multiple: true,expandTrigger:'hover' }"
                  :options="cascadeList"
                >
                </el-cascader>
            </div>
          </vs-col>

          <vs-col v-else  style="width:230px;padding:0;margin-left:15px;" :vs-xs="12" class="mt-4">
              <div class="cascadeDom" style="margin: 0" v-show="compareType !== 'entity'">
                  <el-cascader
                    @change="cascaderChange"
                    :key="isResouceShow"
                    v-model="cascaderSelectList"
                    collapse-tags
                    class="cascadeSelect"
                    style="width: 100%"
                    :props="{ multiple: multiple, checkStrictly: true,expandTrigger:'hover'}"
                    :options="cascaderTree"
                  >
                  </el-cascader>
              </div>
              <vs-select
                v-show="compareType === 'entity'"
                width="100%"
                v-model="selectList"
                autocomplete
                :multiple="multiple"
                placeholder="请选择实体"
                :noDataText="noData"
                :value='selectListName'
                @change="selectEntityAction"
              >
              <vs-select-item
                v-for="item in treeList"
                :value="item.value"
                :key="item.value"
                :text="item.label"
                v-bind:class="{ endAction: item.disabled }"
                :disabled="item.disabled"
              />
              </vs-select>
          </vs-col>
          <vs-col  style="width:230px;padding:0;margin-left:15px;" :vs-xs="12" v-if="footFall" class="mt-4">
              <vs-select v-model="queryParams.enterType" autocomplete width="100%">
                  <vs-select-item
                          v-for="(item,index) in customType"
                          :key="index"
                          :value="item.value"
                          :text="item.label"
                  />
              </vs-select>
          </vs-col>
          <vs-col style="width:230px;padding:0;margin-left:15px;" :vs-xs="12" class="mt-4">
              <vs-button color="primary" style="float:left;" @click="handleClick" class="btn">查询</vs-button>
              <vs-button color="" v-if="isReset" @click="resetClick" class="btn ml-4 reset">重置</vs-button>
          </vs-col>
        </vs-row>
    </div>
</template>
<script>
import Moment from 'moment'
import iDatePicker from '@/components/common/idatepicker.vue'
import { getBussinessTree, getBussinessCommon, getCascadeList } from '@/api/passenger.js'
import _ from 'lodash'
import { setTimeout } from 'timers'
import { formatEntityData, deepTraversal, findCascadeLastLevel, getUnique, findCascadeLastNode } from '@/libs/util'
export default {
  name: 'flowvs-selector',
  props: {
    compare: {
      type: Boolean,
      default: true
    },
    typeText: {
      type: String,
      default: ''
    },
    footFall: {
      type: Boolean,
      default: true
    },

    isRanking: {
      type: Boolean,
      default: false
    },
    // 开始 是否需要
    isShop: {// 控制 购物中心
      type: Boolean,
      default: false
    },
    isFloor: {// 控制 楼层
      type: Boolean,
      default: false
    },
    isStore: {// 控制 商铺
      type: Boolean,
      default: false
    },
    isArea: {// 控制 区域
      type: Boolean,
      default: false
    },
    isGate: { // 控制 出入口
      type: Boolean,
      default: false
    },
    // 结束 是否需要
    multiple: {
      type: Boolean,
      default: true
    },
    isReset: {
      type: Boolean,
      default: false
    },
    isNeedEntity: {
      type: Boolean,
      default: true
    },
    isAgeGender: {
      type: Boolean,
      default: false
    },
    routName: {
      type: String,
      default: ''
    },
      initDate:{//初始化日期（有效客流分析用）
        type:Array,
          default:()=>{
              return []
          }
      }
  },
  components: {
    iDatePicker
  },
  data () {
    return {
      isResouceShow: 0,
      isCascade: false,
      selectAll: 0,
      customType: [
        {
          value: '0',
          label: '全部客流'
        }
      ],
      entityType: 'floor',
      queryParams: {
        date1Array: [Moment().add(-1, 'd').format('YYYY-MM-DD'), Moment().add(-1, 'd').format('YYYY-MM-DD')],
        date2Array: [Moment().add(-1, 'd').format('YYYY-MM-DD'), Moment().add(-1, 'd').format('YYYY-MM-DD')],
        entitys: [],
        enterType: '0'
      },
      compareType: 'not',
      selectList: [],
      treeData: [],
      noData: '暂无数据',
      defalutEntityId: '',
      cascadeList: [],
      cascadeData: [],
      cascadeAllStore: [],
      cascaderTree: [],
      cascaderSelectList: []
    }
  },

  watch: {
    entityType () {
      var that = this
      this.selectList = []
      if (this.treeList.length > 0) {
        if (this.typeText == 'dwellText') {
          this.selectList = _.cloneDeep(that.treeList.map(o => {
            return o.id
          }))
        } else {
          // setTimeout(() => {
          //   this.selectList = _.cloneDeep(that.treeList.map(o => {
          //     return o.id
          //   }))
          // })
          this.selectList = [that.treeList[0].id]
        }
      }
    },
    compareType () {
      var that = this
      this.selectList = []
      // 在此处判断是否含有全部实体
      if (this.compareType == 'entity') {
        if (this.routName == 'sales') {
          this.entityType = 'shop'
        } else if (this.routName == 'entity' || this.routName == 'ageGender') {
          this.isShop = false
        } else  {
          this.entityType = 'floor'
        }
        this.selectList = []
        if (this.treeList.length != 0)  this.selectList = [that.treeList[0].id]
        if (this.isShop) {
          this.entityType = 'shop'
        } else if (this.isFloor) {
          this.entityType = 'floor'
        } else if (this.isStore) {
          this.entityType = 'store'
        } else if (this.isArea) {
          this.entityType = 'area'
        } else if (this.isGate) {
          this.entityType = 'gate'
        }
        if (this.routName == 'dwellTime') {
          this.entityType = 'shop'
            this.selectList = _.cloneDeep(that.treeList.map(o => {
            return o.id
          }))
        }
      } else {
        if (this.routName == 'entity' || this.routName == 'ageGender') {
          this.isShop = true
        }
        if (this.typeText == 'effective') {
          this.cascaderSelectList = [this.cascaderTree[0].id]
        } else {
          this.cascaderSelectList = [[this.cascaderTree[0].id]]
        }
        switch (this.compareType) {
          case 'onYear':
            this.queryParams.date2Array = [Moment(this.queryParams.date1Array[0]).add(-1, 'y').format('YYYY-MM-DD'), Moment(this.queryParams.date1Array[1]).add(-1, 'y').format('YYYY-MM-DD')]
            break
          case 'onMonth':
            this.queryParams.date2Array = [Moment(this.queryParams.date1Array[0]).add(-1, 'M').format('YYYY-MM-DD'), Moment(this.queryParams.date1Array[1]).add(-1, 'M').format('YYYY-MM-DD')]
            break
        }
        this.isCascade = false
        this.selectList = [that.treeList[0].id]
      }
    },
    '$store.state.home.headerAction' () {
      this.resetClick()
      let routerName = this.$router.currentRoute.name
      if (routerName === 'SalesAnalytics' || routerName === 'Entity' || routerName === 'AgeGender' ||
      routerName === 'Ranking' || routerName === 'Effective' || routerName === 'DwellTime'
      ) {
        this.bussinessTreeReq()
        this.CascadeList()
      }
    },
    '$store.state.home.bussinessDict' () {
      this.CascadeList()
    },
    // 给cascaderSelectList赋默认值（单选or多选两种情况）
    cascaderTree: {
      handler (newval, oldval) {
        if (newval && newval.length) {
          const entityPrivilege = _.cloneDeep(this.$store.state.user.business_zone_privilege)
          // entityPrivilege为空时是超级管理员
          if (entityPrivilege) {
            this.cascaderSelectList = this.multiple ? [entityPrivilege[0]] || [] : entityPrivilege[0] || []
          } else {
            this.cascaderSelectList = this.multiple ? this.cascaderTree[0] && [[this.cascaderTree[0].id]] || [] : this.cascaderTree[0] && [this.cascaderTree[0].id] || []
          }
          this.handleClick()
          this.isResouceShow = this.isResouceShow + 1
        }
      },
      immediate: true
    }

  },
  computed: {
     selectListName(){
      let nameArr = []
      this.selectList.map((val)=>{
       let name =  _.filter(this.treeList,(o)=>{
          return val===o.value
        })[0].label
        nameArr.push(name)
      })
      return nameArr
    },
    treeList () {
      let list = []
      if (this.compareType !== 'entity' && this.multiple) {
        this.isCascade = false
        var o = {
          value: 0,
          id: 0,
          label: '全部实体'
        }
        list.push(o)
      } else {
        if (this.routName == 'ranking' || this.routName == 'ageGender' || this.routName == 'entity') {
          var o = {
            value: 0,
            id: 0,
            label: '全部实体'
          }
          list.push(o)
        }
        this.entityType == 'store' ? this.isCascade = true : this.isCascade = false
      }
      let shoppingId = this.$store.state.home.headerAction
      for (const e of this.treeData) {
        if (e.property_id == shoppingId) {
          if (this.isShop) {
            if (this.entityType === 'shop' || this.compareType !== 'entity') {
              e.value = e.id
              e.id = e.id
              e.label = e.name
              e.name = e.name
              e.itype = 'shop'
              e.belongsType = '购物中心'
              list.push(e)
            }
          }
          if (e.children) {
            for (const i of e.children) {
              i.value = i.id
              i.id = i.id
              i.label = i.name
              i.name = i.name
              i.itype = 'floor'
              i.belongsType = '楼层'
              if (this.isFloor) {
                if (this.entityType === 'floor' || this.compareType !== 'entity') {
                  list.push(i)
                }
              }

              if (i.gate && this.isGate) { // 是否需要出入口
                for (const g of i.gate) {
                  g.value = g.id
                  g.id = g.id
                  g.label = g.name
                  g.name = g.name
                  g.itype = 'gate'
                  g.belongsType = '出入口'
                  if (this.entityType === 'gate' || this.compareType !== 'entity') {
                    list.push(g)
                  }
                }
              }
              if (i.area && this.isArea) {
                for (const a of i.area) {
                  a.value = a.id
                  a.id = a.id
                  a.label = a.name
                  a.name = a.name
                  a.itype = 'area'
                  a.belongsType = '区域'
                  if (this.entityType === 'area' || this.compareType !== 'entity') {
                    list.push(a)
                  }
                }
              }
              if (i.children) {
                for (const f of i.children) {
                  f.value = f.id
                  f.id = f.id
                  f.label = f.name
                  f.name = f.name
                  f.itype = 'store'
                  f.belongsType = '商铺'
                  if (this.isStore) {
                    if (this.entityType === 'store' || this.compareType !== 'entity') {
                      list.push(f)
                    }
                  }
                }
              }
            }
          }
        }
      }
      list = _.cloneDeep(list)
      return list
    },
    typeOptions () {
      let options = [
        {
          value: 'not',
          label: '无对比'
        },
        {
          value: 'time',
          label: '自定义时间对比'
        },
        {
          value: 'onYear',
          label: '同比'
        },
        {
          value: 'onMonth',
          label: '环比'
        }
      ]
      if (this.isNeedEntity) {
        options.splice(1, 0, {
          value: 'entity',
          label: '实体对比'
        })
      }
      return options
    }
  },
  created () {
      if(this.initDate.length){
          this.queryParams.date1Array = this.initDate;
      }
  },
  mounted () {
    this.CascadeList()
    this.bussinessTreeReq()
  },
  methods: {
    cascaderChange (e) {
      const allList = e.filter(o => {
        return JSON.stringify(o).indexOf('all') > -1
      })
      // 获取选中了全部的父级节点数组
      const parentIdList = allList.map(o => {
        return o[1]
      })
      if (parentIdList.length) {
        findCascadeLastNode(this.cascaderTree, 'children', (node) => {
          // 有cascadeValue字段的为普通节点，不是【全部】节点
          if (parentIdList.includes(node.parent_id) && node.cascadeValue) {
            this.cascaderSelectList.push(node.cascadeValue)
          }
        })
        // 去重
        this.cascaderSelectList = getUnique(this.cascaderSelectList)
        // 防止视图不更新
        const cascaderSelectList = _.cloneDeep(this.cascaderSelectList)
        this.cascaderSelectList = []
        setTimeout(() => {
          this.cascaderSelectList = cascaderSelectList
        })
      }
    },
    bussinessTreeReq () {
      let timeOut = this.$store.state.user.accountLvl == 'store' ? 2000 : 0
      setTimeout(() => {
        const headerAction = this.$store.state.home.headerAction
        Promise.all([
          getBussinessTree({ entity: 52 }),
          getBussinessCommon({ entity: 52 })
        ]).then(res => {
          if (headerAction != 0) {
            const cascadeAuthData = _.cloneDeep(res[0].data.data).filter(o => { return o.property_id === headerAction })// 找到当前购物中心的treeData
            this.formatCascadeAuthData(cascadeAuthData)
            this.treeData = res[0].data.data
          }
        })
      }, timeOut)
    },
    CascadeList () {
      let propertyId = this.$store.state.home.headerAction
      let accoutLvl = this.$store.state.user.accoutLvl
      if (accoutLvl == 'floor' || accoutLvl == 'store' || propertyId == 0) return false
      getCascadeList({ property_id: propertyId }).then(res => {
        if (res.data.code == 200) {
          this.cascadeList = []
          this.cascadeAllStore = []
          let data = res.data.data
          let cascadeList = Object.keys(data)
          cascadeList.forEach(list => {
            let obj = {}
            obj.value = list
            obj.label = list
            obj.children = []
            data[list].forEach(shop => {
              let shopObj = {}
              shopObj.value = shop.id
              shopObj.label = shop.name
              shopObj.name = shop.name
              this.cascadeAllStore.push(shopObj)
              obj.children.push(shopObj)
            })
            this.cascadeList.push(obj)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    pushIdList () {
      let that = this
      if (that.treeList.some(e => e.id === 0)) {
        if (that.treeList.length == 1) {
          that.defalutEntityId = that.treeList[0].id
        } else {
          if (that.isRanking == false) {
            that.defalutEntityId = that.treeList[1].id
          } else {
            if (that.routName == 'ranking') that.defalutEntityId = that.treeList[0].id
            else that.defalutEntityId = that.treeList[2].id
          }
        }
      } else {
        if (that.treeList.length != 0) {
          if (that.routName == 'ranking') {
            if (that.treeList.length > 1) that.defalutEntityId = that.treeList[0].id
          } else {
            that.defalutEntityId = that.treeList[0].id
          }
        }
      }
      this.selectList = []
      this.selectList = [that.treeList[0].id]
      setTimeout(() => {
        this.handleClick()
      })
    },
    dateSelect (date, shortname, dType) {
      date[0] = Moment(date[0]).format('YYYY-MM-DD')
      date[1] = Moment(date[1]).format('YYYY-MM-DD')
      if (dType === 1) {
        this.queryParams.date1Array = date
        if (this.compareType === 'onYear') {
          this.queryParams.date2Array = [Moment(date[0]).add(-1, 'y').format('YYYY-MM-DD'), Moment(date[1]).add(-1, 'y').format('YYYY-MM-DD')]
        }
        if (this.compareType === 'onMonth') {
          this.queryParams.date2Array = [Moment(date[0]).add(-1, 'M').format('YYYY-MM-DD'), Moment(date[1]).add(-1, 'M').format('YYYY-MM-DD')]
        }
      }
      if (dType === 2) this.queryParams.date2Array = date
    },
    handleClick () {
      if (!this.queryParams.date1Array.length || !this.queryParams.date1Array[0]) {
        let alertText = this.compareType === 'time' ? '请选择比较时间1' : '请选择比较时间'
        alert(alertText)
        return
      }
      // if (this.compareType === 'time' && !this.queryParams.date2Array.some(e => e !== '')) { // 2019-03-19更换选择器
      //   alert('请选择比较时间2')
      //   return
      // }
      let entitys = []
      // 判断是否是实体对比
      if (this.compareType == 'entity') {
        if (this.entityType == 'store') {
          this.cascadeData.map(list => {
            let obj = {}
            obj.itype = 'store'
            obj.id = list[1]
            obj.label = _.find(this.cascadeAllStore, (v) => v.value == list[1]).label
            obj.name = obj.label
            obj.belongsType = '商铺'
            entitys.push(obj)
          })
        } else {
          let copySelect = _.cloneDeep(this.selectList)
          if (!Array.isArray(copySelect)) {
            copySelect = Array.of(copySelect)// 单选的时候会通不过验证
          }
          if (this.$store.state.home.headerAction != 0) {
            if (!copySelect) {
              alert('请选择实体')
              return
            }
          } else {
            return false
          }
          copySelect.forEach(e => {
            let tml = _.find(this.treeList, (o) => o.value === e)
            if (tml != 0) entitys.push(tml)
          })
        }
      } else {
        let selectList = []
        // 拿到选择节点的id(数组的最后一个元素)
        if (this.multiple) {
          selectList = _.compact(this.cascaderSelectList && this.cascaderSelectList.map(o => {
            // 含有字符串项的为【全部】
            if (typeof o[o.length - 1] !== 'string') {
              return o[o.length - 1]
            }
          }))
        } else {
          selectList = this.cascaderSelectList && [this.cascaderSelectList[this.cascaderSelectList.length - 1]]
        }
        function getEntityObj (node) {
          if (selectList.includes(node.id)) {
            entitys.push({
              id: node.id,
              label: node.label,
              name: node.name,
              itype: node.itype,
              belongsType: node.belongsType,
              property_id:node.property_id
            })
          }
        }
        deepTraversal(this.cascaderTree, 'children', getEntityObj)
      }

      this.queryParams.entitys = entitys
      this.queryParams.compareType = this.compareType
      this.$emit('on-change', this.queryParams)
    },
    // 重置
    resetClick () {
      try {
        window.TDAPP.onEvent(this.$route.meta.pageTitle + '页面', '重置', {})
      } catch (error) {
        console.log(this.$route.meta.pageTitle + '页面-' + '重置-埋点error:' + error)
      }
      this.compareType = 'not'
      this.entityType = 'floor'
      if (this.multiple) {
        if (this.routName == 'ranking') {
          this.compareType = 'entity'
          if (this.treeList.length !== 0) this.selectList = [this.treeList[0].id]
        } else {
          if (this.treeList[1].length > 0) this.selectList = [this.treeList[1].id]
        }
      } else {
        this.$nextTick(() => {
          if (this.treeList.length !== 0) this.selectList = this.treeList[0].id
        })
      }
      this.cascaderSelectList = []
      // 重置当前第一个日期控件的时间为昨天
      let yesterday = Moment(new Date()).add(-1, 'day').format('YYYY-MM-DD')
      this.dateSelect([yesterday, yesterday], '', 1)
    },
    // 监听选择实体
    selectEntityAction (value) {
      var that = this
      let totalLength = that.treeList.length
      if (totalLength == 1) {
        if (that.treeList[0].id == 0) return false
      }
      if (this.compareType != 'entity') {
        if (totalLength.length == 1) return false
      }
      if ((totalLength - value.length) == 1 && value.indexOf(0) != -1) {
        this.selectAll = 0
        that.selectList = _.filter(value, (e) => {
          return e != 0
        })
      }
      if (this.selectAll == 1 && value.indexOf(0) == -1) {
        this.selectAll = 0
        that.selectList = []
      }
      if (_.last(value) == 0) {
        let arr = that.treeList.map((l) => {
          return l.value
        })
        this.selectAll = 1
        that.selectList = arr
      }
    },
    formatCascadeAuthData (data) {
      this.cascaderTree = _.compact(formatEntityData(data, this.$store.state.user.role_id, this.$store.state.user.checklist))
      if (this.typeText === 'dwellText') {
        this.cascaderTree.forEach(list => {
          list.children.forEach(l => {
            _.remove(l.children, (value) => { return value.itype == 'gate' })
          })
        })
      } else if (this.typeText === 'sales') {
        this.cascaderTree.forEach(list => {
          delete list.children
        })
      }
      const entityPrivilege = _.cloneDeep(this.$store.state.user.business_zone_privilege)
      // 给级联最后一层加全部按钮
      if (this.routName == 'entity' || this.routName == 'ageGender' || this.routName == 'dwellTime') {
        findCascadeLastLevel(this.cascaderTree, 'children', addAll)
      }
      function addAll (levelNode) {
        const vlaue = Math.ceil(Math.random() * 1000)
        levelNode.unshift({
          value: 'all' + vlaue,
          label: '全部'
        })
      }
      if (entityPrivilege === '') return false
      /** *************处理楼层权限***************/
      // 所有商铺(叶子)
      const leaves = entityPrivilege.filter(o => {
        return o.length === 3
      })
      // 所有商铺所属楼层,并深度去重（2级节点）
      const leavesParent = _.uniqBy(leaves.map(o => {
        o = _.cloneDeep(o)
        o.pop()
        return o
      }), JSON.stringify)
      // 得到的数组和实体权限对比，得到的差值为没有权限的楼层节点
      const invalidLeavesParent = _.differenceWith(leavesParent, entityPrivilege, _.isEqual)
      // 得到楼层节点id
      const invalidFloorIds = invalidLeavesParent.map(o => {
        o = _.cloneDeep(o)
        o.shift()
        return o[0]
      })
      /** *************处理购物中心权限***************/
      // 所有楼层所属购物中心,并深度去重（1级节点）
      const roots = _.uniqBy(entityPrivilege.map(o => {
        o = _.cloneDeep(o)
        return [o.shift()]
      }), JSON.stringify)
      // 得到的数组和实体权限对比，得到的差值为没有权限的购物中心节点
      const invalidRoots = _.differenceWith(roots, entityPrivilege, _.isEqual).flat()
      // 合并楼层和购物中心全部没有权限的节点
      const invalidNodes = invalidFloorIds.concat(invalidRoots)
      // 深度遍历，将没有权限的节点禁用
      deepTraversal(this.cascaderTree, 'children', disabledNode)
      function disabledNode (node) {
        if (node && invalidNodes.includes(node.id)) node.disabled = 'disabled'
      }
      if (this.cascaderTree[0]) {
        const firNode = this.cascaderTree[0].id
        const secNode = this.cascaderTree[0].children && this.cascaderTree[0].children[0] && this.cascaderTree[0].children[0].id
        const thNode = this.cascaderTree[0].children && this.cascaderTree[0].children[0] && this.cascaderTree[0].children[0].children && this.cascaderTree[0].children[0].children[1] && this.cascaderTree[0].children[0].children[1].id
        this.cascaderSelectList = this.multiple ? [_.compact([firNode, secNode, thNode])] : _.compact([firNode, secNode, thNode])
        this.$forceUpdate()
      }
    }
  }
}
</script>
<style lang="less">
.is-reverse{
  position: absolute;
  right: 0;
  top: 27px!important;
  height: 14px;
}
.el-icon-arrow-down{
   position: absolute;
  right: 0;
  top: 0;
  height: 14px;
}
.flow-selector{
  padding:18px 0 0 ;
}
    .cascadeDom {
        height: 43px;
        border-radius: 5px;
        overflow: hidden;
        border: 1px solid rgba(0, 0, 0, .2);
    }

    .cascadeSelect {
        background-color: #fff;
        width: 100%;
        height: 42px;
        .el-cascader__tags {
            top: 10px;
            transform: translateY(0%);
        }

        input {
            border: none;
            font-size: 1rem;
            background-color: #fff;
        }

    }

    .vs-select--options ul {
        &:nth-child(2) {
            display: none;
        }
    }

    .endAction {
        background-color: #f5f5f5;
    }

    .reset {
        float: left;
        height: 41px;
        margin-top: 1px;
        background-color: #fff;
        color: #37b5ed !important;
        border: 1px solid #37b5ed !important;
    }
</style>
