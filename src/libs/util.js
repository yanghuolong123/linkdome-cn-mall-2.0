import Cookies from 'js-cookie'
import i18n from '../i18n/i18n'
// cookie保存的天数
// import { forEach, hasOneOf} from '@/libs/tools'
import Moment from 'moment'
import _ from 'lodash'

export const TOKEN_KEY = 'token'
export const setToken = (token, expiresTime) => {
  if (expiresTime) Cookies.set(TOKEN_KEY, token, { expires: expiresTime })
  else Cookies.set(TOKEN_KEY, token)
}
export const hasOneOf = (targetarr, item) => {
  return targetarr.some(e => item.indexOf(e) > -1)
}
export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}
export const hasChild = item => {
  return item.children && item.children.length > 1
}

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}
/**
     * @param {Array} list 通过路由列表得到菜单列表
     * @access
     * @returns {Array}
     */
    // 菜单列表

export const getMenuByRouter = (list, access,saleStatus,menuList) => {
  let res = []
  let lists = _.cloneDeep(list)
  lists.forEach(function (m) {
    let findOne = _.find(menuList, ['name', m.name])
    if (findOne) {
      if (!(m.meta)) {
        m.meta = {}
      }
      m.meta.access = [findOne.id + '']
    }
    if (m.children) {
      m.children.forEach(function (k) {
        menuList.forEach(function (e) {
          let findTwo = _.find(e.subpagesList, ['name', k.name])
          if (findTwo) {
            if (!(k.meta)) {
              k.meta = {}
            }
            k.meta.access = [findTwo.id + '']
          }
        })
      })
    }
  })
  lists.forEach(e => {
    if (!e.meta || (e.meta && !e.meta.hideInMenu)) {
      if(Number(saleStatus)===0){//不显示销售
        if(e.name!=="CommodityAnalytics"&&e.name!=="ChangeStore"&&e.name!=="SalesDimensions"&&e.name!=="ShopPortrait"){
          let obg = {
            url: e.name,
            name: e.name,
            icon: e.meta && e.meta.icon,
            i18n: e.name,
            meta: e.meta || ''
          }
          if (hasChild(e) && showThisMenuEle(e, access)) obg.submenu = getMenuByRouter(e.children, access,saleStatus,menuList)
          if (showThisMenuEle(e, access)) res.push(obg)
        }
      }else{
        let obg = {
          url: e.name,
          name: e.name,
          icon: e.meta && e.meta.icon,
          i18n: e.name,
          meta: e.meta || ''
        }
        if (hasChild(e) && showThisMenuEle(e, access)) obg.submenu = getMenuByRouter(e.children, access,saleStatus,menuList)
        if (showThisMenuEle(e, access)) res.push(obg)
      }
    }
  })
  return res
}



/**
     * @description根据时间选择器选择的时间范围返回innerrange
     * @param [] date
     */
export const gotInnerRange = date => {
  if(!date.length) {
    return ''
  }
  const [start, end] = date
  let startTime = Moment(start)
  let endTime = Moment(end)
  let diffDays = Moment.duration(endTime.diff(startTime)).asDays()
  let innerRange = ''
  if (diffDays === 0) innerRange = '1h'
  else if (diffDays < 60) innerRange = '1day'
  else innerRange = '1month'
  return innerRange
}
export const formatTableData = (data, keys) => {
  /**
     * @param data,原始表格数据，
     * @param keys,需要添加千分符的键
     * @returns 添加千分符后的数据
     */
  let cloneData = _.cloneDeep(data, keys)
  cloneData.forEach(e => {
    keys.forEach(k => {
      if (e.hasOwnProperty(k)) e[k] = e[k] === null ? null : `${e[k].toLocaleString()}人`
    })
  })
  return cloneData
}
export const formatXaxis = (params) => {
  // 2019-01-16 00:00:00
  const { beginDate, innerRange } = params
  if (innerRange === '1h') return `${beginDate.split(' ')[1].slice(0, 5)}`
  else if (innerRange === '1day') return `${beginDate.split(' ')[0]}`
  else return `${beginDate.split(' ')[0].slice(0, 7)}`
}
/**
     * 表单手机号验证
     */
export const validateTel = (rule, value, callback) => {
  var reg = /^1[345789]\d{9}$/
  if (value === undefined || value === '' || value === null) {
    callback()
  } else
  if (!reg.test(value)) {
    callback(new Error('手机号码有误'))
  } else {
    callback()
  }
}
/**
     * 表单选择器多选验证
     */
