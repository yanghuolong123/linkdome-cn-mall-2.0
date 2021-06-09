<template>
    <div class="holidayAnaysis">
        <div class="box-card bg-white header" style="margin-bottom:20px;">
            <vs-select class="selectExample selects" @change="getHolidayData" autocomplete v-model="selectYear">
                <vs-select-item :value="item.value" :text="item.key" :key="index" v-for="(item,index) in years"/>
            </vs-select>
            <vs-select class="selectExample selects" @change="compareTypeChange(compareValue)" autocomplete v-model="selectHoliday">
                <vs-select-item :value="item.id" :text="item.name" :key="index" v-for="(item,index) in holidayOptions"/>
            </vs-select>
            <vs-select class="selectExample selects" @change="compareTypeChange" v-show="selectHoliday!==-1"
                       autocomplete v-model="compareValue">
                <vs-select-item :value="item.value" :text="item.label" v-for="(item) in compareOptions"/>
            </vs-select>
            <vs-button color="primary" class="buttons" v-on:click="handleSearch">查询</vs-button>
            <vs-button color="primary" class="reset-buttons" v-on:click="trendResetData">重置</vs-button>
        </div>
        <HolidayAnalysis
                class="HolidayAnalysis"
                :series="series"
                :options="chartOptions"
                :columns="columns"
                :tableList="tableList"
                :pdfName="pdfName"
                :selectHoliday='selectHoliday'
                :ExcelData='trendExcel'
                :indicator="indicator"
                :indicatorList="indicatorList"
                @indicatorChange="indicatorChange"
        ></HolidayAnalysis>
    </div>
</template>

