import { config } from "@/config/echarts-config/line-chart";
import { BasicData } from "@/libs/echart-constructor/basicData.class.js";
import i18n from "@/i18n/i18n";
export class LineChartConstructor extends BasicData {
  constructor(responseData = [], Params, quta = [], weathers1 = [],weathers2 = []) {
    super(responseData, Params, quta);
    this.params = Params
    this.weathers1 = weathers1;
    this.weathers2 = weathers2;
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
      return title + result ;
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
    if(this.weathers1.length && this.params.params.compareType!=='time'){
      this.config.xAxis.axisLabel = {
        show: true,
        formatter:(value,i)=>{
          let weather1;
          if(this.weathers1[i].type === 1){
            weather1 = this.weathers1[i].temperature + '℃'
          }else {
            weather1 = `${this.weathers1[i].low_temperature}℃ - ${this.weathers1[i].high_temperature}℃`
          }
          if(this.weathers2.length){
            let weather2;
            if(this.weathers2[i].type === 1){
              weather2 = this.weathers2[i].temperature + '℃'
            }else {
              weather2 = `${this.weathers2[i].low_temperature}℃ - ${this.weathers2[i].high_temperature}℃`
            }
            return `${value}\n{${i===0?'dateShow':'dateHide'}|${this.params.params.date1Array.toString()}}\n{style${i}|}\n${weather1}\n{${i===0?'dateShow':'dateHide'}|${this.params.params.date2Array.toString()}}\n{style2${i}|}\n${weather2}`


          }else {
            return value + '\n'+'{style' + i + '| }\n'+ weather1;
          }

        },
        rich:{}
      }
      this.category.forEach((o,i)=>{
        this.config.xAxis.axisLabel.rich[`style${i}`] = {
          width:30,
          height:30,
          backgroundColor:{
            image:this.weathers1[i].weather_icon
          }
        }
        if(this.weathers2.length){
          this.config.xAxis.axisLabel.rich[`style2${i}`] = {
            width:30,
            height:30,
            backgroundColor:{
              image:this.weathers2[i].weather_icon
            }
          }
        }
      })
      if(this.weathers2.length){
        this.config.grid.bottom = 80
        this.config.xAxis.axisLabel.rich.dateShow = {
          lineHeight:20,
          height:20,
          color:'#909399'
        }
        this.config.xAxis.axisLabel.rich.dateHide = {
          lineHeight:20,
          height:20,
          color:'transparent'
        }
      }

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
          bottom: this.weathers2.length?150:60,
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