export const validateSelectMore = (rule, value, callback) => {
  if (value === undefined || value === '' || value.length < 1) {
    callback(new Error(i18n.t('holder.Select')))
  } else {
    callback()
  }
}
export const validName = (rule, value, callback) => {
  if (value === undefined || value === '') {
    callback(new Error(i18n.t('fn.cantBeEmpty',[i18n.t('name')])))
  } else if (value.length > 10) {
    callback(new Error('最多输入10个字符'))
  } else {
    callback()
  }
}
export const validRemark = (rule, value, callback) => {
  if (value === null || value === undefined) {
    callback()
  } else if (value.length > 50) {
    callback(new Error('最多输入50个字符'))
  } else {
    callback()
  }
}
export const isAllZero = (data) => {
  /**
     * 图标重绘数据检测，如果全是零则视为无数据
     */
  let flag = true
  if (data.length) {
    if (typeof (data[0]) === 'object') {
      data.forEach(i => {
        if (i.data.length) {
          let neArray = _.without(i.data, 0, null)
          if (neArray.length !== 0) flag = false
        }
      })
    } else {
      let neArray = _.without(data, 0, null)
      if (neArray.length !== 0) flag = false
    }
  }
  return flag
}
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

export const formatNumber = (num) => {
  num = Number(num)
  num = isNaN(num) ? 0 : num
  return num
}
export const thousandSeparator = (num) => {
  num = Number(num)
  num = isNaN(num) ? 0 : num
  num = num.toLocaleString()
  return num
}
export const barOptions = {
  chart: {
    type: 'bar',
    stacked: true,
    zoom: {
      enabled: true
    },
    toolbar: {
      show: false
    },
    events: {
      dataPointSelection: function (event, chartContext, config) {}
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      endingShape: 'rounded',
      columnWidth: '45%',
      radius: 0,
      distributed: false
    }
  },
  colors: ['#00A0E9', '#897FF0', '#EA5455', '#FF9F43', '#1E1E1E'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  title: {
    text: '',
    align: 'left'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on
      opacity: 0.5
    }
  },
  noData: {
    text: '暂无数据',
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
    style: {
      color: undefined,
      fontSize: '14px',
      fontFamily: undefined
    }
  },
  xaxis: {
    categories: []
  },

  yaxis: {
    title: {
      text: ''
    },
    min: 0,
    labels: {
      show: true,
      formatter: (value) => {
        if (typeof (value) === 'number') {
          if (value < 10) {
            return value
          } else {
            return Number(value.toFixed(0)).toLocaleString()
          }
        } else {
          return value
        }
      }
    }
  },
  tooltip: {
    y: {
      formatter:  (val)=> {
        if (val == undefined || val == null || val == '') {
          return ''
        } else {
          return val.toLocaleString() + this.$t('person')
        }
      }
    }
  }
}

export const yearList = () => {
  let arr = []
  let year = Moment('2019-01-01').year()
  let i = -1
  while (++i < 3) {
    arr.push({
      key: year,
      value: year
    })
    year++
  }
  return arr
}
export const initTimes = (val) => {
  let hour = ''
  let minute = ''
  let second = val
  if (val > 3600) {
    hour = Math.floor(val / 3600)
    hour = hour >= 10 ? hour : '0' + hour
    second = val % 3600
  } else {
    hour = '00'
  }
  if (second > 60) {
    minute = Math.floor(second / 60)
    minute = minute >= 10 ? minute : '0' + minute
    second = Math.floor(second % 60)
  } else {
    minute = '00'
  }
  if (second > 0) {
    second = second >= 10 ? second : '0' + second
  } else {
    second = '00'
  }
  return hour + ':' + minute + ':' + second
}
// 日期控件不可选择日期限制
export const disabledDate = {
  disabledDate (date) {
    return date && date.valueOf() > Date.now() - 86400000
  }
}

