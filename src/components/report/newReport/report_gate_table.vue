
<template>
    <div class="reportOneText" style=" width: 1200px;
        height: 1682px;">
        <div class="report-list" style=" padding-bottom: 110px;">
            <report-header></report-header>
            <report-title :title="title"></report-title>
            <div class="table-list" style="  margin: 12px 0 20px 0; padding: 0 80px;">
                <title-name :listTitle='listTitle'></title-name>
                <table cellpadding="0" cellspacing="0" style="border: 4px dashed #4edbda;
                    margin: 12px 0 0 0;
                    border-radius: 8px;">
                    <tr style="background-color:#2081D4;">
                        <td :key="index" v-for="(item,index) in tableData.column"  style="height:55px; border-right: 2px solid #fff; font-size: 22px;border-bottom:2px solid #fff;" >
                            {{item}}
                        </td>
                    </tr>
                    <tr class="table-tr" :key="index" v-for="(item,index) in tableData.data">
                        <td  style="height:55px; border-right: 2px solid #D2D2D2; font-size:16px;border-bottom: 2px solid #D2D2D2;" >
                            {{item.name}}
                        </td>
                        <td  style="height:55px; border-right: 2px solid #D2D2D2; font-size: 16px;border-bottom: 2px solid #D2D2D2;" >
                             {{item.curr}}
                        </td>
                        <td  style="height:55px; border-right: 2px solid #D2D2D2; font-size: 16px;border-bottom: 2px solid #D2D2D2;" >
                             {{item.last}}
                        </td>
                        <td  style="min-width:200px;height:55px; border-right: 2px solid #D2D2D2; font-size: 16px;border-bottom: 2px solid #D2D2D2;" >
                             {{item.basis}} %
                        </td>
                    </tr>

                </table>
             </div>
            <report-flooter :size='page'></report-flooter>
        </div>
        <img :src="flooterBg" class="report-bg" alt="">
    </div>
</template>
<script>
import reportHeader from '@/components/report-public/report_header'
import reportTitle from '@/components/report-public/report_title'
import reportFlooter from '@/components/report-public/report_flooter'
import reportTable from '@/components/report-public/report_table'
import titleName from '@/components/report-public/report_title_name'
export default {
  name: 'report-gate-table',
  props: {
    title: {
      type: String
    },
    listTitle:{
      type:Object
    },
    tableData: {
      type: Object
    },
    page:{
      type:String
    }
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
      flooterBg: require('@/assets/images/fixation_img/bg/list_bg.png')
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

        }
        .report-bg{
            display: block;
            width: 100%;
            height: auto;
            position: absolute;
            left: 0;
            bottom: 0;
        }
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
                td{
                    text-align: center;
                    color: #fff;
                    &:last-child{
                        border-right: none;
                    }
                }

            }
            .table-tr{
                &:last-child{
                    td{
                        border-bottom:none;
                    }
                }
                td{
                    color: #3D3D3D;
                }
            }
        }
    }

    }
</style>
