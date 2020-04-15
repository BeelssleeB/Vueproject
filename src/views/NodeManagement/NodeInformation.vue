<template>
  <div>
    <div style="margin-top:20px;display:flex;
  justify-content: space-between;">
      <div>
        <el-input
          placeholder="请输入节点名称搜索"
          prefix-icon="el-icon-search"
          clearable
          @clear="initNodes"
          style="width: 350px;margin-right: 10px"
          v-model="keyWord"
          @keydown.enter.native="initNodes"
        ></el-input>
        <el-button icon="el-icon-search" type="primary" @click="initNodes">搜索</el-button>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="showAddNode">添加节点</el-button>
      </div>
    </div>

    <div style="margin-top: 20px">
      <el-table :data="nodes" stripe border style="width: 100%" height="400">
        <el-table-column prop="id" label="ID" align="center" width="150"></el-table-column>
        <el-table-column prop="code" label="节点编码" align="left" width="150"></el-table-column>
        <el-table-column prop="name" label="节点名称" align="left" width="150"></el-table-column>
        <el-table-column prop="user.name" width="150" align="left" label="负责人"></el-table-column>
        <el-table-column prop="user.phone" width="150" align="left" label="负责人电话"></el-table-column>
        <el-table-column prop="address" width="200" align="left" show-overflow-tooltip label="节点地址"></el-table-column>
        <el-table-column prop="note" width="150" align="left" show-overflow-tooltip label="备注"></el-table-column>
        <el-table-column prop="createTime" width="150" align="left" label="创建时间"></el-table-column>
        <el-table-column prop="modifyTime" width="150" align="left" label="修改时间"></el-table-column>
        <el-table-column width="250" label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditNode(scope.row)" size="medium" type="primary">编辑</el-button>
            <el-button @click="deleteNode(scope.row)" size="medium" type="danger">删除</el-button>
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
      <div v-if="node">
        <el-form :model="node" ref="message" :rules="rules">
          <el-form-item label="节点编码:" prop="code">
            <el-input type="text" placeholder="请输入节点编码" v-model="node.code" autofocus></el-input>
          </el-form-item>

          <el-form-item label="节点名称:" prop="nodeName">
            <el-input type="text" placeholder="请输入节点名称" v-model="node.name" autofocus></el-input>
          </el-form-item>

          <el-form-item label="负责人:">
            <el-select v-model="node.principal" placeholder="请选择">
              <el-option
                v-for="item in principals"
                :key="item.id"
                :label="item.name"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="地址:" prop="address">
            <el-input type="text" placeholder="请输入地址" v-model="node.address" autofocus></el-input>
          </el-form-item>

          <el-form-item label="备注:">
            <el-input type="text" placeholder="请输入备注" v-model="node.note" autofocus></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateNodeInfo">确 定</el-button>
            <el-button type="info" plain @click="dialogVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "NodeInformation",
  data() {
    return {
      title: "",
      showFlag: false,
      keyWord: "",
      nodes: [],
      principals: [],
      node: {},
      page: 1,
      size: 4,
      total: 0,
      dialogVisible: false,
      rules: {
        code: [
          { required: true, message: "请输入节点编码", trigger: "blur" }
        ],
        nodeName: [
          { required: true, message: "请输入节点名称", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入节点地址", trigger: "blur" }
        ],
      }
    };
  },
  mounted() {
    this.initNodes();
    this.allPrincipals();
  },
  methods: {
    showAddNode() {
      this.title = "新建节点信息";
      this.showFlag = false;
      this.node = {};
      this.dialogVisible = true;
    },
    allPrincipals() {
      this.getRequest("/node/info/getallprincipals").then(resp => {
        if (resp) {
          this.principals = resp.data;
        }
      });
    },
    initNodes() {
      this.getRequest(
        "/node/info/?keyword=" +
          this.keyWord +
          "&page=" +
          this.page +
          "&size=" +
          this.size
      ).then(resp => {
        if (resp) {
          this.nodes = resp.data;
          this.total = resp.total;
        }
      });
    },
    showEditNode(data) {
      this.title = "编辑节点信息";
      this.showFlag = true;
      this.node = data;
      this.dialogVisible = true;
    },
    deleteNode(data) {
      this.$confirm(
        "此操作将永久删除节点【" + data.name + "】, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.deleteRequest("/node/info/deleteNode/" + data.id).then(
            resp => {
              if (resp) {
                this.initNodes();
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
    updateNodeInfo() {
      if (!this.node.principal) {
        this.$message({
          message: "请选择一个负责人",
          type: "warning"
        });
        return false;
      }
      this.$refs.message.validate(valid => {
        if (valid) {
          if (this.showFlag) {
            this.putRequest("/node/info/updateNode", this.node).then(
              resp => {
                if (resp.status === 200) {
                  this.dialogVisible = false;
                  this.initNodes();
                }
              }
            );
          } else {
            this.postRequest("/node/info/saveNode", this.node).then(
              resp => {
                if (resp.status === 200) {
                  this.dialogVisible = false;
                  this.initNodes();
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
      this.initNodes();
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initNodes();
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