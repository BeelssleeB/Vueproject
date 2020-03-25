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

    <el-dialog title="修改用户信息" :visible.sync="dialogVisible" width="30%">
      <div>
        <table>
          <tr>
            <td>
              <el-tag>用户名:</el-tag>
            </td>
            <td>
              <el-input v-model="user2.userName"></el-input>
            </td>
          </tr>
          <tr>
            <td>
              <el-tag>电话号码:</el-tag>
            </td>
            <td>
              <el-input v-model="user2.phone"></el-input>
            </td>
          </tr>
          <tr>
            <td>
              <el-tag>出生日期:</el-tag>
            </td>
            <td>
              <el-date-picker
                v-model="user2.birthday"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                :default-value="user2.birthday"
                editable
              ></el-date-picker>
            </td>
          </tr>
          <tr>
            <td>
              <el-tag>个性签名:</el-tag>
            </td>
            <td>
              <el-input v-model="user2.userSignature"></el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUserInfo">确 定</el-button>
      </span>
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
      user2: null
    };
  },
  mounted() {
    this.initUser();
  },
  methods: {
    updateUserInfo() {
      //   this.putRequest("/user/putuserinfo", this.user2).then(resp => {
      //     if (resp) {
      //       this.dialogVisible = false;
      //       this.initUser();
      //     }
      //   });
    },

    showUpdateUserInfo() {
      this.dialogVisible = true;
    },

    initUser() {
      this.getRequest("/user/getuserinfo").then(resp => {
        console.log(resp.user);
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