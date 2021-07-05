<template>
  <div>
    <goqueue></goqueue>
    <gotouch style="margin-top:50px;"></gotouch>
  </div>
</template>
<script>
import goqueue from '@/components/go-shop-analysis/goqueue.vue'
import gotouch from '@/components/go-shop-analysis/gotouch.vue'
export default {
  name: 'queue',
  components: {
    goqueue,
    gotouch

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
