<template>
  <div>
    <flow-selector @paramsPrepare="paramsPrepare"></flow-selector>
    <div class="dewll_graph flex-column">
      <div class="dewll_graph_title">
        <span>{{ $t('停留时间分布') }}</span>
        <div class="dwell-time-icon" @click="iconClick">
          <icons
            v-for="(icon,index) in iconList"
            :key="index"
            :data-value="icon.value"
            :title="iconTitle[icon.type]"
            :type="icon.type"
            :size="20"
            :color="iconIndex === icon.value ? iconColor :'#9D9D9DFF'"
          ></icons>
        </div>
      </div>
      
      <div class="dwell-chart-box" >
        <vue-apex-charts
          v-show="iconIndex == 1"
          height='100%'
          ref="graphBar"
          type="bar"
          :options="graphData.chartOptions"
          :series="graphData.series"
        ></vue-apex-charts>
        <vue-apex-charts
          class="chartsStyleTwo"
          v-show="iconIndex == 0"
          ref="graphLine"
          height='100%'
          width="100%"
          type="line"
          :options="lineData.chartOptions"
          :series="lineData.series"
        ></vue-apex-charts>
        <div class=" dwell-chart-table" v-show="iconIndex == 2">
          <dwell-table maxHeight='400px' :columns='columnsList' :data='chartTableList'></dwell-table>
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
import TableDefault from '../ui-elements/table/TableDefault.vue'
import VueApexCharts from 'vue-apexcharts'
import VxBreadcrumb from '@/layouts/components/VxBreadcrumb.vue'
import { dwellTime } from '@/api/analysis'
import dwellTable from '@/views/footfall-analytics/components/iTable.vue'
import _ from 'lodash'
import FlowSelector from '_c/flow-selector/dwellTime-flow-selector'
import {initTimes} from '@/libs/util'
Vue.component(VxBreadcrumb.name, VxBreadcrumb)
export default {
  name: 'DwellTime',

  components: {
    VueApexCharts,
    TableDefault,
    dwellTable,
    FlowSelector
  },
  data () {
    let that = this
    return {

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
                return initTimes(value)
              }
            }
          },
          fill: {
            opacity: 1

          },
          tooltip: {
            y: {
              formatter: function (val) {
                return initTimes(val)
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
            height:30
          },
          yaxis: {
            title: {
              text: '时间'
            },
            labels: {
              show: true,
              formatter: (value) => {
                return initTimes(value)
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
          tooltip: {
            y: {
              formatter: function (val) {
                return initTimes(val)
              }
            }
          }
        },
        series: []
      },
      chartTableName: ['实体名称', '停留时间'],
      chartTableListL: [],
      tableName: ['实体名称', '实体类型', '平均停留时间'],
      tableList: [],
      chartTableList: [],
      columnsList: [],
      prepareValue: '',
      compareData: ''
    }
  },
  mounted () {
   
    this.iconIndex = 1
  },
  activated() {
     this.isGraph = false
     setTimeout(() => {
        this.isGraph = true
     });
  },
  methods: {

    paramsPrepare (value) {
      var time1 = value.date1Array[0] + ',' + value.date1Array[1]
      var time2
      this.prepareValue = value
      var charType = false
      this.compareData = value
      if (['time','onYear','onChain'].includes(value.compareType)) {
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
      this.tableType(time2)
      this.initialData()
      this.dataList(time1, time2, bzid, charType)
    },
    dataList (time1, time2, bzid, charType) {
      var that = this
      dwellTime({ time1, time2, bzid }).then(res => {
        // 图表数据
        that.graphData.chartOptions.xaxis.categories = []
        res.data.data.charts.categories.map(function (n) {
          that.graphData.chartOptions.xaxis.categories.push(n)

          that.lineData.chartOptions.xaxis.categories.push(n)
        })
        if (res.data.data.charts.series.length !== 0) {
          // that.graphData.series = res.data.data.charts.series
          res.data.data.charts.series.map(function (d) {
            var obj = {}
            const arr = d.name.split(',');
            let name =  d.name.replace(/,/g, ' - ')
            if(arr.length === 2){
              if(arr[0].split(' ')[1]=== arr[1]){
                name = arr[0]
              }
            }
            obj.name = name
            obj.data = []
            d.data.map((num, index) => { obj.data.push(num) })
            that.lineData.series.push(obj)
            that.graphData.series.push(obj)
          })
        }
        // 更新 x 坐标 以及 柱状图宽度
        if (that.$refs.graphBar) {
          that.$refs.graphBar.updateOptions({ xaxis: that.graphData.chartOptions.xaxis })
          if (that.graphData.chartOptions.xaxis.categories.length < 2) {
            that.graphData.chartOptions.plotOptions.bar.columnWidth = '10%'
          } else if(that.graphData.chartOptions.xaxis.categories.length < 5){
            that.graphData.chartOptions.plotOptions.bar.columnWidth = '25%'
          }else if(that.graphData.chartOptions.xaxis.categories.length < 10){
            that.graphData.chartOptions.plotOptions.bar.columnWidth = '55%'
          }else if(that.graphData.chartOptions.xaxis.categories.length < 15){
            that.graphData.chartOptions.plotOptions.bar.columnWidth = '65%'
          }else {
            that.graphData.chartOptions.plotOptions.bar.columnWidth = '80%'
          }
          that.$refs.graphBar.updateOptions({ plotOptions: that.graphData.chartOptions.plotOptions })
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
          obj.type = d.type == null ? '出入口' : d.type
          if (that.isTableDate === false) obj.time = ''
          else {
            let date;
            if(d.date){
              const arr = d.date.split(',');
              if(arr[0] === arr[1]){
                date = arr[0]
              }else {
                date = `${arr[0]} - ${arr[1]}`
              }
            }
            obj.time = d.date ? date : obj.time = ' '
          }
          obj.avg = initTimes(d.avg)
          that.tableList.push(obj)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    iconClick (e) {
      this.iconIndex = Number(e.target.getAttribute('data-value'))
      switch (this.iconIndex) {
        case 1:
          this.$nextTick(()=>{
            this.$refs.graphBar.updateOptions(this.graphData.chartOptions)
          });
          break;
        case 0:
          this.$nextTick(()=>{
            this.$refs.graphLine.updateOptions(this.lineData.chartOptions)
          });
          break;
      }
    },

    tableType (value) { // 表格 标题
      this.titleText = []
      if (value === '') {
        this.tableName = [
          '实体名称',
          '实体类型',
          '平均停留时间'
        ]
      } else {
        this.tableName = [
          '实体名称',
          '实体类型',
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
          if (['time','onYear','onChain'].includes(timeType)) {
            var num = Number(index) + 1
            obj.time = '第' + num + '天'
          } else {
            obj.time = that.compareData.date1Array[0]
          }

          list.data.map(function (d, index) {
            var key = 'avg' + index
            obj[key] = initTimes(d)
          })
          that.chartTableList.push(obj)
        })
      } else {
        series.map(function (n, index) {
          const arr = n.name.split(',');
          let name =  n.name.replace(/,/g, ' - ')
          if(arr.length === 2){
            if(arr[0].split(' ')[1]=== arr[1]){
              name = arr[0]
            }
          }
          var obj = {}
          var kk = 'avg' + index
          obj.title = name
          obj.key = kk
          that.columnsList.push(obj)
        })
        categories.map(function (d, index) {
          var obj = {}
          obj.time = d
          series.map(function (da, iIndexs) {
            var akey = 'avg' + iIndexs
            obj[akey] = initTimes(series[iIndexs].data[index])
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
  }
}
</script>
<style lang="scss">
.dwell-chart-table{
  padding: 20px;
  padding-top: 0;
}
  .dewll_graph{
    background:#fff;
    box-shadow:0 4px 20px 0 rgba(0,0,0,.05);
    border-radius: .5rem;
    margin-top: 20px;
    height: 500Px;
    .dewll_graph_title{
      padding: 20px;
      font-size:18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .dwell-time-icon{
        cursor: pointer;
        font-weight:500;
        color:rgba(62,60,60,1);
        >*+*{
          margin-left: 10px;
        }
      }
    }
    .dwell-chart-box{
      height: 0;
      flex: 1;
    }

}
.dwell-time-table{
  margin-top: 20px;
}
</style>
