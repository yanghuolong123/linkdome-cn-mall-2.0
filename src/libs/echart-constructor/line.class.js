import { config } from "@/config/echarts-config/line-chart";
import { BasicData } from "@/libs/echart-constructor/basicData.class.js";
import i18n from "@/i18n/i18n";
export class LineChartConstructor extends BasicData {
  constructor(responseData = [], Params, quta = [], weathers = []) {
    super(responseData, Params, quta);
    this.params = Params

    this.weathers = weathers;
    this.config = _.cloneDeep(config);
    this.config.tooltip.formatter = (params, val, v) => {
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

      let weather = "";

      let w = weathers[params[0].dataIndex];
      if (w && w.id) {
        if (w.type === 1)
          weather = `  温度${w.temperature}℃  ${
            w.condition
          }  <img style="width:20px;height:20px;vertical-align: middle;" src="${
            w.weather_icon
          }"></img>`;
        else
          weather = `  温度${w.low_temperature}℃ - ${w.high_temperature}℃  ${
            w.condition
          }  <img style="width:20px;height:20px;vertical-align: middle;" src="${
            w.weather_icon
          }"></img>`;
      }
      return title + result + weather;
    };
    this.seriesConfig = {
      type: "line",
      symbol: "circle",
      symbolSize: 8,
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
      Object.assign(o, this.seriesConfig);
    });
    this.config.legend.data = this.legend;
    this.config.series = this.series;
    this.config.xAxis.data = this.category;
    //x轴显示天气图标
    if(this.weathers.length && ['not','entity','businessType'].includes(this.params.params.compareType)){
      this.config.xAxis.axisLabel = {
        show: true,
        formatter:(value,i)=>{
          let weather;
          if(this.weathers[i].type === 1){
            weather = this.weathers[i].temperature + '℃'
          }else {
            weather = `${this.weathers[i].low_temperature}℃ - ${this.weathers[i].high_temperature}℃`
          }
          return value + '\n'+'{style' + i + '| }\n'+ weather;
        },
        rich:{}
      }
      this.category.forEach((o,i)=>{
        this.config.xAxis.axisLabel.rich[`style${i}`] = {
          width:30,
          height:30,
          backgroundColor:{
            image:this.weathers[i].weather_icon
          }
        }
      })
    }

    const length = this.category.length;
    if (length > 20) {
      this.config.dataZoom = [
        {
          type: "slider",
          showDetail: false, //滚动条两边的字
          zoomLock: false,
          show: true, //flase直接隐藏图形
          xAxisIndex: [0],
          left: "4%", //滚动条靠左侧的百分比
          height:24,
          bottom: 60,
          start: 0, //滚动条的起始位置
          end: 100,
          // end: parseInt((20 / length) * 100)//滚动条的截止位置（按比例分割你的柱状图x轴长度）
        },
      ];
    } else {
      delete this.config.dataZoom;
    }
    return this.config;
  }
}
