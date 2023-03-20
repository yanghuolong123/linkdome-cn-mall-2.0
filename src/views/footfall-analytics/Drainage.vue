<template>
  <div>
    <div class="selector-container bg-white box-card">
        <div class="flex-center">
            <DatePicker
                    type="daterange"
                    v-model="drainageDate"
                    placement="bottom-end"
                    :options="disabledDate"
                    placeholder="选择日期"
                    class="w-select"
            ></DatePicker>
            <el-cascader
                    class="w-select m-l-20"
                    v-model="shopValue"
                    :options="shopList"
                    :props="{expandTrigger:'hover'}"
            >
            </el-cascader>
          <el-select v-model="type" class="m-l-20">
            <el-option v-for="item in typeList"
                       :value="item.value"
                       :label="item.label"
                       :key="item.value"></el-option>
          </el-select>
            <Button size="large" class="m-l-20" type="primary" @click="paramsPrepare">{{ $t('查询') }}</Button>
            <Button size="large" class="m-l-20" @click="resetData">{{ $t('重置') }}</Button>
        </div>
    </div>
    <!-- 引流图片 -->
    <drainage-map
      v-show="showType ==='store'"
      :dataList = 'drainageMapList'
      :centerData = 'centerDataList'
      :presentData = 'presentData'
    ></drainage-map>
    <drainage-map-bussiness
      v-show="showType ==='bussiness'"
      :dataList = 'drainageMapListBus'
       :presentData = 'presentData'>
      
    </drainage-map-bussiness>
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
import drainageMapBussiness from '@/components/drainage/drainageMapBussiness'
import { getCascadeList } from '@/api/passenger.js'
import { drainageData,drainageDataByBussiness } from '@/api/analysis'
import moment from 'moment'
import NP from 'number-precision'
import drainageChart from './components/FootfallDirection'
import { disabledDate } from '@/libs/util.js'
import eventBus from '@/libs/bus'

