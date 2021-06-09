export const downLoadEx = (tableData, name) => {
  // height:60px;background-color: #d9d9d9;color:#000;  font-size: 18px;border:1px solid #000
  // background-color: #d9d9d9;height:30px; color:#000;  font-size: 18px;border:1px solid #000
  // height:45px; font-size: 14px;border:1px solid #000
  // 自定义的表格
  var tableStr = ` <tr style="text-align: center; height:50px;font-size: 18px">
                    <td rowspan="2" style="width:100px">时间</td>
                    <td rowspan="2" style="width:100px">入客流</td>
                    <td colspan="3" style="width:300px">同比分析</td>
                    <td colspan="3" style="width:300px">环比分析</td>
                </tr>
                <tr style="text-align: center;height:40px;font-size: 18px">
                    <td >时间</td>
                    <td >入客流</td>
                    <td >增长率</td>
                    <td >时间</td>
                    <td >入客流</td>
                    <td >增长率</td>
                </tr>`
  for (let item of tableData) {
    tableStr += `<tr style="text-align: center;height:30px;">
                    <td>${item.time}</td>
                    <td>${item.enter}</td>
                    <td>${item.onYearTime}</td>
                    <td>${item.onYearEnter}</td>
                    <td>${item.onYearRate}</td>
                    <td>${item.linkRelativeTime}</td>
                    <td>${item.linkRelativeEnter}</td>
                    <td>${item.linkRelativeRate}</td>
                </tr>`
  }
  // Worksheet名
  var worksheet = 'Sheet1'
  var uri = 'data:application/vnd.ms-excel;base64,'
  // 真正要导出（下载）的HTML模板
  var exportTemplate = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" 
                xmlns="http://www.w3.org/TR/REC-html40">
                    <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
                        <x:Name>${worksheet}</x:Name>
                            <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
                        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
                    </head>
                    <body>
                        <table syle="table-layout: fixed;word-wrap: break-word; word-break: break-all;">${tableStr}</table>
                    </body>
                </html>`
  // 下载模板
  const elink = document.createElement('a')
  elink.download = name
  elink.style.display = 'none'
  elink.href = uri + base64(exportTemplate)
  document.body.appendChild(elink)
  elink.click()
  URL.revokeObjectURL(elink.href)// 释放URL 对象
  document.body.removeChild(elink)

//   document.getElementById('dlink').href = uri + base64(exportTemplate)
//   document.getElementById('dlink').download = tableData[0].time + tableData[tableData.length - 1].time
//   document.getElementById('dlink').click()
}
// 输出base64编码
function base64 (s) {
  return window.btoa(unescape(encodeURIComponent(s)))
};
