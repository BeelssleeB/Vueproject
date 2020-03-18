import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    //rememberMe: JSON.parse(window.localStorage.getItem("rememberMe")),
    routes: [],
    currentUser: JSON.parse(window.localStorage.getItem("user")),
  },
  mutations: {
    // remember(state, rememberMe) {
    //   state.rememberMe = rememberMe;
    //   window.localStorage.setItem("rememberMe", JSON.stringify(rememberMe));
    // },
    login(state, user) {
      state.currentUser = user;
      window.localStorage.setItem("user", JSON.stringify(user));
    },
    logout (state) {
      state.currentUser = []
      window.localStorage.removeItem('user')
      state.routes = []
    },
    initRoutes(state, route) {
      state.routes = route;
    }
  }
})

export default store;