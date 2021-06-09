<template>
    <div class="holidayAnaysis">
        <div class="box-card bg-white header" style="margin-bottom:20px;">
            <!-- <div class="title">趋势分析</div> -->
            <vs-select class="selectExample selects" @change="yearChangeData(1)"  autocomplete v-model="selectYear" >
              <vs-select-item  :value="item.value" :text="item.key" :key="index" v-for="(item,index) in years" />
            </vs-select>
            <vs-select class="selectExample selects" autocomplete v-model="selectHoliday" >
              <vs-select-item  :value="item.value" :text="item.key" :key="index" v-for="(item,index) in holidays" />
            </vs-select>
            <!-- <vs-select class="selectExample selects more" autocomplete v-model="selectEntity">
              <vs-select-item  :value="item.value" :text="item.key" :key="index" v-for="(item,index) in entities" />
            </vs-select> -->
            <vs-button color="primary" class="buttons" v-on:click="handleSearch">查询</vs-button>
            <vs-button color="primary" class="reset-buttons" v-on:click="trendResetData">重置</vs-button>
        </div>
        <HolidayAnalysis
          class="HolidayAnalysis"
          :series="series"
          :type="type"
          :options = "options"
          :columns="columns"
          :tableList="tableList"
          :dateTime='selectYear'
          :pdfName='trendPdf'
          :domId='idOne'
          :selectHoliday='selectHoliday'
          :ExcelData='trendExcel'
        ></HolidayAnalysis>

        <div  class="box-card bg-white header headerCompare" style="margin-bottom:20px;">
          <!-- <p class="title">节假日活动对比分析</p> -->
            <div class="flexs">
                <vs-select class="selectExample selects" autocomplete @change="yearChangeData(2)"  v-model="compareYear1" >
                    <vs-select-item  :value="item.value" :text="item.key" v-for="(item,index) in years" />
                </vs-select>
                <vs-select class="selectExample selects" autocomplete v-model="compareHoliday1" >
                    <vs-select-item  :value="item.value" :text="item.key" v-for="(item,index) in holidayActives1" />
                </vs-select>
                </div>
            <div class="flexs">
                <vs-select class="selectExample selects" autocomplete @change="yearChangeData(3)" v-model="compareYear2" >
                    <vs-select-item  :value="item.value" :text="item.key" v-for="(item,index) in years" />
                </vs-select>
                <vs-select class="selectExample selects" autocomplete v-model="compareHoliday2" >
                    <vs-select-item  :value="item.value" :text="item.key" v-for="(item,index) in holidayActives2" />
                </vs-select>
                <vs-button color="primary" class="buttons" v-on:click="handleSearchCompare">查询</vs-button>
                <vs-button color="primary" class="reset-buttons" v-on:click="HolidaysResetData">重置</vs-button>
            </div>
            <!-- <div class="flexs"> -->
                <!-- <vs-select class="selectExample selects"  autocomplete v-model="selectEntity2">
                    <vs-select-item  :value="item.value" :text="item.key" v-for="item,index in entities" />
                </vs-select> -->
            <!-- </div> -->
        </div>
        <HolidayAnalysis
          class="HolidayAnalysis"
          :type='type'
          :series="series2"
          :options = "options2"
          :columns="columns2"
          :tableList="tableList2"
          :pdfName='contrastPdf'
          :domId='idTwo'
          :ExcelData='contrastExcel'
          :title1='"节假日活动对比分析"'
        ></HolidayAnalysis>
    </div>
</template>

<script>
import Moment from 'moment'
import HolidayAnalysis from '@/components/holiday-analysis/holiday-analysis.vue'
import { getDateCompare } from '@/api/operate'
import { getanalysiseeo } from '@/api/home'
import { getActiveDays, holidayAnalysis } from '@/api/manager.js'
import { yearList, gotInnerRange } from '@/libs/util.js'

