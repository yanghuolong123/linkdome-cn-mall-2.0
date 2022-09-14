<template>
	<div class="heatMaps">
	
		<div class="path-picker">
		
			<DatePicker
				type="daterange"
				v-model="dayTime"
				placement="bottom-end"
				@on-change="
          () => {
            hourTime = '-1';
          }
        "
				:placeholder="$t('holder.选择日期')"
				:options="disabledDate"
				format="yyyy-MM-dd"
				style="width:230px"
			></DatePicker>
			<Select v-model="hourTime" :disabled="!isSingleDay" class="selectExample">
				<Option
					v-for="item in hourList"
					:value="item.value"
					:key="$t(item.label)"
				>{{ $t(item.label) }}</Option
				>
			</Select>
			<Select v-model="floor" class="selectExample selectFloor">
				<Option v-for="item in floorList" :value="item.value" :key="item.label"
				>{{ item.label }}
				</Option>
			</Select>
			<Button
				size="large"
				class="m-l-20"
				type="primary"
				@click="
          searchData();
          initHeatMapGrid();
        "
			>{{ $t("查询") }}</Button
			>
			<Button size="large" @click="reset" class="m-l-20">{{
				$t("重置")
				}}</Button>
		</div>
		<div class="content">
			<div>
				<div class="heatMap" ref="heatMap">
					<div class="colorNumber">
						<img :src="colorBar" alt="" />
						<p>
							<span>{{ maxValue }}</span>
						</p>
					</div>
					<!--热力分布图-->
					<heatmapjs-vue
						id="heat-grid"
						:max="maxValue"
						:min="minValue"
						:options="mapOptions"
						:data="heatMapDataList"
					></heatmapjs-vue>
					<img @load="imgLoad" :src="map.url" v-if="map.url" id="mapImg" />
					<div class="noData" v-else>{{ $t("holder.暂无数据") }}</div>
				</div>
				<div class="time-frame" v-if="hourTime === '0'">
					<Slider
						v-model="timeFrame"
						:min="minTime"
						:max="maxTime"
						@on-input="changeInput"
						:marks="timeMarks"
						show-stops
					></Slider>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
  import selectMixin from "@/mixin/selectMixin.js";
  import moment from "moment";
  import _ from "lodash";
  import ChartOption from "@/views/ui-elements/card/analyticsData";
  import {
    getTimePassengerFlowDistribution,
    getHeatMapDistribution,
    getHeatMapFloorData,
  } from "@/api/analysis.js";
  import {heatmapShow} from '../../api/manager'
  import { disabledDate, formatEntityData, deepFind } from "@/libs/util.js";
  import relevanceTab from "./components/components/RelevanceTab";
  let flowDistributionCharts = null;
  const yesterday = moment(new Date())
    .add(-1, "days")
    .format("YYYY-MM-DD");
  export default {
    name: "goShop",
    mixins: [selectMixin],
    components: {
      relevanceTab,
    },
    data() {
      return {
        timeFrame: 0,
        retainTime: "",
        isHeatMap: true,
        timeMarks: {},
        mapOptions: {
          gradient: {
            ".9": "#ec1313",
            ".8": "#e8585a",
            ".66": "#feb33d",
            ".5": "#86ef40",
            ".42": "#2bd9cf",
            ".28": "#33b3ed",
            ".15": "#7367f0",
          },
          radius: "",
        },
        map: "",
        colorBar: require("@/assets/images/fixation_img/rest/colorBar.png"),
        gateIcon: require("@/assets/images/fixation_img/rest/floor-gate-icon.png"),
        dayTime: [yesterday, yesterday],
        disabledDate: "",
        tabsList: [],
        hourTime: "-1",
        hourList: [{ label: "全天", value: "-1" }, { label: "小时", value: "0" }],
        floor: "",
        floorList: [],
        dateType: "week",
        dateOptions: [
          {
            label: this.$t("周"),
            value: "week",
          },
          {
            label: this.$t("月"),
            value: "month",
          },
          {
            label: this.$t("年"),
            value: "year",
          },
          {
            label: this.$t("自定义"),
            value: "daterange",
          },
        ],
        dateValue: moment()
          .day(0)
          .format("YYYY-MM-DD"),
        heatMapDataList: [],
        maxValue: 0,
        minValue: 0,
        allHeatMapData: [],
        minTime: 0,
        maxTime: 23,
      };
    },
    computed: {
      dateOptionsCom() {
        this.dateOptions = [
          {
            label: this.$t("周"),
            value: "week",
          },
          {
            label: this.$t("月"),
            value: "month",
          },
          {
            label: this.$t("年"),
            value: "year",
          },
          {
            label: this.$t("自定义"),
            value: "daterange",
          },
        ];
        return this.dateOptions;
      },
      isSingleDay() {
        return (
          (this.dayTime[0] && this.dayTime[0].toString()) ==
          (this.dayTime[1] && this.dayTime[1].toString())
        );
      },
      dateFormat() {
        if (this.dateType === "week") {
          return this.$i18n.locale === "zh-CN" ? "yyyy 第 WW 周" : "yyyy WW week";
        } else {
          return "";
        }
      },
      datePlaceholder() {
        switch (this.dateType) {
          case "week":
            return this.$t("fn.请选择", [this.$t("周")]);
          case "year":
            return this.$t("fn.请选择", [this.$t("年")]);
          case "month":
            return this.$t("fn.请选择", [this.$t("月")]);
          default:
            return this.$t("fn.请选择", [this.$t("日期")]);
        }
      },
			
    },
    created() {
      this.disabledDate = disabledDate;
    },

    watch: {
      "$store.state.home.headerAction": {
        handler() {
          this.reset();
        },
      },
    },
    activated() {
      flowDistributionCharts && flowDistributionCharts.resize();
      window.onresize = () => {
        flowDistributionCharts && flowDistributionCharts.resize();
      };
      for (let i = 0; i <= 23; i++) {
        this.timeMarks[i] = i < 10 ? "0" + i : i.toString();
      }
    },
		mounted(){
      this.getFloorList()
		},
    deactivated() {
      window.onresize = null;
    },
    methods: {
      getFloorList() {
        var that = this;
        var property_id = this.$store.state.home.headerAction;
        let admin = this.$store.state.user.role_id;
        let allBzid = this.$store.state.user.bzid;
        let type = "is_heatmap";
        getHeatMapFloorData({ property_id, type }).then((res) => {
          that.floorList = [];
          let data = res.data.data;
          let floorList = data.map((m) => {
            // if (index == 0) that.floor = m.bzid
            let obj = {};
            obj.label = m.name;
            obj.value = m.bzid;
            obj.url = m.map_url;
            obj.bzid = m.data.join(",");
            return obj;
          });
          if (admin < 3) {
            this.floorList = floorList;
          } else {
            let currList = [];
            floorList.map((list) => {
              allBzid.map((val) => {
                if (list.value == val) currList.push(list);
              });
            });
            this.floorList = currList;
          }
          if (this.floorList[0]) this.floor = this.floorList[0].value;
          this.searchData();
        });
      },
      imgLoad() {
        if (this.map.bzid) {
          this.initHeatMapGrid();
        }
      },
      // 初始化热力地图分布网格
      initHeatMapGrid() {
        let begin_time = "";
        let end_time = "";
        let type = "";
        if (this.isSingleDay && this.hourTime !== "-1") {
          begin_time = `${moment(this.dayTime[0]).format("YYYY-MM-DD")} ${
            this.timeFrame
            }:00:00`;
          end_time = `${moment(this.dayTime[0]).format("YYYY-MM-DD")} ${
            this.timeFrame
            }:59:59`;
          type = "houly";
        } else {
          begin_time = moment(this.dayTime[0]).format("YYYY-MM-DD");
          end_time = moment(this.dayTime[1]).format("YYYY-MM-DD");
          type = "daily";
        }
        // 判断是否是按照小时查询
        if (this.hourTime !== "-1") {
          // 小时
          heatmapShow({
            floor_bzid: this.floor,
            begin_time,
            end_time,
            type: "hourly",
          }).then((res) => {
            let data = res.data.data.list;
            this.allHeatMapData = data || [];
            this.minTime = Number(moment(data[0].hourly).format("H"));
            this.maxTime = Number(
              moment(data[data.length - 1].hourly).format("H")
            );
            this.timeFrame = Number(moment(data[0].hourly).format("H"));
          });
        } else {
          heatmapShow({
            // 全天
            floor_bzid: this.floor,
            begin_time,
            end_time,
            type,
          }).then((res) => {
            this.changeData(res.data.data.list);
          });
        }
      },
      resetClick() {
        this.dateType = "week";
        this.dateValue = moment()
          .day(0)
          .format("YYYY-MM-DD");
      },
      reset() {
        this.dayTime = [yesterday, yesterday];
        this.hourTime = "-1";
        this.floor = this.floorList.length > 0 ? this.floorList[0].value : "";
      },
      /** 查询方法 */
      searchData() {
        this.map = "";
				if (this.floor == "") return;
				let floor = _.find(this.floorList, ["value", this.floor]);
				this.map = floor;
				if (!floor.bzid) {
					return;
				}
      },
      dateTypeChange(e) {
        this.dateValue = moment().format("YYYY-MM-DD");
        switch (e) {
          case "month":
            this.dateValue = this.dateValue.substring(0, 8) + "01";
            break;
          case "year":
            this.dateValue = this.dateValue.substring(0, 5) + "01-01";
            break;
          case "week":
            this.dateValue = moment()
              .day(0)
              .format("YYYY-MM-DD");
            break;
        }
      },
      // timeChange(value){
      //     if(this.retainTime===this.timeFrame) return
      //     this.retainTime = this.timeFrame
      //     // this.initHeatMapGrid()
      //     // this.changeData()
      //       let currData
      //      this.allHeatMapData.map(list=>{
      //         if(value=== Number(moment(list.hourly).format('H'))){
      //             currData =  list.list
      //         }
      //     })
      //     this.changeData(currData)
      // },
      changeInput(value) {
        let currData;
        if (this.allHeatMapData.length !== 0) {
          this.allHeatMapData.map((list) => {
            if (value === Number(moment(list.hourly).format("H")))
              currData = list.list;
          });
          this.changeData(currData);
        }
      },
      changeData(data) {
        const width = this.$refs.heatMap.offsetWidth;
        const height = this.$refs.heatMap.offsetHeight;
        if (data.length) {
          this.maxValue = Math.max.apply(
            Math,
            data.map((item) => {
              return item.enter_num;
            })
          );
          let listData = data.map((o) => {
            return {
              x: Math.round(width * o.x_num),
              y: Math.round(height * o.y_num),
              value: o.enter_num,
              radius: 80,
            };
          });
          //排序后递减，以防热力不明显
          listData = listData.sort((a, b) => {
            return Number(b.value) - Number(a.value);
          });
          if (listData.length * 20 < this.maxValue) {
            listData.forEach((o, i) => {
              o.value = this.maxValue - i * 20;
            });
          } else {
            listData.forEach((o, i) => {
              o.value = listData.length * 20 - i * 20;
            });
          }
          this.minValue = listData[listData.length - 1].value;
          this.heatMapDataList = listData;
          if (!this.maxValue) this.heatMapDataList = [];
        } else {
          this.maxValue = 0;
          this.heatMapDataList = [];
        }
      },
    },
  };
