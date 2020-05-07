<template>
  <div>
    <div style="margin-top:20px;display:flex;
  justify-content: space-between;">
      <div>
        <el-input
          placeholder="请输入工具名称搜索"
          prefix-icon="el-icon-search"
          clearable
          @clear="initTools"
          style="width: 350px;margin-right: 10px"
          v-model="keyWord"
          @keydown.enter.native="initTools"
        ></el-input>
        <el-button icon="el-icon-search" type="primary" @click="initTools">搜索</el-button>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="showAddTool">添加工具</el-button>
      </div>
    </div>

    <div style="margin-top: 20px">
      <el-table :data="tools" stripe border style="width: 100%" height="450">
        <el-table-column prop="id" label="ID" align="center" width="100"></el-table-column>
        <el-table-column prop="toolCode" label="工具编码" align="left" width="100"></el-table-column>
        <el-table-column prop="toolName" label="工具名称" align="left" width="250"></el-table-column>
        <el-table-column prop="toolTypeName.toolType" width="150" align="left" label="工具类型"></el-table-column>
        <el-table-column prop="toolLocation" label="工具位置" align="left" width="150"></el-table-column>
        <el-table-column prop="unit" label="工具单位" align="left" width="150"></el-table-column>
        <el-table-column prop="useTime" label="使用次数" align="left" width="80"></el-table-column>
        <el-table-column prop="note" width="150" align="left" show-overflow-tooltip label="备注"></el-table-column>
        <el-table-column prop="createTime" width="120" align="left" label="创建时间"></el-table-column>
        <el-table-column prop="modifyTime" width="120" align="left" label="修改时间"></el-table-column>
        <el-table-column width="250" label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditTool(scope.row)" size="medium" type="primary">编辑</el-button>
            <el-button @click="deleteTool(scope.row)" size="medium" type="danger">删除</el-button>
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
      <div v-if="tool">
        <el-form :model="tool" ref="message" :rules="rules">
          <el-form-item label="工具编码:" prop="toolCode">
            <el-input type="text" placeholder="请输入工具编码" v-model="tool.toolCode" autofocus></el-input>
          </el-form-item>

          <el-form-item label="工具名称:" prop="toolName">
            <el-input type="text" placeholder="请输入工具名称" v-model="tool.toolName" autofocus></el-input>
          </el-form-item>

          <el-form-item label="工具类型:">
            <el-select v-model="tool.toolType" placeholder="请选择">
              <el-option
                v-for="item in types"
                :key="item.id"
                :label="item.toolType"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="工具位置:" prop="toolLocation">
            <el-input type="text" placeholder="请输入工具位置" v-model="tool.toolLocation" autofocus></el-input>
          </el-form-item>

          <el-form-item label="工具单位:" prop="unit">
            <el-input type="text" placeholder="请输入工具单位" v-model="tool.unit" autofocus></el-input>
          </el-form-item>

          <el-form-item label="备注:">
            <el-input type="text" placeholder="请输入备注" v-model="tool.note" autofocus></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updateToolInfo">确 定</el-button>
            <el-button type="info" plain @click="dialogVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ToolType",
  data() {
    return {
      title: "",
      showFlag: false,
      keyWord: "",
      tools: [],
      types: [],
      tool: {},
      page: 1,
      size: 6,
      total: 0,
      dialogVisible: false,
      rules: {
        toolCode: [
          { required: true, message: "请输入工具编码", trigger: "blur" }
        ],
        toolName: [
          { required: true, message: "请输入工具名称", trigger: "blur" }
        ],
        toolLocation: [
          { required: true, message: "请输入工具位置", trigger: "blur" }
        ],
        unit: [
          { required: true, message: "请输入工具单位", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.initTools();
    this.allTypes();
  },
  methods: {
    showAddTool() {
      this.title = "新建工具信息";
      this.showFlag = false;
      this.tool = {};
      this.dialogVisible = true;
    },
    allTypes() {
      this.getRequest("/tool/type/getalltypes").then(resp => {
        if (resp) {
          this.types = resp;
        }
      });
    },
    initTools() {
      this.getRequest(
        "/tool/type/?keyword=" +
          this.keyWord +
          "&page=" +
          this.page +
          "&size=" +
          this.size
      ).then(resp => {
        if (resp) {
          this.tools = resp.data;
          this.total = resp.total;
        }
      });
    },
    showEditTool(data) {
      this.title = "编辑工具信息";
      this.showFlag = true;
      this.tool = data;
      this.dialogVisible = true;
    },
    deleteTool(data) {
      this.$confirm(
        "此操作将永久删除工具【" + data.toolName + "】, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.deleteRequest("/tool/type/deletetool/" + data.id).then(
            resp => {
              if (resp) {
                this.initTools();
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
    updateToolInfo() {
      if (!this.tool.toolType) {
        this.$message({
          message: "请选择一个类型",
          type: "warning"
        });
        return false;
      }
      this.$refs.message.validate(valid => {
        if (valid) {
          if (this.showFlag) {
            this.putRequest("/tool/type/updatetool", this.tool).then(
              resp => {
                if (resp.status === 200) {
                  this.dialogVisible = false;
                  this.initTools();
                }
              }
            );
          } else {
            this.postRequest("/tool/type/savetool", this.tool).then(
              resp => {
                if (resp.status === 200) {
                  this.dialogVisible = false;
                  this.initTools();
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
      this.initTools();
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initTools();
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
