<template>
  <div>
    <div class="downloadList" v-on:click='changeExportData'>
      <icons
        type="daoru"
        size="20"
        title="下载"
        color="rgb(157, 157, 157)"
      >
      </icons>
    </div>
    <i-tabs class="chartsTable" v-model="current">
      <tab-item :icon="icon1" :titles="title1" style="position:relative;left: -9px;">
        <div :id='domId'>
          <vue-apex-charts :type="type" :height="height" :options="options" :series="series"> </vue-apex-charts>
        </div>
      </tab-item>
      <tab-item :icon="icon2" :titles="title2">
        <TableMultipleSelected style="height:474px; overflow: auto;" :tableName="columns" :tableList="tableList"></TableMultipleSelected>
      </tab-item>
    </i-tabs>
  </div>
</template>

<script>
import tabItem from '_c/I-Tabs/TabItem.vue'
import VueApexCharts from 'vue-apexcharts'
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import iTabs from '_c/I-Tabs/Itabs.vue'
import moment from 'moment'
import { changeExport, changeExportOne } from '@/api/operate.js'
import { exportEx } from '@/api/home.js'
import axios from 'axios'
export default {
  components: {
    VueApexCharts,
    tabItem,
    iTabs,
    TableMultipleSelected
  },
  props: {
    series: {
      type: Array,
      default: () => [
      ]
    },
    height: {
      type: String,
      default: '474px'
    },
    icon1: {
      type: String,
      default: '62'
    },
    icon2: {
      type: String,
      default: 'biaoge-copy'
    },
    title1: {
      type: String,
      default: '趋势分析'
    },
    title2: {
      type: String,
      default: '详细数据'
    },
    type: {
      type: String,
      default: 'line'
    },
    columns: {
      type: Array,
      default: () => []
    },
    dateTime: {
      type: Number
    },
    tableList: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => { }
    },
    domId: {
      type: String,
      default: ''
    },
    pdfName: {
      type: String,
      default: ''
    },
    selectHoliday: {
      type: String,
      default: ''
    },
    ExcelData: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      current: 0,
      reportName: ''
    }
  },
  mounted () {
  },
  methods: {
    changeExportData () {
      var data = []
      var columns
      if (this.ExcelData.type == 1) {
        let keys
        if (this.selectHoliday == '')keys = 'name'
        else keys = 'begin'
        columns = [{ title: this.columns[0], key: keys }, { title: this.columns[1], key: 'enter' }]
      } else {
        columns = [{ title: this.columns[0], key: 'name' }, { title: this.columns[1], key: 'begin' }, { title: this.columns[2], key: 'end' }]
      }
      data.push(columns)
      data.push(this.tableList)
      if (this.tableList.length == 0) {
        alert('暂无数据可下载')
        return false
      }

      exportEx(data).then(res => {
        let date = new Date()
        const blob = new Blob([res.data])
        let name = this.ExcelData.type == 1 ? '节假日活动趋势分析' : '节假日活动对比分析'
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

<style scope lang="scss">
.chartsTable {
  background-color: #fff;
  margin-top: 20px;
  border-radius: 6px;
  .tab-bar-right {
    margin-right: 35px;
  }
}
.downloadList {
  position: absolute;
  right: 20px;
  top: 34px;
  z-index: 1;
  cursor: pointer;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  font-size: 16px;
  line-height: 27px;
}
</style>
