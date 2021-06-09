<template>
    <div style="position:relative">
        <!-- <div v-if="hasCover == 1" style="position:absolute;left:0;top:0;background:rgba(0, 0, 0, .3);z-index:999;width:100%;height:100%"></div> -->
      <div class="time-selector">
          <flow-selector
            @on-change="paramsPrepare"
            :isShop='true'
            :isGate='false'
            :isFloor='true'
            :isStore='true'
            :footFall='true'
            :isArea='true'
            :isReset='true'
            typeText='dwellText'
            ref="flowSelector"
            :routName='dwellTime'
          ></flow-selector>
      </div>
      <div class="dewll_graph">
        <div class="dewll_graph_title">
          <p>停留时间分布</p>
        </div>
        <div class="dwell-time-icon">
          <span :key="index" v-for="(icon,index) in iconList" v-on:click="iconClick(icon.value)">
            <icons
              :title="iconTitle[icon.type]"
              :type="icon.type"
              :size="20"
              :color="iconIndex === icon.value ? iconColor :'#9D9D9DFF'"
            ></icons>
          </span>
        </div>
        <div class="dewll_graph_text" >
          <vue-apex-charts
              class="chartsStyleOne"
              v-bind:class="{ barActive: iconIndex == 1 }"
              height='400'
              ref="graphBar"
              v-if="isGraph"
              type="bar"
              :options="graphData.chartOptions"
              :series="graphData.series"
          ></vue-apex-charts>
          <vue-apex-charts
            class="chartsStyleTwo"
            v-bind:class="{ lineActive: iconIndex == 0 }"
            v-if="isGraph"
            ref="graphLine"
            height='400'
            width="100%"
            type="line"
            :options="lineData.chartOptions"
            :series="lineData.series"
          ></vue-apex-charts>
          <div class="dewll_graph_text dwell-chart-table"
          v-bind:class="{ tableActive: iconIndex == 2 }"
          >
            <dwell-table :columns='columnsList' :data='chartTableList'></dwell-table>
          </div>
        </div>

      </div>
      <div class="dwell-time-table">
        <table-default :tableTitle='tableTitle' :tableName='tableName'  :tableList='tableList'></table-default>
      </div>
    </div>
</template>

<script>
import Vue from 'vue'
import flowSelector from '@/components/Passenger-analysis/flowSelector.vue'
import TableDefault from '../ui-elements/table/TableDefault.vue'
import VueApexCharts from 'vue-apexcharts'
import VxBreadcrumb from '@/layouts/components/VxBreadcrumb.vue'
import { dwellTime } from '@/api/analysis'
import dwellTable from '@/views/footfall-analytics/components/iTable.vue'
import moment from 'moment'
import _ from 'lodash'

