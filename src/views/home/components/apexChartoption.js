import _ from "lodash";
import NP from "number-precision";
import i18n from "@/i18n/i18n";
export default {
  donut: {
    plotOptions: {
      pie: {
        donut: { size: "65%" },
        size: 100,
      },
    },
    colors: ["#857AEF", "#F9A143", "#EA5455", "#FF9F43", "#1E1E1E"],
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#AAA3F4", "#F5C380"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      y: {},
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        let number = (series[seriesIndex] / _.sum(series)) * 100;
        return `<p style=background-color:${
          w.config.colors[seriesIndex]
        } class='p-2'><span class='pr-4'>${
          w.config.labels[seriesIndex]
        }:</span>${_.round(number, 2)}%</p>`;
      },
    },
  },
  radialBar: {
    labels: [],
    plotOptions: {
      radialBar: {
        size: 135,
        hollow: {
          size: "20%",
        },
        track: {
          background: "#ebebeb",
          strokeWidth: "100%",
          margin: 15,
        },
        dataLabels: {
          show: true,
          name: {
            fontSize: "18px",
          },
          value: {
            fontSize: "16px",
            color: "#636a71",
            offsetY: 11,
          },
          total: {
            show: false,
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          plotOptions: {
            radialBar: {
              size: 120,
              hollow: {
                size: "10%",
              },
              track: {
                background: "#ebebeb",
                strokeWidth: "100%",
                margin: 15,
              },
            },
          },
        },
      },
    ],
    colors: ["#E85A5A", "#00A0E9"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#FCAC3F", "#01A1E9"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    chart: {
      dropShadow: {
        enabled: false,
        blur: 3,
        left: 1,
        top: 1,
        opacity: 0.1,
      },
      toolbar: { show: false },
    },
  },
  pie: {
    labels: [],
    colors: ["#eb6162", "#7c64f6", "#26dad0", "#00a2ea", "#fea756"],
    legend: {
      show: false,
    },
    chart: {
      type: "pie",
      dropShadow: {
        enabled: false,
        blur: 5,
        left: 1,
        top: 1,
        opacity: 0.2,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        gradientToColors: [
          "#f08e8f",
          "#9a89f9",
          "#79ece5",
          "#60c2ee",
          "#fec087",
        ],
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {},
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        let sumArr = _.sum(series);
        return `<p style=background-color:${
          w.config.colors[seriesIndex]
        } class='p-2'><span class='pr-4'>${
          w.config.labels[seriesIndex]
        }:</span>${NP.times(
          NP.round(series[seriesIndex] / sumArr, 3),
          100
        )}%</p>`;
      },
    },
  },
  bar: {
    legend: {
      height: 30,
    },
    xaxis: {
      categories: [],
      labels: {
        formatter(value) {
          if (typeof value === "number") {
            return value ? _.round(value, 0).toLocaleString() : "";
          } else {
            return value;
          }
        },
        show: true,
        style: {
          fontFamily: "Roboto,sans-serif",
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        formatter(value) {
          if (typeof value === "number") {
            return value ? _.round(value, 0).toLocaleString() : "";
          } else {
            return value;
          }
        },
        style: {
          fontFamily: "Roboto,sans-serif",
        },
      },
      min: 0,
    },
    chart: {
      toolbar: { show: false },
      fontFamily: "source_han_sans_cn",
      zoom: {
        enabled: false,
      },
    },
    noData: {
      text: i18n.t("暂无数据"),
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: "14px",
        fontFamily: undefined,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
        radius: 0,
        distributed: false,
      },
    },
    colors: ["#ee7552", "#00A0E9", "#94e2ff", "#fbab40", "#e8585a", "#8d82f0"],
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {},
      style: {
        maxWidth: "100px",
        whiteSpace: "pre-wrap",
      },
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          plotOptions: {
            bar: {
              horizontal: false,
            },
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  },
  line: {
    legend: {
      height: 30,
    },
    xaxis: {
      categories: [],
      labels: {
        show: true,
        style: {
          fontFamily: "Roboto,sans-serif",
        },
      },
    },
    yaxis: {
      labels: {
        formatter(value) {
          if (typeof value === "number") {
            return value ? _.round(value, 0).toLocaleString() : "";
          } else {
            return value;
          }
        },
        style: {
          fontFamily: "Roboto,sans-serif",
        },
      },
      min: 0,
    },

    chart: {
      toolbar: { show: false },
      fontFamily: "source_han_sans_cn",
      zoom: {
        enabled: false,
      },
    },
    noData: {
      text: i18n.t("暂无数据"),
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: "14px",
        fontFamily: undefined,
      },
    },
    tooltip: {
      y: {},
    },
    stroke: {
      curve: "straight",
      width: 2,
    },
    colors: [
      "#00A0E9",
      "rgb(231, 88, 91)",
      "#94e2ff",
      "#fbab40",
      "#e8585a",
      "#8d82f0",
    ],
    dataLabels: {
      enabled: false,
    },
  },
  radar: {
    labels: [],
    dataLabels: {
      style: {
        fontSize: "14px",
        fontWeight: "500",
        fontFamily: "Roboto",
        colors: [
          "#2b2c2c",
          "#2b2c2c",
          "#2b2c2c",
          "#2b2c2c",
          "#2b2c2c",
          "#2b2c2c",
        ],
      },
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
    legend: { show: true },
    chart: {
      dropShadow: {
        enabled: false,
        blur: 8,
        left: 1,
        top: 1,
        opacity: 0.8,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: 0,
    },
    colors: ["#00A0E9", "#E7585B"],
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: [
            "#e8e8e8",
            "transparent",
            "transparent",
            "transparent",
            "transparent",
            "transparent",
          ],
          connectorColors: "transparent",
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#52BEF0", "#FEB33D", "#52BEF0", "#FEB33D"],
        shadeIntensity: 1,
        type: "horizontal",
        opacityFrom: 0.6,
        opacityTo: 0.9,
        stops: [0, 100, 100, 100],
      },
    },
    markers: {
      size: 0,
    },
  },
  salesPie: {
    labels: [],
    colors: ["#eb6162", "#7c64f6", "#26dad0", "#00a2ea", "#fea756"],
    legend: {
      show: false,
    },
    chart: {
      type: "pie",
      dropShadow: {
        enabled: false,
        blur: 5,
        left: 1,
        top: 1,
        opacity: 0.2,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        gradientToColors: [
          "#f08e8f",
          "#9a89f9",
          "#79ece5",
          "#60c2ee",
          "#fec087",
        ],
      },
    },
    dataLabels: {
      enabled: false,
    },
    noData: {
      text: i18n.t("暂无数据"),
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: "14px",
        fontFamily: undefined,
      },
    },
    tooltip: {
      y: {},
      show: false,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        return `<p style=background-color:${
          w.config.colors[seriesIndex]
        } class='p-2'><span class='pr-4'>${
          w.config.labels[seriesIndex]
        }:</span>${series[seriesIndex]}元</p>`;
      },
    },
  },
  invalidRadialbar: {
    chart: {
      type: "radialBar",
      offsetY: 20,
      offsetX: -30,
    },
    grid: {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    colors: ["#FEB019"],
    plotOptions: {
      radialBar: {
        columnWidth: "1%",
        hollow: {
          size: "60%",
          margin: 0,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: 5,
          },
        },
      },
    },
    stroke: {
      curve: "straight",
      width: 1,
      lineCap: "round",
    },
  },
};
