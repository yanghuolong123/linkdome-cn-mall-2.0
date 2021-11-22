<template>
  <div class="containter">
    <cusPropertySelect
      polygon="true"
      @handleClick="handleClick"
    ></cusPropertySelect>
    <div class="mt-4 common-card">
      <h4 class="title mb-2">{{ $t("顾客结账信息统计") }}</h4>
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
            <div>
              <el-image
                :src="scope.row.image_path"
                fit="contain"
                @click="getImg(scope)"
              ></el-image>
            </div>
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
            <div class="img-box flex-center p-r">
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
                <span class="time">{{ img.cur_time }}</span>
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
          :current-page="params.page"
          :page-sizes="[25, 50, 100, 200, 500]"
          :page-size="params.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="checkTotal"
        >
        </el-pagination>
      </div>
    </div>
    <BigImg
      :info="info"
      :index="index + '-' + +new Date()"
      :keyName="type ? keyName2 : keyName1"
    ></BigImg>
  </div>
</template>

<script>
import Moment from "moment";
import { addZero } from "@/libs/util";
import _ from "lodash";
import BigImg from "./components/GetBigImg.vue";
import { checkoutGroup, groupAndTrajectory } from "@/api/analysis";
import cusPropertySelect from "_c/flow-selector/property-flow-select.vue";
export default {
  name: "CusProperty",
  components: { cusPropertySelect, BigImg },
  watch: {
    currentP() {
      this.params.page = this.currentP;
      this.getList();
    },
  },
  data() {
    return {
      keyName1: {
        title: "Cashier",
        time1: "start_time",
        time2: "end_time",
        image_path: "image_path",
      },
      type: 0,
      keyName2: {
        title: "object_id",
        time1: "cur_time",
        image_path: "image_path",
      },
      index: 0,
      currentP: 1,
      tableData: [],
      checkTotal: 1,
      params: {
        limit: 25,
        time1: Moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD"),
        time2: Moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD"),
      },
      info: {},
      traceParams: {
        id: "",
        date: "",
        page: 1,
        limit: 10,
      },
      traceList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async rowClick(row) {
      // 点击button展开
      if (!row.expand) {
        this.traceParams.id = row.id;
        this.traceParams.date = row.start_time.split(" ")[0];
        await groupAndTrajectory(this.traceParams).then((res) => {
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
      this.params.limit = val;
      this.params.page = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.params.page = val;
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
      this.type = 0;
      this.info = _.cloneDeep(this.tableData);
      this.index = val.$index;
    },
    // 展开行
    imgClick(img, index, list) {
      this.type = 1;
      this.index = index;
      this.info = _.cloneDeep(list);
    },
    // 查询
    handleClick(val) {
      this.params = Object.assign(this.params, val);
      this.params.page = 1;
      this.currentP = 1;
      this.getList();
    },
    // 请求
    getList() {
      checkoutGroup(this.params).then((res) => {
        let data = res.data.data;
        this.checkTotal = data.count;
        this.tableData = data.list;
        this.tableData.forEach((o) => {
          this.$set(o, "listPage", 0);
          o.list = _.chunk(o.list, 10);
        });
      });
    },
  },
};
</script>

<style scoped lang="less">
.containter {
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
  .el-table--fit {
    max-height: 510px;
    overflow: auto;
  }

  .el-table::before {
    z-index: inherit;
  }
  .img-box {
    width: 100%;
    background: #f7f7f7;
    padding: 9px 50px;
    .img-item {
      cursor: pointer;
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
  .el-table {
    border: 1px solid #ebeef5 !important;
  }
  .traceImg {
    width: 134px;
    height: 79px;
  }
  .paginations {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
