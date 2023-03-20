<template>
  <div class="go-shop">
    <div class="selector-container bg-white box-card">
      <!-- <h1>趋势分析</h1> -->
      <div class="flex-center">
        <DatePicker
          type="daterange"
          v-model="crossDate"
          placement="bottom-end"
          :options="disabledDate"
          placeholder="选择日期"
          class="w-select"
        ></DatePicker>
        <vs-select
          class="w-select m-l-20"
          autocomplete
          v-model="selectType">
          <vs-select-item
            v-for="(item,index) in typeListCom"
            :value="item.value"
            :text="item.text"
            :key="index"
          />
        </vs-select>
        <DatePicker
          type="daterange"
          v-model="crossDateTwo"
          placement="bottom-end"
          :options="disabledDate"
          placeholder="选择日期"
          class="w-select m-l-20"
          v-if="selectType == 1"
        ></DatePicker>
      </div>
      <div class="flex-center">
        <el-cascader
          collapse-tags
          class="w-select"
          v-model="activities"
          :props="{ multiple: true,expandTrigger:'hover' }"
          :options="activitiesType">
        </el-cascader>
        <Button size="large" class="m-l-20" type="primary" @click="paramsPrepare">{{ $t('查询') }}</Button>
        <Button size="large" class="m-l-20" @click="resetData">{{ $t('重置') }}</Button>
      </div>
    </div>
    <chart-box ref="trendChart" v-show="!nodata" chartId="trendChart" class="common-card chart m-t-20" @toolClick="toolClick"
               :chart="trendChart" :toolList="toolList"></chart-box>
    <div v-show="nodata" class="chart no-data common-card m-t-20">暂无数据</div>
  </div>
