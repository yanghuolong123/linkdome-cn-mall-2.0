// 定义全局map变量
var map = null
// 定义地图ID变量
var fmapID = '1310131084195823618'
// 定义路径规划对象
var naviAnalyser = null
// 起终点坐标
var coords = []
// 定义滚动型楼层切换控件
var scrollFloorControl
let thats

/**
 * 打开地图
 * */
export const openMap = (that, data, option) => {
  var mapDiv = document.getElementById('fengMap')
  var last = mapDiv.lastElementChild
  if (last) mapDiv.removeChild(last)
  option.container = document.getElementById('fengMap')
  map = new fengmap.FMMap(option)
  map.openMapById(fmapID, function (error) {
    openMap(that, data, option)
    console.log(error)
  })
  that.$store.commit('UPDATE_LOADING_STATUS', false)
  // 地图加载完成事件
  map.on('loadComplete', function () {
    naviAnalyser = new fengmap.FMNaviAnalyser(map)
    loadScrollFloorCtrl()
    data.map((list, aI) => {
      list.map((val, index) => {
        var coord = {
          x: val.x,
          y: val.y,
          groupID: val.id ? val.id : 1
        }
        if (index === 0) {
          coords[0] = coord
        } else {
          coords[1] = coord
          drawNaviLine()
        }
      })
    })
    // 聚焦楼层改变事件
    map.on('focusGroupIDChanged', function (event) {
      // console.log('地图聚焦楼层改变！', map.focusGroupID)
    })
  })
}

/**
 * 画导航线
 * */
function drawNaviLine () {
  // 根据已加载的fengmap.FMMap导航分析，判断路径规划是否成功
  var analyzeNaviResult = naviAnalyser.analyzeNavi(coords[0].groupID, coords[0], coords[1].groupID, coords[1],
    fengmap.FMNaviMode.MODULE_SHORTEST)

  if (fengmap.FMRouteCalcuResult.ROUTE_SUCCESS != analyzeNaviResult) {
    return
  }

  // 获取路径分析结果对象，所有路线集合
  var results = naviAnalyser.getNaviResults()
  // 初始化线图层
  var line = new fengmap.FMLineMarker()
  for (var i = 0; i < results.length; i++) {
    var result = results[i]
    // 楼层id
    var gid = result.groupId
    // 路径线点集合
    var points = result.getPointList()
    var points3d = []
    points.forEach(function (point) {
      points3d.push({
        'x': point.x,
        'y': point.y,
        'z': 1
      })
    })
    var seg = new fengmap.FMSegment()
    seg.groupId = gid
    seg.points = points3d
    line.addSegment(seg)
  }

  // 配置线型、线宽、透明度等
  var lineStyle = {
    lineWidth: 6,
    alpha: 0.8,
    lineType: fengmap.FMLineType.FMARROW,
    noAnimate: false
  }
  // 画线
  map.drawLineMark(line, lineStyle)
}
function loadScrollFloorCtrl () {
  /**
   * 楼层控制控件配置参数
   **/
  var scrollFloorCtlOpt = {
    // 默认在右上角
    position: fengmap.FMControlPosition.LEFT_TOP,
    // 初始楼层按钮显示个数配置。默认显示5层,其他的隐藏，可滚动查看
    showBtnCount: 6,
    // 初始是否是多层显示，默认单层显示false
    allLayer: false,
    // 是否显示多层/单层切换按钮
    needAllLayerBtn: true,
    // 位置x,y的偏移量
    offset: {
      x: 20,
      y: 20
    }
  }
  scrollFloorControl = new fengmap.FMScrollGroupsControl(map, scrollFloorCtlOpt)
  // 楼层切换
  scrollFloorControl.onChange(function (groups, allLayer) {
    thats.floorId = groups[0]
  })
}
