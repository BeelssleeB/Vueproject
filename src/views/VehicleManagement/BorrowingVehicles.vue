<template>
  <div>
    <div style="margin-top:20px;display:flex;
  justify-content: space-between;">
      <div>
        <el-input
          placeholder="请输入工具名称搜索"
          prefix-icon="el-icon-search"
          clearable
          @clear="initVehicles"
          style="width: 350px;margin-right: 10px"
          v-model="keyWord"
          @keydown.enter.native="initVehicles"
        ></el-input>
        <el-button icon="el-icon-search" type="primary" @click="initVehicles">搜索</el-button>
      </div>
    </div>

    <div style="margin-top: 20px">
      <el-table :data="vehicles" stripe border style="width: 100%" height="400">
        <el-table-column prop="id" label="ID" align="center" width="200"></el-table-column>
        <el-table-column prop="vehicleCode" label="车辆编码" align="left" width="300"></el-table-column>
        <el-table-column prop="vehicleName" label="车辆名称" align="left" width="300"></el-table-column>
        <el-table-column prop="beginTime" width="250" align="left" label="开始时间"></el-table-column>
        <el-table-column prop="endTime" width="250" align="left" label="结束时间"></el-table-column>
        <el-table-column prop="vehicleStatus" width="320" label="车辆状态">
          <template slot-scope="scope">
            <el-switch
              disabled
              v-model="scope.row.vehicleStatus"
              active-text="使用中..."
              inactive-text="在库"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:20px;display: flex;justify-content: flex-end">
        <el-pagination
          background
          @current-change="currentChange"
          @size-change="sizeChange"
          layout="sizes, prev, pager, next, jumper, ->, total, slot"
          :total="total"
          :page-sizes="[4, 6, 8, 10]"
          :page-size="6"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BorrowingVehicles",
  data() {
    return {
      keyWord: "",
      vehicles: [],
      page: 1,
      size: 6,
      total: 0
    };
  },
  mounted() {
    this.initVehicles();
  },
  methods: {
    initVehicles() {
      this.getRequest(
        "/vehicle/borrowing/?keyword=" +
          this.keyWord +
          "&page=" +
          this.page +
          "&size=" +
          this.size
      ).then(resp => {
        if (resp) {
          this.vehicles = resp.data;
          this.total = resp.total;
        }
      });
    },
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initVehicles();
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initVehicles();
    }
  }
};
</script>

<style scoped>
</style>
