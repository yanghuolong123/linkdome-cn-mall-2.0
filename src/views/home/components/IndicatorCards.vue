<template>
  <div class="bottomcard">
    <div class="flex justify-between items-center" v-if="operate">
      <!-- 首页历史数据查询事件空间插槽 -->
      <div>
        <slot name="title"></slot>
      </div>
      <slot name="dateSelector"></slot>
      <!-- <div class="flex">
        <slot name="dateSelector"></slot> -->
          <!-- 添加 -->
         <!-- <Dropdown @on-click="handleAddcards" transfer>
          <icons type="htmal5icon18" :size="24" :color="addList.length?'#2BD9CF':'#ccc'"></icons>
          <DropdownMenu slot="list"  v-show="addList.length">
            <DropdownItem v-for="(item,index) in addList" :key="index" :name="item.id">{{item.name}}</DropdownItem>
          </DropdownMenu>
        </Dropdown> -->
        <!-- 删除 -->
        <!-- <Dropdown @on-click="handleDelcards" transfer>
          <icons type="shanchu-tianchong" :size="24" :color="delList.length?'#FEB33D':'#ccc'" class="mr-1"></icons>
          <DropdownMenu slot="list" v-show="delList.length">
            <DropdownItem v-for="(item,index) in delList" :key="index" :name="item.id">{{item.name}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div> -->
    </div>
    <div class="infocard" ref="infocard">
      <span @click="scrollRight" v-show="indicatorList.length > defaultCountsOfCards">
        <icons type="left"></icons>
      </span>
      <div
        class="scrollBody"
        ref="scrollBody"
        :style="{
          transform:`translateX(${bodyScroll}px)`,
          gridTemplateColumns:`repeat(${cardsList.length},
          minmax(calc((100% - 20 * ${defaultCountsOfCards - 1}px) / ${defaultCountsOfCards}),1fr))`,
          }"
      >
				<div v-for="(item,index) in cardsList" :key="index" :class="{scaleCard:scaleCards}">
          <slot :item="item"></slot>
        </div>
      </div>
      <span @click="scrollLeft" v-show="indicatorList.length > defaultCountsOfCards">
        <icons type="right"></icons>
      </span>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import './IndicatorCards.styl'
