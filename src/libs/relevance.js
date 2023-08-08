import NP from 'number-precision'
import { directionData } from '@/api/analysis'
import { deepTraversal,findParentNodes, filterTreeByType } from '@/libs/util.js'
import moment from 'moment'
// 商铺列表
export const formatCascadeAuthData = (that, data) => {
  // 默认查询20个数据
  that.relevanceValue = []

  function get20RelevanceValue (node) {
    if (node.type_name === 'store' && that.relevanceValue.length < 20) {
      that.relevanceValue.push(node.cascadeValue)
    }
  }
  // 清除出入口
  that.relevanceList = filterTreeByType(data,['gate'])
  that.relevanceList = that.relevanceList[0] && that.relevanceList[0].children
  that.relevanceList.forEach(o=>{
    delete o.parent_id
  })
  deepTraversal(that.relevanceList,'children',o=>{
    that.$set(o,'disabled',false)
    const parentNodes = findParentNodes(o.id,that.relevanceList,true)
    that.$set(o,'cascadeValue',parentNodes)
  })
  deepTraversal(that.relevanceList, 'children', get20RelevanceValue)
  that.relevanceDataClick()
}
// 循环下标
export const d3Color = (index) => {
  var d = Math.floor(index / 5)
  var i = d > 0 ? index - d * 5 : index
  return i
}
// 有序图
export const d3Chaer = (that, name, data, idList) => {

  var cityName = name
  var matrix = data
  var width = that.$refs.relevanceChart.offsetWidth
  var height = that.$refs.relevanceChart.offsetWidth
  var innerRadius = Math.min(width, height) * 0.39
  var outerRadius = innerRadius * 1.1
  // 颜色数组
  var fill = ['#00a2ea', '#24c17f', '#ed7172', '#f2ab38', '#867bf0']
  var parent = document.querySelector('#d3Chart')
  var domSvg = document.querySelector('#svgDom')
  if (domSvg) parent.removeChild(domSvg)
  var svg = d3.select('#d3Chart').append('svg')
    .attr('id', 'svgDom')
    .attr('width', '100%')
    .attr('height', '100%')
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
  var chord = d3.layout.chord()
    .padding(0.05)
    .sortSubgroups(d3.descending)
    .matrix(matrix)
    .sortChords(d3.ascending)
  svg.append('g').selectAll('path')
    .data(chord.groups)
    .enter().append('path')
    .style('fill', function (d) {
      var index = d3Color(d.index)
      return fill[index]
    })
    .style('stroke', function (d) {
      var index = d3Color(d.index)
      return fill[index]
    })
    .style('opacity', 1)
    .attr('d', d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
  svg.append('g')
    .attr('class', 'chord')
    .selectAll('path')
    .data(chord.chords)
    .enter().append('path')
    .attr('d', d3.svg.chord()
      .radius(innerRadius))
    .style('fill', function (d) {
      var index = d3Color(d.target.index)
      return fill[index]
    })
    .style('opacity', 0.5)
  // mouseover
    .on('mousemove', function (d, i) {
      var e = event || window.event
      that.chareSvg = cityName[d.source.index] + ' →  ' + cityName[d.source.subindex] + ' : ' + d.source.value + '%'
      that.chareSvgTwo = cityName[d.target.index] + ' →  ' + cityName[d.target.subindex] + ' : ' + d.target.value + '%'
      that.svgOpacity = 1
      that.svgLeft = e.clientX + 20
      that.svgTop = e.clientY - 20
      svg.selectAll('.chord path')
        .style('opacity', 0.5)
      d3.select(this).style('opacity', 1)
    })
    .on('mouseout', function (d, i) {
      that.svgOpacity = 0
      svg.selectAll('.chord path')
        .style('opacity', 0.5)
    })
    .on('click', function (d) {
      let toId = idList[d.source.index]
      let formId = idList[d.source.subindex]
      currentShop(that, toId, formId)
    })

  var ticks = svg.append('g').selectAll('g')
  ticks.append('text')
    .data(chord.groups)
    .enter()
    .append('text')
    .each(function (d, i) {
      d.angle = (d.startAngle + d.endAngle) / 2
      d.name = cityName[i]
    })
    .attr('dy', '.35em')
    .attr('transform', function (d) {
      return 'rotate(' + (d.angle * 180 / Math.PI) + ')' +
                    'translate(0,' + -1.0 * (outerRadius + 10) + ')' +
                    ((d.angle > Math.PI * 3 / 4 && d.angle < Math.PI * 5 / 4) ? 'rotate(180)' : '')
    })
    .text(function (d) {
      return d.name
    })
}
// 来源排行 无序chart 数据列表
export const sourceList = (that, name, data) => {
  that.sourceSeniority = []
  let maxList = []
  name.forEach(function (n) { // 获取相对应实体的总和
    let obj = {}
    obj.name = n
    obj.value = 0
    data.matrixList.forEach(function (d, index) {
      if (n === d.source) obj.value += d.rate
    })
    maxList.push(obj)
  })
  maxList = _.orderBy(maxList, ['value'], 'desc') // 根据 value 排序 获取最高的实体
  let allArr = []
  maxList.forEach(function (n) { // 实体对应的最高值下的值
    var arr = []
    data.matrixList.forEach(function (d) { // 实体对应的最高值下的列表
      if (n.name === d.source) {
        let obj = {}
        obj.name = d.source
        obj.type = d.target
        obj.value = Number(d.rate)
        arr.push(obj)
      }
    })
    allArr.push(arr)
  })
  let dlArr = []
  allArr.map(function (dl) { // 实体下的对象排序
    dl = _.orderBy(dl, ['value'], 'desc')
    dlArr.push(dl)
  })
  let totalList = []
  let iconName = []
  var fill = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']

  dlArr.map(function (dd) {
    dd.map(function (ll) {
      let b = {}
      let list = []
      b.name = ll.name
      b.type = ll.type
      ll.value === 0 ? b.percent = '0' : b.percent = NP.times(Number(ll.value), 100)
      that.sourceSeniority.push(b)
      list = [ll.name, ll.type, NP.times(ll.value, 100)]
      totalList.push(list)
      iconName.push(ll.name)
      iconName.push(ll.type)
    })
  })
  iconName = _.uniq(iconName)
  iconName.map(function (d, index) {
    var obj = {}
    obj.name = d
    obj.color = fill[d3Color(index)]
    that.d3NameLists.push(obj)
  })

  that.$refs.graph.initCharts(totalList)
  if (that.allTotalData == 0) that.sourceSeniority = []
}
// 有序 整理 name id 数据 颜色
export const svgChord = (that, data) => {
  var d3AllName = []
  var d3NameId = []
  that.orderlyChangeTable = []
  that.orderlyRelevancyRanking = []
  that.isStoreData = false
  data.forEach(function (d) {
    d3AllName.push(d.source)
    //  有序转换量
    that.orderlyChangeTable.push({
      name: d.source,
      type: d.target,
      enter: Number(d.value)
    })
    that.orderlyRelevancyRanking.push({
      name: d.source,
      type: d.target,
      percent: d.rate === 0 ? '0' : NP.times(d.rate, 100)
    })
  })
  that.orderlyRelevancyRanking = _.orderBy(that.orderlyRelevancyRanking, ['percent'], 'desc')
  that.orderlyChangeTable = _.orderBy(that.orderlyChangeTable, ['enter'], 'desc')
  that.orderlyChangeTable.map((list) => {
    list.enter = list.enter.toLocaleString()
  })
  if (that.drainageType == 1) that.changeTableList = that.orderlyChangeTable

  d3AllName = _.uniq(d3AllName)
  d3AllName.forEach(value => {
    that.relevanceList.forEach(list => {
      list.children.forEach(d => {
        if (d.name == value) d3NameId.push(d.id)
      })
    })
  })
  var d3AllData = []
  that.d3NameList = []
  var fill = ['#00a2ea', '#24c17f', '#ed7172', '#f2ab38', '#867bf0']
  var totalNumber = 0
  d3AllName.forEach(function (n, index) {
    // var dataList = []
    // data.forEach(function (d, dIndex) {
    //   if (d.source === n) {
    //     var size = d.from == 0 ? 0 : NP.divide(d.to, d.from).toFixed(2)
    //     dataList.push(NP.times(size, 100))
    //     if (Number(d.rate) != 0) totalNumber += Number(d.rate)
    //   }
    // })
    // dataList.splice(index, 0, 0)
    // d3AllData.push(dataList)
    that.d3NameList.push({
      name: n,
      color: fill[d3Color(index)]
    })
    var dataLL = []
    data.forEach((list, LIndex) => {
      if (list.source === n) {
        var size = list.from == 0 ? 0 : NP.divide(list.to, list.from).toFixed(2)
        var obj = {
          index: _.findIndex(d3AllName, (val) => { return val == list.target }),
          data: NP.times(size, 100)
        }
        dataLL.push(obj)
        if (Number(list.rate) != 0) totalNumber += Number(list.rate)
      }
    })
    dataLL = _.orderBy(dataLL, 'index', 'asc')
    let dataValue = []
    dataLL.map(val => { dataValue.push(val.data) })
    dataValue.splice(index, 0, 0)
    d3AllData.push(dataValue)
  })
  totalNumber == 0 ? that.isTotalData = true : that.isTotalData = false
  setTimeout(() => {
    d3Chaer(that, d3AllName, d3AllData, d3NameId)
  });

}
// 当前商铺关系
export const currentShop = (that, idOne, idTwo) => {
  let time = moment(that.relevanceDate[0]).format('YYYY-MM-DD') + ',' +
            moment(that.relevanceDate[1]).format('YYYY-MM-DD')
  let bzid = idOne + ',' + idTwo
  directionData({ time, bzid }).then(res => {
    if (res.data.code == 200) {
      that.isStoreData = true
      that.storeDataList = []
      res.data.data.forEach(list => {
        let obj = {
          source: list.source,
          target: list.target,
          list: [{
            name: '客流转化深度',
            number: NP.times(list.rate, 100) + '%'
          },
          {
            name: '转化客流量',
            number: list.value
          }
          ]
        }
        that.storeDataList.push(obj)
      })
    }
  })
}
// 关联度排行
export const tableDataList = (that, data) => {
  let list = []
  let allName = []
  that.d3NameList = []
  that.d3NameLists = []
  that.disorderChangeTable = []
  data.matrixList.forEach(function (ele, index) {
    let arr = []
    arr.push(ele.source)
    arr.push(ele.target)
    arr.push(NP.times(ele.rate, 100))
    that.allTotalData += ele.rate
    that.listData.push(arr)

    list.push({
      name: ele.source,
      type: ele.target,
      percent: ele.rate === 0 ? '0' : NP.times(ele.rate, 100)
    })
    allName.push(ele.source)

    //  无序转换量
    that.disorderChangeTable.push({
      name: ele.source,
      type: ele.target,
      enter: Number(ele.value)
    })
  })
  that.disorderChangeTable = _.orderBy(that.disorderChangeTable, ['enter'], 'desc')
  that.disorderChangeTable.map((list) => {
    list.enter = list.enter.toLocaleString()
  })

  if (that.drainageType == 0) that.changeTableList = that.disorderChangeTable

  let nameList = _.uniq(allName)
  sourceList(that, nameList, data)
  that.disorderRelevancyRanking = _.orderBy(list, ['percent'], 'desc')
  if (that.allTotalData == 0) that.relevanceSeniority = []
  that.relevanceSeniority = that.disorderRelevancyRanking
  that.relevanceTOP3List = _.take(that.relevanceSeniority, 3).map(list => {
    return {
      name: list.name,
      type: list.type,
      number: list.percent
    }
  })
}
