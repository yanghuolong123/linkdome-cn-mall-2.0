<template>
  <div class="containter">
    <div class="selector-container common-card">
      <div class="flex-center">
        <Date-picker
          :editable="false"
          :clearable="false"
          type="date"
          v-model="time"
          :options="options1"
          class="w-select"
        ></Date-picker>
        <Select
          placeholder="收银柜台"
          v-model="polygon_id"
          class="w-select m-l-20"
        >
          <Option v-for="item in polygonList" :value="item.id" :key="item.id">{{
            item.name
          }}</Option>
        </Select>
        <Button
          size="large"
          type="primary"
          class="m-l-20"
          @click="handleClick"
          >{{ $t("查询") }}</Button
        >
        <Button size="large" @click="resetClick" class="m-l-20">{{
          $t("重置")
        }}</Button>
      </div>
    </div>
    <div class="m-t-20 common-card">
      <div class="tit">{{ $t("顾客结账信息统计") }}</div>
      <el-table
        ref="table"
        :data="tableData"
        :header-cell-style="{ background: '#F8F8F8' }"
        class="trajectory-table m-t-20"
        style="width: 100%"
        border
      >
        <el-table-column prop="Cashier" align="center" label="收银柜台">
        </el-table-column>
        <el-table-column prop="start_time" align="center" label="开始时间">
        </el-table-column>
        <el-table-column prop="end_time" align="center" label="结束时间">
        </el-table-column>
        <el-table-column prop="checkout_time" align="center" label="花费时间">
          <span slot-scope="{ row }"> {{ getTime(row.checkout_time) }}</span>
        </el-table-column>
        <el-table-column prop="image_path" align="center" label="截图">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.image_path"
              fit="contain"
              @click="getImg(scope)"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="operate" align="center" label="操作">
          <template slot-scope="scope">
            <div @click="rowClick(scope.row)" class="operate-btn">
              轨迹点位 <i class="el-icon-arrow-down"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operate" align="center" width="1" type="expand">
          <template slot-scope="scope">
            <div v-if="!scope.row.list.length" class="img-box p-r">
              暂无轨迹数据
            </div>
            <div v-else class="img-box flex-center p-r">
              <el-button
                :disabled="!scope.row.listPage || !scope.row.list.length"
                @click.stop="pageChange(scope.row, scope.row.listPage - 1)"
                size="mini"
                class="icon-btn left"
                icon="el-icon-arrow-left"
                circle
              ></el-button>
              <div
                @click="
                  imgClick(img, index, scope.row.list[scope.row.listPage])
                "
                class="flex-column img-item"
                :key="img.id"
                v-for="(img, index) in scope.row.list[scope.row.listPage]"
              >
                <el-image
                  class="traceImg"
                  :src="img.image_path"
                  fit="contain"
                ></el-image>
                <span class="mt-2">object_id: {{ img.object_id }}</span>
                <span class="time">{{ img.cur_time }}</span>
                <span>{{ img.location }}</span>
              </div>
              <el-button
                :disabled="
                  !scope.row.list.length ||
                    scope.row.listPage + 1 === scope.row.list.length
                "
                size="mini"
                class="icon-btn right"
                icon="el-icon-arrow-right"
                @click="pageChange(scope.row, scope.row.listPage + 1)"
                circle
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginations">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[25, 50, 100, 200, 500]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="checkTotal"
        >
        </el-pagination>
      </div>
    </div>
    <BigImg
      :info="info"
      :index="index + '-' + +new Date()"
      :keyName="keyName"
    ></BigImg>
  </div>
</template>

<script>
import Moment from "moment";
import { addZero } from "@/libs/util";
import _ from "lodash";
import BigImg from "./components/GetBigImg.vue";
import { checkoutGroup, groupAndTrajectory } from "@/api/analysis";
import { cashierList } from "@/api/analysis";
import { disabledDate } from "../../libs/util";

