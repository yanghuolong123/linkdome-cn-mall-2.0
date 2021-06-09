<template>
  <div class="go-shop">
    <div class="go-time-selector">
      <!-- <h1>店铺TOP10排行分析</h1> -->
          <div class="shop10-picker">
            <DatePicker

                type="daterange"
                v-model="crossDate"
                placement="bottom-end"
                :options="disabledDate"
                placeholder="选择日期"
                style='width:230px;float:left;'
            ></DatePicker>
            <vs-select
                class="shopSelect"
                autocomplete
                v-model="selectType"
                 v-if="isShow"
            >
            <vs-select-item
                :value="item.value"
                :text="item.text"
                :key="index"
                v-for="(item,index) in typeList"
            />
            </vs-select>
            <DatePicker
              type="daterange"
              v-model="crossDateTwo"
              placement="bottom-end"
              :options="disabledDate"
              placeholder="选择日期"
              style='width:230px;float:left;margin-left:30px;'
              v-if="selectType == 1"
            ></DatePicker>
          </div>
          <div class="go-shop-activities">
              <vs-select
                class="shopSelect"
                autocomplete
                v-model="activities"
                placeholder="选择业态"
                style="width:230px;"
              >
                <vs-select-item
                  :value="item.value"
                  :text="item.text"
                  :key="index"
                  v-for="(item,index) in activitiesType"
                />
              </vs-select>
              <div class="cross-submit" v-on:click="paramsPrepare">查询</div>
              <div class="cross-reset" v-on:click="resetData">重置</div>
          </div>
    </div>
    <div class="go-shop-chart-list" >
        <div class="go-shop-time-icon">
          <span>进店率TOP10排行分析</span>
          <p>
            <span :key="index" v-for="(icon,index) in iconList" v-on:click="iconClick(icon.value)">
              <icons
                :title="iconTitle[icon.type]"
                :type="icon.type"
                :size="20"
                :color="iconIndex === icon.value ? iconColor :'#9D9D9DFF'"
              ></icons>
            </span>
          </p>
        </div>
        <div v-if="isData" class="noData">暂无数据</div>
         <vue-apex-charts
           v-bind:class="{ lineAction: iconIndex == 0 }"
            class="shop-line"
            ref="graphLine"
            height='408'
            width="100%"
            type="bar"
            v-if="isList"
            :options="graphData.chartOptions"
            :series="graphData.series"
          ></vue-apex-charts>
          <table-default
            v-bind:class="{ tableAction: iconIndex ==1}"
            class="shop-table"
            :tableTitle='goTitle'
            :tableName='goName'
            :tableList='goTableList'
          ></table-default>
    </div>
  </div>
