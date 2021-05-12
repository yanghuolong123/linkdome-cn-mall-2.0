<template>
  <div class="bg-white dev-dashboard-box box-hover">
    <vs-row type="flex">
      <vs-col vs-lg="6" vs-xs="12" class="numberBox">
        <p class="fontSize font-medium">
         当日累积客流（人次）
        </p>
        <p class="dayEnter  font-number font-semibold">{{dayTotalEnter | numberFormat}}</p>
        <div class="month-data">
          <p class="font-normal"> 当月累积客流（人次）</p>
          <p class="font-number ">{{ monthEnter| numberFormat}}</p>
        </div>
      </vs-col>
      <vs-col vs-lg="6" vs-xs="12" class="radial-bar">
        <div class="flex">
          <vue-apex-charts
                  type="radialBar"
                  height="100%"
                  :options="chartOptions"
                  :series="chartData"
          />
        </div>
        <div>
          <p class="text-base text-grey font-normal">月达标值（人次）</p>
          <p class="text-lg text-grey font-number font-normal" style="text-align: center">{{ target| numberFormat}}</p>
        </div>
      </vs-col>
    </vs-row>
  </div>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'
import NP from 'number-precision'
export default {
  name: 'dashBoard',
  props: {
    target: {
      type: Number,
      default: 0
    },
    todayEnter: {
      type: Number,
      default: 0
    },
    dayTotalEnter: {
      type: Number,
      default: 0
    },
    monthEnter: {
      type: Number,
      default: 0
    },
    chartData:{
        type:Array,
        default:[]
    },
    chartOptions:{
      type: Object,
      default: {}
    }
  },
  components: {
    VueApexCharts
  },
  computed: {
  },
  data(){
    return {
    }
  }
}
</script>
<style scoped lang='less'>
.dev-dashboard-box{
  padding: 20px;
  box-shadow:0px 0px 8px 1px rgba(166,167,167,0.3);
  border-radius:6px;
  &:hover{
    border:1px solid #23aeee!important;
    border-radius: 6px;
    box-shadow: 0px 0px 18px 0px rgba(160, 163, 164, .5)!important;
  }
  .radial-bar{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .flex{
      flex: 1;
    }
  }
}
.fontSize{
  font-size: 17px;
  color: #3f3b3b;
  margin-top: 30px;
}
.dayEnter{
  font-size:30px;
  color: #3E3C3C;
}

.month-data{
  margin-top: 20px;
  p{
    font-size: 14px;
    color: #A6A7A7;
    &:nth-child(2){
      font-size: 32px!important;
      color: #3E3C3C;
      font-weight: bold;
    }
  }
}
</style>
