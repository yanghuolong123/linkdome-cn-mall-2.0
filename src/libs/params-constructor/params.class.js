import {  isEmpty,gotInnerRange } from '@/libs/util'
import store from  '@/store/store'
export class ParamsConstructor{
  constructor (params={},isHour=false){
    this.params = params;
    this.isHour = isHour;//实体客流中有按小时查询的开关
  }

  //获取全部bzid
  getBzid(){
    if(!isEmpty(this.params.entitys)){
      const bzids = this.params.entitys.map(o=>{
        return o.id
      })
      return bzids.toString()
    }else {
      return ''
    }
  }
  //若选择了购物中心则返回购物中心id（用于查集客量）
  getSelectedShopId(){
    if(!isEmpty(this.params.entitys)){
      const entity = this.params.entitys.find(o=>{
        return o.property_id == store.state.home.headerAction
      })
      return entity && entity.id
    }else {
      return ''
    }
  }
  isSingleDay(){
    const range1 = gotInnerRange(this.params.date1Array);
    const range2 = gotInnerRange(this.params.date2Array);
    if(range1 === '1month' || range2 === '1month'){
      return false
    }
    if(range1 === '1day' || range2 === '1day'){
      return false
    }
    return true
  }
  getInnerRange(){
    if(this.isHour){
      return 'Hour'
    }else {
      if(this.params.range){
        return this.params.range
      }
      const range1 = gotInnerRange(this.params.date1Array);
      const range2 = gotInnerRange(this.params.date2Array);
      if(range1 === '1month' || range2 === '1month'){
        return 'Month'
      }
      if(range1 === '1day' || range2 === '1day'){
        return 'Date'
      }
      return 'Hour'
    }
  }
  isDateCompare(){
    return (['time', 'onYear', 'onChain'].includes(this.params.compareType))
  }
  /*
  * isOccu:集客量
  * */
  getParams(isOccu){
    let data = {
      range:this.getInnerRange(),
      time1:this.params.date1Array.toString()
    }
    if(this.params.compareType === "businessType"){
      data.industry_id = this.getBzid()
    }else {
      data.bzid = isOccu?this.getSelectedShopId():this.getBzid()
    }
    if(this.isDateCompare()){
      data.time2 = this.params.date2Array.toString()
    }
    return data
  }

}
