<template>
  <div class="bg-white dashboard-box">
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
      <vs-col vs-lg="6" vs-xs="12" style="position:relative">
        <vue-apex-charts
          type="radialBar"
          height="230"
          :options="chartOptions"
          :series="chartData"
        />
        <div class="month-values">
          <p class="text-base text-grey font-normal">月达标值（人次）</p>
          <p class="text-lg text-grey font-number font-normal">{{ target| numberFormat}}</p>
        </div>
      </vs-col>
    </vs-row>
  </div>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'
import Moment from 'moment'
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
    }
  },
  components: {
    VueApexCharts
  },
  computed: {
    chartData () {
      if (this.target === 0) return [0]// 除数不能为零
      let rate = NP.times(NP.round((this.monthEnter / this.target), 2), 100)// 处理js浮点精度
      return [rate]
    },
    chartOptions () {
      return {

        plotOptions: {
          radialBar: {
            size: 100,
            startAngle: -150,
            endAngle: 150,
            hollow: {
              size: '65%'
            },
            track: {
              background: '#fff',
              strokeWidth: '100%'
            },
            dataLabels: {
              value: {
                offsetY: 15,
                color: '#99a2ac',
                fontSize: '18px'
              }
            }
          }
        },
        colors: ['#EA5455'],
        fill: {
          type: 'gradient',
          gradient: {
          // enabled: true,
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#7367F0'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 1000]
          }
        },
        stroke: {
          dashArray: 8
        },
        chart: {
          sparkline: {
          },
          fontFamily: 'source_han_sans_cn'
        },
        labels: ['本月客流达成率'],
        responsive: [
          {
            breakpoint: 1576,
            options: {
              plotOptions: {
                radialBar: {
                  size: 80
                }
              }
            }
          },
          {
            breakpoint: 1200,
            options: {
              plotOptions: {
                radialBar: {
                  size: 100
                }
              }
            }
          }
        ]
      }
    }
  }
}
</script>
<style scoped lang='less'>
.dashboard-box{
  padding: 20px;
}
.fontSize{
  font-size: 18px;
  color: #3E3C3C;
  margin-top: 30px;
}
.dayEnter{
  font-size: 52px;
   color: #3E3C3C;
}
.month-values{
  display: inline-block;
  position: absolute;
  bottom: -20px;
  right:33%;
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
<style lang="stylus" scoped>
.dashboard-box
  box-shadow:0px 0px 8px 1px rgba(166,167,167,0.3);
  border-radius:6px;
  height:300px;
</style>
