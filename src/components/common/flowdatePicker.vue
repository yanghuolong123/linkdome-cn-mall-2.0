<template>
  <div class="flowDatepicker">
    <DatePicker
      transfer
      :options="options"
      placement="bottom-end"
      placeholder="时间"
      v-model="value"
      :format="currentFormat"
      @on-open-change="clearFormat"
      @on-change="selectDate"
      :clearable='false'
      :element-id="'flowwDatePicker'"
      style="width: 100%"
      :start-date = "stardDate"
    ></DatePicker>
  </div>
</template>
<script>
import Moment from 'moment'
export default {
  name: 'flowdatePicker',
  props: {
    dType: {
      type: Number,
      default: 1
    },
    pickerOneValue: {
      type: Array,
      default: () => []
    },
    pickerOneClickName: {
      type: String,
      default: 'l'
    }
  },
  data () {
    return {
      clickTimeName: '昨日',
      options: {
        shortcuts: [
          {
            text: '今 日',
            value () {
            },
            onClick: picker => {
              this.checkCanbeSelect('t', this.pickerOneClickName)
            }
          },
          {
            text: '昨 日',
            value () {
            },
            onClick: picker => {
              this.checkCanbeSelect('l', this.pickerOneClickName)
            }
          },
          {
            text: '上 周',
            value () {
            },
            onClick: picker => {
              this.checkCanbeSelect('w', this.pickerOneClickName)
            }
          },
          {
            text: '上 月',
            value () {
            },
            onClick: picker => {
              this.checkCanbeSelect('m', this.pickerOneClickName)
            }
          },
          {
            text: '今 年',
            value () {
            },
            onClick: picker => {
              this.checkCanbeSelect('y', this.pickerOneClickName)
            }
          },
          {
            text: '环 比',
            value () {

            },
            onClick: picker => {
              const [start, end] = this.pickerOneValue
              let ymd = 'YYYY-MM-DD'
              let diffdays = Moment(end).diff(Moment(start), 'days')
              let newStart = Moment(start).add(-1, 'd').toDate()
              let newEnd = Moment(newStart).add(diffdays, 'd').toDate()
              this.value = Moment(newStart).format(ymd)
              this.currentFormat = `${this.value} - ${Moment(newEnd).format(ymd)}`
              this.clickTimeName = '环比'
            }
          },
          {
            text: '同 比', // 去年同期
            value () {

            },
            onClick: picker => {
              let ymd = 'YYYY-MM-DD'
              const [start, end] = this.pickerOneValue
              let newStart = Moment(start).add(-1, 'y').toDate()
              let newEnd = Moment(end).add(-1, 'y').toDate()
              this.value = Moment(newStart).format(ymd)
              this.currentFormat = `${this.value} - ${Moment(newEnd).format(ymd)}`
              this.clickTimeName = '同比'
            }
          }
        ],
        disabledDate (date) {
          return Moment(date).isAfter(Moment())
        }
      },
      value: '',
      currentFormat: '',
      stardDate: new Date()
    }
  },

  watch: {
    pickerOneValue () {
      // this.value = Moment().format('YYYY-MM-DD')
      this.value = undefined
      this.currentFormat = undefined
      // 用户更改选择器1的value，及时更改选择器2的值
      this.$emit('selectDate', [], this.clickTimeName, this.dType)
    }
  },
  methods: {
    selectDate (date, type) {
      if (!this.value) {
        this.$emit('selectDate', [], this.clickTimeName, this.dType)
        return
      }
      if (type === 'date') { // 点击面板，得到上次的时间差
        let ymd = 'YYYY-MM-DD'
        const [start, end] = this.pickerOneValue
        let diffDays = Moment(end).diff(Moment(start), 'd')
        let newEnd = Moment(date).add(diffDays, 'd').format(ymd)
        this.currentFormat = `${date} - ${newEnd}`
        // this.value = date
        this.$emit('selectDate', [date, newEnd], this.clickTimeName, this.dType)
      } else {
        let tmlDate = [date.split(' ')[0], date.split(' ')[2]]
        this.$emit('selectDate', tmlDate, this.clickTimeName, this.dType)
      }
    },
    checkCanbeSelect (checkType, anotherType) {
      let ymd = 'YYYY-MM-DD'
      let today = Moment().format(ymd)
      let lastDay = Moment().add(-1, 'd').format(ymd)
      let checkObj = {
        t: `${today} - ${today}`,
        l: `${lastDay} - ${lastDay}`,
        w: `${Moment().startOf('week').add(-6, 'd').format(ymd)} - ${Moment().startOf('week').format(ymd)}`,
        m: `${Moment().startOf('month').add(-1, 'd').startOf('month').format(ymd)} - ${Moment().startOf('month').add(-1, 'd').format(ymd)}`,
        y: `${Moment().startOf('year').format(ymd)} - ${Moment().format(ymd)}`
      }
      if ((checkType === anotherType) || (checkType === 't' && anotherType === 'l') || (checkType === 'l' && anotherType === 't')) {
        this.clickTimeName = checkType
        this.currentFormat = checkObj[checkType]
        // this.value = checkObj[checkType].split(' ')[0]
      } else {
        // this.value = ''
        this.currentFormat = ''
        alert('所选日期不合法')
      }
    },
    clearFormat (status) {
      // console.log(status);

      console.log(`${status ? '展开' : '收起'}`, this.value)
      if (status) {
        this.value = undefined
        this.currentFormat = undefined
      } else {
        // this.value = undefined
        if (this.value) {

          // setTimeout(() => {
          //   if (typeof (this.value) === 'object') {
          //     this.value = '' // 考虑到时间改变和面板收起同一时间进行，有时候会出现日期类型为对象的情况，固等待面板选择执行完毕
          //   }
          // }, 100)
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.flowDatepicker /deep/
  input
    height 40px
    line-height 40px
    font-size 16px
  i
    height 40px
    line-height 40px
</style>
