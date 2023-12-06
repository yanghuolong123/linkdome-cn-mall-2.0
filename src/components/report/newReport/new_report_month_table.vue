
<template>
    <div class="reportOneText" style=" width: 1200px;
        height: 1682px;">
        <div class="report-list" style=" padding-bottom: 180px;">
            <report-header></report-header>
            <report-title :title="title"></report-title>
            <div class="table-list" style="  margin: 12px 0 20px 0;
                padding: 0 80px;">
                <title-name :listTitle='listTitle'></title-name>
               <table cellpadding="0" cellspacing="0" style="border: 4px dashed #4edbda;
                    margin: 12px 0 0 0;
                    border-radius: 8px;">
                    <tr style="background-color:#2081D4;">
                       <td colspan="2" style="height:55px;border-bottom:2px solid #fff;color:#fff;border-right: 2px solid #fff; font-size: 14px;">
                         {{$t('名称')}}
                       </td>
                        <td
                          style="height:55px;border-bottom:2px solid #fff;border-right: 2px solid #fff;
                          font-size: 14px;color:#fff;" :key="index2+100" v-for="(name2,index2) in tableColumn" >
                         <p>{{name2.name}}</p>
                         <p> {{$t('report.本期')}}</p>
                         <p style="font-size: 12px;">{{name2.time1}}</p>
                         <p v-if="showLastYearData"> {{$t('report.同期')}}</p>
                         <p v-if="showLastYearData" style="font-size: 12px;">{{name2.time2}}</p>
                        </td>
                    </tr>

                    <tr class="table-tr" :key="index" v-for="(item,index) in  tableData">
                        <td style="border-right: 2px solid #D2D2D2; font-size: 14px;border-bottom: 2px solid #D2D2D2;">{{item.name}}</td>
                        <td  style="border-right: 2px solid #D2D2D2; font-size: 16px;">
                            <p  style="font-size:14px;border-bottom: 2px solid #D2D2D2;line-height:28px;"> {{$t('report.本期')}}</p>
                            <p v-if="showLastYearData"  style="font-size:14px;border-bottom: 2px solid #D2D2D2;line-height:28px;"> {{$t('report.同期')}}</p>
                            <p  v-if="showLastYearData" style="font-size:14px;border-bottom: 2px solid #D2D2D2;line-height:28px;">{{$t('report.同比')}}</p>
                        </td>
                        <td :key="index" v-for="(enter,index) in item.enter" style="border-right: 2px solid #D2D2D2; font-size: 16px;">
                            <p  style="font-size:14px;border-bottom: 2px solid #D2D2D2;line-height:28px;">{{enter.curr}}</p>
                            <p  v-if="showLastYearData" style="font-size:14px;border-bottom: 2px solid #D2D2D2;line-height:28px;">{{enter.period}}</p>
                            <p   v-if="showLastYearData" style="font-size:14px;border-bottom: 2px solid #D2D2D2;line-height:28px;">{{enter.ratio}}</p>
                        </td>
                    </tr>

                </table>
            </div>
            <report-flooter :size='page'></report-flooter>
        </div>
        <img :src="logo" class="report-bg" alt="">
    </div>
</template>
<script>
import reportHeader from '@/components/report-public/report_header'
import reportTitle from '@/components/report-public/report_title'
import reportFlooter from '@/components/report-public/report_flooter'
import reportTable from '@/components/report-public/report_table'
import titleName from '@/components/report-public/report_title_name'
export default {
  name: 'report-month-gate-table',
  props: {
    title: {
      type: String
    },
    page: {
      type: String
    },
    showLastYearData: {
      type: Boolean
    },
    tableColumn: {
      type: Array,
      default: []
    },
    tableData: {
      type: Array
    },
    listTitle:{
      type:Object
    },
  },
  components: {
    reportHeader,
    reportTitle,
    reportFlooter,
    reportTable,
    titleName
  },
  data () {
    return {
      logo: require('@/assets/images/fixation_img/bg/list_bg.png')

    }
  },
  methods: {
  },
  computed: {

  },
  created () {},
  mounted () {}
}
</script>
<style scoped lang="less">
    .reportOneText {
        display: inline-block;
        overflow: hidden;
        background-color: #eff5fa;
        position: relative;
        .report-list{
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            .table-list{
              table{
                  width: 100%;
                  height: auto;
                  background-color: #fff;
                  padding: 0;
                  tr{
                      width: 100%;
                      margin: 0;
                      padding: 0;
                        &:last-child{
                            border-bottom: none;
                        }
                      td{
                          text-align: center;
                          color: #666;
                          &:last-child{
                              border-right: none!important;;
                          }

                      }

                  }
              }
          }
        }

        .report-bg{
            display: block;
            width: 100%;
            height: auto;
            position: absolute;
            left: 0;
            bottom: 0;
        }
    }
</style>
