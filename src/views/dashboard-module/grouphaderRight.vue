<template>
  <div style=" position: relative;">
    <div class="comport-list">
      <div class="bg-white dashboard-box">
        <vs-row type="flex">
          <vs-col vs-lg="6" vs-xs="12" class="vs-list">
            <p class="fontSize">当日累积客流（人次）</p>
            <p class="dayEnter  font-number font-semibold">{{rightShoppingList.currentDay}}</p>
            <div class="month-data">
              <p class="font-normal"> 当月累积客流（人次）</p>
              <p class="font-number ">{{ rightShoppingList.currentMonthly}}</p>
            </div>
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12" class="vs-list radial-bar">
            <div class="flex">
              <vue-apex-charts
                      type="radialBar"
                      height="100%"
                      :options="chartOptions"
                      :series="rightShoppingList.achievingRate"
              />
            </div>
            <div>
              <p class="text-base text-grey font-normal" style="text-align: center">月达标值（人次）</p>
              <p class="text-lg text-grey font-number font-normal" style="text-align: center">{{ rightShoppingList.monthlyGoal}}</p>
            </div>
          </vs-col>
        </vs-row>
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
    rightShoppingList: {
      type: Object
    }
  },
  components: {
    VueApexCharts

  },
  data () {
    return {
      isheight: false,
      shopData: {
        currentDay: 0,
        currentMonthly: 0,
        monthlyGoal: 0,
        achievingRate: [30]

      }
    }
  },
  computed: {
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
            breakpoint: 1600,
            options: {
              plotOptions: {
                radialBar: {
                  size: 80
                }
              },
              grid:{
                padding: {
                  top: 10,
                  right: 0,
                  bottom: 0,
                  left: 0
                },
              }
            }
          }
        ],
        grid:{
          padding: {
            top: 20,
            right: 0,
            bottom: 0,
            left: 0
          },
        }
      }
    }
  },
  mounted () {
    let data = {
			'code': 200,
			'message': '',
			'data': {
				'main': [
					{ 
						'name': 'Dashboard',
						'router': '\/',
						'id': 1,
						'cname': '\u9996\u9875',
						'subpagesList': [
							{ 'name': 'GroupCompany', 'router': '', 'id': 8, 'cname': '\u96c6\u56e2\u9875\u9762' },
							{ 'name': 'Shopping', 'router': null, 'id': 9, 'cname': '\u8d2d\u7269\u4e2d\u5fc3\u9875\u9762' },
							{ 'name': 'VIPRecode', 'router': null, 'id': 10, 'cname': 'VIP\u987e\u5ba2\u63d0\u9192' }
						]
					},
					{
						'name': 'Analytics',
						'router': '\/footfall',
						'id': 2,
						'cname': '\u5ba2\u6d41\u5206\u6790',
						'subpagesList': [
							{ 'name': 'Entity', 'router': null, 'id': 11, 'cname': '\u5b9e\u4f53\u5ba2\u6d41\u5206\u6790' },
							{ 'name': 'DwellTime', 'router': null, 'id': 12, 'cname': '\u505c\u7559\u65f6\u95f4\u5206\u6790' },
							{ 'name': 'AgeGender', 'router': null, 'id': 13, 'cname': '\u6027\u522b\u5e74\u9f84\u5206\u6790' },
							{ 'name': 'Ranking', 'router': null, 'id': 14, 'cname': '\u6392\u884c\u5360\u6bd4\u5206\u6790' },
							{ 'name': 'GoShop', 'router': null, 'id': 15, 'cname': '\u8fdb\u5e97\u7387\u5206\u6790' },
							{ 'name': 'HeatMap', 'router': null, 'id': 16, 'cname': '\u70ed\u529b\u56fe\u5206\u6790' },
							{ 'name': 'Effective', 'router': null, 'id': 17, 'cname': '\u6709\u6548\u5ba2\u6d41\u5206\u6790' }
						]
					},
					{
						'name': 'Generatrix',
						'router': '\/generatrix',
						'id': 3, 'cname': '\u52a8\u7ebf\u5206\u6790',
						'subpagesList': [
							{ 'name': 'Relevance', 'router': null, 'id': 18, 'cname': '\u5173\u8054\u5206\u6790' },
							{ 'name': 'Cross', 'router': null, 'id': 19, 'cname': '\u4ea4\u53c9\u5ba2\u6d41\u5206\u6790' },
							{ 'name': 'PathTrend', 'router': null, 'id': 20, 'cname': '\u8def\u5f84\u52a8\u5411\u5206\u6790' },
							{ 'name': 'Drainage', 'router': null, 'id': 21, 'cname': '\u5b9e\u4f53\u5f15\u6d41\u5206\u6790' },
							{ 'name': 'OldPath', 'router': null, 'id': 33, 'cname': '\u8def\u5f84\u52a8\u5411\u5206\u6790(\u65e7)' }
						]
					},
					{
						'name': 'Operation',
						'router': '\/operation',
						'id': 4, 'cname': '\u8fd0\u8425\u5206\u6790',
						'subpagesList': [
							{ 'name': 'Goal','router': null, 'id': 22, 'cname': '\u76ee\u6807\u8fbe\u6210\u5206\u6790' },
							{ 'name': 'HolidayAnalysis', 'router': null, 'id': 23, 'cname': '\u8282\u5047\u65e5\u6d3b\u52a8\u5206\u6790' },
							{ 'name': 'SalesAnalytics', 'router': null, 'id': 24, 'cname': '\u9500\u552e\u5206\u6790' }
						]
					},
					{
						'name': 'Report',
						'router': '\/report',
						'id': 5,
						'cname': '\u62a5\u544a\u8be6\u60c5',
						'subpagesList': [
							{ 'name': 'DailyReport', 'router': null, 'id': 25, 'cname': '\u65e5\u62a5' },
							{ 'name': 'WeekReport', 'router': null, 'id': 26, 'cname': '\u5468\u62a5' },
							{ 'name': 'MonthReport', 'router': null, 'id': 27, 'cname': '\u6708\u62a5' }
						]
					},
					{
						'name': 'Admin',
						'router': '\/admin',
						'id': 6,
						'cname': '\u540e\u53f0\u7ba1\u7406',
						'subpagesList': [
							{'name': 'EntityManage', 'router': null, 'id': 28, 'cname': '\u5b9e\u4f53\u7ba1\u7406' },
							{ 'name': 'Account', 'router': null, 'id': 29, 'cname': '\u8d26\u6237\u7ba1\u7406' },
							{ 'name': 'HolidayManage', 'router': null, 'id': 30, 'cname': '\u8282\u5047\u65e5\u6d3b\u52a8\u7ba1\u7406' },
							{ 'name': 'VipCustom', 'router': null, 'id': 31, 'cname': 'VIP\u5ba2\u6237\u7ba1\u7406' },
							{ 'name': 'Role', 'router': null, 'id': 32, 'cname': '\u6743\u9650\u7ba1\u7406' }
						]
					}
				]
			} 
		}
    let list = data.data.main
    let valData = list.map(val => {
      let obj = {
        id: val.id,
        name: val.name
      }
      let dd = val.subpagesList.map(list => {
        let o = {
          id: list.id,
          name: list.name
        }
        return o
      })
      return _.flattenDeep([obj, dd])
    })
  },
  methods: {
    rightImgClick () {
      if (this.isheight == true) {
        document.getElementById('comportAction').scrollTop = 0
        this.isheight = false
      } else {
        this.isheight = true
      }
      this.$emit('isRightImg', this.isheight)
    }
  }
}
</script>
<style scoped lang='less'>

.right-img{
    width: 60px;
    position: absolute;
    bottom: -30px;
    left: 50%;
    margin-left: -30px;
    cursor: pointer;
}
.header-title{
    margin-top: 35px;
    font-size: 16px;
}
.right-comport{
    padding: 10px 10px 0 10px;
    height: 270px;
    overflow: hidden;
    .comport-list{
      width: 49%;
      float: left;
      margin-bottom: 10px;
      &:nth-child(2n+0){
        float:right;
      }
      .vs-list{
        padding: 0 5px;

      }
    }
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
.comportAction{
   height: 441px;
   overflow: auto;
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
  bottom: 10px;
  left:38%;
}
.month-data{
  margin-top: 20px;
  p{
    font-size: 14px;
    color: #a6a7a7;
    &:nth-child(2){
      font-size: 32px!important;
      color: #3E3C3C;
      font-weight: 600;
    }
  }
}
</style>
<style lang="stylus" scoped>
.dashboard-box
  box-shadow:0px 0px 8px 1px rgba(166,167,167,0.3);
  border-radius:6px;
  padding :20px;
</style>
