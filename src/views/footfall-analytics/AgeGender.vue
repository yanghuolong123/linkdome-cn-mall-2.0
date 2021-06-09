<template>
  <div>
    <div class="bg-white box-card pb-6 px-4">
      <flow-selector @on-change="paramsPrepare"
                     routName='ageGender'
                     :isFloor='true'
                     :isStore='true'
                     :isShop='false'
                     :isArea='true'
                     :isGate='true'
                     :isReset='true'
                     isAgeGender>
      </flow-selector>
    </div>
    <!-- enter -->
    <div class="mt-6 age-chart-box">
      <div class="bg-white box-card pb-6">
        <chart-tabs :xAxis="agechartData.xAxis"
                    :labels="agechartData.labels"
                    :series="agechartData.series"
                    :type="agechartData.type"
                    :chartWidth='ageChartWidth'
                    title="年龄分布"
                    tooltipUnit="人"
                    :extraOptions="agechartData.extraOptions"
                    @tableChage="ageTableChange">
          <export-menu slot="export"
                       @onchange="ageExportBiztop"></export-menu>
        </chart-tabs>
      </div>
      <div class="bg-white box-card pb-6">
        <chart-tabs :xAxis="genderChartData.xAxis"
                    :labels="genderChartData.labels"
                    :series="genderChartData.series"
                    :type="genderChartData.type"
                    :chartWidth='ageChartWidth'
                    title="性别分布"
                    tooltipUnit="人"
                    :extraOptions="genderChartData.extraOptions"
                    @tableChage="genderTableChange">
          <export-menu slot="export"
                       @onchange="genderExportBiztop"></export-menu>
        </chart-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { exportEx } from '@/api/home.js'
