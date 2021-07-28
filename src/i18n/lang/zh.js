module.exports =  {
  changeLang: "English",
	fn: {
		_: "{0}{1}",
		Parentheses: "（{0}）",//this.$t('fn._', [this.$t('sales'), this.$t('fn.Parentheses', [this.$t('yuan')])])
		require: "请输入{0}",
		inputHolder: "请输入{0}",
		get: "获取{0}",
		send: "发送{0}",
		successTo: "{0}成功！",
		failedTo: "{0}失败。",
		askConfirm: "确定要{0}？",
		refreshTime: "{0}刷新一次",
		average: "平均{0}",//this.$t('fn.average', [this.$t('enter')])
		peak: "{0}峰值",//this.$t('fn.peak', [this.$t('occupancy')])
		total: "总{0}",//this.$t('fn.total', [this.$t('enter')])
		effective: "有效{0}",//this.$t('fn.effective', [this.$t('enter')])
		trend: "{0}趋势",
    detailData: "{0}详细数据信息",
	},


	account: "账户",
  accountNum: "账号",
  password: "密码",
  analysisPlatform: "凌图智慧商业综合分析平台",
  forgetPassword: "忘记密码？",
  rememberPassword: "记住密码",
  login: "登录",
	jumpPath: "跳转路径",
	realTimeDataToday: "今日实时数据",
	realTimePassengerFlow: "实时客流",
	cumulativePassengerFlowOfTheDay: "当日累积客流（人次）",
	cumulativePassengerFlowOfTheMonth: "当月累积客流（人次）",
	monthlyStandardValue: "月达标值（人次）",
	passengerFlowachievementRateOfThisMonth: "本月客流达成率",
	minute: "分钟",
	second: "秒",
	enter: "客流量",
	occupancy: "集客量",
	sales: "销售额",
	yuan: "元",
	同比: "同比",
	环比: "环比",
  客流占比: "客流占比",
  有效客流趋势: "有效客流趋势",


	historicalDataQuery: "历史数据查询",
  // Itabs.vue => titleList[value]
	客流量趋势: "客流量趋势",
	集团业态排行: "集团业态排行",
	详细数据: "详细数据",
	购物中心业态排行: "购物中心业态排行",
	请选择: "请选择",
  排行分析: "排行分析",
  年龄分布: "年龄分布",
  性别分布: "性别分布",
  新老顾客占比: "新老顾客占比",
  到店次数占比: "到店次数占比",
  客流排行: "客流排行",
  到店次数: "到店次数",

  //Main.vue => routeTitle
  实体客流分析: "实体客流分析",
  年龄性别分析: "年龄性别分析",
  排行占比分析: "排行占比分析",
  进店率分析: "进店率分析",
  热力图分析: "热力图分析",
  有效客流分析: "进店率分析",
  排队货架分析: "进店率分析",
  关联分析: "关联分析",
  交叉客流分析: "交叉客流分析",
  路径动向分析: "路径动向分析",
  实体引流分析: "实体引流分析",
  停留时间分析: "停留时间分析",
  目标达成分析: "目标达成分析",
  节假日活动分析: "节假日活动分析",
  销售分析: "销售分析",
  门店日报: "门店日报",
  日报: "日报",
  周报: "周报",
  月报: "月报",
  自定义报告: "自定义报告",
  实体管理: "实体管理",
  节假日活动管理: "节假日活动管理",
  账户管理: "账户管理",
  权限管理: "权限管理",
  // src\views\entity-analytic\index.vue

  // Chart-box.vue => toolList[tool]&&toolList[tool].name
  集客量趋势: "集客量趋势",
  // class="go-shop-time-icon"
  进店率TOP10排行分析: "进店率TOP10排行分析",
  结账排队分析: "结账排队分析",
  货架触摸分析: "货架触摸分析",
  进店率趋势分析: "进店率趋势分析",

  // Cards.vue
  有效客流: "有效客流",
  重复客流: "重复客流",
  平均到访次数: "平均到访次数",
  
	// goalCharts.vue => title1
  平均到访频次趋势: "平均到访频次趋势",
  
  // RelavanceTab.vue =>item.label
  关联关系无序图: "关联关系无序图",
  关联关系有序图: "关联关系有序图",
  // RElavance.vue
  '关联度TOP3：': "关联度TOP3：",
  // VxCard.vue => title
  关联度排行: "关联度排行",
  转化量排行: "转化量排行",

	fx: {
		minute: "分钟",
		second: "秒",
		// .replace("分钟", $t('fx.minute')).replace("秒", $t('fx.second'))
		day: "天",
		sales_yuan: "@:(sales)（@:(yuan)）",
		Data_indicators: "数据指标：",
		enter_trend: "客流量趋势",
	},
	holder: {
		请选择: "请选择",
    暂无数据: "暂无数据",// $t('holder.暂无数据')
    //{{ $t('holder.暂无数据') }}
	},

	
	notices: {
		wrongPassword: "您的账号或密码输入错误",
		NoPermission: "抱歉，你没有权限",
		systemException: "系统异常！",
	},
	passages: {
		tootipText1: "平均客流量：所有购物中心实时累计客流之和除以购物中心个数\n客流峰值：所有购物中心当中客流峰值的最大值\n集客量峰值：所有购物中心当中集客量峰值的最大值\n今日集客量：所有购物中心集客量之和",
		tootipText2: "今日平均客流量：累计客流量除以营业小时数\n今日客流峰值：从开始营业时间到目前时刻客流最大值\n今日集客量峰值：从开始营业时间到目前时刻购物中心中驻留人数的最大值和时间点\n今日集客量：从开始营业时间到目前时刻的进入总客流与离开总客流之差",
		tootipText3: "平均客流量：所选时间段内所有购物中心累计客流量除以购物中心个数\n总客流： 所选时间段内的所有购物中心客流之和\n客流峰值：所选时间段内的所有购物中心当中客流峰值的最大值\n集客量峰值：所选时间段内所有购物中心当中集客量峰值的最大值\n有效客流：所选时间段内所有购物中心的唯一客流人数之和\n销售额：所选时间段内所有购物中心销售额之和",
	},

	// router
	Dashboard: '首页',
	Analytics: '客流分析',
	Entity: '实体客流分析',
	AgeGender: '年龄性别分析',
	Ranking: '排行占比分析',
	GoShop: '进店率分析',
	HeatMap: '热力图分析',
	Effective: '有效客流分析',
	Queue:'排队货架分析',
	Generatrix: '顾客行为分析',
	Relevance: '店铺关联分析',
	Cross: '交叉客流分析',
	OldPath: '路径动向分析',
	PathTrend: '路径动向分析(新)',
	'3DPath':'3D路径动向分析',
	Drainage: '实体引流分析',
	DwellTime: '停留时间分析',
	Operation: '运营分析',
	Goal: '目标达成分析',
	Holiday: '节假日活动分析',
	SalesAnalytics: '销售分析',
	Report: '报告详情',
	StoreDailyReport: '门店日报',
	DailyReport: '日报',
	WeekReport: '周报',
	MonthReport: '月报',
	CustomizeReport: '自定义报告',
	Admin: '后台管理',
	EntityManage: '实体管理',
	HolidayManage: '节假日活动管理',
	Account: '账户管理',
	Role: '权限管理',

	HolidayAnalysis: '节假日活动分析',
	VipCustom: 'VIP 客户管理',
	shopPortrait: '店铺画像',
	changeStore: '调铺效果分析',
	CommodityAnalytics: '商品分析',
	
}