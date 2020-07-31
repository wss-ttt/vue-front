export default {
  namespaced: true,
  state: {
    msg: '好好学习'
  },
  getters: {
    newMsg (state) {
      return state.msg + '哈哈'
    }
  },
  mutations: {
    updateMsg (state, msg) {
      state.msg = msg
    }
  }
}
