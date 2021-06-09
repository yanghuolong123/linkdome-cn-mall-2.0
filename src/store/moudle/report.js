export default {
  state: {
    reportHeader: '',
    reportYear: '',
    companyName: '',
    companyDateTime: '',
    coverDateTime: '',
    leftWidth: false
  },
  mutations: {
    leftWidth (state, value) {
      state.leftWidth = value
    },
    coverDateTime (state, value) {
      state.coverDateTime = value
    },
    reportYear (state, value) {
      state.reportYear = value
    },
    companyName (state, value) {
      state.companyName = value
    },

    companyDateTime (state, value) {
      state.companyDateTime = value
    },

    reportHeader (state, value) {
      state.reportHeader = value
    }
  },
  actions: {}
}
