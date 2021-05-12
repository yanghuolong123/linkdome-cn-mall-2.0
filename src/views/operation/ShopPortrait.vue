<template>
    <div class="shop-portrait">
        <div class="selector-container common-card">
            <div class="flex-center">
                <Select v-model="tableParams.property_id"  class="w-select" >
                    <Option v-for="(item,index) in propertyList"
                        :value="item.property_id"
                        :key="index">{{ item.name }}</Option>
                </Select>
                <Select v-model="businessType"  class="w-select m-l-20" >
                    <Option v-for="(item,index) in businessTypeOptions"
                        :value="item.value"
                        :key="index">{{ item.text }}</Option>
                </Select>
                <Button size="large" type="primary" class="m-l-20"  @click="getTableList" >查询</Button>
                <Button size="large" class="m-l-20 goal-reset"  @click="handleCompare" >查看详情</Button>
            </div>
        </div>
        <div class="box-card bg-white detail" v-show="compareChartShow">
            <p>运营指数{{chartTitle}}</p>
            <div class="flex-box">
                <vue-scroll :ops="config.vueScrollOps" style="width: 25%;">
                    <div class="left">
                        <div class="card" v-for="(item,index) in shopIndexList" :key="index">
                            <span>{{index+1}}. <span class="color" :style="{backgroundColor:colorList[index]}"></span> {{item.shop_name}} </span>
                            <span>运营指数: {{item.index}}</span>
                            <span>全场排名: {{item.overall_ranking}}</span>
                            <span>同业态排名: {{item.format_rank}}</span>
                            <span>同楼层排名: {{item.floor_rank}}</span>
                            <span>健康度: {{item.health}}</span>
                        </div>
                    </div>
                </vue-scroll>
                <vue-apex-charts
                        type="radar"
                        height="600"
                        class="right"
                        :options="chartOptions"
                        :series="series"
                />
            </div>
    
        </div>
        <div class="selected-table">
            <vx-card title="店铺指数列表">
                <vs-table stripe v-model="tableSelected" max-items="5" pagination  noDataText="暂无数据" multiple :data="tableList">
                    <template slot="thead" >
                        <vs-th :key="indexs" class="table-title" v-for="(item, indexs) in tableName">{{item}}</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :data="tr" :disabled="false" :key="indextr" v-for="(tr, indextr) in data">
                            <!--店铺名称-->
                            <vs-td :data="data[indextr].shop_name">
                                {{data[indextr].shop_name}}
                            </vs-td>
                            <!--查看指数-->
                            <vs-td :data="data[indextr].index">
                                <span style="color: #00A0E9">{{data[indextr].index}}</span>
                            </vs-td>
                            <!--楼层-->
                            <vs-td :data="data[indextr].floor">
                                {{data[indextr].floor}}
                            </vs-td>
                            <!--营业面积-->
                            <vs-td :data="data[indextr].area">
                                {{data[indextr].area}}m²
                            </vs-td>
                            <!--所属分类-->
                            <vs-td :data="data[indextr].sort">
                                {{data[indextr].sort}}
                            </vs-td>
                            <!--租金坪效-->
                            <vs-td :data="data[indextr].rent">
                                {{data[indextr].rent}}元/m²
                            </vs-td>
                            <!--销售坪效-->
                            <vs-td :data="data[indextr].sale_ratio">
                                {{data[indextr].sale_ratio}}元/m²
                            </vs-td>
                            <!--租售比-->
                            <vs-td :data="data[indextr].rent_sale_per">
                                {{data[indextr].rent_sale_per?data[indextr].rent_sale_per.toFixed(2):data[indextr].rent_sale_per}}
                            </vs-td>
                            <!--客流量-->
                            <vs-td :data="data[indextr].enter">
                                {{data[indextr].enter && data[indextr].enter.toLocaleString()}}人次
                            </vs-td>
                            <!--租约开始-->
                            <vs-td :data="data[indextr].lease_start">
                                {{data[indextr].lease_start}}
                            </vs-td>
                            <!--租约结束-->
                            <vs-td :data="data[indextr].lease_end">
                                {{data[indextr].lease_end}}
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vx-card>
        </div>
    
    </div>