export const deepFind = (arr, condition, children='children') => {
  let result = null
  // 用try方案方便直接中止所有递归的程序
  try {
    (function poll(arr, level) {
      if (!Array.isArray(arr)) return
      // 遍历数组
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        result = item
        const isFind = condition && condition(item, i, level) || false

        // 如果已经找到了
        if (isFind) {
          // 直接抛出错误中断所有轮询
          throw Error

          // 如果存在children，那么深入递归
        } else if (children && item[children] && item[children].length) {
          poll(item[children], level + 1)

          // 如果是最后一个且没有找到值，那么通过修改数组长度来删除当前项
        } else if (i === arr.length - 1) {
          // 删除占位预设值
          result = null
        }
      }
    })(arr, 0)
    // 使用try/catch是为了中止所有轮询中的任务
  } catch (err) {}
  return result
}
export const deepTraversal = (arr, child, callback) => {
  function traversal (a) {
    a.forEach(o => {
      callback(o)
      if (o[child] && o[child].length) {
        traversal(o[child])
      }
    })
  }
  traversal(arr)
}
// 给级联树的最后一级加全部按钮
export const findCascadeLastLevel = (arr, child, callback) => {
  function traversal (a) {
    for (let i = 0; i < a.length; i++) {
      if (a[i][child] && a[i][child].length ||['floor','other'].includes(a[i].type_name)) {//a[i].type_name==='floor'  专为解决楼层下无实体时，全部按钮加在了楼层列
        traversal(a[i][child]||[])
      } else {
        callback(a)
        return
      }
    }
  }
  traversal(arr)
}
// 找到联树的最后一级处理全选
export const findCascadeLastNode = (arr, child, callback) => {
  function traversal (a) {
    a.forEach(o => {
      if (o[child] && o[child].length) {
        traversal(o[child])
      } else {
        callback(o)
      }
    })
  }
  traversal(arr)
}
// 二维数组去重
export const getUnique = (arr) => {
  var temp
  var count
  for (var i = 0; i < arr.length; i++) { // 第一次遍历数组，确保数组里的子数组都能被检测
    temp = arr[i] // 存储被检测的当前子数组
    for (var k = 0; k < arr.length; k++) {
      if (k != i && arr[k].length == temp.length) { // 第二次遍历数组，检测除了被检测数组本身以及两者长度不一样的子数组
        count = 0 // 初始化
        for (var j = 0; j < arr[k].length; j++) { // 遍历检测的子数组
          if (arr[k][j] == temp[j]) {
            count++ // 记录检测子数组与被检测子数组中的元素重复次数
          }
        }
        if (count == temp.length) { // 如果次数与被检测子数组的长度相等，代表两者重复
          arr.splice(k, 1) // 删除该重复元素
          k-- // 数组长度变化，K需要减一回到当前位置
        }
      }
    }
  }
  return arr
}

// 构造十二月份的json数据 返回[{arg1:1月,arg2:null,arg3:null,...},...]
export const initMonthsData = (...arg) => {
  let monthArr = []
  for (let i = 1; i < 13; i++) {
    let obj = {}
    obj[arg[0]] = `${i}mon`
    for (let j = 1, m; m = arg[j++];) {
      obj[m] = null
    }
    monthArr.push(obj)
  }
  return monthArr
}
// 热力图：找已存在的二维数组
export const hasHeatMapData = (targetArr, x, y) => {
  if (!targetArr.length) return false
  let result
  for (let i = 0; i < targetArr.length; i++) {
    const node = targetArr[i]
    if (node.x_num === x && node.y_num === y) {
      result = {
        node,
        i
      }
      break
    };
  }
  return result
}
//级联数据 获取第一个叶子节点
export const getCascadeFstLeaf = (arr,child,id='id') =>{
  let result = [];
  function traversal (a) {
    result.push(a[0][id]);
    if(a[0][child] && a[0][child].length){
      traversal(a[0][child])
    }
  }
  traversal(arr)
  return result
}
export const isEmpty = (value) => {
  let type;
  if (value == null) {
    return true
  }
  type = Object.prototype.toString.call(value).slice(8, -1)
  switch (type) {
    case 'String':
      return value.length === 0
    case 'Array':
      return !value.length
    case 'Object':
      return Object.keys(value).length === 0 && value.constructor === Object
    default:
      return false
  }
}

