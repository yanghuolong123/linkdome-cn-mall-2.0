<style  lang="less" scoped>
@import "./groupAgeGender.less";
</style>
<template>
  <div>
    <div class="group-client">
      <div class="box-card left">
        <div class="title">
          <p>年龄分布</p>
          <ul>
            <li
                    :title="iconTitle[icon.type]"
                    :key="index"
                    v-for="(icon,index) in iconList"
                    v-on:click='iconClick(index,"age")'
            >
              <icons
                      :type="icon.type"
                      :size="20"
                      :color="iconIndex === icon.value ? iconColor :'#9D9D9DFF'"
              >
              </icons>
            </li>

          </ul>
        </div>
        <vue-apex-charts v-if="iconIndex == 0"
                         ref="ageGenderBar"
                         height="500"
                         type=bar
                         :options="ageOptions"
                         :series="ageSeries"></vue-apex-charts>
        <table-default v-else
                       class="groupTable"
                       :tableName='ageName'
                       :tableList='ageTableList'></table-default>
      </div>

      <div class=" box-card center">
        <div class="title">
          <p>性别分布</p>
          <ul>
            <li
              :title="iconTitle[icon.type]"
              :key="index"
              v-for="(icon,index) in iconList"
              v-on:click='iconClick(index,"gender")'
            >
              <icons :type="icon.type"
                     :size="20"
                     :color="genderIconIndex === icon.value ? iconColor :'#9D9D9DFF'"></icons>
            </li>

          </ul>
        </div>
        <vue-apex-charts v-if="this.genderIconIndex == 0"
                         height="500"
                         ref="genderBar"
                         type=bar
                         :options="genderChartOptions"
                         :series="genderSeries"></vue-apex-charts>
        <table-default v-else
                       class="groupTable"
                       :tableName='genderName'
                       :tableList='genderTableList'></table-default>
      </div>
    </div>
    <div class=" group-age-gender">
      <div class=" box-card left">
        <div class="title">
          <p>新老顾客占比
            <Tooltip :content="tootipText"
                     placement="bottom"
                     theme="light"
                     transfer
                     max-width="600">
              <icons type="wenhao" />
            </Tooltip>
          </p>
          <ul>
            <li :key="index"
                v-for="(icon,index) in iconList"
                v-on:click='iconClick(index,"client")'
                :title="iconTitle[icon.type]"
            >
              <icons :type="icon.type"
                     :size="20"
                     :color="clientIconIndex === icon.value ? iconColor :'#9D9D9DFF'"
              ></icons>
            </li>
          </ul>

        </div>
        <vue-apex-charts v-if="this.clientIconIndex == 0"
                         height="500"
                         ref="clientBar"
                         type=bar
                         :options="clientOptions"
                         :series="clientSeries"></vue-apex-charts>
        <table-default v-else
                       class="groupTable"
                       :tableName='clientName'
                       :tableList='clientTableList'>
        </table-default>
      </div>
      <div class=" box-card right">
        <div class="title">
          <p>到店次数占比</p>
          <ul>
            <li :key="index"
                v-for="(icon,index) in iconList"
                v-on:click='iconClick(index,"frequency")'
                :title="iconTitle[icon.type]"
            >
              <icons :type="icon.type"
                    :size="20"
                    :color="frequencyIconIndex === icon.value ? iconColor :'#9D9D9DFF'"
                    ></icons>
            </li>

          </ul>
        </div>
        <vue-apex-charts v-if="this.frequencyIconIndex == 0"
                        height="500"
                        ref="frequencyBar"
                        type=bar
                        :options="frequencyOptions"
                        :series="frequencySeries"></vue-apex-charts>
        <table-default v-else
                      class="groupTable"
                      :tableName='frequencyName'
                      :tableList='frequencyTableList'></table-default>
      </div>
    </div>
  </div>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'
