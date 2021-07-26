<template>
  <div class="bg-white p-4 text-left box-card card-box">
    <span class="iconBox" :style="{backgroundColor:`${iconBg}`}">
      <icons :type="item.type.icon"  :color="item.type.color"></icons>
    </span>
    <span class="home-name" v-if="item.data.hasOwnProperty('name1')"> {{item.name}}</span>
    <p class="text-size text-black number-con" v-if="!multiDate" >
      <template v-if="!item.data.hasOwnProperty('number')">
        <span class="font-number font-bold" v-if="!item.data.hasOwnProperty('name1')">{{item.data | numberFormat}}</span>
        <p class="font-number multipleData" v-if="item.data.hasOwnProperty('name1')">
          <span>{{item.data.name1}}:</span>{{item.data.data1}}
        </p>
        <p class="font-number multipleData" v-if="item.data.hasOwnProperty('name1')">
          <span>{{item.data.name2}}:</span>{{item.data.data2}}
        </p>
      </template>
      <template v-else>
        <div class="flex-column">
          <div class="flex-bottom">
            <span class="font-number font-bold">{{item.data.number | numberFormat}}</span>&nbsp;
            <span class="font-number font-bold ellipsis-1"
                    v-if="item.data.hasOwnProperty('timeRange') && item.data.number"
            >
          <span v-if="isLiveData" :title="item.data.timeRange.replace(/.{2}$/,'59')" class="text-sm">{{item.data.timeRange.replace(/.{2}$/,'59')}} </span>
          <span v-else class="text-sm" :title="item.data.timeRange | dateformat(innerRange)">{{item.data.timeRange | dateformat(innerRange)}} </span>
         
        </span>
          </div>
         
          <p  class="number-name">{{item.data.property}}</p>
        </div>
        
      </template>
    </p>
    <p class="text-base type-name" v-if="!item.data.hasOwnProperty('name1')">{{item.name}}</p>
    <p v-if="item.data.hasOwnProperty('ringRatio')" class="numberrate text-grey-lighter">
      <span class="mr-2">
        同比
        <span :class="{iconRotate:item.data.lastRatio >= 0}">
          <icons type="xiala" color="#F64F61"></icons>
        </span>
        <span class="font-number font-bold text-base">{{item.data.lastRatio*100 | numberFormat}}%</span>
      </span>
      <span>
        环比
        <span :class="{iconRotate:item.data.ringRatio >= 0}">
          <icons type="xiala" color="#F64F61"></icons>
        </span>
        <span class="font-number font-bold text-base">{{item.data.ringRatio*100 | numberFormat}}%</span>
      </span>
    </p>
    <!-- 时间对比 -->
    <template v-if="multiDate">
      <div class="datecompare-box">
        <p class="text-black font-bold">
          <span>{{item.time1}}</span>
          <span class="text-2xl ml-6">{{item.data}}</span>
        </p>
        <p>
          <span>{{item.time2}}</span>
          <span class="text-xl ml-8">
            <icons type="xiala"
              :style="{
              transform:parseInt(item.compareRate)>=0 ? `rotate(180deg)` :`rotate(0deg)`}"
              :color="(parseInt(item.compareRate)>=0 ? '#26B465' :'#F64F61' )">
            </icons>
            {{item.compareRate}}
          </span>
        </p>
      </div>
    </template>
  </div>
</template>

<script>
import hexToRgba from 'hex-to-rgba'
export default {
  name: 'singleCard',
  props: {
    item: {
      type: null
    },
    isLiveData: {
      type: Boolean,
      default: true
    },
    rangeName: {
      type: String,
      default: ''
    },
    innerRange: {
      type: String,
      default: '1h'
    },
    isShowText: {
      type: Boolean,
      default: false
    },
    multiDate: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconBg () {
      return hexToRgba(this.item.type.color, '0.2')
    }
  },
  filters: {
    dateformat (val, innerRange) {
      // let start = val.slice(0, 16)
      let [year, month, start,,, end] = val.split('-')
      return `${year + '-' + month + '-' + start.slice(0)}-${end.slice(3)}`
      // if (innerRange === '1h') {
      //   let [year, month, start,,, end] = val.split('-')
      //   return `${year + '-' + month + '-' + start.slice(0)}-${end.slice(3)}`
      // } else if (innerRange === '1day') {
      //   return `${start.split(' ')[0]}`
      // } else {
      //   return `${start.slice(0, 7)}`
      // }
    }
  }
}
</script>

<style lang="stylus" scoped>
.iconBox
    display inline-block
    width 32px
    height 32px
    border-radius 50%
    text-align center
    margin-bottom 8px;
    .iconfont
      font-size 20px !important

.card-box
    height 170px
    padding 22px 18px !important;
    .numberrate
      i
        vertical-align middle
      .iconRotate
          display inline-block
          transform rotate(180deg)
          >i
            color #26B465!important
    .datecompare-box
        >p
          >span
            &:nth-child(1)
              vertical-align 2px
            >i
              display inline-block
</style>
<style lang="less" scoped>
.text-size{
  font-size: 1.8rem;
}
.number-name{
  font-size:14px;
  line-height: 25px;
  font-weight: bolder;
}
.ivu-tooltip{
  display: block;
  height: 30px;
  line-height: 30px;
}
  .multipleData{
    font-size:20px;
    font-family:Roboto-Bold;
    font-weight:bold;
    color:rgba(37,36,36,1);
    margin-top: 5px;
    span{
      font-size:16px;
      font-family:Adobe Heiti Std R;
      font-weight:normal;
      color:rgba(37,36,36,1);
      margin-right: 15px;
    }
  }
  .home-name{
    display: inline-block;
    font-size:1rem;
    font-family:PingFang-SC-Bold;
    font-weight:600;
    color:rgba(62,60,60,1);
    margin-left: 19px;
  }
  .text-base{
    //  font-size: 16px!important;
  }
</style>
