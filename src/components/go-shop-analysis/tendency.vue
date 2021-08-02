<template>
  <div class="go-shop">
    <div class="selector-container bg-white box-card">
      <!-- <h1>趋势分析</h1> -->
      <div class="flex-center">
        <DatePicker
          type="daterange"
          v-model="crossDate"
          placement="bottom-end"
          :options="disabledDate"
          placeholder="选择日期"
          class="w-select"
        ></DatePicker>
        <vs-select
          class="w-select m-l-20"
          autocomplete
          v-model="selectType">
          <vs-select-item
            v-for="(item,index) in typeListCom"
            :value="item.value"
            :text="item.text"
            :key="index"
          />
        </vs-select>
        <DatePicker
          type="daterange"
          v-model="crossDateTwo"
          placement="bottom-end"
          :options="disabledDate"
          placeholder="选择日期"
          class="w-select m-l-20"
          v-if="selectType == 1"
        ></DatePicker>
      </div>
      <div class="flex-center">
        <el-cascader
          collapse-tags
          class="w-select"
          v-model="activities"
          :props="{ multiple: true,expandTrigger:'hover' }"
          :options="activitiesType">
        </el-cascader>
        <Button size="large" class="m-l-20" type="primary" @click="paramsPrepare">{{ $t('查询') }}</Button>
        <Button size="large" class="m-l-20" @click="resetData">{{ $t('重置') }}</Button>
      </div>
    </div>
    <div class="go-shop-chart-list"  >
      <div class="go-shop-time-icon">
        <span>{{ $t('进店率趋势分析') }}</span>
        <p class="flex-center">
          <span :key="index" v-for="(icon,index) in iconList" v-on:click="iconClick(icon.value)">
            <icons
              :title="iconTitleCom[icon.type]"
              :type="icon.type"
              :size="20"
              :color="iconIndex === icon.value ? iconColor :'#9D9D9DFF'"
            ></icons>
          </span>
        </p>
      </div>
        <div v-if="isData" class="noData">{{ $t('holder.暂无数据') }}</div>
        <vue-apex-charts
      v-bind:class="{ lineAction: iconIndex == 1 }"
        class=" tendencyBar"
        ref="graphLine"
        height='90%'
        width="100%"
        id='tendencyLine'
        type="line"
        :options="lineData.chartOptions"
        :series="lineData.series"
      ></vue-apex-charts>
      <vue-apex-charts
        v-bind:class="{ barAction: iconIndex == 0 }"
        class="tendencyLine"
        ref="graphBar"
        height='90%'
        width="100%"
        type="bar"
        :options="graphData.chartOptions"
        :series="graphData.series"
      ></vue-apex-charts>
      <table-default
        v-bind:class="{ tableAction: iconIndex == 2 }"
        class="tendencyTable"
        :tableTitle='goTitle'
        :tableName='goName'
        :tableList='goTableList'
      ></table-default>
    </div>
    <alert
      v-if="isAlert"
      @closeAlert ='closeAlert'
      @alertConfirm ='alertConfirm'
      :alertText='alertText'
    ></alert>
  </div>
