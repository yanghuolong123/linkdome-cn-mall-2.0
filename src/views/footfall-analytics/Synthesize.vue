<template>
  <div class="synthesize">

      <div class="synthesize-selector">
          <div class="picker">
			<DatePicker
                type="daterange"
                placement="bottom-end"
                :options="disabledDate"
                placeholder="选择日期"
                v-model="dateTime"
                style='width:230px;float:left;'
            ></DatePicker>
            <Select v-model="currentStore" style="width:200px">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

          </div>
          <div class="activities">
              <div class="submit" v-on:click="paramsPrepare">查询</div>
              <!-- <div class="reset" v-on:click="resetData">重置</div> -->
          </div>
    </div>
    <div class="synthesize-real-time">
        <Row type="flex" justify="space-between">
            <Col span="12">
            <div class="real-left">
                <img ref="leftImg" :src="imgUrl" alt="">
                <div class="box">
                    <div class="left-box" :key="index" v-for="(item,index) in leftData">
                        <span :style="{backgroundColor:item.iconBg}">
                            <icons :type="item.icon" :size='24'  :color="item.iconColor"></icons>
                        </span>
                        <p>{{item.number}} <span v-if="item.time">{{item.time}}</span></p>
                        <div>{{item.type}}</div>
                    </div>
                </div>
            </div>
            </Col>
            <Col span="12" style="height:100%">
                <div class="real-right">
                    <ul>
                        <li :key="index" v-for="(item,index) in rightData">
                            <div class="right-icon" :style="{backgroundColor:item.iconBg}">
                                <icons :type="item.icon" :size='24'  :color="item.iconColor"></icons>
                            </div>
                            <div class="right-data" >
                                <p>{{item.number}}</p>
                                <span v-if="item.time">{{item.time}}</span>
                            </div>
                            <div class="right-type">
                                {{item.type}}
                            </div>
                            <div class="right-sequential" v-if="item.ringRatio">
                                <p>
                                    环比 {{item.ringRatio}}
                                    <span :class="{iconStyle:item.isRing}">
                                        <icons  type="xiala" color="#F64F61"></icons>
                                    </span>
                                </p>
                                <p>
                                    同比 {{item.lastRatio}}
                                    <span :class="{iconStyle:item.isLast}">
                                        <icons  type="xiala" color="#F64F61"></icons>
                                    </span>
                                </p>
                            </div>

                        </li>

                    </ul>
                </div>
            </Col>
        </Row>
    </div>
    <div class="synthesize-trend">
        <Trend style="margin-top:20px"
            :time1="trendTime"
            :innerRange="innerRange"
            :bzids="currentStore"
            :indicatorData="trendIndicators"
            :istotal='false'>
        </Trend>
    </div>
    <!-- <div class="synthesize-chart">
        <Row type="flex" justify="space-between" >
            <Col span="12">
            <div class="age-chart">
                <age-chart :series='ageSeries' :labels='ageLabels'></age-chart>
            </div>

            </Col>
            <Col span="12">
            <div class="gender-chart">
                <gender-chart :series='genderSeries' :labels='genderLabels'></gender-chart>
            </div>
            </Col>
        </Row>
    </div> -->
    <customer-analytics :data="customAnalytics">
        <template slot-scope="{item}">
          <customer-charts :labels="item.labels"
                           :series="item.series"
                           :type="item.type"
                           :title="item.title"
						   tooltipUnit='人'
                           :height="item.height"
                           @tableChage="shopTabChange">
						   <export-menu  slot="export"
                         @onchange="genderExportBiztop(item.title)"></export-menu>
          </customer-charts>
        </template>
      </customer-analytics>
  </div>
</template>
<script>