Vue.component(VxBreadcrumb.name, VxBreadcrumb)
export default {
  name: 'DwellTime',
  components: {
    flowSelector,
    VueApexCharts,
    TableDefault,
    dwellTable
  },
  data () {
    let that = this
    return {
      dwellTime: 'dwellTime',
      tableTitle: '详细数据信息',
      isGraph: false,
      isTableDate: false,
      iconIndex: 1,
      iconColor: 'rgb(34, 128, 215)',
      iconList: [
        {
          type: '62',
          color: '#9D9D9DFF',
          value: 1
        },
        {
          type: 'biaoge-copy',
          color: '#9D9D9DFF',
          value: 2
        }
      ],
      iconTitle: {
        'zhexiantu': '折线图',
        '62': '柱状图',
        'biaoge-copy': '详细数据',
        'xiangxia': '查看全部实体排行',
        'ditu': '出入口客流',
        'fenxi': '饼状图',
        'chakan': '查看所有'
      },
      graphData: {
        chartOptions: {
          chart: {
            toolbar: {
              show: false,
              tools: {
                download: false
              }
            },
            events: {}
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '45%',
              endingShape: 'rounded'
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: false,
            width: 1,
            colors: ['transparent']
          },
          xaxis: {
            categories: []
          },
          yaxis: {
            title: {
              text: '时间'
            },
            labels: {
              show: true,
              formatter: (value) => {
                return that.dateTiem(value)
              }
            }
          },
          fill: {
            opacity: 1

          },
          tooltip: {
            y: {
              formatter: function (val) {
                return that.dateTiem(val)
              }
            }
          }
        },
        series: [
          {
            name: '时间',
            data: []
          }
        ]
      },
      lineData: {
        chartOptions: {
          chart: {
            toolbar: {
              show: false,
              tools: {
                download: false
              }
            }
          },
          title: {
            text: ''
          },
          stroke: {
            curve: 'straight',
            width: 2
          },
          dataLabels: {
            enabled: false
          },
          colors: ['#33B3ED', '#2BD9CF', '#94E2FF', '#FBAB40', '#8D82F0', '#E8585A'],
          legend: {
            // onItemClick: {
            //   toggleDataSeries: false
            // },
            // onItemHover: {
            //   highlightDataSeries: true
            // }
          },
          yaxis: {
            title: {
              text: '时间'
            },
            labels: {
              show: true,
              formatter: (value) => {
                return that.dateTiem(value)
              }
            }
          },
          xaxis: {
            categories: []
          },
          plotOptions: {
            bar: {
              horizontal: false,
              endingShape: 'rounded',
              columnWidth: '20%',
              radius: 0
            }
          },
          // markers: {
          //   size: 4
          // },
          tooltip: {
            y: {
              formatter: function (val) {
                return that.dateTiem(val)
              }
            }
          }
        },
        series: []
      },
      chartTableName: ['实体名称', '停留时间'],
      chartTableListL: [],
      tableName: ['实体名称', '平均停留时间'],
      tableList: [],
      chartTableList: [],
      columnsList: [],
      prepareValue: '',
      compareData: ''
    }
  },
  mounted () {
    var that = this
    that.$refs.flowSelector.entityType = 'shop'
    this.isGraph = true
    this.iconIndex = 1
  },
  activated () {

  },
  methods: {
    paramsPrepare (value) {
      if (this.$store.state.home.headerAction && value.entitys.length == 0) {
        alert('请选择实体')
        return false
      }
      try {
        let compare = ''
        let times = ''
        let entityName = value.entitys.map(m => {
          return m.name
        })
        if (value.compareType == 'not') {
          compare = '无对比'
          times = value.date1Array.join(',')
        } else if (value.compareType == 'entity') {
          compare = '实体对比'
          times = value.date1Array.join(',')
        } else if (['time', 'onYear', 'onMonth'].includes(value.compareType)) {
          compare = '时间对比'
          times = [value.date1Array.join(','), value.date2Array.join(',')]
        }
        window.TDAPP.onEvent('停留时间分析页面', '数据查询', { '时间段': times, '对比方式': compare, '实体选择': entityName })
      } catch (error) {
        console.log('停留时间分析页面-数据查询-埋点error:' + error)
      }
      var time1 = value.date1Array[0] + ',' + value.date1Array[1]
      var time2
      this.prepareValue = value
      var charType = false
      this.compareData = value
      if (['time', 'onYear', 'onMonth'].includes(value.compareType)) {
        this.isTableDate = true
        time2 = value.date2Array[0] + ',' + value.date2Array[1]
        if (value.date1Array[0] === value.date1Array[1]) {
          value.date2Array[0] === value.date2Array[1] ? charType = true : charType = false
        } else {
          this.charType = false
        }
      } else {
        this.isTableDate = false
        time2 = ''
        value.date1Array[0] === value.date1Array[1] ? charType = true : charType = false
      }
      var bzid = []
      value.entitys.map(function (d) { bzid.push(d.id) })
      bzid = _.remove(bzid, function (n) { return n != 0 }).join(',')
      this.iconIndex = 0
      // this.isGraph === true ? this.iconList[0].type = '62' : this.iconList[0].type = 'zhexiantu'
      this.iconList = []
      if (charType === true) {
        var arr = [
          {
            type: '62',
            color: '#9D9D9DFF',
            value: 1
          },
          {
            type: 'biaoge-copy',
            color: '#9D9D9DFF',
            value: 2
          }
        ]
        this.iconIndex = 1
        this.iconList = arr
      } else {
        var arr = [
          {
            type: 'zhexiantu',
            color: '#9D9D9DFF',
            value: 0
          },
          {
            type: '62',
            color: '#9D9D9DFF',
            value: 1
          },
          {
            type: 'biaoge-copy',
            color: '#9D9D9DFF',
            value: 2
          }
        ]
        this.iconIndex = 0
        this.iconList = arr
      }
      // if (this.$store.state.home.loadingState == false) {
      //   this.$store.commit('loadingState', true)
      //   this.$vs.loading()
      // }
      this.tableType(time2)
      this.initialData()
      this.dataList(time1, time2, bzid, charType)
    },
    dataList (time1, time2, bzid, charType) {
      var that = this
      dwellTime({ time1, time2, bzid }).then(res => {
        // that.$vs.loading.close()
        // that.$store.commit('loadingState', false)
        // 图表数据
        that.graphData.chartOptions.xaxis.categories = []
        res.data.data.charts.categories.map(function (n) {
          that.graphData.chartOptions.xaxis.categories.push(n)

          that.lineData.chartOptions.xaxis.categories.push(n)
        })
        if (res.data.data.charts.series.length !== 0) {
          that.graphData.series = res.data.data.charts.series
          res.data.data.charts.series.map(function (d) {
            var obj = {}
            var name = d.name.replace(/,/g, ' - ')
            obj.name = name
            obj.data = []
            d.data.map((num, index) => { obj.data.push(num) })
            that.lineData.series.push(obj)
          })
        }
        // 更新 x 坐标 以及 柱状图宽度
        if (that.$refs.graphBar) {
          that.$refs.graphBar.updateOptions({ xaxis: that.graphData.chartOptions.xaxis })
          if (that.graphData.chartOptions.xaxis.categories.length < 2) {
            that.graphData.chartOptions.plotOptions.bar.columnWidth = '10%'
            that.$refs.graphBar.updateOptions({ plotOptions: that.graphData.chartOptions.plotOptions })
          } else if (that.graphData.chartOptions.xaxis.categories.length < 5) {
            that.graphData.chartOptions.plotOptions.bar.columnWidth = '20%'
            that.$refs.graphBar.updateOptions({ plotOptions: that.graphData.chartOptions.plotOptions })
          } else {
            that.graphData.chartOptions.plotOptions.bar.columnWidth = '70%'
            that.$refs.graphBar.updateOptions({ plotOptions: that.graphData.chartOptions.plotOptions })
          }
        }
        if (that.$refs.graphLine) {
          that.$refs.graphLine.updateOptions({
            xaxis: { categories: that.lineData.chartOptions.xaxis.categories }
          })
        }
        that.chartTableData(res.data.data.charts.categories, res.data.data.charts.series, charType)
        // 表格数据
        that.tableList = []
        res.data.data.zones.map(function (d) {
          var obj = {}
          obj.name = d.name
          // obj.type = d.type == null ? '出入口' : d.type
          if (that.isTableDate === false) obj.time = ''
          else obj.time = d.date ? d.date : obj.time = ' '
          obj.avg = that.dateTiem(d.avg)
          that.tableList.push(obj)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    iconClick (index) {
      this.iconIndex = index
    },

    tableType (value) { // 表格 标题
      this.titleText = []
      if (value === '') {
        this.tableName = [
          '实体名称',
          // '实体类型',
          '平均停留时间'
        ]
      } else {
        this.tableName = [
          '实体名称',
          // '实体类型',
          '时间点',
          '平均停留时间'
        ]
      }
    },
    chartTableData (categories, series, charType) {
      var that = this
      that.columnsList = [
        {
          title: '时间',
          key: 'time'
        }
      ]
      that.chartTableList = []
      if (charType === true) {
        categories.map(function (name, index) {
          var obj = {}
          obj.title = name
          obj.key = 'avg' + index
          that.columnsList.push(obj)
        })
        var timeType = that.compareData.compareType
        series.map(function (list, index) {
          var obj = {}
          if (['time', 'onYear', 'onMonth'].includes(timeType)) {
            var num = Number(index) + 1
            obj.time = '第' + num + '天'
          } else {
            obj.time = that.compareData.date1Array[0]
          }

          list.data.map(function (d, index) {
            var key = 'avg' + index
            obj[key] = that.dateTiem(d)
          })
          that.chartTableList.push(obj)
        })
      } else {
        series.map(function (n, index) {
          var obj = {}
          var kk = 'avg' + index
          obj.title = n.name
          obj.key = kk
          that.columnsList.push(obj)
        })
        categories.map(function (d, index) {
          var obj = {}
          obj.time = d
          series.map(function (da, iIndexs) {
            var akey = 'avg' + iIndexs
            obj[akey] = that.dateTiem(series[iIndexs].data[index])
          })
          that.chartTableList.push(obj)
        })
      }
    },
    initialData () {
      var that = this
      that.graphData.chartOptions.xaxis.categories = []
      that.graphData.series = []
      that.lineData.chartOptions.xaxis.categories = []
      that.lineData.series = []
      that.tableList = []
    },
    dateTiem (value) { // 秒转换为时分秒
      var secondTime = parseInt(value), minuteTime, hourTime
      if (secondTime >= 60) {
        minuteTime = parseInt(secondTime / 60)
        secondTime = parseInt(secondTime % 60)
        if (minuteTime >= 60) {
          hourTime = parseInt(minuteTime / 60)
          minuteTime = parseInt(minuteTime % 60)
        }
      }
      if (secondTime > 0) {
        secondTime = secondTime < 10 ? '0' + parseInt(secondTime) : parseInt(secondTime)
      } else {
        secondTime = '00'
      }
      if (minuteTime > 0) {
        minuteTime = minuteTime < 10 ? '0' + parseInt(minuteTime) : parseInt(minuteTime)
      } else {
        minuteTime = '00'
      }
      if (hourTime > 0) {
        hourTime = hourTime < 10 ? '0' + parseInt(hourTime) : parseInt(hourTime)
      } else {
        hourTime = '00'
      }
      return hourTime + ':' + minuteTime + ':' + secondTime
    }
  }
}
</script>

<style>
.ivu-select-dropdown{
    z-index: 52000!important;
}
</style>
<style lang="scss">
.chartsActive,{
  display: block!important;
}
.barActive{
  transform: translateY(0%)!important;
}
.lineActive{
  transform: translateY(-100%)!important;
}
.tableActive{
  transform: translateY(-200%)!important;
}
.dwell-chart-table{
  width: 100%;
  height: 100%;
  overflow:auto;
  padding:0;
  margin-top:20px;
  transform: translateY(100%);
}
.chartsStyleOne,.chartsStyleTwo{
transform: translateY(100%);
}
  .time-selector {
    background-color: #fff;
    padding: 0px 15px 18px;
    box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
    border-radius: 6px;
  }
  .dewll_graph{
    background:#fff;
    box-shadow:0 4px 20px 0 rgba(0,0,0,.05);
    border-radius: .5rem;
    margin-top: 20px;
    padding: 27px 19px 0;
    position: relative;
    .dewll_graph_title{
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
      right: 20px;
      top: 20px;
      span{
        display: inline-block;
        cursor: pointer;
         margin-left: 10px;

      }
    }
  .dewll_graph_text{
    display: block;
    height: 415px;
    overflow: hidden;

  }
}
.dwell-time-table{
  margin-top: 20px;
}
</style>
