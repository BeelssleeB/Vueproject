<template>
  <div>
    <div style="margin-top:20px;display:flex;
  justify-content: space-between;">
      <div>
        <el-input
          placeholder="请输入工单名称搜索"
          prefix-icon="el-icon-search"
          clearable
          @clear="initWorksheets"
          style="width: 350px;margin-right: 10px"
          v-model="keyWord"
          @keydown.enter.native="initWorksheets"
        ></el-input>
        <el-button icon="el-icon-search" type="primary" @click="initWorksheets">搜索</el-button>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="createWorksheets">新建工单</el-button>
      </div>
    </div>

    <div style="margin-top: 20px">
      <el-table :data="worksheets" stripe border style="width: 100%" height="600">
        <el-table-column prop="id" label="ID" align="center" width="100"></el-table-column>
        <el-table-column prop="user.userName" label="创建人" align="left" width="100"></el-table-column>
        <el-table-column prop="worksheetName" label="工单名称" align="left" width="200"></el-table-column>
        <el-table-column prop="worksheetValue" width="150" align="left" label="工单产值"></el-table-column>
        <el-table-column
          prop="worksheetTypeName.worksheetType"
          label="工单类型"
          align="left"
          width="100"
        ></el-table-column>
        <el-table-column prop="toolInfoList" width="250" label="所用工具">
          <template slot-scope="scope">
            <el-tag
              type="success"
              style="margin-right: 2px"
              v-for="(tool,index) in scope.row.toolInfoList"
              :key="index"
            >{{tool.toolName+tool.unit}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="vehicleInfoList" width="250" label="所用车辆">
          <template slot-scope="scope">
            <el-tag
              type="success"
              style="margin-right: 2px"
              v-for="(vehicle,index) in scope.row.vehicleInfoList"
              :key="index"
            >{{vehicle.vehicleName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="note" width="150" align="left" show-overflow-tooltip label="备注"></el-table-column>
        <el-table-column prop="beginTime" width="120" align="left" label="开始时间"></el-table-column>
        <el-table-column prop="endTime" width="120" align="left" label="结束时间"></el-table-column>
        <el-table-column prop="worksheetStatus" width="200" label="工单状态">
          <template slot-scope="scope">
            <el-switch
              disabled
              v-model="scope.row.worksheetStatus"
              active-text="正在进行..."
              inactive-text="已结束"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column width="450" label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.worksheetStatus==0">
              <el-button disabled size="medium" type="primary">工单已结束</el-button>
            </div>
            <div v-else>
              <el-button @click="addTool(scope.row)" size="medium" type="primary">添加工具</el-button>
              <el-button @click="addVehicle(scope.row)" size="medium" type="primary">添加车辆</el-button>
              <el-button @click="editWorksheet(scope.row)" size="medium" type="primary">修改工单</el-button>
              <el-button @click="finishWorksheet(scope.row)" size="medium" type="danger">结束工单</el-button>
            </div>
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
          :page-sizes="[2, 4, 6, 8]"
          :page-size="4"
        ></el-pagination>
      </div>
    </div>

    <el-dialog title="编辑工单信息" :visible.sync="editDialogVisible" width="30%">
      <div v-if="worksheet">
        <el-form :model="worksheet" ref="message" :rules="rules">
          <el-form-item label="工单名称:" prop="worksheetName">
            <el-input type="text" placeholder="请输入工单名称" v-model="worksheet.worksheetName" autofocus></el-input>
          </el-form-item>
          <el-form-item label="工单类型:">
            <el-select v-model="worksheet.worksheetType" placeholder="请选择">
              <el-option
                v-for="item in worksheetTypes"
                :key="item.id"
                :label="item.worksheetType"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input type="text" placeholder="请输入备注" v-model="worksheet.note" autofocus></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateWorksheetInfo">确 定</el-button>
            <el-button type="info" plain @click="editDialogVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "WorksheetInformation",
  data() {
    return {
      keyWord: "",
      worksheets: [],
      worksheetTypes: [],
      worksheet: {},
      page: 1,
      size: 4,
      total: 0,
      editDialogVisible: false,
      rules: {
        worksheetName: [
          { required: true, message: "请输入工单名称", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.initWorksheets();
    this.allTypes();
  },
  methods: {
    allTypes() {
      this.getRequest("/worksheet/info/getalltypes").then(resp => {
        if (resp) {
          this.worksheetTypes = resp;
        }
      });
    },
    initWorksheets() {
      this.getRequest(
        "/worksheet/info/?keyword=" +
          this.keyWord +
          "&page=" +
          this.page +
          "&size=" +
          this.size
      ).then(resp => {
        if (resp) {
          this.worksheets = resp.data;
          this.total = resp.total;
        }
      });
    },
    editWorksheet(data) {
      this.worksheet = data;
      this.editDialogVisible = true;
    },
    updateWorksheetInfo() {
      this.$refs.message.validate(valid => {
        if (valid) {
          this.putRequest(
            "/worksheet/info/updateworksheet",
            this.worksheet
          ).then(resp => {
            if (resp.status === 200) {
              this.editDialogVisible = false;
              this.initWorksheets();
            }
          });
        } else {
          return false;
        }
      });
    },
    createWorksheets() {
      //新建工单
    },
    addTool(data) {},
    addVehicle(data) {},
    finishWorksheet(data) {
      this.$confirm(
        "此操作将结束工单【" + data.worksheetName + "】, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.deleteRequest("/worksheet/info/finishworksheet/" + data.id).then(
            resp => {
              if (resp) {
                this.initWorksheets();
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initWorksheets();
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initWorksheets();
    }
  }
};
</script>

<style>
.el-form-item__content {
  display: flex;
  justify-content: flex-start;
}
</style>
