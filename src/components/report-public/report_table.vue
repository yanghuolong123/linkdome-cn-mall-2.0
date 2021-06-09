
<template>
    <div class="report-chart">
      	<title-name :listTitle='listTitle'></title-name>
        <ul class="table">
            <li>
                <p v-for="(item,index) in tableColumn" :key="index">{{item}}</p>
            </li>
            <li v-for="(item,index) in tableData" :key="index">
                <p>{{item.name}}</p>
                <p>{{item.enter}} 人次</p>
                <p>{{item.peak}} 人次 {{item.time}}</p>
                <p>{{item.mean}} 人次/天</p>
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
      padding: 0 80px;
      margin: 50px 0;
      .table{
          width: 100%;
          height: auto;
          border: 4px dashed #4edbda;
          border-radius: 8px;
          margin-top: 12px;
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
                  width: 25%;
                  float:left;
                  text-align: center;
                  color: #3d3d3d;
                  height: 50px;
                  line-height:50px;
                  font-size: 16px;
              }
          }
      }
    }

</style>
