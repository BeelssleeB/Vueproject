<template>
  <div style="width:80%;">
    <div style="margin-top:20px;display:flex;
  justify-content: space-between;">
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
      <el-table :data="roles" stripe border style="width: 100%" height="400">
        <el-table-column prop="id" label="ID" align="center" width="150"></el-table-column>
        <el-table-column prop="name" label="角色英文名" align="left" width="250"></el-table-column>
        <el-table-column prop="nameCh" label="角色中文名" align="left" width="200"></el-table-column>
        <el-table-column prop="createTime" width="250" align="left" label="创建时间"></el-table-column>
        <el-table-column prop="modifyTime" width="250" align="left" label="修改时间"></el-table-column>
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
          :page-size="4"
        ></el-pagination>
      </div>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
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

          <el-form-item label="角色权限:" label-width="85px">
            <div class="ztree">
              <el-tree
                :data="menus"
                show-checkbox
                highlight-current
                ref="tree"
                default-expand-all
                node-key="id"
                :props="defaultProps"
                :default-checked-keys="[]"
              ></el-tree>
            </div>
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
      showFlag: false,
      keyWord: "",
      roles: [],
      menus: [],
      role: {},
      page: 1,
      size: 4,
      total: 0,
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: "请输入角色英文名", trigger: "blur" }
        ],
        nameCh: [
          { required: true, message: "请输入角色中文名", trigger: "blur" }
        ]
      },
      defaultProps: {
        children: "children",
        label: "nameCh",
        id: "id"
      }
    };
  },
  mounted() {
    this.initRoles();
    this.allMenus();
  },
  methods: {
    showAddRole() {
      this.title = "新建角色信息";
      this.showFlag = false;
      this.role = {};
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys([]);
      }, 100);
      this.dialogVisible = true;
    },
    allMenus() {
      this.getRequest("/sys/role/getallmenus").then(resp => {
        if (resp) {
          this.menus = resp;
        }
      });
    },
    initRoles() {
      this.getRequest(
        "/sys/role/?keyword=" +
          this.keyWord +
          "&page=" +
          this.page +
          "&size=" +
          this.size
      ).then(resp => {
        if (resp) {
          this.roles = resp.data;
          this.total = resp.total;
        }
      });
    },
    showEditRole(data) {
      this.title = "编辑角色信息";
      this.showFlag = true;
      this.role = data;
      this.getRequest("/sys/role/getmenubyroleid/" + data.id).then(resp => {
        if (resp) {
          this.$refs.tree.setCheckedKeys(resp);
        }
      });
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
          this.deleteRequest("/sys/role/deleterole/" + data.id).then(resp => {
            if (resp) {
              this.initRoles();
            }
          });
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
          this.role.menu = this.$refs.tree.getCheckedNodes();
          if (this.showFlag) {
            this.putRequest("/sys/role/updaterole", this.role).then(resp => {
              if (resp.status === 200) {
                this.dialogVisible = false;
                this.initRoles();
              }
            });
          } else {
            this.postRequest("/sys/role/saverole", this.role).then(resp => {
              if (resp.status === 200) {
                this.dialogVisible = false;
                this.initRoles();
              }
            });
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

.ztree {
  margin-top: 10px;
  padding: 5px;
  border: 2px solid #525151;
  background: #ffffff;
  width: 250px;
  height: 350px;
  overflow-y: scroll;
  overflow-x: auto;
}
</style>