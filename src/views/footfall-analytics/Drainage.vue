<template>
  <div>
    <div class="deainage-picker">
        <DatePicker
            type="daterange"
            v-model="drainageDate"
            placement="bottom-end"
            :options="disabledDate"
            placeholder="选择日期"
            style='width:230px;float:left;'
        ></DatePicker>
        <el-cascader
          v-model="shopValue"
          :options="shopList"
          :props="{expandTrigger:'hover'}"
          class="selectExample"
        >
        </el-cascader>
        <div class="drainage-submit" v-on:click="paramsPrepare">查询</div>
        <div class="drainage-reset" v-on:click="resetData">重置</div>
    </div>
    <!-- 引流图片 -->
    <drainage-map
      :dataList = 'drainageMapList'
      :centerData = 'centerDataList'
      :presentData = 'presentData'
    ></drainage-map>
    <!-- 详细数据 -->
    <drainage-chart
      v-if="Number(shopValue[1])"
      :bzid="Number(shopValue[1])"
      :fromGates="allData.inGate"
      :fromStores="allData.inStore"
      :toGates="allData.outGate"
      :toStores="allData.outStore"
      :time="drainageDate"
    ></drainage-chart>
  </div>
</template>
<script>
import drainageMap from '@/components/drainage/drainageMap'
import { getCascadeList } from '@/api/passenger.js'
import { drainageData } from '@/api/analysis'
import moment from 'moment'
import NP from 'number-precision'
import _ from 'lodash'
import drainageChart from './components/FootfallDirection'
import { disabledDate } from '@/libs/util.js'
import eventBus from '@/libs/bus'

