<template>
	<div class="table-list" style="  margin: 12px 0 20px 0;
        padding: 0 80px;">
		<title-name :listTitle='listTitle'></title-name>
		<table cellpadding="0" cellspacing="0" style="   border: 4px dashed #4edbda;
            margin: 12px 0 0 0;
            border-radius: 8px;">
			<tr style="background-color:#2081D4;">
				<td rowspan="2" style="height:80px; border-right: 2px solid #fff;
                     font-size: 22px;width: 176px"
					:key="'name1'+i" v-for="(name1,i) in tableColumn.name1">
					{{name1}}
				</td>
				<td :colspan="tableColumn.name4.length"
					style="height:40px;border-bottom:2px solid #fff;border-right: 2px solid #fff;
                     font-size: 22px;"
					:key="'name2'+i" v-for="(name,i) in tableColumn.name2">
					{{name}}
				</td>
				<td colspan="2" style="height:35px;border-bottom:2px solid #fff;border-right: 2px solid #fff;
                     font-size: 22px;width: 120px" :key="i" v-for="(name,i) in tableColumn.name3">
					{{name}}
				</td>
			</tr>
			<tr style="background-color:#2081D4;">
				<td style="border-right: 2px solid #fff;
                     font-size: 22px;" :key="'name4'+i" v-for="(name,i) in tableColumn.name4">
					{{name}}
				</td>
				<td style="border-right: 2px solid #fff;
                     font-size: 22px;" :key="'name5'+i" v-for="(name,i) in tableColumn.name5">
					{{name}}
				</td>
			</tr>
			<tr class="table-tr" :key="i" v-for="(list,i) in tableData">
				<td style="font-size: 16px;
                    height: 35px;
                    border-right:2px solid #D2D2D2;
                    border-bottom: 2px solid #D2D2D2;" :key="index2" v-for="(data,index2) in  list">
					{{data|formatTableData}}
				</td>
			</tr>
		</table>
	</div>
</template>
<script>
  import titleName from '@/components/report-public/report_title_name'

  export default {
    name: 'report-ratio',
    props: {
      listTitle: {
        type: Object
      },
      tableColumn: {
        type: Object
      },
      tableData: {
        type: Array,
        default: []
      },

    },
    components: {
      titleName
    },
    data () {
      return {}
    },
    watch: {},
    filters: {
      formatTableData (val) {
        if (typeof val === 'string') {
          return val
        } else {
          return val.toLocaleString() + '人'
        }
      }
    },
    computed: {
      dateWeek () {
        return this.$store.state.report.reportHeader
      }
    },
    created () {

    },
    mounted () {
    },
    methods: {}
  }
</script>
<style scoped lang="less">
	.table-list {

		table {
			width: 100%;
			height: auto;
			background-color: #fff;
			padding: 0;
			
			tr {
				width: 100%;
				margin: 0;
				padding: 0;
				
				td {
					text-align: center;
					color: #fff;
					
					&:last-child {
						border-right: none;
					}
				}
				
			}
			
			.table-tr {
				&:last-child {
					td {
						border-bottom: none;
					}
				}
				
				td {
					color: #3D3D3D;
					
				}
			}
		}
	}

</style>
