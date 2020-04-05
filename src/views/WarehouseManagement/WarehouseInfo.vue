<template>
  <div style="width:80%;">
    <div style="margin-top:20px;display:flex;
  justify-content: space-between;">
      <div>
        <el-input
          placeholder="请输入库房名称搜索"
          prefix-icon="el-icon-search"
          clearable
          @clear="initWares"
          style="width: 350px;margin-right: 10px"
          v-model="keyWord"
          @keydown.enter.native="initWares"
        ></el-input>
        <span>类型:</span>
        <el-select v-model="typeId" placeholder="请选择..">
          <el-option
            v-for="item in types"
            :key="item.id"
            :label="item.warehouseType"
            :value="item.id"
            @change="initWares"
          ></el-option>
        </el-select>

        <el-button icon="el-icon-search" type="primary" @click="initWares">搜索</el-button>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="showAddWare">添加库房</el-button>
      </div>
    </div>

    <div style="margin-top: 20px">
      <el-table :data="infos" stripe border style="width: 100%" height="400">
        <el-table-column prop="id" label="ID" align="center" width="150"></el-table-column>
        <el-table-column prop="treasureCode" label="库房编码" align="left" width="250"></el-table-column>
        <el-table-column prop="warehouseName" label="库房名称" align="left" width="200"></el-table-column>
        <el-table-column
          prop="warehouseTypeClass.warehouseType"
          width="250"
          align="left"
          label="库房类型"
        ></el-table-column>
        <el-table-column prop="node" width="250" align="left" label="节点"></el-table-column>
        <el-table-column prop="note" width="250" align="left" label="备注"></el-table-column>
        <el-table-column width="200" label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditWare(scope.row)" size="medium" type="primary">编辑</el-button>
            <el-button @click="deleteWare(scope.row)" size="medium" type="danger">删除</el-button>
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

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
      <div v-if="info">
        <el-form :model="info" ref="message" :rules="rules">
          <el-form-item label="库房编码:" prop="treasureCode">
            <el-input type="text" placeholder="请输入库房编码" v-model="info.treasureCode" autofocus></el-input>
          </el-form-item>

          <el-form-item label="库房名称:" prop="warehouseName">
            <el-input type="text" placeholder="请输入库房名称" v-model="info.warehouseName" autofocus></el-input>
          </el-form-item>

          <el-form-item label="库房类型:">
            <el-select v-model="info.warehouseType" placeholder="请选择">
              <el-option
                v-for="item in types"
                :key="item.id"
                :label="item.warehouseType"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="备注:" prop="note">
            <el-input type="text" placeholder="请输入备注" v-model="info.note" autofocus></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateRoleInfo">确 定</el-button>
            <el-button type="info" plain @click="dialogVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "WarehouseInfo",
  data() {
    return {
      title: "",
      typeId: 0,
      showFlag: false,
      keyWord: "",
      infos: [],
      types: [],
      info: {},
      page: 1,
      size: 4,
      total: 0,
      dialogVisible: false,
      rules: {
        treasureCode: [
          { required: true, message: "请输入库房编码", trigger: "blur" }
        ],
        warehouseName: [
          { required: true, message: "请输入库房名称", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.initWares();
    this.allTypes();
  },
  methods: {
    showAddWare() {
      this.title = "新建库房信息";
      this.showFlag = false;
      this.info = {};
      this.dialogVisible = true;
    },
    allTypes() {
      this.getRequest("/warehouse/info/getalltypes").then(resp => {
        if (resp) {
          this.types = resp;
        }
      });
    },
    initWares() {
      this.getRequest(
        "/warehouse/info/?keyword=" +
          this.keyWord +
          "&page=" +
          this.page +
          "&size=" +
          this.size +
          "&typeId=" +
          this.typeId
      ).then(resp => {
        if (resp) {
          this.infos = resp.data;
          this.total = resp.total;
        }
      });
    },
    showEditRole(data) {
      this.title = "编辑库房信息";
      this.showFlag = true;
      this.info = data;
      this.dialogVisible = true;
    },
    deleteRole(data) {
      this.$confirm(
        "此操作将永久删除库房【" + data.warehouseName + "】, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.deleteRequest("/warehouse/info/deleteware/" + data.id).then(
            resp => {
              if (resp) {
                this.initWares();
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
    updateRoleInfo() {
      this.$refs.message.validate(valid => {
        if (valid) {
          if (this.showFlag) {
            this.putRequest("/warehouse/info/updateware", this.info).then(
              resp => {
                if (resp.status === 200) {
                  this.dialogVisible = false;
                  this.initWares();
                }
              }
            );
          } else {
            this.postRequest("/warehouse/info/saveware", this.info).then(
              resp => {
                if (resp.status === 200) {
                  this.dialogVisible = false;
                  this.initWares();
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
      this.initRoles();
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initRoles();
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