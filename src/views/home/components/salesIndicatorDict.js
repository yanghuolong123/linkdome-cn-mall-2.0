import i18n from '@/i18n/i18n'
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
    name: i18n.t('salesVolume'),
    icon: 'dangrixiaoshoue',
    color: '#F64F61',
    unit: i18n.t('rmbUnit'),
    yaxis: {
      title: {
        text: i18n.t('salesWithUnit')
      },
      labels: {
        formatter (value) {
          return value !== null ? value.toLocaleString() : ''
        }
      }
    }
  },
  SquaerMetre: {
    name: i18n.t('floorEffect'),
    icon: 'xingxiaoxiaoguo',
    color: '#1DD9D1',
    unit: i18n.t('flatEffUnit'),
    yaxis: {
      title: {
        text: i18n.t('flatEffWithUnit')
      },
      labels: {
        formatter (value) {
          return value !== null ? value.toLocaleString() : ''
        }
      }
    }
  },
  CloseRate: {
    name: i18n.t('turnoverRate'),
    icon: 'chengjiaohuafen',
    color: '#857AEF',
    unit: '(%)',
    yaxis: {
      title: {
        text:  i18n.t('turnoverRate')+'（%）'
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
    name: i18n.t('UnitPrice'),
    icon: 'jiage',
    color: '#33B3ED',
    unit:  i18n.t('rmbUnit'),
    yaxis: {
      title: {
        text: i18n.t('cusPriceWithUnit')
      },
      labels: {
        formatter (value) {
          return value !== null ? value.toLocaleString() : ''
        }
      }
    }
  }
}
