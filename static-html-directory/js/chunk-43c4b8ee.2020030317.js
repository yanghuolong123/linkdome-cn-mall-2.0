(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-43c4b8ee"],{"01c8":function(t,e,a){"use strict";a.d(e,"a",function(){return o});var n=a("178b"),i=a("3953"),r=a("1df6");function o(t){return Object(n["a"])(t)||Object(i["a"])(t)||Object(r["a"])()}},"079f":function(t,e,a){"use strict";var n=a("9545"),i=a.n(n);i.a},"1e6a":function(t,e,a){},"2d1f":function(t,e,a){t.exports=a("b606")},"2ed0":function(t,e,a){"use strict";var n=a("b746"),i=a.n(n);i.a},"45d6":function(t,e,a){"use strict";a("c5f6");e["a"]={SaleAmount:{name:"销售额",icon:"dangrixiaoshoue",color:"#F64F61",unit:"（元）",yaxis:{title:{text:"销售额"},labels:{formatter:function(t){return null!==t?t.toLocaleString():""}}}},SquaerMetre:{name:"坪效",icon:"xingxiaoxiaoguo",color:"#1DD9D1",unit:"（元/平方米）",yaxis:{title:{text:"坪效（元/平方米）"},labels:{formatter:function(t){return null!==t?t.toLocaleString():""}}}},CloseRate:{name:"成交率",icon:"chengjiaohuafen",color:"#857AEF",yaxis:{title:{text:"成交率"},labels:{formatter:function(t){var e=Math.floor(100*Number(t))/100;if("number"===typeof e)return"".concat(e,"%")}}}},UnitPrice:{name:"客单价",icon:"jiage",color:"#33B3ED",unit:"（元）",yaxis:{title:{text:"客单价（元）"},labels:{formatter:function(t){return null!==t?t.toLocaleString():""}}}}}},"5de8":function(t,e,a){},6980:function(t,e,a){"use strict";var n=a("1e6a"),i=a.n(n);i.a},"6f5f":function(t,e,a){t.exports=a.p+"img/shop.8ec38cf9.png"},"730b":function(t,e,a){},"850c8":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"deainage-picker"},[a("DatePicker",{staticStyle:{width:"230px",float:"left"},attrs:{type:"daterange",placement:"bottom-end",options:t.disabledDate,placeholder:"选择日期"},model:{value:t.drainageDate,callback:function(e){t.drainageDate=e},expression:"drainageDate"}}),a("el-cascader",{staticClass:"selectExample",attrs:{options:t.shopList},model:{value:t.shopValue,callback:function(e){t.shopValue=e},expression:"shopValue"}}),a("div",{staticClass:"drainage-submit",on:{click:t.paramsPrepare}},[t._v("查询")]),a("div",{staticClass:"drainage-reset",on:{click:t.resetData}},[t._v("重置")])],1),a("drainage-map",{attrs:{dataList:t.drainageMapList,centerData:t.centerDataList,presentData:t.presentData}}),Number(t.shopValue[1])?a("drainage-chart",{attrs:{bzid:Number(t.shopValue[1]),fromGates:t.allData.inGate,fromStores:t.allData.inStore,toGates:t.allData.outGate,toStores:t.allData.outStore,time:t.drainageDate}}):t._e()],1)},i=[],r=(a("c5f6"),a("7514"),a("ac6a"),a("a4bb")),o=a.n(r),s=(a("7f7f"),a("bc8a")),c=a("ad00"),u=a("94b0"),d=a("c1df"),l=a.n(d),p=a("5fe9"),m=a.n(p),h=a("2ef0"),f=a.n(h),g=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"direction-chart-container mt-6"},[a("drainage-tab",{attrs:{tabs:t.tabsList},model:{value:t.drainageType,callback:function(e){t.drainageType=e},expression:"drainageType"}}),t.chartData?a("div",{staticClass:"p-3 chart-container"},[a("div",{staticClass:"trend-container"},[a("div",{staticClass:"left-chart-box"},[a("chartTabs",{attrs:{xAxis:t.chartData.xAxis,extraOptions:t.occpuancyOptions,title:"趋势图",series:t.chartData.series}})],1),a("div",{staticClass:"right-card-box"},t._l(t.cardData,function(e,n){return a("div",{key:n},[a("span",{staticClass:"my-icon-box",style:{backgroundColor:""+t.convertColor(e.color)}},[a("icons",{attrs:{type:e.icon,color:e.color,size:24}})],1),a("div",{staticClass:"leading-loose"},[a("p",{staticClass:"text-lg font-medium"},[t._v(t._s(e.name))]),a("p",[t._v(t._s(e.number))])])])}))]),a("div",{staticClass:"ranking-container"},[a("Rank",{attrs:{time1:t.formatDate.toString(),defaultBizIndicator:"enter",defaultShopIndicator:"enter",indicatorSelector:!1,indicatorData:t.rankIndicator,bzid:t.rankBzid,isDrainage:!0,drainageId:t.bzid,typeName:t.drainageName,drainageApi:t.apiDifference}})],1),a("div",{directives:[{name:"show",rawName:"v-show",value:"from"===t.drainageType,expression:"drainageType==='from'"}],staticClass:"mt-6"},[a("age-gender",{attrs:{time1:t.formatDate.toString(),bzid:t.bzid}})],1)]):t._e()],1)},b=[],v=a("795b"),y=a.n(v),x=(a("5df3"),a("6b54"),a("96cf"),a("3b8d")),D=a("768b"),z=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"tab-container"},t._l(t.tabs,function(e,n){return a("div",{key:n},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.flowType,expression:"flowType"}],attrs:{type:"radio",name:"footfall",id:e.value},domProps:{value:e.value,checked:t._q(t.flowType,e.value)},on:{change:function(a){t.flowType=e.value}}}),a("label",{attrs:{for:e.value}},[a("div",[t._v(t._s(e.label)+"\n          "),a("Tooltip",{attrs:{content:e.tootipText,placement:"bottom",theme:"light",transfer:"","max-width":"350"}},[a("icons",{attrs:{type:"wenhao"}})],1)],1)])])}))},T=[],S={name:"DrainageTab",props:{tabs:{type:Array,default:function(){return[]}}},data:function(){return{flowType:"from"}},watch:{flowType:{immediate:!0,handler:function(t,e){var a="from"===t?"来源流量分析":"目的流量分析";try{window.TDAPP.onEvent("实体引流分析页面",a,{})}catch(n){console.log("实体引流分析页面-"+a+"-error:"+n)}this.$emit("input",t)}}}},C=S,w=(a("079f"),a("2877")),k=Object(w["a"])(C,z,T,!1,null,"7014f5ba",null),O=k.exports,I=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"mt-6 p-6 bg-white box-card"},[a("div",{staticClass:"ranking-selector-box flex items-center"},[a("span",{staticClass:"mr-3"},[t._v(t._s(t.selectTitle))]),a("vs-select",{attrs:{autocomplete:"",placeholder:"请选择",noDataText:"暂无数据"},model:{value:t.bussinessType,callback:function(e){t.bussinessType=e},expression:"bussinessType"}},t._l(t.withAllOptions,function(t){return a("vs-select-item",{key:t.value,attrs:{value:t.value,text:t.text}})}),1)],1),t.bizTopData.length?a("div",{staticClass:"ranking-box mt-3"},[a("div",[a("chart-tabs",{key:"bizTop",attrs:{xAxis:t.bizChartData.xAxis,series:t.bizChartData.series,type:t.chartTypes,extraOptions:t.bizExtraOptions,istotal:t.istotal,title:"业态排行"},model:{value:t.exportType,callback:function(e){t.exportType=e},expression:"exportType"}},[t.indicatorSelector?a("vs-select",{staticClass:"chartSelector",attrs:{autocomplete:""},model:{value:t.bizIndicator,callback:function(e){t.bizIndicator=e},expression:"bizIndicator"}},t._l(t.indicators,function(t,e){return a("vs-select-item",{key:e,attrs:{text:t.name,value:t.value}})}),1):t._e(),a("export-menu",{attrs:{slot:"export"},on:{onchange:t.exportBiztop},slot:"export"})],1)],1),a("div",[a("chart-tabs",{key:"shopTop",attrs:{xAxis:t.topShopData.xAxis,series:t.topShopData.series,type:t.chartTypes,extraOptions:t.extraOptions,title:"商铺排行",isHome:!0,istotal:t.istotal},model:{value:t.exportType,callback:function(e){t.exportType=e},expression:"exportType"}},[a("export-menu",{attrs:{slot:"export"},on:{onchange:t.exportShoptop},slot:"export"}),t.indicatorSelector?a("vs-select",{staticClass:"chartSelector",attrs:{autocomplete:""},model:{value:t.shopIndicator,callback:function(e){t.shopIndicator=e},expression:"shopIndicator"}},t._l(t.indicators,function(t,e){return a("vs-select-item",{key:e,attrs:{text:t.name,value:t.value}})}),1):t._e()],1)],1)]):t._e()])},L=[],j=a("2d1f"),A=a.n(j),Y=(a("55dd"),a("01c8")),R=a("cebc"),E=a("a745"),M=a.n(E),G=(a("28a5"),a("db0c")),N=a.n(G),B=(a("20d6"),a("75fc")),q=a("869a"),$=a("2f62"),P=a("3191"),F=a("45d6"),V=a("9777"),H={name:"rankingAnalytics",components:{chartTabs:q["a"],exportMenu:V["a"]},props:{time1:{type:String,default:null},time2:{type:String,default:null},propertyId:{type:[String,Number],default:null},footfallIndicators:{type:Object,default:function(){return{}}},indicatorData:{type:Object,default:function(){return F["a"]}},selectTitle:{type:String,default:"排行分析"},defaultBizIndicator:{type:String,default:"SaleAmount"},defaultShopIndicator:{type:String,default:"SaleAmount"},indicatorSelector:{type:Boolean,default:!0},bzid:{type:Array,default:null},drainageId:{type:Number,default:null},typeName:{type:String,default:""},drainageApi:{type:Object,default:function(){return{}}},istotal:{type:Boolean,default:!1}},data:function(){return{bussinessList:[],showData:!1,exportEx:1,bussinessType:"all",readySelector:null,bizIndicator:"",shopIndicator:"",bizTopData:[],shopTopData:[],allBizTopData:[],chartTypes:["bar"],bizTypeOfSelect:"all",extraOptions:{plotOptions:{bar:{horizontal:!0}},colors:["#867bf0","#fbab3e"]},exportType:""}},watch:{watch:{"$store.state.home.headerAction":function(){var t=this.$router.currentRoute.name;"Drainage"===t&&(this.bizTopData=[])}},time1:{immediate:!0,handler:function(t,e){this.getTopData()}},time2:{immediate:!0,handler:function(t,e){this.getTopData()}},propertyId:{immediate:!0,handler:function(t,e){this.getTopData()}},bussinessType:{handler:function(t,e){this.getTopData(),this.bizTypeOfSelect=t}},bzid:{handler:function(t,e){t&&this.getTopData()}},"$store.state.home.headerAction":function(){this.getDict()},"$store.state.home.isGetDict":function(){1==this.$store.state.home.isGetDict&&this.getDict()}},created:function(){this.readySelector=this.getDictOfBussiness(),this.bizIndicator=this.defaultBizIndicator,this.shopIndicator=this.defaultShopIndicator},activated:function(){},mounted:function(){this.getDict()},computed:{bussinessTypes:function(){var t=this;return o()(this.bussinessList).map(function(e){return{text:t.bussinessList[e],value:Number(e)}})},withAllOptions:function(){var t={text:"所有业态",value:"all"};return[t].concat(Object(B["a"])(this.bussinessTypes))},indicators:function(){var t=this;return o()(this.indicatorData).map(function(e){return{value:e,name:t.indicatorData[e].name}})},currentBizIdx:function(){var t=this;return f.a.findIndex(this.bussinessTypes,function(e){return e.value===t.bussinessType})},bizInxOfSelect:function(){var t=this;return f.a.findIndex(this.bussinessTypes,function(e){return e.value===t.bizTypeOfSelect})},bizChartData:function(){var t=this;if(0==this.bzid.length)return{xAxis:{name:"名称",key:"bussiness",data:[]},series:[{name:"",key:"",data:[]}],source:[]};var e=this.currentBizIdx,a=o()(this.indicatorData).indexOf(this.bizIndicator),n=this.bizTopData[a].data.data,i={};e<0?i=n:o()(n).forEach(function(e){i[e]={},i[e][t.bussinessType]=n[e].find(function(e){return e.id===Number(t.bussinessType)})});var r=this;return{xAxis:{name:"名称",key:"bussiness",data:N()(N()(i)[0]).map(function(t){return t.name})},series:o()(i).map(function(t,e){if(e<10){var a={name:"".concat(r.indicatorData[r.bizIndicator].name," ").concat(t.split(",").join(" - ")),key:"data_".concat(t),data:N()(i[t]).map(function(t){return t.data})};return a}}),source:N()(N()(i)[0]).map(function(t){return t.id})}},topShopData:function(){var t=this;if(0==this.bzid.length)return{xAxis:{name:"名称",key:"shop",data:[]},series:[{name:"",key:"",data:[]}]};var e=null,a=o()(this.indicatorData).indexOf(this.shopIndicator),n=this.currentBizIdx===this.bizInxOfSelect?this.currentBizIdx:this.bizInxOfSelect;e=n<0?this.allBizTopData[a].data.data:this.shopTopData[0][0].data.data;var i=M()(N()(e)[0])?e:this.sortdObj(e),r=o()(i)[0],s=i[r],c=[];return s.forEach(function(t,e){e<10&&c.push(t)}),{xAxis:{name:"名称",key:"shop",data:N()(i)[0].map(function(t){return f.a.isArray(t.name)?t.name[0]:t.name})},series:o()(i).map(function(e){return{name:"".concat(t.indicatorData[t.shopIndicator].name," ").concat(e.split(",").join(" - ")),key:"data_".concat(e),data:N()(i[e]).map(function(t){return t.data})}})}},bizExtraOptions:function(){var t=this,e={chart:{events:{dataPointSelection:function(e,a,n){t.handleChartPointSelect(n)}}},colors:["#00a1ea","#16dad2"]};return Object(R["a"])({},f.a.cloneDeep(this.extraOptions),f.a.cloneDeep(e))}},methods:Object(R["a"])({},Object($["b"])(["getDictOfBussiness"]),{getTopData:f.a.debounce(Object(x["a"])(regeneratorRuntime.mark(function t(){var e,a,n,i,r,o,s,c,u=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.readySelector;case 2:e=[],a=[],n=[],i=[Object(P["i"])({time1:this.time1,from_bzids:this.bzid&&this.bzid.toString(),to_bzids:this.drainageId,industry_id:this.bussinessType})],o={},o.time1=this.time1,o.from_bzids=this.bzid&&this.bzid.toString(),o.to_bzids=this.drainageId,r=Object(P["i"])(o),a.push(r),n.push(i),c={},c.time1=this.time1,c.from_bzids=this.bzid&&this.bzid.toString(),c.to_bzids=this.drainageId,s=Object(P["n"])(c),e.push(s),y.a.all([e,a].concat(n).map(function(t){return y.a.all(t)})).then(function(t){var e=Object(Y["a"])(t);u.bizTopData=e[0],u.allBizTopData=e[1],u.shopTopData=e.slice(2)}).catch(function(t){console.log(t)});case 20:case"end":return t.stop()}},t,this)})),100),handleChartPointSelect:function(t){this.bussinessType=this.bizChartData.source[t.dataPointIndex],this.bizTypeOfSelect=this.bizChartData.source[t.dataPointIndex]},sortdObj:function(t){var e=f.a.cloneDeep(N()(t)),a=e.reduce(function(t,e){return o()(t).forEach(function(a){t[a]=Number(t[a])+Number(e[a])}),t}),n=A()(a).sort(function(t,e){return e[1]-t[1]}),i={};return o()(f.a.cloneDeep(t)).forEach(function(e){var a=t[e];i[e]=n.map(function(t){var e=Object(D["a"])(t,2),n=e[0];e[1];return{name:[n],data:a[n]}})}),i},dowloadXlsx:function(t){var e=new Date,a=new Blob([t.data]),n=this.$router.currentRoute.name,i="";"drainage"==n?i="实体引流分析":"pathTrend"==n?i="路径动向分析":"sales"==n&&(i="销售分析");var r="";r=1==this.exportEx?"业态排行":"商铺排行";var o=i+r+l()(e).format("YYYYMMDDHHmmss")+".xls",s=document.createElement("a");s.download=o,s.style.display="none",s.href=URL.createObjectURL(a),document.body.appendChild(s),s.click(),URL.revokeObjectURL(s.href),document.body.removeChild(s)},exportBiztop:function(t){var e=this;"current"===t&&Object(P["d"])(this.drainageApi).then(function(t){e.exportEx=1,e.dowloadXlsx(t)})},exportShoptop:function(t){var e=this;"current"===t&&Object(P["e"])(this.drainageApi).then(function(t){e.exportEx=2,e.dowloadXlsx(t)})},getDict:function(){var t=this,e=this.$store.state.home.headerAction;Object(P["g"])({property_id:e}).then(function(e){t.bussinessList=e.data.data,t.getTopData(),t.$store.commit("isGetDict",!1)}).catch(function(t){console.log(t)})}})},U=H,X=(a("9fe9"),Object(w["a"])(U,I,L,!1,null,"29dc2d79",null)),J=X.exports,K=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"age-chart-box"},[a("div",{staticClass:"bg-white box-card pb-6"},[a("chart-tabs",{attrs:{labels:t.agechartData.labels,series:t.agechartData.series,type:t.agechartData.type,title:"年龄分布",extraOptions:t.agechartData.extraOptions},on:{tableChage:t.ageTabChange}},[a("export-menu",{attrs:{slot:"export"},on:{onchange:t.ageExportBiztop},slot:"export"})],1)],1),a("div",{staticClass:"bg-white box-card pb-6"},[a("chart-tabs",{attrs:{labels:t.genderChartData.labels,series:t.genderChartData.series,type:t.genderChartData.type,title:"性别分布",extraOptions:t.genderChartData.extraOptions},on:{tableChage:t.genderTabChange}},[a("export-menu",{attrs:{slot:"export"},on:{onchange:t.genderExportBiztop},slot:"export"})],1)],1)])},Q=[],W=(a("a481"),{name:"ageGenderChart",components:{chartTabs:q["a"],exportMenu:V["a"]},props:{time1:{type:String,default:""},bzid:{type:Number,required:null}},data:function(){return{agechartData:{},genderChartData:{},canShow:!1,extraOptions:{chart:{stacked:!0},plotOptions:{bar:{endingShape:"flat"}},legend:{show:!0}},ageTabList:[],genderTabList:[]}},watch:{time1:{immediate:!0,handler:function(t,e){t&&this.getAgeGenderData()}},time2:{immediate:!0,handler:function(t,e){t&&this.getAgeGenderData()}},bzid:{immediate:!0,handler:function(t,e){t.length&&this.getAgeGenderData()}}},methods:{ageTabChange:function(t){this.ageTabList=t.data},ageExportBiztop:function(){this.uploadList(this.ageTabList)},genderTabChange:function(t){this.genderTabList=t.data},genderExportBiztop:function(){this.uploadList(this.genderTabList)},uploadList:function(t){var e=this;0==this.$store.state.home.loadingState&&(this.$store.commit("loadingState",!0),this.$vs.loading()),Object(P["b"])(t).then(function(t){var a=new Date,n=new Blob([t.data]),i="实体引流客流详细数据",r=i+l()(a).format("YYYYMMDDHHmmss")+".xls",o=document.createElement("a");o.download=r,o.style.display="none",o.href=URL.createObjectURL(n),document.body.appendChild(o),o.click(),URL.revokeObjectURL(o.href),document.body.removeChild(o),e.$vs.loading.close(),e.$store.commit("loadingState",!1)})},getAgeGenderData:_.debounce(Object(x["a"])(regeneratorRuntime.mark(function t(){var e,a,n,i,r,s,c,u,d,l,p,m;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return e=this.time1,a=this.bzid,t.next=3,Object(P["j"])({range:e,bzid:a,type:0});case 3:n=t.sent,i=n.data.data,r=i.age_distribution,s=i.gender_propotion,c={0:{name:"女",icon:"female"},1:{name:"男",icon:"male"}},u={male:"男性",female:"女姓"},d=null,l=null,p={name:"年龄",key:"age",data:o()(r).map(function(t){return t.replace("_","-").replace("less-","小于").replace(/more-/,"大于")})},m={name:"性别",key:"gender",data:o()(s).map(function(t){return c[t].name}),icons:o()(s).map(function(t){return c[t].icon})},d={labels:p,series:o()(u).map(function(t){return{name:u[t],key:t,data:N()(r).map(function(e){return e[t]})}}),type:["bar"]},l={labels:m,series:N()(s),type:["radialBar"]},this.agechartData=d,this.genderChartData=l;case 16:case"end":return t.stop()}},t,this)})),100)}}),Z=W,tt=(a("6980"),Object(w["a"])(Z,K,Q,!1,null,null,null)),et=tt.exports,at=a("c276"),nt=a("ab14"),it=a.n(nt),rt={name:"FootfallDirection",props:{bzid:{type:Number,required:!0},fromGates:{type:Object,default:function(){return{}}},fromStores:{type:Object,default:function(){return{}}},toGates:{type:Object,default:function(){return{}}},toStores:{type:Object,default:function(){return{}}},time:{type:Array,required:!0,default:function(){return[]}}},components:{Rank:J,chartTabs:q["a"],drainageTab:O,ageGender:et},watch:{fromGates:{deep:!0,handler:function(t,e){t&&(this.selectTime=this.time,this.getTrendData())}}},computed:{fromGateIds:function(){return this.fromGates.gates.map(function(t){return t.bzid})},fromStoreIds:function(){return this.fromStores.stores.map(function(t){return t.bzid})},toGateIds:function(){return this.toGates.gates.map(function(t){return t.bzid})},toStoreIds:function(){return this.toStores.stores.map(function(t){return t.bzid})},innerRange:function(){return Object(at["j"])(this.formatDate)},convertInnerRange:function(){return"1h"===this.innerRange?"Hour":"1day"===this.innerRange?"Date":"1month"===this.innerRange?"Month":void 0},formatDate:function(){return this.selectTime.map(function(t){return l()(t).format("YYYY-MM-DD")})},chartData:function(){var t=this;if(!this.trendRes.length)return null;var e=Object(D["a"])(this.trendRes,4),a=e[0],n=e[1],i=e[2],r=e[3],s=(this.innerRange,{fromGate:a,fromStore:n,toGate:i,toStore:r}),c=[],u={name:"时间",key:"time",data:[]};o()(this.entityType).forEach(function(e){if("to"!==t.drainageType||"Gate"!==e){var a=s["".concat(t.drainageType).concat(e)].data.data;u.data=[],a.map(function(t){u.data.push(t.date)});var n={};n.name="to"===t.drainageType?"目的流量":"".concat(t.entityType[e]).concat(t.direction[t.drainageType]),n.key="",n.data=[],a.map(function(t){n.key="".concat(e,"_").concat(t.date),n.data.push(t.value)}),c.push(n)}});var d=_.sum(c[0]&&c[0].data),l={};return l=0==d?{title:{text:"",style:{fontSize:"13px"}},labels:{formatter:function(t){return t=t>0?Number(t).toLocaleString():0,t}}}:{title:{text:"",style:{fontSize:"13px"}},labels:{formatter:function(t){return t=t>0?Number(t).toLocaleString():0,t}},min:0},this.occpuancyOptions.yaxis=[],this.occpuancyOptions.yaxis.push(l),{series:c,xAxis:u}},cardData:function(){var t=this.chartData,e=_.sumBy(t.series,function(t){return _.sum(t.data)}),a=this["".concat(this.drainageType,"StoreIds")].length,n=this["".concat(this.drainageType,"GateIds")].length,i={from:"导入",to:"辐射"},r=[{number:e,name:"".concat(i[this.drainageType],"总客流"),icon:"daoruzongkeliu",color:"#857AEF"}];return"from"===this.drainageType?[].concat(r,[{number:n,name:"出入口个数",icon:"danyilaiyuan",color:"#2BD9CF"},{number:a,name:"店铺个数",icon:"jianjielaiyuan",color:"#33B3ED"}]):[].concat(r,[{number:a,name:"辐射店铺个数",icon:"danyilaiyuan",color:"#857AEF"}])},rankBzid:function(){return this["".concat(this.drainageType,"StoreIds")]}},data:function(){return{occpuancyOptions:{yaxis:[]},drainageType:"",apiDifference:"",drainageName:"drainage",indicators:{enter:{name:"入客流",yaxis:{title:{text:"客流量（人）"},labels:{formatter:function(t){return t?t.toLocaleString():""}}}}},tabsList:[{value:"from",label:"来源流量分析",tootipText:"1. 趋势图：分别展示了出入口和商铺转化客流趋势\n2. 导入总客流：来自出入口和商铺的客流之和\n3. 出入口个数： 出入口实体的总个数\n4. 店铺个数：店铺实体的总个数"},{value:"to",label:"目的流量分析",tootipText:"1. 趋势图：展示了所选实体到其他商铺转化客流趋势\n2. 辐射总客流：所选商铺辐射到其他店铺的客流之和\n3. 辐射店铺个数：所选店铺辐射其他店铺的总个数"}],trendRes:[],rankIndicator:{enter:{name:"入客流"}},canshow:!1,direction:{from:"来源",to:"目的"},entityType:{Gate:"出入口",Store:"商铺"},selectTime:""}},methods:{getTrendData:function(){var t=Object(x["a"])(regeneratorRuntime.mark(function t(){var e,a,n,i,r=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return e=[],a=this.formatDate,n=this.entityType,i=this.gotInnerRange(a),this.tabsList.forEach(function(t){o()(n).forEach(function(n){var o={time1:a.toString(),range:i,from_bzids:"from"==t.value?r["".concat(t.value).concat(n,"Ids")].toString():r.bzid,to_bzids:"from"==t.value?r.bzid:r["".concat(t.value).concat(n,"Ids")].toString()};r.apiDifference=o,e.push(Object(u["k"])(o))})}),t.next=6,y.a.all(e).catch(function(t){return console.log(t)});case 6:this.trendRes=t.sent,this.canshow=!0;case 8:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),convertColor:function(t){return it()(t,.2)},gotInnerRange:function(t){var e=Object(D["a"])(t,2),a=e[0],n=e[1],i=l()(a),r=l()(n),o=l.a.duration(r.diff(i)).asDays(),s="";return s=o<60?"Date":"Month",s}}},ot=rt,st=(a("2ed0"),Object(w["a"])(ot,g,b,!1,null,null,null)),ct=st.exports,ut={name:"drainage",components:{drainageMap:s["a"],drainageChart:ct},data:function(){return{allData:{},drainageDate:[],shopValue:"",shopList:[],drainageMapList:{},centerDataList:[],presentData:{},disabledDate:"",dictSize:0}},watch:{"$store.state.home.headerAction":function(){var t=this.$router.currentRoute.name;"Drainage"===t&&(this.drainageMapList=[],this.drainageMapList=[],this.presentData=[],this.shopListData()),this.resetData()}},created:function(){this.disabledDate=at["b"]},activated:function(){var t=new Date;t=t.setDate(t.getDate()-1);var e=[l()(t).format("YYYY-MM-DD"),l()(t).format("YYYY-MM-DD")];this.drainageDate=e,this.shopListData()},mounted:function(){},methods:{shopListData:function(){var t=this,e=this,a=this.$store.state.home.headerAction;Object(c["c"])({property_id:a}).then(function(a){if(200==a.data.code){t.shopList=[],t.shopValue=[];var n=a.data.data;if(0==n.length)return!1;var i=o()(n);i.forEach(function(e){var a={};a.value=e,a.label=e,a.children=[],n[e].forEach(function(t){var e={};e.value=t.id,e.label=t.name,e.name=t.name,a.children.push(e)}),t.shopList.push(a)}),0!=e.shopList.length&&(e.shopValue=[e.shopList[0].value,e.shopList[0].children[0].value]),e.paramsPrepare()}}).catch(function(t){console.log(t)})},paramsPrepare:function(){var t=this;if(0==this.drainageDate.length)return alert("时间不能为空，请选择时间"),!1;var e=l()(t.drainageDate[0]).format("YYYY-MM-DD")+","+l()(t.drainageDate[1]).format("YYYY-MM-DD"),a=this.shopValue[1];if(!a)return alert("商铺不能为空，请选择商铺"),!1;try{var n=this.shopValue[0],i=f.a.find(this.shopList,["label",this.shopValue[0]]).children,r=f.a.find(i,["value",this.shopValue[1]]);r=r&&r.name?r.name:"",n+="/"+r;var o=l()(this.drainageDate[0]).format("YYYY-MM-DD")+","+l()(this.drainageDate[1]).format("YYYY-MM-DD");window.TDAPP.onEvent("实体引流分析页面","数据查询",{"时间段":o,"实体选择":n})}catch(s){console.log("实体引流分析页面-数据查询-埋点error:"+s)}this.dataList(e,a)},dataList:function(t,e){var a=this;Object(u["g"])({time:t,bzid:e}).then(function(t){var e=t.data.data;a.allData=e,a.presentData.name=e.entity.name,a.presentData.img=e.entity.icon,a.graphList(e),a.centerList(e)})},graphList:function(t){var e={direct:[],radiation:[],indirect:[],departure:[]};t.inGate.gates.map(function(t,a){var n={};n.name=t.name,n.value=m.a.times(t.rate.ratio,100),Number(t.lastrate.ratio)>0||0==Number(t.lastrate.ratio)?n.action=!1:n.action=!0,n.link=m.a.times(t.lastrate.ratio,100),e.direct.length<5&&e.direct.push(n)}),t.inStore.stores.map(function(t){var a={};a.name=t.name,a.value=m.a.times(t.rate.ratio,100),Number(t.lastrate.ratio)>0||0==Number(t.lastrate.ratio)?a.action=!1:a.action=!0,a.link=m.a.times(t.lastrate.ratio,100),e.radiation.length<5&&e.radiation.push(a)}),t.outStore.stores.map(function(t){var a={};a.name=t.name,a.value=m.a.times(t.rate.ratio,100),Number(t.lastrate.ratio)>0||0==Number(t.lastrate.ratio)?a.action=!1:a.action=!0,a.link=m.a.times(t.lastrate.ratio,100),e.indirect.length<5&&e.indirect.push(a)}),t.outGate.gates.map(function(t){var a={};a.name=t.name,a.value=m.a.times(t.rate.ratio,100),Number(t.lastrate.ratio)>0||0==Number(t.lastrate.ratio)?a.action=!1:a.action=!0,a.link=m.a.times(t.lastrate.ratio,100),e.departure.length<5&&e.departure.push(a)}),this.drainageMapList=e},centerList:function(t){this.centerDataList=[];var e=[],a={};a.value=m.a.times(t.inGate.rate.ratio,100);var n=Number(t.inGate.rate.crCompare);a.action=!(n>0||0==n),a.text="出入口引入占比",a.link=m.a.times(t.inGate.rate.crCompare,100),e.push(a);var i={};i.value=m.a.times(t.outStore.rate.ratio,100);var r=Number(t.outStore.rate.crCompare);i.action=!(r>0||0==r),i.text="辐射店铺占比",i.link=m.a.times(t.outStore.rate.crCompare,100),e.push(i);var o={};o.value=m.a.times(t.inStore.rate.ratio,100);var s=Number(t.inStore.rate.crCompare);o.action=!(s>0||0==s),o.text="店铺引入占比",o.link=m.a.times(t.inStore.rate.crCompare,100),e.push(o);var c={};c.value=m.a.times(t.outGate.rate.ratio,100);var u=Number(t.outGate.rate.crCompare);c.action=!(u>0||0==u),c.text="离场客流占比",c.link=m.a.times(t.outGate.rate.crCompare,100),e.push(c),this.centerDataList=e},resetData:function(){try{window.TDAPP.onEvent("实体引流分析页面","重置",{})}catch(a){console.log("实体引流分析页面-重置-埋点error:"+a)}var t=new Date;t=t.setDate(t.getDate()-1);var e=[l()(t).format("YYYY-MM-DD"),l()(t).format("YYYY-MM-DD")];this.drainageDate=e,0!=this.shopList.length&&(this.shopValue=[this.shopList[0].value,this.shopList[0].children[0].value])}}},dt=ut,lt=(a("9086"),a("c6a0"),Object(w["a"])(dt,n,i,!1,null,"11fc807b",null));e["default"]=lt.exports},"85aa":function(t,e,a){t.exports=a.p+"img/draniage_center.a804f35f.png"},9086:function(t,e,a){"use strict";var n=a("c5bf"),i=a.n(n);i.a},"909b":function(t,e,a){},"94b0":function(t,e,a){"use strict";a.d(e,"e",function(){return o}),a.d(e,"h",function(){return s}),a.d(e,"d",function(){return c}),a.d(e,"r",function(){return u}),a.d(e,"f",function(){return d}),a.d(e,"l",function(){return l}),a.d(e,"b",function(){return p}),a.d(e,"p",function(){return m}),a.d(e,"q",function(){return h}),a.d(e,"g",function(){return f}),a.d(e,"i",function(){return g}),a.d(e,"a",function(){return b}),a.d(e,"c",function(){return v}),a.d(e,"j",function(){return y}),a.d(e,"m",function(){return x}),a.d(e,"o",function(){return D}),a.d(e,"n",function(){return _}),a.d(e,"k",function(){return z});var n=a("66df"),i=a("4328"),r=a.n(i),o=function(t){return n["a"].request({url:"analysis/dateentityscompare",data:t,method:"post"})},s=function(t){var e=t.time1,a=t.time2,i=t.bzid;return n["a"].request({url:"dwelltime/chart",params:{time1:e,time2:a,bzid:i},method:"get"})},c=function(t){var e=t.time1,a=t.time2,i=t.from_bzid,r=t.to_bzid,o=t.range;return n["a"].request({url:"crossFlow/index",params:{time1:e,time2:a,from_bzid:i,to_bzid:r,range:o},method:"get"})},u=function(t){var e=t.bzid,a=t.time;return n["a"].request({url:"flow/assoc",params:{bzid:e,time:a},method:"get"})},d=function(t){var e=t.bzid,a=t.time;return n["a"].request({url:"cross/direction",params:{bzid:e,time:a},method:"get"})},l=function(t){return n["a"].request({url:"stat/entityFlowBatch",params:t,method:"get"})},p=function(t){return n["a"].request({url:"dict/industry",params:t,method:"get"})},m=function(t){var e=t.time1,a=t.time2,i=t.industry_id,r=t.property_id;return n["a"].request({url:"shop/enterRate/top",params:{time1:e,time2:a,industry_id:i,property_id:r},method:"get"})},h=function(t){var e=t.time1,a=t.time2,i=t.bzid,r=t.range;return n["a"].request({url:"shop/enterRate/trend",params:{time1:e,time2:a,bzid:i,range:r},method:"get"})},f=function(t){var e=t.time,a=t.bzid;return n["a"].request({url:"flow/drainage",params:{time:e,bzid:a},method:"get"})},g=function(t){var e=t.time,a=t.property_id;return n["a"].request({url:"flow/moving",params:{time:e,property_id:a},method:"get"})},b=function(t){var e=t.time,a=t.property_id,i=t.start,r=t.end,o=t.floor_id;return n["a"].request({url:"judge/keyPath",params:{time:e,property_id:a,start:i,end:r,floor_id:o},method:"get"})},v=function(t){var e=t.date,a=t.property_id;return n["a"].request({url:"manager/query_active_target",params:{date:e,property_id:a},method:"get"})},y=function(t,e,a,i){return n["a"].request({url:"passflow/visits",data:{bzid:t,start_time:e,end_time:a,innerRange:i},method:"post"})},x=function(t){var e=t.time,a=t.bzid,i=t.timeRange;return n["a"].request({url:"analysis/heat_map",data:r.a.stringify({time:e,bzid:a,timeRange:i}),method:"post"})},D=function(t){var e=t.bzid,a=t.type,i=t.time;return n["a"].request({url:"judge/getIsFloat",params:{bzid:e,type:a,time:i},method:"get"})},_=function(t){var e=t.property_id,a=t.type;return n["a"].request({url:"judge/getHKBzids",params:{property_id:e,type:a},method:"get"})},z=function(t){var e=t.time1,a=t.range,i=t.from_bzids,r=t.to_bzids;return n["a"].request({url:"cross/trend",params:{time1:e,range:a,from_bzids:i,to_bzids:r},method:"get"})}},9545:function(t,e,a){},"9c60":function(t,e,a){var n=a("63b6"),i=a("13c8")(!0);n(n.S,"Object",{entries:function(t){return i(t)}})},"9fe9":function(t,e,a){"use strict";var n=a("5de8"),i=a.n(n);i.a},ab14:function(t,e,a){"use strict";var n=function(t){return"#"===t.charAt(0)?t.slice(1):t},i=function(t){var e=3===t.length||4===t.length,a=e?""+t.slice(0,1)+t.slice(0,1):t.slice(0,2),n=e?""+t.slice(1,2)+t.slice(1,2):t.slice(2,4),i=e?""+t.slice(2,3)+t.slice(2,3):t.slice(4,6),r=(e?""+t.slice(3,4)+t.slice(3,4):t.slice(6,8))||"ff";return{r:a,g:n,b:i,a:r}},r=function(t){return parseInt(t,16)},o=function(t){var e=t.r,a=t.g,n=t.b,i=t.a;return{r:r(e),g:r(a),b:r(n),a:+(r(i)/255).toFixed(2)}},s=function(t){return!isNaN(parseFloat(t))&&isFinite(t)},c=function(t,e){var a=t.r,n=t.g,i=t.b,r=t.a,o=s(e)?e:r;return"rgba("+a+", "+n+", "+i+", "+o+")"},u=function(t,e){var a=n(t),r=i(a),s=o(r);return c(s,e)};t.exports=u},b606:function(t,e,a){a("9c60"),t.exports=a("584a").Object.entries},b746:function(t,e,a){},bc8a:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"drainage-map"},[a("h1",[t._v("引流图\n      "),a("Tooltip",{attrs:{content:t.tootipText,placement:"right",theme:"light",transfer:"","max-width":"500"}},[a("icons",{attrs:{type:"wenhao"}})],1)],1),a("div",{staticClass:"drainage-map-text",style:{height:t.mapHeight,margin:t.mapMargin}},[a("div",{staticClass:"drainage-map-left"},[a("div",{staticClass:"drainage-map-left-top"},[a("ul",t._l(t.dataList.direct,function(e,n){return a("li",{key:n},[a("div",{staticClass:"drainage-enter"},[a("p",[t._v("客流占比："+t._s(e.value)+"%")]),a("p",[t._v("\n                              环比\n                              "),e.action?a("Icon",{attrs:{type:"md-arrow-dropdown"}}):a("Icon",{attrs:{type:"md-arrow-dropup"}}),a("span",{class:{clolorAction:e.action}},[t._v(t._s(e.link)+"%")])],1)]),a("div",{staticClass:"drainage-name",staticStyle:{"padding-left":"10%"}},[t._v(t._s(e.name))]),a("div",{staticClass:"drainage-img"},[a("img",{attrs:{src:t.accessImg,alt:""}})])])}))]),a("div",{staticClass:"drainage-map-left-bottom"},[a("ul",t._l(t.dataList.radiation,function(e,n){return a("li",{key:n},[a("div",{staticClass:"drainage-enter"},[a("p",[t._v("客流占比："+t._s(e.value)+"%")]),a("p",[t._v("\n                              环比\n                              "),e.action?a("Icon",{attrs:{type:"md-arrow-dropdown"}}):a("Icon",{attrs:{type:"md-arrow-dropup"}}),a("span",{class:{clolorAction:e.action}},[t._v(t._s(e.link)+"%")])],1)]),a("div",{staticClass:"drainage-name",staticStyle:{"padding-left":"10%"}},[t._v(t._s(e.name))]),a("div",{staticClass:"drainage-img"},[a("img",{attrs:{src:t.shopImg,alt:""}})])])}))])]),a("div",{staticClass:"drainage-map-center"},[a("img",{staticClass:"drainage-map-center-bg",attrs:{src:t.centerImg,alt:""}}),a("div",{staticClass:"drainage-map-center-text"},[a("img",{style:{margin:t.margin},attrs:{src:t.shopImg,alt:""}}),a("p",{staticClass:"drainage-shop-name"},[t._v(t._s(t.presentData.name))])]),t._l(t.centerData,function(e){return a("div",{staticClass:"text-location"},[a("p",[t._v(t._s(e.text)+"："+t._s(e.value)+"%")]),a("p",[t._v("\n                    环比\n                  "),e.action?a("Icon",{attrs:{type:"md-arrow-dropdown"}}):a("Icon",{attrs:{type:"md-arrow-dropup"}}),a("span",{class:{clolorAction:e.action}},[t._v(t._s(e.link)+"%")])],1)])})],2),a("div",{staticClass:"drainage-map-right"},[a("div",{staticClass:"drainage-map-left-top"},[a("ul",t._l(t.dataList.indirect,function(e,n){return a("li",{key:n},[a("div",{staticClass:"drainage-img"},[a("img",{attrs:{src:t.shopImg,alt:""}})]),a("div",{staticClass:"drainage-name",staticStyle:{"padding-right":"10%"}},[t._v(t._s(e.name))]),a("div",{staticClass:"drainage-enter"},[a("p",[t._v("客流占比："+t._s(e.value)+"%")]),a("p",[t._v("\n                              环比\n                              "),e.action?a("Icon",{attrs:{type:"md-arrow-dropdown"}}):a("Icon",{attrs:{type:"md-arrow-dropup"}}),a("span",{class:{clolorAction:e.action}},[t._v(t._s(e.link)+"%")])],1)])])}))]),a("div",{staticClass:"drainage-map-left-bottom"},[a("ul",t._l(t.dataList.departure,function(e,n){return a("li",{key:n},[a("div",{staticClass:"drainage-img"},[a("img",{attrs:{src:t.accessImg,alt:""}})]),a("div",{staticClass:"drainage-name",staticStyle:{"padding-right":"10%"}},[t._v(t._s(e.name))]),a("div",{staticClass:"drainage-enter"},[a("p",[t._v("客流占比："+t._s(e.value)+"%")]),a("p",[t._v("\n                              环比\n                              "),e.action?a("Icon",{attrs:{type:"md-arrow-dropdown"}}):a("Icon",{attrs:{type:"md-arrow-dropup"}}),a("span",{class:{clolorAction:e.action}},[t._v(t._s(e.link)+"%")])],1)])])}))])])])])},i=[],r={name:"drainage-map",props:{dataList:{type:Object,default:{}},presentData:{type:Object,default:{}},centerData:{type:Array,default:[]},mapHeight:{type:String,default:"800px"},mapMargin:{type:String,default:"50px auto 0 auto"},margin:{type:String,default:"-50px"}},components:{},data:function(){return{listData:{direct:[],indirect:[],radiation:[],departure:[]},centerList:[{value:36,text:"出入口引入占比",action:!1,link:10},{value:36,text:"辐射店铺占比",action:!0,link:10},{value:36,text:"店铺引入占比",action:!0,link:10},{value:36,text:"离场客流占比",action:!1,link:10}],centerImg:a("85aa"),shopImg:a("6f5f"),accessImg:a("f572"),tootipText:"该引流图包括出入口引入客流、店铺引入客流、辐射店铺客流和离场客流，其中：\n出入口引入客流：从出入口直接进入所选店铺的转化客流\n店铺引入客流：从其他店铺到所选店铺的转化客流\n辐射店铺客流：从所选店铺到其他店铺转化客流\n离场客流：从所选店铺直接离开购物中心的客流"}},mounted:function(){},methods:{}},o=r,s=(a("cd8f"),a("2877")),c=Object(s["a"])(o,n,i,!1,null,"35c843da",null);e["a"]=c.exports},c5bf:function(t,e,a){},c6a0:function(t,e,a){"use strict";var n=a("909b"),i=a.n(n);i.a},cd8f:function(t,e,a){"use strict";var n=a("730b"),i=a.n(n);i.a},f572:function(t,e,a){t.exports=a.p+"img/access.c670f50b.png"}}]);