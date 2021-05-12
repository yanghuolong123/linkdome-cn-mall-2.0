export default {
  donut: {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    dataLabels: {
      enabled: false
    },
    legend: { show: false },
    chart: {
      type: 'donut',
      toolbar: {
        show: false
      }
    },
    stroke: { width: 0 },
    colors: ['#7961F9', '#FF9F43', '#EA5455'],
    fill: {
      type: 'gradient',
      gradient: {
        gradientToColors: ['#9c8cfc', '#FFC085', '#f29292']
      }
    }
  },
  radialBar: {

    labels: ['Finished', 'Pending', 'Rejected'],
    plotOptions: {
      radialBar: {
        size: 165,
        hollow: {
          size: '20%'
        },
        track: {
          background: '#ebebeb',
          strokeWidth: '100%',
          margin: 15
        },
        dataLabels: {
          show: true,
          name: {
            fontSize: '18px'
          },
          value: {
            fontSize: '16px',
            color: '#636a71',
            offsetY: 11
          },
          total: {
            show: true,
            label: 'Total',
            formatter: function () {
              return 10
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 576,
      options: {
        plotOptions: {
          radialBar: {
            size: 150,
            hollow: {
              size: '20%'
            },
            track: {
              background: '#ebebeb',
              strokeWidth: '100%',
              margin: 15
            }
          }
        }
      }
    }],
    colors: ['#7961F9', '#FF9F43', '#f29292'],
    fill: {
      type: 'gradient',
      gradient: {
        // enabled: true,
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#9c8cfc', '#FFC085', '#EA5455'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]

      },
      stroke: {
        lineCap: 'round'
      },
      chart: {
        dropShadow: {
          enabled: true,
          blur: 3,
          left: 1,
          top: 1,
          opacity: 0.1
        }
      }
    }
  },
  pie: {
    labels: ['New', 'Returning', 'Referrals'],
    dataLabels: {
      enabled: false
    },
    legend: { show: false },
    chart: {
      type: 'pie',
      dropShadow: {
        enabled: false,
        blur: 5,
        left: 1,
        top: 1,
        opacity: 0.2
      },
      toolbar: {
        show: false
      }
    },
    stroke: {
      width: 5
    },
    colors: ['#7961F9', '#FF9F43', '#EA5455'],
    fill: {
      type: 'gradient',
      gradient: {
        gradientToColors: ['#9c8cfc', '#FFC085', '#f29292']
      }
    }

  },
  bar: {
    chartOptions: {
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0
        }
      },
      chart: {
        type: 'bar',
        sparkline: { enabled: true },
        toolbar: { show: false }
      },
      states: {
        hover: {
          filter: 'none'
        }
      },
      colors: ['#e6edf7', '#e6edf7', '#7367f0', '#e6edf7', '#e6edf7', '#e6edf7'],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
          endingShape: 'rounded',
          barHeight: '10%',
          radius: 0
        }
      },
      tooltip: {
        x: { show: false }
      }
    }
  },
  line: {
    chart: {
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 20,
        left: 2,
        blur: 6,
        opacity: 0.20
      }
    },
    stroke: {
      curve: 'smooth',
      width: 4
    },
    grid: {
      borderColor: '#ebebeb'
    },
    colors: ['#e6edf7', '#e6edf7'],
    // fill: {
    //   type: 'gradient'
    //   // gradient: {
    //   //   shade: 'dark',
    //   //   inverseColors: false,
    //   //   gradientToColors: ['#7367F0'],
    //   //   shadeIntensity: 1,
    //   //   type: 'horizontal',
    //   //   opacityFrom: 1,
    //   //   opacityTo: 1,
    //   //   stops: [0, 100, 100, 100]
    //   // }
    // },
    markers: {
      size: 0,
      hover: {
        size: 5
      }
    },
    xaxis: {
      labels: {
        style: {
          cssClass: 'text-grey fill-current'
        }
      },
      axisTicks: {
        show: false
      },
      categories: [],
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        style: {
          cssClass: 'text-grey fill-current'
        },
        formatter: function (val) {
          return val > 999 ? (val / 1000).toFixed(1) + 'k' : val
        }
      }
    },
    tooltip: {
      x: { show: false }
    }

  },
  stacked: {

    grid: {
      borderColor: '#ebebeb',
      padding: {
        left: 0,
        right: 0
      }
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    chart: {
      stacked: true,
      type: 'bar',
      toolbar: { show: false }
    },
    colors: ['#7367F0', '#EA5455'],
    plotOptions: {
      bar: {
        columnWidth: '10%'
      }
    },
    xaxis: {
      labels: {
        style: {
          cssClass: 'text-grey fill-current'
        }
      },
      axisTicks: {
        show: false
      },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        style: {
          cssClass: 'text-grey fill-current'
        }
      }
    },
    tooltip: {
      x: { show: false }
    }
  }

}