import flowSelector from '@/components/Passenger-analysis/flowSelector.vue'
import { getEntityFlowBatch } from '@/api/analysis'
import exportMenu from '@/views/operation/components/ExportMenu.vue'
import chartTabs from '@/components/common/CopyChartsTabs.vue'
import moment from 'moment'
export default {
  name: 'ageGender',
  components: {
    flowSelector,
    chartTabs,
    exportMenu
  },
  data () {
    return {
      typeOfCustom: '0',
      range: '',
      range2: '',
      canshow: false,
      genderName: {
        '0': {
          name: '女',
          icon: 'female'
        },
        '1': {
          name: '男',
          icon: 'male'
        }
      },
      genderDict: {
        male: '男性',
        female: '女性'
      },
      chartData: { age: {}, gender: {} },
      extraOptions: {
        tooltip: {
          y: {}
        },
        chart: {
          stacked: true
        },
        plotOptions: {
          bar: {
            endingShape: 'flat'
          }
        },
        legend: {
          show: true
        }
      },
      ageTableList: [],
      genderTableList: []
    }
  },
  computed: {
    agechartData () {
      return this.chartData.age
    },
    genderChartData () {
      return this.chartData.gender
    },
    ageChartWidth () {
      let width
      if (this.chartData.age.xAxis) {
        let xSize = this.chartData.age.xAxis.data.length
        xSize < 10 ? width = '100%' : width = xSize * 60
      } else width = '100%'
      return width
    }
  },
  methods: {
    async  paramsPrepare (pparams) {
      if (this.$store.state.home.headerAction && pparams.entitys.length == 0) {
        alert('请选择实体')
        return false
      }
      // if (this.$store.state.home.loadingState == false) this.$vs.loading()
      this.entitys = pparams.entitys
      this.bzids = this.entitys.map(i => i.id)
      this.range = pparams.date1Array.toString()
      let res
      if (['time', 'onYear', 'onMonth'].includes(pparams.compareType)) { // 时间对比
        this.range2 = pparams.date2Array.toString()
        res = await getEntityFlowBatch({ range1: this.range, range2: this.range2, bzid: this.bzids.toString() })
      } else {
        res = await getEntityFlowBatch({ range1: this.range, bzid: this.bzids.toString() })
      }
      this.chartData = this.handleTypeData(res)

      try {
        let type, date, value
        if (pparams.compareType === 'not') {
          type = '无对比'
          date = pparams.date1Array[0] + ',' + pparams.date1Array[1]
        } else if (pparams.compareType === 'entity') {
          type = '实体对比'
          pparams.entitys.forEach(item => {
            value = item.belongsType ? item.belongsType : ''
          })
        } else {
          type = '时间对比'
          date = [pparams.date1Array.join(','), pparams.date2Array.join(',')]
        }
        window.TDAPP.onEvent(this.$route.meta.pageTitle + '页面', '数据查询', { '对比方式': type, '时间段': date, '实体选择': value })
      } catch (error) {
        console.log(this.$route.meta.pageTitle + '页面-' + '数据查询' + '埋点error:' + error)
      }
    },
    handleTypeData (res) {
      const { data: { data } } = res
      let singleTime = Object.keys(data[0].stat).length === 1// 时间对比，选择相同的时间，后台返回一个
      let ageCollection = []
      let genderCollection = []
      let ageLabels
      let ageXaxis = []
      let ageSeries
      let genderChartData
      // this.$vs.loading.close()
      // this.$store.commit('loadingState', false)
      data.forEach(e => {
        Object.keys(e.stat).forEach(i => {
          let eleOfTimes = e.stat[i]
          ageCollection.push({
            id: e.bzid,
            time: i,
            name: 'age_distribution',
            data: eleOfTimes.age_distribution
          })
          genderCollection.push({
            id: e.bzid,
            time: i,
            name: 'gender_propotion',
            data: eleOfTimes.gender_propotion
          })
        })
      })
      ageLabels = {
        name: '年龄',
        key: 'age',
        data: Object.keys(ageCollection[0].data).map(e => { return e.replace('_', '-').replace('less-', '小于').replace(/more-/, '大于') })
      }
      if (singleTime) { // 多个实体单个时间，柱状图，xAxis,分类为实体
        const { labels, ...rest } = this.getGenderChartData(genderCollection, ['id'])
        genderChartData = {
          xAxis: {
            name: '实体',
            key: 'id',
            data: labels
          },
          ...rest
        }
        ageXaxis = {
          name: '实体',
          key: 'id',
          data: this.getAgeXaxis(ageCollection, ['id'])// `${this.entitys.find(o => Number(o.id) === Number(e.id)).label}`
        }
        ageSeries = this.getAgeSeries(ageCollection)
      } else { // 多个实体多个时间，柱状图，xAxis,分类为实体+时间
        const { labels, ...rest } = this.getGenderChartData(genderCollection, ['id', 'time'])
        genderChartData = {
          xAxis: {
            name: '名称',
            key: 'name',
            data: labels
          },
          ...rest
        }
        ageXaxis = {
          name: '类别',
          key: 'id_key',
          data: this.getAgeXaxis(ageCollection, ['id', 'time'])
        }
        ageSeries = this.getAgeSeries(ageCollection)
      }
      if (data.length === 1) {
        if (singleTime) { // 单个实体单个时间，饼图，labels,series,年龄为radiabar
          genderChartData = {
            labels: {
              name: '性别',
              key: 'gender',
              data: Object.keys(genderCollection[0].data).map(e => this.genderName[e].name),
              icons: Object.keys(genderCollection[0].data).map(e => this.genderName[e].icon)
            },
            series: Object.values(genderCollection[0].data),
            type: ['radialBar']
          }
          ageSeries = Object.keys(this.genderDict).map(g => ({ name: this.genderDict[g], key: g, data: Object.values(ageCollection[0].data).map(e => e[g]) }))
        } else { // 单个实体多个时间,柱状图，xAxis,series,横轴分类为时间
          const { labels, ...rest } = this.getGenderChartData(genderCollection, ['time'])
          genderChartData = {
            xAxis: {
              name: '时间',
              key: 'time',
              data: labels
            },
            ...rest
          }
          ageXaxis = {
            name: '时间',
            key: 'time',
            data: this.getAgeXaxis(ageCollection, ['time'])
          }
          ageSeries = this.getAgeSeries(ageCollection)
        }
      } else {
        if (singleTime) { // 多个实体单个时间，柱状图，xAxis,分类为实体
          const { labels, ...rest } = this.getGenderChartData(genderCollection, ['id'])
          genderChartData = {
            xAxis: {
              name: '实体',
              key: 'id',
              data: labels
            },
            ...rest
          }
          ageXaxis = {
            name: '实体',
            key: 'id',
            data: this.getAgeXaxis(ageCollection, ['id'])// `${this.entitys.find(o => Number(o.id) === Number(e.id)).label}`
          }
          ageSeries = this.getAgeSeries(ageCollection)
        } else { // 多个实体多个时间，柱状图，xAxis,分类为实体+时间
          const { labels, ...rest } = this.getGenderChartData(genderCollection, ['id', 'time'])
          genderChartData = {
            xAxis: {
              name: '名称',
              key: 'name',
              data: labels
            },
            ...rest
          }
          ageXaxis = {
            name: '类别',
            key: 'id_key',
            data: this.getAgeXaxis(ageCollection, ['id', 'time'])
          }
          ageSeries = this.getAgeSeries(ageCollection)
        }
      }
      if (data.length === 1 && singleTime) {
        return {
          age: {
            labels: ageLabels,
            series: ageSeries,
            type: ['bar']
          },
          gender: genderChartData
        }
      } else {
        return {
          age: {
            xAxis: ageXaxis,
            series: ageSeries,
            type: ['bar'],
            extraOptions: this.extraOptions
          },
          gender: genderChartData
        }
      }
    },

    getAgeXaxis (data, categoriesKeys) {
      let res = []
      data.forEach(e => {
        Object.keys(this.genderDict).forEach(k => {
          let names = []
          if (categoriesKeys) {
            categoriesKeys.forEach(cate => {
              if (cate === 'id') names.push(`${this.entitys.find(o => Number(o.id) === Number(e.id)).label}`)
              if (cate === 'time') names.push(e[cate].split(',').join(' - '))
            })
          }
          let name = names.length ? `${names.join(' ')} ${this.genderDict[k]}` : `${this.genderDict[k]}`
          res.push(name)
        })
      })
      return res
    },
    getAgeSeries (data) {
      let res = []
      Object.keys(data[0].data).forEach(e => {
        let tml = {}
        let eachSeriesData = []
        tml.name = e.replace('_', '-').replace('less-', '小于').replace(/more-/, '大于')
        tml.key = e
        data.forEach(c => {
          Object.keys(this.genderDict).forEach(gender => {
            eachSeriesData.push(c.data[e][gender])
          })
        })
        tml.data = eachSeriesData
        res.push(tml)
      })
      return res
    },
    getGenderChartData (data, keys) {
      let labels = []
      let series = []
      data.forEach(e => {
        let categories = []
        keys.forEach(k => {
          if (k === 'id') categories.push(`${this.entitys.find(o => Number(o.id) === Number(e.id)).label}`)
          if (k === 'time') categories.push(e[k].split(',').join(' - '))
        })
        labels.push(categories.join(' '))
      })
      series = Object.keys(data[0].data).map(e => {
        let tml = {
          name: this.genderName[e].name,
          key: e,
          data: labels.map((label, index) => { return data[index].data[e] })
        }
        return tml
      })
      let genderOpt = {
        chart: {
          stacked: keys.length !== 1
        },
        plotOptions: {
          bar: {
            endingShape: keys.length !== 1 ? 'flat' : 'rounded'
          }
        },
        legend: {
          show: true
        }
      }
      return { labels, series, type: ['bar'], extraOptions: genderOpt }
    },
    ageTableChange (value) {
      this.ageTableList = value.data
    },
    ageExportBiztop () {
      this.uploadList(this.ageTableList)
      try {
        window.TDAPP.onEvent(this.$route.meta.pageTitle + '页面', '年龄分布' + '下载', { })
      } catch (error) {
        console.log(this.$route.meta.pageTitle + '页面-' + '年龄分布' + '下载-埋点error:' + error)
      }
    },
    genderTableChange (value) {
      this.genderTableList = value.data
    },
    genderExportBiztop () {
      this.uploadList(this.genderTableList)
      try {
        window.TDAPP.onEvent(this.$route.meta.pageTitle + '页面', '性别分布' + '下载', { })
      } catch (error) {
        console.log(this.$route.meta.pageTitle + '页面-' + '性别分布' + '下载-埋点error:' + error)
      }
    },
    uploadList (value) {
      // if (this.$store.state.home.loadingState == false) {
      //   this.$store.commit('loadingState', true)
      //   this.$vs.loading()
      // }
      exportEx(value).then(res => {
        let date = new Date()
        const blob = new Blob([res.data])
        let name = '年龄性别客流数据'
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
    }
  }
}
</script>
<style lang="stylus">
.age-chart-box
  display grid
  grid-template-columns repeat(2, minmax(10px, 1fr))
  grid-template-areas 'age gender'
  @media (max-width: 768px)
    grid-template-columns minmax(10px, 1fr)
    grid-template-areas 'age' 'gender'
  grid-gap 20px
  >div
    &:nth-child(1)
      grid-area age
    &:nth-child(2) /deep/
      grid-area gender
      .custom-legend-box
        padding 0 4rem
</style>
