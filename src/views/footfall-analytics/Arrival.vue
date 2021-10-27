<template>
	<div>
		<flow-selector @paramsPrepare="paramsPrepare"></flow-selector>
		<!-- enter -->
		<div class="mt-6 newOld-chart-box" >
<!--			<div class="bg-white box-card pb-6">-->
<!--				<chart-tabs :xAxis="newOldChartData.xAxis"-->
<!--										:labels="newOldChartData.labels"-->
<!--										:series="newOldChartData.series"-->
<!--										:type="newOldChartData.type"-->
<!--										:extraOptions="extraOptionsNewold"-->
<!--										:chartWidth='chartWidth'-->
<!--										title="新老顾客占比"-->
<!--										:tooltipUnit="$t('人')"-->
<!--										@tableChage="ageTableChange">-->
<!--					<export-menu slot="export"-->
<!--											 @onchange="ageExportBiztop"></export-menu>-->
<!--				</chart-tabs>-->
<!--			</div>-->
			<div class="bg-white box-card pb-6">
				<chart-tabs :xAxis="arrivalChartData.xAxis"
										:labels="arrivalChartData.labels"
										:series="arrivalChartData.series"
										:type="arrivalChartData.type"
										:extraOptions="extraOptionsArrival"
										:chartWidth='chartWidth'
										title="到访次数"
										:tooltipUnit="$t('人')"
										@tableChage="genderTableChange">
					<export-menu slot="export"
											 @onchange="genderExportBiztop"></export-menu>
				</chart-tabs>
			</div>
		</div>
	</div>
</template>
<script>
  import { exportEx } from '@/api/home.js'
  import { downloadEx } from '@/libs/util'
  import { getEntityFlowBatch } from '@/api/analysis'
  import exportMenu from '@/views/operation/components/ExportMenu.vue'
  import chartTabs from '@/components/common/CopyChartsTabs.vue'
  import FlowSelector from '_c/flow-selector/age-gender-flow-selector'
  import customerNameDict from '../home/seriesDict'
  export default {
    name: 'ageGender',
    components: {
      FlowSelector,
      chartTabs,
      exportMenu
    },
    data () {
      return {
        chartData: { newOld: {}, arrival: {} },
        extraOptionsNewold: {
          plotOptions: {
            bar: {
              columnWidth:'50%'
            }
          }
        },
        extraOptionsArrival:{
          chart: {
            stacked: true
          },
          plotOptions: {
            bar: {
              endingShape: 'flat',
              // columnWidth:'35%'
            }
          }
				},
        ageTableList: [],
        genderTableList: []
      }
    },
    computed: {
      newOldChartData () {
        return this.chartData.newOld
      },
      arrivalChartData () {
        return this.chartData.arrival
      },
      chartWidth () {
        let width
        if (this.chartData.newOld.xAxis) {
          let xSize = this.chartData.newOld.xAxis.data.length
          xSize < 16 ? width = '100%' : width = xSize * 60
        } else width = '100%'
        return width
      }
    },
    methods: {
      async  paramsPrepare (pparams) {
        this.entitys = pparams.entitys
        this.bzids = this.entitys.map(i => i.id)
        const range1 = pparams.date1Array.toString()
        let res
        if (['time','onYear','onChain'].includes(pparams.compareType)) { // 时间对比
          const range2 = pparams.date2Array.toString()
          res = await getEntityFlowBatch({ range1, range2, bzid: this.bzids.toString() })
        } else {
          res = await getEntityFlowBatch({ range1, bzid: this.bzids.toString() })
        }
        this.chartData = this.handleTypeData(res.data.data,pparams)
      },
      handleTypeData (data,pparams) {
        const keyArr = ['new_old_proportion','arrival_distribution']
        const singleTime = Object.keys(data[0].stat).length === 1// 时间对比，选择相同的时间，后台返回一个
				const singleEntity = data.length === 1;
				if(singleTime && singleEntity){//单个实体 且 非时间对比
				  const singleData = Object.values(data[0].stat)[0]
					const labelArr = keyArr.map(key => {
					  const obj = singleData[key];
					  return {
					    data:Object.keys(obj).map(o => customerNameDict[o].name),
              icons:Object.keys(obj).map(o => customerNameDict[o].icon),
              key,
              name: this.$t('类型'),
						}
					})
          const seriesArr = keyArr.map(key => {
            return Object.values(singleData[key])
          })
          return {
            newOld:{
              series: seriesArr[0],
              type:['donut'],
              labels: labelArr[0],
            },
            arrival:{
              series: seriesArr[1],
              type:['pie'],
              labels: labelArr[1],
						}
          }
				}else { //时间对比 或者 多实体
				  let xAxis = {
				    name:singleTime ? this.$t('实体') : this.$t('时间'),
						key:singleTime ? 'id' : 'time',
						data:[]
					};
          let seriesArr = [];
					data.forEach( entity =>{
					  //单实体不用显示实体名
					  let name = singleEntity? '' : pparams.entitys.find(o=>{
					    return Number(o.id) === Number(entity.bzid)
						}).label;
					  if(!singleTime){
              xAxis.data = xAxis.data.concat(Object.keys(entity.stat).map(o=>{
                return `${name} ${o.split(',').join(' - ')}`
              }))
						}else {
              xAxis.data.push(name)
            }
						
            keyArr.forEach((typeKey,typeIndex) => {
              Object.values(entity.stat).map( o => {
                if( seriesArr[typeIndex] && seriesArr[typeIndex]){
                  Object.values(o[typeKey]).forEach((d,i) => {
                    seriesArr[typeIndex][i].data.push(d)
                  })
                }else {
                  seriesArr[typeIndex] = Object.keys(o[typeKey]).map(key=>{
                    return {
                      name:customerNameDict[key].name,
                      key,
                      data:[o[typeKey][key]]
                    }
                  })
                }
              })
						})
						
					})
          return {
            newOld:{
              series: seriesArr[0],
              type:['bar'],
              xAxis: xAxis,
            },
            arrival:{
              xAxis: xAxis,
              type:['bar'],
              series:seriesArr[1]
						}
          }
        }
      },

      ageTableChange (value) {
        this.ageTableList = value.data
      },
      ageExportBiztop () {
        this.uploadList(this.ageTableList)
      },
      genderTableChange (value) {
        this.genderTableList = value.data
      },
      genderExportBiztop () {
        this.uploadList(this.genderTableList)
      },
      uploadList (value) {
        downloadEx(exportEx,'到店次数客流数据',value)
      }
    },
  }
</script>
<style lang="stylus">
	.newOld-chart-box
		display grid
		grid-template-columns repeat(1, minmax(0px, 1fr))
		grid-template-areas 'age gender'
		grid-gap 0px
		// @media (max-width: 768px)
		//   grid-template-columns minmax(10px, 1fr)
		//   grid-template-areas 'age' 'gender'
		// grid-gap 20px
		>div
			&:nth-child(1)
				grid-area age
				margin-right 0px
			&:nth-child(2) /deep/
			grid-area gender
				.custom-legend-box
					padding 0 60px
</style>
