import i18n from '@/i18n/i18n'
// 目标达成分析折线图
export const options0 = {
  chart: {
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    },
    animations: {
      enabled: false
    }

  },
  colors: ['#00A0E9', '#897FF0', '#EA5455', '#FF9F43', '#1E1E1E'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight',
    width: 2
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
      formatter: (value) => { return Number(value.toFixed(0)).toLocaleString() }
    }
  },
  tooltip: {
    y: {
      formatter: function (val) {
        if(val===0) return 0 + i18n.t('人次')
        if (val == undefined || val == null || val == '') return ''
        else  return val.toLocaleString() +i18n.t('人次')
      }
    }
  },
  markers: {
    size: 5,
    hover: {
      sizeOffset: 2
    }
  }
}
// 目标达成分析柱状图
export const options2 = {
  chart: {
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    },
    events: {

    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      endingShape: 'rounded',
      columnWidth: '20%',
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
      formatter: (value) => { return Number(value.toFixed(0)).toLocaleString() }
    }
  },
  tooltip: {
    y: {
      formatter: function (val) {
        if(val===0) return 0+ i18n.t('人次')
        if (val == undefined || val == null || val == '')  return ''
        else return val.toLocaleString() + i18n.t('人次')
      }
    }
  }
}
