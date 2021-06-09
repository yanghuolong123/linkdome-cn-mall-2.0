export default {
  state: {
    reportYear: '',
    companyName: '',
    companyLogo: '',
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
    companyLogo (state, value) {
      state.companyLogo = value
    },
    companyDateTime (state, value) {
      state.companyDateTime = value
    }
  },
  actions: {}
}
