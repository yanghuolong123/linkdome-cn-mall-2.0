<template>
    <div>
        <div class="box-card bg-white hotItem">
          <i-date-picker style="width:200px; display: inline-block;" :value='date1Array' :dType="1" @selectDate="dateSelect"></i-date-picker>
          <Select v-model="selectType" @on-change=selectTypeData style="width:200px;margin-left:15px;">
            <Option v-for="(item,index) in typeOptions"
                :value="item.value"
                :key="index">{{ $t(item.label) }}</Option>
          </Select>
          <Select v-model="typeAction" multiple :max-tag-count="1" style="width:200px;margin-left:15px;" >
            <Option v-for="(item,index) in typeList"
                :value="item.value"
                :key="index">{{ item.label }}</Option>
          </Select>
          <Button style="margin-left:15px;" size="large" type="primary"  @click="handleClick" >{{ $t('query') }}</Button>
        </div>
        <div class="box-card bg-white hotItem" style="margin-top: 20px">
            <div class="hotItem-chart" v-if="isChart">
                <p class="name1">{{$t('salesVolume')}}</p>
                <p class="name2">{{$t('orderNumber')}}</p>
                <vChart   style="width:100%;height:600px"  ref="graphChart" :options="polar"/>
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
      isChart:false,
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
            return `${this.$t('商品名称')}：` + val.data[3] + `<br>${this.$t('salesVolume')}：` + val.data[0].toLocaleString() + this.$t('元') + `<br>${this.$t('orderNumber')}：` + val.data[1].toLocaleString()
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
  activated() {
    this.isChart = false
    setTimeout(() => {
      this.isChart = true
    })
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
      setTimeout(() => {
         this.$refs.graphChart.resize()
      },200);

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

      if( hotParameter.bzid === '' && hotParameter.floor_id === '' && hotParameter.industry_id === '' ){
        this.$alert({
          content:'请选择实体'
        })
        return false
      }
      gethotGoode(hotParameter).then(res => {
        if (res.data.code === 200) {
          let newHotData = []
          res.data.data.map(list => {
            newHotData.push([list.amount, list.order_num, list.ratio, list.goods_name, this.$t('商品热度')])
          })
          this.polar.series = []
          this.polar.series.push({
            name: this.$t('商品热度'),
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
          this.polar.legend.data = [this.$t('商品热度')]
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
