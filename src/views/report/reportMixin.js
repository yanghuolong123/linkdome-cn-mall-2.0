import moment from 'moment'
import _ from 'lodash'
import { getToken } from '@/libs/util'
import axios from 'axios'
export default{
  data () {
    return {
      enterData: [],
      suggestText: '',
      option: {
        title: { text: ' ' },
        subtitle: { text: '' },
        credits: { enabled: false },
        yAxis: {
          title: { text: '' }
        },
        xAxis: {
          categories: ['name1', 'name2', 'name3', 'name4'],
          labels: {
            useHTML: true
          }
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
              formatter: function () {
                return this.y.toLocaleString()
              },
              allowOverlap: true,
              style: {
                color: '#000',
                padding: 0
              }
            },
            maxPointWidth: 20

          }
        },
        tooltip: {
          formatter () {
            return this.x + '<br>' + this.series.name + ': ' + this.y.toLocaleString() + '人次'
          }

        },
        series: [],
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      }
    }
  },
  computed: {
    userRole () {
      return this.$store.state.user.role_name
    },
    headerData () {
      return this.$store.state.report.reportHeader
    },

    propertyId () {
      return this.$store.state.home.headerAction
    },
    bzid () {
      let property = _.filter(this.$store.state.home.organizationData.property, o => { return o.property_id === this.propertyId })[0]
      return property.bzid
    }
  },
  methods: {
    reportOneData (data) {
      this.enterData = []
      let currentData = data.current[0]
      let contrastData = data.contrast[0]
      let cETime = currentData.enter.highest.timeRange
      let cOTime = currentData.occupancy.highest.timeRange
      // 当前时间
      let cEDate = cETime.split(' ')[0] + ' ' + cETime.split(' ')[2]
      let cOPDate = cOTime.split(' ')[0] + ' ' + cOTime.split(' ')[2]
      // 昨天时间
      let tETime = contrastData.enter.highest.timeRange
      let tOTime = contrastData.occupancy.highest.timeRange
      let tEDate = tETime.split(' ')[0] + ' ' + tETime.split(' ')[2]
      let tOPDate = tOTime.split(' ')[0] + ' ' + tOTime.split(' ')[2]

      let textList = Object.values(data.comment)
      let type = this.headerData.type === 'daily' ? '时' : '天'
      this.enterData = [
        { // 当前时间数据
          enter: currentData.enter.total.number.toLocaleString() + '人次',
          enterPeak: currentData.enter.highest.number.toLocaleString() + '人次',
          enterTime: this.timeTYpe(cEDate, cETime, '客流量'),
          occupancyPeak: currentData.occupancy.highest.number.toLocaleString() + '人次',
          occupancyTime: this.timeTYpe(cOPDate, cOTime, '集客量'),
          average: currentData.enter.avg.number.toLocaleString() + '人次/' + type
        },
        { // 昨天时间数据
          enter: contrastData.enter.total.number.toLocaleString() + '人次',
          enterPeak: contrastData.enter.highest.number.toLocaleString() + '人次',
          enterTime: this.timeTYpe(tEDate, tETime, '客流量'),
          occupancyPeak: contrastData.occupancy.highest.number.toLocaleString() + '人次',
          occupancyTime: this.timeTYpe(tOPDate, tOTime, '集客量'),
          average: contrastData.enter.avg.number.toLocaleString() + '人次/' + type
        },
        textList // 评论
      ]
    },
    timeTYpe (time1, time2, type) {
      if (type === '集客量') {
        return moment(time1).format('YYYY-MM-DD HH') + ':00-' + time2.split(' ')[2]
      } else if (this.headerData.type === 'daily') {
        return moment(time1).format('YYYY-MM-DD HH') + ':00-' + time2.split(' ')[2]
      } else {
        return moment(time1).format('YYYY-MM-DD ')
      }
    },
    suggestSubmit (text) {
      this.suggestText = text
    },
    point (type, type2) {
      let that = this
      try {
        window.TDAPP.onEvent(type, type2, {
          时间段: that.newDate
        })
      } catch (error) {
        console.log(type + '-' + type2 + '-埋点error:' + error)
      }
    },
    uploadReport (type, time) {
      if (time === '') { alert('请选择时间'); return false }
      let pdfUrl = window.location.href.split('/#/')[0]
      let token = getToken()
      let objName = (pdfUrl.split('://')[1]).split('.')[0]
      let ht = pdfUrl.split('://')[0]
      let download
      let name
      if (type === 'day') {
        download = 'downloadDayPdf'
        name = '日报'
      } if (type === 'week') {
        download = 'downloadWeekPdf'
        name = '周报'
      } else if (type === 'month') {
        download = 'downloadMonthPdf'
        name = '月报'
      }
      let url = pdfUrl + '/#/' + download + '?propertyId=' + this.propertyId + '&date=' + time + '&token=' + token
      this.$vs.loading()
      axios.post(ht + '://pdfcenter.linkdome.cn/pdf/execute', { filename: time, project: objName, url: url }, { responseType: 'blob' })
        .then((response) => {
          this.$vs.loading.close()
          var blob = new Blob([response.data])
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = time + name + '.pdf' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        })
        .catch(function (error) {
          console.log(error)
        })
      this.point(name + '分析页面', '下载')
    },
    // 计算同环比
    sequential (number1, number2) {
      let chain = number2 === 0 ? 0 : Math.round(((number1 - number2) / number2) * 10000) / 10000
      return Number((chain * 100).toFixed(2))
    },
    // 获取当时是星期几
    weekType (value) {
      let seWeek = moment(value).format('dddd')
      let week
      switch (seWeek) {
        case 'Monday':
          week = '星期一'
          break
        case 'Tuesday':
          week = '星期二'
          break
        case 'Wednesday':
          week = '星期三'
          break
        case 'Thursday':
          week = '星期四'
          break
        case 'Friday':
          week = '星期五'
          break
        case 'Saturday':
          week = '星期六'
          break
        case 'Sunday':
          week = '星期日'
          break
      }
      return week
    },
    dataEmpty (type) {
      this[type].seriesData[0].data = []
      if (this[type].seriesData[1]) this[type].seriesData[1].data = []
      if (this[type].seriesData[2]) this[type].seriesData[2].data = []
      this[type].xAxisData = []
    }
  }
}
