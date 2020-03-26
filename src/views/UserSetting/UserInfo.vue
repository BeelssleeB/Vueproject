<template>
  <div v-if="user">
    <el-card class="card" style="width: 400px">
      <div slot="header" style="display:flex; align-items: center;justify-content: space-between;">
        <span>个人信息</span>
        <el-button type="primary" @click="showUpdateUserInfo">修改信息</el-button>
      </div>
      <div>
        用户名:
        <el-tag>{{user.userName}}</el-tag>
      </div>
      <div>
        姓名:
        <el-tag>{{user.name}}</el-tag>
      </div>
      <div>
        电话号码:
        <el-tag>{{user.phone}}</el-tag>
      </div>
      <div>
        性别:
        <el-tag>{{user.userSex==1?'男':'女'}}</el-tag>
      </div>
      <div>
        出生日期:
        <el-tag>{{user.birthday}}</el-tag>
      </div>
      <div>
        个性签名:
        <el-tag>{{user.userSignature}}</el-tag>
      </div>
      <div>
        状态:
        <el-switch disabled v-model="user.enabled" active-value="1" inactive-value="0"></el-switch>
      </div>
    </el-card>

    <el-dialog title="修改用户信息" :visible.sync="dialogVisible" width="25%">
      <div>
        <el-form :model="user2" :rules="rules">
          <el-form-item label="用户名:" prop="userName">
            <el-input
              type="text"
              maxlength="20"
              show-word-limit
              placeholder="请输入用户名"
              v-model="user2.userName"
              autofocus
            ></el-input>
          </el-form-item>

          <el-form-item label="电话号码:" prop="phone">
            <el-input type="text" show-word-limit placeholder="请输入电话号码" v-model="user2.phone"></el-input>
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
              :default-value="user2.birthday"
            ></el-date-picker>
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
  name: "userInfo",
  data() {
    return {
      dialogVisible: false,
      user: null,
      user2: null,
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        birthday: [{ type: 'date', required: true, message: "请选择日期", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.initUser();
  },
  methods: {
    updateUserInfo() {
      console.log(this.user2)
        this.putRequest("/user/putuserinfo", this.user2).then(resp => {
          if (resp) {
            this.dialogVisible = false;
            this.initUser();
          }
        }).catch(failResponse => {this.dialogVisible = false;});
    },
    showUpdateUserInfo() {
      this.dialogVisible = true;
    },
    initUser() {
      this.getRequest("/user/getuserinfo").then(resp => {
        if (resp.user) {
          resp.user.birthday = resp.user.birthday.substr(0, 10);
          this.user = resp.user;
          this.user2 = Object.assign({}, this.user);
          this.$store.commit("login", resp.user);
        }
      });
    }
  }
};
</script>

<style scoped>
.card {
  margin: 20px;
}

.el-card__body div {
  margin: 10px 0px;
}

.el-tag {
  margin: 0px 10px;
}
</style>