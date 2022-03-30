import { config } from "@/config/echarts-config/bar-chart";
import { BasicData } from "@/libs/echart-constructor/basicData.class.js";
import i18n from "@/i18n/i18n";
export class BarChartConstructor extends BasicData {
  constructor(responseData = [], Params, quta = [], weathers = []) {
    super(responseData, Params, quta);
    this.config = _.cloneDeep(config);
    this.config.tooltip.formatter = (params) => {
      const title = params[0].axisValueLabel + "<br>";
      let result = "";
      params.forEach((o) => {
        result +=
          o.marker +
          o.seriesName +
          "：" +
          o.value.toLocaleString() +
          i18n.t("人次") +
          "<br>";
      });
      let w = weathers[params[0].dataIndex];
      let weather = "";
      if (w && w.id) {
        if (w.type === 1)
          weather = `  温度${
            w.temperature
          }℃   <img style="width:20px;height:20px;vertical-align: middle;" src="${
            w.weather_icon
          }"></img>`;
        else
          weather = `  最低温度${w.low_temperature}℃ 最高温度${
            w.high_temperature
          }℃   <img style="width:20px;height:20px;vertical-align: middle;" src="${
            w.weather_icon
          }"></img>`;
      }
      return title + result + weather;
    };
    this.seriesConfig = {
      type: "bar",
      barGap: "0%",
      itemStyle: {
        normal: {
          //柱形图圆角
          barBorderRadius: [80, 80, 0, 0],
        },
      },
    };
  }

  getDateCompare() {
    this.dateCompare();
    return this.getConfig();
  }

  getPostEntitysCompare() {
    this.postEntitysCompare();
    return this.getConfig();
  }

  getConfig() {
    this.series.forEach((o) => {
      Object.assign(o, this.seriesConfig, {
        barWidth: this.legend.length * this.category.length > 9 ? "" : "100",
      });
    });
    this.config.legend.data = this.legend;
    this.config.series = this.series;
    this.config.xAxis.data = this.category;
    const length = this.category.length;
    if (length > 20) {
      this.config.dataZoom = [
        {
          type: "slider",
          zoomLock: false,
          show: true, //flase直接隐藏图形
          xAxisIndex: [0],
          left: "4%", //滚动条靠左侧的百分比
          bottom: 30,
          start: 0, //滚动条的起始位置
          end: 100,
          // end:parseInt((20/length)*100 ) //滚动条的截止位置（按比例分割你的柱状图x轴长度）
        },
      ];
    } else {
      delete this.config.dataZoom;
    }
    return this.config;
  }
}
