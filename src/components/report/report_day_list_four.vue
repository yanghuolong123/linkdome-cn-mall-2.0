
<template>
    <div class="reportOneText">
        <report-list-header></report-list-header>
        <div class="one-occupancy-total">
            <div class="one-occupancy-total-title">
                <p>{{propertyName}}</p>
                <span>{{titleType}}</span>
            </div>
        </div>
        <div class="one-trend-total">
            <div class="one-trend-total-title">
                <div class="one-trend-total-title">
                    <span>{{tableName}}</span>
                </div>
            </div>
            <ul class="table">
                <li>
                    <p :key="index" v-for="(item,index) in tableTitle">{{item}}</p>
                </li>
                <li :key="index" v-for="(item,index) in data1">
                    <p>{{item.name}}</p>
                    <p>{{item.age}}</p>
                    <!-- <p>{{item.address}}</p> -->
                </li>
            </ul>
        </div>
        <div class="page_number">第{{pageNumber}}页</div>
        <report-list-floor></report-list-floor>
    </div>
</template>
<script>
import reportListHeader from '@/components/report/report_day_list_header'
import reportListFloor from '@/components/report/report_day_list_floor'
export default {
  name: 'report-day-two',
  components: {
    reportListHeader,
    reportListFloor
  },
  data () {
    return {
      titleType: '',
      tableTitle: [],
      pageNumber: 2,
      propertyName: '',
      data1: [],
      tableName: ''
    }
  },
  methods: {
    dataList (name, data) {
      this.data1 = []
      this.data1 = data
      this.propertyName = name.propertyName
      this.titleType = name.titleType
      this.tableTitle = name.tableTitle
      this.pageNumber = name.pageNumber
      this.tableName = name.tableName
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
<style scoped lang="less">
    .table{
        width: 100%;
        height: auto;
        margin-top: 50px;
        li{
            width: 100%;
            height: auto;
            overflow: hidden;
            background-color: #e9ebf5;
            border-bottom: 1px solid #fff;
            &:nth-child(1){
                background-color: #4472c4;
                margin-bottom: 5px;
                p{
                    color: #fff;
                }
            }
            &:nth-child(2n+0){
                background-color: #cfd5ea;
            }
            p{
                width: 50%;
                float:left;
                text-align: center;
                color: #000;
                height: 60px;
                line-height: 60px;
                font-size: 18px;
                border-right: 1px solid #fff;
                &:nth-child(3){
                    border-right: none;
                };
            }
        }
    }
    .reportOneText {
      width: 1200px;
        height: 1682px;
        overflow: hidden;
        padding: 100px 50px;
        background-color: #fff;
        position: relative;
        .one-occupancy-total{
            width: 100%;
            height: auto;
            .one-occupancy-total-title{
                height: 95px;
                width: 100%;
                border-bottom: 2px solid #b7c4ca;
                position: relative;
                p{
                    width: 100%;
                    line-height: 95px;
                    text-align: center;
                    color: #363636;
                    font-size: 28px;
                }
                span{
                    position: absolute;
                    left: 0;
                    top:0;
                    display: inline-block;
                    font-size: 27px;
                    color: #1190d5;
                    line-height: 95px;
                }
            }
        }
        .one-trend-total{
            width: 100%;
            height: 1460px;
            margin-top: 50px;
            .one-trend-total-title{
                height: 50px;
                width: 100%;
                border-bottom: 2px solid #b7c4ca;
                span{
                    display: inline-block;
                    font-size: 27px;
                    color: #1190d5;
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
    }

</style>
