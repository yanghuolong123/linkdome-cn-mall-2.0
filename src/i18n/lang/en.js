module.exports =  {
  changeLang: "简体中文",
	fn: {
		_: "{0} {1}",
		Parentheses: "（{0}）",
		require: "{0} is required",
		inputHolder: "{0}",
		get: "get {0}",
		send: "send {0}",
		successTo:"{0} successfully!",
		failedTo: "failed to {0}.",
		askConfirm: "Are you sure you want to {0}?",
		refreshTime: "Refresh every {0}",
		average: "average {0}",
		peak: "peak {0}",
		total: "total {0}",
		effective: "effective {0}",
		trend: "{0} trend",
    detailData: "Detailed data of {0}",
    累计客流: "Total enter: {0}",
    转化率: "Conversion rate: {0}%",
	},

	
	account: "Account",
  accountNum: "account number",
  password: "password",
  analysisPlatform: "Business Analysis Platform",
  forgetPassword: "Forget your password?",
  rememberPassword: "Remember password",
  login: "Login",
	jumpPath: "Jump path",
	realTimeDataToday: "Real time data today",
	realTimePassengerFlow: "Real time @:(enter)",
	cumulativePassengerFlowOfTheDay: "Cumulative @:(enter) of the day (person time)",
	cumulativePassengerFlowOfTheMonth: "Cumulative @:(enter) of the month (person time)",
	monthlyStandardValue: "Monthly standard value (person time)",
	passengerFlowachievementRateOfThisMonth: "@:(enter) achievement rate of this month",
	minute: "minute",
	second: "second",
	enter: "enter",
	客流量: "enter",
  时间: "time",
	occupancy: "occupancy",
	sales: "sales",
	yuan: "yuan",
	同比: "over the previous year",
	环比: "link relative ratio",
	historicalDataQuery: "Historical data query",
  客流占比: "Proportion of enter",
  有效客流趋势: "Effective enter flow trend",

  // Itabs.vue => titleList[value]
	客流量趋势: "Enter Trend",
	集团业态排行: "Group business ranking",
	详细数据: "Detailed Data",
	购物中心业态排行: "Shopping center ranking",
	请选择: "select",
  排行分析: "Ranking analysis",
  年龄分布: "Age distribution",
  性别分布: "Gender distribution",
  新老顾客占比: "Proportion of new and old customers",
  到店次数占比: "Proportion of store visits",
  客流排行: "ranking of enter",
  到店次数: "Number of visits",
  //Main.vue => routeTitle
  实体客流分析: "Physical enter analysis",
  年龄性别分析: "Age and gender analysis",
  排行占比分析: "Ranking proportion analysis",
  进店率分析: "Store entry rate analysis",
  热力图分析: "Thermodynamic diagram analysis",
  有效客流分析: "Effective enter flow analysis",
  排队货架分析: "Queuing shelf analysis",
  关联分析: "Relevance",
  交叉客流分析: "Cross",
  路径动向分析: "Path",
  实体引流分析: "Drainage",
  停留时间分析: "Dwell Time",
  目标达成分析: "Goal",
  节假日活动分析: "Holiday Analysis",
  销售分析: "Sales Analytics",
  门店日报: "Store Daily Report",
  日报: "Daily Report",
  周报: "Week Report",
  月报: "Month Report",
  自定义报告: "Costomize Report",
  实体管理: "Entity Manage",
  节假日活动管理: "Holiday Manage",
  账户管理: "Account",
  权限管理: "Role",
  // src\views\entity-analytic\index.vue

  // Chart-box.vue => toolList[tool]&&toolList[tool].name
  集客量趋势: "Occupancy Trend",
  // class="go-shop-time-icon"
  进店率TOP10排行分析: "Top 10 ranking analysis of store entry rate",
  结账排队分析: "Checkout Queue Analysis",
  货架触摸分析: "Shelf touch analysis",
  进店率趋势分析: "Trend analysis of store entry rate",

  // Cards.vue
  有效客流: "Effective enter",
  重复客流: "Repeated enter",
  平均到访次数: "Average visits",
  
	// goalCharts.vue => title1
  平均到访频次趋势: "Average visits trend",
  
  // RelavanceTab.vue =>item.label
  关联关系无序图: "Association unordered graph",
  关联关系有序图: "Association ordered graph",
  // RElavance.vue
  '关联度TOP3：': "Top 3 relevance:",
  // VxCard.vue => title
  关联度排行: "Relevance ranking",
  转化量排行: "Conversion ranking",
  // Cross.vue
  起点累计客流: "Starting point cumulative enter",
  客流转化深度: "Enter transformation depth",
  转化客流量: "Transformed enter",
  查询: "Query",
  重置: "Reset",
  交叉客流路径: "Cross enter path",
  最大客流路径: "Maximum enter path",
  数据指标趋势: "Data index trend",
  无对比: "No comparison",
  自定义对比: "Customized comparison",
  // pathTrendBackup.vue
  路径动向图: "Path trend chart",
  "游逛深度（个）": "Wandering depth (PCs.)",




	fx: {
		minute: "min",
		second: "s",
		// .replace("分钟", $t('fx.minute')).replace("秒", $t('fx.second'))
		day: "day",
		sales_yuan: "@:(sales) (@:(yuan))",
		Data_indicators: "Data indicators:",
		enter_trend: "Enter Trend",
	},
	holder: {
		请选择: "select",
    暂无数据:"No Data",//{{ $t('holder.暂无数据') }}
    选择日期: "Date",
    选择起点: "Start",
    选择终点: "End",

  },


	passages: {
		tootipText1: "Average @:(enter): the sum of the real-time cumulative @:(enter) of all shopping centers divided by the number of shopping centers \npeak @:(enter): the maximum value of the peak @:(enter) in all shopping centers \npeak @:(occupancy): the maximum value of the peak @:(occupancy) in all shopping centers \nToday's @:(occupancy): the sum of the @:(occupancy) in all shopping centers",
		tootipText2: "Average @:(enter) today: the cumulative @:(enter) divided by the number of business hours \npeak @:(enter) today: the maximum @:(enter) from the start of business hours to the current time \npeak @:(occupancy) today: the maximum number of people staying in the shopping center and the time point from the start of business hours to the current time \npeak @:(occupancy) today: the difference between the total incoming @:(enter) and the total outgoing @:(enter) from the start of business hours to the current time",
		tootipText3: "Average enter: the cumulative enter of all shopping centers in the selected time period divided by the number of shopping centers \nTotal enter: the sum of enter of all shopping centers in the selected time period \nPeak enter: the maximum value of peak enter in all shopping centers in the selected time period \nPeak passenger volume: the maximum value of peak enter in all shopping centers in the selected time period \nEffective enter flow : the sum of the unique number of passengers in all shopping centers in the selected time period \nSales: the sum of the sales in all shopping centers in the selected time period",
	},

	notices: {
  	wrongPassword: "Your account or password was entered incorrectly.",
		noPermission: "Sorry, you don't have permission",
		systemException: "System exception!",
	},
}