import { userKpiList, postKpiList } from '@/api/home.js'
import _ from 'lodash'
export default {
  name: 'indicatorCards',
  props: {
    textName: {
      type: String,
      default: ''
    },
    indicatorList: {
      type: Array,
      default: () => []
    },
    propertyId: {
      type: null
    },
    indicatorType: {
      type: String,
      default: 'realTimeIndicator'
    },
    defaultCountsOfCards: {
      type: Number,
      default: 3
    },
    operate: {
      type: Boolean,
      default: true
    },
    scaleCards: {
      type: Boolean,
      default: false
    },
    moveWidth:{
      type:Number,
      default:0
    }
  },
  data () {
    return {
      bodyScroll: 0,
      throttle: 0,
      addList: [],
      delList: [],
      alllistData: {}
    }
  },
  computed: {
    cardsTypes () {
      return this.$store.state.home[this.indicatorType][this.propertyName]
    },
    propertyName () {
      return this.propertyId === null ? 'company' : this.propertyId
    },
    cardOffsetWidth () {
      let bodyW = this.$refs.scrollBody.getBoundingClientRect().width
      return this.$refs.scrollBody.firstChild.getBoundingClientRect().width +(bodyW*this.moveWidth)
    },
    cardsList () {
      return this.isSaveLocale ? this.delList : this.indicatorList
    },
    isSaveLocale () {
      return this.operate
    }
  },
  watch: {
	  // 渲染卡片列表
    indicatorList: {
      handler (newval, oldval) {
        this.typeList(this.alllistData)
      },
      deep: true
    }

  },
  mounted () {
  },
  methods: {
    // 删除
    handleDelcards (type) {
      let newTypeList = []
      this.delList.forEach(list => { if (list.id != type) newTypeList.push(list.name) })
      if (newTypeList.length == 0) {
        alert('最少保留一个')
        return false
      }
      this.listdata(newTypeList)
      this.scrollRight()
    },
    // 添加
    handleAddcards (type) {
      let newTypeList = []
      this.delList.forEach(list => { newTypeList.push(list.name) })
      let name = _.find(this.addList, (value) => { return value.id == type }).name
      newTypeList.push(name)
      this.listdata(newTypeList)
      if (this.delList.length > this.defaultCountsOfCards) this.scrollLeft()
    },
    // 更改 处理
    listdata (data) {
      let obj = {
        property_current: '',
        property_history: '',
        company_current: '',
        company_history: ''
      }
      switch (this.textName) {
        case 'shop-center-current':
          obj.property_current = data
          break
        case 'shop-center-histrry':
          obj.property_history = data
          break
        case 'group-current':
          obj.company_current = data
          break
        case 'group-histrry':
          obj.company_history = data
          break
      }
      this.typeList()
      // postKpiList(obj).then(res => {
      //   userKpiList().then(res => {
      //     if (res.data.code == 200) {
      //       let data = res.data.data
      //       this.typeList(data)
      //     }
      //   })
      // })
    },
    scrollLeft () {
      this.$nextTick(() => {
        this.handleScroll(-this.cardOffsetWidth)
      })
    },
    scrollRight () {
      this.$nextTick(() => {
        this.handleScroll(this.cardOffsetWidth)
      })
    },
    // 判断何时显示左右arrow
    showArrow () {
      // 超出显示向右，到达最右边显示左边并隐藏右边只要没有超出全部隐藏
      // 如何判断到达最右边数组length*each offsetwidth
      this.$nextTick(() => {
        let bodywidth = this.$refs.scrollBody.childNodes.length * this.$refs.scrollBody.firstChild.getBoundingClientRect().width
        let allCardsWidth = this.$refs.infocard.getBoundingClientRect().width
        // let maxwidth = this.indicatorList.length * this.$refs.scrollBody.firstChild.getBoundingClientRect().width
        if (bodywidth > allCardsWidth) {
          this.isShowRightArrow = true
        } else {
          this.isShowRightArrow = true
        }
      })
    },
    handleScroll (offset) {
      let singleCardWidth = this.cardOffsetWidth
      let allCardsWidth = this.$refs.infocard.offsetWidth
      let scrollBodyWidth = this.$refs.scrollBody.childNodes.length * singleCardWidth
      let between = scrollBodyWidth - allCardsWidth - 16 * (this.defaultCountsOfCards - 1)
      if (offset > 0) {
        // 位移向右，点击左侧
        this.bodyScroll = Math.min(this.bodyScroll + offset, 0)
      } else {
        // 位移向左，点击右侧最大移动距离等于body card 之差
        if (Math.abs(parseInt(this.bodyScroll)) < parseInt(between)) this.bodyScroll += offset
      }
    },
    // 请求数据
    typeList () {
      // if (data) {
      this.delList = []
      this.addList = []
      // 根据不同的位置传不同的参数
      switch (this.textName) {
        case 'shop-center-current': // 购物中心当前位置
          // if (data.property) this.listClassify(data.property[0].current)
          this.listClassify(
						[
							this.$t('平均客流'),
							this.$t('集客峰值'),
							this.$t('集客量'),
							this.$t('总客流量')
						]
					)
          break
        case 'shop-center-histrry':// 购物中心历史位置
          // if (data.property) this.listClassify(data.property[0].history)
          this.listClassify(
						[
							this.$t('平均客流'),
							this.$t('客流峰值'),
							this.$t('总客流量'),
							this.$t('集客峰值'),
							this.$t('有效客流'),
							this.$t('成交率'),
                            this.$t('坪效(元/平方米)'),
                          this.$t('客单价(元)'),
                          this.$t('销售额(元)') //this.$t('sales_yuan')
						]
					)
          break
        case 'group-current': // 集团当前位置
          // if (data.company) this.listClassify(data.company[0].current)
          this.listClassify(
						[
							this.$t('总客流量'),
							this.$t('集客峰值'),
							this.$t('集客量'),
							this.$t('平均客流')
						]
					)
          break
        case 'group-histrry':// 集团历史位置
          // if (data.company) this.listClassify(data.company[0].history)
          this.listClassify(
						[
							this.$t('平均客流'),
							this.$t('客流峰值'),
							this.$t('总客流量'),
							this.$t('集客峰值'),
							this.$t('有效客流'),
							'成交率',
							'坪效（元/平方米）',
							'客单价（元）',
							'销售额（元）' //this.$t('sales_yuan')
						]
					)
          break
      }
      // }
    },
    // 处理数据
    listClassify (data) {
      this.indicatorList.forEach(list => {
        data.indexOf(list.name) > -1 ? this.delList.push(list) : this.addList.push(list)
      })
    }
  }
}
</script>
 <style lang="less">
   .groupStyle{
     .scrollBody{
     grid-gap: 2.4%!important;
     }
   }
    @media screen and (max-width: 1550px){
        .groupStyle{
          .scrollBody{
          grid-gap: 2.7%!important;
          }
        }
    }
     @media screen and (max-width: 1390px){
        .groupStyle{
          .scrollBody{
          grid-gap: 2.9%!important;
          }
        }
    }
    @media screen and (max-width: 1720px){
       .scrollBody{
          grid-gap: 1.5%!important
       }
    }
    @media screen and (max-width: 1430px){
       .scrollBody{
          grid-gap: 1.7%!important
       }
    }
     @media screen and (max-width: 1270px){
       .scrollBody{
          grid-gap: 1.9%!important
       }
    }
 </style>
