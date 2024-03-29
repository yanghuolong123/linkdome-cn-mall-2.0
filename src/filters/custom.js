import i18n from '@/i18n/i18n'
export const numberFormat = (val) => {
  if (typeof (val) === 'number') {
    return val.toLocaleString()
  } else return val
}
//把大于10000的数字转化成以万为单位的字符串
export const tenthousandFormat = val =>{
  if(typeof val === 'number'){
    if(val<10000){
      return val.toLocaleString()
    } else if(val < 11000){
      return '1' +i18n.t('10')
    }else {
      let data = (val/10000).toFixed(1);
      if(Number(data) === Math.floor(data)){
        return Math.floor(data).toLocaleString() + i18n.t('10')
      }else {
        return data.toLocaleString() +  i18n.t('10')
      }
    }
  }else {
    return val
  }
}
