import { getSaleIndicators } from '@/api/home.js'
import salesDict from '@/views/home/components/salesIndicatorDict.js'
import NP from 'number-precision'
export default {
  methods: {
    getSalesData ({ time1, isCompare = 1, time2, propertyId,company_id }) {
      /**
       * time1 string Y 2019-05-20,2019-05-21
       *  property_idint N 购物中心id, 不传为全部购物中心
       *  is_compareint N为1 ,首页 ， 同比，环比，需要传
       *  time2
       */
      let params = { time1, is_compare: isCompare, time2, property_id: propertyId === 'company' ? null : propertyId,company_id }
      return new Promise((resolve, reject) => {
        try {
          getSaleIndicators(params, this)
            .then(res => {
              const { data: { data: resObj } } = res
              delete resObj.RepeatPurchaseRate// 暂时删除复购率2019-06-05
              let handledData = Object.keys(resObj).map(e => {
                let formatVal = ['CloseRate', 'RepeatPurchaseRate'].includes(e) ? `${resObj[e].value * 100}%` : resObj[e].value
                if (['SaleAmount', 'UnitPrice'].includes(e)) {
                  // 销售额客单价取整https://trello.com/c/aYSPNXAB/28-v22-%E3%80%90mall%E3%80%91%E3%80%90%E9%94%80%E5%94%AE%E5%88%86%E6%9E%90%E3%80%91%E3%80%900617%E3%80%91%E9%A6%96%E9%A1%B5%E5%8F%8A%E9%94%80%E5%94%AE%E5%88%86%E6%9E%90%E4%B8%AD%EF%BC%8C%E9%94%80%E5%94%AE%E9%A2%9D%E5%92%8C%E5%AE%A2%E5%8D%95%E4%BB%B7%E4%B8%8D%E9%9C%80%E8%A6%81%E4%BF%9D%E7%95%99%E4%B8%A4%E4%BD%8D%E5%B0%8F%E6%95%B0%EF%BC%8C%E7%9B%B4%E6%8E%A5%E5%8F%96%E6%95%B4%E6%95%B0%E5%8D%B3%E5%8F%AF
                  formatVal = parseInt(formatVal)
                }
                let tml = {}
                if (salesDict[e]) {
                  tml = {
                    id: e,
                    name: `${salesDict[e].name}${salesDict[e].unit ? salesDict[e].unit : ''}`,
                    type: {
                      icon: salesDict[e].icon,
                      color: salesDict[e].color || '#1dd9d1'
                    }
                  }
                }

                if (resObj[e].hasOwnProperty('compareRate')) {
                  // 时间对比
                  let size = NP.times(Number(resObj[e].compareRate), 100)
                  tml.compareRate = `${size}%`
                  tml.time1 = time1.split(',').join('-')
                  tml.time2 = time2.split(',').join('-')
                }
                if (isCompare) {
                  tml.data = {
                    number: formatVal,
                    ringRatio: resObj[e].chainRatioRate,
                    lastRatio: resObj[e].YearOnYearRate
                  }
                } else tml.data = formatVal
                return tml
              })
              resolve(handledData)
            })
            .catch(err => {
              reject(err)
            })
        } catch (err) {
          resolve(err)
        }
      })
    }
  }
}
