<template>
	<div class="table-list" style="  margin: 12px 0 20px 0;
        padding: 0 80px;">
		
		<title-name :listTitle='listTitle'></title-name>
		<table cellpadding="0" cellspacing="0" style="   border: 4px dashed #4edbda;
            margin: 12px 0 0 0;
            border-radius: 8px;">
			<tr style="background-color:#2081D4;">
				<td rowspan="2" style="height:110px; border-right: 2px solid #fff;
                     font-size: 22px;"
					:key="index1" v-for="(name1,index1) in tableColumn.name1">
					{{name1}}
				</td>
				<td colspan="3"
					style="height:55px;border-bottom:2px solid #fff;border-right: 2px solid #fff;
                     font-size: 22px;"
					:key="index2+100" v-for="(name2,index2) in tableColumn.name2">
					{{name2}}
				</td>
			</tr>
			<tr style="background-color:#2081D4;">
				<td style="border-right: 2px solid #fff;
                     font-size: 22px;" :key="index" v-for="(name3,index) in tableColumn.name3">
					{{name3}}
				</td>
			</tr>
			<tr class="table-tr" :key="index3" v-for="(list,index3) in tableData">
				<td style="font-size: 16px;
                    height: 55px;
                    border-right:2px solid #D2D2D2;
                    border-bottom: 2px solid #D2D2D2;" :key="index2" v-for="(data,index2) in  list.data">{{data}}
				</td>
			</tr>
		</table>
	</div>
</template>
<script>
  import titleName from './report_title_name'

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
