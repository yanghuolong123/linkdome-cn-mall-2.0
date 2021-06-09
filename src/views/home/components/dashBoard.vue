<template>
  <div class=" dashboard-box">
    <div class="static-box">
      <div class="static-l bg-white">
        <div>
          <p class="title flex-box">
            <i class="iconfont iconenter_total"></i>
            <span class="text-size" style="color: #3F3B3B">当日累积客流(人次)</span>
          </p>
          <div class="value-size" style="color: #3E3C3C"><b>{{dayTotalEnter | tenthousandFormat}}</b></div>
        </div>
        <div>
          <p class="title flex-box">
            <i class="iconfont icondangrixiaoshoue"></i>
            <span class="text-size" style="color: #3F3B3B">当日累积销售额(元)</span>
          </p>
          <div class="value-size" style="color: #3E3C3C"><b>{{ saleData.sale_today| tenthousandFormat}}</b></div>
        </div>
      </div>
      <div class="static-l bg-white">
        <div>
          <p class="title flex-box">
            <i class="iconfont iconenter_total"></i>
            <span class="text-size" style="color: #A0A0A0">本月累积客流(人次)</span>
          </p>
          <div class="value-size" style="color: #A0A0A0"><b>{{ monthEnter| tenthousandFormat}}</b></div>
        </div>
        <div>
          <p class="title flex-box">
            <i class="iconfont icondangrixiaoshoue"></i>
            <span class="text-size" style="color: #A0A0A0">本月累积销售额(元)</span>
          </p>
          <div class="value-size" style="color: #A0A0A0"><b>{{ saleData.sale_month| tenthousandFormat}}</b></div>
        </div>
      </div>
    </div>

    <div class="chart-box bg-white flex-box">
      <div class="chart-b">
        <vue-apex-charts
                class="chart"
                type="radialBar"
                :options="chartOptions"
                :series="chartData(target,monthEnter)"
        />
        <span>月达标值(人次)</span>
        <span>{{ target| tenthousandFormat}}</span>
      </div>
     <div class="chart-b">
       <vue-apex-charts
               class="chart"
               type="radialBar"
               :options="chartOptions2"
               :series="chartData(saleData.sale_target,saleData.sale_month)"
       />
       <span>月达标值(元)</span>
       <span>{{ saleData.sale_target| tenthousandFormat}}</span>
     </div>
    </div>
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
    },
    saleData: {
      type: Object,
      default: {}
    }
  },
  components: {
    VueApexCharts
  },
  computed: {
    chartData () {
      return function (target, value) {
        if (!target) return [0]// 除数不能为零
        let rate = NP.times(NP.round((value / target), 2), 100)// 处理js浮点精度
        return [rate]
      }
    },
    chartOptions2 () {
      return {
        plotOptions: {
          radialBar: {
            size: 90,
            startAngle: -150,
            endAngle: 150,
            hollow: {
              size: '65%'
            },
            track: {
              strokeWidth: '100%'
            },
            dataLabels: {
              name: {
                fontSize: '16px'
              },
              value: {
                offsetY: 15,
                color: '#99a2ac',
                fontSize: '14px'
              }
            }
          }
        },
        colors: ['#2280D7'],
        fill: {
          type: 'gradient',
          gradient: {
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
          dashArray: 4
        },
        chart: {
          fontFamily: 'source_han_sans_cn'
        },
        grid: {
          padding: {
            top: 10,
            right: 0,
            bottom: 0,
            left: 0
          }
        },
        labels: ['本月销售达成率'],
        responsive: [
          {
            breakpoint: 1700,
            options: {
              plotOptions: {
                radialBar: {
                  size: 75
                }
              }
            }
          },
          {
            breakpoint: 1400,
            options: {
              plotOptions: {
                radialBar: {
                  size: 60
                }
              }
            }
          }, {
            breakpoint: 1600,
            options: {
              plotOptions: {
                radialBar: {
                  size: 70,
                  dataLabels: {
                    name: {
                      fontSize: '12px'
                    },
                    value: {
                      offsetY: 10,
                      color: '#99a2ac',
                      fontSize: '12px'
                    }
                  }
                }
              },
              grid: {
                padding: {
                  top: 20,
                  right: 0,
                  bottom: 0,
                  left: 0
                }
              }
            }
          },
          {
            breakpoint: 1200,
            options: {
              plotOptions: {
                radialBar: {
                  size: 70
                }
              }
            }
          }
        ]
      }
    },
    chartOptions () {
      return {
        chart: {
          type: 'radialBar'
        },
        plotOptions: {
          radialBar: {
            size: 90,
            startAngle: -150,
            endAngle: 150,
            hollow: {
              size: '65%'
            },
            track: {
              strokeWidth: '100%'
            },
            dataLabels: {
              name: {
                fontSize: '16px'
              },
              value: {
                offsetY: 15,
                fontSize: '14px',
                color: '#99a2ac'
              }
            }
          }
        },
        colors: ['#EA5455'],
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            inverseColors: true,
            gradientToColors: ['#7367F0'],
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 1000]
          }
        },
        grid: {
          padding: {
            top: 10,
            right: 0,
            bottom: 0,
            left: 0
          }
        },
        stroke: {
          dashArray: 4
        },
        labels: ['本月客流达成率'],
        responsive: [
          {
            breakpoint: 1700,
            options: {
              plotOptions: {
                radialBar: {
                  size: 75
                }
              }
            }
          },
          {
            breakpoint: 1400,
            options: {
              plotOptions: {
                radialBar: {
                  size: 60
                }
              }
            }
          }, {
            breakpoint: 1600,
            options: {
              plotOptions: {
                radialBar: {
                  size: 70,
                  dataLabels: {
                    name: {
                      fontSize: '12px'
                    },
                    value: {
                      offsetY: 10,
                      color: '#99a2ac',
                      fontSize: '12px'
                    }
                  }
                }
              },
              grid: {
                padding: {
                  top: 20,
                  right: 0,
                  bottom: 0,
                  left: 0
                }
              }
            }
          },
          {
            breakpoint: 1200,
            options: {
              plotOptions: {
                radialBar: {
                  size: 70
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

.flex-box{
  display: flex;
  align-items: center;
}
.dashboard-box{
  /*box-shadow:0px 0px 8px 1px rgba(166,167,167,0.3);*/
  /*border-radius:6px;*/
  /*padding: 10px;*/
  display: flex;
  align-items: stretch;
  height: 300px;
    .static-box{
      box-shadow:0px 0px 8px 1px rgba(166,167,167,0.3);
      width: 55%;
      margin-right: 10px;
      background-color: #fff;
      display: flex;
      .static-l{
        position: relative;
        border-radius:6px;
        padding: 40px 10px;
        width:50%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 6%;
        .title{
          span{
            word-break: keep-all;
          }
          i{
            color: rgb(34, 128, 215);
            &.icondangrixiaoshoue{
              color: #E75759;
            }
          }
        }

      }

      // .static-l:nth-child(1):after{
      //   content: '';
      //   position: absolute;
      //   width:2px;
      //   height: 35%;
      //   background-color: #A0A0A0;
      //   right: 17px;
      //   top: 50%;
      //   transform: translateY(-50%);
      // }
    }
    .chart-box{
      flex: 1;
      box-shadow:0px 0px 8px 1px rgba(166,167,167,0.3);
      border-radius:6px;
      .chart-b{
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        .chart{
          color: #9E9E9E;
        }
      }
    }
}
@media (max-width: 1200px){
  i{
    font-size: 18px;
    margin-right: 5px;
    &.icondangrixiaoshoue{
      font-size: 22px;
    }
  }
  .text-size{
    font-size: 17px;
  }
  .value-size{
    font-size: 28px;
  }
}
@media (min-width: 1650px){
  i{
    font-size: 18px;
    margin-right: 5px;
    &.icondangrixiaoshoue{
      font-size: 22px;
      margin-right: 3px;
    }
  }
  .text-size{
    font-size: 17px;
  }
  .value-size{
    font-size: 28px;
  }
}//窗口大于等于1650px，文字字号30px
@media (max-width: 1649px) and (min-width: 1460px) {
  i{
    font-size: 16px;
    margin-right: 3px;
    &.icondangrixiaoshoue{
      font-size:18px;
      margin-right: 1px;
    }
  }
  .text-size{
    font-size: 14px;
  }
  .value-size{
    font-size: 24px;
  }
} //窗口小于等于1650px，文字字号16px

@media (max-width: 1459px) and (min-width: 1200px) {
  i{
    font-size: 14px;

  }
  .text-size{
    font-size: 12px;
  }
  .value-size{
    font-size: 18px;
  }
}//窗口小于等于1550px，文字字号30px

</style>
