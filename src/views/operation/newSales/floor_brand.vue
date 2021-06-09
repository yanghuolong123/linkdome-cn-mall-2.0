<template>
    <div class="sales-new-center" v-if="isHtml">
        <div class="chart-list">
            <chart-tabs  class="bg-white box-card floor-chart"
              :labels="floorOption.labels"
              :series="floorOption.series"
              :extraOptions="floorOption"
              title="楼层分析"
              :type='floorOption.type'
              :unit='floorUnit'
              :typeParameter='floorParameter.type'
              :tooltipUnit="tooltipUnit"
               @tableChage='floorTableChage'
            >
             <template>
              <div class="flex justify-between items-center mr-10">
                <span class="whitespace-no-wrap mx-4 text-sm">{{floorOption.select}}:</span>
                <vs-select autocomplete
                           v-model="floorOption.selectAction"
                           style="width:150px"
                           @change="selectType('floor')"
                           >
                  <vs-select-item v-for="(se,index) in floorOption.selectList "
                                  :text="se.name"
                                  :key="index"
                                  :value="se.value" />
                </vs-select>
              </div>
            </template>
              <export-menu  slot="export" @onchange="ExportBiztop('floor')"></export-menu>
            </chart-tabs>
            <chart-tabs  class="bg-white box-card floor-chart"
              :xAxis="brandOption.xAxis"
              :series="brandOption.series"
              :extraOptions="brandOption.options"
              title="品牌分析"
              :type='brandOption.type'
              :unit='floorUnit'
              :typeParameter='floorParameter.type'
              @tableChage='brabdTableChage'
              :tooltipUnit="tooltipUnit"
            >
             <template>
              <div class="flex justify-between items-center mr-10">
                <span class="whitespace-no-wrap mx-4 text-sm">{{brandOption.select}}:</span>
                <vs-select autocomplete
                           v-model="brandOption.selectAction"
                           style="width:150px"
                           @change="selectType('brand')"
                           >
                  <vs-select-item v-for="(se,index) in brandOption.selectList "
                                  :text="se.name"
                                  :key="index"
                                  :value="se.value" />
                </vs-select>
              </div>
            </template>
              <export-menu  slot="export" @onchange="ExportBiztop('brand')"></export-menu>
            </chart-tabs>

            <!-- <chart-tabs
                :xAxis="brandXAxis"
                :series="brandSeries"
                :extraOptions="brandOptions"
                class="bg-white box-card brand-chart"
                title="品牌分析"
                :type='brandType'
                >
                <export-menu  slot="export" @onchange="enterExportBiztop"></export-menu>
            </chart-tabs> -->
        </div>
    </div>
</template>