</template>
<script>
import TableDefault from '@/views/ui-elements/table/TableDefault.vue'
import alert from '@/components/alert.vue'
import VueApexCharts from 'vue-apexcharts'
import { getBussinessTree, getBussinessCommon } from '@/api/passenger'
import { getCascadeList } from '@/api/passenger.js'
import { goShopTrend } from '@/api/analysis'
import { goShowFlowTend ,exportEx} from '@/api/home.js'
import { disabledDate,downloadEx } from '@/libs/util.js'
import moment from 'moment'
import NP from 'number-precision'
import _ from 'lodash'
export default {
  name: 'goShop',
  components: {
    TableDefault,
    VueApexCharts,
    alert

  },
  data () {
    return {
      disabledDate: '',
      isHtml: false,
      isList: false,
      isData: true,
      activities: [],
      activitiesType: [],
      crossDate: [],
      crossDateTwo: [],
      selectType: 0,
      selectAll: 0,
      typeList: [],
      iconList: [
        {
          type: '62',
          color: '#9D9D9DFF',
          value: 0
        }, {
              type: 'zhexiantu',
              color: '#9D9D9DFF',
              value: 1
          },
        {
          type: 'biaoge-copy',
          color: '#9D9D9DFF',
          value: 2
        },
        {
          type: 'daoru',
          color: '#9D9D9DFF',
          value: 3
        }
      ],
      iconTitle: {},
      iconIndex: 0,
      iconColor: 'rgb(34, 128, 215)',
      goTitle: '',
      goName: [],
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
              columnWidth: '15%',
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
          legend:{
              height:30
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
                return parseInt(value) + '%'
              }
            },
            tickAmount: 5
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
      lineData: {
        chartOptions: {
          chart: {
            type: 'line',
            toolbar: {
              show: false,
              tools: {
                download: false
              }
            }
          },
          title: {
            text: ''
          },
          stroke: {
            // curve: 'smooth',
            width: 2
          },
          dataLabels: {
            enabled: false
          },
          colors: ['#33B3ED', '#2BD9CF', '#94E2FF', '#FBAB40', '#8D82F0', '#E8585A'],
          yaxis: {
            title: {
              text: '百分比（%）'
            },
            tickAmount: 5,
            // min: 0,
            labels: {
              show: true,
              formatter: (value) => {
                return parseInt(value) + '%'
              }
            }
          },
           legend:{
              height:30
            },
          xaxis: {
            labels: {
              offsetX: 0 // 720
            },
            axisBorder: {
              show: false
            },
            categories: []
          },
          tooltip: {
            shared:false,
            y: {
              formatter: function (val) {
                return val + '%'
              }
            }
          },
          markers: {
            size: 5,
            hover: {
              sizeOffset: 2
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
      isAlert: false,
      alertText: {
        title: '',
        text: '',
        bg: '',
        confirm: false
      },
    }
  },
  computed: {
    typeListCom() {
      this.typeList = [
        {
          text: this.$t('无对比'),
          value: 0
        },
        {
          text: this.$t('时间对比'),
          value: 1
        }
      ]
      return this.typeList
    },
    iconTitleCom() {
      this.iconTitle = {
        'zhexiantu': this.$t('折线图'),
        '62': this.$t('柱状图'),
        'biaoge-copy': this.$t('详细数据'),
        'xiangxia': this.$t('查看全部实体排行'),
        'ditu': this.$t('出入口客流'),
        'fenxi': this.$t('饼状图'),
        'chakan': this.$t('查看所有'),
        'daoru': this.$t('下载')
      }
      return this.iconTitle
    }
  },
  activated () {
    // this.isHtml = true
  },
  deactivated () {
    // this.isHtml = false
  },
  watch: {
    '$store.state.home.headerAction' () {
      this.resetData()
      let routerName = this.$router.currentRoute.name
      if (routerName === 'GoShop') {
        this.allZoneList()
      }
    },
    '$store.state.home.bussinessDict' () {
      this.allZoneList()
    }
  },
  created () {
    this.disabledDate = disabledDate
  },
  mounted () {
    var date = new Date()
    date = date.setDate(date.getDate() - 1)
    var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
    this.crossDate = dateTime
    this.crossDateTwo = dateTime
    this.allZoneList()
  },
  methods: {
    // 获取 所有 商铺 楼层 出入口 数据
    allZoneList () {
      let propertyId = this.$store.state.home.headerAction
      getCascadeList({ property_id: propertyId }).then(res => {
        if (res.data.code == 200) {
          let data = res.data.data
            this.activitiesType = []
            let newData = Object.keys(data)
            newData.forEach(list => {
                let obj = {}
                obj.value = list
                obj.label = list
                obj.children = []
                data[list].forEach(shop => {
                    let shopObj = {}
                    shopObj.value = shop.id
                    shopObj.label = shop.name
                    shopObj.name = shop.name
                    obj.children.push(shopObj)
                })
                this.activitiesType.push(obj)
            })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 点击查询
    paramsPrepare () {
      var that = this
      let range, rangeOne, rangeTwo, time2

      var time1 = moment(that.crossDate[0]).format('YYYY-MM-DD') + ',' +
      moment(that.crossDate[1]).format('YYYY-MM-DD')
      rangeOne = this.gotInnerRange(that.crossDate)
      // 判断是否是时间对比
      if (that.selectType == 0) {
        time2 = ''
        rangeTwo = ''
      } else {
        time2 = moment(that.crossDateTwo[0]).format('YYYY-MM-DD') + ',' +
        moment(that.crossDateTwo[1]).format('YYYY-MM-DD')
        rangeTwo = this.gotInnerRange(that.crossDateTwo)
      }
      // 时间类型判断
      if (rangeTwo == '') range = rangeOne
      else if (rangeTwo == 'Month' || rangeOne == 'Month') range = 'Month'
      else range = 'Date'
      // 提示
      if (that.activities.length === 0) {
        this.alertShow('商铺不能为空，请选择商铺')
        return false
      }
      if (that.activities.length > 25) {
        this.alertShow('商铺个数不能超过25个，请重新选择')
        return false
      }
      if(time1===time2){
        this.alertShow('对比时间相等,请重新选择时间')
        return false
      }
      var listId = _.clone(that.activities)
      let allId = []
      listId.map(val => { allId.push(val[1]) })
      var bzid = allId.join(',')
      that.loadingData.time1 = time1
      that.loadingData.time2 = time2
      that.loadingData.id = bzid
      goShopTrend({ time1: time1, time2: time2, bzid: bzid, range: range }).then(res => {
        that.isList = true
        that.lineData.chartOptions.xaxis.categories = []
        that.lineData.series = []
        that.graphData.chartOptions.xaxis.categories = []
        that.graphData.series = []
        that.isData = false
        that.goName = []
        that.goTableList = []
        that.goName.push('时间')
        var data = res.data.data
        setTimeout(() => {
          if (that.selectType === 0) {
            that.noComparison(data)
          } else {
            that.comparison(data, range)
          }
        });
      
      })
    },
    // 无时间对比 数据处理
    noComparison (data) {
      let that = this
      if (data.length == 0) return
      let date1data = data[Object.keys(data)[0]]// 时间1，时间2
      let date1Val = Object.values(date1data)[0]// 店铺1 店铺2
      date1Val.map(e => {
        that.lineData.chartOptions.xaxis.categories.push(e.date)
        that.graphData.chartOptions.xaxis.categories.push(e.date)
      })
      var allData = []
      Object.values(date1data).forEach(function (shopData) {
        var obj = {}
        obj.name = shopData[0].name
        obj.data = []
        shopData.forEach(function (d) {
          var size = d.rate === 0 ? 0: NP.times(d.rate, 100)
          obj.data.push(Number(size))
        })
        allData.push(shopData)
        that.lineData.series.push(obj)
        that.graphData.series.push(obj)
      })
      // let maxLenght = _.maxBy(that.lineData.series,(val=>{
      //   return val.data.length
      // })).data
      // that.lineData.series.forEach((val,vindex)=>{
      //   maxLenght.forEach((list,index)=>{
      //     if(!val.data[index]&&val.data[index]!==0) val.data.push(10)
      //   })
      // })
      // that.graphData.series.forEach((val,vindex)=>{
      //    maxLenght.forEach((list,index)=>{
      //     if(!val.data[index]&&val.data[index]!==0) val.data.push(10)
      //   })
      // })
      if (that.$refs.graphLine) {
        that.$refs.graphLine.updateOptions({
          xaxis: { categories: that.lineData.chartOptions.xaxis.categories }
        })
      }

      var time1 = moment(that.crossDate[0]).format('YYYY-MM-DD')
      var time2 = moment(that.crossDate[1]).format('YYYY-MM-DD')
      setTimeout(() => {
        var div = document.getElementById('tendencyLine')
        var width
        if (div) width = div.offsetWidth
        var number = (width / 2).toFixed(2) - 50
        // 更新 chart x 轴数据 以及控制柱状图大小
        if (time1 == time2) that.upDateLineX(number, false)
        else that.upDateLineX(0, true)
        if (that.$refs.graphBar) this.upDateBarX()
      })

      // 表格数据
      allData.forEach(function (n) { that.goName.push(n[0].name+' ( % ) ') })
      allData[0].forEach(function (d, index) {
        var tableObj = {}
        tableObj.name = d.date
        tableObj.percentList = []
        allData.forEach(function (l, allIndex) {
          var d = allData[allIndex][index] ? allData[allIndex][index].rate : 0
          var size = d === 0 ? '0' : NP.times(d, 100) + ''
          tableObj.percentList.push(size)
        })
        that.goTableList.push(tableObj)
      })
    },
    // 时间对比 数据处理
    comparison (data, type) {
      let that = this
      let date1 = data[Object.keys(data)[0]]// 时间1，时间2
      let date2 = data[Object.keys(data)[1]]// 时间1，时间2

      let value1 = Object.values(date1)[0].length
      let value2 = Object.values(date2)[0].length
      let allData
      if (value1 > value2) allData = Object.values(date1)[0]
      else allData = Object.values(date2)[0]
      let dateType
      type == 'Month' ? dateType = '月' : dateType = '天'
      allData.map(function (d, index) {
        var size = Number(index) + 1
        var num = '第' + size + dateType
        that.lineData.chartOptions.xaxis.categories.push(num)
        that.graphData.chartOptions.xaxis.categories.push(num)
      })
      _.forIn(data, function (val, key) {
        _.forIn(val, function (v, k) {
          var obj = {}
          obj.name = v[0].name + key.replace(/,/g, ' - ')
          obj.data = []
          v.map((d, index) => { obj.data.push(NP.times(d.rate, 100)) })
          that.lineData.series.push(obj)
          that.graphData.series.push(obj)
        })
      })
      let maxLenght = _.maxBy(that.lineData.series,(val=>{
        return val.data.length
      })).data
      that.lineData.series.forEach((val,vindex)=>{
        maxLenght.forEach((list,index)=>{
          if(!val.data[index]&&val.data[index]!==0) val.data.push(0)
        })
      })
      that.graphData.series.forEach((val,vindex)=>{
         maxLenght.forEach((list,index)=>{
          if(!val.data[index]&&val.data[index]!==0) val.data.push(0)
        })
      })
      that.$refs.graphLine.updateOptions({
        xaxis: { categories: that.lineData.chartOptions.xaxis.categories }
      })
      var time1 = moment(that.crossDate[0]).format('YYYY-MM-DD')
      var time2 = moment(that.crossDate[1]).format('YYYY-MM-DD')
      var time3 = moment(that.crossDateTwo[0]).format('YYYY-MM-DD')
      var time4 = moment(that.crossDateTwo[1]).format('YYYY-MM-DD')
     
        var width = document.getElementById('tendencyLine').offsetWidth
        var number = (width / 2).toFixed(2) - 50
        // 更新 chart x 轴数据 以及控制柱状图大小
        if (time1 == time2 && time3 == time4) that.upDateLineX(number, false)
        else that.upDateLineX(0, true)
        if (that.$refs.graphBar) this.upDateBarX()
      
      // 表格数据
      _.forIn(data, function (value, key) {
        _.forIn(value, function (listValue, listKey) {
          let time = key.split(',')[0]===key.split(',')[1]?key.split(',')[0]:key
          that.goName.push(listValue[0].name + time+' ( % ) ')
        })
      })
      if (value1 > value2) {
        var list = Object.values(date1)
        var listTwo = Object.values(date2)
        list[0].map(function (listData, listIndex) {
          var tableObj = {}
          var size = listIndex + 1
          tableObj.name = '第' + size + dateType
          tableObj.percentList = []
          list.map(function (all, allIdnex) {
            var d = list[allIdnex][listIndex].rate
            var size = d === 0 ? '0' : NP.times(d, 100) + ''
            tableObj.percentList.push(size)
          })
          list.map(function (all, allIdnex) {
            var td = listTwo[allIdnex][listIndex]
            var sizeT
            if (td) {
              sizeT = td === 0 ? '0' : NP.times(td.rate, 100) 
            } else {
              sizeT = ' '
            }
            tableObj.percentList.push(sizeT)
          })
          that.goTableList.push(tableObj)
        })
      } else {
        var list = Object.values(date2)
        var listTwo = Object.values(date1)
        list[0].map(function (listData, listIndex) {
          var tableObj = {}
          var size = listIndex + 1
          tableObj.name = '第' + size + dateType
          tableObj.percentList = []
          list.map(function (all, allIdnex) {
            var td = listTwo[allIdnex][listIndex]
            var sizeT
            if (td) {
              sizeT = td.rate === 0 ? '0' : NP.times(td.rate, 100)
            } else {
              sizeT = ' '
            }
            tableObj.percentList.push(sizeT)
          })
          list.map(function (all, allIdnex) {
            var d = list[allIdnex][listIndex].rate
            var size = d === 0 ? '0' : NP.times(d, 100)
            tableObj.percentList.push(size)
          })
          that.goTableList.push(tableObj)
        })
      }
    },
    // 重置数据
    resetData () {
      var date = new Date()
      date = date.setDate(date.getDate() - 1)
      var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
      this.crossDate = dateTime
      this.selectType = 0;
      this.activities = [];
    },
    // 更新线 x 轴
    upDateLineX (number, state) {
      let that = this
      that.lineData.chartOptions.xaxis.labels.offsetX = number
      if (that.$refs.graphLine) {
        that.$refs.graphLine.updateOptions({
          xaxis: { offsetX: that.lineData.chartOptions.xaxis.labels.offsetX }
        })
        that.lineData.chartOptions.xaxis.axisBorder.show = state
        that.$refs.graphLine.updateOptions({
          xaxis: { show: that.lineData.chartOptions.xaxis.axisBorder.show }
        })
      }
    },
    // 更新柱状图 x 轴
    upDateBarX () {
      let that = this
      that.$refs.graphBar.updateOptions({
        xaxis: { categories: that.graphData.chartOptions.xaxis.categories }
      })
      if (that.graphData.chartOptions.xaxis.categories.length < 3&&that.lineData.series.length<3) {
        that.graphData.chartOptions.plotOptions.bar.columnWidth = '10%'
      } else if (that.graphData.chartOptions.xaxis.categories.length < 5&&that.lineData.series.length<5) {
        that.graphData.chartOptions.plotOptions.bar.columnWidth = '25%'
      }  else if (that.graphData.chartOptions.xaxis.categories.length < 10&&that.lineData.series.length<10) {
          that.graphData.chartOptions.plotOptions.bar.columnWidth = '55%'
      } else if (that.graphData.chartOptions.xaxis.categories.length < 15&&that.lineData.series.length<15) {
          that.graphData.chartOptions.plotOptions.bar.columnWidth = '65%'
      }else {
        that.graphData.chartOptions.plotOptions.bar.columnWidth = '70%'
        
      }
        that.$refs.graphBar.updateOptions({ plotOptions: that.graphData.chartOptions.plotOptions })
    },
    // 图标点击
    iconClick (index) {
      // 下载文件
      if (index === 3) {
          let columns = [], data = []
          this.goName.forEach((list, index) => {
              if (index === 0) {
                  columns.push({ title: '时间', key: 'date' })
              } else {
                  columns.push({ title: list, key: 'type' + index })
              }
          })
          this.goTableList.forEach((list, index) => {
              let obj = {}
              columns.forEach((value, vIndex) => {
                  if (vIndex === 0) {
                      obj[value.key] = list.name
                  } else {
                      obj[value.key] = list.percentList[vIndex - 1]
                  }
              })
              data.push(obj)
          })
          downloadEx(exportEx,'进店率趋势分析',[columns,data])
      } else {
        // 切换
        this.iconIndex = index
      }
    },
    alertConfirm () { this.isAlert = false },
    closeAlert () { this.isAlert = false },
    shopActionList (value) {
      var that = this
      let totalLength = that.activitiesType.length
      if ((totalLength - value.length) == 1 && value.indexOf(0) != -1) {
        this.selectAll = 0
        that.activities = _.filter(value, function (e) {
          return e != 0
        })
      }
      if (this.selectAll == 1 && value.indexOf(0) == -1) {
        this.selectAll = 0
        that.activities = []
      }
      if (_.last(value) == 0) {
        let arr = that.activitiesType.map(function (l) {
          return l.value
        })
        this.selectAll = 1
        that.activities = arr
      }
    },
    alertShow(text){
      this.isAlert = true
      this.alertText.bg = '#00A0E9'
      this.alertText.title = '趋势分析'
      this.alertText.text = text
      this.alertText.confirm = false
    },
    gotInnerRange (date) {
      const [start, end] = date
      let startTime = moment(start)
      let endTime = moment(end)
      let diffDays = moment.duration(endTime.diff(startTime)).asDays()
      let innerRange = ''
      if (diffDays < 60) innerRange = 'Date'
      else innerRange = 'Month'
      return innerRange
    }
  }
}
</script>
<style lang="less">
.go-shop-activities input{
  width: 230px;
}
.tendency-bottom{
  button{
    font-weight: normal!important;
  }
}
.tendency-picker{
  margin-bottom: 20px;
  overflow: hidden;
  .con-select{
    clear: none;
  }
  .ivu-input{
    font-size: 14px;
    border: 1px solid rgba(0, 0, 0, .2);
    font-family: "source_han_sans_cn", "Roboto", sans-serif;
  }
  .selectExample{
    float: left;
    width: 230px;
    margin-left: 30px;
  }
  .vs-select--input{
    height: 43px;
  }
  .ivu-input{
    height:43px;
    font-family: "source_han_sans_cn", "Roboto", sans-serif;
  }
  .ivu-input-suffix {
    i{
    height: 43px;
    width: 40px;
    line-height: 43px;
    }
  }
  .ivu-date-picker .ivu-select-dropdown{
    z-index:90000
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
        padding: 27px 0 18px 19px;
        border-radius: .5rem;
        h1{
          font-size: 18px;
          font-weight:400;
          color:rgba(62,60,60,1);
          margin-bottom: 20px;
        }
        .go-shop-activities{
          width: 100%;
          height: auto;
          .con-select{
            display: inline-block;
          }
        }
        .cross-submit{
          display:inline-block;
          padding: 0.55rem 2rem;
          text-align:center;
          border-radius: 6px;
          background-color: #00A0E9;
          border:1px solid #00A0E9;
          color: #fff;
          font-size: 1rem;
          margin:  0px 0 0px 30px;
          cursor: pointer;
          &:hover{
            box-shadow: 0 8px 25px -8px #00A0E9;
          }
        }
        .cross-reset{
          display:inline-block;
          padding: 0.55rem 2rem;
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
        height: 490px;
        overflow: hidden;
        padding-top: 40px;
        padding-bottom:30px;
        .go-shop-time-icon{
          display: inline-block;
          position: absolute;
          left: 19px;
          top: 20px;
          right: 0;
          overflow: hidden;
          z-index: 1;
  			font-size: 18px;
          p{
            float: right;
            margin-top: 20px;
            margin-right: 50px;
            span{
              margin-left: 10px;
              cursor: pointer;
            }
          }
        }
        .noData{
          width: 100%;
          height: 100%;
          line-height: 100%;
          font-size: 24px;
          display:flex;
          align-items: center;
          justify-content: center;
        }
        .tendencyLine,.tendencyBar,.tendencyTable{
          transform: translateY(110%);
          transition: none!important;
        }
        .tendencyTable{
          height: 428px;
          box-shadow: none;
          overflow: auto;
        }
        .lineAction{
          transform: translateY(10%);
        }
        .barAction{
          transform: translateY(-90%);
        }
        .tableAction{
          transform: translateY(-180%);
        }
    }
}
</style>
