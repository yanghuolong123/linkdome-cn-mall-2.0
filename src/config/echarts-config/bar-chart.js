export const config= {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'none'
    }
  },
  color:['#37b5ed','#FBB03B','#2BD9CF','#E30113'],
  legend: {
    data: [],
    bottom:0,
    type:'scroll'
  },
  grid: {
    left: 30,
    right: 50,
    bottom: 40,
    top:30,
    containLabel: true
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
  xAxis: {
    type: 'category',
    axisLine:{
      show:false,

    },
    axisTick:{//刻度
      show:false,
    },
    data: []
  },
  series: []
};