</template>
<script>
import flowSelector from '@/components/Passenger-analysis/flowSelector.vue'
import TableDefault from '@/views/ui-elements/table/TableDefault.vue'
import VueApexCharts from 'vue-apexcharts'
import { activitiesList, goShopTen, goShopTenLoading } from '@/api/analysis'
import { goShowFlow } from '@/api/home.js'
import { disabledDate } from '@/libs/util.js'
import moment from 'moment'
import NP from 'number-precision'
import _ from 'lodash'
export default {
  name: 'goShop',
  components: {
    flowSelector,
    TableDefault,
    VueApexCharts

  },
  data () {
    return {
      isList: false,
      isData: true,
      activities: 0,
      activitiesType: [],
      crossDate: [],
      crossDateTwo: [],
      selectType: 0,
      typeList: [
        {
          text: '无对比',
          value: 0
        },
        {
          text: '时间对比',
          value: 1
        }
      ],
      iconList: [
        {
          type: '62',
          color: '#9D9D9DFF',
          value: 0
        },
        {
          type: 'biaoge-copy',
          color: '#9D9D9DFF',
          value: 1
        },
        {
          type: 'daoru',
          color: '#9D9D9DFF',
          value: 2
        }
      ],
      iconTitle: {
        'zhexiantu': '折线图',
        '62': '柱状图',
        'biaoge-copy': '详细数据',
        'xiangxia': '查看全部实体排行',
        'ditu': '出入口客流',
        'fenxi': '饼状图',
        'chakan': '查看所有',
        'daoru': '下载'
      },
      iconIndex: 0,
      iconColor: 'rgb(34, 128, 215)',
      goTitle: '',
      goName: ['名称', '百分比'],
      goTableList: [],
      graphData: {
        chartOptions: {
          chart: {
            toolbar: {
              show: false,
              tools: {
                download: false
              }
            },
            events: {}
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '45%',
              endingShape: 'rounded'
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: []
          },
          yaxis: {
            title: {
              text: '百分比（%）'
            },
            labels: {
              show: true,
              formatter: (value) => {
                return value + '%'
              }
            }
          },
          fill: {
            opacity: 1

          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + '%'
              }
            }
          }
        },
        series: []
      },
      loadingData: {
        time1: '',
        time2: '',
        id: ''
      },
      disabledDate: ''

    }
  },
  watch: {
    '$store.state.home.headerAction' () {
      this.resetData()
      let routerName = this.$router.currentRoute.name
      if (routerName === 'GoShop') {
        this.activitiesDataList()
      }
    }
  },
  created () {
    this.disabledDate = disabledDate
  },
  mounted () {
    this.activitiesDataList()
    var date = new Date()
    date = date.setDate(date.getDate() - 1)
    var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
    this.crossDate = dateTime
    this.crossDateTwo = dateTime
  },
  methods: {
    // 获取业态
    activitiesDataList () {
      var that = this
      that.activitiesType = []
      var objD = {
        text: '所有业态',
        value: 0
      }
      that.activitiesType.push(objD)
      let propertyId = this.$store.state.home.headerAction
      activitiesList({ entity: 52, property_id: propertyId }).then(res => {
        _.forIn(res.data.data, function (val, key) {
          var obj = {}
          obj.text = val
          obj.value = key
          that.activitiesType.push(obj)
        })
        this.paramsPrepare()
      })
    },
    // 点击查询
    paramsPrepare () {
      var that = this

      var time1 = moment(that.crossDate[0]).format('YYYY-MM-DD') + ',' +
      moment(that.crossDate[1]).format('YYYY-MM-DD')
      var time2
      if (that.selectType === 0) {
        time2 = ''
      } else {
        time2 = moment(that.crossDateTwo[0]).format('YYYY-MM-DD') + ',' +
        moment(that.crossDateTwo[1]).format('YYYY-MM-DD')
      }
      var id = that.activities === 0 ? '' : that.activities
      that.loadingData.time1 = time1
      that.loadingData.time2 = time2
      that.loadingData.id = id
      let propertyId = this.$store.state.home.headerAction
      goShopTen({ time1: time1, time2: time2, industry_id: id, property_id: propertyId }).then(res => {
        that.isList = true
        that.graphData.chartOptions.xaxis.categories = []
        that.graphData.series = []
        that.goTableList = []
        that.isData = false
        that.goName = []
        let sortarr = []
        that.goName.push('时间')
        var data = res.data.data
        var name = Object.keys(data)
        name.forEach(e => {
          let keyVal = Object.entries(data[e])
          let sortedData = keyVal.sort((a, b) => b[1] - a[1])
          sortarr.push(sortedData)
        })
        sortarr[0].map(function (d) {
          that.graphData.chartOptions.xaxis.categories.push(d[0])
          that.goName.push(d[0])
        })

        sortarr.map(function (list, index) {
          var obj = {}
          obj.name = name[index].replace(/,/g, ' - ')
          obj.data = []

          var tableObj = {}
          tableObj.name = name[index].replace(/,/g, ' - ')
          tableObj.percentList = []

          list.map(function (v) {
            obj.data.push(NP.times(v[1], 100))
            v[1] === 0 ? tableObj.percentList.push('0%') : tableObj.percentList.push(NP.times(v[1], 100) + '%')
          })
          that.graphData.series.push(obj)
          that.goTableList.push(tableObj)
        })
        if (that.$refs.graphLine) {
          that.$refs.graphLine.updateOptions({
            xaxis: { categories: that.graphData.chartOptions.xaxis.categories }
          })
          if (that.graphData.chartOptions.xaxis.categories.length < 2) {
            that.graphData.chartOptions.plotOptions.bar.columnWidth = '15%'
            that.$refs.graphLine.updateOptions({ plotOptions: that.graphData.chartOptions.plotOptions })
          } else if (that.graphData.chartOptions.xaxis.categories.length < 5) {
            that.graphData.chartOptions.plotOptions.bar.columnWidth = '20%'
            that.$refs.graphLine.updateOptions({ plotOptions: that.graphData.chartOptions.plotOptions })
          } else {
            that.graphData.chartOptions.plotOptions.bar.columnWidth = '70%'
            that.$refs.graphLine.updateOptions({ plotOptions: that.graphData.chartOptions.plotOptions })
          }
        }
      })

      try {
        let date, type
        if (that.selectType === 0) {
          type = '无对比'
          date = time1
        } else {
          type = '时间对比'
          date = [time1, time2]
        }
        let val = that.activitiesType.filter(item => {
          return that.activities == item.value
        })
        window.TDAPP.onEvent(this.$route.meta.pageTitle + '页面', '进店率TOP10查询', { '对比方式': type, '时间段': date, '业态选择': val[0].text })
      } catch (error) {
        console.log(this.$route.meta.pageTitle + '页面-' + '进店率TOP10查询' + '埋点error:' + error)
      }
    },
    // 重置数据
    resetData () {
      var date = new Date()
      date = date.setDate(date.getDate() - 1)
      var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
      this.crossDate = dateTime
      this.selectType = 0
      this.activities = this.activitiesType[0].value

      try {
        window.TDAPP.onEvent(this.$route.meta.pageTitle + '页面', '进店率TOP10重置', {})
      } catch (error) {
        console.log(this.$route.meta.pageTitle + '页面-' + '进店率TOP10重置-埋点error:' + error)
      }
    },
    // 点击图标
    iconClick (index) {
      if (index === 2) {
        var time1 = this.loadingData.time1
        var time2 = this.loadingData.time2
        var id = this.loadingData.id
        let propertyId = this.$store.state.home.headerAction
        if (time1 != '') {
          goShowFlow({
            time1: time1,
            time2: time2,
            industry_id: id,
            property_id: propertyId
          }).then(res => {
            this.dowloadXlsx(res)
          })
        }
        try {
          window.TDAPP.onEvent(this.$route.meta.pageTitle + '页面', '进店率TOP10排行' + '下载', { })
        } catch (error) {
          console.log(this.$route.meta.pageTitle + '页面-' + '进店率TOP10排行' + '下载-埋点error:' + error)
        }
      } else {
        this.iconIndex = index
      }
    },
    // 下载文件
    dowloadXlsx (res) {
      let date = new Date()
      const blob = new Blob([res.data])
      let name = '进店率分析商铺排行'
      let fileName = name + moment(date).format('YYYYMMDDHHmmss') + '.xls'
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)// 释放URL 对象
      document.body.removeChild(elink)
      // this.$vs.loading.close()
      // this.$store.commit('loadingState', false)
    }

  }
}
</script>
<style lang="less">
   .shop10-picker{
    display: inline-block;
    margin-bottom: 20px;
    overflow: hidden;
    float: left;
    margin-right: 20px;
    .con-select{
      clear: none;
    }
    .ivu-input{
      font-size: 14px;
      height: 43px;
      border: 1px solid rgba(0, 0, 0, .2);
      font-family: "source_han_sans_cn", "Roboto", sans-serif;
    }
    .shopSelect{
      float: left;
      width: 230px;
      margin-left: 30px;
    }
    .ivu-input-suffix {
      i{
      height: 43px;
      width: 40px;
      line-height: 43px;
      }
    }
    .ivu-date-picker .ivu-select-dropdown{
      z-index:51100
    }
  }