import { getEntityFlow, exportEx } from '@/api/home.js'
import TableDefault from '@/views/ui-elements/table/TableDefault.vue'
import _ from 'lodash'
import moment from 'moment'
export default {
  name: 'group-age-gender',
  props: {
    outRange: String,
    default: ''
  },
  components: {
    VueApexCharts,
    TableDefault
  },
  data () {
    return {
      downLoadIcon: 'daoru',
      tootipText: '新顾客：在所选时间段内仅来过1次的人数\n老顾客：在所选时间段内来过2次及以上的人数',
      iconColor: 'rgb(34, 128, 215)',
      iconIndex: 0,
      frequencyIconIndex: 0,
      vipIconIndex: 0,
      clientIconIndex: 0,
      genderIconIndex: 0,
      iconList: [
        {
          type: '62',
          color: '#9D9D9DFF',
          value: 0
        },
        {
          type: 'biaoge-copy',
          color: '#9D9D9DFF',
          value: 1
        },
        {
          type: 'daoru',
          color: '#9D9D9DFF',
          value: 2
        }
      ],
      iconTitle: {
        '62': '柱状图',
        'biaoge-copy': '详细数据',
        'daoru': '下载'
      },
      // table
      ageName: ['购物中心'],
      ageTableList: [],
      frequencyName: ['购物中心'],
      frequencyTableList: [],
      clientName: ['购物中心'],
      clientTableList: [],
      genderName: ['购物中心'],
      genderTableList: [],
      vipName: ['购物中心'],
      vipTableList: [],
      // chart type
      ageSeries: [],
      ageOptions: {
        chart: {
          stacked: true,
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          bar: {
            columnWidth: '20%'
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        xaxis: {
          categories: []
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return Number(val).toLocaleString()
            }
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val.toLocaleString()
            }
          }
        },
        colors: ['#2BD9CF', '#00A0E9', '#33b3ed', '#FBA940', '#EC7172'],
        legend: {
          position: 'bottom',
          offsetX: 0,
          offsetY: 0
        }
      },
      frequencySeries: [],
      frequencyOptions: {
        chart: {
          stacked: true,
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          bar: {
            columnWidth: '20%'
            //  endingShape: 'rounded'
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        xaxis: {
          categories: []
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return Number(val).toLocaleString()
            }
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val.toLocaleString()
            }
          }
        },
        colors: ['#2BD9CF', '#00A0E9', '#33b3ed', '#FBA940', '#EC7172'],
        legend: {
          position: 'bottom',
          offsetX: 0,
          offsetY: 0
        }
      },
      clientSeries: [],
      clientOptions: {
        chart: {
          stacked: false,
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          bar: {
            columnWidth: '40%',
            endingShape: 'rounded'
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        xaxis: {
          categories: []
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return Number(val).toLocaleString()
            }
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val.toLocaleString()
            }
          }
        },
        legend: {
          position: 'bottom',
          offsetX: 0,
          offsetY: 0
        }
      },
      genderSeries: [],
      genderChartOptions: {
        chart: {
          stacked: false,
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          bar: {
            columnWidth: '40%',
            endingShape: 'rounded'
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        colors: ['rgb(0, 160, 233)', '#ee7552'],
        xaxis: {
          categories: []
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return Number(val).toLocaleString()
            }
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val.toLocaleString()
            }
          }
        },
        legend: {
          position: 'bottom',
          offsetX: 0,
          offsetY: 0
        }
      },
      vipSeries: [],
      vipChartOptions: {
        chart: {
          stacked: false,
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          bar: {
            columnWidth: '20%',
            endingShape: 'rounded'
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        xaxis: {
          categories: []
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return Number(val).toLocaleString()
            }
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val.toLocaleString()
            }
          }
        },
        legend: {
          position: 'bottom',
          offsetX: 0,
          offsetY: 0
        }
      },
      ageTabList: [],
      genderTabList: [],
      customTabList: [],
      numTabList: [],
      downloadName: ''
    }
  },
  computed: {},
  mounted () { },
  updated () {
  },
  activated () { // 进入页面 初始化页面数据
    this.initializeData()
  },
  watch: {
    // 监听事件 请求数据
    outRange () {
      this.dataList()
    }
  },
  methods: {
    // 请求数据
    dataList () {
      let that = this
      let companyId = this.$store.state.user.companyId
      let params = { range: this.outRange, company_id: companyId }
      getEntityFlow(params).then(res => {
        if (res.data.code == 200) {
          this.initializeData()
          let data = res.data.data
          // 年龄分布
          this.uploadChartXaxis('age', data.age_distribution, 'ageSeries', 'ageGenderBar', 'ageOptions')

          // 到店次数
          this.uploadChartXaxis('number', data.arrival_distribution, 'frequencySeries', 'frequencyBar', 'frequencyOptions')

          // 新老顾客占比
          this.uploadChartXaxis('client', data.new_old_proportion, 'clientSeries', 'clientBar', 'clientOptions')

          // vip顾客占比
          //  this.uploadChartXaxis('vip', data.vip_proportion,'vipSeries','vipBar,'vipChartOptions')

          // 性别分析
          let genderKeys = Object.keys(data.gender_propotion)
          let genderValues = Object.values(data.gender_propotion)
          if (genderValues.length != 0) {
            Object.keys(genderValues[0]).map(function (name, index) {
              let obj = {}
              obj.name = index == 0 ? '男性' : '女性'
              obj.data = []
              genderValues.map((lise) => { obj.data.push(lise[index]) })
              that.genderSeries.push(obj)
            })
          }

          this.genderChartOptions.xaxis.categories = genderKeys
          that.$refs.genderBar.updateOptions({
            xaxis: { categories: that.genderChartOptions.xaxis.categories }
          })
          that.genderSeries.map(name => { that.genderName.push(name.name) })
          genderKeys.map(function (list, index) {
            let obj = {}
            obj.name = list
            obj.percentList = []
            that.genderSeries.map(val => { obj.percentList.push(Number(val.data[index]).toLocaleString() + '人') })
            that.genderTableList.push(obj)
          })
        }
      })
    },
    uploadChartXaxis (type, data, series, ref, option) {
      let chartData
      let that = this
      switch (type) {
        case 'age':
          chartData = this.dataAssemble(data, 'age')
          break
        case 'number':
          chartData = this.dataAssemble(data, 'number')
          break
        case 'client':
          chartData = this.clinetAssemble(data, 'client')
          break
        case 'vip':
          chartData = this.clinetAssemble(data, 'vip')
          break
      }
      this[series] = chartData.series
      this[option].xaxis.categories = chartData.xaxis
      this.$refs[ref].updateOptions({
        xaxis: { categories: that[option].xaxis.categories }
      })
    },
    // 年龄分布 到店次数 数据处理
    dataAssemble (data, type) {
      let that = this
      let dataNumber = {
        xaxis: Object.keys(data),
        series: []
      }
      let ageValue = Object.values(data)
      let nameList = Object.keys(ageValue[0])
      nameList.map(function (list, index) {
        let obj = {}
        if (type == 'number') {
          let xName
          Number(list) == nameList.length ? xName = list + '次及以上' : xName = list + '次'
          obj.name = xName
        } else {
          obj.name = list
        }
        obj.data = []
        ageValue.map(function (val, vIndex) {
          _.forIn(val, function (value, key) {
            if (list == key) {
              let size
              type == 'age' ? size = Number(value.female) + Number(value.male) : size = value
              obj.data.push(size)
            }
          })
        })
        dataNumber.series.push(obj)
      })
      dataNumber.series.map(name => {
        type == 'age' ? that.ageName.push(name.name) : that.frequencyName.push(name.name)
      })
      dataNumber.xaxis.map(function (list, index) {
        let obj = {}
        obj.name = list
        obj.percentList = []
        dataNumber.series.map(val => { obj.percentList.push(Number(val.data[index]).toLocaleString() + '人') })
        type == 'age' ? that.ageTableList.push(obj) : that.frequencyTableList.push(obj)
      })
      return dataNumber
    },
    // 新老顾客 vip顾客占比 数据处理
    clinetAssemble (data, type) {
      let that = this
      let dataNumber = {
        xaxis: Object.keys(data),
        series: []
      }
      let clinetValue = Object.values(data)
      let nameList = Object.keys(clinetValue[0])
      nameList.map(name => {
        let obj = {}
        if (type == 'client') obj.name = name == 'newNum' ? '新顾客' : '老顾客'
        else obj.name = name == 'vipNum' ? 'VIP顾客' : '普通顾客'
        obj.data = []
        clinetValue.map(list => {
          _.forIn(list, function (value, key) {
            if (name == key) obj.data.push(value)
          })
        })
        dataNumber.series.push(obj)
      })

      dataNumber.series.map(name => {
        type == 'client' ? that.clientName.push(name.name) : that.vipName.push(name.name)
      })
      dataNumber.xaxis.map(function (list, index) {
        let obj = {}
        obj.name = list
        obj.percentList = []
        dataNumber.series.map(val => {
          obj.percentList.push(Number(val.data[index]).toLocaleString() + '人')
        })
        type == 'client' ? that.clientTableList.push(obj) : that.vipTableList.push(obj)
      })
      return dataNumber
    },
    // 图标点击
    iconClick (index, type) {
      switch (type) {
        case 'vip':
          if (index == 2) this.downloadVipData()
          else this.vipIconIndex = index
          break
        case 'client':
          if (index == 2) this.downloadCusData()
          else this.clientIconIndex = index
          break
        case 'gender':
          if (index == 2) this.downloadGenData()
          else this.genderIconIndex = index
          break
        case 'frequency':
          if (index == 2) this.downloadNumData()
          else this.frequencyIconIndex = index
          break
        case 'age':
          if (index == 2) this.downloadAgeData()
          else this.iconIndex = index
          break
      }
    },
    // 数据初始化
    initializeData () {
      this.ageSeries = []
      this.ageOptions.xaxis.categories = []
      this.frequencySeries = []
      this.frequencyOptions.xaxis.categories = []
      this.clientSeries = []
      this.clientOptions.xaxis.categories = []
      this.genderSeries = []
      this.genderChartOptions.xaxis.categories = []
      this.vipSeries = []
      this.vipChartOptions.xaxis.categories = []

      this.iconIndex = 0
      this.frequencyIconIndex = 0
      this.vipIconIndex = 0
      this.clientIconIndex = 0
      this.genderIconIndex = 0

      this.ageName = ['购物中心']
      this.ageTableList = []
      this.frequencyName = ['购物中心']
      this.frequencyTableList = []
      this.clientName = ['购物中心']
      this.clientTableList = []
      this.genderName = ['购物中心']
      this.genderTableList = []
      this.vipName = ['购物中心']
      this.vipTableList = []
    },
    downloadData (val1, val2) {
      let arr = []
      let columns = [{ title: val1[0], key: 'name' }, { title: val2[0].name, key: 'city1' }, { title: val2[1].name, key: 'city2' }]
      let data = val1.map((m, index) => {
        let indexs = index
        let obj = {}
        obj.name = val1[++indexs]
        obj.city1 = val2[0].percentList[index]
        obj.city2 = val2[1].percentList[index]
        return obj
      })
      data.pop()
      arr.push(columns)
      arr.push(data)
      return arr
    },
    downloadAgeData () {
      this.ageTabList = this.downloadData(this.ageName, this.ageTableList)
      this.downloadName = '年龄分布客流数据'
      this.dowloadList(this.ageTabList)
      try {
        window.TDAPP.onEvent('集团页面', '年龄分布下载', { })
      } catch (error) {
        console.log('集团页面-年龄分布下载-埋点error:' + error)
      }
    },
    downloadGenData () {
      this.genderTabList = this.downloadData(this.genderName, this.genderTableList)
      this.downloadName = '性别分布客流数据'
      this.dowloadList(this.genderTabList)
      try {
        window.TDAPP.onEvent('集团页面', '性别分布下载', { })
      } catch (error) {
        console.log('集团页面-性别分布下载-埋点error:' + error)
      }
    },
    downloadCusData () {
      this.customTabList = this.downloadData(this.clientName, this.clientTableList)
      this.downloadName = '新老顾客占比数据'
      this.dowloadList(this.customTabList)
      try {
        window.TDAPP.onEvent('集团页面', '新老顾客占比下载', { })
      } catch (error) {
        console.log('集团页面-新老顾客占比下载-埋点error:' + error)
      }
    },
    downloadNumData () {
      this.numTabList = this.downloadData(this.frequencyName, this.frequencyTableList)
      this.downloadName = '顾客到店次数占比数据'
      this.dowloadList(this.numTabList)
      try {
        window.TDAPP.onEvent('集团页面', '到店次数下载', { })
      } catch (error) {
        console.log('集团页面-到店次数下载-埋点error:' + error)
      }
    },
    downloadVipData () {},
    // 下载表格
    dowloadList (value) {
      exportEx(value).then(res => {
        let date = new Date()
        const blob = new Blob([res.data])
        let name = this.downloadName
        let fileName = name + moment(date).format('YYYYMMDDHHmmss') + '.xls'
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)// 释放URL 对象
        document.body.removeChild(elink)
      })
    }
  },
  deactivated () { } // 离开页面使用时调用
}
</script>
