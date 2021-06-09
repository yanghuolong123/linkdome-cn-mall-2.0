
import { getActiveDays } from '@/api/manager'
import { getanalysiseeo } from '@/api/home'
import Moment from 'moment'
export default {
  data () {
    return {
      holiyData: [],
      allholidays: []
    }
  },
  mounted () {
  },
  methods: {
    getHolidays () {
      let year = Moment().year()
      return Promise.all([getActiveDays(year, 20), getActiveDays(year, 21)]).catch(err => {
        console.log(err)
      })
    },
    findDaysInMonth (data, month) {
      /**
       * @description return days which in current month from all holidays and activeday
       */
      let days = []
      let parsePatt = 'YYYY-MM'
      let ymd = 'YYYY-MM-DD'
      if (!data.length) return
      let startMonth = Moment(month, parsePatt).startOf('month')
      let endMonth = Moment(month, parsePatt).endOf('month')
      data.forEach(e => {
        if (Moment(e.begin).isBetween(startMonth, endMonth) || Moment(e.end).isBetween(startMonth, endMonth)) {
          if (Moment(e.begin).isBefore(startMonth))e.begin = startMonth.format(ymd)// 节假日起始终止日期不在当月内
          if (Moment(e.end).isAfter(endMonth))e.end = endMonth.format(ymd)
          days.push(e)
        }
      })
      return days
    },
    async fetchData (bzid, month) {
      /**
         * @bzid:当前propertyId
         * @month:需要请求的月份
         * @return Array
         */
      let res = await this.getHolidays()
      this.allholidays = this.findDaysInMonth(res[0].data.data.concat(res[1].data.data), month)
      let promises = this.allholidays.map(e => {
        return getanalysiseeo({
          innerRange: e.duration === 1 ? '1h' : '1day',
          range: `${e.begin},${e.end}`,
          type: 'enter',
          bzid
        })
      })
      return Promise.all(promises)
    }
  }
}
