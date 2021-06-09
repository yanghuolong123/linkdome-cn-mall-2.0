<template>
  <div class="datePickerbox">
    <DatePicker class="idatePicker"
      transfer
       :clearable="false"
      type="daterange"
      :options="options"
      placement="bottom-end"
      placeholder="时间"
      v-model="defaultDate"
      :editable="false"
      :disabled="disabled"
      @on-change="selectDate"
      style="width: 100%"
    ></DatePicker>
  </div>
</template>
<script>
import Moment from 'moment'
import _ from 'lodash'
let that = this
export default {
  name: 'idatePicker',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => { return [Moment().add(-1, 'd').toDate(), Moment().add(-1, 'd').toDate()] }
    },
    dType: {
      type: Number,
      default: 1
    }
  },
  data () {
    let that = this
    return {
      clickTimeName: 'l',
      options: {
        shortcuts: [
          {
            text: '今 日',
            value () {
              const end = new Date()
              const start = new Date()
              return [start, end]
            },
            onClick: picker => {
              this.clickTimeName = 't'
            }
          },
          {
            text: '昨 日',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(
                start.getTime() - 3600 * 1000 * 24 * 1
              )
              end.setTime(
                end.getTime() - 3600 * 1000 * 24 * 1
              )
              return [start, end]
            },
            onClick: picker => {
              this.clickTimeName = 'l'
            }
          },
          {
            text: '上 周',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(
                Moment()
                  .startOf('week')
                  .add(-6, 'day')
                  .format('x')
              )
              end.setTime(
                Moment()
                  .startOf('week')
                  .format('x')
              )
              return [start, end]
            },
            onClick: picker => {
              this.clickTimeName = 'w'
            }
          },
          {
            text: '上 月',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(
                Moment()
                  .startOf('month')
                  .add(-1, 'day')
                  .startOf('month')
                  .format('x')
              )
              end.setTime(
                Moment()
                  .startOf('month')
                  .add(-1, 'day')
                  .format('x')
              )
              return [start, end]
            },
            onClick: picker => {
              this.clickTimeName = 'm'
            }
          },
          {
            text: '今 年',
            value () {
              const end = new Date()
              const start = new Date()
              const days = Moment().dayOfYear() - 1
              start.setTime(
                start.getTime() - 3600 * 1000 * 24 * days
              )
              return [start, end]
            },
            onClick: picker => {
              this.clickTimeName = 'y'
            }
          }
        ],
        disabledDate (date) {
          if (that.$route.name === 'DwellTime') {
            return Moment(date).isAfter(Moment().add(-1, 'd'))
          } else {
            return Moment(date).isAfter(Moment())
          }
        }
      }
    }
  },
  computed: {
    defaultDate: {
      get () {
        let tml = _.cloneDeep(this.value)
        return tml
      },
      set (newval) {
        return newval
      }
    }
  },
  watch: {
    // '$store.state.home.headerAction' () {
    //   this.value = []
    //   let date = [Moment().add(-1, 'd').toDate(), Moment().add(-1, 'd').toDate()]
    //   this.value = date
    // }
  },
  // activated () {
  //   this.value = []
  //   let date = [Moment().add(-1, 'd').toDate(), Moment().add(-1, 'd').toDate()]
  //   this.value = date
  // },
  mounted () {

  },
  methods: {
    selectDate (date) {
      let checkArr = []
      let ymd = 'YYYY-MM-DD'
      let today = Moment().format(ymd)
      let lastmonthDays = Moment().add(-1, 'M').daysInMonth()
      let dayOfYear = Moment().dayOfYear()
      this.options.shortcuts.forEach(e => {
        let duration = []
        e.value().forEach(o => { duration.push(Moment(o).format('YYYY-MM-DD')) })
        checkArr.push(duration)
      })
      let diff = []
      checkArr.forEach(e => {
        if (_.isEqual(e, date)) { diff.push(e) }
      })
      if (!diff.length) this.clickTimeName = ''
      else {
        let diffdays = Math.abs(Moment(date[0]).diff(date[1], 'd'))
        if (diffdays === 0) {
          if (_.difference(date, [today, today]).length) this.clickTimeName = 'l'
          else this.clickTimeName = 't'
        }
        if (diffdays === 6) this.clickTimeName = 'w'
        if (diffdays === lastmonthDays) this.clickTimeName = 'm'
        if (diffdays === dayOfYear) this.clickTimeName = 'y'
      }
      this.$emit('selectDate', date, this.clickTimeName, this.dType)
    }
  }
}
</script>
<style lang="stylus" scoped>
.idatePicker /deep/
  input
    height 43px
    font-size 14px
    font-family "source_han_sans_cn", "Roboto", sans-serif
    border 1px solid rgba(0,0,0,.2)
  i
    height 40px
    width 40px
    line-height 43px
</style>
