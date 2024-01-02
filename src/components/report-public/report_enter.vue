<template>
  <div
    class="enter-list"
    style="padding: 0 60px;
		margin-top: 8px;
		margin-bottom: 30px;"
  >
    <title-name :listTitle="listTitle"></title-name>
    <div class="list-text" style="margin-top: 16px;" v-if="data">
      <div
        class="text-left "
        style="	height: 260px;
				border: 3px dashed #7ecef4;
				border-radius: 8px;
				"
      >
        <div class="left-tetx flex-column">
          <div
            class="left-icon"
            style="	width: 90px;
						height: 90px;
						border-radius: 12px;"
          >
            <img
              style="		width: 50px;
							margin: 20px;"
              :src="enterIcon"
              alt=""
            />
          </div>

          <h4
            style="font-size: 28px;
						margin-top: 14px;"
          >
            {{$t('report.累计客流')}}
          </h4>
          <p style="	font-size: 26px;" class="ellipsis-1">{{ data.enter }}</p>
          <!-- <div class="left-gender">
						<span>男性:70%</span>
						<span>女性:30%</span>
					</div> -->
        </div>
      </div>
      <div
        class="text-right"
        style="	height:260px;
				border: 3px dashed #7ecef4;
				border-radius: 8px;
				padding: 22px;"
      >
        <div class="right-top">
          <div class="f1 flex-start">
            <div
              class="right-top-icon"
              style="width: 90px;
						height: 90px;
							border-radius: 12px;"
            >
              <img
                style="margin: 20px;
							width: 50px;
							height: 50px;"
                :src="peakIcon"
                alt=""
              />
            </div>
            <div class="right-top-number" style="	margin-left: 18px;">
              <h4 style="	font-size: 28px;">{{$t('客流峰值')}}</h4>
              <p style="font-size: 26px;" class="ellipsis-1">{{ data.enterPeak }}</p>
              <span style="font-size: 16px;">{{ data.enterTime }}</span>
            </div>
          </div>
          <div class="f1 flex-start">
            <div
              class="right-top-icon"
              style="width: 90px;
						height: 90px;
							border-radius: 12px;"
            >
              <img
                style="margin: 20px;
							width: 50px;
							height: 50px;"
                :src="flowIcon"
                alt=""
              />
            </div>
            <div class="right-top-number" style="	margin-left: 18px;">
              <h4 style="	font-size: 28px;">{{$t('report.集客量峰值')}}</h4>
              <p style="font-size: 26px;" class="ellipsis-1">{{ data.occupancyPeak }}</p>
              <span style="font-size: 16px;" class="ellipsis-1">{{ data.occupancyTime }}</span>
            </div>
          </div>
        </div>
        <div
          class="right-line"
          style="	margin: 16px 0;
					height: 2px;"
        ></div>
        <div class="right-bottom">
          <div class="f1 flex-start">
            <div
              class="right-bottom-icon"
              style="width: 90px;
						height: 90px;
						border-radius: 12px;"
            >
              <img
                style="margin: 20px;
							width: 50px;
							height: 50px;"
                :src="averageIcon"
                alt=""
              />
            </div>
            <div class="right-bottom-number" style="	margin-left: 18px;">
              <h4 style="font-size: 28px;" class="ellipsis-1">{{$t('report.平均客流量')}}</h4>
              <p style="font-size: 26px;" class="ellipsis-1">{{ data.average }}</p>
            </div>
          </div>
          <div class="f1 flex-start">
            <div
              class="right-bottom-icon"
              style="width: 90px;
						height: 90px;
						border-radius: 12px;"
            >
              <img
                style="margin: 20px;
							width: 50px;
							height: 50px;"
                :src="validIcon"
                alt=""
              />
            </div>
            <div class="right-bottom-number" style="	margin-left: 18px;">
              <h4 style="font-size: 28px;">{{$t('report.有效客流量')}}</h4>
              <p style="	font-size: 26px;" class="ellipsis-1">{{ data.valid }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import titleName from "./report_title_name";
export default {
  name: "report-enter",
  props: {
    listTitle: {
      type: Object,
    },
    data: {
      type: Object,
    },
  },
  components: {
    titleName,
  },
  data() {
    return {
      enterIcon: require("@/assets/images/fixation_img/rest/enter.png"),
      averageIcon: require("@/assets/images/fixation_img/rest/average.png"),
      validIcon: require("@/assets/images/fixation_img/rest/valid.png"),
      flowIcon: require("@/assets/images/fixation_img/rest/flow.png"),
      peakIcon: require("@/assets/images/fixation_img/rest/peak.png"),
    };
  },
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less">
.enter-list {
  width: 100%;
  height: auto;
  .list-text {
    width: 100%;
    height: auto;
    overflow: hidden;

    .text-left {
      width: 25%;
      float: left;

      background: #207ece;

      .left-tetx {
        justify-content: center;
        align-items: center;
        width: 80%;
        height: 100%;
        margin: 0 auto;
        .left-icon {
          background-color: #fff;
          margin: 0 auto;
          img {
            float: left;
            display: block;
            height: auto;
          }
        }
        h4 {
          color: #fff;

          text-align: center;
        }
        p {
          width: 100%;

          color: #35e9df;
          text-align: center;
        }
        .left-gender {
          width: 100%;
          height: auto;
          span {
            display: inline-block;
            width: 100%;
            text-align: center;
            font-size: 16px;
            color: #eeebeb;
          }
        }
      }
    }
    .text-right {
      width: 70%;
      float: right;
      background: #207ece;
      .f1 {
        flex: none;
        width: 50%;

      }
      .right-top {
        width: 100%;
        height: auto;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        .right-top-icon {
          background-color: #fff;

          float: left;
          img {
            display: block;
          }
        }
        .right-top-number {
          flex: 1;
          width: 0;
          text-align: left;
          h4 {
            color: #fff;
          }
          p {
            width: 100%;

            color: #35e9df;
          }
          span {
            display: inline-block;

            color: #f1f0f0;
          }
        }
      }
      .right-line {
        width: 100%;
        background-color: #fff;
        opacity: 0.5;
      }
      .right-bottom {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: auto;
        text-align: left;
        .right-bottom-icon {
          background-color: #fff;

          float: left;
          img {
            display: block;
          }
        }
        .right-bottom-number {
          flex: 1;
          width: 0;
          h4 {
            color: #fff;
          }
          p {
            width: 100%;

            color: #35e9df;
          }
        }
      }
    }
  }
}
</style>
