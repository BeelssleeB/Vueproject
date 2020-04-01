import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/icon/iconfont.css'

import { postRequest } from "./utils/api";
import { putRequest } from "./utils/api";
import { deleteRequest } from "./utils/api";
import { getRequest } from "./utils/api";
import { initMenu } from "./utils/menu";

Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;

Vue.config.productionTip = false
Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  if (to.path == '/' || to.path == '/login') {
    next();
  } else {
    if (window.localStorage.getItem("user")) {
      getRequest('/system/isAuthenticated').then(resp => {
        if (resp.status === 200) {
          initMenu(router, store);
          next();
        }
      }).catch(failResponse => { next('/login') });
    }
    else {
      next('/login')
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
