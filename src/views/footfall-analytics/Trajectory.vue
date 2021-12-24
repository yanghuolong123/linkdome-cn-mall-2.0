<template>
  <div class="containter">
    <div class="selector-container common-card">
      <div class="flex-center">
        <DatePicker
          :editable="false"
          :clearable="false"
          type="date"
          @on-change="(val) => (queryParams.date = val)"
          v-model="queryParams.date"
          class="w-select"
          :options="options"
        ></DatePicker>
        <Button
          size="large"
          class="m-l-20"
          type="primary"
          @click="handleSearch"
          >{{ $t("查询") }}</Button
        >
        <Button size="large" class="m-l-20" @click="reset">{{
          $t("重置")
        }}</Button>
      </div>
    </div>
    <div class="common-card m-t-20 main">
      <div class="tit">顾客轨迹信息统计</div>
      <el-table
        ref="table"
        default-expand-all
        :data="tableData"
        :header-cell-style="{ background: '#F8F8F8' }"
        class="trajectory-table m-t-20"
        style="width: 100%"
        border
      >
        <el-table-column align="center" prop="object_id" label="顾客ID">
        </el-table-column>
        <el-table-column prop="gender" align="center" label="性别">
          <span slot-scope="{ row }">{{
            row.gender == "female" ? "女" : "男"
          }}</span>
        </el-table-column>
        <el-table-column prop="age" align="center" label="年龄">
        </el-table-column>
        <el-table-column prop="count" align="center" label="轨迹点位数">
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
                <el-image :src="img.image_path" fit="contain"></el-image>
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
      <div class="pagination">
        <el-pagination
          background
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page.sync="queryParams.page"
          :page-sizes="[25, 50, 100, 200, 500]"
          :page-size="queryParams.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <BigImg
        :index="index + '-' + +new Date()"
        :keyName="keyName"
        :info="previewImgInfo"
      ></BigImg>
    </div>
  </div>
</template>
<script>
import BigImg from "./components/GetBigImg.vue";
import { getCustomerTrailList } from "@/api/passenger";
import { disabledDate } from "../../libs/util";
import moment from "moment";
const yesterday = moment(new Date())
  .subtract(1, "days")
  .format("YYYY-MM-DD");
export default {
  components: {
    BigImg,
  },
  data() {
    return {
      index: 0,
      previewImgInfo: {},
      total: 0,
      tableData: [],
      queryParams: {
        page: 1,
        limit: 25,
        date: yesterday,
      },
      keyName: {
        title: "object_id",
        time1: "cur_time",
        image_path: "image_path",
        location: "location",
      },
    };
  },

  methods: {
    sizeChange(size) {
      this.queryParams.limit = size;
      this.handleSearch();
    },
    currentChange(page) {
      this.queryParams.page = page;
      this.handleSearch();
    },
    imgClick(img, index, list) {
      this.index = index;
      this.previewImgInfo = _.cloneDeep(list);
    },
    pageChange(row, page) {
      row.listPage = page;
    },
    rowClick(row) {
      // 点击button展开
      this.$refs.table.toggleRowExpansion(row, !row.expand);
      row.expand = !row.expand;
    },
    handleSearch() {
      const params = {
        time1: moment(this.queryParams.date).format("YYYY-MM-DD"),
        time2: moment(this.queryParams.date).format("YYYY-MM-DD"),
        page: this.queryParams.page,
        limit: this.queryParams.limit,
      };
      getCustomerTrailList(params)
        .then((res) => {
          this.tableData = res.data.data.list || [];
          this.total = res.data.data.count || 0;
          this.tableData.forEach((o) => {
            o.expand = true;
            this.$set(o, "listPage", 0);
            o.list = _.chunk(o.list, 10);
          });
        })
        .catch((err) => {
          this.total = 0;
          this.tableData = [];
        });
    },
    reset() {
      this.queryParams.date = yesterday;
    },
  },
  created() {
    this.options = disabledDate;
    this.handleSearch();
  },
};
</script>
<style scoped lang="scss">
.containter {
  .el-table--fit {
    max-height: 55vh;
    overflow: auto;
  }
  .el-table {
    border: 1px solid #ebeef5 !important;
  }
  .el-table::before {
    z-index: inherit;
  }
  .main {
    .tit {
      font-size: 18px;
    }
    .operate-btn {
      color: #5fc4f1;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .trajectory-table {
    /deep/.el-table__expanded-cell {
      padding: 0;
    }
  }
  .img-box {
    width: 100%;
    background: #f7f7f7;
    padding: 9px 50px;
    .img-item {
      text-align: center;
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

    .el-image {
      width: 134px;
      height: 79px;
      border: 1px solid #ccc;
    }
  }
  .pagination {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