</template>
<script>
    import {getShopPortrait, getOperateIndex, getIndexMap} from '@/api/operate'
    import config from '@/config/index';
    import VueApexCharts from 'vue-apexcharts'
    import { activitiesList } from '@/api/analysis'
    const colorList = ['#00A0E9','#6F62FE','#2BD9CF','#FDB33D','#E75759','#837f7f']
    let option = {
        tooltip: {
            formatter:(params)=>{
                return params.name+'<br>'+'租金坪效评分:'+params.value[0]+'<br>'+'销售额评分:'+params.value[1]+'<br>'+'销售坪效评分:'+params.value[2]+'<br>'+'消费笔数评分:'+params.value[3]+'<br>'+'客流量评分:'+params.value[4]
            }
        },
        color:colorList,
        radar: {
            name: {
                textStyle: {
                    color: '#fff',
                    backgroundColor: '#009FE9',
                    borderRadius: 100,
                    padding: [8, 10]
                }
            },
            indicator: [
                {name: '租金坪效',max:100},
                {name: '销售额',max:100},
                {name: '销售坪效',max:100},
                {name: '消费笔数',max:100},
                {name: '客流量',max:100},
            ],

        },
        series: [{
            name: '',
            type: 'radar',
            data: []
        }]
    };
    export default {
        name: 'ShopPortrait',
        computed:{
          propertyList(){
              const property = this.$store.state.home.organizationData.property;
              if(property && property.length){
                  this.tableParams.property_id = property[0].property_id
                  return property
              }else {
                  return  []
              }
          }
        },
        components: {
            VueApexCharts
        },
        data() {
            return {
                colorList,
                config,
                tableName:['店铺名称','查看指数','楼层','营业面积','所属分类','租金坪效','销售坪效','租售比','客流量','租约开始','租约结束'],
                tableSelected: [],
                tableList: [],
                tableParams: {
                    property_id: '',
                    page_index: 9999999999999,
                    page: 1
                },
                shopIndexList: [],
                compareChartShow:false,
                chartTitle:'详情',
                series: [{
                    name: '',
                    data: [0,0,0,0,0],
                }],
                chartOptions:{
                    chart: {
                        height: 600,
                        type: 'radar',
                        toolbar: { show: false }
                    },
                    colors:colorList,
                    legend: {
                        show: false
                    },
                    plotOptions: {
                        radar: {
                            polygons: {
                                strokeColors: '#e9e9e9',
                                fill: {
                                    colors: ['#f8f8f8', '#fff']
                                }
                            }
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: function(val) {
                                return val
                            }
                        }
                    },
                    yaxis: {
                        tickAmount:5,
                        max:100,
                        labels: {
                            formatter: function(val, i) {
                                return Math.round(val)
                            }
                        }
                    },
                    xaxis: {
                        categories: ['销售额', '销售坪效','停留时间', '成交率', '客流量'],
                    }
                },
                businessType: 0,
                businessTypeOptions:[],
            }
        },
        methods: {
            // 获取业态
            getBusinessType () {
                this.businessTypeOptions = [{
                    text: '所有业态',
                    value: 0
                }]
                activitiesList({ entity: 52, property_id: this.$store.state.home.headerAction }).then(res => {
                    _.forIn(res.data.data, (val, key)=> {
                        this.businessTypeOptions.push({
                            text:val,
                            value:key
                        })
                    })
                })
            },
            handleCompare(){
                if (!this.tableSelected.length) {
                    this.$alert({
                        content:'请选择要查看的店铺'
                    })
                    return
                }
                if(this.tableSelected.length > 6){
                    this.$alert({
                        content:'最多选择6个店铺'
                    })
                    return
                }
                const params = {
                    property_id: this.tableParams.property_id,
                    bz_id: this.tableSelected.map(o => {
                        return o.bz_id
                    }).toString()
                };
                this.getDetailData(params)
            },
            getDetailData(params) {
                this.chartTitle = this.tableSelected.length>1? '对比':'详情'
                Promise.all([this.getOperateIndex(params), this.getIndexMap(params)]).then(res => {
                    this.shopIndexList = res[0]||[];
                    this.series = [];
                    Array.isArray(res[1]) && res[1].forEach(o=>{
                        const obj = {
                            name:o.shop_name+'指数',
                            data:[o.sale?o.sale.toFixed(2):o.sale,o.sales_ratio?o.sales_ratio.toFixed(2):o.sales_ratio,o.dwellTime?o.dwellTime.toFixed(2):o.dwellTime,o.closeRate?o.closeRate.toFixed(2):o.closeRate,o.enter?o.enter.toFixed(2):o.enter]
                        };
                        this.series.push(obj)
                    });
                    this.compareChartShow = true;
                }).catch(err => {
                    console.log(err);
                })
            },
            getOperateIndex(params) {
                return new Promise((resolve, reject) => {
                    getOperateIndex(params).then(res => {
                        resolve(res.data.data)
                    }).catch(() => {
                        reject('店铺指数获取失败')
                    })
                })
            },
            getIndexMap(params) {
                return new Promise((resolve, reject) => {
                    getIndexMap(params).then(res => {
                        resolve(res.data.data)
                    }).catch(() => {
                        reject('店铺画像获取失败')
                    })
                })
            },
            getTableList() {
                this.tableSelected = [];
                this.compareChartShow = false;
                let params = _.cloneDeep(this.tableParams)
                if(this.businessType != 0){
                    params.business_type_id = this.businessType
                }
                getShopPortrait(params).then(res => {
                    res = res.data.data
                    this.tableList = res.data || [];
                }).catch(err => {
                    this.tableList = [];
                })
            }
        },
        created () {
            this.getTableList();
            this.getBusinessType()
        }
    }
