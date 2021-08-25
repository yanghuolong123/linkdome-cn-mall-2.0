<template>
  <div>
    <div class="selector-container bg-white box-card">
      <div class="flex-center">
        <DatePicker
          type="daterange"
          @on-change="dateChange"
          v-model="crossDate"
          placement="bottom-end"
          :options="disabledDate"
          :placeholder="$t('holder.选择日期')"
          class="w-select"
        ></DatePicker>
        <vs-select
          class="w-select m-l-20"
          autocomplete
          @change="selectTypeChange"
          v-model="selectType"
        >
        <vs-select-item
          v-for="(item,index) in typeListCom"
          :value="item.value"
          :text="$t(item.text)"
          :key="index"
        />
        </vs-select>
        <DatePicker
          type="daterange"
          v-model="crossDateTwo"
          placement="bottom-end"
          :placeholder="$t('holder.选择日期')"
          :options="disabledDate"
          :disabled="[2,3].includes(selectType)"
          class="w-select m-l-20"
          v-if="selectType !== 0"
        ></DatePicker>
      </div>
      <div class="flex-center">
        <el-cascader
          v-model="startValue"
          :placeholder="$t('holder.选择起点')"
          popper-class="cascade-dom"
          class="w-select"
          collapse-tags
          @change="selectStart()"
          :props="{ multiple: true, checkStrictly: true,expandTrigger:'hover'}"
          :options="startList">
        </el-cascader>
        <el-cascader
          v-model="endValue"
          popper-class="cascade-dom"
          :placeholder="$t('holder.选择终点')"
          @change="selectEnd('endValue')"
          class="w-select m-l-20"
          collapse-tags
          :props="{ multiple: true, checkStrictly: true,expandTrigger:'hover'}"
          :options="endList">
        </el-cascader>
        <Button size="large" class="m-l-20" type="primary" @click="paramsPrepare">{{ $t('查询') }}</Button>
        <Button size="large" class="m-l-20" @click="resetData">{{ $t('重置') }}</Button>
      </div>
    </div>
    <!-- 标题数据 -->
    <div class="cross_analysis_time">
      <div :key="index" v-for="(item,index) in timeList">
        <img :src="item.icon" alt="">
        <div class="tootipsTitle">
          <span class="cross_time_name">{{ $t(item.name) }}</span>
          <Tooltip class="m-l-20"  :content="$t(item.tootipText)"  placement="bottom" theme="light" transfer max-width="600">
            <icons type="wenhao"/>
          </Tooltip>
        </div>
        <p class="cross_time_data"><span>{{showTimeOne}}</span> {{item.data}}</p>
        <p class="scale-data" v-if="selectTyepConfirm !==0" v-bind:class="{ scaleAction: item.isActive }">
          <span>{{showTimeTwo}}</span>
          <Icon type="md-arrow-dropup" v-if="item.isActive"/>
          <Icon type="md-arrow-dropdown"  v-else />
          {{item.contrast}} %
        </p>
      </div>
    </div>
    <div v-if="selectTyepConfirm == 0" class="cross_analysis">
      <p v-if="noData" class="noData">{{ $t('holder.暂无数据') }}</p>
      <div class="cross_analysis_title"><p>{{ $t('交叉客流路径') }}</p></div>
      <!-- 最大客流 -->
      <div class="cross_analysis_title" style="margin-top:30px;">
        <p>{{ $t('最大客流路径') }}</p>
      </div>
      <div class="progress-title">
        <div class="progress-text" :key="index" v-for="(item,index)  in maxEnterList">
          <p>{{ $t(item.name) }}</p>
          <span>{{ $t('fn.累计客流', [item.data]) }}</span>
        </div>
        <div style='clear:both;'></div>
        <div class="progress-center" :style='{left:marginLeft+"%"}'>
          {{ $t('fn.转化率', [percentData]) }}
        </div>
        <div class="arrows">

        </div>
      </div>
      <vs-progress :percent="percentData" :height="10" color="#A2DAF4"></vs-progress>
      <!-- 交叉客流图形 -->
      <vChart v-if="isGraph" style="width:115%!important;height:600px;"   ref="graphChart" :options="polar"/>
    </div>
    <div class="cross_analysis">
      <div class="cross_analysis_title">
        <p>{{ $t('数据指标趋势') }}</p>
      </div>
      <div class="dwell-time-icon">
        <vs-select
          class="selectExample"
          autocomplete
          v-model="lineType"
          @change="selectLineType"
        >
          <vs-select-item
            v-for="(item,index) in lineTypeList"
            :value="item.value"
            :text="$t(item.text)"
            :key="index"
          />
        </vs-select>
        <span :key="index" v-for="(icon,index) in iconList" v-on:click="iconClick(index)">
          <icons
            :title="iconTitle[icon.type]"
            :type="icon.type"
            :size="20"
            :color="iconIndex === index ? iconColor :'#9D9D9DFF'"
          ></icons>
        </span>
      </div>
      <div style="height:415px;overflow: hidden;position:relative">
        <div class="line-show" v-bind:class="{ crossLineActive: iconIndex ==0 }">
        <p v-if="lineNoData" class="noData">{{ $t('holder.暂无数据') }}</p>
        <vue-apex-charts
          v-bind:class="{ crossLineChart: lineType ==0 }"
          class="chartLine"
          ref="lineChart"
          v-if="isLine"
          width='100%'
          height='400'
          id='siteTraffic'
          :options="siteTraffic.chartOptions"
          :series="siteTraffic.series">
        </vue-apex-charts>
        <vue-apex-charts
          v-bind:class="{ crossLineChartAvg: lineType ==1 }"
          class="chartLine"
          ref="lineChartAvg"
          v-if="isLine"
          width='100%'
          height='400'
          id='siteTrafficAvg'
          :options="siteTrafficAvg.chartOptions"
          :series="siteTrafficAvg.series">
        </vue-apex-charts>
      </div>
      <div class="cross-table-line" style="height: 400px;" v-bind:class="{ crossTableActive: iconIndex ==1 }">
        <table-default :tableName='tableName'  :tableList='tableList'></table-default>
      </div>
      </div>
    </div>
    <alert
      v-if="isAlert"
      @closeAlert ='closeAlert'
      @alertConfirm ='closeAlert'
      :alertText='alertText'
    ></alert>
  </div>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'
