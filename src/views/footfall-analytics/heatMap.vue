<template>
    <div class="heatMaps">
        <div v-show="drainageType===0" class="flex-box path-picker">
            <el-select style="width: 200px" v-model="drainageType" placeholder="请选择">
                <el-option
                        v-for="item in tabsList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    {{item.label}}
                </el-option>
            </el-select>
            <el-cascader
                    @change="cascaderChange"
                    collapse-tags
                    v-model="cascaderSelectList"
                    placeholder="请选择实体"
                    style="width: 200px"
                    class="m-l-10"
                    :props="{ multiple: true, checkStrictly: true,expandTrigger:'hover'}"
                    :options="cascaderTree"
            >
            </el-cascader>
            <el-select @change="dateTypeChange" class="m-l-10" style="width: 160px" v-model="dateType" placeholder="请选择">
                <el-option
                        v-for="item in dateOpitons"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    {{item.label}}
                </el-option>
            </el-select>
            <el-date-picker
                    class="m-l-10"
                    v-show="['week','month','year'].includes(dateType)"
                    v-model="dateValue"
                    value-format="yyyy-MM-dd"
                    :picker-options="{'firstDayOfWeek': 1}"
                    :type="dateType"
                    :format="dateFormat"
                    :placeholder="datePlaceholder">
            </el-date-picker>
            <el-date-picker
                    class="m-l-10"
                    v-show="dateType==='daterange'"
                    :picker-options="{'firstDayOfWeek': 1}"
                    v-model="dateValue"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    :placeholder="datePlaceholder">
            </el-date-picker>
            <vs-button  color="primary"  @click="handleClick" class="m-l-10">查询</vs-button>
            <vs-button color=""  @click="resetClick" class="ml-4 reset">重置</vs-button>
        </div>
        <div v-show="drainageType===1||drainageType===2" class="path-picker">

            <Select v-model="drainageType" class="select-type">
                <Option v-for="item in tabsList" :value="item.value" :key="item.label"
                >{{ item.label }}
                </Option>
            </Select>
            <DatePicker
            v-if="drainageType===1"
                    type="daterange"
                    v-model="dayTime"
                    placement="bottom-end"
                    placeholder="选择日期"
                    :options="disabledDate"
                    format="yyyy-MM-dd"
                    style='width:230px'
            ></DatePicker>
             <DatePicker
            v-if="drainageType===2"
                    type="date"
                    v-model="oneDayTime"
                    placeholder="选择日期"
                    :options="disabledDate"
                    format="yyyy-MM-dd"
                    style='width:230px'
            ></DatePicker>

            <Cascader :data="storeCascade" trigger="hover"
                      v-model="store"
                      ref="cascader"
                      style="width: 230px;margin-left: 10px"
                      ></Cascader>
            <div class="drainage-submit" v-on:click="searchData();initHeatMapGrid()">查询</div>
            <div class="drainage-submit drainage-reset" v-on:click="reset">重置</div>
        </div>
        <div class="content">
            <!--时段客流分布-->

            <div v-show="drainageType===0" id="passengerFlowDistribution" class="heatMapGrid" style="width:100%;height: 650px"></div>
            <div v-show="drainageType===1||drainageType===2">

                <div class="heatMap" ref="heatMap">
                    <div class="colorNumber">
                      <img :src="colorBar" alt="">
                      <p>
                        <span>{{maxNumber}}</span>
                        <span>{{minNumber}}</span>
                      </p>

                    </div>
                    <!--热力分布图-->
                    <heatmapjs-vue id="heat-grid" :max="maxValue" :min="0" :options='mapOptions' :data="heatMapDataList"></heatmapjs-vue>
                    <img  :src="map" v-if="map" id="mapImg"/>
                    <div class="noData" v-else>暂无数据</div>

                </div>
            </div>
        </div>

    </div>
</template>
<script>

