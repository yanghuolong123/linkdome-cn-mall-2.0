
<template>
    <div class="reportOneText">
        <report-list-header :monthlyType="monthlyType" ></report-list-header>
        <page-title :companyName="companyName" :typeName="typeName"></page-title>
        <page-title  :typeName="comeName"></page-title>
        <report-table :firstName="tableName" ref="reporTable"></report-table>
        <div class="page_number">第3页</div>
        <report-list-floor></report-list-floor>
    </div>
</template>
<script>
import reportListHeader from '@/components/report/report_day_list_header'
import reportListFloor from '@/components/report/report_day_list_floor'
import VueHighcharts from 'vue2-highcharts'
import pageTitle from '@/components/report/pageTitle'
import moment from 'moment'
import _ from 'lodash'
import reportTable from './report_table'
export default {
  name: 'report-monthly-one',
  components: {
    reportListHeader,
    reportListFloor,
    VueHighcharts,
    pageTitle,
    reportTable

  },
  data () {
    return {
      tableName: '出入口名称',
      monthlyType: ' ',
      ifOneCharts: false,
      typeName: '出入口客流分析',
      comeName: '出入口TOP10数据',

      peakType: '客流趋势',
      detailsType: '详细客流数据',
      tableData: {
        time: [],
        enter: {
          total: '',
          list: []
        },
        peakData: {
          total: {
            time: '',
            data: ''
          },
          list: []
        }
      }
    }
  },
  methods: {

    dataList (data) {
      /**
                 * @description 为表格生成数据
                 */
      let resultData = []
      let dataList = Object.values(data)
      let tableList = []
      dataList.forEach(list => {
        if (list) {
          list.gate.forEach(value => {
            tableList.push(value)
          })
        }
      })
      let ordered = _.orderBy(tableList, ['enter'], 'desc')
      ordered.forEach((e, index) => {
        if (index < 10) { // top10
          let tml = {}
          tml.name = e.name
          tml.enter = `${e.enter.toLocaleString()}人`
          tml.peak = e.highest.number.toLocaleString()
          let timeStr = e.highest.begin.split(' ')
          tml.time = moment(timeStr[0]).format(' YYYY-MM-DD')
          tml.mean = (e.avg).toLocaleString()
          resultData.push(tml)
        }
      })
      this.$refs.reporTable.list = resultData
    }
  },
  computed: {
    companyName () {
      return this.$store.state.report.companyName
    },
    tableWidth () {
      return 100 / this.tableData.time.length
    }
  },
  created () {},
  mounted () {

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
        .one-occupancy-total{
            width: 100%;
            height: auto;
            .one-occupancy-total-text{
                width: 100%;
                height: 215px;
                border: 1px solid #cecece;
                border-radius: 5px;
                -moz-border-radius: 5px;
                -webkit-border-radius: 5px;
                overflow: hidden;
                margin-top: 20px;
                .one-occupancy-list{
                    height: 175px;
                    width: 299px;
                    margin-top: 19px;
                    border:1px solid #cecece;
                    float: left;
                    margin-left: 30px;
                    padding: 25px 20px;
                    border-radius: 5px;
                    -moz-border-radius: 5px;
                    -webkit-border-radius: 5px;

                    img{
                        float: left;
                        display: block;
                        width: 65px;
                        height: auto;
                        margin-top: 29px;
                    }
                    .one-occupancy-list-text{
                        width: 150px;
                        float: right;
                        height: auto;

                        .list-text-name{
                            font-size: 22px;
                            color: #1190d5;
                            letter-spacing: 3px;
                        }
                        .list-text-date{
                            font-size: 22px;
                            color: #747474;
                        }
                        .list-text-time{
                            font-size: 22px;
                            color: #747474;
                        }
                        .list-text-data{
                            font-size: 22px;
                            color: #4e4e4e;
                            &:nth-child(1){
                                margin: 8px 0;
                            }

                        }
                        span{
                            display: inline-block;
                            width: 100%;
                            font-size: 16px;
                            color: #a0a7ad;
                        }
                        &:first-child{
                            width: 125px;
                        }
                    }
                    .list-text-one{
                        width: 140px!important;
                        .list-text-data{
                            margin: 5px 0;
                        }
                    }
                }
            }
        }
        .one-trend-total{
            width: 100%;
            height: auto;
            margin-top: 30px;
            .table{
                width: 100%;
                height: auto;
                margin-top: 50px;
                .table-time{
                    width: 100%;
                    height: auto;
                    overflow: hidden;
                    background-color: #4472c4;
                    p{
                        float: left;
                        text-align: center;
                        color: #fff;
                        border-right: 1px solid #fff;
                        height: 50px;
                        font-size: 18px;
                        line-height: 50px;
                    }
                }
            }
            .table-enter{
                width: 100%;
                height: auto;
                overflow: hidden;
                background-color: #cfd5ea;
                margin-top: 5px;
                p{
                    float: left;
                    text-align: center;
                    color: #000;
                    border-right: 1px solid #fff;
                    height: 50px;
                    font-size: 18px;
                    line-height: 50px;
                    span{
                        display: inline-block;
                        width: 50%;
                        text-align: center;
                        border-right: 1px solid #fff;
                        &:nth-child(2){
                            border-right:none;
                        }
                    }
                }
            }
            .table-peak{
                width: 100%;
                height: auto;
                overflow: hidden;
                border-top: 1px solid #fff;
                .table-peak-total{
                    height: 120px;
                    float: left;
                    border-right: 1px solid #fff;
                    .total-left{
                        width: 50%;
                        float: left;
                        font-size: 18px;
                        color: #000;
                        line-height: 120px;
                        background-color: #e9ebf5;
                        border-right: 1px solid #fff;
                        text-align: center;
                    }
                    .total-right{
                        width: 50%;
                        float: right;
                        height: 100%;
                        p{
                            width: 100%;
                            height: 50%;
                            text-align: center;
                            font-size: 18px;
                            color: #000;
                            line-height: 50px;
                            &:nth-child(1){
                                background-color: #e9ebf5;
                                border-bottom: 1px solid #fff;
                            }
                            &:nth-child(2){
                                background-color: #cfd5ea;
                            }
                        }
                    }
                }
                .table-peak-list{
                    height: 120px;
                    float: left;
                    border-right: 1px solid #fff;
                    p{
                        width: 100%;
                        height: 50%;
                        text-align: center;
                        font-size: 18px;
                        color: #000;
                        line-height: 50px;
                        &:nth-child(1){
                            background-color: #e9ebf5;
                            border-bottom: 1px solid #fff;
                        }
                        &:nth-child(2){
                            background-color: #cfd5ea;
                        }
                    }
                }
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