import { getBussinessTree } from '@/api/passenger.js'
import { crossData } from '@/api/analysis'
import TableDefault from '../ui-elements/table/TableDefault.vue'
import alert from '@/components/alert.vue'
import moment from 'moment'
import NP from 'number-precision'
import _ from 'lodash'
import { disabledDate, formatEntityData,initTimes } from '@/libs/util.js'
export default {
  name: 'Cross',
  components: {
    VueApexCharts,
    TableDefault,
    alert,
    vChart: VueECharts
  },
  data () {
    let that = this
    return {
      selectType: 0,
	    selectTyepConfirm:0,
      noData: true,
      lineNoData: true,
      showTimeOne: '',
      showTimeTwo: '',
      typeList: [],
      isGraph: false,
      isLine: false,
      percentData: 0,
      marginLeft: 0,
      lineType: 0,
      lineTypeList: [
        {
          text: '客流转化深度',
          value: 0
        }
        // {
        //   text: '平均客流转化时长',
        //   value: 1
        // }
      ],
      tableList: [],
      tableName: ['时间', '客流量'],
      iconList: [
        {
          type: 'zhexiantu',
          color: '#9D9D9DFF'
        },
        {
          type: 'biaoge-copy',
          color: '#9D9D9DFF'
        }
      ],
      iconTitle: {
        'zhexiantu': '折线图',
        'biaoge-copy': '详细数据'
      },
      iconIndex: 0,
      iconColor: 'rgb(34, 128, 215)',
      maxEnterList: [
        {
          name: ' ',
          data: 0
        },
        {
          name: ' ',
          data: 0
        }
      ],
      timeList: [
        {
          icon: require('@/assets/images/fixation_img/rest/total.png'),
          name: '起点累计客流',
          data: '',
          contrast: '',
          isActive: true,
          tootipText: '为起点所有实体的客流之和'
        },
        {
          icon: require('@/assets/images/fixation_img/rest/cross-enter.png'),
          name: '客流转化深度',
          data: '',
          contrast: '',
          isActive: true,
          tootipText: '进入起点的人去目的实体的平均游逛深度'
        },
        {
          icon: require('@/assets/images/fixation_img/rest/cross-enter1.png'),
          name: '转化客流量',
          data: '',
          contrast: '',
          isActive: true,
          tootipText: '所有从起点实体到终点实体的客流总和'
        }
        // {
        //   icon: require('@/assets/images/fixation_img/rest/cross-enter3.webp'),
        //   name: '平均客流转化时长',
        //   data: '',
        //   contrast: '',
        //   isActive: true,
        //   tootipText: '顾客从起点到终点的滞留时长'
        // }
      ],
      polar: {
        title: {},
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',

          formatter (value) {
            if (value.data.source) {
              return value.data.source + ' - ' + value.data.target + ': ' + value.data.slewRate + '%'
            } else {
              // var data = that.polarData(value.name)
              // return value.name + ': ' + data
            }
          }

        },
        color: [
          // '#E8585A', '#FEB33D', '#2BD9CF', '#33B3ED', '#7367F0',
          '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'
        ],
        series: [
          {
            type: 'sankey',
            data: [
              // { 'name': 'Agr' },
              // { 'name': 'Bio' },
              // { 'name': 'Liquid' },
              // { 'name': 'Losses' }
            ],

            links: [
              // { 'source': 'Agr', 'target': 'Liquid', 'value': 32 },
              // { 'source': 'Bio', 'target': 'Losses', 'value': 20 }

            ],
            focusNodeAdjacency: 'allEdges',
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: '#aaa'
              }
            },
            lineStyle: {
              normal: {
                color: 'source',
                curveness: 0.5
              }
            }
          }
        ],
        animationDuration: 2000
      },
      siteTraffic: {
        
        series: [
          {
            name: '客流转化深度',
            data: []
          }
        ],
        chartOptions: {
          colors: ['#897FF0', '#00A0E9', '#EA5455', '#FF9F43', '#1E1E1E'],
        plotOptions: {
          bar: {
            horizontal: true,
            endingShape: 'rounded',
            columnWidth: '20%'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        markers: {
          size: [4]
        },
        
        xaxis: {
          categories: [],
          labels: {
                    offsetX: 0 // 720
          },
          axisBorder: {
            show: false
          }
        },
        yaxis: {
          title: {
            text: ''
          },
          min: 0,
          labels: {
            show: true,
            formatter: (value) => {
            
              // if(val===0) return 0
              if (typeof (value) === 'number') {
              return Number(Math.ceil(value)).toLocaleString()
              } else {
                return value
              }
            }
          }
        },
        // noData: {
        //   text: '暂无数据',
        //   align: 'center',
        //   verticalAlign: 'middle',
        //   offsetX: 0,
        //   offsetY: 0,
        //   style: {
        //     color: undefined,
        //     fontSize: '14px',
        //     fontFamily: undefined
        //   }
        // },
        fill: {
          opacity: 1
        },
        chart: {
          toolbar: {
            show: false
          }
        },
        tooltip: {
          y: {
              formatter: function (val) {
                return val + '%'
              }
            }
        }
        
        
        }
      },
      siteTrafficAvg: {
        series: [
          {
            name: '平均客流转换时长',
            data: []
          }

        ],
        chartOptions: {
          chart: {
            toolbar: { show: false }

          },
          stroke: {
            curve: 'smooth',
            width: 2
          },
          legend: {
            show: false

          },
          markers: {
            size: 4,
            hover: {
              size: 5
            }
          },
          xaxis: {
            labels: {
              style: {
                cssClass: 'text-grey fill-current'
              }
            },
            axisTicks: {
              show: false
            },
            categories: [],
            axisBorder: {
              show: false
            }
          },
          yaxis: {
            title: {
              text: '平均客流转换时长'
            },
            labels: {
              show: true,
              formatter: (value) => {
                return initTimes(value)
              }
            }
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return initTimes(val)
              }
            }
          }
        }
      },
      crossDate: [moment().add(-1, 'd').format('YYYY-MM-DD'), moment().add(-1, 'd').format('YYYY-MM-DD')],
      startValue: [],
      crossDateTwo: [moment().add(-1, 'd').format('YYYY-MM-DD'), moment().add(-1, 'd').format('YYYY-MM-DD')],
      startList: [],
      endValue: [],
      endList: [],
      isAlert: false,
      allData: '',
      alertText: {
        title: '',
        text: '',
        bg: '',
        confirm: false
      },
      disabledDate: ''
    }
  },
  computed: {
    fromBzid () {
      return this.startValue.map(o => { return o[1] }).flat()
    },
    toBzid () {
      return this.endValue.map(o => { return o[1] }).flat()
    },
    typeListCom() {
      this.typeList = [
        {
          text: this.$t('无对比'),
          value: 0
        },
        {
          text: this.$t('自定义对比'),
          value: 1
        }, {
          text: this.$t('同比'),
          value: 2
        }, {
          text: this.$t('环比'),
          value: 3
        }
      ]
      return this.typeList
    },
  },
  created () {
    this.disabledDate = disabledDate
  },
  watch: {
    '$store.state.home.headerAction' () {
      this.resetData()
      let routerName = this.$router.currentRoute.name
      if (routerName === 'Cross') {
        this.allZoneList()
      }
    }
  },
  mounted () {
    this.isGraph = true
    this.isLine = true
    window.onresize = this.onResize
    this.allZoneList()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    // 切换对比方式
    selectTypeChange (value) {
      this.dateChange(this.crossDate)
    },
    dateChange (date) {
      if (this.selectType === 2) { // 同比
        this.crossDateTwo = [moment(date[0]).add(-1, 'y').format('YYYY-MM-DD'), moment(date[1]).add(-1, 'y').format('YYYY-MM-DD')]
      }
      if (this.selectType === 3) { // 环比
        const size = moment(date[0]).diff(moment(date[1]), 'days') - 1
        this.crossDateTwo = [moment(date[0]).add(size, 'd').format('YYYY-MM-DD'), moment(date[1]).add(size, 'd').format('YYYY-MM-DD')]
      }
    },
    // 起点终点相互禁用对方选项
    cascaderChange (value) {
      const that = this
      function conversionEndlistNodeStatus (node) {
        if (node.itype === 'floor') return// 楼层总是禁用状态
        if (value === 'startValue') node.disabled = that.fromBzid.includes(node.id)
        else node.disabled = that.toBzid.includes(node.id)
      }
      if (value === 'startValue') {
        this.endList
        this.fromBzid.forEach
        // deepTraversal(this.endList, 'children', conversionEndlistNodeStatus)
      } else {
        // deepTraversal(this.startList, 'children', conversionEndlistNodeStatus)
      }
    },
    onResize () {
      if (this.isGraph) this.$refs.graphChart.resize()
      if( this.$refs.lineChart) this.$refs.lineChart.resize()
      if(this.$refs.lineChartAvg) this.$refs.lineChartAvg.resize()
    },
    paramsPrepare () { // 点击查询
      var time1, time2
      if (this.startValue.length === 0) {
        this.alert(this.$t('请选择起点'))
        return false
      }
      if (this.endValue.length === 0) {
        this.alert(this.$t('请选择终点'))
        return false
      }
      this.iconIndex = 0
      time1 = moment(this.crossDate[0]).format('YYYY-MM-DD') + ',' +
      moment(this.crossDate[1]).format('YYYY-MM-DD')
      this.showTimeOne = moment(this.crossDate[0]).format('YYYY-MM-DD') + ' - ' +
      moment(this.crossDate[1]).format('YYYY-MM-DD')
      let range
      if (this.selectType === 0) {
        time2 = ''
        this.showTimeTwo = ''
        range = this.gotInnerRange(time1.split(','))
      } else {
        time2 = moment(this.crossDateTwo[0]).format('YYYY-MM-DD') + ',' +
        moment(this.crossDateTwo[1]).format('YYYY-MM-DD')
        this.showTimeTwo = moment(this.crossDateTwo[0]).format('YYYY-MM-DD') + ' - ' +
        moment(this.crossDateTwo[1]).format('YYYY-MM-DD')
        let timeType1 = this.gotInnerRange(time1.split(','))
        let timeType2 = this.gotInnerRange(time2.split(','))
        if (timeType1 == 'Month' || timeType2 == 'Month') range = 'Month'
        else range = 'Date'
      }
      this.lineType = 0
      this.isLine = true

      this.crossDataList(time1, time2, this.fromBzid.join(','), this.toBzid.join(','), range)

    },
    getCascadeData (cascadeValue, cascadeList) {
      let arr = []
      cascadeValue.map(item => {
        cascadeList.map(list => {
          if (list.id == item[0]) {
            list.children.map(val => {
              if (val.id == item[1]) {
                arr.push(list.label + '/' + val.label)
              }
            })
          }
        })
      })
      return arr
    },
    crossDataList (time1, time2, from_bzid, to_bzid, range) { // 请求数据
      var that = this
      crossData({ time1, time2, from_bzid, to_bzid, range })
        .then(res => {
          this.selectTyepConfirm = this.selectType
          var data = res.data.data
          that.crossTitleData(data)
          // 画交叉客流
          if (that.selectType === 0) that.crossGraphData(data)
          that.allData = data
          that.lineData(data, range)
          that.avgDuration(data, range)
        }).catch(err => {
          console.log(err)
        })
    },
    formatCascadeAuthData (data) {
      this.startList = _.compact(formatEntityData(data, this.$store.state.user.role_id, this.$store.state.user.checklist))
      this.startList = this.startList[0] && this.startList[0].children
      this.startList.forEach(o => { o.disabled = true })
      // 去掉没有商铺的楼层
      for (let i = 0; i < this.startList.length; i++) {
        if (!this.startList[i].children || !this.startList[i].children.length) {
          this.startList.splice(i, 1)
          i--
        }
      }
      this.endList = _.cloneDeep(this.startList)
    },
    allZoneList () { // 所有 商铺 楼层 出入口 数据
      getBussinessTree({ entity: 52 }).then(res => {
        const cascadeAuthData = res.data.data.filter(o => { return o.property_id === this.$store.state.home.headerAction })// 找到当前购物中心的treeData
        this.formatCascadeAuthData(cascadeAuthData)
      }).catch(err => {
        console.log(err)
      })
    },
    crossTitleData (data) { // 标题数据
      var that = this
      // 起点累计客流
      var tpc = _.cloneDeep(data.matrixList)
      tpc = _.uniqBy(tpc, 'source')
      that.timeList[0].data = _.sumBy(tpc, function (o) { return o.realFlow }).toLocaleString()
      var lpf = data.compareRateLPF ? data.compareRateLPF : 0
      that.timeList[0].contrast = NP.times(Number(lpf), 100)
      lpf >= 0 ? that.timeList[0].isActive = true : that.timeList[0].isActive = false
      // 客流转化深度
      that.timeList[1].data = NP.times(Number(data.passengerConverRate), 100) + '%'
      var pcr = data.compareRatePCR ? data.compareRatePCR : 0
      that.timeList[1].contrast = NP.times(Number(pcr), 100)
      pcr >= 0 ? that.timeList[1].isActive = true : that.timeList[1].isActive = false
      // 转化客流量
      that.timeList[2].data = data.converPassengerFlow.toLocaleString()
      var cpf = data.compareRateCPF ? data.compareRateCPF : 0
      that.timeList[2].contrast = NP.times(Number(cpf), 100)
      cpf >= 0 ? that.timeList[2].isActive = true : that.timeList[2].isActive = false

      // 平均时长转换率
      // that.timeList[3].data = that.dateTiem(data.avgTranTime)
      // var att = data.compareRateATT ? data.compareRateATT : 0
      // that.timeList[3].contrast = NP.times(Number(att), 100)
      // att >= 0 ? that.timeList[3].isActive = true : that.timeList[3].isActive = false
    },
    crossGraphData (data) { // 交叉客流
      var that = this
      that.polar.series[0].data = []
      //  创建最大值对象
      var maxList = {}
      maxList.data = 0
      maxList.name = ''

      var allTotal = {}
      allTotal.data = 0
      allTotal.name = ''

      var allName = []
      // 交叉客流 数据列表
      that.polar.series[0].links = []
      data.matrixList.map(function (cl) {
        if (cl.value !== 0) {
          allName.push(cl.source)
          allName.push(cl.target)
          var obj = {}
          obj.source = cl.source
          obj.target = cl.target
          var size = NP.divide(cl.value, cl.realFlow).toFixed(3)
          obj.value = cl.value
          obj.slewRate = Number(NP.times(size, 100))
          obj.realFlow = cl.realFlow
          that.polar.series[0].links.push(obj)
        }
      })
      that.polar.series[0].links.map(res => {
        if (res.value > maxList.data) {
          maxList.data = res.value
          maxList.name = res.target
          allTotal.name = res.source
          allTotal.data = res.realFlow
        }
      })

      allName = _.uniq(allName)
      allName.map(function (n) {
        var obj = {}
        obj.name = n
        that.polar.series[0].data.push(obj)
      })
      that.maxEnterList = []
      that.maxEnterList.push(allTotal)
      that.maxEnterList.push(maxList)
      // 计算 转化率 位置
      var percent = Number((that.maxEnterList[1].data / that.maxEnterList[0].data).toFixed(3))
      if (_.isNaN(percent)) {
        that.percentData = 0
        that.marginLeft = 0
      } else {
        let size = NP.times(Number(percent), 100)
        that.percentData = size
        if (size < 5) {
          that.marginLeft = 0
        } else if (size > 5 || size < 95) {
          that.marginLeft = size - 3
        } else if (size > 95) {
          that.marginLeft = 95
        }
      }
      if (that.polar.series[0].links.length !== 0) {
        that.polar.series[0].links.map(function (v) {
          if (v.value === 0) that.noData = true
          else that.noData = false
        })
      } else {
        that.noData = true
      }

      that.maxEnterList.map(list => {
        list.data = list.data.toLocaleString()
      })
    },
    // 选择 线 类型
    selectLineType (value) {
      var that = this
      this.iconIndex = 0
      var dataList = this.allData
      if (value === 0) {
        that.tableList = []
        that.tableName = ['时间', that.$t('客流转化深度')+' ( % )']
        dataList.everyDateConvrRate.map(function (m) {
          m.data.map(function (d) {
            var table = {}
            table.time = m.name + ' ( ' + d.date + ' )'
            table.avg = NP.times(Number(d.convetRate), 100)
            that.tableList.push(table)
          })
        })
      } else {
        that.tableList = []
        that.tableName = ['时间', '平局客流转换时长']
        dataList.everyDateAvgTranTime.map(function (m) {
          m.data.map(function (d) {
            var table = {}
            table.time = m.name + ' ( ' + d.date + ' )'
            table.avg = that.initTimes(d.avgConverTime)
            that.tableList.push(table)
          })
        })
      }
    },
    // 客流转化深度 线与表格
    lineData (data, range) {
      var that = this
      that.siteTraffic.series = []
      that.siteTraffic.chartOptions.xaxis.categories = []
      that.tableList = []
      that.tableName = ['时间',that.$t('客流转化深度')+' ( % )']
      data.everyDateConvrRate.map(function (m, kIndexs) {
        var obj = {}
        obj.name = m.name
        obj.data = []
        m.data.map(function (d, index) {
          obj.data.push(NP.times(Number(d.convetRate), 100))
          var table = {}
          if (kIndexs === 0) {
            var time1 = moment(that.crossDate[0]).format('YYYY-MM-DD')
            var time2 = moment(that.crossDate[1]).format('YYYY-MM-DD')
            if (time1 === time2) {
              table.time = d.date
            } else {
              table.time = m.name + '(' + d.date + ')'
            }
          } else {
            var time1 = moment(that.crossDateTwo[0]).format('YYYY-MM-DD')
            var time2 = moment(that.crossDateTwo[1]).format('YYYY-MM-DD')
            if (time1 === time2) {
              table.time = d.date
            } else {
              table.time = m.name + '(' + d.date + ')'
            }
          }
          table.avg = NP.times(Number(d.convetRate), 100)
          that.tableList.push(table)
        })
        that.siteTraffic.series.push(obj)
        that.lineNoData = false
      })
      if(that.siteTraffic.series[1]){
        let maxLength
        if(that.siteTraffic.series[0].data.length> that.siteTraffic.series[1].data.length){
          maxLength = that.siteTraffic.series[0].data
        }else{
          maxLength = that.siteTraffic.series[1].data
        }
        maxLength.forEach((list,index)=>{
          if(!that.siteTraffic.series[0].data[index]&&that.siteTraffic.series[0].data[index]!==0){
            that.siteTraffic.series[0].data.push(0)
          }
          if(!that.siteTraffic.series[1].data[index]&&that.siteTraffic.series[1].data[index]!==0){
            that.siteTraffic.series[1].data.push(0)
          }
        })
      }
    
      var type = that.selectType
      var data1 = data.everyDateConvrRate[0].data
      var data2
      if (data.everyDateConvrRate[1]) {
        data2 = data.everyDateConvrRate[1].data
      } else {
        data2 = []
      }
      var dataList
      data1.length > data2.length ? dataList = data1 : dataList = data2
      dataList.map( (n, index)=> {
        var num, size = Number(index) + 1, dateList
        dateList = range == 'Month' ? this.$t('fn.第_月',[ size ]):this.$t('fn.第_天',[ size])
        type === 0 ? num = n.date : num = dateList
        that.siteTraffic.chartOptions.xaxis.categories.push(num)
      })
      that.$refs.lineChart.updateOptions({
        xaxis: { categories: that.siteTraffic.chartOptions.xaxis.categories }
      })
      var time1 = moment(this.crossDate[0]).format('YYYY-MM-DD')
      var time2 = moment(this.crossDate[1]).format('YYYY-MM-DD')
      var time3 = moment(this.crossDateTwo[0]).format('YYYY-MM-DD')
      var time4 = moment(this.crossDateTwo[1]).format('YYYY-MM-DD')
      var width = document.getElementById('siteTraffic').offsetWidth
      var number = Math.round((width / 2) * 100) / 100 - 50
      if (type == 0) {
        if (time1 == time2) {
          that.lineXaxisType(number, false)
        } else {
          that.lineXaxisType(0, true)
        }
      } else {
        if (time1 == time2 && time3 == time4) {
          that.lineXaxisType(number, false)
        } else {
          that.lineXaxisType(0, true)
        }
      }
    },
    // 平局客流转换时长
    avgDuration (data, range) {
      var that = this
      that.siteTrafficAvg.series = []
      that.siteTrafficAvg.chartOptions.xaxis.categories = []
      data.everyDateAvgTranTime.map(function (m) {
        var obj = {}
        obj.name = m.name
        obj.data = []
        m.data.map(function (d) {
          obj.data.push(d.avgConverTime)
        })
        that.siteTrafficAvg.series.push(obj)
      })
      
      that.lineNoData = false
      var type = that.selectType
      var data1 = data.everyDateConvrRate[0].data
      var data2
      if (data.everyDateConvrRate[1]) {
        data2 = data.everyDateConvrRate[1].data
      } else {
        data2 = []
      }
      var dataList
      data1.length > data2.length ? dataList = data1 : dataList = data2

      dataList.map(function (n, index) {
        var num, size = Number(index) + 1, dayStyle
        dayStyle = range == 'Month' ? '月' : '天'
        var dateList = '第' + size + dayStyle
        type === 0 ? num = n.date : num = dateList
        that.siteTrafficAvg.chartOptions.xaxis.categories.push(num)
      })
      that.$refs.lineChartAvg.updateOptions({
        xaxis: { categories: that.siteTrafficAvg.chartOptions.xaxis.categories }
      })
      var time1 = moment(this.crossDate[0]).format('YYYY-MM-DD')
      var time2 = moment(this.crossDate[1]).format('YYYY-MM-DD')
      var time3 = moment(this.crossDateTwo[0]).format('YYYY-MM-DD')
      var time4 = moment(this.crossDateTwo[1]).format('YYYY-MM-DD')
      var width = document.getElementById('siteTrafficAvg').offsetWidth
      var number = Math.round((width / 2) * 100) / 100 - 50
      if (type == 0) {
        if (time1 == time2) {
          that.avgLineXaxisType(number, false)
        } else {
          that.avgLineXaxisType(0, true)
        }
      } else {
        if (time1 == time2 && time3 == time4) {
          that.avgLineXaxisType(number, false)
        } else {
          that.avgLineXaxisType(0, true)
        }
      }
    },
    // 选择起点
    selectStart () {
      var that = this
      that.endList.map(function (d) {
         d.children.map(l=>{
             l.disabled = false
          })
      })
      this.startValue.map(function (v) {
        that.endList.map(function (d) {
          d.children.map(l=>{
            if(v[1]===l.id) l.disabled = true
          })
          // if (v[1] === d.value) d.action = true
        })
      })
    },
    // 终点选择
    selectEnd (value) {
      var that = this
      that.startList.map(function (d) {
          d.children.map(l=>{
             l.disabled = false
          })
      })
      this.endValue.map(function (v) {
        that.startList.map(function (d) {
          d.children.map(l=>{
            if(v[1]===l.id) l.disabled = true
          })
        })
      })
    },
    closeAlert () { this.isAlert = false },
    iconClick (index) { this.iconIndex = index },
    // 弹框
    alert (text) {
      this.isAlert = true
      this.alertText.bg = '#00A0E9'
      this.alertText.title = '交叉客流'
      this.alertText.text = text
      this.alertText.confirm = false
    },
    //  更新 线的  x 轴 位置
    avgLineXaxisType (size, type) {
      var that = this
      that.siteTrafficAvg.chartOptions.xaxis.labels.offsetX = size
      that.$refs.lineChartAvg.updateOptions({
        xaxis: { offsetX: that.siteTrafficAvg.chartOptions.xaxis.labels.offsetX }
      })
      that.siteTrafficAvg.chartOptions.xaxis.axisBorder.show = type
      that.$refs.lineChartAvg.updateOptions({
        xaxis: { show: that.siteTrafficAvg.chartOptions.xaxis.axisBorder.show }
      })
    },
    lineXaxisType (size, type) {
      var that = this
      that.siteTraffic.chartOptions.xaxis.labels.offsetX = size
      that.$refs.lineChart.updateOptions({
        xaxis: { offsetX: that.siteTraffic.chartOptions.xaxis.labels.offsetX }
      })
       that.siteTraffic.chartOptions.xaxis.axisBorder.show = type
      that.$refs.lineChart.updateOptions({
        xaxis: { show: that.siteTraffic.chartOptions.xaxis.axisBorder.show }
      })
    },
    polarData (name) {
      var arrNum = []
      this.allData.matrixList.map(function (list) {
        if (list.source == name) arrNum.push(list.value)
        if (list.target == name) arrNum.push(list.value)
      })
      return _.sum(arrNum)
    },
    gotInnerRange (date) {
      const [start, end] = date
      let startTime = moment(start)
      let endTime = moment(end)
      let diffDays = moment.duration(endTime.diff(startTime)).asDays()
      let innerRange = ''
      if (diffDays < 60) innerRange = 'Date'
      else innerRange = 'Month'
      return innerRange
    },
    // 重置数据
    resetData () {
      var date = new Date()
      date = date.setDate(date.getDate() - 1)
      var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
      this.crossDate = dateTime
      this.crossDateTwo = dateTime
      this.selectType = 0
      this.startValue = []
      this.endValue = []
      // 重置已禁用的节点
      this.cascaderChange('startValue')
      this.cascaderChange('endValue')
    }
  }
}
</script>
<style lang="scss" scoped>
.crossLineChart,.crossTableActive{
  transform: translateX(0%)!important;
}
.chartLine,.crossLineChartAvg,.crossTableActive{
  transform: translateX(100%);
}
.crossLineChartAvg{
  transform: translateX(-100%)!important;
}
.cross-table-line{
  margin-top:40px;
  overflow: auto;
  transform: translateX(100%);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
.crossLineActive{
  transform: translateX(0%)!important;
}
.line-show{
  margin-top:20px;
  height:100%;
  overflow: hidden;
  transform: translateX(100%);

}

.cross_analysis_time{
    width:100.5%;
    overflow: hidden;
    margin-top: 20px;
    margin-left:-9px;
    .tootipsTitle{
      display: flex;
      width: 100%!important;
      box-shadow: none;
      padding: 0;
      align-items: center;
      margin-top:14px;
    }
    >div{
      width:32.3%;
      float: left;
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 9px 0px rgba(166,168,169,0.4);
      border-radius:6px;
      padding: 20px;
      margin: 9px 20px 9px 0;
      &:last-child{
        margin-right: 0!important;
      }
      &:first-child{
        margin-left: 9px!important;
      }
      .cross_time_name{
        font-size:19px;
        font-weight:400;
        color:rgba(62,60,60,1);
      }
      .cross_time_data{
        font-size:24px;
        font-weight:bold;
        color:rgba(37,36,36,1);
        margin-top: 5px;
        text-align: right;
        span{
          display: inline-block;
          font-size: 14px;
          float: left;
          margin-top: 8px;
        }
      }
      .scale-data{
        font-size:15px;
        font-family:SanFranciscoDisplay-Regular;
        font-weight:400;
        color:rgba(246,79,97,1);
        margin-top: 10px;
        text-align: right;
        span{
          display: inline-block;
          float: left;
          color: #626262;
        }
        i{
            font-size: 27px;
        }
      }
      .scaleAction{
        color:#6DA787!important;
      }
    }
}
.cross_analysis{
  width:100%;
  background:rgba(255,255,255,1);
  box-shadow:0px 0px 8px 1px rgba(166,167,167,0.3);
  border-radius:6px;
  margin-top: 20px;
  padding: 27px 19px;
  position: relative;
  overflow: hidden;
  .noData{
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    font-size: 24px;
  }
  .cross_analysis_title{
    p{
      font-size:18px;
      font-family:SourceHanSansCN-Medium;
      font-weight:500;
      color:rgba(62,60,60,1);
      line-height:20px;
    }
  }
  .dwell-time-icon{
      position: absolute;
      right: 35px;
      top: 20px;
      z-index: 10;
      span{
        display: inline-block;
        cursor: pointer;
         margin-left: 15px;
      }
      .con-select{
        width: 150px;
        display: inline-block;
      }
    }
  .progress-title{
    margin-bottom: 20px;
    margin-top: 20px;
    position: relative;
    .progress-text{
      float: left;
          color:rgba(51,51,51,1);
      p{
        height: 36px;
        font-size:24px;
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
      }
      span{
        font-size:16px;
        font-family:MicrosoftYaHei;
        font-weight:400;
      }
      &:nth-child(2){
        float: right;
      }
    }
    .progress-center{
      position: absolute;
      top: 60px;
      font-size:16px;
      font-family:MicrosoftYaHei;
      font-weight:400;
      color:rgba(51,51,51,1);
    }
    .arrows{
      position: absolute;
      right: -12px;
      top: 78px;
      width: 0;
      height: 0;
      border-width: 10px;
      border-style: solid;
      border-color: transparent transparent transparent #A2DAF4;
    }
  }
}
.cross-line{
  width:100%;
  height: 400px;
  background:rgba(255,255,255,1);
  box-shadow:0px 0px 8px 1px rgba(166,167,167,0.3);
  border-radius:6px;
  margin-top: 20px;
}

</style>
<style lang="less">
  //隐藏第一栏被禁用的checkbox
  .cascade-dom /deep/ .el-scrollbar:nth-child(1) .is-disabled {
    display: none;
  }
</style>
