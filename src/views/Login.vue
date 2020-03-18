<template>
<body id="poster">
  <el-form :model="loginForm" :rules="rules" ref="ruleForm" class="loginContainer">
    <h3 class="login_title">请登录系统</h3>
    <el-form-item prop="username" size="medium">
      <el-input
        size="medium"
        type="text"
        prefix-icon="el-icon-s-custom"
        placeholder="请输入用户名"
        v-model="loginForm.userName"
        autofocus="true"
      ></el-input>
    </el-form-item>
    <el-form-item prop="password" size="medium">
      <el-input
        size="medium"
        show-password
        prefix-icon="el-icon-lock"
        placeholder="请输入密码"
        v-model="loginForm.userPassword"
      ></el-input>
    </el-form-item>
    <el-form-item
      style="margin:-10px 0px 0px;display: flex;
  justify-content: start;"
      prop="rememberMe"
    >
      <el-checkbox
        size="normal"
        @change="selecteChange(loginForm.rememberMe)"
        label="记住账号"
        v-model="loginForm.rememberMe"
      ></el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
      <el-button type="info" plain @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</body>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        userName: "wang",
        userPassword: "123",
        rememberMe: true
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postRequest("/system/login", this.loginForm)
            .then(resp => {
              if (resp.status === 200) {
                console.log(resp.obj);
                this.$store.commit("login", resp.obj);
                this.$router.replace("/home");
              } else {
                Message.error({ message: "登录失败" });
              }
            })
            .catch(failResponse => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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

.el-form-item__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.el-form-item__content button {
  width: 100%;
  margin: 8px;
}
</style>
