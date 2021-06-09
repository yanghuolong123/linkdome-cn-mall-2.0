// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export const getPdf = (id, fun) => {
  html2Canvas(document.querySelector('#' + id), {
    useCORS: true,
    allowTaint: true
  }).then(function (canvas) {
    var width = document.body.offsetWidth
    var size = 1400
    if (width == 1440) {
      size = 2800
    } else if (width == 1920) {
      size = 1400
    }
    let contentWidth = size
    let contentHeight = canvas.height
    let pageHeight = contentWidth / 592.28 * 841.89
    let leftHeight = contentHeight
    let position = 0
    let imgWidth = 595.28
    let imgHeight = 592.28 / contentWidth * contentHeight
    let pageData = canvas.toDataURL('image/jpeg', 1.0)

    let PDF = new JsPDF('', 'pt', 'a4')
    if (leftHeight < pageHeight) {
      PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
    } else {
      while (leftHeight > 0) {
        PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
        leftHeight -= pageHeight
        position -= 841.89
        if (leftHeight > 0) {
          PDF.addPage()
        }
      }
    }
    PDF.save(name + '.pdf')
    that.$vs.loading.close()
  }
  )
}
