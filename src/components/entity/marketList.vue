<template>
  <div class="entity-center">
    <table-multiple-selected
        :tableName='tableName'
        :tableList='tableList'
        :titleName='titleName'
        :userLvl="userLvl"
        @tableData='editMail'
        @removeData='delMail'
    >
    </table-multiple-selected>
  </div>

</template>

<script>
import TableMultipleSelected from '@/views/ui-elements/table/TableMultipleSelected.vue'
import { getGroupOrganization } from '@/api/home.js'
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
      titleName: '基本信息',
      tableName: [
        '名称', '本年客流目标', '本年销售目标', '详情地址', '描述', '操作'
      ],
      tableList: [
      ]
    }
  },
  computed: {

  },
  methods: {
    init () {
      var that = this
      getGroupOrganization()
        .then(function (res) {
          var data = res.data.data
          that.tableList = []
          let shoppingInfoDate = that.$store.state.user.shoppingInfoDate
          let obj = {}
          obj = _.find(data.property, ['property_id', shoppingInfoDate.property_id])
          obj.operation = true
          //获取当年年份
          const currentYear = new Date().getFullYear()
          //当年的客流目标
          const goalFlow = obj.goal_flow.find(f => {
            return f.year === currentYear
          })
          const flowType = goalFlow.is_year
          if (!flowType) obj.enterGoal = '0人'
          switch (flowType) {
            case 'year':
              obj.enterGoal = goalFlow.flow_year ? goalFlow.flow_year.toLocaleString() + '人' : '0人'
              break;
            case 'month':
              const month = goalFlow.detail.months
              const number = month.map(function (m) {
                return formatNumber(Object.values(m)[0])
              })
              const sumMonthFlow = thousandSeparator(_.sum(number))
              obj.enterGoal = sumMonthFlow + '人'
              break
          }

          // 当年的销售目标
          const goalSale = obj.goal_sale.find(s => {
            return s.year === currentYear
          })
          const saleType = goalSale.is_year
          if (!saleType) obj.saleGoal = '0元'
          switch (saleType) {
            case 'year':
              obj.saleGoal = goalSale.sale_year ? goalSale.sale_year.toLocaleString() + '元' : '0元'
              break;
            case 'month':
              const monthSale = goalSale.detail.months
              const numberSale = monthSale.map(function (m) {
                return formatNumber(Object.values(m)[0])
              })
              const sumMonthSale = thousandSeparator(_.sum(numberSale))
              obj.saleGoal = sumMonthSale + '元'
          }
          obj.address = obj.address ? obj.address : ' '
          obj.describe = obj.description ? obj.description : ' '
          that.tableList.push(obj)
        })
    },
    editMail (value) {
      this.$emit('editMail', value.data)
    },
    delMail (value) {
      let alertText = {}
      alertText.title = '删除实体'
      alertText.text = '确认删除此商场信息？'
      alertText.bg = '#00A0E9'
      alertText.confirm = true
      this.$emit('delMail', true, alertText, value.data)
    }
  },

  mounted () {
    this.init()
  }

}
</script>
<style lang="scss" scoped>
.entity-center{
  width: 100%;
  height: auto;
  margin-top: 20px;
  .vx-card{
    box-shadow:none;
  }
}
</style>
