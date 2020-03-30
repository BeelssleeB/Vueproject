<template>
  <div>
    <div style="margin-top: 20px">
      <el-table :data="users" stripe border style="width: 100%" height="250">
        <el-table-column prop="userId" label="ID" width="90"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="90"></el-table-column>
        <el-table-column prop="name" label="姓名" align="left" width="85"></el-table-column>
        <el-table-column prop="userSex" label="性别" align="left" width="85"></el-table-column>
        <el-table-column prop="phone" width="95" align="left" label="电话号码"></el-table-column>
        <el-table-column prop="birthday" width="100" align="left" label="生日日期"></el-table-column>
        <el-table-column prop="userRole" width="50" label="用户角色"></el-table-column>
        <el-table-column prop="userEnabled" width="50" label="用户状态">
          <template slot-scope="scope">
            <el-switch disabled v-model="scope.row.userEnabled" active-value="1" inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="userSignature" width="100" label="用户签名" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" width="200" label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditUser(scope.row)" size="mini">编辑</el-button>
            <el-button @click="deleteUser(scope.row)" size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end">
        <el-pagination
          background
          @current-change="currentChange"
          @size-change="sizeChange"
          layout="sizes, prev, pager, next, jumper, ->, total, slot"
          :total="total"
          :page-sizes="[2, 4, 6, 8]"
          :page-size="2"
          hide-on-single-page
        ></el-pagination>
      </div>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
      <div>
        <el-form :model="user" :rules="rules">
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

          <el-form-item label="性别:" prop="userSex">
            <el-radio-group v-model="user.gender">
              <el-radio label="1">男</el-radio>
              <el-radio label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="电话号码:" prop="phone">
            <el-input type="text" show-word-limit placeholder="请输入电话号码" v-model="user.phone"></el-input>
          </el-form-item>

          <el-form-item label="出生日期:" prop="birthday">
            <el-date-picker
              style="width: 100%;"
              v-model="user2.birthday"
              type="date"
              :editable="false"
              :clearable="false"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              :default-value="user.birthday"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="用户状态:" prop="enabled">
            <el-switch disabled v-model="user.enabled" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>

          <el-form-item label="个性签名:" prop="userSignature">
            <el-input
              maxlength="100"
              type="text"
              show-word-limit
              placeholder="请输入个性签名"
              v-model="user2.userSignature"
            ></el-input>
          </el-form-item>

          <el-form-item label="用户角色:" prop="userRoles">
            <el-select v-model="user.role" placeholder="用户角色">
              <el-option v-for="item in role" :key="item" :label="item" :value="item"></el-option>
            </el-select>
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
      title: "",
      users: [],
      user: null,
      page: 1,
      size: 2,
      total: 0,
      dialogVisible: false,
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        userSex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
        userSignature: [
          { required: true, message: "请输入用户签名", trigger: "blur" }
        ],
        userRoles: [
          { required: true, message: "请选择用户角色", trigger: "blur" }
        ],
        birthday: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.initUsers();
  },
  methods: {
    initUsers() {},
    showEditUser(data) {
      this.title = "编辑用户信息";
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
          //   this.deleteRequest("/employee/basic/" + data.id).then(resp => {
          //     if (resp) {
          //       this.initUsers();
          //     }
          //   });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    updateUserInfo() {},
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initUsers();
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initUsers();
    }
  }
};
</script>

<style scoped>
</style>