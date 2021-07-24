module.exports =  {
  changeLang: "简体中文",
	fn: {
		and: "{0} and {1}",
		or: "{0} or {1}",
		require: "{0} is required",
		inputHolder: "{0}",
		get: "get {0}",
		send: "send {0}",
		successTo:"{0} successfully!",
		failedTo: "failed to {0}.",
		askConfirm: "Are you sure you want to {0}?",
		refreshTime: "Refresh every {0}",
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
	realTimePassengerFlow: "Real time passenger flow",
	cumulativePassengerFlowOfTheDay: "Cumulative passenger flow of the day (person time)",
	cumulativePassengerFlowOfTheMonth: "Cumulative passenger flow of the month (person time)",
	monthlyStandardValue: "Monthly standard value (person time)",
	passengerFlowachievementRateOfThisMonth: "Passenger flow achievement rate of this month",
	minute: "minute",
	second: "second",
	
	fx: {
		minute: "min",
		second: "s",
		// .replace("分钟", $t('fx.minute')).replace("秒", $t('fx.second'))
	},
	passages: {
		tootipText1: "Average passenger flow: the sum of the real-time cumulative passenger flow of all shopping centers divided by the number of shopping centers \npeak passenger flow: the maximum value of the peak passenger flow in all shopping centers \npeak passenger volume: the maximum value of the peak passenger volume in all shopping centers \nToday's passenger volume: the sum of the passenger volume in all shopping centers",
		tootipText2: "Average passenger flow today: the cumulative passenger flow divided by the number of business hours \npeak passenger flow today: the maximum passenger flow from the start of business hours to the current time \npeak passenger volume today: the maximum number of people staying in the shopping center and the time point from the start of business hours to the current time \npeak passenger volume today: the difference between the total incoming passenger flow and the total outgoing passenger flow from the start of business hours to the current time",
	},

	notices: {
  	wrongPassword: "Your account or password was entered incorrectly.",
		noPermission: "Sorry, you don't have permission",
		systemException: "System exception!",
	},
}