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
      name:'入客流',
      value:'enter'
    },{
      name:'出客流',
      value:'exit'
    },{
      name:'集客量',
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
      name: '客流量趋势'
    }, {
      icon: '62',
      value:'bar',
      name: '客流量趋势'
    }, {
      icon: 'biaoge-copy',
      value:'table',
      name: '详细数据'
    }, {
      icon: 'daoru',
      value:'download',
      name: '实体客流分析客流量趋势'
    }
  ],
  noPropertyPages:['Dashboard','EntityManage','HolidayManage','VipCustom','Account','Role','Cache'],//不需要选择购物中心的路由名称
  entityType:[
    {
      value:'area',
      name:'区域'
    },{
      value:'floor',
      name:'楼层'
    },{
      value:'mall',
      name:'购物中心'
    },{
      value:'gate',
      name:'出入口'
    },{
      value:'other',
      name:'其他'
    },{
      value:'store',
      name:'商铺'
    },{
      value:'company',
      name:'集团'
    },
  ]
}
