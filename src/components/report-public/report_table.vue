
<template>
    <div class="report-chart" style="padding: 0 80px;
      margin: 20px 0;">
      	<title-name :listTitle='listTitle'></title-name>
        <ul class="table" style="  border: 4px dashed #4edbda;
          border-radius: 8px;
          margin-top: 12px;">
            <li>
                <p style=" height: 45px;
                  line-height:45px;
                  font-size: 16px;" :style="{width:width}" v-for="(item,index) in tableColumn" :key="index">{{item}}</p>
            </li>
            <li v-for="(item,index) in tableData" :key="index">
                <p style=" height: 45px;
                  line-height:45px;
                  font-size: 16px;" :style="{width:width}" v-if="item.name">{{item.name}}</p>
                <p style=" height: 45px;
                  line-height:45px;
                  font-size: 16px;" :style="{width:width}" v-if="item.enter">{{item.enter}} {{$t('人次')}}</p>
                <p style=" height: 45px;
                  line-height:45px;
                  font-size: 16px;" :style="{width:width}" v-if="item.peak">{{item.peak}} {{$t('人次')}} {{item.time}}</p>
                <p style=" height: 45px;
                  line-height:45px;
                  font-size: 16px;" :style="{width:width}" v-if="item.mean">{{item.mean}} {{$t('report.人次/天')}}</p>
                <p style=" height: 45px;
                  line-height:45px;
                  font-size: 16px;" :style="{width:width}" v-if="item.source">{{item.source}}</p>
                <p style=" height: 45px;
                  line-height:45px;
                  font-size: 16px;" :style="{width:width}" v-if="item.target">{{item.target}}</p>
                <p style=" height: 45px;
                  line-height:45px;
                  font-size: 16px;" :style="{width:width}" v-if="item.value">{{item.value}}</p>
                 <p style=" height: 45px;
                  line-height:45px;
                  font-size: 16px;" :style="{width:width}" v-if="item.rate">{{item.rate}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
import titleName from './report_title_name'
export default {
  name: 'report-chart',
  props: {
    listTitle: {
      type: Object
    },
    tableColumn: {
      type: Array
    },
    tableData: {
      type: Array
    },
    width:{
      type:String
    }
  },
  components: {
    titleName
  },
  data () {
    return {

    }
  },
  watch: {

  },
  computed: {
  },
  methods: {

  },
  created () {

  },
  mounted () {

  }
}
</script>
<style scoped lang="less">
    .report-chart {
      width: 100%;
      .table{
          width: 100%;
          height: auto;
          li{
              width: 100%;
              height: auto;
              overflow: hidden;
              background-color: #fff;
              &:nth-child(1){
                  background-color: #2081D4;
                  p{
                      color: #fff;
                  }
              }
              &:nth-child(2n+0){
                  background-color: #f4f4f4;
              }
              p{
                  float:left;
                  text-align: center;
                  color: #3d3d3d;
              }
          }
      }
    }

</style>
