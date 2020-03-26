<template>
  <el-card class="box-card" style="margin: 20px;
    width: 30%;">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="请输入旧密码:" prop="oldpwd">
        <el-input type="password" v-model="ruleForm.oldpwd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="请输入新密码:" prop="newpwd">
        <el-input type="password" v-model="ruleForm.newpwd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="请确认新密码:" prop="checknewpwd">
        <el-input type="password" v-model="ruleForm.checknewpwd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item style="
    margin-left: -100px;">
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "pwd",
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checknewpwd !== "") {
          this.$refs.ruleForm.validateField("checknewpwd");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newpwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldpwd: "",
        newpwd: "",
        checknewpwd: ""
      },
      rules: {
        oldpwd: [{ validator: validatePass1, trigger: "blur" }],
        newpwd: [{ validator: validatePass1, trigger: "blur" }],
        checknewpwd: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.putRequest("/user/updatepwd", this.ruleForm).then(resp => {
            if (resp) {
              this.getRequest("/system/logout").then(resp => {
                if (resp.status === 200) {
                  this.$store.commit("logout");
                  this.$router.replace("/");
                }
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
</style>