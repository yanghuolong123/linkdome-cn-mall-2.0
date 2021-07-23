<!-- =========================================================================================
	File Name: App.vue
	Description: Main vue file - APP
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Version: 1.1
	Author: Pixinvent
	Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
import themeConfig from '@/../themeConfig.js'

export default {
  watch: {
    '$store.state.theme' (val) {
      this.toggleClassInBody(val)
    }
  },
  methods: {
    toggleClassInBody (className) {
      if (className == 'dark') {
        if (document.body.className.match('theme-semi-dark')) document.body.classList.remove('theme-semi-dark')
        document.body.classList.add('theme-dark')
      } else if (className == 'semi-dark') {
        if (document.body.className.match('theme-dark')) document.body.classList.remove('theme-dark')
        document.body.classList.add('theme-semi-dark')
      } else {
        if (document.body.className.match('theme-dark')) document.body.classList.remove('theme-dark')
        if (document.body.className.match('theme-semi-dark')) document.body.classList.remove('theme-semi-dark')
      }
    }
  },
  mounted () {
    this.toggleClassInBody(themeConfig.theme);
	  //点击文本就让它自动点击前面的input就可以触发选择。但是因组件阻止了冒泡，暂时想不到好方法来触发。
	  //这种比较耗性能，暂时想不到其他的，能实现效果了。
	  setInterval(function() {
		  document.querySelectorAll(".el-cascader-node__label").forEach(el => {
			  el.onclick = function() {
				  if (this.previousElementSibling) this.previousElementSibling.click();
			  };
		  });
	  }, 1000);
  }
}
</script>
<style>
body{
  /* min-width: 1360px;
  overflow-x: auto!important; */
	font-size: 16px;
}
path{
  cursor: pointer;
}
.hasCover{
    position: absolute;;
    left:0;
    top:0;
    background:rgba(0, 0, 0, 0.2);
    z-index:100499;
    width:100%;
    height:100%
}
.noBuy{
  border-style: none;
  height: 100px;
  position: absolute;
  left: 41%;
  top: 18%;
  z-index: 9999;
}
.mohu{
  filter: blur(2px);
}
.vs-select-primary .vs-select--item.activex{
    font-weight: 400!important
}
.box-card:hover,.dashboard-box:hover,.group-age-gender .left:hover,.group-age-gender .right:hover,
.group-client .left:hover,.group-client .center:hover,.account-center .account-text .account-text-right .account-seach .data-picker:hover,
.bg-white.box-card.px-4.pb-6:hover,.item.box-card.bg-white:hover,.bg-white.box-card:hover,
.bg-white.box-card.mt-6:hover,.selectorbox.ivu-card.ivu-card-bordered:hover,
.go-shop .go-time-selector:hover,.go-shop .go-shop-chart-list:hover,
.heatMaps .path-picker:hover,.heatMaps .heatMap:hover,.heatMaps .heatMapGrid:hover,
.effective .chartContent .cardContent .cards:hover,.effective .chartContent .circles:hover,
.relevance .relevance-picker:hover,.tab-container:hover,
.relevance .relevanceTOP3 h4 ul li:hover,.relevance .relevance-graph:hover,.relevance-table:hover,
.cross_analysis_time >div:hover,.cross_analysis:hover,.cross_analysis:hover,
.pathTrend .path-picker:hover,.pathTrend .path-title:hover,
.pathTrend .flexs .paths:hover,.maps .pathTab:hover,
.deainage-picker:hover,.drainage-map:hover,.left-chart-box .tab-box:hover,
.direction-chart-container .chart-container .trend-container .right-card-box >div:hover,
.time-selector:hover,.dewll_graph:hover,.dwell-time-table .vx-card.headline:hover,
.holidayAnaysis .chartsTable:hover,
.day-report-date:hover,.month-report-date:hover,#pdfDom:hover,
.topArea:hover,.vx-card.formatsList:hover,
.holiday .holidayTable:hover,
.account-center .account-text .account-text-right .account-table:hover,
.roles .left:hover,.CheckboxGroups:hover,
.left-floor .vx-card:hover,.stall-header-right .vx-card:hover,.area-list-right .vx-card:hover,#pathContent:hover {
 border:1px solid #23aeee!important;
 border-radius: 6px;
 box-shadow: 0px 0px 18px 0px rgba(160, 163, 164, .5)!important;
}
</style>