const yesterday = Moment(new Date())
  .subtract(1, "days")
  .format("YYYY-MM-DD");

export default {
  name: "CusProperty",
  components: { BigImg },
  data() {
    return {
      time: yesterday,
      cashierList: [],
      polygonList: [],
      keyName: {},
      index: 0,
      tableData: [],
      checkTotal: 1,
      polygon_id: "",
      limit: 25,
      page: 1,
      info: {},
      traceList: [],
    };
  },
  created() {
    this.options1 = disabledDate;
    this.getList();
    cashierList().then((res) => {
      this.polygonList = res.data.data;
    });
  },
  methods: {
    resetClick() {
      this.polygon_id = "";
      this.time = yesterday;
    },
    // 查询
    handleClick() {
      this.page = 1;
      this.getList()
    },
    // 请求
    getList() {
      checkoutGroup({
        page: this.page,
        time1: Moment(this.time).format("YYYY-MM-DD"),
        time2: Moment(this.time).format("YYYY-MM-DD"),
        polygon_id: this.polygon_id,
        limit: this.limit,
      }).then((res) => {
        let data = res.data.data;
        this.checkTotal = data.count;
        this.tableData = data.list;
        this.tableData.forEach((o) => {
          this.$set(o, "listPage", 0);
        });
      });
    },
    async rowClick(row) {
      // 点击button展开
      if (!row.expand && !row.list) {
        await groupAndTrajectory({
          id: row.id,
          date: row.start_time.split(" ")[0],
        }).then((res) => {
          if (res.data.code !== 200)
            return this.$message.error(this.$t(res.data.message));
          this.$set(row, "listPage", 0);
          row.list = _.chunk(res.data.data, 10);
        });
      }
      this.$refs.table.toggleRowExpansion(row, !row.expand);
      row.expand = !row.expand;
    },
    pageChange(row, page) {
      row.listPage = page;
    },
    handleSizeChange(val) {
      this.limit = val;
      this.page = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      console.log(val);
      this.page = val;
      this.getList();
    },
    // 秒钟时间转换
    getTime(time) {
      let h = addZero(parseInt(time / 3600));
      let m = addZero(parseInt(time / 60));
      let s = addZero(parseInt(time % 60));
      return h + ":" + m + ":" + s;
    },
    // 查看大图
    getImg(val) {
      this.keyName = {
        title: "Cashier",
        time1: "start_time",
        time2: "end_time",
        image_path: "image_path",
      };
      this.info = _.cloneDeep(this.tableData);
      this.index = val.$index;
    },
    // 展开行图片预览
    imgClick(img, index, list) {
      this.keyName = {
        title: "object_id",
        time1: "cur_time",
        image_path: "image_path",
        location: "location",
      };
      this.index = index;
      this.info = _.cloneDeep(list);
    },
  },
};
</script>

<style scoped lang="less">
.containter {
  .tit {
    font-size: 18px;
  }
  .operate-btn {
    color: #5fc4f1;
    &:hover {
      cursor: pointer;
    }
  }
  .trajectory-table {
    /deep/.el-table__expanded-cell {
      padding: 0;
    }
  }
  .el-table {
    border: 1px solid #ebeef5 !important;
  }
  .el-table--fit {
    max-height: 55vh;
    overflow: auto;
  }
  .el-table::before {
    z-index: inherit;
  }
  .img-box {
    width: 100%;
    background: #f7f7f7;
    padding: 9px 50px;
    text-align: center;
    .img-item {
      cursor: pointer;
      text-align: center;
      .time {
        font-size: 12px;
        color: #626262;
      }
    }
    .img-item + .img-item {
      margin-left: 16px;
    }
    .icon-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      &.left {
        left: 10px;
      }
      &.right {
        right: 10px;
      }
    }
  }
  .el-image {
    width: 70px;
    height: 100px;
    margin-top: 5px;
    border: 1px solid #ccc;
  }
  .traceImg {
    width: 133px;
    height: 79px;
  }
  .paginations {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
