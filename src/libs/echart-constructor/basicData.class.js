import { transNegToPos, findKey } from '@/libs/util'
import config from '@/config/index'
import i18n from '@/i18n/i18n'
export class BasicData {
  constructor (responseData = [], Params, quta = []) {
    this.responseData = responseData
    this.quta = quta
    this.Params = Params
    this.series = []
    this.legend = []
    this.category = []
  }
  //time1 - time2
  dateDisplayFormat(){
    const isSingleDay =this.Params.isSingleDay()
    const params = this.Params.params;
    return{
      time1(){
        if(isSingleDay){
          return params.date1Array[0]
        }else {
          if(params.date1Array[0] === params.date1Array[1]){
            return params.date1Array[0]
          }else {
            return `${params.date1Array[0]} - ${params.date1Array[1]}`
          }
        }
      },
      time2(){
        if(isSingleDay){
          return params.date2Array[0]
        }else {
          if(params.date2Array[0] === params.date2Array[1]){
            return params.date2Array[0]
          }else {
            return `${params.date2Array[0]} - ${params.date2Array[1]}`
          }
        }
      }
    }
  }
  getDateSort(obj,unit){
    let arr = [];
    const date1 = Object.keys(obj.time1).length;
    const date2 = Object.keys(obj.time2).length
    const max = Math.max(date1, date2)
    for (let i = 0; i < max; i++) {
      arr.push(i18n.t(unit,[i+1]))
    }
    return arr
  }
  //时间对比
  dateCompare () {
    switch (this.Params.getInnerRange()) {
      case 'Hour':
        this.getConfigByHour1()
        break
      case 'Date':
        this.getConfig1('fn.第_天')
        break
      case 'Month':
        this.getConfig1('fn.第_月')
        break
    }
  }

  getConfig1 (unit) {
    let category=[], series = [], legend = [];
    if(this.responseData[this.quta[0]][0]){
      category = this.getDateSort(this.responseData[this.quta[0]][0].list,unit)
    }
    this.quta.forEach((quta, qIndex) => {
      const qutaName = findKey(config.dictionary, 'value', quta, 'name')
      this.responseData[quta].forEach((o) => {
        for(let key in o.list){
          legend.push(`${o.name}|${i18n.t(qutaName)}|${this.dateDisplayFormat()[key]()}`)
          series.push({
            name:`${o.name}|${i18n.t(qutaName)}|${this.dateDisplayFormat()[key]()}`,
            data:Object.values(o.list[key]).map(data=>{
              return transNegToPos(data)
            })
          })
        }
      })
    })
    this.series = series
    this.category = category
    this.legend = legend
  }

  getConfigByHour1 () {
    let category = [], series = [], legend = []
    this.quta.forEach((quta) => {
      const qutaName = findKey(config.dictionary, 'value', quta, 'name')
      this.responseData[quta].forEach(o => {
        for(let key in o.list){
          legend.push(`${o.name}|${i18n.t(qutaName)}|${this.dateDisplayFormat()[key]()}`)
          category = Object.keys(o.list[key]).map(time=>{
            return time.substring(11, 16)
          })
          series.push({
            name:`${o.name}|${i18n.t(qutaName)}|${this.dateDisplayFormat()[key]()}`,
            data:Object.values(o.list[key]).map(data=>{
              return transNegToPos(data)
            })
          })
        }
      })
    })
    this.series = series
    this.category = category
    this.legend = legend
  }

  //实体对比
  postEntitysCompare () {
    switch (this.Params.getInnerRange()) {
      case 'Hour':
        if(this.Params.isSingleDay()){
          this.getConfig2(11, 16)
        }else {//多天按小时查询时，需要显示日期
          this.getConfig2(0, 16)
        }
        break
      case 'Date':
        this.getConfig2(0, 10)
        break
      case 'Month':
        this.getConfig2(0, 7)
        break
    }
  }

  getConfig2 (begin, end) {
    let category = [], series = [], legend = [],name;
    this.quta.forEach((quta,index)=>{
      if(this.quta.length>1 && this.responseData[quta].length > 1){
        name = findKey(config.dictionary, 'value', quta, 'name')
        legend.push(name)
        series[index] = {
          name: i18n.t(name),
          data: []
        }
        this.responseData[quta].forEach(o => {
          category.push(o.name)
          series[index].data = series[index].data.concat(_.sum(Object.values(o.list.time1)))
        })
        category = _.uniq(category)
      }else {
        this.responseData[quta].forEach(o=>{
          name = `${o.name}|${i18n.t(findKey(config.dictionary, 'value', quta, 'name'))}`
          legend.push(name)
          category = Object.keys(o.list.time1).map(date=>{
            return date.substring(begin, end)
          })
          series.push({
            name,
            data:Object.values(o.list.time1).map(data=>{
              return transNegToPos(data)
            })
          })
        })
      }
    })
    this.series = series
    this.legend = legend
    this.category = category
  }
}
