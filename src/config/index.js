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
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description vueScroll配置
   */
  vueScrollOps: {
    vuescroll: {},
    scrollPanel: {},
    rail: {
      keepShow: true,
    },
    bar: {
      hoverStyle: true,
      onlyShowBarOnScroll: true, //是否只有滚动的时候才显示滚动条
      background: '#e5e5e5',
    }
  },
}
