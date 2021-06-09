/*=========================================================================================
  File Name: moduleCalendarState.js
  Description: Calendar Module State
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Version: 1.1
  Author: Pixinvent
  Author URL: hhttp://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
	calendarEvents: [
		{
			id: 1,
			title: 'event1',
			start: '2018-12-02',
			end: '2018-12-02',
			desc: 'demo event',
			cssClass: 'event-danger',
			label: 'personal'
		},
	],
	calendarLabels: [
		{ text: 'Business' ,value : 'business', color: 'success' },
		{ text: 'Work', value: 'work', color: 'warning'},
		{ text: 'Personal', value: 'personal', color: 'danger'},
	], 
}