import {fetchItem} from '../api.js'

const profileStore={
  state: {
    list: [],
    dept: []
  },
  actions:{
    fetchList: ({commit, state}, url) => {
      return fetchItem(url).then((items) => commit('setlist', items))
    }
  },
  mutations: {
    setlist:(state, list) => {
      state.list = list
    }
  }
}

export default profileStore