export default {
  components: {
    HolidayAnalysis
  },
  data () {
    return {
      trendExcel: {
        type: 1,
        enter: 'enter',
        bzid: '',
        year: ''
      },
      contrastExcel: {
        type: 2,
        data: {}
      },
      idOne: 'idOne',
      idTwo: 'idTwo',
      trendPdf: '节假日活动趋势分析/',
      contrastPdf: '节假日活动对比分析/',
      type: 'bar',
      years: [],
      entities: [],
      holidays: [], // 节假日数据
      holidayActives1: [], // 节假日活动数据
      holidayActives2: [], // 节假日活动数据
      selectYear: new Date().getFullYear(),
      compareYear1: new Date().getFullYear(),
      compareYear2: new Date().getFullYear(),
      compareHoliday1: '',
      compareHoliday2: '',
      selectEntity: '',
      selectEntity2: '',
      selectHoliday: '',
      targetData: [],
      AllHolidayData: [], // 所有的节假日
      current: 0,
      year: '',
      bzids: [],
      columns: ['节日', '客流量'],
      columns2: ['时间'],
      tableList: [],
      tableList2: [],
      series: [{
        name: '',
        data: []
      }],
      series2: [],
      options0: {
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '30%'
          }
        },
        chart: {
          height: 505,
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          }
        },
        colors: ['#7467ED', '#2BD9CF', '#EA5455', '#FF9F43', '#1E1E1E'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight',
          width: 2
        },
        title: {
          text: '',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        noData: {
          text: '暂无数据',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '14px',
            fontFamily: undefined
          }
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: ''
          },
          labels: {
            show: true,
            formatter: (value) => { return value.toLocaleString() }
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              if (val === null) return ''
              else {
                return '客流量 ' + val.toLocaleString() + '人'
              }
            }
          }
        }
      },
      options2: {
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '30%'
          }
        },
        chart: {
          height: 505,
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          }
        },
        colors: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight',
          width: 2
        },
        title: {
          text: '',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        noData: {
          text: '暂无数据',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '14px',
            fontFamily: undefined
          }
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: ''
          },
          labels: {
            show: true,
            formatter: (value) => { return value.toLocaleString() }
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              if (val === null) return ''
              else {
                return '客流量 ' + val.toLocaleString() + '人'
              }
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
      options: {
        colors: ['#00A0E9', '#7467ED', '#EA5455', '#FF9F43', '#1E1E1E'],
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '30%'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: false,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: ''
          },
          labels: {
            show: true,
            formatter: (value) => { return value.toLocaleString() }
          }
        },
        noData: {
          text: '暂无数据',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '14px',
            fontFamily: undefined
          }
        },
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
              if (val === null) return ''
              else {
                return '客流量 ' + val.toLocaleString() + '人'
              }
            }
          }
        }
      }
    }
  },
  watch: {
    '$store.state.home.headerAction' () {
      this.trendResetData()
      this.HolidaysResetData()
      let routerName = this.$router.currentRoute.name
      if (routerName === 'HolidayAnalysis') this.init()
    }
  },
  computed: {
  },
  activated () {
    this.init()
  },
  mounted () {
  },
  methods: {
    // 开始加载
    init () {
      this.years = yearList()
      this.selectYear = Moment().year()
      this.compareYear1 = Moment().year()
      this.compareYear2 = Moment().year()
      this.initialApiData()
      this.selectEntity = ''
      this.selectEntity2 = ''
      var bussinessTree = this.$store.state.home.bussinessTree
      var entities = []
      let propertyId = this.$store.state.home.headerAction
      bussinessTree.forEach(function (m, index) {
        if (m.property_id == propertyId) {
          var data = {}
          data.key = m.name
          data.value = m.id
          entities.push(data)
        }
      })
      this.entities = entities
      this.selectEntity = entities[0].value
      this.selectEntity2 = entities[0].value
    },
    initialApiData () {
      let year = this.selectYear
      let propertyId = this.$store.state.home.headerAction
      Promise.all([
        getActiveDays(year, 20),
        getActiveDays(year, 21, propertyId)
      ]).then(res => {
        // 节假日
        this.holidays = []
        this.holidayActives1 = []
        this.holidayActives2 = []
        this.AllHolidayData = []
        if (res[0].data.code == 200) {
          let data = res[0].data.data
          this.holidays.push({ 'key': '全部节假日活动', 'value': '' })
          data.map(list => {
            this.AllHolidayData.push(list)
            let obj = {}
            obj.value = list.id
            obj.key = list.name
            this.holidays.push(obj)
            this.holidayActives1.push(obj)
            this.holidayActives2.push(obj)
          })
          this.selectHoliday = this.holidays[0] ? this.holidays[0].value : ''
          setTimeout(() => {
            this.compareHoliday1 = this.holidayActives1[0] ? this.holidayActives1[0].value : ''
            this.compareHoliday2 = this.holidayActives2[0] ? this.holidayActives2[0].value : ''
          })
        }
        // 活动
        if (res[1].data.code == 200) {
          let data = res[1].data.data
          data.map(list => {
            this.AllHolidayData.push(list)
            let obj = {}
            obj.value = list.id
            obj.key = list.name
            this.holidays.push(obj)
            this.holidayActives1.push(obj)
            this.holidayActives2.push(obj)
          })
          setTimeout(() => {
            this.handleSearch()
            this.handleSearchCompare()
          })
        }
      })
    },
    yearChangeData (type) {
      let year
      let propertyId = this.$store.state.home.headerAction
      switch (type) {
        case 1:
          year = this.selectYear
          break
        case 2:
          year = this.compareYear1
          break
        case 3:
          year = this.compareYear2
          break
      }

      Promise.all([
        getActiveDays(year, 20),
        getActiveDays(year, 21, propertyId)
      ]).then(res => {
        // 节假日

        if (res[0].data.code == 200) {
          let data = res[0].data.data
          let listData = data.map(list => {
            this.AllHolidayData.push(list)
            let obj = {}
            obj.value = list.id
            obj.key = list.name
            return obj
          })
          switch (type) {
            case 1:
              year = this.selectYear
              this.holidays = []
              this.holidays = [{ 'key': '全部节假日活动', 'value': '' }, ...listData]
              break
            case 2:
              year = this.compareYear1
              this.holidayActives1 = []
              this.holidayActives1 = listData
              break
            case 3:
              year = this.compareYear2
              this.holidayActives2 = []
              this.holidayActives2 = listData
              break
          }
        }
        // 活动
        if (res[1].data.code == 200) {
          let data = res[1].data.data
          let listData = data.map(list => {
            this.AllHolidayData.push(list)
            let obj = {}
            obj.value = list.id
            obj.key = list.name
            return obj
          })
          switch (type) {
            case 1:
              this.holidays = [...this.holidays, ...listData]
              this.selectHoliday = this.holidays[0] ? this.holidays[0].value : ''
              break
            case 2:
              this.holidayActives1 = [...this.holidayActives1, ...listData]
              this.compareHoliday1 = this.holidayActives1[0] ? this.holidayActives1[0].value : ''
              break
            case 3:
              this.holidayActives2 = [...this.holidayActives2, ...listData]
              this.compareHoliday2 = this.holidayActives2[0] ? this.holidayActives2[0].value : ''
              break
          }
        }
      })
    },
    // 趋势分析 年份切换
    // selectYearChange () {
    //   this.getHoliday('holidays', this.selectYear, 'selectHoliday')
    // },
    // // 节假日活动对比分析 第一个年份切换
    // getHolidayActives1 () {
    //   this.getHoliday('holidayActives1', this.compareYear1, 'compareHoliday1')
    // },
    // // 节假日活动对比分析 第二个年份切换
    // getHolidayActives2 () {
    //   this.getHoliday('holidayActives2', this.compareYear2, 'compareHoliday2')
    // },
    // getHoliday (listkey, year, valuekey) {
    //   if (this.$store.state.home.loadingState == false) {
    //     this.$store.commit('loadingState', true)
    //     this.$vs.loading()
    //   }
    //   let holidays = listkey == 'holidays' ? [
    //     { 'key': '全部节假日活动', 'value': '' }
    //   ] : []
    //   getActiveDays(year, 20).then((res) => {
    //     if (res.data.code === 200) {
    //       res = res.data.data
    //       this.AllHolidayData = _.cloneDeep(res)
    //       res.forEach((m) => {
    //         holidays.push({
    //           value: m.id,
    //           key: m.name
    //         })
    //       })
    //       this[listkey] = holidays
    //       this[valuekey] = this[listkey][0] && this[listkey][0].value || ''// 清空选中的节假日
    //       this.handleSearchCompare()
    //     } else {
    //       this[listkey] = []
    //     }
    //     if (listkey !== 'holidays') {
    //       this.getActive(listkey, year, valuekey)
    //     } else {
    //       this.$vs.loading.close()
    //       this.$store.commit('loadingState', false)
    //     }
    //   })
    // },

    // getActive (listkey, year, valuekey) {
    //   var holidayActives = _.cloneDeep(this[listkey])
    //   var Holidays = _.cloneDeep(this.AllHolidayData)
    //   let propertyId = this.$store.state.home.headerAction
    //   getActiveDays(year, 21, propertyId).then((res) => {
    //     this.$vs.loading.close()
    //     this.$store.commit('loadingState', false)
    //     if (res.data.code === 200) {
    //       res = res.data.data
    //       let AllHolidayData = []
    //       AllHolidayData = AllHolidayData.concat(res, Holidays)
    //       this.AllHolidayData = AllHolidayData
    //       res.forEach((m, index) => {
    //         const data = {
    //           value: m.id,
    //           key: m.name
    //         }
    //         holidayActives.push(data)
    //         this.holidays.push(data)
    //       })
    //       this[listkey] = holidayActives
    //       this[valuekey] = this[listkey][0] && this[listkey][0].value || ''// 清空选中的节假日
    //       this.handleSearchCompare()
    //     } else {
    //       this.holidays = []
    //       this[valuekey] = ''
    //     }
    //   })
    // },
    // 趋势分析 查询
    handleSearch () {
      var year = this.selectYear
      var bzid = this.selectEntity
      var holiday = this.selectHoliday
      var that = this
      if (!year) {
        alert('请选择年份')
        return
      }
      if (!bzid) {
        alert('请选择购物中心')
        return
      }
      try {
        let find = _.find(this.holidays, ['value', this.selectHoliday])
        find = find && find.key ? find.key : ''
        window.TDAPP.onEvent('节假日活动分析页面', '趋势分析查询', { '时间段': year.toString(), '节假日活动选择': find })
      } catch (error) {
        console.log('节假日活动分析页面-趋势分析查询-埋点error:' + error)
      }
      if (!holiday) {
        that.trendExcel.bzid = bzid
        that.trendExcel.year = year
        that.trendExcel.innerRange = ''
        that.trendExcel.range = ''
        holidayAnalysis('enter', bzid, year)
          .then(function (res) {
            var xAxis = res.data.data.map(function (m) {
              return m.name
            })
            var series = res.data.data.map(function (m) {
              return m.enter
            })
            var options = _.cloneDeep(that.options)
            options.xaxis.categories = xAxis
            var columnWidth = '30%'
            if (xAxis.length) columnWidth = xAxis.length < 5 ? '20%' : '70%'
            options.plotOptions.bar.columnWidth = columnWidth
            that.options = options
            that.series[0].data = series
            var tableList = res.data.data
            tableList.forEach(function (m) {
              m.enter = m.enter == 0 ? ' ' : m.enter.toLocaleString() + '人'
            })
            that.tableList = tableList
            that.columns = ['节日', '客流量']
          })
      } else {
        let holiday = _.find(this.AllHolidayData, { 'id': this.selectHoliday })
        let innerRange = gotInnerRange([holiday.begin, holiday.end])
        var range = holiday.begin + ',' + holiday.end
        var params = {
          type: 'enter',
          bzid: bzid,
          innerRange: innerRange,
          range: range
        }
        that.trendExcel.bzid = bzid
        that.trendExcel.year = ''
        that.trendExcel.innerRange = innerRange
        that.trendExcel.range = range
        var xAxis
        getanalysiseeo(params).then(function (res) {
          if (innerRange == '1h') {
            xAxis = res.data.data.map(function (m) {
              return m.begin.split(' ')[1]
            })
          } else {
            xAxis = res.data.data.map(function (m) {
              return m.begin.split(' ')[0]
            })
          }
          var series = res.data.data.map(function (m) {
            return m.enter
          })
          var options = _.cloneDeep(that.options)
          options.xaxis.categories = xAxis
          var columnWidth = '30%'
          if (xAxis.length) {
            columnWidth = xAxis.length < 5 ? '20%' : '70%'
          }
          options.plotOptions.bar.columnWidth = columnWidth
          that.options = options
          that.series[0].data = series
          var tableList = res.data.data
          var tableData = []
          tableList.forEach(function (m) {
            var obj = {}
            if (innerRange == '1h') {
              obj.begin = m.begin.split(' ')[1]
            } else {
              obj.begin = m.begin.split(' ')[0]
            }
            obj.enter = m.enter == 0 ? ' ' : m.enter.toLocaleString() + '人'
            tableData.push(obj)
          })
          that.columns = ['日期', '客流量']
          that.tableList = tableData
        })
      }
    },
    // 节假日活动对比分析 查询
    handleSearchCompare () {
      var that = this

      that.columns2 = ['时间']
      var compare1 = _.find(this.AllHolidayData, { 'id': this.compareHoliday1 })
      var compare2 = _.find(this.AllHolidayData, { 'id': this.compareHoliday2 })

      if (!compare1 || !compare2) return
      var date1 = { 'begin': compare1.begin, 'end': compare1.end }
      var date2 = { 'begin': compare2.begin, 'end': compare2.end }
      var params = {
        date1: {
          begin: date1.begin,
          end: date1.end
        },
        date2: {
          begin: date2.begin,
          end: date2.end
        },
        type: 'enter',
        bzid: this.selectEntity
      }
      that.columns2.push(compare1.name)
      that.columns2.push(compare2.name)
      that.contrastExcel.data = params
      try {
        let find1 = _.find(this.holidayActives1, ['value', this.compareHoliday1])
        find1 = find1 && find1.key ? find1.key : ''
        let find2 = _.find(this.holidayActives2, ['value', this.compareHoliday2])
        find2 = find2 && find2.key ? find2.key : ''
        window.TDAPP.onEvent('节假日活动分析页面', '对比查询', { '时间段': [this.compareYear1, this.compareYear2], '节假日活动选择': [find1, find2] })
      } catch (error) {
        console.log('节假日活动分析页面-对比查询-埋点error:' + error)
      }
      getDateCompare(params).then(function (res) {
        var data = res.data.data
        var xaxis = []
        data.forEach(function (m, index) {
          xaxis.push('第' + (index + 1) + '天')
        })
        var resData1 = []
        if (Moment(compare1.begin).isAfter(Moment(new Date()))) {
          resData1 = data.map(function (m, index) { return '' })
        } else {
          resData1 = data.map(function (m, index) {
            // if (Moment(m.date1.belong).isBetween(compare1.begin, compare1.end) ||
            // Moment(m.date1.belong).isSame(compare1.begin) || Moment(m.date1.belong).isSame(compare1.end)) {
            //   if (!m.date1.enter) return 0
            //   else return m.date1.enter
            // }
            if (!m.date1.enter) return 0
            else return m.date1.enter
          })
        }
        var resData2 = []
        if (Moment(compare2.begin).isAfter(Moment(new Date()))) {
          resData2 = data.map(function (m, index) { return '' })
        } else {
          resData2 = data.map(function (m) {
            // if (Moment(m.date2.belong).isBetween(compare2.begin, compare2.end) ||
            // Moment(m.date2.belong).isSame(compare2.begin) || Moment(m.date2.belong).isSame(compare2.end)) {
            //   if (!m.date2.enter) return 0
            //   else return m.date2.enter
            // }
            if (!m.date2.enter) return 0
            else return m.date2.enter
          })
        }
        var series2 = [{ 'name': '', 'data': [] }, { 'name': '', 'data': [] }]
        series2[0].name = that.compareYear1 + compare1.name
        series2[0].smooth = true
        series2[0].data = resData1
        series2[1].name = that.compareYear2 + compare2.name
        series2[1].smooth = true
        series2[1].data = resData2
        that.series2 = series2

        var options2 = _.cloneDeep(that.options0)
        options2.xaxis.categories = xaxis
        var columnWidth = '30%'
        if (xaxis.length) {
          columnWidth = xaxis.length < 5 ? '20%' : '70%'
        }
        options2.plotOptions.bar.columnWidth = columnWidth
        that.options2 = options2
        var tableList2 = []
        resData1.forEach(function (m, index) {
          var obj = {}
          obj.name = xaxis[index] ? xaxis[index] : ' '
          if (m || m === 0) obj.begin = m.toLocaleString() + '人' || ' '
          else obj.begin = ' '
          obj.end = (resData2[index] || resData2[index] === 0) ? resData2[index].toLocaleString() + '人' : ' '
          tableList2.push(obj)
        })
        that.tableList2 = tableList2
      })
    },
    // 趋势分析重置
    trendResetData () {
      try {
        window.TDAPP.onEvent('节假日活动分析页面', '趋势分析重置', { })
      } catch (error) {
        console.log('节假日活动分析页面-趋势分析重置-埋点error:' + error)
      }
      this.selectHoliday = this.holidays[0].value
      this.selectYear = new Date().getFullYear()
    },
    // 节假日活动对比分析 重置
    HolidaysResetData () {
      try {
        window.TDAPP.onEvent('节假日活动分析页面', '对比重置', { })
      } catch (error) {
        console.log('节假日活动分析页面-对比重置-埋点error:' + error)
      }
      this.compareYear1 = new Date().getFullYear()
      this.compareYear2 = new Date().getFullYear()
      this.compareHoliday1 = this.holidayActives1[0].value
      this.compareHoliday2 = this.holidayActives2[0].value
    }
  }
}
</script>

<style scope lang="less">
.holidayAnaysis{
    .header{
        display: flex;
        flex-wrap: wrap;
        height: 80px;
        padding:18px 0 18px 30px;
    }
    .headerCompare{
        height: 140px;
        padding:18px 0 0 30px;
    }
    .selects{
        margin-right: 20px;
    }
    .buttons{
      width: 84px;
      height:42px;
      padding: 0.75rem 0 !important;
      border: 1px solid #4096e5 ;
    }
    .reset-buttons{
      width: 84px;
      height:42px;
      padding: 0.75rem 0 !important;
      background-color: #fff!important;
      color: #4096e5 !important;
      margin-left: 20px;
      border: 1px solid #4096e5 ;
    }
    .more{
        width:300px;
    }
    .chartsTable{
        background-color: #fff;
        margin-top: 20px;
        border-radius: 6px;
        box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
    }
    .flexs{
        display: flex;
        width: 100%;

    }
    // .flexs:nth-child(2){
    //       width: 40%;
    //   }
    .title{
        width: 100%;
        font-size: 18px;
        color:#636363;
    }
    .HolidayAnalysis{
        margin-bottom: 40px;
        position: relative;
    }

}
</style>
