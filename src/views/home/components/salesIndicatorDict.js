export default {

  // RepeatPurchaseRate: {
  //   name: '复购率',
  //   icon: 'fugoushuai',
  //   color: '#FBA940',
  //   yaxis: {
  //     title: {
  //       text: '复购率'
  //     },
  //     labels: {
  //       formatter (value) {
  //         if (typeof (value) === 'number') { return `${value}%` }
  //       }
  //     }
  //   }
  // },
  SaleAmount: {
    name: '销售额',
    icon: 'dangrixiaoshoue',
    color: '#F64F61',
    unit: '（元）',
    yaxis: {
      title: {
        text: '销售额（元）'
      },
      labels: {
        formatter (value) {
          return value !== null ? value.toLocaleString() : ''
        }
      }
    }
  },
  SquaerMetre: {
    name: '坪效',
    icon: 'xingxiaoxiaoguo',
    color: '#1DD9D1',
    unit: '（元/平方米）',
    yaxis: {
      title: {
        text: '坪效（元/平方米）'
      },
      labels: {
        formatter (value) {
          return value !== null ? value.toLocaleString() : ''
        }
      }
    }
  },
  CloseRate: {
    name: '成交率',
    icon: 'chengjiaohuafen',
    color: '#857AEF',
    yaxis: {
      title: {
        text: '成交率（%）'
      },
      labels: {
        formatter (value) {
          var size = Math.floor(Number(value) * 100) / 100
          if (typeof (size) === 'number') { return `${size}%` }
        }
      }
    }
  },
  UnitPrice: {
    name: '客单价',
    icon: 'jiage',
    color: '#33B3ED',
    unit: '（元）',
    yaxis: {
      title: {
        text: '客单价（元）'
      },
      labels: {
        formatter (value) {
          return value !== null ? value.toLocaleString() : ''
        }
      }
    }
  }
}
