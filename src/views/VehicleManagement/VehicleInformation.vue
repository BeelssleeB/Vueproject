<template>
  <div>
    <div style="margin-top:20px;display:flex;
  justify-content: space-between;">
      <div>
        <el-input
          placeholder="请输入车辆名称搜索"
          prefix-icon="el-icon-search"
          clearable
          @clear="initVehicles"
          style="width: 350px;margin-right: 10px"
          v-model="keyWord"
          @keydown.enter.native="initVehicles"
        ></el-input>
        <el-button icon="el-icon-search" type="primary" @click="initVehicles">搜索</el-button>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="showAddVehicle">添加车辆</el-button>
      </div>
    </div>

    <div style="margin-top: 20px">
      <el-table :data="vehicles" stripe border style="width: 100%" height="450">
        <el-table-column prop="id" label="ID" align="center" width="150"></el-table-column>
        <el-table-column prop="vehicleCode" label="车辆编码" align="left" width="150"></el-table-column>
        <el-table-column prop="vehicleName" label="车辆名称" align="left" width="200"></el-table-column>
        <el-table-column prop="warehouseInfo.warehouseName" width="200" align="left" label="所在库房名"></el-table-column>
        <el-table-column prop="note" width="250" align="left" show-overflow-tooltip label="备注"></el-table-column>
        <el-table-column prop="createTime" width="210" align="left" label="创建时间"></el-table-column>
        <el-table-column prop="modifyTime" width="210" align="left" label="修改时间"></el-table-column>
        <el-table-column width="250" label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditVehicle(scope.row)" size="medium" type="primary">编辑</el-button>
            <el-button @click="deleteVehicle(scope.row)" size="medium" type="danger">删除</el-button>
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

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
      <div v-if="vehicle">
        <el-form :model="vehicle" ref="message" :rules="rules">
          <el-form-item label="车辆编码:" prop="vehicleCode">
            <el-input type="text" placeholder="请输入车辆编码" v-model="vehicle.vehicleCode" autofocus></el-input>
          </el-form-item>

          <el-form-item label="车辆名称:" prop="vehicleName">
            <el-input type="text" placeholder="请输入车辆名称" v-model="vehicle.vehicleName" autofocus></el-input>
          </el-form-item>

          <el-form-item label="所在库房:">
            <el-select v-model="vehicle.vehicleLocation" placeholder="请选择">
              <el-option
                v-for="item in locations"
                :key="item.id"
                :label="item.warehouseName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="备注:">
            <el-input type="text" placeholder="请输入备注" v-model="vehicle.note" autofocus></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateVehicleInfo">确 定</el-button>
            <el-button type="info" plain @click="dialogVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "VehicleInformation",
  data() {
    return {
      title: "",
      showFlag: false,
      keyWord: "",
      vehicles: [],
      locations: [],
      vehicle: {},
      page: 1,
      size: 6,
      total: 0,
      dialogVisible: false,
      rules: {
        vehicleCode: [
          { required: true, message: "请输入车辆编码", trigger: "blur" }
        ],
        vehicleName: [
          { required: true, message: "请输入车辆名称", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.initVehicles();
    this.allLocations();
  },
  methods: {
    showAddVehicle() {
      this.title = "新建车辆信息";
      this.showFlag = false;
      this.vehicle = {};
      this.dialogVisible = true;
    },
    allLocations() {
      this.getRequest("/vehicle/info/getalllocations").then(resp => {
        if (resp) {
          this.locations = resp;
        }
      });
    },
    initVehicles() {
      this.getRequest(
        "/vehicle/info/?keyword=" +
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
    showEditVehicle(data) {
      this.title = "编辑车辆信息";
      this.showFlag = true;
      this.vehicle = data;
      this.dialogVisible = true;
    },
    deleteVehicle(data) {
      this.$confirm(
        "此操作将永久删除车辆【" + data.vehicleName + "】, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.deleteRequest("/vehicle/info/deletevehicle/" + data.id).then(
            resp => {
              if (resp) {
                this.initVehicles();
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
    updateVehicleInfo() {
      if (!this.vehicle.vehicleLocation) {
        this.$message({
          message: "请选择一个库房",
          type: "warning"
        });
        return false;
      }
      this.$refs.message.validate(valid => {
        if (valid) {
          if (this.showFlag) {
            this.putRequest("/vehicle/info/updatevehicle", this.vehicle).then(
              resp => {
                if (resp.status === 200) {
                  this.dialogVisible = false;
                  this.initVehicles();
                }
              }
            );
          } else {
            this.postRequest("/vehicle/info/savevehicle", this.vehicle).then(
              resp => {
                if (resp.status === 200) {
                  this.dialogVisible = false;
                  this.initVehicles();
                }
              }
            );
          }
        } else {
          return false;
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

<style>
.el-form-item__content {
  display: flex;
  justify-content: flex-start;
}
</style>