</style>
<style lang="less" scoped>
.go-shop{
    width: 100%;
    height: auto;
    .go-time-selector{
        width: 100%;
        height: auto;
        background-color: #fff;
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);
        padding: 1.5rem;
        border-radius: .5rem;
        h1{
          font-size: 18px;
          font-weight:400;
          color:rgba(62,60,60,1);
          margin-bottom: 20px;
        }
        .go-shop-activities{
            display: inline-block;
            width: auto;
            height: auto;
            .con-select{
                display: inline-block;
            }
        }
        .cross-submit{
            display:inline-block;
            padding: 0.75rem 2rem;
            text-align:center;
            border-radius: 6px;
            background-color: #00A0E9;
            border:1px solid #00A0E9;
            color: #fff;
            font-size: 1rem;
            margin-left:30px;
            cursor: pointer;
            &:hover{
                box-shadow: 0 8px 25px -8px #00A0E9;
            }
        }
        .cross-reset{
          display:inline-block;
          padding: 0.75rem 2rem;
          text-align:center;
          border-radius: 6px;
          border:1px solid #00A0E9;
          background-color: #fff;
          color: #00A0E9;
          font-size: 1rem;
          margin:  0px 0 0px 30px;
          cursor: pointer;
          &:hover{
              box-shadow: 0 8px 25px -8px #00A0E9;
          }
        }
    }
    .go-shop-chart-list{
        margin-top: 20px;
        background-color: #fff;
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);
        border-radius: .5rem;
        position: relative;
        height: 470px;
        overflow: hidden;
        padding-top: 41px;
        .noData{
          width: 100%;
          height: 100%;
          line-height: 100%;
          font-size: 24px;
          display:flex;
          align-items: center;
          justify-content: center;
        }
        .go-shop-time-icon{
          display: inline-block;
          position: absolute;
          left: 19px;
          top: 20px;
          right: 0;
          overflow: hidden;
          z-index: 10;
          p{
            margin-top: 20px;
            float: right;
            margin-right: 50px;
            span{
              margin-left: 10px;
              cursor: pointer;
            }
          }
          span:nth-child(1){
            width: 10%;
            font-size:18px;
          }
        }
        .shop-line{
          margin-top:20px;
        }
        .shop-line,.shop-table{
            transition: none!important;
            transform: translateY(100%);
        }
        .shop-table{
            height: 428px;
            box-shadow: none;
            overflow: auto;
        }
        .lineAction{
            transform: translateY(0%)!important;
        }
        .tableAction{
            transform: translateY(-100%)!important;
        }
    }
}
</style>
