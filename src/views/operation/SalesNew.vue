<template>
  <div class="sales-new">
    <div class="box-card bg-white pb-5" style="padding:15px;overflow: hidden">
      <!-- 类型选择 -->
        <vs-row>
            <vs-col  style="width:250px;" :vs-xs="12">
                <i-date-picker :value='date1Array' :dType="1" @selectDate="dateSelect"></i-date-picker>
            </vs-col>
             <vs-col  style="width:150px;padding:0;margin-left:15px;" :vs-xs="12"  >
                 <vs-select v-model="compareType" width="100%;" autocomplete>
                    <vs-select-item
                        v-for="(item,index) in typeOptions"
                        :key="index"
                        :value="item.value"
                        :text="item.label"
                    />
                </vs-select>
            </vs-col>
            <vs-col style="width:230px;padding:0;margin-left:25px;" :vs-xs="12">
                <vs-button color="primary" style="float:left;" @click="handleClick" class="btn">查询</vs-button>
                <!-- <vs-button color=""  class="btn ml-4 comparison">对比</vs-button> -->
            </vs-col>
        </vs-row>
    </div>
    <!-- 销售 -->
    <market ref="market" :parameter=marketParameter> </market>
    <!-- 楼层和品牌 -->
    <floor-brand ref="floor_brand" :floorParameter=floorParameter :brandParameter=brandParameter></floor-brand>
    <!-- 异动分析 -->
    <transaction ref="transaction" :topParameter=topParameter  :afterParameter=afterParameter></transaction>
  </div>
</template>

<script>
import iDatePicker from '@/components/common/idatepicker.vue'
import moment from 'moment'
import market from './newSales/market.vue'
import floorBrand from './newSales/floor_brand.vue'
import transaction from './newSales/transaction.vue'
import hotItem from './newSales/hotItem.vue'
import { getNewbusiness, getNewfloor, getNewbrand, getchange } from '@/api/newSales.js'
export default {
  name: 'salseNew',
  components: {
    iDatePicker,
    // 组件
    market,
    floorBrand,
    transaction,
    hotItem
  },
  data () {
    return {
      date1Array: [moment().add(-1, 'd').format('YYYY-MM-DD'), moment().add(-1, 'd').format('YYYY-MM-DD')],
      typeOptions: [
        {
          value: 'SaleAmount',
          label: '销售额'
        },
        {
          value: 'SquaerMetre',
          label: '坪效'
        },
        {
          value: 'UnitPrice',
          label: '客单价'
        },
        {
          value: 'CloseRate',
          label: '成交率'
        }
      ],
      compareType: 'SaleAmount',
      marketParameter: {},
      floorParameter: {},
      brandParameter: {},
      afterParameter: {},
      topParameter: {}

    }
  },
  computed: {
    propertyId () {
      return this.$store.state.home.headerAction
    }
  },
  watch: {
    '$store.state.home.bussinessDict' () {
      this.handleClick()
    }
  },
  mounted () {
    this.handleClick()
  },

  methods: {
    dateSelect (val) {
      this.date1Array = val
    },
    handleClick () {
      // 业态分析
      let marketParameter = {
        time: this.date1Array.join(','),
        type: this.compareType,
        property_id: this.propertyId,
        range: this.date1Array[0] === this.date1Array[1] ? 'Hour' : 'Date',
        floor_id: this.$refs.market.floorAction
      }
      this.marketParameter = marketParameter
      getNewbusiness(marketParameter).then(res => {
        if (res.data.code === 200) {
          this.$refs.market.dataList(res.data.data)
        }
      })
      // 楼层分析
      setTimeout(() => {
        let floor = this.$refs.floor_brand.floorOption
        let floorParameter = {
          time: this.date1Array.join(','),
          type: this.compareType,
          property_id: this.propertyId,
          industry_id: floor.selectAction === 'all' ? '' : floor.selectAction
        }
        this.floorParameter = floorParameter
        getNewfloor(floorParameter).then(res => {
          if (res.data.code === 200) {
            this.$refs.floor_brand.floorData(res.data.data)
          }
        })
      })

      // 品牌分析
      setTimeout(() => {
        let brand = this.$refs.floor_brand.brandOption
        let brandParameter = {
          time: this.date1Array.join(','),
          type: this.compareType,
          property_id: this.propertyId,
          floor_id: brand.selectAction === 'all' ? '' : brand.selectAction
        }
        this.brandParameter = brandParameter
        getNewbrand(brandParameter).then(res => {
          if (res.data.code === 200) {
            this.$refs.floor_brand.brandData(res.data.data)
          }
        })
      })

      // 异动分析 前10
      let topParameter = {
        time: this.date1Array.join(','),
        type: this.compareType,
        property_id: this.propertyId,
        industry_id: '',
        floor_id: ''
      }
      let top = this.$refs.transaction.topTen
      if (top.topRadio === 'topFloor') {
        topParameter.floor_id = top.selectAction === 'all' ? '' : top.selectAction
      } else {
        topParameter.industry_id = top.selectAction === 'all' ? '' : top.selectAction
      }
      this.topParameter = topParameter
      getchange(topParameter).then(res => {
        if (res.data.code === 200) {
			  this.$refs.transaction.topData(res.data.data.top_10)
        }
		  })

      // 异动分析 后10
      let afterParameter = {
        time: this.date1Array.join(','),
        type: this.compareType,
        property_id: this.propertyId,
        industry_id: '',
        floor_id: ''
      }
      let after = this.$refs.transaction.afterTen
      if (after.topRadio === 'AfterFloor') {
        afterParameter.floor_id = after.selectAction === 'all' ? '' : after.selectAction
      } else {
        afterParameter.industry_id = after.selectAction === 'all' ? '' : after.selectAction
      }
      this.afterParameter = afterParameter
      getchange(topParameter).then(res => {
		    if (res.data.code === 200) {
		      this.$refs.transaction.afterData(res.data.data.last_10)
		    }
		  })
    }
  }
}
</script>
<style lang="less">
     .comparison{
        border: 1px solid #009FE9;
        color: #009FE9;
    }
    .floor-chart{
      &:nth-child(1){
        .tab-con{
            margin-top: 40px;
        }
      }
    }
</style>
<style lang="less" scoped>
  .sales-new{
      padding-bottom: 50px;
  }
</style>
