import { config } from '@/config/echarts-config/line-chart'
import { BasicData } from '@/libs/echart-constructor/basicData.class.js'

export class LineChartConstructor extends BasicData {
  constructor (responseData = [], Params, quta = []) {
    super(responseData, Params, quta)
    this.config = _.cloneDeep(config)
    this.config.tooltip.formatter = (params) => {
      const title = params[0].axisValueLabel + '<br>'
      let result = ''
      params.forEach(o => {
        result += o.marker + o.seriesName + '：' + o.value.toLocaleString() + '人次<br>'
      })
      return title + result
    }
    this.seriesConfig = {
      type: 'line',
      symbol: 'circle',
      symbolSize: 8,
    }
  }

  getDateCompare () {
    this.dateCompare()
    return this.getConfig()
  }

  getPostEntitysCompare () {
    this.postEntitysCompare()
    return this.getConfig()
  }

  getConfig () {
    this.series.forEach(o => {
      Object.assign(o, this.seriesConfig)
    })
    this.config.legend.data = this.legend
    this.config.series = this.series
    this.config.xAxis.data = this.category
    const length = this.category.length
    if (length > 20) {
      this.config.dataZoom = [{
        type: 'slider',
        showDetail:false,//滚动条两边的字
        zoomLock: false,
        show: true, //flase直接隐藏图形
        xAxisIndex: [0],
        left: '4%', //滚动条靠左侧的百分比
        bottom: 30,
        start: 0,//滚动条的起始位置
        end:100
        // end: parseInt((20 / length) * 100)//滚动条的截止位置（按比例分割你的柱状图x轴长度）
      }]
    } else {
      delete this.config.dataZoom
    }
    return this.config
  }
}
