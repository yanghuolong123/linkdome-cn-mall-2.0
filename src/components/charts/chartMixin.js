export default {
  props: {
    isAllZero: {
      type: Boolean
    }
  },
  watch: {
    '$store.state.report.leftWidth': {
      handler (newval, oldVal) {
        setTimeout(() => {
          if (this.dom) this.dom.reflow()
        }, 300)
      },
      immediate: true
    }
  },
  model: {
    prop: 'isAllzero',
    event: 'onAllzero'
  },
  methods: {
    apiErrorInitCharts () {
      while (this.dom.series.length > 0) { this.dom.series[0].remove(true) }
    }
  }
}
