export default {
  state: {
    dayReportHeader: '',
    weekReportHeader: '',
    monthReportHeader: '',
    customizeReportHeader: {},
    reportHeaderType: '',
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
    reportHeaderType (state, value) {
      state.reportHeaderType = value
    },
    dayReportHeader (state, value) {
      state.dayReportHeader = value
    },
    weekReportHeader (state, value) {
      state.weekReportHeader = value
    },
    monthReportHeader (state, value) {
      state.monthReportHeader = value
    },
    customizeReportHeader (state, value) {
      state.customizeReportHeader = value
    }
  },
  actions: {}
}
