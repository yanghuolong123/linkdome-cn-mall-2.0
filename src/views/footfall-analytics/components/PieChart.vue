<template>
	<div class="chart-box flex-column">
		<div class="flex-between chart-title">
			<span>{{ $t(toolList[tool] && toolList[tool].name) }}</span>
			<div class="flex-center">
				<slot></slot>
				<span
					class="icon"
					@click="changeTab(item,index)"
					v-for="(item, index) in toolList"
					:key="index"
				>
          <icons
						class="pointer"
						:type="item.icon"
						:color="tool === index ? '#37b5ed' : '#9D9D9DFF'"
						:size="20"
					></icons>
        </span>
			</div>
		</div>
		<div class="chart">
			<div class="pie-chart" id="pie-chart-x" v-show="currentChart === 'pie'"></div>
			<div class="table" ref="table" v-show="currentChart === 'table'">
				<Table
					stripe
					:height="tableHeight"
					:columns="tableColumn"
					:data="tableData"
				></Table>
			</div>
		</div>
	</div>
</template>
<script>
  import { isEmpty, downloadEx } from '@/libs/util'
  import { exportEx } from '@/api/home.js'

  export default {
    props: {
      toolList: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        tool: 0,
        chart: null,
        tableHeight: 0,
        chartOption: null,
        tableData: [],
        tableColumn: [],
      }
    },
    computed: {
      currentChart () {
        if (this.toolList[this.tool].value === 'table') {
          this.$nextTick(() => {
            this.tableHeight = this.$refs.table.offsetHeight - 20
          })
        }
        return this.toolList[this.tool].value
      },
    },
    methods: {
      getTableDataNoneEff (option) {//无效客流中统计外卖和店员专用
        return option.series[0].data.map(o => {
          return {
            entity: o.name,
            'category0': o.staff.toLocaleString(),
            'category1': o.takeout.toLocaleString(),
          }
        })
      },
      getTableData (option) {
        return option.series[0].data.map(o => {
          return {
            entity: o.name,
            category0: o.value
          }
        })
      },
      getTableColumn (option) {
        if (isEmpty(option)) return []
        let column = [
          {
            title: option.compareType === 'businessType' ? this.$t('bussinessType') : this.$t("entity"),
            key: 'entity',
          }
        ]
        column = column.concat(
          option.category.map((o, i) => {
            return {
              key: 'category' + i,
              title: (o + `(${this.$t('personTime')})`)
            }
          })
        )
        return column
      },
      changeTab (item, index) {
        if (item.value === 'download') {
          this.handleDownload(index)
          return
        }
        this.tool = index
        this.$emit('toolClick', this.currentChart)
      },
      handleDownload (index) {
        // this.initTable(this.chartOption)
        downloadEx(exportEx, this.toolList[index].name, [
          this.tableColumn,
          this.tableData,
        ])
      },
      initChart (option) {
        this.chart.setOption(option, true)
        this.$nextTick(() => {
          this.chart.resize()
        })
      },
      initTableNoneEff (option) {
        this.tableColumn = this.getTableColumn(option)
        this.tableData = this.getTableDataNoneEff(option)
      },
      initTable (option) {
        this.tableColumn = this.getTableColumn(option)
        this.tableData = this.getTableData(option)
      }
    },
    mounted () {
      this.chart = echarts.init(
        document.getElementById(`pie-chart-x`)
      )
    }
  }
</script>
<style lang="less" scoped>
	.chart-box {
		.chart-title {
			font-size: 18px;

			.flex-center {
				.icon + .icon {
					margin-left: 10px;
				}
			}
		}

		.chart {
			height: 0;
			flex: 1;

			.pie-chart {
				width: 100%;
				height: 100%;
			}

			.table {
				padding: 20px 0;
				height: 100%;
			}
		}
	}
</style>
