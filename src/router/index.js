import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import UserInfo from '../views/UserSetting/UserInfo.vue'
import PwdSet from '../views/UserSetting/PwdSet.vue'
import AvatarSet from '../views/UserSetting/AvatarSet.vue'
import WebSocket from '../views/UserSetting/WebSocket.vue'
import notFound from '../views/error/notFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Default',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/userinfo',
        name: '信息修改',
        component: UserInfo
      },
      {
        path: '/pwd',
        name: '密码修改',
        component: PwdSet
      },
      {
        path: '/avatar',
        name: '头像设置',
        component: AvatarSet
      },
      {
        path: '/webSocket',
        name: '套接字模拟',
        component: WebSocket
      }
    ]
  },
  // {
  //   path: "/404",
  //   name: "notFound",
  //   component: notFound
  // },
  // {
  //   path: "*",
  //   redirect: "/404"
  // }
]

export default new VueRouter({
  routes
})
