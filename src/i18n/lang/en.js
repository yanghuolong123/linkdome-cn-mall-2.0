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
		effective: "effective {0}"
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
	realTimePassengerFlow: "Real time @:(customerTraffic)",
	cumulativePassengerFlowOfTheDay: "Cumulative @:(customerTraffic) of the day (person time)",
	cumulativePassengerFlowOfTheMonth: "Cumulative @:(customerTraffic) of the month (person time)",
	monthlyStandardValue: "Monthly standard value (person time)",
	passengerFlowachievementRateOfThisMonth: "@:(customerTraffic) achievement rate of this month",
	minute: "minute",
	second: "second",
	customerTraffic: "enter",
	occupancy: "occupancy",
	sales: "sales",
	yuan: "yuan",
	tongbi: "over the previous year",
	huanbi: "chain",
	historicalDataQuery: "Historical data query",

	fx: {
		minute: "min",
		second: "s",
		// .replace("分钟", $t('fx.minute')).replace("秒", $t('fx.second'))
		day: "day",
		sales_yuan: "@:(sales) (@:(yuan))",
	},
	passages: {
		tootipText1: "Average @:(customerTraffic): the sum of the real-time cumulative @:(customerTraffic) of all shopping centers divided by the number of shopping centers \npeak @:(customerTraffic): the maximum value of the peak @:(customerTraffic) in all shopping centers \npeak @:(occupancy): the maximum value of the peak @:(occupancy) in all shopping centers \nToday's @:(occupancy): the sum of the @:(occupancy) in all shopping centers",
		tootipText2: "Average @:(customerTraffic) today: the cumulative @:(customerTraffic) divided by the number of business hours \npeak @:(customerTraffic) today: the maximum @:(customerTraffic) from the start of business hours to the current time \npeak @:(occupancy) today: the maximum number of people staying in the shopping center and the time point from the start of business hours to the current time \npeak @:(occupancy) today: the difference between the total incoming @:(customerTraffic) and the total outgoing @:(customerTraffic) from the start of business hours to the current time",
	},

	notices: {
  	wrongPassword: "Your account or password was entered incorrectly.",
		noPermission: "Sorry, you don't have permission",
		systemException: "System exception!",
	},
}