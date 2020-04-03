<template>
  <el-container id="admin-body">
    <el-header>
      <div class="header">
        <div class="homeLeft">
          <img width="55px;" height="55px;" src="../assets/logo.png" alt="系统Logo" fit="contain" />
          <span class="title">仓库管理系统</span>
        </div>
        <div>
          <el-dropdown @command="commandHandler">
            <span class="el-dropdown-link">
              <span class="name">
                <span style="font-weight:bold;">欢迎</span>
                {{user.name}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <img
                width="40px;"
                height="40px;"
                style="border-radius: 50%;"
                :src="user.userAvatar"
                alt="用户头像"
              />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userInfo" icon="el-icon-user-solid">个人中心</el-dropdown-item>
              <el-dropdown-item command="modifyPassword" icon="el-icon-key">密码修改</el-dropdown-item>
              <el-dropdown-item command="modifyAvatar" icon="el-icon-picture">修改头像</el-dropdown-item>
              <el-dropdown-item command="logout" icon="el-icon-switch-button" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside style="height: 115%; margin-top: -80px;width: 250px; overflow: hidden;">
        <div style="height: 80px;"></div>
        <el-menu
          class="el-menu-admin"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#09f"
          router
        >
          <el-submenu v-for="(item,index) in routes" :index="index+''" :key="index">
            <template slot="title">
              <i style="margin-right: 5px" :class="item.icon"></i>
              <span>{{item.nameCh}}</span>
            </template>
            <el-menu-item v-for="(child,ind) in item.children" :index="child.path" :key="ind">
              <i style="margin-right: 10px" :class="child.icon"></i>
              <span>{{child.nameCh}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container style="background-color: #e5e7e8;">
        <el-main>
          <el-breadcrumb
            class="nav"
            separator-class="el-icon-arrow-right"
            v-if="this.$router.currentRoute.path!='/home'"
          >
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="welcome" v-if="this.$router.currentRoute.path=='/home'">欢迎来到管理系统！</div>
          <router-view />
        </el-main>
        <el-footer>版权所有 &copy; 2020 四川西南交通大学</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },

  computed: {
    routes() {
      return this.$store.state.routes;
    },
    user() {
      return this.$store.state.currentUser;
    }
  },

  methods: {
    commandHandler(cmd) {
      if (cmd == "logout") {
        this.$confirm("此操作将注销登录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.getRequest("/system/logout").then(resp => {
              if (resp.status === 200) {
                this.$store.commit("logout");
                this.$router.replace("/");
                // 清空路由，防止路由重复加载
                // const newRouter = createRouter();
                // this.$router.matcher = newRouter.matcher;
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
      } else if (cmd == "userInfo") {
        this.$router.push("/userinfo");
      } else if (cmd == "modifyPassword") {
        this.$router.push("/pwd");
      } else if (cmd == "modifyAvatar") {
        this.$router.push("/avatar");
      }
    }
  }
};
</script>


<style scoped>
#admin-body {
  height: 95vh;
  background-color: #e5e7e8;
  color: black;
}

.el-header {
  z-index: 1;
  height: 80px;
  margin-left: -20px;
  background-color: #fefefe;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 98%;
}

.homeLeft {
  display: flex;
  align-items: center;
  background-color: #e5e7e8;
  margin-bottom: -10px;
}

.title {
  font-size: 28px;
  font-family: 华文行楷;
  margin-left: 5px;
  font-weight: 500;
  margin-right: 20px;
}

.el-dropdown-link {
  cursor: pointer;
  margin-right: 10px;
  display: flex;
  align-items: center;
  background-color: white;
  padding-top: 10px;
}

.name {
  font-size: 18px;
  margin-right: 15px;
  letter-spacing: 1px;
}

.el-menu-admin {
  border-radius: 5px;
  height: 100%;
}

.nav {
  font-size: 18px;
  letter-spacing: 1px;
}

.welcome {
  font-size: 50px;
  letter-spacing: 10px;
  color: blueviolet;
  padding-top: 350px;
  padding-left: 550px;
}

.el-footer {
  text-align: center;
  line-height: 60px;
  position: fixed;
  bottom: 0px;
  width: 100%;
  background-color: rgb(174, 177, 179);
  color: #fff;
}
</style>