</template>
<script>
import { getCascadeList } from '@/api/passenger.js'
import { goShopTrend } from '@/api/analysis'
import { disabledDate } from '@/libs/util.js'
import moment from 'moment'
import NP from 'number-precision'
import _ from 'lodash'
import ChartBox from '_c/common/Chart-box'
import { config as barConfig } from '@/config/echarts-config/bar-chart'
import { config as lineConfig } from '@/config/echarts-config/line-chart'
import {mapState} from 'vuex'
export default {
  name: 'goShop',
  components: {
    ChartBox
  },
  data () {
    return {
      nodata:true,
      disabledDate: '',
      activities: [],
      activitiesType: [],
      crossDate: [],
      crossDateTwo: [],
      selectType: 0,
      selectAll: 0,
      typeList: [],
      chartOption:{
        lineOption:null,
        barOption:null,
      },
      trendChart:{
        lineChart:null,
        barChart: null,
      },
      toolList:[
        {
          icon: '62',
          value: 'bar',
          name: '进店率趋势分析'
        },{
          icon: 'zhexiantu',
          value: 'line',
          name: '进店率趋势分析'
        }, {
          icon: 'biaoge-copy',
          value: 'table',
          name: '进店率趋势分析'
        }, {
          icon: 'daoru',
          value: 'download',
          name: '进店率趋势分析'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      headerData:state => state.home.headerData,
    }),
    typeListCom() {
      this.typeList = [
        {
          text: this.$t('无对比'),
          value: 0
        },
        {
          text: this.$t('时间对比'),
          value: 1
        }
      ]
      return this.typeList
    },
    iconTitleCom() {
      this.iconTitle = {
        'zhexiantu': this.$t('折线图'),
        '62': this.$t('柱状图'),
        'biaoge-copy': this.$t('详细数据'),
        'xiangxia': this.$t('查看全部实体排行'),
        'ditu': this.$t('出入口客流'),
        'fenxi': this.$t('饼状图'),
        'chakan': this.$t('查看所有'),
        'daoru': this.$t('下载')
      }
      return this.iconTitle
    }
  },

  watch: {
    '$store.state.home.headerAction' () {
      this.resetData()
      let routerName = this.$router.currentRoute.name
      if (routerName === 'GoShop') {
        this.allZoneList()
      }
    },
    '$store.state.home.bussinessDict' () {
      this.allZoneList()
    }
  },
  created () {
    this.disabledDate = disabledDate
  },
  mounted () {
    var date = new Date()
    date = date.setDate(date.getDate() - 1)
    var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
    this.crossDate = dateTime
    this.crossDateTwo = dateTime
    this.allZoneList()
  },
  methods: {
    toolClick(chartName){
      switch (chartName) {
        case 'line':
          this.$nextTick(() => {
            this.$refs.trendChart.initLineChart(this.chartOption.lineOption)
          })
          break
        case 'table':
          this.$nextTick(() => {
            let option = _.cloneDeep(this.chartOption.lineOption)
            option.series.forEach(o=>{
              if(this.headerData.show_actual_val){
                o.data = o.data.map(d=>{
                  if(d.to > d.passby){
                    d.passby = d.to
                  }
                  return `${d.value}%(进店人次:${d.to},过店人次:${d.passby})`
                })
              }else {
                o.data = o.data.map(d=>{return d.value + '%'})
              }
            })

            this.$refs.trendChart.initTable(option)
          })
          break
        case 'bar':
          this.$nextTick(() => {
            this.$refs.trendChart.initBarChart(this.chartOption.barOption)
          })
          break
      }
    },
    // 获取 所有 商铺 楼层 出入口 数据
    allZoneList () {
      let propertyId = this.$store.state.home.headerAction
      getCascadeList({ property_id: propertyId }).then(res => {
        if (res.data.code == 200) {
          let data = res.data.data
            this.activitiesType = []
            let newData = Object.keys(data)
            newData.forEach(list => {
                let obj = {}
                obj.value = list
                obj.label = list
                obj.children = []
                data[list].forEach(shop => {
                    let shopObj = {}
                    shopObj.value = shop.id
                    shopObj.label = shop.name
                    shopObj.name = shop.name
                    obj.children.push(shopObj)
                })
                this.activitiesType.push(obj)
            })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 点击查询
    paramsPrepare () {
      var that = this
      let range, rangeOne, rangeTwo, time2

      var time1 = moment(that.crossDate[0]).format('YYYY-MM-DD') + ',' +
      moment(that.crossDate[1]).format('YYYY-MM-DD')
      rangeOne = this.gotInnerRange(that.crossDate)
      // 判断是否是时间对比
      if (that.selectType == 0) {
        time2 = ''
        rangeTwo = ''
      } else {
        time2 = moment(that.crossDateTwo[0]).format('YYYY-MM-DD') + ',' +
        moment(that.crossDateTwo[1]).format('YYYY-MM-DD')
        rangeTwo = this.gotInnerRange(that.crossDateTwo)
      }
      // 时间类型判断
      if (rangeTwo == '') range = rangeOne
      else if (rangeTwo == 'Month' || rangeOne == 'Month') range = 'Month'
      else range = 'Date'
      // 提示
      if (that.activities.length === 0) {
        this.$alert({
          content:this.$t('fn.请选择',[this.$t('商铺')])
        })
        return false
      }
      if (that.activities.length > 25) {
        this.$alert({
          content:this.$t('fn.entityLimit',[25])
        })
        return false
      }
      if(time1===time2){
        this.$alert({
          content:this.$t('compareTimeSame')
        })
        return false
      }
      var listId = _.clone(that.activities)
      let allId = []
      listId.map(val => { allId.push(val[1]) })
      var bzid = allId.join(',')

      goShopTrend({ time1: time1, time2: time2, bzid: bzid, range: range }).then(res => {
        res = res.data.data
        if (that.selectType === 0) {
          this.noCompareFormat(res)
        } else {
          this.compareFormat(res,range)
        }
        this.nodata = false
      })
    },
    noCompareFormat(data){
      data = Object.values(Object.values(data)[0])
      let options = {
        legend:{
          data:[]
        },
        xAxis:[],
        series: [],
      }
      options.xAxis = data[0].map(o=>{
        return o.date
      })
      data.forEach(o=>{
        options.legend.data.push(o[0].name);
        o.forEach(d=>{
          d.value = NP.times(d.rate, 100)
        })
        options.series.push({
          name:o[0].name,
          data:o
        })
      })
      this.chartOption.lineOption = this.setLineOption(options);
      this.chartOption.barOption = this.setBarOption(options);
      this.toolClick(this.$refs.trendChart.currentChart)
    },
    compareFormat(data,range){
      let options = {
        legend:{
          data:[]
        },
        xAxis:[],
        series: [],
      }
      _.forIn(data,(val,key)=>{
        _.forIn(val,(innerVal,innerKey)=>{
          const name = innerVal[0].name + key.replace(/,/g, ' - ')
          options.legend.data.push(name)
          innerVal.forEach(v=>{
            v.value = NP.times(v.rate, 100)
          })
          options.series.push({
            name,
            data:innerVal
          })
        })
      })
      let obj = Object.values(Object.values(data)[0])[0]
      let obj_compare = Object.values(Object.values(data)[1])[0]

      if(obj.length < obj_compare.length){
        obj = obj_compare
      }
      obj.forEach((o,i)=>{
        const day = range === 'Month' ?this.$t('fn.第_月',[ i+1 ]):this.$t('fn.第_天',[ i+1 ]);
        options.xAxis.push(day)
      })
      
      this.chartOption.lineOption = this.setLineOption(options);
      this.chartOption.barOption = this.setBarOption(options);
      this.toolClick(this.$refs.trendChart.currentChart)
    },
    setBarOption (options) {
      let barConfigCopy = _.cloneDeep(barConfig)
      const obj = {
        type: 'bar',
        barGap: '0%',
        barMaxWidth:80,
        itemStyle: {
          normal: {
            //柱形图圆角
            barBorderRadius: [80, 80, 0, 0],
          },
        },
      }
      let copyOption = _.cloneDeep(options)
      copyOption.series.forEach(o => {
        Object.assign(o, obj)
      })
      barConfigCopy.xAxis.data = copyOption.xAxis
      Object.assign(barConfigCopy.legend, copyOption.legend)
      barConfigCopy.series = copyOption.series
      barConfigCopy.tooltip.formatter = (params)=>{
        let html = params[0].axisValue+'<br>';
        if(this.headerData.show_actual_val){
          params.forEach(o=>{
            if(o.data.to > o.data.passby){
              o.data.passby = o.data.to
            }
            html += `${o.marker}${o.seriesName}:${o.value}%(进店人次:${o.data.to},过店人次:${o.data.passby})<br>`
          })
         
        }else {
          params.forEach(o=>{
            html += `${o.marker}${o.seriesName}:${o.value}%<br>`
          })
        }
        return html
      }
      return barConfigCopy
    },
    setLineOption (options) {
      let lineConfigCopy = _.cloneDeep(lineConfig)
      lineConfigCopy.dataZoom = []
      const obj = {
        type: 'line'
      }
      let copyOption = _.cloneDeep(options)
      copyOption.series.forEach(o => {
        Object.assign(o, obj)
      })
      lineConfigCopy.series = copyOption.series
      lineConfigCopy.xAxis.data = copyOption.xAxis
      Object.assign(lineConfigCopy.legend, copyOption.legend)
      lineConfigCopy.tooltip.formatter = (params)=>{
        let html = params[0].axisValue+'<br>';
        if(this.headerData.show_actual_val){
          params.forEach(o=>{
            if(o.data.to > o.data.passby){
              o.data.passby = o.data.to
            }
            html += `${o.marker}${o.seriesName}:${o.value}%(进店人次:${o.data.to},过店人次:${o.data.passby})<br>`
          })
      
        }else {
          params.forEach(o=>{
            html += `${o.marker}${o.seriesName}:${o.value}%<br>`
          })
        }
        return html
      }
      return lineConfigCopy
    },
    // 重置数据
    resetData () {
      var date = new Date()
      date = date.setDate(date.getDate() - 1)
      var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
      this.crossDate = dateTime
      this.selectType = 0;
      this.activities = [];
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
    }
  }
}
</script>
<style lang="less" scoped>
.go-shop{
    width: 100%;
    height: auto;
  .chart{
    height: 490px;
    &.no-data{
      width: 100%;
      text-align: center;
      padding-top: 250px;
      background: #fff;
      font-size: 26px;
    }
  }
}
</style>
