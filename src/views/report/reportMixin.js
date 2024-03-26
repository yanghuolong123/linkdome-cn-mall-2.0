import moment from "moment";
import _ from "lodash";
import { getToken,replaceBraces } from "@/libs/util";
import axios from "axios";
import NP from "number-precision";
import { mapState } from "vuex";
import {getReportSetting} from "@/api/report";
export default {
  data() {
    let that = this;
    return {
      saveHeaderData: {},
      enterData: [],
      suggestText: "",
      enterOption: {
        title: { text: " " },
        subtitle: { text: "" },
        credits: { enabled: false },
        yAxis: {
          min: 0,
          minRange: 1,
          title: { text: "" },
          labels: {
            enabled: false,
            formatter() {
              return this.value.toLocaleString();
            },
          },
        },
        xAxis: {
          categories: [],
        },
        plotOptions: {
          column: {
            stacking: this.stacking,
            dataLabels: {
              enabled: true,
              formatter: function() {
                return this.y.toLocaleString();
              },
              allowOverlap: true,
              style: {
                color: "#000",
                padding: 0,
              },
            },
            maxPointWidth: 20,
          },
          bar: {
            dataLabels: {
              enabled: true,
              formatter: function() {
                return this.y.toLocaleString();
              },
              allowOverlap: true,
              style: {
                color: "#000",
                padding: 0,
              },
            },
            maxPointWidth: 20,
          },
          line: {
            dataLabels: {
              enabled: true,
              formatter: function() {
                return this.y.toLocaleString();
              },
            },
          },
        },
        tooltip: {
          formatter() {
            return (
              this.x +
              "<br>" +
              this.series.name +
              ": " +
              this.y.toLocaleString() +
              that.$t('personTime')
            );
          },
        },
        series: [],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom",
                },
              },
            },
          ],
        },
      },
      dwellOption: {
        title: { text: " " },
        subtitle: { text: "" },
        credits: { enabled: false },
        yAxis: {
          min: 0,
          minRange: 1,
          title: { text: "" },
          labels: {
            enabled: false,
            formatter() {
              return that.dateTiem(this.value);
            },
          },
        },
        xAxis: {
          categories: [],
          labels: {
            useHTML: true,
          },
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
              formatter: function() {
                return that.dateTiem(this.y);
              },
              allowOverlap: true,
              style: {
                color: "#000",
                padding: 0,
              },
            },
            maxPointWidth: 20,
          },
          column: {
            dataLabels: {
              enabled: true,
              formatter: function() {
                return that.dateTiem(this.y);
              },
              allowOverlap: true,
              style: {
                color: "#000",
                padding: 0,
              },
            },
            maxPointWidth: 20,
          },
        },
        tooltip: {
          formatter() {
            return (
              this.x + "<br>" + this.series.name + ": " + that.dateTiem(this.y)
            );
            // return this.x + '<br>' + this.series.name + ': ' + this.y.toLocaleString() + '人次'
          },
        },
        series: [],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom",
                },
              },
            },
          ],
        },
      },
      showLastYearData:true,//是否显示同比数据
      enabledModules:[],//需要显示的模块
      disabled:false
    };
  },
  computed: {
    ...mapState({
      pdfBaseUrl: (state) => state.report.pdfBaseUrl,
      userRole: (state) => state.user.role_name,
      reportType: (state) => state.report.reportHeaderType,
      propertyId: (state) => state.home.headerAction,
      language: (state) => state.language,//en-US
    }),
    bzid() {
      let property = _.filter(
        this.$store.state.home.organizationData.property,
        (o) => {
          return o.property_id === this.propertyId;
        }
      )[0];
      if (property) {
        return property.bzid;
      } else {
        return "";
      }
    },
  },
  watch: {
    "$route.name"() {
      //监听路由 对相应的报告附相应的类型
      let name = this.$route.name;
      switch (name) {
        case "StoreDailyReport":
        case "downloadStoreDayPdf":
        case "DailyReport":
        case "downloadDayPdf":
          this.$store.commit("reportHeaderType", "day");
          break;
        case "WeekReport":
        case "downloadWeekPdf":
          this.$store.commit("reportHeaderType", "week");
          break;
        case "MonthReport":
        case "downloadMonthPdf":
          this.$store.commit("reportHeaderType", "month");
          break;
        case "CustomizeReport":
        case "downloadCustomizePdf":
          this.$store.commit("reportHeaderType", "customize");
          break;
      }
    },
  },
  mounted() {
    // 第一次加载对报告附相应的类型
    let name = this.$route.name;
    switch (name) {
      case "StoreDailyReport":
      case "downloadStoreDayPdf":
      case "DailyReport":
      case "downloadDayPdf":
        this.$store.commit("reportHeaderType", "day");
        break;
      case "WeekReport":
      case "downloadWeekPdf":
        this.$store.commit("reportHeaderType", "week");
        break;
      case "MonthReport":
      case "downloadMonthPdf":
        this.$store.commit("reportHeaderType", "month");
        break;
      case "CustomizeReport":
      case "downloadCustomizePdf":
        this.$store.commit("reportHeaderType", "customize");
        break;
    }
    //  根据类型获取数据
    switch (this.reportType) {
      case "day":
        this.saveHeaderData = this.$store.state.report.dayReportHeader;
        break;
      case "week":
        this.saveHeaderData = this.$store.state.report.weekReportHeader;
        break;
      case "month":
        this.saveHeaderData = this.$store.state.report.monthReportHeader;
        break;
      case "customize":
        this.saveHeaderData = this.$store.state.report.customizeReportHeader;
        break;
    }
  },
  methods: {
    getReportSetting(){
      return new Promise((resolve,reject)=>{
        getReportSetting({property_id:this.propertyId}).then(res=>{
          res = res.data.data;
          this.showLastYearData = res.show_last_year === 1;
          this.enabledModules = res.items && res.items.split(',').map(o=>{return Number(o)})
          if(this.enabledModules.length){
            this.enabledModules.sort((a,b)=>{
              return a<b
            })
          }
          resolve()
        })
      })
    },
    reportOneData(data, data2) {
      this.enterData = [];
      let currentData = data.current[0];
      let contrastData = data.contrast[0];
      let cETime = currentData.enter.highest.timeRange;
      let cOTime = currentData.occupancy.highest.timeRange;
      // 当前时间
      let cEDate = cETime.split(" ")[0] + " " + cETime.split(" ")[2];
      let cOPDate = cOTime.split(" ")[0] + " " + cOTime.split(" ")[2];
      // 昨天时间
      let tETime = contrastData.enter.highest.timeRange;
      let tOTime = contrastData.occupancy.highest.timeRange;
      let tEDate = tETime.split(" ")[0] + " " + tETime.split(" ")[2];
      let tOPDate = tOTime.split(" ")[0] + " " + tOTime.split(" ")[2];

      let textList = []
      Object.values(data.comment).forEach(o=>{
        textList.push(replaceBraces(o,(match,p1)=>{
          return this.$t(p1)||match
        }))
      })
      let type = this.saveHeaderData.type === "daily" ? this.$t('report.hour') : this.$t('report.day');

      this.enterData = [
        {
          // 当前时间数据
          enter: currentData.enter.total.number.toLocaleString() + this.$t('personTime'),
          enterPeak: currentData.enter.highest.number.toLocaleString() + this.$t('personTime'),
          enterTime: this.timeTYpe(cEDate, cETime, "客流量"),
          occupancyPeak:
            currentData.occupancy.highest.number.toLocaleString() + this.$t('personTime'),
          occupancyTime: this.timeTYpe(cOPDate, cOTime, "集客量"),
          average:
            currentData.enter.avg.number.toLocaleString() + this.$t('personTime')+"/" + type,
          valid: currentData.valid.toLocaleString() +this.$t('person'),
        },
        {
          // 昨天时间数据
          enter: contrastData.enter.total.number.toLocaleString() + this.$t('personTime'),
          enterPeak:
            contrastData.enter.highest.number.toLocaleString() + this.$t('personTime'),
          enterTime: this.timeTYpe(tEDate, tETime, "客流量"),
          occupancyPeak:
            contrastData.occupancy.highest.number.toLocaleString() + this.$t('personTime'),
          occupancyTime: this.timeTYpe(tOPDate, tOTime, "集客量"),
          average:
            contrastData.enter.avg.number.toLocaleString() + this.$t('personTime')+"/" + type,
          valid: contrastData.valid.toLocaleString() + this.$t('person')
        },
      ];
      if (data2) {
        let laData = data2.current[0];
        let laEDate =
          laData.enter.highest.timeRange.split(" ")[0] +
          " " +
          laData.enter.highest.timeRange.split(" ")[2];
        let laOPDate =
          laData.occupancy.highest.timeRange.split(" ")[0] +
          " " +
          laData.occupancy.highest.timeRange.split(" ")[2];
        let obj = {
          enter: laData.enter.total.number.toLocaleString() + this.$t('personTime'),
          enterPeak: laData.enter.highest.number.toLocaleString() + this.$t('personTime'),
          enterTime: this.timeTYpe(
            laEDate,
            laData.enter.highest.timeRange,
            "客流量"
          ),
          occupancyPeak:
            laData.occupancy.highest.number.toLocaleString() + "人次",
          occupancyTime: this.timeTYpe(
            laOPDate,
            laData.occupancy.highest.timeRange,
            "集客量"
          ),
          average: laData.enter.avg.number.toLocaleString() + this.$t('personTime')+"/" + type,
          valid: laData.valid.toLocaleString() + this.$t('person'),
        };
        this.enterData.push(obj);
      }
      this.enterData.push(textList);
    },
    timeTYpe(time1, time2, type) {
      if (type === "集客量") {
        return (
          moment(time1).format("YYYY-MM-DD HH") + ":00-" + time2.split(" ")[2]
        );
      } else if (this.saveHeaderData.type === "daily") {
        return (
          moment(time1).format("YYYY-MM-DD HH") + ":00-" + time2.split(" ")[2]
        );
      } else {
        return moment(time1).format("YYYY-MM-DD ");
      }
    },
    suggestSubmit(text) {
      this.suggestText = text;
    },
    async downloadReport(type, time) {
      if(this.disabled)return
      if (time === "") {
        this.$alert({ content:this.$t('fn.select',[this.$t('time')]) });
        return false;
      }
      await this.getReportSetting()
      if(!this.enabledModules.length){
        this.$alert({ content: this.$t('report.noConfig') });
        return false;
      }
      this.disabled = true
      let pdfUrl = window.location.href.split("/#/")[0];
      let token = getToken();
      let objName =
        pdfUrl.split("://")[1].split(".")[0] + "_" + this.propertyId;
      // let objName ='test'
      let ht = pdfUrl.split("://")[0];
      let download;
      let name;
      switch (type) {
        case "storeDay":
          download = "downloadStoreDayPdf";
          name = this.$t("StoreDailyReport");
          break;
        case "day":
          download = "downloadDayPdf";
          name = this.$t("DailyReport");
          break;
        case "week":
          download = "downloadWeekPdf";
          name = this.$t("WeekReport");
          break;
        case "month":
          download = "downloadMonthPdf";
          name = this.$t("MonthReport");
          break;
        case "customize":
          download = "downloadCustomizePdf";
          name = this.$t("CustomizeReport");
          break;
      }
      let url = `${pdfUrl}/#/${download}?propertyId=${
        this.propertyId
      }&date=${time}&token=${token}&pdfUrl=${this.pdfBaseUrl}&enabledModules=${this.enabledModules.toString()}&showYear=${this.showLastYearData}&language=${this.language}`;
      this.$vs.loading();
      const datelist = time.split(",");
      const filename = datelist[0] === datelist[1] ? datelist[0] : time;
      if (!this.pdfBaseUrl) {
        this.$message.warning(this.$t("error.pdfError"));
        return;
      }
      axios
        .post(
          this.pdfBaseUrl + "/pdf/execute",
          {
            filename: time,
            project: objName,
            url: url,
          },
          { responseType: "blob" }
        )
        .then((response) => {
          this.$vs.loading.close();
          this.disabled = false
          var blob = new Blob([response.data]);
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = filename + name + ".pdf"; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch((error)=> {
          this.$alert({ content: "服务器错误！" });
          this.$vs.loading.close();
          this.disabled = false
        });
    },
    // 计算同环比
    sequential(number1, number2) {
      let chain =
        number2 === 0
          ? 0
          : Math.round(((number1 - number2) / number2) * 10000) / 10000;
      return Number((chain * 100).toFixed(2));
    },
    // 获取当时是星期几
    weekType(value) {
      let seWeek = moment(value).format("dddd");
      let week;
      switch (seWeek) {
        case "Monday":
          week = this.$t("Mon");
          break;
        case "Tuesday":
          week =this.$t("Tue");
          break;
        case "Wednesday":
          week = this.$t("Wed");
          break;
        case "Thursday":
          week = this.$t("Thr");
          break;
        case "Friday":
          week = this.$t("Fri");
          break;
        case "Saturday":
          week = this.$t("Sat");
          break;
        case "Sunday":
          week = this.$t("Sun");
          break;
      }
      return week;
    },
    dataEmpty(type) {
      this[type].seriesData[0].data = [];
      if (this[type].seriesData[1]) this[type].seriesData[1].data = [];
      if (this[type].seriesData[2]) this[type].seriesData[2].data = [];
      this[type].xAxisData = [];
    },
    // 商铺数据
    storeTableData(data, name) {
      this[name] = [];
      data.map((list) => {
        let obj = {
          data: {
            seriesData: [
              {
                name: this.$t('report.todayEnter'),
                color: "#2081d4",
                type: "column",
                data: [],
              },
            ],
            xAxisData: [],
            remarkData: [],
          },
          title: {
            name: "当日" + Object.keys(list) + "TOP10店铺客流分析",
            text:
              this.$t('time')+":" +
              this.saveHeaderData.year +
              "." +
              this.saveHeaderData.time,
          },
        };
        Object.values(list)[0].map((val) => {
          obj.data.seriesData[0].data.push(val.data);
          obj.data.xAxisData.push(val.name);
        });
        this[name].push(obj);
      });
    },
    // 热力图
    heatMapData(data, type) {
      console.log(data)
      this.allHeatMap = [];
      data.map((list) => {
        let obj = {
          data: {
            data: [],
            maxAvg: "",
            workingtime: [],
          },
          remarkData: [],
          title: {
            name: this.$t(('report.'+type)) + Object.keys(list)[0] + this.$t("Analytics"),
            text: "",
          },
        };
        if (type === "thisWeek") {
          obj.title.text =
            `${this.$t('report.enterCyc')}:` + (this.language === 'en-US'?(`Week ${this.saveHeaderData.period},${this.saveHeaderData.year}`):
            (this.saveHeaderData.year +
            "年第" +
            this.saveHeaderData.period +
            "周"));
        } else {
          obj.title.text =
            `${this.$t('report.enterTime')}:` +
            this.saveHeaderData.year +
            "." +
            this.saveHeaderData.time;
        }
        let allData = Object.values(list)[0];
        if (allData && allData.length) {
          allData[0].list.map((value) => {
            let newTiem =
              moment(new Date()).format("YYYY-MM-DD") + " " + value.time;
            obj.data.workingtime.push(moment(newTiem).format("HH:mm"));
          });
          allData.reverse();
          allData.forEach((week, weekIndex) => {
            week.list.forEach((hour, hourIndex) => {
              obj.data.data.push([weekIndex, hourIndex, Math.round(hour.avg)]);
            });
          });
        }
        const singleArr = obj.data.data.map((o) => {
          return o[2];
        });
        obj.data.maxAvg = Math.max(...singleArr);
        this.allHeatMap.push(obj);
      });
    },
    relevanceTableData(data1, data2, name) {
      this[name].relevancy.table = []; // 关联度
      this[name].inversion.table = []; // 转换量
      data1.map((list) => {
        this[name].relevancy.table.push({
          source: list.source,
          target: list.target,
          rate: NP.times(list.rate, 100) + "%",
        });
      });
      data2.map((list) => {
        this[name].inversion.table.push({
          source: list.source,
          target: list.target,
          value: list.value,
        });
      });
    },
    dwellFormatData(data) {
      data = _.take(_.orderBy(data, "avg", "desc"), 10);
      this.dwellChartData.option = _.cloneDeep(this.dwellOption);
      let obj = {
        name: this.$t("avgDwellTime"),
        color: "#2081d4",
        type: "column",
        data: [],
      };
      data.map((list) => {
        obj.data.push(list.avg);
        this.dwellChartData.option.xAxis.categories.push(list.name);
      });
      this.dwellChartData.option.series.push(obj);
    },
    multiChartData(data, type, name) {
      if (type.split("+")[1]) {
        var arrName = type.split("+")[0];
        var arrIndex = type.split("+")[1];
        this[arrName][arrIndex].data = [];
      }
      let colorArr = ["#745AEF", "#EE690B", "#4EDBDA", "#2081D4"];
      data.forEach((list, index) => {
        let listObj = {
          option:
            name === "dwell"
              ? _.cloneDeep(this.dwellOption)
              : _.cloneDeep(this.enterOption),
        };
        listObj.option.xAxis.categories = [];
        listObj.option.series = [
          {
            name: Object.keys(list),
            type: "bar",
            color: index > 4 ? colorArr[index - 4] : colorArr[index],
            data: [],
          },
        ];
        Object.values(list)[0].map((value) => {
          if (!value.data && !value.avg) {
            listObj.option.series[0].data.push(0);
          } else {
            listObj.option.series[0].data.push(
              value.data ? value.data : value.avg
            );
          }
          listObj.option.xAxis.categories.push(value.name);
        });
        if (arrIndex) {
          listObj.span = 6;
          listObj.height = 500;
        } else {
          this.switchHeight(data, listObj);
        }
        arrName
          ? this[arrName][arrIndex].data.push(listObj)
          : this[type].push(listObj);
      });
    },
    dateTiem(value) {
      var secondTime = parseInt(value),
        minuteTime,
        hourTime;
      if (secondTime >= 60) {
        minuteTime = parseInt(secondTime / 60);
        secondTime = parseInt(secondTime % 60);
        if (minuteTime >= 60) {
          hourTime = parseInt(minuteTime / 60);
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      if (secondTime > 0) {
        secondTime =
          secondTime < 10 ? "0" + parseInt(secondTime) : parseInt(secondTime);
      } else {
        secondTime = "00";
      }
      if (minuteTime > 0) {
        minuteTime =
          minuteTime < 10 ? "0" + parseInt(minuteTime) : parseInt(minuteTime);
      } else {
        minuteTime = "00";
      }
      if (hourTime > 0) {
        hourTime =
          hourTime < 10 ? "0" + parseInt(hourTime) : parseInt(hourTime);
      } else {
        hourTime = "00";
      }
      return hourTime + ":" + minuteTime + ":" + secondTime;
    },
    switchHeight(data, listObj) {
      switch (data.length) {
        case 1:
        case 2:
          listObj.span = 24;
          listObj.height = 500;
          break;
        case 3:
        case 4:
          listObj.span = 12;
          listObj.height = 500;
          break;
        case 5:
        case 6:
          listObj.span = 8;
          listObj.height = 500;
          break;
        case 7:
        case 8:
          listObj.span = 6;
          listObj.height = 500;
          break;
      }
    },
    getPage(id){
      let page = 1;
      if(this.enabledModules && this.enabledModules.length){
        const existModule = this.enabledModules.filter(o=>{
          return Number(o) < id
        })
        existModule.forEach(o=>{
          const node = this.pageConfig.find(co=>{
            return co.id===o
          })
          if(node){
            page+=node.count
          }

        })
      }

      return page
    },
    //获取总页数
    getTotalPage(){
      return (this.getPage(_.last(this.enabledModules)+1))-1
    }
  },
};
