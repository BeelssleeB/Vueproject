import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import UserInfo from '../views/UserInfo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta:{
      requireAuth: false
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta:{
      requireAuth: true
    },
    children: [
      {
        path: '/userinfo',
        name: 'info',
        component: UserInfo,
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
