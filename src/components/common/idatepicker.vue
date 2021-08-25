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
export default {
  name: 'idatePicker',
  props: {
    disabled:{
      type:Boolean,
      default:false
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
            text: this.$t('datePicker.yesterday'),
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
            text:this.$t('datePicker.lastWeek'),
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
            text:this.$t('datePicker.lastMonth'),
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
            text:this.$t('datePicker.thisYear'),
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
          if(!['EntityNew','Entity'].includes(that.$route.name)){
            return  date && date.valueOf() > Date.now() - 86400000
          }else{
            return  date && date.valueOf() > Date.now()
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
