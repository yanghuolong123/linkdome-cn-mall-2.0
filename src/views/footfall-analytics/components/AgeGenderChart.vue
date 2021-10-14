<template>
  <div class="age-chart-box">
    <div class="bg-white box-card pb-6">
      <chart-tabs :labels="agechartData.labels"
                  :series="agechartData.series"
                  :type="agechartData.type"
                  title="年龄分布"
                  :tooltipUnit="$t('人')"
                  :extraOptions="agechartData.extraOptions"
                  @tableChage="ageTabChange">
        <export-menu slot="export"
                     @onchange="ageExportBiztop"></export-menu>
      </chart-tabs>
    </div>
    <div class="bg-white box-card pb-6">
      <chart-tabs :labels="genderChartData.labels"
                  :series="genderChartData.series"
                  :type="genderChartData.type"
                  title="性别分布"
                  :tooltipUnit="$t('人')"
                  :extraOptions="genderChartData.extraOptions"
                  @tableChage="genderTabChange">
        <export-menu slot="export"
                     @onchange="genderExportBiztop"></export-menu>
      </chart-tabs>
    </div>
  </div>
</template>

<script>
import exportMenu from '@/views/operation/components/ExportMenu.vue'
import { downloadEx } from '@/libs/util'
import { getEntityFlow, exportEx } from '@/api/home'
import chartTabs from '@/components/common/CopyChartsTabs.vue'
import moment from 'moment'
import eventBus from '@/libs/bus'
export default {
  name: 'ageGenderChart',
  components: {
    chartTabs,
    exportMenu
  },
  props: {
    time1: {
      type: String,
      default: ''
    },
    bzid: {
      type: Number,
      required: null
    }
  },
  data () {
    return {
      agechartData: {},
      genderChartData: {},
      canShow: false,
      extraOptions: {
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
      ageTabList: [],
      genderTabList: []
    }
  },
  watch: {
    // time1: {
    //   immediate: true,
    //   handler: function (val, oldVal) {
    //     if (val) this.getAgeGenderData()
    //   }
    // },
    // time2: {
    //   immediate: true,
    //   handler: function (val, oldVal) {
    //     if (val) this.getAgeGenderData()
    //   }
    // },
    // bzid: {
    //   immediate: true,
    //   handler: function (val, oldVal) {
    //     if (val.length) this.getAgeGenderData()
    //   }
    // }

  },
  mounted () {
    let that = this
    that.getAgeGenderData()
    eventBus.$on('drainageClick', data => {
      that.getAgeGenderData()
    })
  },
  methods: {
    ageTabChange (value) {
      this.ageTabList = value.data
    },
    genderTabChange (value) {
      this.genderTabList = value.data
    },
    ageExportBiztop () {
      this.uploadList(this.ageTabList)
    },
    genderExportBiztop () {
      this.uploadList(this.genderTabList)
    },
    uploadList (value) {
       downloadEx(exportEx,'实体引流客流详细数据',value)
    },
    async getAgeGenderData () {
      const { time1, bzid } = this
      let res = await getEntityFlow({ range: time1, bzid: bzid, type: 0 })
      const { data: { data: sourceData } } = res
      const { age_distribution: ageData, gender_propotion: genderData } = sourceData
      const genderName = {
        '0': {
          name:this.$t('女性'),
          icon: 'female'
        },
        '1': {
          name: this.$t('男性'),
          icon: 'male'
        }
      }
      const genderDict = {
        male: this.$t('男性'),
        female:this.$t('女性')
      }
      let ageChartData = null
      let genderChartData = null
      let ageLabels = {
        name: '年龄',
        key: 'age',
        data: Object.keys(ageData).map(e => { return e.replace('_', '-').replace('less-',  this.$t('小于')).replace(/more-/,  this.$t('大于')) })
      }
      let genderLabels = {
        name: '性别',
        key: 'gender',
        data: Object.keys(genderData).map(e => genderName[e].name),
        icons: Object.keys(genderData).map(e => genderName[e].icon)
      }
      ageChartData = {
        labels: ageLabels,
        series: Object.keys(genderDict).map(g => ({ name: genderDict[g], key: g, data: Object.values(ageData).map(e => e[g]) })),
        type: ['bar']
      }
      genderChartData = {
        labels: genderLabels,
        series: Object.values(genderData),
        type: ['radialBar']
      }
      // ageChartData.series[0].data = [0, 0, 0, 0, 0]
      // ageChartData.series[1].data = [0, 0, 0, 0, 0]
      // genderChartData.series = [0, 0]
      this.agechartData = ageChartData
      this.genderChartData = genderChartData
    }
  }
}
</script>

<style lang="stylus">
.age-chart-box
  display grid
  grid-template-columns repeat(2, minmax(10px, 1fr))
  grid-template-areas 'age gender'
  grid-gap 20px
  // @media (max-width: 768px)
  //   grid-template-columns minmax(10px, 1fr)
  //   grid-template-areas 'age' 'gender'
  // grid-gap 20px
  >div
    &:nth-child(1)
      grid-area age
    &:nth-child(2) /deep/
      grid-area gender
      .custom-legend-box
        padding 0 4rem
</style>
