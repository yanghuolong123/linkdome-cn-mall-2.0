<template>
    <div class="entity-center">
        <table-multiple-selected
                :tableName='tableName'
                :tableList='tableList'
                titleName='basicInfo'
                :userLvl="userLvl"
                :actionList="floorActions"
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
        return ['name', 'entityCategory', 'thisYearEnterTarget', 'thisYearSaleTarget', 'detailAddr', 'description', 'operate']

      },
      floorActions () {
        let arr = []
        if (this.userLvl === 'admin') {
          arr = [
            {
              name: 'imgConfig',
              icon: 'md-image'
            }
          ]
        }
        return arr
      },
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
        if (goalFlow) {
          const flowType = goalFlow.is_year
          if (!flowType) obj.enterGoal = '0' + this.$t('person')
          switch (flowType) {
            case 'year':
              obj.enterGoal = goalFlow.flow_year ? goalFlow.flow_year.toLocaleString() + this.$t('person') : '0' + this.$t('person')
              break
            case 'month':
              const month = goalFlow.detail.months
              const number = month.map(function (m) {
                return formatNumber(Object.values(m)[0])
              })
              const sumMonthFlow = thousandSeparator(_.sum(number))
              obj.enterGoal = sumMonthFlow + this.$t('person')
              break
          }
        } else {
          this.$message.warning(this.$t('notices.flowTargetConfig'))
        }

        // 当年的销售目标
        const goalSale = obj.goal_sale.find(s => {
          return s.year === currentYear
        })
        if (goalSale) {
          const saleType = goalSale.is_year
          if (!saleType) obj.saleGoal = '0' + this.$t('yuanUnit')
          switch (saleType) {
            case 'year':
              obj.saleGoal = goalSale.sale_year ? goalSale.sale_year.toLocaleString() + this.$t('yuanUnit') : '0' + this.$t('yuanUnit')
              break
            case 'month':
              const monthSale = goalSale.detail.months
              const numberSale = monthSale.map(function (m) {
                return formatNumber(Object.values(m)[0])
              })
              const sumMonthSale = thousandSeparator(_.sum(numberSale))
              obj.saleGoal = sumMonthSale + this.$t('yuanUnit')
          }
        } else {
          this.$message.warning(this.$t('notices.saleTargetConfig'))
        }

        obj.address = obj.address ? obj.address : ' '
        obj.description = obj.description ? obj.description : ' '
        obj.type_name = 'mall'
        obj.logo = obj.map_url
        this.tableList.push(obj)
      },
      imgConfig () {
        this.$emit('imgConfig')
      },
      editMail (value) {
        this.$emit('editMall', value.data)
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
