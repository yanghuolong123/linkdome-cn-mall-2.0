<template>
    <div class="report-center ">
        <div class="filter-box flex-center">
            <DatePicker
                    type="date"
                    :editable="false"
                    @on-change="val=>selectDateTime = val"
                    :options="options3"
                    :value="selectDateTime"
            >
            </DatePicker>
            <!--改成多选时要注意后端没有按照前端返回的id顺序返回门店，造成报告混乱，需处理-->
            <Select v-model="storeSelected" class="m-l-20" style="width: 200px" filterable>
                <Option v-for="item in storeListOptions" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <Button type="primary" :disabled="!storeSelected" class="m-l-20" @click="reportQuery" size="large">{{
                $t('query') }}
            </Button>
            <div class="icon-download" v-on:click="downloadReport('storeDay',`${selectDateTime},${selectDateTime}`)"
                 :title="$t('report.reportDwonload')">
                <icons type="daoru" color="#2a7dc1" :size=20></icons>
            </div>
        </div>
        <div class="pdf-text-box" v-if="showReport">
            <!-- 封面 -->
            <report-cover
                    :titleName="$t('report.linkdomeDailyReport')"
                    :pageTotal="`${validStoreSelectedList.length*14}`"
            ></report-cover>
            <div v-for="(store,i) in validStoreSelectedList">
                <report-chart :chartHeight='600'
                              v-if="storeEnterChartList.length"
                              :title='$t("report.storeEnterAnaly")'
                              :page='(14*i+1).toString()'
                              :isRemark="false"
                              :storeName="storeEnterChartList[i].storeName"
                              :listTitle='storeTrendTitle("enter")'
                              :dataList=storeEnterChartList[i].chartData></report-chart>
                <!--门店 当日店铺入客流（表格）-->
                <report-ratio-table
                        v-if="storeEnterFlowList.length"
                        :title='$t("report.storeEnterAnaly")'
                        :page='(14*i+2).toString()'
                        :listTitle='storeTrendTitle("enter")'
                        :tableColumn='ratioTableColumn'
                        :tableData='storeEnterFlowList[i].tableData'
                        :storeName="storeEnterFlowList[i].storeName"
                ></report-ratio-table>
                <report-chart :chartHeight='600'
                              v-if="storeExitChartList.length"
                              :title='$t("report.storeEnterAnaly")'
                              :page='(14*i+3).toString()'
                              :isRemark="false"
                              :listTitle='storeTrendTitle("exit")'
                              :storeName="storeExitChartList[i].storeName"
                              :dataList=storeExitChartList[i].chartData></report-chart>
                <!--门店 当日店铺出客流（表格）-->
                <report-ratio-table
                        v-if="storeExitFlowList.length"
                        :title='$t("report.storeEnterAnaly")'
                        :page='(14*i+4).toString()'
                        :listTitle='storeTrendTitle("exit")'
                        :tableColumn='ratioExitTableColumn'
                        :tableData='storeExitFlowList[i].tableData'
                        :storeName="storeExitFlowList[i].storeName"
                ></report-ratio-table>
                <report-chart :chartHeight='600'
                              v-if="storeTotalChartList.length"
                              :title='$t("report.storeEnterAnaly")'
                              :page='(14*i+5).toString()'
                              :isRemark="false"
                              :storeName="storeTotalChartList[i].storeName"
                              :listTitle='storeTrendTitle("total")'
                              :dataList=storeTotalChartList[i].chartData></report-chart>
                <!--门店 当日店铺总客流（表格）-->
                <report-ratio-table
                        v-if="storeTotalFlowList.length"
                        :title='$t("report.storeEnterAnaly")'
                        :page='(14*i+6).toString()'
                        :listTitle='storeTrendTitle("total")'
                        :tableColumn='ratioTotalTableColumn'
                        :tableData='storeTotalFlowList[i].tableData'
                        :storeName="storeTotalFlowList[i].storeName"
                ></report-ratio-table>
                <report-chart :chartHeight='600'
                              v-if="storePassbyChartList.length"
                              :title='$t("report.storeEnterAnaly")'
                              :page='(14*i+7).toString()'
                              :isRemark="false"
                              :listTitle='stroePssbyTitle'
                              :storeName="storePassbyChartList[i].storeName"
                              :dataList=storePassbyChartList[i].chartData></report-chart>
                <!--门店 当日路经客流-->
                <report-ratio-table
                        v-if="storePassbyFlowList.length"
                        :title='$t("report.storeEnterAnaly")'
                        :page='(14*i+8).toString()'
                        :listTitle='stroePssbyTitle'
                        :tableColumn='passbyTableColunm'
                        :tableData='storePassbyFlowList[i].tableData'
                        :storeName="storePassbyFlowList[i].storeName"
                ></report-ratio-table>
                <report-age-gender-chart :title='$t("report.storeEnterAnaly")'
                                         v-if="ageGenderChartData.length"
                                         :page='(14*i+9).toString()'
                                         :listTitle='ageGenderTitle("enter")'
                                         :storeName="ageGenderChartData[i].storeName"
                                         :dataList=ageGenderChartData[i].chartData></report-age-gender-chart>
                <!--当日进店年龄性别入客流-->
                <report-age-gender-table
                        v-if="storeAgeGenderFlowList.length"
                        :title='$t("report.storeEnterAnaly")'
                        :page='(14*i+10).toString()'
                        :listTitle='storeAgeGenderTitle("enter")'
                        :tableColumn='ageGenderTableColumn'
                        :tableData='storeAgeGenderFlowList[i].tableData'
                        :storeName="storeAgeGenderFlowList[i].storeName"
                ></report-age-gender-table>
                <!--当日进店年龄性别出客流-->
                <report-age-gender-chart :title='$t("report.storeEnterAnaly")'
                                         v-if="ageGenderExitChartData.length"
                                         :page='(14*i+11).toString()'
                                         :listTitle='ageGenderTitle("exit")'
                                         :storeName="ageGenderExitChartData[i].storeName"
                                         :dataList=ageGenderExitChartData[i].chartData></report-age-gender-chart>

                <report-age-gender-table
                        v-if="storeAgeGenderExitFlowList.length"
                        :title='$t("report.storeEnterAnaly")'
                        :page='(14*i+12).toString()'
                        :listTitle='storeAgeGenderTitle("exit")'
                        :tableColumn='ageGenderTableColumn'
                        :tableData='storeAgeGenderExitFlowList[i].tableData'
                        :storeName="storeAgeGenderExitFlowList[i].storeName"
                ></report-age-gender-table>
                <!--当日路经年龄性别客流-->
                <report-age-gender-chart :title='$t("report.storeEnterAnaly")'
                                         v-if="storeAgeGenderPssbyFlowChart.length"
                                         :page='(14*i+13).toString()'
                                         :listTitle='storeAgeGenderPssbyTitle'
                                         :storeName="storeAgeGenderPssbyFlowChart[i].storeName"
                                         :dataList=storeAgeGenderPssbyFlowChart[i].chartData></report-age-gender-chart>
                <report-age-gender-table
                        v-if="storeAgeGenderPssbyFlowList.length"
                        :title='$t("report.storeEnterAnaly")'
                        :page='(14*i+14).toString()'
                        :listTitle='storeAgeGenderPssbyTitle'
                        :tableColumn='ageGenderTableColumn'
                        :tableData='storeAgeGenderPssbyFlowList[i].tableData'
                        :storeName="storeAgeGenderPssbyFlowList[i].storeName"
                ></report-age-gender-table>
            </div>

            <report-back-cover></report-back-cover>

        </div>
    </div>
