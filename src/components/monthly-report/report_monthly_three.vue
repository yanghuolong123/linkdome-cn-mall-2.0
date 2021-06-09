
<template>
    <div class="reportOneText">
        <report-list-header></report-list-header>
        <div class="one-occupancy-total">
            <page-title :companyName="companyName" :typeName="typeName"></page-title>
            <div class="cameraList">
              <img :src="floorImg" alt="">
              <div v-if="hasCover == 1" style="position:absolute;left:0;top:0;background:rgba(0, 0, 0, .3);z-index:999;width:100%;height:100%"></div>
              <div class="camera-place" :key="index"
                v-for="(item,index) in cameraList"
                :style="{
                  left:item.position.x*1350+'px',
                  top:item.position.y*708+'px',
                }"
              >
                <p>{{item.name}}</p>
                <p>客流: {{item.data}}人</p>
              </div>
            </div>
            <page-title  style="margin-top: 50px" :typeName="textType"></page-title>
            <report-table ref="report_table"></report-table>
        </div>
        <div class="page_number">第{{pageName}}页</div>
        <report-list-floor></report-list-floor>
    </div>
</template>
<script>
import reportListHeader from '@/components/report/report_day_list_header'
import reportListFloor from '@/components/report/report_day_list_floor'
import VueHighcharts from 'vue2-highcharts'
import pageTitle from '@/components/report/pageTitle'
import reportTable from '@/components/monthly-report/report_table'
import _ from 'lodash'
import moment from 'moment'
export default {
  name: 'report-monthly-three',
  components: {
    reportListHeader,
    reportListFloor,
    VueHighcharts,
    pageTitle,
    reportTable
  },
  props: {
    dataValue: {
      type: Object
    },
    pageNumber: {
      type: Number
    },
    floorNumber: {
      type: Number
    }
  },
  data () {
    return {
      floorImg: '',
      typeName: '出入口客流分析',
      textType: '出入口排行',
      cameraList: [
        {
          name: 'name1',
          position: {
            x: '0.42',
            y: '0.63'
          },
          data: '2,345'
        }
      ]
    }
  },
  computed: {
    companyName () {
      return this.$store.state.report.companyName
    },
    pageName () {
      return this.pageNumber + 3
    }
  },
  created () {},
  mounted () {
    this.dataList()
  },
  methods: {
    dataList () {
      var that = this
      that.cameraList = []
      var table = []
      if (this.dataValue) {
        let imgUrl = this.dataValue.report_map_url
        if (imgUrl) this.floorImg = imgUrl
        else this.floorImg = require('@/assets/images/user_data_img/pathMap0.webp')
        this.dataValue.gate.forEach((e) => {
        /* camera list */
          var obj = {}
          obj.name = e.name
          obj.position = e.position
          obj.data = e.enter.toLocaleString()
          this.cameraList.push(obj)
          /* table list */
          var tableObj = {}
          tableObj.name = e.name
          tableObj.enter = e.enter.toLocaleString()
          tableObj.peak = e.highest.number.toLocaleString()
          tableObj.time = moment(e.highest.begin).format('YYYY-MM-DD')
          tableObj.mean = e.avg.toLocaleString()
          if (table.length < 7) table.push(tableObj)
        })
        this.$refs.report_table.listData(table)
      }
    },
    // 图片路径转化为 base 64
    getBase64Image (img) {
      let canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      let context = canvas.getContext('2d')
      context.drawImage(img, 0, 0, img.width, img.height)
      let url = canvas.toDataURL('image/png')
      return url
    }
  }
}
</script>
<style scoped lang="less">
    .reportOneText {
        display: inline-block;
        width: 1200px;
        height: 1682px;
        overflow: hidden;
        padding: 100px 50px;
        background-color: #fff;
        position: relative;
        .cameraList{
            width: 100%;
            height: auto;
            margin-top: 50px;
            position: relative;
            img{
                display: block;
                width: 100%;
                height: 577px;
            }
            .camera-place{
                position: absolute;
                width: auto;
                height: auto;
                color: #fff;
                //  background-color: #4472c4;
                padding: 10px;
                font-size: 16px;
                border-radius: 8px;
                -moz-border-radius: 8px;
                -webkit-border-radius: 8px;
                font-weight: bold;
            }
        }
    }

    .page_number{
        font-size: 20px;
        color: #a0a7ad;
        position: absolute;
        right: 50px;
        bottom: 100px;
    }
</style>
