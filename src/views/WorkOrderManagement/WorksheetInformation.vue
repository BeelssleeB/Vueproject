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

    <el-dialog title="添加工具" :visible.sync="addToolDialogVisible" width="20%">
      <div class="ztree">
        <el-checkbox-group v-model="selectedTools">
          <span v-for="(item,index) in allTools" :key="index">
            <el-checkbox
              style="width:145px;margin:5px;"
              v-if="item.useTime<=5"
              :label="item.id"
            >{{item.toolName+"(推荐)"}}</el-checkbox>
            <el-checkbox
              style="width:145px;margin:5px;"
              v-else
              :label="item.id"
            >{{item.toolName+"(不推荐)"}}</el-checkbox>
          </span>
        </el-checkbox-group>
      </div>
      <div class="btn">
        <el-button size="medium" type="primary" @click="addToolItem">确 定</el-button>
        <el-button size="medium" type="info" plain @click="addToolDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加车辆" :visible.sync="addVehicleDialogVisible" width="20%">
      <div class="ztree">
        <el-checkbox-group v-model="selectedVehicles">
          <el-checkbox
            style="width:120px;margin:5px;"
            v-for="(item,index) in allVehicles"
            :label="item.id"
            :key="index"
          >{{item.vehicleName}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="btn">
        <el-button size="medium" type="primary" @click="addVehicleItem">确 定</el-button>
        <el-button size="medium" type="info" plain @click="addVehicleDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新建工单" :visible.sync="worksheetDialogVisible" width="30%">
      <div v-if="worksheet">
        <el-form :model="worksheet" ref="table" :rules="rules">
          <el-form-item label="工单名称:" prop="worksheetName">
            <el-input type="text" placeholder="请输入工单名称" v-model="worksheet.worksheetName" autofocus></el-input>
          </el-form-item>

          <el-form-item label="产值:" prop="worksheetValue">
            <el-input type="text" placeholder="请输入产值" v-model="worksheet.worksheetValue" autofocus></el-input>
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

          <el-form-item label="添加所用工具:">
            <div class="ztree">
              <el-checkbox-group v-model="selectedTools">
                <span v-for="(item,index) in allTools" :key="index">
                  <el-checkbox
                    style="width:145px;margin:5px;"
                    v-if="item.useTime<=5"
                    :label="item.id"
                  >{{item.toolName+"(推荐)"}}</el-checkbox>
                  <el-checkbox
                    style="width:145px;margin:5px;"
                    v-else
                    :label="item.id"
                  >{{item.toolName+"(不推荐)"}}</el-checkbox>
                </span>
              </el-checkbox-group>
            </div>
          </el-form-item>

          <el-form-item label="添加所用车辆:">
            <div class="ztree">
              <el-checkbox-group v-model="selectedVehicles">
                <el-checkbox
                  style="width:120px;margin:5px;"
                  v-for="(item,index) in allVehicles"
                  :label="item.id"
                  :key="index"
                >{{item.vehicleName}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>

          <el-form-item label="备注:">
            <el-input type="text" placeholder="请输入备注" v-model="worksheet.note" autofocus></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="createWorksheetInfo">确 定</el-button>
            <el-button type="info" plain @click="worksheetDialogVisible = false">取 消</el-button>
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
      selectedTools: [],
      allTools: [],
      selectedVehicles: [],
      allVehicles: [],
      title: "",
      page: 1,
      size: 4,
      total: 0,
      editDialogVisible: false,
      addToolDialogVisible: false,
      addVehicleDialogVisible: false,
      worksheetDialogVisible: false,
      rules: {
        worksheetName: [
          { required: true, message: "请输入工单名称", trigger: "blur" }
        ],
        worksheetValue: [
          { required: true, message: "请输入工单产值", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.initWorksheets();
    this.allTypes();
    this.allTool();
    this.allVehicle();
  },
  methods: {
    allTypes() {
      this.getRequest("/worksheet/info/getalltypes").then(resp => {
        if (resp) {
          this.worksheetTypes = resp;
        }
      });
    },
    allTool() {
      this.getRequest("/worksheet/info/getalltools").then(resp => {
        if (resp) {
          this.allTools = resp;
        }
      });
    },
    allVehicle() {
      this.getRequest("/worksheet/info/getallvehicles").then(resp => {
        if (resp) {
          this.allVehicles = resp;
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
      this.selectedTools = [];
      this.selectedVehicles = [];
      this.worksheet = {};
      this.worksheetDialogVisible = true;
    },
    addTool(data) {
      this.selectedTools = [];
      this.worksheet = data;
      this.addToolDialogVisible = true;
    },
    addVehicle(data) {
      this.selectedVehicles = [];
      this.worksheet = data;
      this.addVehicleDialogVisible = true;
    },
    createWorksheetInfo() {
      if (!this.worksheet.worksheetType) {
        this.$message({
          message: "请选择一个工单类型",
          type: "warning"
        });
        return false;
      }
      this.$refs.table.validate(valid => {
        if (valid) {
          let temp = [];
          for (let i = 0; i < this.selectedTools.length; i++) {
            let ob = {
              id: this.selectedTools[i]
            };
            temp.push(ob);
          }
          this.worksheet.toolInfoList = temp;
          let temp1 = [];
          for (let i = 0; i < this.selectedVehicles.length; i++) {
            let ob1 = {
              id: this.selectedVehicles[i]
            };
            temp1.push(ob1);
          }
          this.worksheet.vehicleInfoList = temp1;
          this.postRequest(
            "/worksheet/info/saveworksheet",
            this.worksheet
          ).then(resp => {
            if (resp.status === 200) {
              this.worksheetDialogVisible = false;
              this.initWorksheets();
              this.allTool();
              this.allVehicle();
            }
          });
        } else {
          return false;
        }
      });
    },
    addToolItem() {
      if (this.selectedTools.length < 1) {
        this.$message({
          message: "请至少选择一个工具",
          type: "warning"
        });
        return false;
      }
      let temp = [];
      for (let i = 0; i < this.selectedTools.length; i++) {
        let ob = {
          id: this.selectedTools[i]
        };
        temp.push(ob);
      }
      this.worksheet.toolInfoList = temp;
      this.putRequest("/worksheet/info/updatetool", this.worksheet)
        .then(resp => {
          if (resp.status === 200) {
            this.addToolDialogVisible = false;
            this.initWorksheets();
            this.allTool();
          }
        })
        .catch(failResponse => {});
    },

    addVehicleItem() {
      if (this.selectedVehicles.length < 1) {
        this.$message({
          message: "请至少选择一个车辆",
          type: "warning"
        });
        return false;
      }
      let temp = [];
      for (let i = 0; i < this.selectedVehicles.length; i++) {
        let ob = {
          id: this.selectedVehicles[i]
        };
        temp.push(ob);
      }
      this.worksheet.vehicleInfoList = temp;
      this.putRequest("/worksheet/info/updatevehicle", this.worksheet)
        .then(resp => {
          if (resp.status === 200) {
            this.addVehicleDialogVisible = false;
            this.initWorksheets();
            this.allVehicle();
          }
        })
        .catch(failResponse => {});
    },

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

.ztree {
  padding: 5px;
  border: 2px solid #525151;
  background: #ffffff;
  width: 90%;
  height: 350px;
  overflow-y: scroll;
  overflow-x: auto;
}

.btn {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
