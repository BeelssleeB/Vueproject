<template>
  <div>
    <div style="margin-top: 50px">
      <el-table :data="logs" stripe border style="width: 100%" height="350">
        <el-table-column prop="id" label="ID" align="center" width="150"></el-table-column>
        <el-table-column prop="user.name" label="操作人" align="left" width="200"></el-table-column>
        <el-table-column prop="module" label="模块" align="left" width="200"></el-table-column>
        <el-table-column prop="flag" width="200" align="left" label="结果"></el-table-column>
        <el-table-column prop="remark" width="250" align="left" show-overflow-tooltip label="信息"></el-table-column>
        <el-table-column prop="createTime" width="250" align="left" label="操作时间"></el-table-column>
      </el-table>
      <div style="margin-top:20px;display: flex;justify-content: flex-end">
        <el-pagination
          background
          @current-change="currentChange"
          @size-change="sizeChange"
          layout="sizes, prev, pager, next, jumper, ->, total, slot"
          :total="total"
          :page-sizes="[4, 8, 12, 16]"
          :page-size="8"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LogInformation",
  data() {
    return {
      logs: [],
      page: 1,
      size: 8,
      total: 0
    };
  },
  mounted() {
    this.initLogs();
  },
  methods: {
    initLogs() {
      this.getRequest(
        "/sys/log/?page=" + this.page + "&size=" + this.size
      ).then(resp => {
        if (resp) {
          this.logs = resp.data;
          this.total = resp.total;
          this.logs.forEach(function(cur, index, logs) {
            logs[index].flag = logs[index].flag ? "成功" : "失败";
          });
        }
      });
    },
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initLogs();
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initLogs();
    }
  }
};
</script>

<style>
</style>
