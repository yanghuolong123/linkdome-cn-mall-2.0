<template>
  <Row class="idatepicker">
    <i-col span="24">
    <i-date-picker @selectDate = "dateDidChange"></i-date-picker>
    </i-col>
  </Row>
</template>
<script>
import iDatePicker from '_c/common/idatepicker.vue'
export default {
  props: {
    dtype: {
      type: Number
    }
  },
  components: {
    iDatePicker
  },
  name: 'iTimePicker',
  data () {
    return {
    }
  },
  methods: {
    dateDidChange (dates, type) {
      if (this.dtype === 0) {
        this.$emit('originDateDidChange', dates)
      } else {
        this.$emit('otherDateDidChange', dates)
      }
    }
  }
}
</script>
