<template>
    <div class="sales-new-center" >
        <div class="chart-list" style=" height: 509px;">
            <chart-tabs  v-if="isFloorChart" class="bg-white box-card floor-chart" style=" height: 509px;"
              :labels="floorOption.labels"
              :series="floorOption.series"
              :extraOptions="floorOption"
              title="楼层分析"
              :type='floorOption.type'
              :unit='tooltipUnit'
              :typeParameter='floorParameter.type'
              :tooltipUnit="tooltipUnit"
               @tableChage='floorTableChage'
            >
             <template>
              <div class="flex justify-between items-center mr-10">
                <span class="whitespace-no-wrap mx-4 text-sm">{{this.$t(floorOption.select)}}:</span>
                <vs-select autocomplete
                           v-model="floorOption.selectAction"
                           style="width:150px"
                           @change="selectType('floor')"
                           >
                  <vs-select-item v-for="(se,index) in floorOption.selectList "
                                  :text="$t(se.name)"
                                  :key="index"
                                  :value="se.value" />
                </vs-select>
              </div>
            </template>
              <export-menu  slot="export" @onchange="ExportBiztop('floor')"></export-menu>
            </chart-tabs>
            <chart-tabs  v-if="isFloorChart"  class="bg-white box-card floor-chart" style=" height: 509px;"
              :xAxis="brandOption.xAxis"
              :series="brandOption.series"
              :extraOptions="brandOption.options"
              title="品牌分析"
              :type='brandOption.type'
              :unit='tooltipUnit'
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
                                  :text="$t(se.name)"
                                  :key="index"
                                  :value="se.value" />
                </vs-select>
              </div>
            </template>
              <export-menu  slot="export" @onchange="ExportBiztop('brand')"></export-menu>
            </chart-tabs>
        </div>
    </div>
</template>

<script>
import chartTabs from '_c/common/CopyChartsTabs.vue'
import exportMenu from '@/views/operation/components/ExportMenu.vue'
import { getNewfloor, getNewbrand } from '@/api/newSales.js'
import { exportEx } from '@/api/home.js'
import {downloadEx} from '@/libs/util.js'
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
      isFloorChart: false,
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
          'data': [],
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
            labels: {
              offsetY: 0,
            }
          },
          xaxis:{
            labels: {
              trim:false,
              formatter: (value) => {
                return value.toLocaleString()
              }
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
          return this.$t('人次')
        case 'SquaerMetre':
          return this.$t('元/m²')
        case 'UnitPrice':
        case 'SaleAmount':
          return this.$t('元')
        case 'CloseRate':
          return '%'
      }
    },
    propertyId () {
      return this.$store.state.home.headerAction
    },
  },
  watch: {
    '$store.state.home.bussinessDict' () {
      this.floorBrandData()
    }
  },
  activated () {
    this.isFloorChart = false
    setTimeout(() => {
      this.isFloorChart = true
    },200)
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
      this.brandOption.selectList = []
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
      this.isFloorChart = false
      setTimeout(() => {
        this.isFloorChart = true
      })
    },
    floorTableChage (val) {
      this.floorTableListData = val.data
    },
    brabdTableChage (val) {
      this.brandTableListData = val.data
    },
    floorData (data) {
      let floor = this.floorOption
      this.isFloorChart = true
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
          dataObj.name = this.$t('销售额')
          break
        case 'SquaerMetre':
          dataObj.name = this.$t('坪效')
          break
        case 'CloseRate':
          dataObj.name = this.$t('成交率')
          break
        case 'UnitPrice':
          dataObj.name = this.$t('客单价')
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
      let time = this.floorParameter.time.split(',')
      let newTableData
      let name
      if (type === 'floor') {
        newTableData = _.cloneDeep(this.floorTableListData)
        let type
        this.floorOption.selectList.forEach(val=>{
          if(val.value===this.floorOption.selectAction) type = val.name
        })
        name = '销售分析_'+type
      } else {
        newTableData = _.cloneDeep(this.brandTableListData)
        let floor
        this.brandOption.selectList.forEach(val=>{
          if(val.value===this.brandOption.selectAction) floor = val.name
        })
         name = '销售分析_品牌分析_'+floor
      }
      if (time[0] == time[1]) {
        newTableData[1].map(list => {
          list.time = time[0] + '  ' + list.time
        })
      }
      downloadEx(exportEx,name,newTableData)
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
   
    margin-top: 20px;
    .floor-chart{
        width: 40%;
        float: left;
      &:nth-child(2){
        width: 59%;
        float:right;
      }
    }
}
</style>