import moment from 'moment'
import _ from 'lodash'
import ChartOption from '@/views/ui-elements/card/analyticsData'
import { getTimePassengerFlowDistribution, getHeatMapDistribution, getHwellTimeData } from '@/api/analysis.js'
import { disabledDate, formatEntityData, deepTraversal, findCascadeLastLevel, getUnique, findCascadeLastNode, hasHeatMapData, getCascadeFstLeaf } from '@/libs/util.js'
import { getBussinessTree, getBussinessCommon, getCascadeList } from '@/api/passenger.js'
import relevanceTab from './components/components/RelevanceTab'
let flowDistributionCharts = null
export default {
  name: 'goShop',
  components: {
    relevanceTab
  },
  data () {
    return {
      mapOptions: {
        gradient: {
          '.9': '#ec1313',
          '.8': '#e8585a',
          '.66': '#feb33d',
          '.5': '#86ef40',
          '.42': '#2bd9cf',
          '.28': '#33b3ed',
          '.15': '#7367f0'
        },
        radius: ''
      },
      maxNumber: '0',
      minNumber: '0',
      map: '',
      colorBar: require('@/assets/images/fixation_img/rest/colorBar2.webp'),
      gateIcon: require('@/assets/images/fixation_img/rest/floor-gate-icon.webp'),
      dayTime: [],
      oneDayTime: '',
      timeRange: '',
      cascaderTree: [],
      storeCascade: [],
      store: [],
      cascaderSelectList: [],
      disabledDate: '',
      drainageType: 0,
      tabsList: [
        {
          label: '时段客流分布',
          value: 0
        },
        {
          label: '客流热力图',
          value: 1
        },
        {
          label: '停留热力图',
          value: 2
        }
      ],
      dateType: 'week',
      dateOpitons: [
        {
          label: '周',
          value: 'week'
        }, {
          label: '月',
          value: 'month'
        }, {
          label: '年',
          value: 'year'
        }, {
          label: '自定义',
          value: 'daterange'
        }
      ],
      dateValue: null,
      heatMapDataList: [],
      maxValue: 0
    }
  },
  created () {
    this.disabledDate = disabledDate
    this.CascadeList()
    this.bussinessTreeReq()
  },
  watch: {
    drainageType: {
      handler (newval) {
        if (newval === 1 || newval === 2) {
          deepTraversal(this.storeCascade, 'children', (node) => {
            if (node.id === this.store[this.store.length - 1]) {
              this.map = node.map_url
            }
          })
          setTimeout(() => {
            this.initHeatMapGrid()
          })
        }
      }
    },
    dayTime (val) {
      this.outRange = moment(val[0]).format('YYYY-MM-DD') + ',' + moment(val[1]).format('YYYY-MM-DD')
    },
    oneDayTime (val) {
      this.outRange = moment(val).format('YYYY-MM-DD') + ',' + moment(val).format('YYYY-MM-DD')
    },
    '$store.state.home.headerAction' () {
      if (this.$router.currentRoute.name === 'HeatMap') {
        setTimeout(() => {
          this.reset()
        }, 2000)
      }
    }
  },
  computed: {
    isSingleDay () {
      return (this.dayTime[0] && this.dayTime[0].toString()) == (this.dayTime[1] && this.dayTime[1].toString())
    },
    dateFormat () {
      if (this.dateType === 'week') {
        return 'yyyy 第 WW 周'
      } else {
        return ''
      }
    },
    datePlaceholder () {
      switch (this.dateType) {
        case 'week':
          return '请选择周'
        case 'year':
          return '请选择年'
        case 'month':
          return '请选择月'
        default:
          return '请选择日期'
      }
    }
  },
  mounted () {
    // heatMapDistributionCharts = echarts.init(document.getElementById('heat-grid'))
    // 初始化时间
    let yesterday = moment(new Date()).format('YYYY-MM-DD')
    let yesterday1 = _.cloneDeep(yesterday)
    yesterday1 = yesterday1.split('-')
    yesterday1.splice(2, 1, '01')
    yesterday1 = yesterday1.join('-')
    var dayTime = []
    dayTime.push(yesterday)
    dayTime.push(yesterday)
    this.dayTime = dayTime
    this.oneDayTime = yesterday

    window.onresize = () => {
      flowDistributionCharts && flowDistributionCharts.resize()
    }
  },
  methods: {
    // imgLoad () {
    //   this.initHeatMapGrid()
    // },
    // 初始化热力地图分布网格
    initHeatMapGrid () {
      const params = {
        store_bzid: this.store[this.store.length - 1],
        begin_time: '',
        end_time: '',
        type: 'day'
      }
      if (this.drainageType === 1) {
        params.begin_time = moment(this.dayTime[0]).format('YYYY-MM-DD')
        params.end_time = moment(this.dayTime[1]).format('YYYY-MM-DD')
      } else if (this.drainageType === 2) {
        params.begin_time = moment(this.oneDayTime).format('YYYY-MM-DD')
        params.end_time = moment(this.oneDayTime).format('YYYY-MM-DD')
      }
      let apiData = this.drainageType === 1 ? getHeatMapDistribution(params) : getHwellTimeData(params)
      apiData.then(res => {
        res = res.data.data
        const width = this.$refs.heatMap.offsetWidth
        const height = this.$refs.heatMap.offsetHeight
        if (res.length !== 0) {
          let maxData = _.maxBy(res.list, function (o) { return o.enter_num ? o.enter_num : o.dwell_num })
          this.maxNumber = maxData.enter_num ? maxData.enter_num : maxData.dwell_num
          this.heatMapDataList = res.list.map(o => {
            return {
              x: Math.round(width * o.x_num),
              y: Math.round(height * o.y_num),
              value: o.enter_num ? o.enter_num : o.dwell_num,
              radius: Number(width * 0.09)
            }
          })
          this.maxValue = Math.max.apply(Math, this.heatMapDataList.map(item => { return item.value }))
          if (!this.maxValue) this.heatMapDataList = []
        } else {
          this.maxNumber = 0
          this.heatMapDataList = []
        }
      })
    },
    resetClick () {
      const entityPrivilege = _.cloneDeep(this.$store.state.user.business_zone_privilege)
      // entityPrivilege为空时是超级管理员
      if (entityPrivilege) {
        this.cascaderSelectList = [entityPrivilege[0]] || []
      } else {
        this.cascaderSelectList = this.cascaderTree[0] && [[this.cascaderTree[0].id]] || []
      };
      this.dateType = 'week'
      this.dateValue = moment().day('Tuesday').format('YYYY-MM-DD')
    },
    // 分时段客流分布热力查询
    handleClick () {
      const selectList = _.compact(this.cascaderSelectList && this.cascaderSelectList.map(o => {
        // 含有字符串项的为【全部】
        if (typeof o[o.length - 1] !== 'string') {
          return o[o.length - 1]
        }
      }))
      let begin_time = ''
      let end_time = ''
      switch (this.dateType) {
        case 'week':
          begin_time = moment(this.dateValue).subtract(1, 'days').format('YYYY-MM-DD')
          end_time = moment(this.dateValue).add(5, 'days').format('YYYY-MM-DD')
          break
        case 'month':
          begin_time = this.dateValue
          end_time = moment(this.dateValue).endOf('month').format('YYYY-MM-DD')
          break
        case 'year':
          begin_time = this.dateValue
          end_time = moment(this.dateValue).endOf('year').format('YYYY-MM-DD')
          break
        case 'daterange':
          begin_time = this.dateValue[0]
          end_time = this.dateValue[1]
          break
      }
      const params = {
        bzIds: selectList.toString(),
        begin_time,
        end_time
      }
      getTimePassengerFlowDistribution(params).then(res => {
        let data = []
        const workingtime = res.data.data.workingtime
        let result = res.data.data.data
        if (result && result.length) {
          result.reverse()
          result.forEach((week, weekIndex) => {
            week.list.forEach((hour, hourIndex) => {
              data.push([weekIndex, hourIndex, Math.round(hour.avg)])
            })
          })
        }
        // 将二维数组扁平化，找到最大值，设置图例
        const singleArr = data.map(o => {
          return o[2]
        })
        const maxAvg = Math.max(...singleArr)
        this.initFlowDstrbtCharts(data, maxAvg, workingtime)
      })
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
            const cascadeAuthData = _.cloneDeep(res[0].data.data).filter(o => { return o.property_id === headerAction })
            this.cascaderTree = _.compact(formatEntityData(cascadeAuthData, this.$store.state.user.role_id, this.$store.state.user.checklist))
            this.storeCascade = _.cloneDeep(this.cascaderTree)
            this.store = getCascadeFstLeaf(this.storeCascade, 'children', 'id')// 赋默认值
            this.formatCascadeAuthData()
          }
        })
      }, timeOut)
    },
    formatCascadeAuthData () {
      const entityPrivilege = _.cloneDeep(this.$store.state.user.business_zone_privilege)
      // 给级联最后一层加全部按钮
      findCascadeLastLevel(this.cascaderTree, 'children', addAll)
      function addAll (levelNode) {
        const value = Math.ceil(Math.random() * 1000)
        levelNode.unshift({
          value: 'all' + value,
          label: '全部'
        })
      }

      if (entityPrivilege === '') {
        this.resetClick()
        this.handleClick()
        return false
      }
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
      };
      this.resetClick()
      this.handleClick()
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
    // 初始化时段客流分布热力图
    initFlowDstrbtCharts (data = [], maxAvg = 100, workingtime = {}) {
      flowDistributionCharts = echarts.init(document.getElementById('passengerFlowDistribution'))
      let hours = []// 24小时
      for (let i = Number(workingtime.workStart.substring(0, 2)); i <= Number(workingtime.workEnd.substring(0, 2)); i++) {
        hours.push(`${i < 10 ? '0' + i : i}:00`)
      }
      data = data.map((item) => {
        return [item[1], item[0], item[2] || '-']
      })
      let option = _.cloneDeep(ChartOption.timeDistributeOption)
      option.visualMap.max = maxAvg
      option.series[0].data = data
      option.xAxis.data = hours
      flowDistributionCharts.setOption(option)
      flowDistributionCharts.resize()
    },
    reset () {
      let today = moment(new Date()).format('YYYY-MM-DD')
      let dayTime = [today, today]
      this.dayTime = dayTime
      this.oneDayTime = today
      // this.hourTime = moment(new Date()).format('HH')
      // this.floor = this.floorList.length > 0 ? this.floorList[0].value : ''
      this.disabled = false
      // 去除选中的小时选项背景色
      let ulList = document.getElementsByClassName('ivu-select-dropdown-list')[0].children
      for (let i in ulList) {
        if (i >= 0 && i <= 24) {
          let className = ulList[i].className
          ulList[i].className = className.replace('ivu-select-item-focus', '')
        }
      }

      try {
        window.TDAPP.onEvent(this.$route.meta.pageTitle + '页面', '重置', {})
      } catch (error) {
        console.log(this.$route.meta.pageTitle + '页面-' + '重置-埋点error:' + error)
      }
    },
    /** 查询方法 */
    searchData () {
      var time1 = moment(this.dayTime[0]).format('YYYY-MM-DD')
      var time2 = moment(this.dayTime[1]).format('YYYY-MM-DD')
      var time = time1 + ',' + time2
      if (this.drainageType === 1) {
        deepTraversal(this.storeCascade, 'children', (node) => {
          if (node.id === this.store[this.store.length - 1]) {
            this.map = node.map_url
          }
        })
      }
      try {
        window.TDAPP.onEvent(this.$route.meta.pageTitle + '页面', '数据查询', {
          '时间段': time,
          '小时数': '全天'
          // '实体选择': floor.label
        })
      } catch (error) {
        console.log(this.$route.meta.pageTitle + '页面-' + '数据查询' + '埋点error:' + error)
      }
    },
    dateTypeChange (e) {
      this.dateValue = moment().format('YYYY-MM-DD')
      switch (e) {
        case 'month':
          this.dateValue = this.dateValue.substring(0, 8) + '01'
          break
        case 'year':
          this.dateValue = this.dateValue.substring(0, 5) + '01-01'
          break
        case 'week':
          this.dateValue = moment().day('Tuesday').format('YYYY-MM-DD')
          break
      }
    }
  }
}