export default {
  name: 'drainage',
  components: {
    drainageMap,
    drainageChart
  },
  data () {
    return {
      allData: {},
      drainageDate: [],
      shopValue: '',
      shopList: [],
      drainageMapList: {},
      centerDataList: [],
      presentData: {},
      disabledDate: '',
      dictSize: 0
    }
  },
  watch: {
    '$store.state.home.headerAction' () {
      let routerName = this.$router.currentRoute.name
      if (routerName === 'Drainage') {
        this.drainageMapList = []
        this.drainageMapList = []
        this.presentData = []
        this.shopListData()
      }
      this.resetData()
    }
  },
  created () {
    this.disabledDate = disabledDate
  },
  activated () {
    var date = new Date()
    date = date.setDate(date.getDate() - 1)
    var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
    this.drainageDate = dateTime
    this.shopListData()
  },
  mounted () {

  },
  methods: {
    shopListData () {
      let that = this
      let propertyId = this.$store.state.home.headerAction
      getCascadeList({ property_id: propertyId }).then(res => {
        if (res.data.code == 200) {
          this.shopList = []
          this.shopValue = []
          let data = res.data.data
          if (data.length == 0) return false
          let cascadeList = Object.keys(data)
          cascadeList.forEach(list => {
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
            this.shopList.push(obj)
          })
          if (that.shopList.length != 0) that.shopValue = [that.shopList[0].value, that.shopList[0].children[0].value]
          that.paramsPrepare()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    paramsPrepare () {
      var that = this
      if (this.drainageDate.length == 0) {
        alert('时间不能为空，请选择时间')
        return false
      }
      let time = moment(that.drainageDate[0]).format('YYYY-MM-DD') + ',' +
      moment(that.drainageDate[1]).format('YYYY-MM-DD')
      let id = this.shopValue[1]
      if (!id) {
        alert('商铺不能为空，请选择商铺')
        return false
      }
      try {
        let entityName = this.shopValue[0]
        let children = _.find(this.shopList, ['label', this.shopValue[0]]).children
        let find = _.find(children, ['value', this.shopValue[1]])
        find = find && find.name ? find.name : ''
        entityName += '/' + find
        let times = moment(this.drainageDate[0]).format('YYYY-MM-DD') + ',' + moment(this.drainageDate[1]).format('YYYY-MM-DD')
        window.TDAPP.onEvent('实体引流分析页面', '数据查询', { '时间段': times, '实体选择': entityName })
      } catch (error) {
        console.log('实体引流分析页面-数据查询-埋点error:' + error)
      }
      eventBus.$emit('drainageClick', { time: time, id: id })
      this.dataList(time, id)
    },
    dataList (time, id) {
      drainageData({ time: time, bzid: id }).then(res => {
        let data = res.data.data
        this.allData = data
        this.presentData.name = data.entity.name
        this.presentData.img = data.entity.icon
        this.graphList(data)
        this.centerList(data)
      })
    },
    graphList (data) {
      let listObj = {}
      listObj.direct = [] // 直接引入
      listObj.radiation = [] // 间接引入
      listObj.indirect = [] // 辐射店铺占比
      listObj.departure = [] // 离场客流占比

      //  直接引入列表
      data.inGate.gates.map(function (e, index) {
        var obj = {}
        obj.name = e.name
        obj.value = NP.times(e.rate.ratio, 100)
        if (Number(e.lastrate.ratio) > 0 || Number(e.lastrate.ratio) == 0) obj.action = false
        else obj.action = true
        obj.link = NP.times(e.lastrate.ratio, 100)
        if (listObj.direct.length < 5) listObj.direct.push(obj)
      })
      // 间接引入 列表
      data.inStore.stores.map(function (e) {
        var obj = {}
        obj.name = e.name
        obj.value = NP.times(e.rate.ratio, 100)
        if (Number(e.lastrate.ratio) > 0 || Number(e.lastrate.ratio) == 0) obj.action = false
        else obj.action = true
        obj.link = NP.times(e.lastrate.ratio, 100)
        if (listObj.radiation.length < 5) listObj.radiation.push(obj)
      })
      // 辐射店铺 列表
      data.outStore.stores.map(function (e) {
        var obj = {}
        obj.name = e.name
        obj.value = NP.times(e.rate.ratio, 100)
        if (Number(e.lastrate.ratio) > 0 || Number(e.lastrate.ratio) == 0) obj.action = false
        else obj.action = true
        obj.link = NP.times(e.lastrate.ratio, 100)
        if (listObj.indirect.length < 5) listObj.indirect.push(obj)
      })
      //  离场客流 列表
      data.outGate.gates.map(function (e) {
        var obj = {}
        obj.name = e.name
        obj.value = NP.times(e.rate.ratio, 100)
        if (Number(e.lastrate.ratio) > 0 || Number(e.lastrate.ratio) == 0) obj.action = false
        else obj.action = true
        obj.link = NP.times(e.lastrate.ratio, 100)
        if (listObj.departure.length < 5) listObj.departure.push(obj)
      })
      this.drainageMapList = listObj
    },
    centerList (data) {
      this.centerDataList = []
      let arr = []
      // 直接引入占比
      var direct = {}
      direct.value = NP.times(data.inGate.rate.ratio, 100)
      var size = Number(data.inGate.rate.crCompare)
      if (size > 0 || size == 0) direct.action = false
      else direct.action = true
      direct.text = '出入口引入占比'
      direct.link = NP.times(data.inGate.rate.crCompare, 100)
      arr.push(direct)
      // 辐射店铺占比
      var indirect = {}
      indirect.value = NP.times(data.outStore.rate.ratio, 100)
      var sizeI = Number(data.outStore.rate.crCompare)
      if (sizeI > 0 || sizeI == 0) indirect.action = false
      else indirect.action = true
      indirect.text = '辐射店铺占比'
      indirect.link = NP.times(data.outStore.rate.crCompare, 100)
      arr.push(indirect)

      // 间接引入占比
      var radiation = {}
      radiation.value = NP.times(data.inStore.rate.ratio, 100)
      var sizeR = Number(data.inStore.rate.crCompare)
      if (sizeR > 0 || sizeR == 0) radiation.action = false
      else radiation.action = true
      radiation.text = '店铺引入占比'
      radiation.link = NP.times(data.inStore.rate.crCompare, 100)
      arr.push(radiation)

      // 离场客流占比
      var departure = {}
      departure.value = NP.times(data.outGate.rate.ratio, 100)
      var sizeD = Number(data.outGate.rate.crCompare)
      if (sizeD > 0 || sizeD == 0) departure.action = false
      else departure.action = true
      departure.text = '离场客流占比'
      departure.link = NP.times(data.outGate.rate.crCompare, 100)
      arr.push(departure)
      this.centerDataList = arr
    },
    // 重置 选择
    resetData () {
      try {
        window.TDAPP.onEvent('实体引流分析页面', '重置', { })
      } catch (error) {
        console.log('实体引流分析页面-重置-埋点error:' + error)
      }
      var date = new Date()
      date = date.setDate(date.getDate() - 1)
      var dateTime = [moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD')]
      this.drainageDate = dateTime
      if (this.shopList.length != 0) this.shopValue = [this.shopList[0].value, this.shopList[0].children[0].value]
    }
  }
}
</script>

<style lang="less" >
 .deainage-picker{
    margin-bottom: 20px;
    overflow: hidden;
    background-color: #fff;
    padding: 18px 30px;
    box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
    border-radius: 6px;
    .con-select{
      clear: none;
    }
    .ivu-input{
      width: 230px;
        height: 43px;
        font-size: 14px;
        border: 1px solid rgba(0,0,0,.2);
        font-family: "source_han_sans_cn", "Roboto", sans-serif;
    }
    .selectExample{
      float: left;
      width: 230px;
      margin-left: 30px;

      input{
        height: 43px;
        border: 1px solid rgba(0,0,0,.2);
      }
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
  .drainage-submit{
    display:inline-block;
    padding: 0.75rem 2rem;
    text-align:center;
    border-radius: 6px;
    background-color: #00A0E9;
    border: 1px solid #00A0E9;
    color: #fff;
    font-size: 1rem;
    margin-left:30px;
    cursor: pointer;
    &:hover{
      box-shadow: 0 8px 25px -8px #00A0E9;
    }
  }
  .drainage-reset{
    display:inline-block;
    padding: 0.75rem 2rem;
    text-align:center;
    border-radius: 6px;
    background-color: #fff;
     border: 1px solid #00A0E9;
    color: #00A0E9;
    font-size: 1rem;
    margin-left:30px;
    cursor: pointer;
    &:hover{
      box-shadow: 0 8px 25px -8px #00A0E9;
    }
  }
</style>
