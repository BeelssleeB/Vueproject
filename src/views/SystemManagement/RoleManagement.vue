<template>
  <div>
    <div style="margin-top:20px;">
      <div>
        <el-input
          placeholder="请输入角色名搜索"
          prefix-icon="el-icon-search"
          clearable
          @clear="initRoles"
          style="width: 350px;margin-right: 10px"
          v-model="keyWord"
          @keydown.enter.native="initRoles"
        ></el-input>
        <el-button icon="el-icon-search" type="primary" @click="initRoles">搜索</el-button>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="showAddRole">添加角色</el-button>
      </div>
    </div>

    <div style="margin-top: 20px">
      <el-table :data="roles" stripe border style="width: 100%" height="500">
        <el-table-column prop="id" label="ID" align="center" width="110"></el-table-column>
        <el-table-column prop="name" label="角色英文名" align="left" width="150"></el-table-column>
        <el-table-column prop="nameCh" label="角色中文名" align="left" width="100"></el-table-column>
        <el-table-column prop="createTime" width="150" align="left" label="创建时间"></el-table-column>
        <el-table-column prop="modifyTime" width="150" align="left" label="修改时间"></el-table-column>
        <el-table-column width="200" label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditRole(scope.row)" size="medium" type="primary">编辑</el-button>
            <el-button @click="deleteRole(scope.row)" size="medium" type="danger">删除</el-button>
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
          :page-size="2"
        ></el-pagination>
      </div>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="28%">
      <div v-if="role">
        <el-form :model="role" ref="info" :rules="rules">
          <el-form-item label="角色英文名:" prop="name">
            <el-input
              type="text"
              maxlength="20"
              show-word-limit
              placeholder="请输入角色英文名"
              v-model="role.name"
              autofocus
            ></el-input>
          </el-form-item>

          <el-form-item label="角色中文名:" prop="nameCh">
            <el-input
              type="text"
              maxlength="20"
              show-word-limit
              placeholder="请输入角色中文名"
              v-model="role.nameCh"
              autofocus
            ></el-input>
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
  name: "RoleManagement",
  data() {
    return {
      title: "",
      keyWord: "",
      roles: [],
      role: null,
      page: 1,
      size: 2,
      total: 0,
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: "请输入角色英文名", trigger: "blur" }
        ],
        nameCh: [
          { required: true, message: "请输入角色中文名", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.initRoles();
  },
  methods: {
    showAddRole() {},
    initRoles() {
      //   this.getRequest("/sys/role/?keyword=" + this.keyWord).then(resp => {
      //     if (resp) {
      //       this.roles = resp.data;
      //       this.total = resp.total;
      //     }
      //   });
    },
    showEditRole(data) {
      this.title = "编辑角色信息";
      this.role = data;
      this.dialogVisible = true;
    },
    deleteRole(data) {
      this.$confirm(
        "此操作将永久删除用户名【" + data.nameCh + "】, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          //   this.deleteRequest("/sys/role/deleterole/" + data.id).then(
          //     resp => {
          //       if (resp) {
          //         this.initRoles();
          //       }
          //     }
          //   );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    updateRoleInfo() {
      this.$refs.info.validate(valid => {
        if (valid) {
          //   this.putRequest("/sys/role/updaterole", this.role).then(resp => {
          //     if (resp.status === 200) {
          //       this.dialogVisible = false;
          //       this.initRoles();
          //     }
          //   });
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

<style scoped>
.el-form-item__content {
  display: flex;
  justify-content: flex-start;
}
</style>