</script>
<style lang="less">

    .heatMaps {
        .m-l-10{
            margin-left: 10px;
        }
        .path-picker {
            margin-bottom: 20px;
            overflow: hidden;
            background-color: #fff;
            box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);
            padding: 18px 30px;
            border-radius: .5rem;
            display: flex;
            align-items: center;
            .con-select {
                clear: none;
            }

            .ivu-input {
                height: 40px;
                font-size: 14px;
                border: 1px solid rgba(0, 0, 0, .2);
                font-family: "source_han_sans_cn", "Roboto", sans-serif;
            }

            .selectExample {
                float: left;
                width: 100px;
                margin-left: 10px;
            }
            .select-type{
                float: left;
                width: 200px;
                margin-right: 10px;
            }
            .selectFloor {
                width: 150px;
            }

            .ivu-input-suffix {
                i {
                    height: 40px;
                    width: 40px;
                    line-height: 40px;
                }
            }

            .ivu-date-picker .ivu-select-dropdown {
                z-index: 90000
            }
        }
        .flex-box{
            display: flex;
            align-items: center;

            .reset {
                float: left;
                height: 41px;
                margin-top: 1px;
                background-color: #fff;
                color: #37b5ed !important;
                border: 1px solid #37b5ed !important;
            }
        }

        .drainage-submit {
            display: inline-block;
            padding: 0.75rem 2rem;
            text-align: center;
            border-radius: 6px;
            background-color: #00A0E9;
            color: #fff;
            font-size: 1rem;
            margin-left: 30px;
            cursor: pointer;

            &:hover {
                box-shadow: 0 8px 25px -8px #00A0E9;
            }
        }

        .drainage-reset {
            background: #fff !important;
            color: #37b5ed;
            border: 1px solid #37b5ed;
        }
        .ivu-select-single .ivu-select-selection {
            height: 40px;
            border: 1px solid rgba(0, 0, 0, .2);

            span {
                font-size: 1rem;
            }

        }

        .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
            line-height: 40px;
            padding-left: 20px;
        }
        .content {
            background-color: white;
            padding: 20px;

            .heatMap {
                position: relative;
                z-index: 1;
                .colorNumber{
                  position: absolute;
                  left: 0;
                  top: 0;
                  z-index: 10;
                  overflow: hidden;
                  img{
                    display: block;
                    width: auto;
                    height: auto;
                    float: left;
                  }
                  p{
                    float: left;
                    height: 130px;
                    position: relative;
                    margin-left: 5px;
                    span{
                      font-size: 14px;
                      color: #fff;
                      &:nth-child(2){
                        position: absolute;
                        left: 0;
                        bottom: 0;
                      }
                    }
                  }
                }
                #heat-grid{
                    position: absolute!important;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    top: 0;
                    z-index: 1;
                    opacity: 0.7;
                    width: 100%;
                    height: 100%;
                    background-color:rgba(65,62,223,.6) ;
                }

                .noData {
                    position: relative;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 568px;
                    line-height: 568px;
                    font-size: 32px;
                    background-color: #fff;
                    z-index: 1;
                    text-align: center;
                }

                img {
                    width: 100%;
                }

                .gateDataList {
                    position: absolute;
                    z-index: 1;

                    img {
                        width: 30px;
                        height: 30px;
                        cursor: pointer;
                    }

                    .gateDataText {
                        position: absolute;
                        background-color: #fff;
                        border-radius: 5px;
                        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);
                        padding-bottom: 10px;
                        width: 160px;
                        left: -65px;

                        p {
                            font-size: 14px;
                            color: #333;
                            line-height: 30px;
                            background-color: rgba(0, 0, 0, .04);
                            padding: 0 10px;
                            height: 30px;
                            width: 100%;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }

                        span {
                            display: inline-block;
                            width: 100%;
                            font-size: 14px;
                            margin-top: 5px;
                            color: #333;
                            padding: 0 10px;
                        }
                    }

                }
            }

        }

    }

</style>
