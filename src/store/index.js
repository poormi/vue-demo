import Vue from 'vue'
import Vuex from 'vuex'
import {
  fetchItem
} from './api.js'

import childStore from './modules/profile.js'
Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    user: {
      userName: '用户'
    },
    menus: [],
    logoutUrl: 'https://github.com/ids/logout'
  },
  actions: {
    fetchUserName: ({
      commit,
      state
    }, url) => {
      return fetchItem(url).then((items) => commit('setUserName', items))
    },
    fetchMenu: ({
      commit,
      state
    }, url) => {
      return fetchItem(url).then((items) => commit('setMenu', items))
    }
  },
  mutations: {
    setUserName: (state, data) => {
      if (data) {
        state.logoutUrl = data.logoutUrl;
        state.user = data;
      }
    },
    setMenu: (state, data) => {
      if (data) {
        state.menus = data;
      }
    }
  },
  getters: {
    currentUser: state => state.user.userName,
    logoutUrl: state => state.logoutUrl,
    getMenus: state => state.menus,
    getUser: state => state.user
  },
  modules: {
    childStore
  }
})

export default store