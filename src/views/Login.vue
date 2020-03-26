<template>
<body id="poster">
  <el-form ref="loginForm" :model="loginForm" :rules="rules" class="loginContainer">
    <h3 class="login_title">请登录系统</h3>
    <el-form-item prop="userName" size="medium">
      <el-input
        size="medium"
        type="text"
        prefix-icon="el-icon-s-custom"
        placeholder="请输入用户名"
        v-model="loginForm.userName"
        autofocus="true"
      ></el-input>
    </el-form-item>
    <el-form-item prop="userPassword" size="medium">
      <el-input
        size="medium"
        show-password
        prefix-icon="el-icon-lock"
        placeholder="请输入密码"
        v-model="loginForm.userPassword"
      ></el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input
        size="normal"
        type="text"
        v-model="loginForm.code"
        auto-complete="off"
        placeholder="点击图片更换验证码"
        @keydown.enter.native="submitForm"
        style="width: 230px;margin-right:20px;"
      ></el-input>
      <img :src="vcUrl" @click="updateVerifyCode" alt />
    </el-form-item>
    <el-form-item
      style="margin:-10px 0px 0px;display: flex;
  justify-content: start;"
    >
      <el-checkbox
        size="normal"
        @change="selecteChange(loginForm.rememberMe)"
        label="记住账号"
        v-model="loginForm.rememberMe"
      ></el-checkbox>
    </el-form-item>
    <el-form-item style="margin:15px 20px;">
      <el-button type="primary" @click="submitForm">登录</el-button>
    </el-form-item>
     <el-form-item style="margin:15px 20px;">
      <el-button type="info" plain @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</body>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      vcUrl: "system/verifyCode?time=" + new Date(),
      loginForm: {
        userName: "",
        userPassword: "",
        code: "",
        rememberMe: false
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  methods: {
    updateVerifyCode() {
      this.vcUrl = "system/verifyCode?time=" + new Date();
    },
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.postRequest("/system/login", this.loginForm)
            .then(resp => {
              if (resp.status === 200) {
                console.log(resp.obj);
                this.$store.commit("login", resp.obj);
                this.$router.replace("/home");
              } else {
                this.vcUrl = "/verifyCode?time=" + new Date();
              }
            })
            .catch(failResponse => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
    selecteChange(value) {
      //this.$store.commit("remember", value);
    }
  }
};
</script>

<style>
#poster {
  background: url("../assets/poster.jpg") no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}

body {
  margin: 0px;
}

.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 200px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0px auto 25px auto;
  text-align: center;
  color: #505458;
  letter-spacing: 1px;
}

.el-form-item__content{
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-form-item__content button {
  width: 100%;
}
</style>