</script>
<style lang="less">
	.heatMaps {
		.m-l-10 {
			margin-left: 10px;
		}
		.path-picker {
			margin-bottom: 20px;
			overflow: hidden;
			background-color: #fff;
			box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
			padding: 18px 30px;
			border-radius: 0.5rem;
			display: flex;
			align-items: center;
			.con-select {
				clear: none;
			}
			
			.ivu-input {
				height: 40px;
				font-size: 14px;
				border: 1px solid rgba(0, 0, 0, 0.2);
				font-family: "source_han_sans_cn", "Roboto", sans-serif;
			}
			
			.selectExample {
				float: left;
				width: 100px;
				margin-left: 10px;
			}
			.select-type {
				float: left;
				width: 200px;
				margin-right: 10px;
			}
			.selectFloor {
				width: 150px;
			}
			
			.ivu-input-suffix {
				i {
					height: 40px;
					width: 40px;
					line-height: 40px;
				}
			}
			
			.ivu-date-picker .ivu-select-dropdown {
				z-index: 90000;
			}
		}
		.flex-box {
			display: flex;
			align-items: center;
			
			.reset {
				float: left;
				height: 41px;
				margin-top: 1px;
				background-color: #fff;
				color: #37b5ed !important;
				border: 1px solid #37b5ed !important;
			}
		}
		.ivu-select-single .ivu-select-selection {
			height: 40px;
			border: 1px solid rgba(0, 0, 0, 0.2);
			
			span {
				font-size: 1rem;
			}
		}
		
		.ivu-select-single .ivu-select-selection .ivu-select-placeholder,
		.ivu-select-single .ivu-select-selection .ivu-select-selected-value {
			line-height: 40px;
			padding-left: 20px;
		}
		.content {
			background-color: white;
			padding: 20px;
			
			.heatMap {
				position: relative;
				z-index: 1;
				.colorNumber {
					position: absolute;
					left: 0;
					top: 0;
					z-index: 10;
					overflow: hidden;
					img {
						display: block;
						width: auto;
						height: auto;
						float: left;
					}
					p {
						float: left;
						height: 130px;
						position: relative;
						margin-left: 5px;
						span {
							font-size: 14px;
							color: #fff;
							&:nth-child(2) {
								position: absolute;
								left: 0;
								bottom: 0;
							}
						}
					}
				}
				#heat-grid {
					position: absolute !important;
					left: 0;
					bottom: 0;
					right: 0;
					top: 0;
					opacity: 0.8;
					z-index: 1;
					width: 100%;
					height: 100%;
					background-color: rgba(65, 62, 223, 0.4);
				}
				
				.noData {
					position: relative;
					left: 0;
					top: 0;
					width: 100%;
					height: 568px;
					line-height: 568px;
					font-size: 32px;
					background-color: #fff;
					z-index: 1;
					text-align: center;
				}
				
				#mapImg {
					width: 100%;
					height: 670px;
				}
				
				.gateDataList {
					position: absolute;
					z-index: 1;
					
					img {
						width: 30px;
						height: 30px;
						cursor: pointer;
					}
					
					.gateDataText {
						position: absolute;
						background-color: #fff;
						border-radius: 5px;
						box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
						padding-bottom: 10px;
						width: 160px;
						left: -65px;
						
						p {
							font-size: 14px;
							color: #333;
							line-height: 30px;
							background-color: rgba(0, 0, 0, 0.04);
							padding: 0 10px;
							height: 30px;
							width: 100%;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						
						span {
							display: inline-block;
							width: 100%;
							font-size: 14px;
							margin-top: 5px;
							color: #333;
							padding: 0 10px;
						}
					}
				}
			}
			.time-frame {
				margin-top: 40px;
			}
		}
	}
</style>
