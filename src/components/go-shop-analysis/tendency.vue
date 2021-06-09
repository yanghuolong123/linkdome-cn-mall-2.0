<template>
  <div class="go-shop" v-if="isHtml">
    <div class="go-time-selector" style="margin-top:40px;">
      <!-- <h1>趋势分析</h1> -->
          <div class="tendency-picker">
              <DatePicker
                type="daterange"
                v-model="crossDate"
                placement="bottom-end"
                :options="disabledDate"
                placeholder="选择日期"
                style='width:230px;float:left;'
              ></DatePicker>
              <vs-select
                class="selectExample"
                autocomplete
                v-model="selectType"
              >
                <vs-select-item
                  :value="item.value"
                  :text="item.text"
                  :key="index"
                  v-for="(item,index) in typeList"
                />
              </vs-select>
            <DatePicker
              type="daterange"
              v-model="crossDateTwo"
              placement="bottom-end"
              :options="disabledDate"
              placeholder="选择日期"
              style='width:212px;float:left;margin-left:30px;'
              v-if="selectType == 1"
            ></DatePicker>
          </div>
          <div class="go-shop-activities">
              <el-cascader
               collapse-tags
                v-model="activities"
                :props="{ multiple: true,expandTrigger:'hover' }"
                :options="activitiesType">
              </el-cascader>
              <div class="cross-submit" v-on:click="paramsPrepare">查询</div>
              <div class="cross-reset" v-on:click="resetData">重置</div>
          </div>
    </div>
    <div class="go-shop-chart-list"  >
        <div class="go-shop-time-icon">
          <span>进店率趋势分析</span>
          <p>
            <span :key="index" v-for="(icon,index) in iconList" v-on:click="iconClick(icon.value)">
              <icons
                :title="iconTitle[icon.type]"
                :type="icon.type"
                :size="20"
                :color="iconIndex === icon.value ? iconColor :'#9D9D9DFF'"
              ></icons>
            </span>
          </p>
        </div>
         <div v-if="isData" class="noData">暂无数据</div>
         <vue-apex-charts
          v-bind:class="{ lineAction: iconIndex == 0 }"
            class="tendencyLine"
            ref="graphLine"
            height='428'
            width="100%"
            id='tendencyLine'
            type="line"
            :options="lineData.chartOptions"
            :series="lineData.series"
            v-if="isList"
          ></vue-apex-charts>
          <vue-apex-charts
          v-bind:class="{ barAction: iconIndex == 1 }"
            class="tendencyBar"
            ref="graphBar"
            height='428'
            width="100%"
            type="bar"
            :options="graphData.chartOptions"
            :series="graphData.series"
          ></vue-apex-charts>
          <table-default
          v-bind:class="{ tableAction: iconIndex == 2 }"
          class="tendencyTable"
            :tableTitle='goTitle'
            :tableName='goName'
            :tableList='goTableList'
          ></table-default>
    </div>
    <alert
      v-if="isAlert"
      @closeAlert ='closeAlert'
      @alertConfirm ='alertConfirm'
      :alertText='alertText'
    ></alert>
  </div>
