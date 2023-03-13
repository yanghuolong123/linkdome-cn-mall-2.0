<template>
	<div class="entity-center">
		<table-multiple-selected
				:tableName='tableName'
				:tableList='tableList'
				titleName='基本信息'
				:userLvl="userLvl"
				@imgConfig="imgConfig"
				@tableData='editMail'
		>
		</table-multiple-selected>
	</div>

</template>

<script>
  import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
  import { thousandSeparator, formatNumber } from '@/libs/util.js'

  export default {
    components: {
      TableMultipleSelected
    },
    props: {
      userLvl: {
        type: String,
        default: 'admin'
      }
    },
    data () {
      return {
        tableList: []
      }
    },
    computed: {
      tableName () {
        if (this.userLvl === 'admin') {
          return [
            '名称','实体类别', '本年客流目标', '本年销售目标', '详情地址', '描述', '图片配置', '操作'
          ]
        } else {
          return [
            '名称','实体类别', '本年客流目标', '本年销售目标', '详情地址', '描述', '操作'
          ]
        }
      }
    },
    methods: {
      init () {
        const data = this.$store.state.home.organizationData
        this.tableList = []
        let shoppingInfoDate = this.$store.state.user.shoppingInfoDate
        let obj = {}
        obj = _.find(data.property, ['property_id', shoppingInfoDate.property_id])
        obj.operation = true
				obj.hideDelBtn = true
        obj.imgConfig = this.userLvl === 'admin'
        //获取当年年份
        const currentYear = new Date().getFullYear()
        //当年的客流目标
        const goalFlow = obj.goal_flow.find(f => {
          return f.year === currentYear
        })
        const flowType = goalFlow.is_year
        if (!flowType) obj.enterGoal = '0'+this.$t('人')
        switch (flowType) {
          case 'year':
            obj.enterGoal = goalFlow.flow_year ? goalFlow.flow_year.toLocaleString() + this.$t('人') : '0'+this.$t('人')
            break
          case 'month':
            const month = goalFlow.detail.months
            const number = month.map(function (m) {
              return formatNumber(Object.values(m)[0])
            })
            const sumMonthFlow = thousandSeparator(_.sum(number))
            obj.enterGoal = sumMonthFlow + this.$t('人')
            break
        }

        // 当年的销售目标
        const goalSale = obj.goal_sale.find(s => {
          return s.year === currentYear
        })
        const saleType = goalSale.is_year
        if (!saleType) obj.saleGoal = '0'+this.$t('元')
        switch (saleType) {
          case 'year':
            obj.saleGoal = goalSale.sale_year ? goalSale.sale_year.toLocaleString() + this.$t('元') : '0'+this.$t('元')
            break
          case 'month':
            const monthSale = goalSale.detail.months
            const numberSale = monthSale.map(function (m) {
              return formatNumber(Object.values(m)[0])
            })
            const sumMonthSale = thousandSeparator(_.sum(numberSale))
            obj.saleGoal = sumMonthSale +this.$t('元')
        }
        obj.address = obj.address ? obj.address : ' '
        obj.description = obj.description ? obj.description : ' '
				obj.type_name = 'mall'
        this.tableList.push(obj)
      },
      imgConfig () {
        this.$emit('imgConfig')
      },
      editMail (value) {
        this.$emit('editMail', value.data)
      },
    },

  }
</script>
<style lang="scss" scoped>
	.entity-center {
		width: 100%;
		height: auto;
		margin-top: 20px;
		
		.vx-card {
			box-shadow: none;
		}
	}
</style>
