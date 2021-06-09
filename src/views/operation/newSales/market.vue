<template>
    <div class="sales-new-center" v-if="isHtml">
        <chart-tabs
            :xAxis="xAxisObj"
            :series="finnalSeries"
            :extraOptions="extraOptWithYaxis"
            @tableChage='TableChageList'
            class="bg-white box-card"
            title="销售分析"
            :type='typeList'
            id="marketChart"
            :tooltipUnit="tooltipUnit"
            >
             <template>
              <div class="flex justify-between items-center mr-10">
                <span class="whitespace-no-wrap mx-4 text-sm">楼层:</span>
                <vs-select autocomplete
                           v-model="floorAction"
                            style="width:150px"
                            @change="selectFloor"
                           >
                  <vs-select-item v-for="(item,index) in selectList "
                                  :text="item.name"
                                  :key="index"
                                  :value="item.value" />
                </vs-select>
              </div>
            </template>
            <export-menu  slot="export" @onchange="enterExportBiztop"></export-menu>
        </chart-tabs>
    </div>
</template>

<script>
import chartTabs from '_c/common/CopyChartsTabs.vue'
import exportMenu from '@/views/operation/components/ExportMenu.vue'
import { getNewbusiness } from '@/api/newSales.js'
import { exportEx } from '@/api/home.js'
import moment from 'moment'
export default {
  name: 'market',
  components: {
    chartTabs,
    exportMenu
  },
  props: {
    parameter: {
      type: Object,
      default: {}
    }

  },
  data () {
    return {
      isHtml: true,
      selectList: [],
      floorAction: '',
      xAxisObj: {
        'name': '时间',
        'data': [],
        'key': 'time'
      },
      finnalSeries: [
        {
          'name': '销售额',
          'key': this.parameter.type,
          'data': []
        }
      ],
      extraOptWithYaxis: {
        'yaxis': {
          'title': {
            'text': '销售额（元）',
            'style': {
              'fontSize': '13px'
            }
          },
          'labels': {
            'offsetY': 0
          },
          'seriesName': 'enter',
          'min': 0
        },
        xaxis: {
          'labels': {
            'offsetX': 300
          }
        }
      },
      typeList: ['line'],
      tableListData: []
    }
  },
  computed: {
    propertyId () {
      return this.$store.state.home.headerAction
    },
    tooltipUnit () {
      switch (this.parameter.type) {
        case 'enter':
        case 'occupancy':
          return '人次'
        case 'SquaerMetre':
          return '元/m²'
        case 'UnitPrice':
        case 'SaleAmount':
          return '元'
        case 'CloseRate':
          return '%'
      }
    }
  },
  activated () {
    this.isHtml = false
    setTimeout(() => {
      this.isHtml = true
    })
  },
  mounted () {
    let data = this.$store.state.home.bussinessTree
    this.selectList = []
    data.map(val => {
      if (val.property_id === this.propertyId) {
        val.children.map(floor => {
          this.selectList.push({
            name: floor.name,
            value: floor.id
          })
        })
      }
    })
    this.floorAction = this.selectList[0].value
  },
  methods: {
    enterExportBiztop () {
      try {
        window.TDAPP.onEvent('销售分析', '销售分析下载', { })
      } catch (error) {
        console.log('销售分析-销售分析下载-埋点error:' + error)
      }
      let time = this.parameter.time.split(',')
      let newTableData = _.cloneDeep(this.tableListData)
      if (time[0] == time[1]) {
        newTableData[1].map(list => {
          list.time = time[0] + '  ' + list.time
        })
      }
      exportEx(newTableData).then(res => {
        let date = new Date()
        const blob = new Blob([res.data])
        let name = '销售分析'
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
    },
    TableChageList (val) {
      this.tableListData = val.data
    },
    dataList (data) {
      this.finnalSeries = []
      data.forEach(list => {
        this.finnalSeries.push({
          name: list.industry_name,
          key: list.industry_id,
          data: Object.values(list.list)
        })
      })
      this.xAxisObj.data = []
      this.xAxisObj.data = Object.keys(data[0].list)
      if (this.xAxisObj.data.length == 1) {
        this.extraOptWithYaxis.xaxis.labels.offsetX = (document.getElementById('marketChart').offsetWidth / 2) - 100
      } else {
        this.extraOptWithYaxis.xaxis.labels.offsetX = 0
      }
    },
    selectFloor () {
      this.parameter.floor_id = this.floorAction
      getNewbusiness(this.parameter).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.length > 0) this.dataList(res.data.data)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.sales-new-center{
    margin-top: 20px;
}
</style>
