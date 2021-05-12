
<template>
    <div class="reportOneText" style=" width: 1200px;
        height: 1682px;">
        <div class="report-list" style=" padding-bottom: 180px;">
            <report-header></report-header>
            <report-title :title="title"></report-title>
            <div class="table-list" style="  margin: 12px 0 20px 0;
                padding: 0 80px;">
                <title-name :listTitle='listTitle'></title-name>
                <ul  style="border: 4px dashed #4edbda;
                    margin: 12px 0 0 0;
                    border-radius: 8px;">
                  <li>
                    <header style="height:75px;font-size: 14px;">
                      <div class="name" style=" width: 120px;line-height: 75px;border-right:2px solid #fff;">
                         名称
                      </div>
                      <div  style="width: 130px;border-right:2px solid #fff;height:100%;padding:7px 0;"
                      :key="index2+100" v-for="(name2,index2) in tableColumn"
                     >
                         <p>{{name2.name}}</p>
                         <p>{{name2.time1}}</p>
                         <p>{{name2.time2}}</p>
                      </div>
                    </header>
                  </li>
                  <li class="list" :key="index" v-for="(item,index) in tableData" style="border-bottom:2px solid #D2D2D2;">
                    <div class="name">
                      {{item.name}}
                    </div>
                    <div style="width:960px;border-bottom:2px solid #D2D2D2;">
                      <p style=" width: 50px;border-right:2px solid #D2D2D2;  line-height: 29px;">本期</p>
                      <p style=" width:130px;border-right:2px solid #D2D2D2;  line-height: 29px;"
                       :key="cIndex" v-for="(current,cIndex) in item.current">
                        {{current}}
                      </p>
                    </div>
                    <div style="width:960px;border-bottom:2px solid #D2D2D2;">
                      <p style=" width: 50px;border-right:2px solid #D2D2D2;  line-height: 29px;">同期</p>
                      <p style=" width:130px;border-right:2px solid #D2D2D2;  line-height: 29px;"
                      :key="cIndex" v-for="(period,cIndex) in item.period" >
                        {{period}}
                      </p>
                    </div>
                    <div style="width:960px;">
                      <p style=" width: 50px;border-right:2px solid #D2D2D2;  line-height: 29px;">同比</p>
                      <p style=" width:130px;border-right:2px solid #D2D2D2;  line-height: 29px;"
                      :key="cIndex" v-for="(ratio,cIndex) in item.ratio" >
                        {{ratio}}
                      </p>
                    </div>
                  </li>
                </ul>
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
  name: 'report-week-gate-table',
  props: {
    title: {
      type: String
    },
    page: {
      type: String
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
              table ,ul{
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
                  .table-td{
                    width: 100%;
                    p{
                      color: #666;
                    }
                    
                  }
              }
              li{
                width: 100%;
                header{
                  background-color:#2081D4 ;
                  overflow: hidden;
                  .name{
                    text-align: center;
                    color: #fff;
                  }
                  div {
                    float: left;
                    p{
                      text-align: center;
                      color: #fff;
                    }
                    &:last-child{
                      border-right: none!important;
                    }
                  }
                }
              }
              .list{
                overflow: hidden;
                .name{
                  overflow: hidden;
                  width: 70Px;
                  height: 90Px;
                  border-right:2Px solid #D2D2D2;
                  display: flex;
                  justify-content: center;
                  flex-direction: column;
                }
                div {
                  float: left;
                  text-align: center;
                  p{
                    float: left;
                    text-align: center;
                  
                    &:last-child{
                      border-right: none!important;
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