export default {
  name: 'drainage',
  components: {
    drainageMap,
    drainageChart,
    drainageMapBussiness
  },
  data () {
    return {
      allData: {},
      drainageDate: [],
      shopValue: '',
      shopList: [],
      drainageMapList: {},
      drainageMapListBus:{
        to:[],
        from:[]
      },
      centerDataList: [],
      presentData: {},
      disabledDate: '',
      dictSize: 0,
      type:'store',
      showType:'store',
      typeList:[
        {
          value:'store',
          label:'店铺引流'
        },{
          value:'bussiness',
          label:'业态引流'
        }
      ]
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
        this.$alert({ content:'请选择时间' })
        return false
      }
      let time = moment(that.drainageDate[0]).format('YYYY-MM-DD') + ',' +
      moment(that.drainageDate[1]).format('YYYY-MM-DD')
      let id = this.shopValue[1]
      if (!id) {
        this.$alert({ content:'请选择商铺' })
        return false
      }
      eventBus.$emit('drainageClick', { time: time, id: id })
      if(this.type === 'store'){
        this.dataList(time, id)
      }else {
        this.getDataByBussiness(time, id)
      }
     
    },
    getDataByBussiness(time,bzid){
      drainageDataByBussiness({bzid,time}).then(res=>{
        console.log(res)
        res = res.data.data;
        res.from.forEach(o=>{
          o.value =  NP.times(o.rate.toFixed(2), 100)
          o.action = Number(o.c_rate)<0;
          o.link = NP.times(o.c_rate.toFixed(2), 100)
        })
        res.to.forEach(o=>{
          o.value =  NP.times(o.rate.toFixed(2), 100)
          o.action = Number(o.c_rate)<0;
          o.link = NP.times(o.c_rate.toFixed(2), 100)
        })
        res.shop.from_action = Number(res.shop.from_rate)<0;
        res.shop.from_rate =  NP.times(res.shop.from_rate.toFixed(2), 100)
        res.shop.to_action = Number(res.shop.to_rate)<0;
        res.shop.to_rate =  NP.times(res.shop.to_rate.toFixed(2), 100)
        this.drainageMapListBus = res
        this.showType = 'bussiness'
      })
    },
    dataList (time, id) {
      drainageData({ time: time, bzid: id }).then(res => {
        let data = res.data.data
        this.allData = data
        this.presentData.name = data.entity.name
        this.presentData.img = data.entity.icon
        this.presentData.enter = data.entity_flow
        this.graphList(data)
        this.centerList(data)
        this.showType = 'store'
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
        obj.enter = e.rate.number
        listObj.direct.push(obj)
      })
      // 间接引入 列表
      data.inStore.stores.map(function (e) {
        var obj = {}
        obj.name = e.name
        obj.value = NP.times(e.rate.ratio, 100)
        if (Number(e.lastrate.ratio) > 0 || Number(e.lastrate.ratio) == 0) obj.action = false
        else obj.action = true
        obj.link = NP.times(e.lastrate.ratio, 100)
        obj.enter = e.rate.number
        listObj.radiation.push(obj)
      })
      // 辐射店铺 列表
      data.outStore.stores.map(function (e) {
        var obj = {}
        obj.name = e.name
        obj.value = NP.times(e.rate.ratio, 100)
        if (Number(e.lastrate.ratio) > 0 || Number(e.lastrate.ratio) == 0) obj.action = false
        else obj.action = true
        obj.link = NP.times(e.lastrate.ratio, 100)
        obj.enter = e.rate.number
        listObj.indirect.push(obj)
      })
      //  离场客流 列表
      data.outGate.gates.map(function (e) {
        var obj = {}
        obj.name = e.name
        obj.value = NP.times(e.rate.ratio, 100)
        if (Number(e.lastrate.ratio) > 0 || Number(e.lastrate.ratio) == 0) obj.action = false
        else obj.action = true
        obj.link = NP.times(e.lastrate.ratio, 100)
        obj.enter = e.rate.number
        listObj.departure.push(obj)
      })
      this.drainageMapList = listObj
    },
    centerList (data) {
      console.log(_.cloneDeep(this.drainageMapList))
      this.centerDataList = []
      let arr = []
      // 直接引入占比
      var direct = {}
      direct.value = NP.times(data.inGate.rate.ratio, 100)
      direct.enter= _.sumBy(this.drainageMapList.direct,'enter')
      var size = Number(data.inGate.rate.crCompare)
      if (size > 0 || size == 0) direct.action = false
      else direct.action = true
      direct.text = '出入口引入占比'
      direct.link = NP.times(data.inGate.rate.crCompare, 100)
      arr.push(direct)
      // 辐射店铺占比
      var indirect = {}
      indirect.value = NP.times(data.outStore.rate.ratio, 100)
      indirect.enter= _.sumBy(this.drainageMapList.radiation,'enter')
      var sizeI = Number(data.outStore.rate.crCompare)
      if (sizeI > 0 || sizeI == 0) indirect.action = false
      else indirect.action = true
      indirect.text = '辐射店铺占比'
      indirect.link = NP.times(data.outStore.rate.crCompare, 100)
      arr.push(indirect)

      // 间接引入占比
      var radiation = {}
      radiation.value = NP.times(data.inStore.rate.ratio, 100)
      radiation.enter= _.sumBy(this.drainageMapList.indirect,'enter')
      var sizeR = Number(data.inStore.rate.crCompare)
      if (sizeR > 0 || sizeR == 0) radiation.action = false
      else radiation.action = true
      radiation.text = '店铺引入占比'
      radiation.link = NP.times(data.inStore.rate.crCompare, 100)
      arr.push(radiation)

      // 离场客流占比
      var departure = {}
      departure.value = NP.times(data.outGate.rate.ratio, 100)
      departure.enter =  _.sumBy(this.drainageMapList.departure,'enter')
      var sizeD = Number(data.outGate.rate.crCompare)
      if (sizeD > 0 || sizeD == 0) departure.action = false
      else departure.action = true
      departure.text = '离场客流占比'
      departure.enter= data.outGate.rate.number
      departure.link = NP.times(data.outGate.rate.crCompare, 100)
      arr.push(departure)
      this.centerDataList = arr
    },
    // 重置 选择
    resetData () {
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
    .selector-container{
        margin-bottom: 20px;
    }
</style>