</script>
<style lang="less" scoped>


    .shop-portrait /deep/ .con-vs-pagination{
        margin: 0 auto;
    }
    .shop-portrait {
        .box-card {
            display: flex;
            padding: 18px 30px;
            .m-r-10{
                margin-right: 10px;
            }
       
        }
        .flex-center{
            .goal-reset {
                background: #fff !important;
                color: #37b5ed;
                border: 1px solid #37b5ed;
                margin-left: 20px;
            }
        }
        .selected-table {
            position: relative;
            background-color: #fff;
            border-radius: 6px;
            margin: 20px 0;

            .tables {
                box-shadow: none;
                background: none
            }
        }

        .detail {
            display: flex;
            flex-direction: column;
            margin-top: 20px;
            .flex-box {
                display: flex;
                align-items: start;
                margin-top: 30px;
               
                .left {
                    height: 600px;
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: 10px;
                    align-items: start;
                    align-content:flex-start;
                    .card {
                        width: 40%;
                        max-width: 180px;
                        display: flex;
                        flex-direction: column;
                        border-radius: 6px;
                        box-shadow: 0px 0px 6px 0px rgba(120, 119, 117, 0.3);
                        padding: 15px 10px;
                        margin: 0 0 10px 10px;
                        .color {
                            width: 10px;
                            height: 10px;
                            background-color: red;
                            border-radius: 2px;
                            margin: 0 5px;
                        }

                        span + span {
                            margin-top: 5px;
                        }

                        span:nth-child(1) {
                            display: flex;
                            align-items: center;
                        }

                        span:nth-child(2) {
                            font-size: 18px;
                            color: #3E3C3C;
                            font-weight: bolder;
                        }
                    }
                }

                .right {
                    flex: 1;
                    height: 600px;
                }
            }

            p {
                font-size: 16px;
            }
        }
    }

    .table-page {
        margin-top: 30px;
    }

    .table-title {
        background-color: #f8f8f8;
    }
    .el-table_1_column_1>.cell{
        padding-left: 16px!important;
    }
</style>
