export const chartScroll = (H) => {
  // internal functions
  function stopEvent (e) {
    if (e) {
      if (e.preventDefault) {
        e.preventDefault()
      }
      if (e.stopPropagation) {
        e.stopPropagation()
      }
      e.cancelBubble = true
    }
  }
  // the wrap
  H.wrap(H.Chart.prototype, 'render', function (proceed) {
    var chart = this,
      mapNavigation = chart.options.mapNavigation
    proceed.call(chart)
    // Add the mousewheel event
    H.addEvent(chart.container, document.onmousewheel === undefined ? 'DOMMouseScroll' : 'mousewheel', function (event) {
      var delta, extr, step, newMin, newMax, axis = chart.xAxis[0]
      if (chart.userOptions.xAxis && chart.userOptions.xAxis.hasOwnProperty('scrollbar') && chart.userOptions.xAxis.scrollbar.enabled) {
        var e = chart.pointer.normalize(event)
        // Firefox uses e.detail, WebKit and IE uses wheelDelta
        delta = e.detail || -(e.wheelDelta / 120)
        delta = delta < 0 ? 1 : -1

        if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
          extr = axis.getExtremes()
          step = (extr.max - extr.min) / 5 * delta
          axis.setExtremes(extr.min + step, extr.max + step, true, false)
        }
        stopEvent(event) // Issue #5011, returning false from non-jQuery event does not prevent default
        return false
      }
    })
  })
}