export const downloadEx =(fun,name,value)=>{
  value[1].map(list=>{
    Object.keys(list).map(k=>{
      if(!_.isNumber(list[k])){
      list[k] = list[k].replace(',','')
      }
    })
  })
  fun(value).then(res => {
    let date = new Date()
    const blob = new Blob([res.data])
    let fileName = name + Moment(date).format('YYYYMMDDHHmmss') + '.xls'
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href)// 释放URL 对象
    document.body.removeChild(elink)
  })
}
export const findKey = (arr,valueKey,value,targetkey)=>{
  const node = arr.find(o=>{
    return o[valueKey] === value
  })
  if(node){
    return node[targetkey]
  }else {
    return ''
  }
}
//将负数转为正数
export const transNegToPos = (number)=>{
  return Number(number)<0?0:Number(number)
}
//获取最大值的下标
export const getMaxIndex = (arr) => {
  var max = arr[0];
  var index = 0;
  for (var i = 0; i < arr.length; i++) {
    if (max < arr[i]) {
      max = arr[i];
      index = i;
    }
  }
  return index;
}
/*
* 获取（同比，环比）日期
* params{
*   date:原始时间 数据类型为数组时，表示时间范围；字符串表示单天时间
*   compateType：对比类型（同比，环比）
* }
* */
export const getCompareDate = (originDate,compateType) => {
  if(Array.isArray(originDate)){
    switch (compateType) {
      case 'onYear'://同比
        return [
          Moment(originDate[0]).add(-1, 'y').format('YYYY-MM-DD'),
          Moment(originDate[1]).add(-1, 'y').format('YYYY-MM-DD')
        ]
      case 'onChain'://环比
        const diff = Moment(originDate[0]).diff(Moment(originDate[1]), 'days') - 1
        return [
          Moment(originDate[0]).add(diff, 'd').format('YYYY-MM-DD'),
          Moment(originDate[1]).add(diff, 'd').format('YYYY-MM-DD')
        ]
    }
  }else {
    switch (compateType) {
      case 'onYear'://同比
        return Moment(originDate).add(-1, 'y').format('YYYY-MM-DD')
      case 'onChain'://环比
        return Moment(originDate).add(-1, 'd').format('YYYY-MM-DD')
    }
  }

}
/*
* arr : 组织结构树
* typeNames : 需要的实体类型数组
* */
export const filterTreeByType = (arr,typeNames)=>{
  let emptyArr = [];
  for (let item of arr) {
    if (!typeNames.includes(item.type_name) ) {
      if (item.children &&Array.isArray(item.children)&& item.children.length > 0) {
        item.children = filterTreeByType(item.children,typeNames);
        if(!item.children.length){
          delete item.children
        }
      }
      emptyArr.push(item);
    } else if (item.children&&Array.isArray(item.children) && item.children.length > 0) {
      item.children = filterTreeByType(item.children,typeNames);
      if (item.children.length) {
        emptyArr.push(item);
      }else {
        delete item.children
      }
    }
  }
  return emptyArr;
}
/*
* 通过当前id查询当前节点在树上的所有父节点
* hasSelf:是否包含自己
* */
export const findParentNodes = (id,tree,hasSelf = false)=>{
  let parentNodes = [];
  search(id,tree)
  function search (id,tree) {
    const node = deepFind(tree,o=>{
      return o.id === id
    })
    if(node&&node.parent_id){
      parentNodes.unshift(node.parent_id)
      search(node.parent_id,tree)
    }
  }
  if(hasSelf){
    parentNodes.push(id)
  }
  return parentNodes
}
//单词首字母大写
export const capitalize = (str)=>{
  return str.charAt(0).toUpperCase() + str.slice(1)
}
//大写消息中每个单词的第一个字符
export const titleCase = (str,ignoreList) => {
  function fnname (msg) {
    function capitalize(msg) {
      if(ignoreList !== undefined) {
        if(ignoreList.includes(msg)) {
          return msg;
        }
      }
      return msg.charAt(0).toUpperCase() + msg.slice(1)
    }
    let arr = msg.split(' ');
    arr.forEach( (item,index,arr) => {
      arr[index] = capitalize(item);
    })
    return arr.join(" ");
  }
  return fnname (str);
}

export const mf = function mf(textgroup, fn) {
  // 该函数将一个对象内所有数据进行格式化
  if (typeof textgroup !== "object") {
    if (textgroup === undefined) return false;
    return true;
  }
  for (let i in textgroup) {
    if (mf(textgroup[i], fn)) textgroup[i] = fn(textgroup[i]);
  }
  return false;
};
export const replaceBraces= function (str, replacement) {
  // 正则表达式匹配{{和}}，并且它们之间可以有任何字符（包括另一个大括号表示字面量）
  const regex = /{{([^}{}]*)}}/g;
  return str.replace(regex, replacement);
}