</template>
<script>
import flowSelector from '@/components/Passenger-analysis/flowSelector.vue'
import TableDefault from '@/views/ui-elements/table/TableDefault.vue'
import alert from '@/components/alert.vue'
import VueApexCharts from 'vue-apexcharts'
import { getBussinessTree, getBussinessCommon } from '@/api/passenger'
import { getCascadeList } from '@/api/passenger.js'
import { goShopTrend } from '@/api/analysis'
import { goShowFlowTend } from '@/api/home.js'
import { disabledDate } from '@/libs/util.js'
import moment from 'moment'
import NP from 'number-precision'
import _ from 'lodash'
export default {
  name: 'goShop',
  components: {
    flowSelector,
    TableDefault,
    VueApexCharts,
    alert

  },
  data () {
    return {
      disabledDate: '',
      isHtml: false,
      isList: false,
      isData: true,
      activities: [],
      activitiesType: [],
      crossDate: [],
      crossDateTwo: [],
      selectType: 0,
      selectAll: 0,
      typeList: [
        {
          text: '无对比',
          value: 0
        },
        {
          text: '时间对比',
          value: 1
        }
      ],
      iconList: [
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
        },
        {
          type: 'daoru',
          color: '#9D9D9DFF',
          value: 3
        }
      ],
      iconTitle: {
        'zhexiantu': '折线图',
        '62': '柱状图',
        'biaoge-copy': '详细数据',
        'xiangxia': '查看全部实体排行',
        'ditu': '出入口客流',
        'fenxi': '饼状图',
        'chakan': '查看所有',
        'daoru': '下载'
      },
      iconIndex: 1,
      iconColor: 'rgb(34, 128, 215)',
      goTitle: '',
      goName: [],
      goTableList: [],
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
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: []
          },
          yaxis: {
            title: {
              text: '百分比（%）'
            },
            labels: {
              show: true,
              formatter: (value) => {
                return value + '%'
              }
            },
            tickAmount: 5
          },
          fill: {
            opacity: 1

          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + '%'
              }
            }
          }
        },
        series: []
      },
      lineData: {
        chartOptions: {
          chart: {
            type: 'line',
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
            // curve: 'smooth',
            width: 2
          },
          dataLabels: {
            enabled: false
          },
          colors: ['#33B3ED', '#2BD9CF', '#94E2FF', '#FBAB40', '#8D82F0', '#E8585A'],
          yaxis: {
            title: {
              text: '百分比（%）'
            },
            tickAmount: 5,
            // min: 0,
            labels: {
              show: true,
              formatter: (value) => {
                return value + '%'
              }
            }
          },
          xaxis: {
            labels: {
              offsetX: 0 // 720
            },
            axisBorder: {
              show: false
            },
            categories: []
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + '%'
              }
            }
          },
          markers: {
            size: 5,
            hover: {
              sizeOffset: 2
            }
          }
        },
        series: []
      },
      loadingData: {
        time1: '',
        time2: '',
        id: ''
      },
      isAlert: false,
      alertText: {
        title: '',
        text: '',
        bg: '',
        confirm: false
      }

    }
  },
  activated () {
    this.isHtml = true
  },
  deactivated () {
    this.isHtml = false
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
    // 获取 所有 商铺 楼层 出入口 数据
    allZoneList () {
      let propertyId = this.$store.state.home.headerAction
      getCascadeList({ property_id: propertyId }).then(res => {
        if (res.data.code == 200) {
          let data = res.data.data
          this.activitiesType = []
          this.activities = []
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
              this.activities.push([obj.value, shopObj.value])
            })
            this.activitiesType.push(obj)
          })
          this.paramsPrepare()
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
        that.isAlert = true
        that.alertText.bg = '#00A0E9'
        that.alertText.title = '趋势分析'
        that.alertText.text = '商铺不能为空，请选择商铺'
        that.alertText.confirm = false
        return false
      }
      var listId = _.clone(that.activities)
      let allId = []
      listId.map(val => { allId.push(val[1]) })
      var bzid = allId.join(',')
      that.loadingData.time1 = time1
      that.loadingData.time2 = time2
      that.loadingData.id = bzid
      goShopTrend({ time1: time1, time2: time2, bzid: bzid, range: range }).then(res => {
        // that.$vs.loading.close()
        // that.$store.commit('loadingState', false)
        that.isList = true
        that.lineData.chartOptions.xaxis.categories = []
        that.lineData.series = []
        that.graphData.chartOptions.xaxis.categories = []
        that.graphData.series = []
        that.isData = false
        that.goName = []
        that.goTableList = []
        that.goName.push('时间')
        var data = res.data.data
        if (that.selectType === 0) {
          that.noComparison(data)
        } else {
          that.comparison(data, range)
        }
      })

      try {
        let date, type
        if (that.selectType === 0) {
          type = '无对比'
          date = time1
        } else {
          type = '时间对比'
          date = [time1, time2]
        }

        let arr = []
        that.activities.map(list => {
          that.activitiesType.map(val => {
            val.children.map(name => {
              if (name.value == list[1]) {
                arr.push([list[0], name.label])
              }
            })
          })
        })
        let arrs = []
        arr.forEach(item => {
          arrs.push(item[0] + '/' + item[1])
        })
        window.TDAPP.onEvent(this.$route.meta.pageTitle + '页面', '进店率趋势查询', { '对比方式': type, '时间段': date, '店铺选择': arrs.join(',') })
      } catch (error) {
        console.log(this.$route.meta.pageTitle + '页面-' + '进店率趋势查询' + '埋点error:' + error)
      }
    },
    // 无时间对比 数据处理
    noComparison (data) {
      let that = this
      if (data.length == 0) return
      let date1data = data[Object.keys(data)[0]]// 时间1，时间2
      let date1Val = Object.values(date1data)[0]// 店铺1 店铺2
      date1Val.map(e => {
        that.lineData.chartOptions.xaxis.categories.push(e.date)
        that.graphData.chartOptions.xaxis.categories.push(e.date)
      })
      var allData = []
      Object.values(date1data).forEach(function (shopData) {
        var obj = {}
        obj.name = shopData[0].name
        obj.data = []
        shopData.forEach(function (d) {
          var size = d.rate === 0 ? '0' : NP.times(d.rate, 100)
          obj.data.push(Number(size))
        })
        allData.push(shopData)
        that.lineData.series.push(obj)
        that.graphData.series.push(obj)
      })
      if (that.$refs.graphLine) {
        that.$refs.graphLine.updateOptions({
          xaxis: { categories: that.lineData.chartOptions.xaxis.categories }
        })
      }

      var time1 = moment(that.crossDate[0]).format('YYYY-MM-DD')
      var time2 = moment(that.crossDate[1]).format('YYYY-MM-DD')
      setTimeout(() => {
        var div = document.getElementById('tendencyLine')
        var width
        if (div) width = div.offsetWidth
        var number = (width / 2).toFixed(2) - 50
        // 更新 chart x 轴数据 以及控制柱状图大小
        if (time1 == time2) that.upDateLineX(number, false)
        else that.upDateLineX(0, true)
        if (that.$refs.graphBar) this.upDateBarX()
      })

      // 表格数据
      allData.forEach(function (n) { that.goName.push(n[0].name) })
      allData[0].forEach(function (d, index) {
        var tableObj = {}
        tableObj.name = d.date
        tableObj.percentList = []
        allData.forEach(function (l, allIndex) {
          var d = allData[allIndex][index] ? allData[allIndex][index].rate : 0
          var size = d === 0 ? '0%' : NP.times(d, 100) + '%'
          tableObj.percentList.push(size)
        })
        that.goTableList.push(tableObj)
      })
    },
    // 时间对比 数据处理
    comparison (data, type) {
      let that = this
      let date1 = data[Object.keys(data)[0]]// 时间1，时间2
      let date2 = data[Object.keys(data)[1]]// 时间1，时间2

      let value1 = Object.values(date1)[0].length
      let value2 = Object.values(date2)[0].length
      let allData
      if (value1 > value2) allData = Object.values(date1)[0]
      else allData = Object.values(date2)[0]
      let dateType
      type == 'Month' ? dateType = '月' : dateType = '天'
      allData.map(function (d, index) {
        var size = Number(index) + 1
        var num = '第' + size + dateType
        that.lineData.chartOptions.xaxis.categories.push(num)
        that.graphData.chartOptions.xaxis.categories.push(num)
      })
      _.forIn(data, function (val, key) {
        _.forIn(val, function (v, k) {
          var obj = {}
          obj.name = v[0].name + key.replace(/,/g, ' - ')
          obj.data = []
          v.map((d, index) => { obj.data.push(NP.times(d.rate, 100)) })
          that.lineData.series.push(obj)
          that.graphData.series.push(obj)
        })
      })
      that.$refs.graphLine.updateOptions({
        xaxis: { categories: that.lineData.chartOptions.xaxis.categories }
      })
      var time1 = moment(that.crossDate[0]).format('YYYY-MM-DD')
      var time2 = moment(that.crossDate[1]).format('YYYY-MM-DD')
      var time3 = moment(that.crossDateTwo[0]).format('YYYY-MM-DD')
      var time4 = moment(that.crossDateTwo[1]).format('YYYY-MM-DD')
      setTimeout(() => {
        var width = document.getElementById('tendencyLine').offsetWidth
        var number = (width / 2).toFixed(2) - 50
        // 更新 chart x 轴数据 以及控制柱状图大小
        if (time1 == time2 && time3 == time4) that.upDateLineX(number, false)
        else that.upDateLineX(0, true)
        if (that.$refs.graphBar) this.upDateBarX()
      })
      // 表格数据
      _.forIn(data, function (value, key) {
        _.forIn(value, function (listValue, listKey) {
          that.goName.push(listValue[0].name + key)
        })
      })
      if (value1 > value2) {
        var list = Object.values(date1)
        var listTwo = Object.values(date2)
        list[0].map(function (listData, listIndex) {
          var tableObj = {}
          var size = listIndex + 1
          tableObj.name = '第' + size + dateType
          tableObj.percentList = []
          list.map(function (all, allIdnex) {
            var d = list[allIdnex][listIndex].rate
            var size = d === 0 ? '0%' : NP.times(d, 100) + '%'
            tableObj.percentList.push(size)
          })
          list.map(function (all, allIdnex) {
            var td = listTwo[allIdnex][listIndex]
            var sizeT
            if (td) {
              sizeT = td === 0 ? '0%' : NP.times(td.rate, 100) + '%'
            } else {
              sizeT = ' '
            }
            tableObj.percentList.push(sizeT)
          })
          that.goTableList.push(tableObj)
        })
      } else {
        var list = Object.values(date2)
        var listTwo = Object.values(date1)
        list[0].map(function (listData, listIndex) {
          var tableObj = {}
          var size = listIndex + 1
          tableObj.name = '第' + size + dateType
          tableObj.percentList = []
          list.map(function (all, allIdnex) {
            var td = listTwo[allIdnex][listIndex]
            var sizeT
            if (td) {
              sizeT = td.rate === 0 ? '0%' : NP.times(td.rate, 100) + '%'
            } else {
              sizeT = ' '
            }
            tableObj.percentList.push(sizeT)
          })
          list.map(function (all, allIdnex) {
            var d = list[allIdnex][listIndex].rate
            var size = d === 0 ? '0%' : NP.times(d, 100) + '%'
            tableObj.percentList.push(size)
          })
          that.goTableList.push(tableObj)
        })
      }
    },
    // 重置数据
    resetData () {
      var date = new Date()
      date = date.setDate(date.getDate() - 1)
      var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
      this.crossDate = dateTime
      this.selectType = 0
      this.activities = []
      try {
        window.TDAPP.onEvent(this.$route.meta.pageTitle + '页面', '进店率趋势重置', {})
      } catch (error) {
        console.log(this.$route.meta.pageTitle + '页面-' + '进店率趋势重置-埋点error:' + error)
      }
    },
    // 更新线 x 轴
    upDateLineX (number, state) {
      let that = this
      that.lineData.chartOptions.xaxis.labels.offsetX = number
      if (that.$refs.graphLine) {
        that.$refs.graphLine.updateOptions({
          xaxis: { offsetX: that.lineData.chartOptions.xaxis.labels.offsetX }
        })
        that.lineData.chartOptions.xaxis.axisBorder.show = state
        that.$refs.graphLine.updateOptions({
          xaxis: { show: that.lineData.chartOptions.xaxis.axisBorder.show }
        })
      }
    },
    // 更新柱状图 x 轴
    upDateBarX () {
      let that = this
      that.$refs.graphBar.updateOptions({
        xaxis: { categories: that.graphData.chartOptions.xaxis.categories }
      })
      that.$refs.graphBar.updateOptions({ xaxis: that.graphData.chartOptions.xaxis })
      if (that.graphData.chartOptions.xaxis.categories.length < 2) {
        that.graphData.chartOptions.plotOptions.bar.columnWidth = '15%'
        that.$refs.graphBar.updateOptions({ plotOptions: that.graphData.chartOptions.plotOptions })
      } else if (that.graphData.chartOptions.xaxis.categories.length < 5) {
        that.graphData.chartOptions.plotOptions.bar.columnWidth = '20%'
        that.$refs.graphBar.updateOptions({ plotOptions: that.graphData.chartOptions.plotOptions })
      } else {
        that.graphData.chartOptions.plotOptions.bar.columnWidth = '70%'
        that.$refs.graphBar.updateOptions({ plotOptions: that.graphData.chartOptions.plotOptions })
      }
    },
    // 图标点击
    iconClick (index) {
      // 下载文件
      if (index === 3) {
        var time1 = this.loadingData.time1
        var time2 = this.loadingData.time2
        var id = this.loadingData.id
        // if (this.$store.state.home.loadingState == false) {
        //   this.$store.commit('loadingState', true)
        //   this.$vs.loading()
        // }
        goShowFlowTend({ time1: time1, time2: time2, bzid: id }).then(res => {
          let date = new Date()
          const blob = new Blob([res.data])
          let name = '进店率分析趋势分析'
          let fileName = name + moment(date).format('YYYYMMDDHHmmss') + '.xls'
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href)// 释放URL 对象
          document.body.removeChild(elink)
          // this.$vs.loading.close()
          // this.$store.commit('loadingState', false)
        })
        try {
          window.TDAPP.onEvent(this.$route.meta.pageTitle + '页面', '进店率趋势' + '下载', { })
        } catch (error) {
          console.log(this.$route.meta.pageTitle + '页面-' + '进店率趋势' + '下载-埋点error:' + error)
        }
      } else {
        // 切换
        this.iconIndex = index
      }
    },
    alertConfirm () { this.isAlert = false },
    closeAlert () { this.isAlert = false },
    shopActionList (value) {
      var that = this
      let totalLength = that.activitiesType.length
      if ((totalLength - value.length) == 1 && value.indexOf(0) != -1) {
        this.selectAll = 0
        that.activities = _.filter(value, function (e) {
          return e != 0
        })
      }
      if (this.selectAll == 1 && value.indexOf(0) == -1) {
        this.selectAll = 0
        that.activities = []
      }
      if (_.last(value) == 0) {
        let arr = that.activitiesType.map(function (l) {
          return l.value
        })
        this.selectAll = 1
        that.activities = arr
      }
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
<style lang="less">
.go-shop-activities input{
  width: 230px;
}
.tendency-bottom{
  button{
    font-weight: normal!important;
  }
}
.tendency-picker{
  margin-bottom: 20px;
  overflow: hidden;
  .con-select{
    clear: none;
  }
  .ivu-input{
    font-size: 14px;
    border: 1px solid rgba(0, 0, 0, .2);
    font-family: "source_han_sans_cn", "Roboto", sans-serif;
  }
  .selectExample{
    float: left;
    width: 230px;
    margin-left: 30px;
  }
  .vs-select--input{
    height: 43px;
  }
  .ivu-input{
    height:43px;
    font-family: "source_han_sans_cn", "Roboto", sans-serif;
  }
  .ivu-input-suffix {
    i{
    height: 43px;
    width: 40px;
    line-height: 43px;
    }
  }
  .ivu-date-picker .ivu-select-dropdown{
    z-index:90000
  }
}
.el-cascader__tags{
  height: 30px;
  overflow: hidden;
}
</style>
<style lang="less" scoped>
.go-shop{
    width: 100%;
    height: auto;
    .go-time-selector{
        width: 100%;
        height: auto;
        background-color: #fff;
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);
        padding: 27px 0 18px 19px;
        border-radius: .5rem;
        h1{
          font-size: 18px;
          font-weight:400;
          color:rgba(62,60,60,1);
          margin-bottom: 20px;
        }
        .go-shop-activities{
          width: 100%;
          height: auto;
          .con-select{
            display: inline-block;
          }
        }
        .cross-submit{
          display:inline-block;
          padding: 0.75rem 2rem;
          text-align:center;
          border-radius: 6px;
          background-color: #00A0E9;
          border:1px solid #00A0E9;
          color: #fff;
          font-size: 1rem;
          margin:  0px 0 0px 30px;
          cursor: pointer;
          &:hover{
            box-shadow: 0 8px 25px -8px #00A0E9;
          }
        }
        .cross-reset{
          display:inline-block;
          padding: 0.75rem 2rem;
          text-align:center;
          border-radius: 6px;
          border:1px solid #00A0E9;
          background-color: #fff;
          color: #00A0E9;
          font-size: 1rem;
          margin:  0px 0 0px 30px;
          cursor: pointer;
          &:hover{
            box-shadow: 0 8px 25px -8px #00A0E9;
          }
        }
    }
    .go-shop-chart-list{
        margin-top: 20px;
        background-color: #fff;
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);
        border-radius: .5rem;
        position: relative;
        height: 490px;
        overflow: hidden;
        padding-top: 41px;
        .go-shop-time-icon{
          display: inline-block;
          position: absolute;
          left: 19px;
          top: 20px;
          right: 0;
          overflow: hidden;
          z-index: 1;
          span:nth-child(1){
            width: 10%;
            font-size:18px;
          }
          p{
            float: right;
            margin-top: 20px;
            margin-right: 50px;
            span{
              margin-left: 10px;
              cursor: pointer;
            }
          }
        }
        .noData{
          width: 100%;
          height: 100%;
          line-height: 100%;
          font-size: 24px;
          display:flex;
          align-items: center;
          justify-content: center;
        }
        .tendencyLine,.tendencyBar,.tendencyTable{
          transform: translateY(100%);
          transition: none!important;
        }
        .tendencyTable{
          height: 428px;
          box-shadow: none;
          overflow: auto;
        }
        .lineAction{
          transform: translateY(0%);
        }
        .barAction{
          transform: translateY(-100%);
        }
        .tableAction{
          transform: translateY(-200%);
        }
    }
}
</style>
