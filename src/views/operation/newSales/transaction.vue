<template>
    <div class="box-card bg-white transaction"  v-if="isHtml">
        <p>异动分析</p>
        <div class="transaction-left" >
            <header>{{topTen.title}}</header>
            <ul v-if="!topTable">
                <li>
                    <p :key="index" v-for="(name,index) in topTen.name">{{name}}</p>
                </li>
            </ul>
            <div class="transaction-list" style=" height: 345px;" v-if="!topTable">
                <p :key="index" v-for="(state,index) in topTen.state" :style='{height:topHeight}'>
                    <span>{{state.number}}</span>
                    <span v-if="state.float===1"><icons style="color:#E75759 !important" type="31xiajiang"/></span>
                    <span v-if="state.float===2"><icons type="shangsheng"/></span>
                    <span v-if="state.float===0">--</span>
                </p>
            </div>
            <div class="transaction-data" v-if="isTopChart" v-bind:class="{ topDataAction: topTable }">
                <chart-tabs
                  :xAxis="topTen.xAxis"
                  :series="topTen.series"
                  :extraOptions="options"
                  class=" brand-chart"
                  title=""
                  :type='brandType'
                  tableTitle=''
                  @tableSwitchover=topTableSwitchover
                  @getShopTableCoumn='topTableTitles'
                  @getShopTableData='topTableDatas'
                  :tooltipUnit="tooltipUnit"
                >
                     <template>
                        <div class="flex justify-between items-center mr-10">
                          <span class="whitespace-no-wrap mx-4 text-sm">
                            <vs-radio style="margin-right:10px;" v-model="topTen.topRadio" vs-value="topFloor">楼层</vs-radio>
                            <vs-radio v-model="topTen.topRadio" vs-value="topBusiness">业态</vs-radio>
                          </span>
                          <vs-select autocomplete
                                    v-model="topTen.selectAction"
                                    style="width:120px"
                                    @change="topSelectChange"
                                    >
                            <vs-select-item v-for="(se,index) in topTen.selectList "
                                            :text="se.name"
                                            :key="index"
                                            :value="se.value" />
                          </vs-select>
                        </div>
                      </template>
                    <export-menu  slot="export" @onchange="ExportBiztop('top')"></export-menu>
                </chart-tabs>
            </div>
        </div>
        <div class="transaction-left">
            <header>{{afterTen.title}}</header>
            <ul v-if="!afterTable">
                <li>
                    <p :key="index" v-for="(name,index) in afterTen.name">{{name}}</p>
                </li>
            </ul>
            <div class="transaction-list" style=" height: 345px;" v-if="!afterTable">
                <p :key="index" v-for="(state,index) in afterTen.state" :style='{height:afterHeight}'>
                    <span>{{state.number}}</span>
                    <span v-if="state.float===1"><icons style="color:#E75759 !important" type="31xiajiang"/></span>
                    <span v-if="state.float===2"><icons type="shangsheng"/></span>
                    <span v-if="state.float===0">--</span>
                </p>
            </div>
            <div class="transaction-data" v-if="isAfterChart" v-bind:class="{ afterDataAction: afterTable }">
                <chart-tabs
                  :xAxis="afterTen.xAxis"
                  :series="afterTen.series"
                  :extraOptions="options2"
                  :type='brandType'
                  class=" brand-chart"
                  title=""
                  tableTitle=''
                  @tableSwitchover=AfterTableSwitchover
                  @getShopTableCoumn='afterTableTitles'
                  @getShopTableData='afterTableDatas'
                  :tooltipUnit="tooltipUnit"
                >
                  <template>
                    <div class="flex justify-between items-center mr-10">
                      <span class="whitespace-no-wrap mx-4 text-sm">
                        <vs-radio style="margin-right:10px;" v-model="afterTen.AfterRadio" vs-value="AfterFloor">楼层</vs-radio>
                        <vs-radio v-model="afterTen.AfterRadio" vs-value="AfterBusiness">业态</vs-radio>
                      </span>
                      <vs-select autocomplete
                                v-model="afterTen.selectAction"
                                style="width:120px"
                                @change="afterSelectChange"
                                >
                        <vs-select-item v-for="(se,index) in afterTen.selectList "
                                        :text="se.name"
                                        :key="index"
                                        :value="se.value" />
                      </vs-select>
                    </div>
                  </template>
                  <export-menu  slot="export" @onchange="ExportBiztop('after')"></export-menu>
                </chart-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import chartTabs from '_c/common/CopyChartsTabs.vue'
