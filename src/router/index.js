import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import UserInfo from '../views/UserSetting/UserInfo.vue'
import PwdSet from '../views/UserSetting/PwdSet.vue'
import AvatarSet from '../views/UserSetting/AvatarSet.vue'

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
    component: Login,
    meta: {
      requireAuth: false
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: '/userinfo',
        name: '信息修改',
        component: UserInfo,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/pwd',
        name: '密码修改',
        component: PwdSet,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/avatar',
        name: '头像设置',
        component: AvatarSet,
        meta: {
          requireAuth: true
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
