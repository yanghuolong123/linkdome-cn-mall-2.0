import i18n from '@/i18n/i18n'
export default {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: true,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: '',
    pro: '/api/v1'
  },
  // pdfBaseUrl:process.env.NODE_ENV === 'development' ?'://127.0.0.1:6990':'://192.168.3.185:6990',
  // pdfBaseUrl:'://127.0.0.1:6990',
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  dictionary:[
    {
      name:'Incoming',
      value:'enter'
    },{
      name:'Outbound',
      value:'exit'
    },{
      name:'occupancy',
      value:'occupancy'
    },{
      name:'楼层',
      value:'floor',
    },{
      name:'商铺',
      value:'store'
    },{
      name:'出入口',
      value:'gate'
    },{
      name:'区域',
      value:'area'
    }
  ],
  toolList: [
    {
      icon: 'zhexiantu',
      value:'line',
      name: 'enterTrend'
    }, {
      icon: '62',
      value:'bar',
      name: 'enterTrend'
    }, {
      icon: 'biaoge-copy',
      value:'table',
      name: 'detailDt'
    }, {
      icon: 'daoru',
      value:'download',
      name: 'entityFlowTrend'
    }
  ],
  toolListOccu: [
    {
      icon: 'zhexiantu',
      value:'line',
      name: 'occupancyTrend'
    }, {
      icon: '62',
      value:'bar',
      name: 'occupancyTrend'
    }, {
      icon: 'biaoge-copy',
      value:'table',
      name: 'detailDt'
    }, {
      icon: 'daoru',
      value:'download',
      name: 'occupancyFlowTrend'
    }
  ],
  noPropertyPages:['Dashboard','Cache'],//不需要选择购物中心的路由名称
  entityType:[
    {
      value:'area',
      name:'area'
    },{
      value:'floor',
      name:'floor'
    },{
      value:'mall',
      name:'shopmall'
    },{
      value:'gate',
      name:'gate'
    },{
      value:'other',
      name:'Other'
    },{
      value:'store',
      name:'store'
    },{
      value:'company',
      name:'company'
    },
  ]
}