<script>
    import Moment from 'moment'
    import HolidayAnalysis from '@/components/holiday-analysis/holiday-analysis.vue'
    import {getanalysiseeo} from '@/api/home'
    import {getActiveDays, holidayAnalysis} from '@/api/manager.js'
    import {yearList, gotInnerRange} from '@/libs/util.js'
    import { getDateCompare } from '@/api/operate'
    export default {
        components: {
            HolidayAnalysis
        },
        data() {
            return {
                trendExcel: {
                    type: 1,
                    enter: 'enter',
                    bzid: '',
                    year: ''
                },
                years: [],
                holidays: [], // 节假日数据
                selectYear: new Date().getFullYear(),
                selectEntity: '',
                selectHoliday: -1,
                allHolidayData: [], // 所有的节假日
                columns: ['节日', '客流量'],
                tableList: [],
                series: [],
                chartOptions:{},
                compareOptions: [
                    {
                        value: '',
                        label: '无对比'
                    }, {
                        value: 'onYear',
                        label: '同比'
                    }, {
                        value: 'onWeek',
                        label: '周环比'
                    }, {
                        value: 'onMonth',
                        label: '月环比'
                    }
                ],
                compareValue: '',
                indicator:'enter',//数据指标
                dateParams: {},//日期参数
                indicatorList:[
                    {
                        name:'客流量',
                        value:'enter'
                    }, {
                        name:'销售额',
                        value:'sale'
                    },{
                        name:'成交率',
                        value:'deal'
                    },{
                        name:'客单价',
                        value:'price'
                    },
                ],
                chartOptionsCompare: {
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '30%'
                        }
                    },
                    chart: {
                        height: 505,
                        zoom: {
                            enabled: false
                        },
                        toolbar: {
                            show: false
                        }
                    },
                    colors: ['#7467ED', '#2BD9CF', '#EA5455', '#FF9F43', '#1E1E1E'],
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'straight',
                        width: 2
                    },
                    title: {
                        text: '',
                        align: 'left'
                    },
                    grid: {
                        row: {
                            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                            opacity: 0.5
                        }
                    },
                    noData: {
                        text: '暂无数据',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetX: 0,
                        offsetY: 0,
                        style: {
                            color: undefined,
                            fontSize: '14px',
                            fontFamily: undefined
                        }
                    },
                    xaxis: {
                        categories: []
                    },
                    yaxis: {
                        title: {
                            text: ''
                        },
                        labels: {
                            show: true,
                            formatter: (value) => { return value.toLocaleString() }
                        }
                    },
                    tooltip: {
                        y: {
                            formatter:  (val) =>{
                                if (val === null) return ''
                                else {
                                    return this.indicatorDisplayName+ ' ' + (this.indicator==='deal'?val:val.toLocaleString()) + this.unit
                                }
                            }
                        }
                    },
                    markers: {
                        size: 5,
                        hover: {
                            sizeOffset: 2
                        }
                    }
                },
                chartOptionsSingle:{
                    colors: ['#00A0E9', '#7467ED', '#EA5455', '#FF9F43', '#1E1E1E'],
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '30%'
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        show: false,
                        width: 2,
                        colors: ['transparent']
                    },
                    xaxis: {
                        categories: []
                    },
                    yaxis: {
                        title: {
                            text: ''
                        },
                        labels: {
                            show: true,
                            formatter: (value) => {
                                return value.toLocaleString()
                            }
                        }
                    },
                    noData: {
                        text: '暂无数据',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetX: 0,
                        offsetY: 0,
                        style: {
                            color: undefined,
                            fontSize: '14px',
                            fontFamily: undefined
                        }
                    },
                    fill: {
                        opacity: 1
                    },
                    chart: {
                        toolbar: {
                            show: false
                        }
                    },
                    tooltip: {
                        y: {
                            formatter:  (val) =>{
                                if (val === null) return ''
                                else {
                                    return (this.indicator==='deal'?val:val.toLocaleString()) + this.unit
                                }
                            }
                        }
                    }
                }
            }
        },
        watch: {
            '$store.state.home.headerAction'() {
                this.trendResetData()
                let routerName = this.$router.currentRoute.name
                if (routerName === 'HolidayAnalysis') this.init()
            }
        },
        computed: {
            holidayOptions() {
                this.allHolidayData.unshift({'name': '全部节假日活动', 'id': -1});
                return this.allHolidayData
            },
            //单位
            unit(){
                switch (this.indicator) {
                    case "enter":
                        return '人';
                    case 'sale':
                    case 'price':
                        return '元';
                    case 'deal':
                        return '%'
                }
            },
            //当前选中的数据指标
            indicatorDisplayName(){
                return this.indicatorList.find(o=>{
                    return o.value === this.indicator
                }).name
            },
            pdfName(){
                return this.series.length>1?'节假日活动对比分析/':'节假日活动趋势分析/'
            },
        },
        activated() {
            this.init()
        },
        methods: {
            // 开始加载
            init() {
                this.years = yearList();
                this.selectYear = Moment().year();
                this.getHolidayData();
                const entities = this.$store.state.home.bussinessTree.filter(o => {
                    return o.property_id == this.$store.state.home.headerAction
                });
                if (entities && entities.length) this.selectEntity = entities[0].id;
                this.handleSearch()
            },
            getHolidayData() {
                Promise.all([
                    getActiveDays(this.selectYear, 20),
                    getActiveDays(this.selectYear, 21, this.$store.state.home.headerAction)
                ]).then(res => {
                    this.allHolidayData = [];
                    res.forEach(o => {
                        this.allHolidayData = this.allHolidayData.concat(o.data.data)
                    });
                    this.selectHoliday = -1;
                })
            },
            indicatorChange(data){
                this.indicator = data;
                this.handleSearch()
            },
            compareTypeChange(e) {
                if(this.selectHoliday == -1){
                    this.dateParams = {};
                    return
                }
                const holiday = this.holidayOptions.find(o => {
                    return o.id === this.selectHoliday
                });
                this.dateParams.date1 = {
                    begin: holiday.begin,
                    end: holiday.end
                };
                switch (e) {
                    case 'onYear':
                        this.dateParams.date2 = {
                            begin: Moment(holiday.begin).add(-1, 'y').format('YYYY-MM-DD'),
                            end: Moment(holiday.end).add(-1, 'y').format('YYYY-MM-DD')
                        };
                        break;
                    case 'onMonth':
                        this.dateParams.date2 = {
                            begin: Moment(holiday.begin).add(-1, 'M').format('YYYY-MM-DD'),
                            end: Moment(holiday.end).add(-1, 'M').format('YYYY-MM-DD')
                        };
                        break;
                    case 'onWeek':
                        this.dateParams.date2 = {
                            begin: Moment(holiday.begin).add(-7, 'day').format('YYYY-MM-DD'),
                            end: Moment(holiday.end).add(-7, 'day').format('YYYY-MM-DD')
                        };
                        break;
                    default:
                        delete this.dateParams.date2
                }
            },
            setChartOptions(options,xAxis){
                options.xaxis.categories = xAxis;
                let columnWidth = '40%';
                if (xAxis.length && xAxis.length < 5) {
                    columnWidth = '20%'
                }
                options.plotOptions.bar.columnWidth = columnWidth;
                this.chartOptions = options
            },
            handleSearch() {
                const year = this.selectYear
                const bzid = this.selectEntity
                if (!bzid) {
                    alert('请选择购物中心')
                    return
                }
                try {
                    let find = _.find(this.holidays, ['value', this.selectHoliday])
                    find = find && find.key ? find.key : ''
                    window.TDAPP.onEvent('节假日活动分析页面', '趋势分析查询', {'时间段': year.toString(), '节假日活动选择': find})
                } catch (error) {
                    console.log('节假日活动分析页面-趋势分析查询-埋点error:' + error)
                }
                //查询全部节假日活动
                if (this.selectHoliday === -1) {
                    this.trendExcel.type = 1
                    this.trendExcel.bzid = bzid
                    this.trendExcel.year = year
                    this.trendExcel.innerRange = ''
                    this.trendExcel.range = ''
                    holidayAnalysis(this.indicator, bzid, year)
                        .then(res => {
                            res = res.data.data;
                            let xAxis = [];
                            let series = [];
                            res.forEach(o=>{
                                xAxis.push(o.name);
                                series.push(o[this.indicator]);
                                o[this.indicator] = o[this.indicator] == 0 ? ' ' : o[this.indicator] + this.unit
                            });
                            this.tableList = res;
                            this.setChartOptions(_.cloneDeep(this.chartOptionsSingle),xAxis);
                            this.series =  [{
                                name: this.indicatorDisplayName,
                                data: series
                            }];
                            this.columns = ['节日', this.indicatorDisplayName]
                        })
                } else {
                    const holiday = _.find(this.allHolidayData, {'id': this.selectHoliday})
                    //节假日无对比
                    if(!this.compareValue){
                        const innerRange = gotInnerRange([holiday.begin, holiday.end])
                        const range = holiday.begin + ',' + holiday.end
                        const params = {
                            sale_type: this.indicator,
                            bzid: bzid,
                            innerRange: innerRange,
                            range: range,
                            type:'enter'
                        }
                        this.trendExcel.type = 1
                        this.trendExcel.bzid = bzid
                        this.trendExcel.year = ''
                        this.trendExcel.innerRange = innerRange
                        this.trendExcel.range = range
                        let xAxis = [];
                        let series = [];
                        this.tableList = [];
                        getanalysiseeo(params).then(res => {
                            res = res.data.data;
                            res.forEach(o=>{
                                const date = innerRange === '1h'?o.begin.split(' ')[1]:o.begin.split(' ')[0]
                                xAxis.push(date);
                                series.push(o[this.indicator]);
                                let obj = {}
                                if (innerRange === '1h') {
                                    obj.begin = o.begin.split(' ')[1]
                                } else {
                                    obj.begin = o.begin.split(' ')[0]
                                }
                                obj[this.indicator] = o[this.indicator] == 0 ? ' ' : o[this.indicator] + this.unit
                                this.tableList.push(obj)
                            });
                            this.setChartOptions(_.cloneDeep(this.chartOptionsSingle),xAxis)
                            this.series =  [{
                                name: this.indicatorDisplayName,
                                data: series
                            }];
                            this.columns = ['日期',this.indicatorDisplayName]
                        })
                    }else {
                        const compareType = this.compareOptions.find(o=>{
                            return o.value === this.compareValue
                        }).label
                        //节假日对比
                        this.columns = ['时间',holiday.name,`${holiday.name}(${compareType})`];
                        const params = {
                            type:'enter',
                            bzid,
                            ...this.dateParams,
                            sale_type:this.indicator
                        };
                        this.trendExcel = {
                            type:2,
                            data:params
                        };
                        let xaxis = [];
                        getDateCompare(params).then(res=>{
                            res = res.data.data;
                            res.forEach((o,index)=>{
                                xaxis.push('第' + (index + 1) + '天');
                            });
                            let resData1 = [];
                            let resData2 = [];
                            if (Moment(this.dateParams.date1.begin).isAfter(Moment(new Date()))) {
                                resData1 = res.map( m => { return '' })
                            } else {
                                resData1 = res.map( m => {
                                    if (!m.date1[this.indicator]) return 0
                                    else return m.date1[this.indicator]
                                })
                            };
                            if (Moment(this.dateParams.date2.begin).isAfter(Moment(new Date()))) {
                                resData2 = res.map(m=> { return '' })
                            } else {
                                resData2 = res.map(m=> {
                                    if (!m.date2[this.indicator]) return 0
                                    else return m.date2[this.indicator]
                                })
                            };
                            this.series = [
                                {
                                    name:holiday.name,
                                    smooth:true,
                                    data:resData1
                                },{
                                    name:`${holiday.name}(${compareType})`,
                                    smooth:true,
                                    data:resData2
                                }
                            ];
                            this.setChartOptions(_.cloneDeep(this.chartOptionsCompare),xaxis);
                            this.tableList = []
                            resData1.forEach((m, index)=>{
                                var obj = {}
                                obj.name = xaxis[index] ? xaxis[index] : ' '
                                if (m || m === 0) obj.begin = m + this.unit || ' '
                                else obj.begin = ' '
                                obj.end = (resData2[index] || resData2[index] === 0) ? resData2[index] +this.unit : ' '
                                this.tableList.push(obj)
                            })
                        })
                    }

                }
            },
            // 趋势分析重置
            trendResetData() {
                try {
                    window.TDAPP.onEvent('节假日活动分析页面', '趋势分析重置', {})
                } catch (error) {
                    console.log('节假日活动分析页面-趋势分析重置-埋点error:' + error)
                }
                this.selectHoliday = this.holidays[0].value
                this.selectYear = new Date().getFullYear()
            },
        }
    }
</script>

<style scope lang="less">
    .holidayAnaysis {
        .header {
            display: flex;
            flex-wrap: wrap;
            height: 80px;
            padding: 18px 0 18px 30px;
        }

        .headerCompare {
            height: 140px;
            padding: 18px 0 0 30px;
        }

        .selects {
            margin-right: 20px;
        }

        .buttons {
            width: 84px;
            height: 42px;
            padding: 0.75rem 0 !important;
            border: 1px solid #4096e5;
        }

        .reset-buttons {
            width: 84px;
            height: 42px;
            padding: 0.75rem 0 !important;
            background-color: #fff !important;
            color: #4096e5 !important;
            margin-left: 20px;
            border: 1px solid #4096e5;
        }

        .more {
            width: 300px;
        }

        .chartsTable {
            background-color: #fff;
            margin-top: 20px;
            border-radius: 6px;
            box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
        }

        .flexs {
            display: flex;
            width: 100%;

        }

        .HolidayAnalysis {
            margin-bottom: 40px;
            position: relative;
        }

    }
</style>
