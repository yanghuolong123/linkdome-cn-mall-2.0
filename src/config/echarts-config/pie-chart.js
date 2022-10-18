export const config= {
  tooltip: {
    trigger: 'item'
  },
  color:['#26AEEC','#26ECC9','#E30113','#feb33d',"#745AEF","#00A0A0"],
  legend: {
    orient: 'vertical',
    left: 'left',
    icon:'circle',
    top:20
  },
  series: [
    {
      type: 'pie',
      radius: '50%',
      data: [],
      label: {
        formatter:'{d}%',
        position: 'inner'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};
