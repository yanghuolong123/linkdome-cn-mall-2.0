<template>
    <div class="sales-new-center" style="min-height:500px" >
        <chart-tabs
            :xAxis="xAxisObj"
            :series="finnalSeries"
            :extraOptions="extraOptWithYaxis"
            @tableChage='TableChageList'
            class="bg-white box-card"
            :title="chartTitle"
            :type='typeList'
            id="marketChart"
            :tooltipUnit="tooltipUnit"
            v-if="isHtml"
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
import {downloadEx} from '@/libs/util.js'
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
    },
    chartTitle:{
      type:String,
      default: '111'
    }


  },
  data () {
    return {
      isHtml:true,
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
      let time = this.parameter.time.split(',')
      let newTableData = _.cloneDeep(this.tableListData)
      if (time[0] == time[1]) {
        newTableData[1].map(list => {
          list.time = time[0] + '  ' + list.time
        })
      }
      let name
      switch(this.parameter.type){
        case 'SaleAmount':
          name = '销售多维度_销售'
          break
        case 'SquaerMetre':
          name = '销售多维度_坪效'
          break
        case 'UnitPrice':
          name = '销售多维度_客单价'
          break
        case 'CloseRate':
          name = '销售多维度_成交率'
          break
      }
      downloadEx(exportEx,name,newTableData)
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
      switch(this.parameter.type){
        case 'SaleAmount':
          this.extraOptWithYaxis.yaxis.title.text = '销售额（元）'
          break
        case 'SquaerMetre':
          this.extraOptWithYaxis.yaxis.title.text = '坪效（元/m²）'
          break
        case 'UnitPrice':
          this.extraOptWithYaxis.yaxis.title.text = '客单价（元）'
          break
        case 'CloseRate':
          this.extraOptWithYaxis.yaxis.title.text = '成交率（%）'
          break
      }
      if (this.xAxisObj.data.length == 1) {
        this.extraOptWithYaxis.xaxis.labels.offsetX = (document.getElementById('marketChart').offsetWidth / 2) - 100
      } else {
        this.extraOptWithYaxis.xaxis.labels.offsetX = 0
      }
      this.isHtml = false
      setTimeout(() => {
        this.isHtml = true
      })
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
