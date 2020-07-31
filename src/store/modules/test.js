export default {
  namespaced: true,
  state: {
    msg: '好好学习'
  },
  mutations: {
    updateMsg (state, msg) {
      state.msg = msg
    }
  }
}
