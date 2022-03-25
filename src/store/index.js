import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoading: false,
  },
  mutations: {
    // 改变加载数据的状态
    updateLoadingStatus(state, payload) {
      state.isLoading = payload.isLoading
    },
  },
  actions: {},
  modules: {},
})