</template>
<script>
  import reportChart from '@/components/report/newReport/report_chart'
  import reportCover from '@/components/report/newReport/report_cover'
  import reportOverview from './components/report-overview'
  import reportDwell from './components/report-dwell'
  import reportBackCover from '@/components/report/newReport/report_back_cover'
  import reportAgeGenderChart from './components/report-age-gender-chart'
  import reportAgeGenderTable from './components/report-age-gender-table'
  import reportRatioTable from '@/components/report/newReport/report_ratio_table'
  import mixins from '../reportMixin.js'
  import { getEntity } from '@/api/home'
  import axios from 'axios'
  import { ageGenderPassbyTrend, passbyTrend, ageGenderTrend } from '@/api/report'

  import moment from 'moment/moment'
  import { disabledDate, getToken } from '@/libs/util.js'

  import { entityFlow } from '@/api/entityNew'
  import storeMixin from './mixin'
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState({
        pdfBaseUrl: state => state.report.pdfBaseUrl,
      }),
    },
    components: {
      reportCover,
      reportBackCover,
      reportOverview,
      reportChart,
      reportRatioTable,
      reportAgeGenderChart,
      reportAgeGenderTable,
      reportDwell
    },
    data () {
      return {
        selectDateTime: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        options3: disabledDate,
        storeListOptions: [],
        showReport: false
      }
    },
    mixins: [mixins, storeMixin],
    async mounted () {
      const data = await getEntity(this.propertyId, 50)
      this.storeListOptions = [...data.data.data]
    },
    methods: {
      downloadReport (type, time) {
        if (!this.storeSelected) {
          this.$alert({ content: this.$t('fn.select', [this.$t('店铺')]) })
          return false
        }
        if (time === '') {
          this.$alert({ content: this.$t('fn.select', [this.$t('time')]) })
          return false
        }
        let pdfUrl = window.location.href.split('/#/')[0]
        let token = getToken()
        let objName = (pdfUrl.split('://')[1]).split('.')[0] + '_' + this.propertyId
        let url = pdfUrl + '/#/downloadStoreDayPdf?propertyId=' + this.propertyId + '&date=' + time + '&token=' + token + '&bzid=' + this.storeBzids + '&storeNames=' + encodeURI(this.storeNames) + '&pdfUrl=' + this.pdfBaseUrl + '&language=' + this.language
        this.$vs.loading()
        const datelist = time.split(',')
        const filename = datelist[0] === datelist[1] ? datelist[0] : time
        if (!this.pdfBaseUrl) {
          this.$message.warning(this.$t('error.pdfError'))
          return
        }
        axios.post(this.pdfBaseUrl + '/pdf/execute', {
          filename: time + this.storeNames,
          project: objName,
          url: url
        }, { responseType: 'blob' })
          .then((response) => {
            this.$vs.loading.close()
            var blob = new Blob([response.data])
            var downloadElement = document.createElement('a')
            var href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.href = href
            downloadElement.download = filename + this.$t('门店日报') + this.storeNames + '.pdf' // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
          })
          .catch((error) => {
            console.log(error)
            this.$Message.error('报告下载失败')
            this.$vs.loading.close()
          })
      },
      reportQuery () {
        this.headerDate(this.selectDateTime)
        const yesterday = moment(this.selectDateTime).subtract(1, 'days').format('YYYY-MM-DD')
        this.showReport = true
        Promise.all([
          //当日进店客流6
          entityFlow({
            type: 'enter',
            range: 'Hour',
            time1: `${this.selectDateTime},${this.selectDateTime}`,
            time2: yesterday + ',' + yesterday,
            bzid: this.storeBzids,
          }),
          //当日出店客流6
          entityFlow({
            type: 'exit',
            range: 'Hour',
            time1: `${this.selectDateTime},${this.selectDateTime}`,
            time2: yesterday + ',' + yesterday,
            bzid: this.storeBzids,
          }),
          //路经客流7
          passbyTrend({
            property_id: this.propertyId,
            bzid: this.storeBzids,
            time1: `${this.selectDateTime},${this.selectDateTime}`,
            time2: yesterday + ',' + yesterday,
            type: 'enter',
            range: 'Hour',
          }),
          //年龄性别趋势（表格）7
          ageGenderTrend({
            property_id: this.propertyId,
            bzid: this.storeBzids,
            time1: `${this.selectDateTime},${this.selectDateTime}`,
            type: 'enter',
            range: 'Hour'
          }),
          //年龄性别出客流趋势（表格）7
          ageGenderTrend({
            property_id: this.propertyId,
            bzid: this.storeBzids,
            time1: `${this.selectDateTime},${this.selectDateTime}`,
            type: 'exit',
            range: 'Hour'
          }),
          // 性别年龄　路经　客流趋势9
          ageGenderPassbyTrend({
            property_id: this.propertyId,
            bzid: this.storeBzids,
            time1: `${this.selectDateTime},${this.selectDateTime}`,
          }),
        ]).then(res => {

          //门店数据（当日入客流）
          this.storeEnterChartList = Object.freeze(this.storeEnterChart(res[0].data.data))
          this.storeEnterFlowList = Object.freeze(this.storeEnterFlow(res[0].data.data))

          //门店数据（当日出客流）
          this.storeExitFlowList = Object.freeze(this.storeEnterFlow(res[1].data.data))
          this.storeExitChartList = Object.freeze(this.storeEnterChart(res[1].data.data))

          //总客流
          const totalData = this.getTotalFlowList(res[0].data.data, res[1].data.data)
          this.storeTotalFlowList = Object.freeze(this.storeEnterFlow(totalData))
          this.storeTotalChartList = Object.freeze(this.storeEnterChart(totalData))

          //路径客流
          this.storePassbyFlowList = Object.freeze(this.storeEnterFlow(res[2].data.data))
          this.storePassbyChartList = Object.freeze(this.storeEnterChart(res[2].data.data))

          //门店进店年龄性别客流

          this.ageGenderChartData = Object.freeze(this.ageGenderList(res[3].data.data.time1, 'hourly'))
          this.storeAgeGenderFlowList = Object.freeze(res[3].data.data.time1.map(o => {
            return {
              storeName: o.name,
              tableData: this.ageGenderTable(o, 'hourly')
            }
          }))
          //门店出店年龄性别客流
          this.ageGenderExitChartData = Object.freeze(this.ageGenderList(res[4].data.data.time1, 'hourlyExit'))
          this.storeAgeGenderExitFlowList = Object.freeze(res[4].data.data.time1.map(o => {
            return {
              storeName: o.name,
              tableData: this.ageGenderTable(o, 'hourlyExit')
            }
          }))
          // 性别年龄　路经　客流趋势
          this.storeAgeGenderPssbyFlowChart = Object.freeze(this.ageGenderList(res[5].data.data.time1, 'passbyHourly'))
          this.storeAgeGenderPssbyFlowList = Object.freeze(res[5].data.data.time1.map(o => {
            return {
              storeName: o.name,
              tableData: this.ageGenderTable(o, 'passbyHourly')
            }
          }))
        })
      },
    },
  }
</script>
<style lang="less">
    .report-center {
        min-width: 1200Px;

        .filter-box {
            background-color: #fff;
            margin-top: 9px;
            padding: 20px 30px;
            box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
            border-radius: 6px;
            margin-bottom: 20px;

            .ivu-input {
                width: 230px;
                font-size: 16px;
            }

            .icon-download {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                background-color: #fff;
                text-align: center;
                line-height: 40px;
                float: left;
                margin-left: 60px;
                box-shadow: 0px 0px 9px 0px rgba(166, 168, 169, .4);
                cursor: pointer;

                &:before {
                    content: none
                }
            }
        }

        .pdf-text-box {
            margin: 0px auto;
            max-width: 1200Px
        }
    }
</style>