import exportMenu from '@/views/operation/components/ExportMenu.vue'
import { getchange } from '@/api/newSales.js'
import { exportEx } from '@/api/home.js'
import {downloadEx} from '@/libs/util.js'
import moment from 'moment'
export default {
  name: 'salse',
  components: {
    chartTabs,
    exportMenu
  },
  props: {
    afterParameter: {
      type: Object,
      default: {}
    },
    topParameter: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      isHtml: true,
      isTopChart: false,
      isAfterChart: false,
      topTable: false,
      afterTable: false,
      afterTableTitle: [],
      afterTableData: [],
      topTableTitle: [],
      topTableData: [],
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
          },
          'tickAmount': 2
        }
      },
      options2: {
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
          },
          'tickAmount': 2
        }
      },
      brandType: ['bar'],
      topHeight: '20%',
      topTen: {
        title: '前10名排行',
        name: ['上期排名', '异动', '店铺名称'],
        topRadio: 'topFloor',
        selectAction: 'all',
        selectList: [],
        state: [],
        xAxis: {
          'name': '名称',
          'key': this.topParameter.type ? this.topParameter.type : 'name',
          'data': [

          ]
        },
        series: [
          {
            'name': '销售额',
            'key': 'SaleAmount',
            'data': []
          }
        ]
      },
      afterHeight: '20%',
      afterTen: {
        title: '后10名排行',
        name: ['上期排名', '异动', '店铺名称'],
        AfterRadio: 'AfterFloor',
        selectAction: 'all',
        selectList: [],
        state: [],
        xAxis: {
          'name': '名称',
          'key': this.afterParameter.type,
          'data': []
        },
        series: [
          {
            'name': '销售额',
            'key': 'SaleAmount',
            'data': []
          }
        ]
      }
    }
  },
  watch: {
    'afterTen.AfterRadio' (val) {
      if (val === 'AfterFloor') {
        this.afterTen.selectList = this.floorData
        this.afterTen.selectAction = this.afterTen.selectList[0].value
      } else {
        this.afterTen.selectList = this.businessData
        this.afterTen.selectAction = this.afterTen.selectList[0].value
      }
      this.afterParameter.floor_id = ''
      this.afterParameter.industry_id = ''
      getchange(this.afterParameter).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.last_10.length > 0) this.afterData(res.data.data.last_10)
        }
      })
    },
    'topTen.topRadio' (val) {
      if (val === 'topFloor') {
        this.topTen.selectList = this.floorData
        this.topTen.selectAction = this.topTen.selectList[0].value
      } else {
        this.topTen.selectList = this.businessData
        this.topTen.selectAction = this.topTen.selectList[0].value
      }
      this.topParameter.floor_id = ''
      this.topParameter.industry_id = ''
      getchange(this.topParameter).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.top_10.length > 0) this.topData(res.data.data.top_10)
        }
      })
    }
  },
  computed: {
    propertyId () {
      return this.$store.state.home.headerAction
    },
    tooltipUnit () {
      switch (this.afterParameter.type) {
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
    floorData () {
      let newData = [{
        name: '全部楼层',
        value: 'all'
      }]
      let floorData = this.$store.state.home.bussinessTree
      floorData.map(val => {
        if (val.property_id === this.propertyId) {
          val.children.map(floor => {
            newData.push({
              name: floor.name,
              value: floor.id
            })
          })
        }
      })
      return newData
    },
    businessData () {
      let newData = [
        {
          name: '全部业态',
          value: 'all'
        }
      ]
      let dict = this.$store.state.home.bussinessDict
      Object.keys(dict).map(val => {
        newData.push({
          value: val,
          name: dict[val]
        })
      })
      return newData
    }
  },
  activated () {
    this.isHtml = false
    setTimeout(() => {
      this.isHtml = true
    })
  },
  mounted () {
    this.topTen.selectList = this.floorData
    this.topTen.selectAction = this.topTen.selectList[0].value
    this.afterTen.selectList = this.floorData
    this.afterTen.selectAction = this.afterTen.selectList[0].value
  },
  methods: {
    topTableSwitchover (val) {
      if (val === 0) {
        this.topTable = false
      } else {
        this.topTable = true
      }
    },
    AfterTableSwitchover (val) {
      if (val === 0) {
        this.afterTable = false
      } else {
        this.afterTable = true
      }
    },
    topData (data) {
      this.isTopChart = false
      this.topTen.state = []
      this.topTen.xAxis = {
        name: '名称',
        key: this.topParameter.type + '_' + this.topParameter.time,
        data: []
      }
      this.topTen.series = []
      let seriesObj = {
        name: '',
        key: this.topParameter.type,
        data: []
      }
      switch (this.topParameter.type) {
        case 'SaleAmount':
          seriesObj.name = '销售额'
          break;
        case 'SquaerMetre':
           seriesObj.name = '坪效'
          break;
          case 'CloseRate':
          seriesObj.name = '成交率'
          break;
          case 'UnitPrice':
           seriesObj.name = '客单价'
          break;
      }
      data.forEach(list => {
        let stateObj = {
          number: list.last_rank,
          float: list.change
        }
        this.topTen.xAxis.data.push(list.name)
        this.topTen.state.push(stateObj)
        seriesObj.data.push(list.idata)
      })
      this.topHeight = 100 / this.topTen.state.length + '%'
      this.topTen.series.push(seriesObj)
      this.isTopChart = true
    },
    afterData (data) {
      this.isAfterChart = false
      this.afterTen.state = []
      this.afterTen.xAxis = {
        name: '名称',
        key: this.afterParameter.type + '_' + this.afterParameter.time,
        data: []
      }
      this.afterTen.series = []
      let seriesObj = {
        name: '',
        key: this.topParameter.type,
        data: []
      }
      if (this.topParameter.type === 'SaleAmount') {
        seriesObj.name = '销售额'
      } else if (this.topParameter.type === 'SquaerMetre') {
        seriesObj.name = '坪效'
      } else if (this.topParameter.type === 'CloseRate') {
        seriesObj.name = '成交率'
      } else if (this.topParameter.type === 'UnitPrice') {
        seriesObj.name = '客单价'
      }
      data.forEach(list => {
        this.afterTen.state.push({
          number: list.last_rank,
          float: list.change
        })
        this.afterTen.xAxis.data.push(list.name)
        seriesObj.data.push(list.idata)
      })
      this.afterHeight = 100 / this.afterTen.xAxis.data.length + '%'
      this.afterTen.series.push(seriesObj)
      this.isAfterChart = true
    },
    topSelectChange () {
      this.topParameter.floor_id = ''
      this.topParameter.industry_id = ''
      if (this.topTen.topRadio === 'topFloor') {
        this.topParameter.floor_id = this.topTen.selectAction === 'all' ? '' : this.topTen.selectAction
      } else {
        this.topParameter.industry_id = this.topTen.selectAction === 'all' ? '' : this.topTen.selectAction
      }
      getchange(this.topParameter).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.top_10.length > 0) this.topData(res.data.data.top_10)
        }
      })
    },
    afterSelectChange () {
      this.afterParameter.floor_id = ''
      this.afterParameter.industry_id = ''
      if (this.afterTen.AfterRadio === 'AfterFloor') {
        this.afterParameter.floor_id = this.afterTen.selectAction === 'all' ? '' : this.afterTen.selectAction
      } else {
        this.afterParameter.industry_id = this.afterTen.selectAction === 'all' ? '' : this.afterTen.selectAction
      }
      getchange(this.afterParameter).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.last_10.length > 0) this.afterData(res.data.data.last_10)
        }
      })
    },

    ExportBiztop (type) {
      let time = this.afterParameter.time.split(',')
      let newAll
      let name
      if (type === 'after') {
        newAll = [this.afterTableTitle, this.afterTableData]
        let typeName = this.afterTen.AfterRadio=== 'AfterFloor'?'楼层':'业态'
        name = '销售分析_异动分析后10排行_'+typeName
      } else {
        newAll = [this.topTableTitle, this.topTableData]
        let typeName = this.topTen.topRadio=== 'topFloor'?'楼层':'业态'
        name = '销售分析_异动分析前10排行_'+typeName
      }
      let newTableData = _.cloneDeep(newAll)
      if (time[0] == time[1]) {
        newTableData[1].map(list => {
          list.time = time[0] + '  ' + list.time
        })
      }
      downloadEx(exportEx,name,newTableData)
    },
    afterTableTitles (val) {
      this.afterTableTitle = val
    },
    afterTableDatas (val) {
      this.afterTableData = val
    },
    topTableTitles (val) {
      this.topTableTitle = val
    },
    topTableDatas (val) {
      this.topTableData = val
    }
  }
}
</script>
<style lang="less" scoped>
.transaction{
  overflow: hidden;
  margin-top: 20px;
  padding: 35px;
  
  p{
    font-size:18px;
    font-weight:400;
    color:rgba(50,49,49,1);
    margin-bottom: 23px;
  }
  .transaction-left{
    width: 49%;
    float: left;
    border-radius: 10px;
    position: relative;
    &:nth-child(3){
      width: 49%;
      float: right;
    }
    ul{
      position: absolute;
      left: 10px;
      top: 80px;
      li{
        p{
          display: inline-block;
          font-size:10px;
          font-weight:bold;
          color:rgba(61,59,59,1);
          margin: 0 5px;
        }
      }
    }
    header{
      margin-top: 24px;
      margin-left: 15px;
      font-size:18px;
      font-weight:normal;
      color:rgba(61,59,59,1)
    }
    .transaction-list{
      position: absolute;
      left: 10px;
      top:119px;
      width: 90px;
     
      p{
        width: 100%;
        padding-left: 15px;
        margin-bottom: 0;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        span{
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          line-height: 100%;
          &:nth-child(1){
          float: left;
          width: 20px;
          margin-right: 30%;
          }
          &:nth-child(2){
            width: 16px;
            float: right;
            margin-left: 20%;
          }
          i{
            color: #2BD9CF!important;
          }
        }
      }
    }
    .topDataAction,.afterDataAction{
       padding-left: 0 !important;
    }
    .transaction-data{
      width: 100%;
      padding-left: 90px;
      margin-top: -40px;
    }
  }
}
@media screen and (max-width: 1700px) {
  .transaction .transaction-left .transaction-list{
    top:129px;
  }
}
@media screen and (max-width: 1400px) {
  .transaction .transaction-left .transaction-list{
    top:139px;
  }
}
@media screen and (max-width: 1250px) {
  .transaction .transaction-left .transaction-list{
    top:145px;
  }
}
</style>