<script>
import chartTabs from '_c/common/CopyChartsTabs.vue'
import exportMenu from '@/views/operation/components/ExportMenu.vue'
import { getNewfloor, getNewbrand } from '@/api/newSales.js'
import { exportEx } from '@/api/home.js'
import moment from 'moment'
export default {
  name: 'floor_brand',
  components: {
    chartTabs,
    exportMenu
  },
  props: {
    floorParameter: {
      type: Object,
      default: {}
    },
    brandParameter: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      isHtml: true,
      floorOption: {
        type: ['salesPie'],
        labels: {
          name: '类型',
          key: this.floorParameter.type,
          data: [],
          icons: [ 'circle', 'circle', 'circle', 'circle', 'circle']
        },
        series: [],
        selectAction: '',
        selectList: [],
        select: '业态'
      },
      floorTableListData: [],
      brandOption: {
        type: ['bar'],
        xAxis: {
          'name': '名称',
          'key': this.brandParameter.type,
          'data': [ ]
        },
        series: [
          {
            'name': '',
            'key': this.brandParameter.type,
            'data': []
          }
        ],
        options: {
          'plotOptions': {
            'bar': {
              'horizontal': true,
              'columnWidth': '70%',
              'dataLabels': {
                'position': 'center',
                'maxItems': 100,
                'hideOverflowingLabels': true
              },
              'barHeight': '70%'
            }
          },
          'colors': [
            '#00a1ea',
            '#16dad2'
          ],
          'chart': {
            'events': {}
          },
          'yaxis': {
            'labels': {
              'offsetY': 0
            }
          }
        },
        selectAction: '',
        selectList: [],
        select: '楼层'
      },
      brandTableListData: [],
      dataList: []
    }
  },
  computed: {
    tooltipUnit () {
      switch (this.floorParameter.type) {
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
    },
    propertyId () {
      return this.$store.state.home.headerAction
    },
    floorUnit () {
      return this.floorParameter.type !== 'CloseRate' ? '元' : '%'
    }
  },
  watch: {
    '$store.state.home.bussinessDict' () {
      this.floorBrandData()
    }
  },
  activated () {
    this.isHtml = false
    setTimeout(() => {
      this.isHtml = true
    })
  },
  mounted () {
    this.floorBrandData()
  },
  methods: {
    floorBrandData () {
      // 楼层
      let businessData = Object.keys(this.$store.state.home.bussinessDict)
      let dict = this.$store.state.home.bussinessDict
      this.floorOption.selectList = []
      this.floorOption.selectAction = ''
      this.floorOption.selectList.push({
        name: '全部业态',
        value: 'all'
      })
      businessData.map(val => {
        this.floorOption.selectList.push({
          value: val,
          name: dict[val]
        })
      })
      this.floorOption.selectAction = this.floorOption.selectList[0].value
      // 品牌
      let floorData = this.$store.state.home.bussinessTree
      this.brandOption.selectList.push({
        name: '全部楼层',
        value: 'all'
      })
      floorData.map(val => {
        if (val.property_id === this.propertyId) {
          val.children.map(floor => {
            this.brandOption.selectList.push({
              name: floor.name,
              value: floor.id
            })
          })
        }
      })
      this.brandOption.selectAction = this.brandOption.selectList[0].value
    },
    floorTableChage (val) {
      this.floorTableListData = val.data
    },
    brabdTableChage (val) {
      this.brandTableListData = val.data
    },
    floorData (data) {
      let floor = this.floorOption
      floor.labels = {
        name: '类型',
        key: this.floorParameter.type + '_' + this.floorParameter.time,
        data: [],
        icons: [ 'circle', 'circle', 'circle', 'circle', 'circle']
      }
      floor.series = []
      data.forEach(list => {
        floor.series.push(list.idata)
        floor.labels.data.push(list.name)
      })
    },
    brandData (data) {
      let brand = this.brandOption
      brand.xAxis = {
        'name': '名称',
        'key': this.brandParameter.type,
        'data': [ ]
      }
      brand.series = []
      let dataObj = {
        name: '',
        key: 'data_' + this.brandParameter.time + '_' + this.brandParameter.type,
        data: []
      }
      switch (this.brandParameter.type) {
        case 'SaleAmount':
          dataObj.name = '销售额'
          break
        case 'SquaerMetre':
          dataObj.name = '坪效'
          break
        case 'CloseRate':
          dataObj.name = '成交率'
          break
        case 'UnitPrice':
          dataObj.name = '客单价'
          break
      }

      data.forEach((list, index) => {
        if (index < 20) {
          brand.xAxis.data.push(list.name)
          dataObj.data.push(list.idata)
        }
      })
      brand.series.push(dataObj)
    },
    selectType (type) {
      if (type === 'floor') {
        this.floorParameter.industry_id = this.floorOption.selectAction === 'all' ? '' : this.floorOption.selectAction
        getNewfloor(this.floorParameter).then(res => {
          if (res.data.code === 200) {
            this.floorData(res.data.data)
          }
        })
      } else {
        this.brandParameter.floor_id = this.brandOption.selectAction === 'all' ? '' : this.brandOption.selectAction
        getNewbrand(this.brandParameter).then(res => {
          if (res.data.code === 200) {
            this.brandData(res.data.data)
          }
        })
      }
    },
    ExportBiztop (type) {
      try {
        if (type === 'floor') {
          window.TDAPP.onEvent('销售分析', '楼层分析下载', { })
        } else {
          window.TDAPP.onEvent('销售分析', '品牌分析下载', { })
        }
      } catch (error) {
        if (type === 'floor') {
          console.log('销售分析-楼层分析下载-埋点error:' + error)
        } else {
          console.log('销售分析-品牌分析下载-埋点error:' + error)
        }
      }
      let time = this.floorParameter.time.split(',')
      let newTableData
      if (type === 'floor') {
        newTableData = _.cloneDeep(this.floorTableListData)
      } else {
        newTableData = _.cloneDeep(this.brandTableListData)
      }
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
    }
  }
}
</script>
<style lang="less" scoped>
.sales-new-center{
    margin-top: 20px;
}
.chart-list{
    width: 100%;
    height: 509px;
    margin-top: 20px;
    .floor-chart{
        width: 40%;
        float: left;
        height: 509px;
      &:nth-child(2){
        width: 59%;
        float:right;
      }
    }
}
</style>