import { Trend, CustomerAnalytics } from '../home'
import customerNameDict from '../home/seriesDict'
import exportMenu from '@/views/operation/components/ExportMenu.vue'
import CustomerCharts from '_c/common/CopyChartsTabs'
import hexToRgba from 'hex-to-rgba'
import { disabledDate } from '@/libs/util.js'
import salesDict from '@/views/home/components/salesIndicatorDict.js'
import VueApexCharts from 'vue-apexcharts'
import AgeChart from '@/components/charts/ageChart.vue'
import GenderChart from '@/components/charts/genderChart.vue'
import moment from 'moment'
import Bus from '@/libs/bus.js'
import { getEntityFlow, synthesizeRight, exportEx } from '@/api/home.js'
import { gotInnerRange } from '@/libs/util'
import _ from 'lodash'
export default {
  name: 'synthesize',
  components: {
    Trend,
    VueApexCharts,
    AgeChart,
    GenderChart,
    CustomerAnalytics,
    CustomerCharts,
    exportMenu
  },
  data () {
    return {
      intervalId: '',
      currentStore: '',
      dateTime: '',
      cityList: [],
      ageSeries: [],
      ageLabels: [],
      disabledDate: '',
      genderSeries: [0, 0],
      footFallTypeRes: {},
	  genderLabels: ['男性', '女性'],
	  leftData: [
		  {
          number: 0,
          icon: 'enter_total',
          type: '今日实时数据(人次)',
          iconColor: '#857aef',
          iconBg: hexToRgba('#857aef', '0.2')
		  },
		  {
          umber: 0,
          icon: 'highest',
          type: '今日客流峰值(人次)',
          iconColor: '#e8585a',
          iconBg: hexToRgba('#e8585a', '0.2'),
          time: ''
		  }
	  ],
      imgUrl: 'https://dn-project-from-dn.oss-cn-beijing.aliyuncs.com/kuerle_huijia/image/kuerle.jpg',
      rightData: [
        {
          icon: 'enter_total',
          number: 0,
          type: '总客流',
          basisData: '0%',
          chainData: '0%',
          iconColor: '#857aef',
          iconBg: hexToRgba('#857aef', '0.2'),
          isRing: true,
          isChain: true
        },
        {
          icon: 'highest',
          number: 0,
          type: '客流峰值',
          time: '00:00 - 00:59',
          iconColor: '#e8585a',
          iconBg: hexToRgba('#e8585a', '0.2')
        },
        {
          icon: 'avg',
          number: 0,
          type: '平均客流量',
          basisData: '0%',
          chainData: '0%',
          iconColor: '#1dd9d1',
          iconBg: hexToRgba('#1dd9d1', '0.2'),
          isBasis: true,
          isChain: true
        },
        {
          icon: 'youxiaokeliu',
          number: 0,
          type: '有效客流',
          iconColor: '#2bd9cf',
          iconBg: hexToRgba('#2bd9cf', '0.2')
        }
      ],
      innerRange: '',
      customChecklist: {
        new_old_proportion: {
          name: '新老顾客占比',
          chartType: ['donut']
        },
        vip_proportion: {
          name: 'VIP顾客占比',
          chartType: ['radialBar']
        },
        arrival_distribution: {
          name: '到店次数',
          chartType: ['pie']
        },
        age_distribution: {
          name: '年龄分布',
          chartType: ['bar']
        },
        gender_propotion: {
          name: '性别分布',
          chartType: ['radialBar']
        }
	  },
	  downloadName: '',
	   obj1: [],
      obj2: [],
      obj3: [],
      obj4: []

    }
  },
  created () {
    this.disabledDate = disabledDate
  },
  computed: {
    trendIndicators () {
      let footfallYaxis = {
        enter: {
          name: '客流量',
          yaxis: {
            title: {
              text: '客流量（人）'
            },
            labels: {
              formatter (value) {
                return value ? value.toLocaleString() : ''
              }
            }
          }
        }
      }
      return { ...footfallYaxis, ...salesDict }
    },
    trendTime () {
      return moment(this.dateTime[0]).format('YYYY-MM-DD') + ',' + moment(this.dateTime[1]).format('YYYY-MM-DD')
    },
    customAnalytics () {
      let tml = []
      if (!Object.keys(this.footFallTypeRes).length) return tml
      let data = this.footFallTypeRes
      delete data.clerk_proportion
      Object.keys(data).forEach(e => {
        let chartObj = {}
        // 由于年龄性别的数据结构不一致，采用另外一种处理方式
        if (e === 'gender_propotion') {
          let genderName = {
            '0': {
              name: '女',
              icon: 'female'
            },
            '1': {
              name: '男',
              icon: 'male'
            }
          }
          chartObj.labels = {
            name: '性别',
            key: 'gender',
            data: Object.keys(data[e]).map(e => genderName[e].name),
            icons: Object.keys(data[e]).map(e => genderName[e].icon)
          }
          chartObj.series = Object.values(data[e])
        } else if (e === 'age_distribution') {
          let genderName = {
            male: '男性',
            female: '女性'
          }
          chartObj.labels = {
            name: '年龄',
            key: 'age',
            data: Object.keys(data[e]).map(e => { return this.ageNameformat(e) })
          }
          chartObj.series = Object.keys(genderName).map(k => ({ name: genderName[k], key: k, data: (Object.values(data[e])).map(o => o[k]) }))
        } else {
          chartObj.labels = {
            name: '类型',
            key: e,
            data: Object.keys(data[e]).map(e => customerNameDict[e].name),
            icons: Object.keys(data[e]).map(e => customerNameDict[e].icon)
          }
          chartObj.series = Object.values(data[e])
        }
        chartObj.title = this.customChecklist[e].name
        chartObj.type = this.customChecklist[e].chartType
        chartObj.height = this.customChecklist[e].height
        if (e !== 'vip_proportion' && e !== 'new_old_proportion' && e !== 'arrival_distribution') {
          tml.push(chartObj)
        }
      })
      return tml
    }

  },
  watch: {
    dateTime () {
      this.innerRange = gotInnerRange(this.dateTime)
    }
  },
  mounted () {
    this.dateTime = [moment().add(-1, 'days').format('YYYY-MM-DD'), moment().add(-1, 'days').format('YYYY-MM-DD')]
    this.cityList = []
    this.$store.state.home.bussinessTree[0].children.forEach(list => {
      list.children.forEach(val => {
        this.cityList.push({
          value: val.id,
          label: val.name
        })
      })
    })
  },
  activated () {
    clearInterval(this.intervalId)
    this.intervalId = setInterval(() => {
      this.realTimeData()
    }, 1000 * 60 * 5)
    if (this.$route.params.id) {
      this.currentStore = this.$route.params.id
    } else {
      this.currentStore = this.cityList[0].value
    }
    this.paramsPrepare()
  },
  methods: {
    paramsPrepare () {
	  this.requestData()
	  this.realTimeData()
    },
    requestData () {
      Bus.$emit('trendData')
	  let params = { range: this.trendTime, bzid: this.currentStore }

      synthesizeRight({ timeRange: this.trendTime, bzid: this.currentStore }).then(res => {
        if (res.data.code === 200) {
		  let data = res.data.data
          // 总客流
          this.rightData[0].number = data.enter.total.number
          this.rightData[0].lastRatio = _.round(data.enter.total.lastRatio * 100, 2) + '%'
          this.rightData[0].ringRatio = _.round(data.enter.total.ringRatio * 100, 2) + '%'
          this.rightData[0].isRing = data.enter.total.ringRatio >= 0
          this.rightData[0].isLast = data.enter.total.lastRatio >= 0
          // 客流峰值
          let hisTime = data.enter.highest.timeRange.split(',')[0]
          this.rightData[1].number = data.enter.highest.number
          this.rightData[1].time = moment(hisTime).format('YYYY-MM-DD HH') + ' : 00 - ' + moment(hisTime).format('HH') + ' : 59'
          // 平均客流
		  this.rightData[2].number = data.enter.avg.number
		  this.rightData[2].lastRatio = _.round(data.enter.avg.lastRatio * 100, 2) + '%'
		  this.rightData[2].ringRatio = _.round(data.enter.avg.ringRatio * 100, 2) + '%'
		  this.rightData[2].isRing = data.enter.avg.ringRatio >= 0
		  this.rightData[2].isLast = data.enter.avg.lastRatio >= 0
          //   有效客流
		  this.rightData[3].number = data.valid
	   }
      })
      getEntityFlow(params).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.footFallTypeRes = data
        }
      })
    },
    realTimeData () {
      let currentDate = moment().format('YYYY-MM-DD')
      synthesizeRight({ timeRange: currentDate + ',' + currentDate, bzid: this.currentStore }).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.imgUrl = data.map_url
          this.leftData[0].number = data.enter.total.number
          let hisTime = data.enter.highest.timeRange.split(',')[0]
          this.leftData[1].number = data.enter.highest.number
          this.leftData[1].time = moment(hisTime).format('HH') + ' : 00 - ' + moment(hisTime).format('HH') + ' : 59'
        }
      })
    },
    ageNameformat (str) {
      return str.replace('_', '-').replace('less-30', '青年').replace('30-60', '中年').replace(/more-60/, '老年')
    },
    shopTabChange (value) {
      switch (value.type) {
        case '年龄分布':
          this.obj1 = value.data
          break
        case '性别分布':
          this.obj2 = value.data
          break
        case '新老顾客占比':
          this.obj3 = value.data
          break
        case '到店次数':
          this.obj4 = value.data
          break
      }
    },
    genderExportBiztop (title) {
      switch (title) {
        case '年龄分布':
          this.downloadName = '门店综合分析年龄分布客流数据'
          this.uploadList(this.obj1)
          break
        case '性别分布':
          this.downloadName = '门店综合分析性别分布客流数据'
          this.uploadList(this.obj2)
          break
      }
    },
    uploadList (value) {
      exportEx(value).then(res => {
        let date = new Date()
        const blob = new Blob([res.data])
        let name = this.downloadName
        let fileName = name + moment(date).format('YYYYMMDDHHmmss') + '.xls'
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)// 释放URL 对象
        document.body.removeChild(elink)
      })
    },
    resetData () {

    }
  },
  deactivated () {
    this.intervalId && clearInterval(this.intervalId)
  }
}
</script>
<style lang="less">
    .synthesize-selector{
		.ivu-select-item{
			font-size: 14px !important;
		}
        .ivu-input{
        font-size: 14px;
        height: 43px;
        border: 1px solid rgba(0, 0, 0, .2) ;
        font-family: "source_han_sans_cn", "Roboto", sans-serif;
        box-shadow: none;
        }
        .con-select{
            clear: none;
        }
        .ivu-date-picker .ivu-select-dropdown{
            z-index:51100
        }
        .ivu-select{
            float: left;
            height: 43px;
            margin-left: 20px;
            .ivu-select-selection{
				height: 43px;
				box-shadow: none;
                .ivu-select-selected-value{
                    height: 43px;
					line-height: 43px;
                }
            }
            .ivu-select-placeholder{
                height: 43px;
                line-height: 43px;
            }
        }
        .ivu-input-suffix i{
            line-height: 43px;
		}
.ivu-select-item-selected{
font-weight:700;
color: #409eff;
}
    }

