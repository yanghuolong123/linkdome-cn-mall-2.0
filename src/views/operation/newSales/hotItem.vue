<template>
    <div>
        <div class="box-card bg-white hotItem">
            <vs-row>
                <vs-col  style="width:250px;" :vs-xs="12">
                    <i-date-picker :value='date1Array' :dType="1" @selectDate="dateSelect"></i-date-picker>
                </vs-col>
                <vs-col  style="width:150px;padding:0;margin-left:15px;" :vs-xs="12"  >
                    <vs-select v-model="selectType" width="100%;" autocomplete @change=selectTypeData>
                        <vs-select-item
                                v-for="(item,index) in typeOptions"
                                :key="index"
                                :value="item.value"
                                :text="item.label"
                        />
                    </vs-select>
                </vs-col>
                <vs-col  style="width:150px;padding:0;margin-left:15px;" :vs-xs="12"  >
                    <vs-select v-model="typeAction" width="100%;" autocomplete   :multiple="multiple" >
                        <vs-select-item
                                v-for="(item,index) in typeList"
                                :key="index"
                                :value="item.value"
                                :text="item.label"
                        />
                    </vs-select>
                </vs-col>
                <vs-col style="width:230px;padding:0;margin-left:25px;" :vs-xs="12">
                    <vs-button color="primary" style="float:left;" @click="handleClick" class="btn">查询</vs-button>
                </vs-col>
            </vs-row>
        </div>
        <div class="box-card bg-white hotItem" style="margin-top: 20px">
            <div class="hotItem-chart">
                <p class="name1">销售额</p>
                <p class="name2">订单数</p>
                <vChart  style="width:100%;height:600px"  ref="graphChart" :options="polar"/>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import iDatePicker from '@/components/common/idatepicker.vue'
import { gethotGoode } from '@/api/newSales.js'
export default {
  name: 'hotItem',
  components: {
    vChart: VueECharts,
    iDatePicker
  },
  data () {
    return {
      isChart: true,
      multiple: true,
      date1Array: [moment().add(-1, 'd').format('YYYY-MM-DD'), moment().add(-1, 'd').format('YYYY-MM-DD')],
      selectType: 'floor',
      typeOptions: [
        {
          value: 'entity',
          label: '实体选择'
        },
        {
          value: 'business',
          label: '业态选择'
        },
        {
          value: 'floor',
          label: '楼层选择'
        }
      ],
      typeList: [],
      typeAction: [],
      polar: {
        tooltip: {
          formatter: (val) => {
            return '商品名称：' + val.data[3] + '<br>销售额：' + val.data[0].toLocaleString() + '元' + '<br>订单数：' + val.data[1].toLocaleString()
          }
        },
        backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0, [{
          offset: 0,
          color: '#f7f8fa'
        }, {
          offset: 1,
          color: '#cdd0d5'
        }]),
        title: {
          text: ''
        },
        legend: {
          right: 10,
          data: ['商品热度']
        },
        xAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
		      scale: true
        },
        series: []
      }
    }
  },
  computed: {
    propertyId () {
      return this.$store.state.home.headerAction
    },
    floorList () {
      let newData = []
      let data = this.$store.state.home.bussinessTree
      data.map(val => {
        if (val.property_id === this.propertyId) {
          val.children.map(floor => {
            newData.push({
              label: floor.name,
              value: floor.id
            })
          })
        }
      })
      return newData
    },
    businessList () {
      let newData = []
      let dict = this.$store.state.home.bussinessDict
      Object.keys(dict).map(val => {
        newData.push({
          value: val,
          label: dict[val]
        })
      })
      return newData
    },
    entityList () {
      let newData = []
      this.$store.state.home.bussinessTree.map(property => {
        property.children.map(floor => {
          if (floor.children) {
            floor.children.map(shop => {
              newData.push({
                label: shop.name,
                value: shop.id
              })
            })
          }
        })
      })
      return newData
    }
  },
  watch: {
    propertyId () {
      this.handleClick()
    }
  },
  mounted () {
    window.onresize = this.onResize
    this.typeList = this.floorList
    this.typeAction = [this.typeList[0].value]
    this.handleClick()
  },
  methods: {
    dateSelect (val) {
      this.date1Array = val
    },
    onResize () {
      this.$refs.graphChart.resize()
    },
    handleClick () {
      // 商品分析
      let hotParameter = {
        time: this.date1Array.join(','),
        property_id: this.propertyId,
        floor_id: '',
        industry_id: '',
        bzid: ''
      }
      switch (this.selectType) {
        case 'entity':
          hotParameter.bzid = this.typeAction.join(',')
          break
        case 'business':
          hotParameter.industry_id = this.typeAction.join(',')
          break
        case 'floor':
          hotParameter.floor_id = this.typeAction.join(',')
          break
      }
      // if (this.selectType === 'entity') {
      //   hotParameter.bzid = this.typeAction.join(',')
      // } else if (this.selectType === 'business') {
      //   hotParameter.industry_id = this.typeAction.join(',')
      // } else if (this.selectType === 'floor') {
      //   hotParameter.floor_id = this.typeAction.join(',')
      // }
      let currDate = this.date1Array
      let diffDays = moment.duration(moment(currDate[1]).diff(moment(currDate[0]))).asDays()
      gethotGoode(hotParameter).then(res => {
        if (res.data.code === 200) {
          let newHotData = []
          res.data.data.map(list => {
            let ratio = Math.round(list.ratio / (diffDays + 1))
            newHotData.push([list.amount, list.order_num, list.ratio, list.goods_name, '商品热度'])
          })
          this.polar.series = []
          this.polar.series.push({
            name: '商品热度',
            data: newHotData,
            type: 'scatter',
            symbolSize: function (data) {
              return data[2]
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(120, 36, 50, 0.3)',
              shadowOffsetY: 5,
              color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                offset: 0,
                color: 'rgb(251, 118, 123,.6)'
              }, {
                offset: 1,
                color: 'rgb(204, 46, 72,.5)'
              }])
            }
          })
        }
      })
    },
    selectTypeData (val) {
      switch (val) {
        case 'entity':
          this.typeList = this.entityList
          break
        case 'business':
          this.typeList = this.businessList
          break
        case 'floor':
          this.typeList = this.floorList
          break
      }
      this.typeAction = [this.typeList[0].value]
    }
  }
}
</script>
<style lang="less" scoped>
  .hotItem{
        width: 100%;
        height: auto;
        margin-top: 20px;
        padding: 20px;
        p{
        font-size:18px;
        font-weight:400;
        color:rgba(50,49,49,1);
        }
        .hotItem-chart{
          width: 100%;
          height: auto;
          margin-top: 40px;
          position: relative;
          .name1{
            position: absolute;
            font-size: 14px;
            color: #000;
            z-index: 10;
            bottom: 35px;
            right: 15px;
          }
          .name2{
            position: absolute;
            font-size: 14px;
            color: #000;
            z-index: 10;
            left: 7%;
            top: 25px;
          }
        }
    }
</style>
