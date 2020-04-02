<template>
  <div>
    <div style="margin-top:20px;">
      <div>
        <el-input
          placeholder="请输入姓名搜索"
          prefix-icon="el-icon-search"
          clearable
          @clear="initUsers"
          style="width: 350px;margin-right: 10px"
          v-model="keyWord"
          @keydown.enter.native="initUsers"
        ></el-input>
        <el-button icon="el-icon-search" type="primary" @click="initUsers">搜索</el-button>
      </div>
      <!-- <div>
        <el-button type="primary" icon="el-icon-plus" @click="showAddUser">添加用户</el-button>
      </div>-->
    </div>

    <div style="margin-top: 20px">
      <el-table :data="users" stripe border style="width: 100%" height="500">
        <el-table-column prop="userId" label="ID" align="center" width="110"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="150"></el-table-column>
        <el-table-column prop="name" label="姓名" align="left" width="150"></el-table-column>
        <el-table-column prop="userSex" label="性别" align="left" width="100"></el-table-column>
        <el-table-column prop="phone" width="150" align="left" label="电话号码"></el-table-column>
        <el-table-column prop="birthday" width="150" align="left" label="生日日期"></el-table-column>
        <el-table-column prop="role" width="250" label="用户角色">
          <template slot-scope="scope">
            <el-tag
              type="success"
              style="margin-right: 2px"
              v-for="(ro,index) in scope.row.role"
              :key="index"
            >{{ro.nameCh}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="enabled" width="120" label="用户状态">
          <template slot-scope="scope">
            <el-switch disabled v-model="scope.row.enabled" active-value="1" inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="userSignature" width="250" label="用户签名" show-overflow-tooltip></el-table-column>
        <el-table-column width="200" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditUser(scope.row)" size="medium" type="primary">编辑</el-button>
            <el-button
              :disabled="scope.row.userId==user2.userId"
              @click="deleteUser(scope.row)"
              size="medium"
              type="danger"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div style="margin-top:20px;display: flex;justify-content: flex-end">
        <el-pagination
          background
          @current-change="currentChange"
          @size-change="sizeChange"
          layout="sizes, prev, pager, next, jumper, ->, total, slot"
          :total="total"
          :page-sizes="[2, 4, 6, 8]"
          :page-size="2"
        ></el-pagination>
      </div>-->
    </div>

    <el-dialog title="编辑用户信息" :visible.sync="dialogVisible" width="28%">
      <div v-if="user">
        <el-form :model="user" ref="info" :rules="rules">
          <el-form-item label="姓名:" prop="name">
            <el-input
              type="text"
              maxlength="20"
              show-word-limit
              placeholder="请输入姓名"
              v-model="user.name"
              autofocus
            ></el-input>
          </el-form-item>

          <el-form-item label="性别:">
            <el-radio-group v-model="user.userSex">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="电话号码:" prop="phone">
            <el-input type="text" show-word-limit placeholder="请输入电话号码" v-model="user.phone"></el-input>
          </el-form-item>

          <el-form-item label="出生日期:" prop="birthday">
            <el-date-picker
              style="width: 100%;"
              v-model="user.birthday"
              type="date"
              :editable="false"
              :clearable="false"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              :default-value="user.birthday"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="用户状态:" prop="enabled">
            <el-switch v-model="user.enabled" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>

          <el-form-item label="个性签名:" prop="userSignature">
            <el-input
              maxlength="100"
              type="text"
              show-word-limit
              placeholder="请输入个性签名"
              v-model="user.userSignature"
            ></el-input>
          </el-form-item>

          <el-form-item label="用户角色:">
            <el-checkbox-group v-model="selectRoles">
              <el-checkbox
                style="width:150px;"
                v-for="(roles,index) in allRoles"
                :label="roles.id"
                :key="index"
              >{{roles.nameCh}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updateUserInfo">确 定</el-button>
            <el-button type="info" plain @click="dialogVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserManagement",
  data() {
    return {
      keyWord: "",
      users: [],
      user: null,
      // page: 1,
      // size: 2,
      // total: 0,
      dialogVisible: false,
      selectRoles: [],
      allRoles: [],
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
        userSignature: [
          { required: true, message: "请输入用户签名", trigger: "blur" }
        ],
        birthday: [
          {
            required: true,
            message: "请选择日期",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    user2() {
      return this.$store.state.currentUser;
    }
  },
  mounted() {
    this.initUsers();
    this.initRoles();
  },
  methods: {
    initRoles() {
      this.getRequest("/sys/user/getallroles").then(resp => {
        if (resp) {
          this.allRoles = resp;
        }
      });
    },
    initUsers() {
      this.getRequest("/sys/user/?keyword=" + this.keyWord).then(resp => {
        if (resp) {
          resp.data.filter(item => {
            item.userSex = item.userSex == 1 ? "男" : "女";
          });
          this.users = resp.data;
        }
      });
    },
    showEditUser(data) {
      let roleIds = [];
      for (let i = 0; i < data.role.length; i++) {
        roleIds.push(data.role[i].id);
      }
      this.selectRoles = roleIds;
      this.user = data;
      this.dialogVisible = true;
    },
    deleteUser(data) {
      this.$confirm(
        "此操作将永久删除用户名【" + data.userName + "】, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.deleteRequest("/sys/user/deleteuser/" + data.userId).then(
            resp => {
              if (resp) {
                this.initUsers();
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
    updateUserInfo() {
      if (this.selectRoles.length < 1) {
        this.$message({
          message: "请至少选择一个角色",
          type: "warning"
        });
        return false;
      }
      this.$refs.info.validate(valid => {
        if (valid) {
          let temp = [];
          for (let i = 0; i < this.selectRoles.length; i++) {
            let ob = {
              id: this.selectRoles[i]
            };
            temp.push(ob);
          }
          this.user.role = temp;
          let gender = this.user.userSex;
          this.user.userSex = gender == "男" ? 1 : 0;
          this.putRequest("/sys/user/updateuser", this.user)
            .then(resp => {
              if (resp.status === 200) {
                this.dialogVisible = false;
                this.initUsers();
              }
            })
            .catch(failResponse => {});
        } else {
          return false;
        }
      });
    }
    // sizeChange(currentSize) {
    //   this.size = currentSize;
    //   this.initUsers();
    // },
    // currentChange(currentPage) {
    //   this.page = currentPage;
    //   this.initUsers();
    // }
  }
};
</script>

<style>
.el-form-item__content {
  display: flex;
  justify-content: flex-start;
}
</style>