</style>
<style lang="less" scoped>
.synthesize{
    .synthesize-selector{
        width: 100%;
        height: auto;
        background-color: #fff;
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);
        padding: 1.5rem;
        border-radius: .5rem;
        .activities{
            display: inline-block;
            width: auto;
            height: auto;
            .con-select{
                display: inline-block;
            }
        }
        .submit{
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
        .reset{
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
    .synthesize-real-time{
        margin-top: 20px;
        height: 490px;
        .real-left{
            height: 490px;
            img{
                display: block;
                width: 100%;
                height: 100%;
            }
            .box{
                left: 20px;
                top: 20px;
                position: absolute;
                z-index: 10;
            }
            .left-box{
                width:280px;
                background: #fff;
                padding: 20px;
                margin-bottom: 25px;
                border-radius: 6px;
                box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
                span{
                    display: block;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 40px;
                    margin-bottom: 5px;
                }
                p{
                    font-size:32px;
                    color: #3e3c3c;
                    span{
                        display: inline-block;
                        width: auto;
                        font-size: 20px;
                    }
                }
                div{
                    margin-top: 5px;
                    display: inline-block;
                    width: 100%;
                    font-size: 16px;
                    color: #3e3c3c;
                }
            }
        }
        .real-right{
            height: 490px;
            padding-left: 30px;
            ul{
                width: 100%;
                height: 100%;
                li{
                    float: left;
                    width: 49%;
                    height: 230px;
                    border-radius: 6px;
                    box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
                    background-color: #fff;
                    margin-bottom: 24px;
                    padding: 30px 20px;
                    &:nth-child(2n+0){
                        float: right;
                    }
                    &:nth-child(3){
                        margin-bottom: 0;
                    }
                    &:nth-child(4){
                        margin-bottom: 0;
                    }
                    .right-icon{
                        width: 40px;
                        height: 40px;
                        text-align: center;
                        line-height: 40px;
                        border-radius: 50%;
                    }
                    .right-data{
                        font-size: 1.8rem;
                        color: #3e3c3c;
                        margin: 10px 0;
                        p{
                            display: inline-block;
                            margin-right: 10px;
                        }
                        span{
							font-size: 14px;
                        }
                    }
                    .right-type{
                        color: #3e3c3c;
                        font-size: 16px;
                    }
                    .right-sequential{
                        margin-top: 10px;
                        p{
                            display: inline-block;
                            margin-right: 5px;
                            color: #3e3c3c;
                        }
                        .iconStyle{
                            display: inline-block;
                            transform:rotate(180deg);
                            i{
                                 color: #26b465 !important;
                            }
                        }
                    }
                }
            }
        }

    }
    .synthesize-trend{
        margin-top: 20px;
    }
    .synthesize-chart{
        margin-top: 20px;
        .age-chart{
            padding-right: 10px;
        }
        .gender-chart{
            padding-left: 10px;
        }

    }
    .ageChart:hover,.real-right ul li:hover,.real-left:hover,.genderChart:hover{
        border:1px solid #23aeee!important;
        border-radius: 6px;
        box-shadow: 0px 0px 18px 0px rgba(160, 163, 164, .5)!important;
    }
}
</style>
