<template>
  <div>
    <shop-ten v-if="userType"></shop-ten>
    <tendency class="m-t-20"></tendency>
  </div>
</template>
<script>
import shopTen from '@/components/go-shop-analysis/shop10.vue'
import tendency from '@/components/go-shop-analysis/tendency.vue'
export default {
  name: 'goShop',
  components: {
    shopTen,
    tendency

  },
  data () {
    return {}
  },
  computed: {
    userType () {
      let isShop
      let admin = this.$store.state.user.role_id
      if (admin < 3) {
        return true
      } else {
        let typeId = this.$store.state.user.allType
        typeId.map(val => {
          if (val) {
            if (val != 50) isShop = true
            else isShop = false
          }
        })
        return isShop
      }
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>

</style>
