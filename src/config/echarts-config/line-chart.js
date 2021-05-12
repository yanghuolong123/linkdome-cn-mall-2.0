export const config = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: [],
    bottom:0,
    type:'scroll'
  },
  color:['#37b5ed','#FBB03B','#2BD9CF','#E30113'],
  grid: {
    left: 30,
    right: 50,
    bottom: 40,
    top:30,
    containLabel: true
  },
  dataZoom: [{
    type: 'slider',
    zoomLock:false,
    show: true, //flase直接隐藏图形
    xAxisIndex: [0],
    left: '4%', //滚动条靠左侧的百分比
    bottom: 30,
    start: 0,//滚动条的起始位置
    end:10 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
  }],
  xAxis: {
    type: 'category',
    axisLine:{
      show:false,

    },
    axisTick:{//刻度
      show:false,
    },
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value',
    axisTick:{//刻度
      show:false,
    },
    axisLine:{//坐标轴
      show:false,

    },
  },
  series: []
}
