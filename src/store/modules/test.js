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
    // 不能做异步操作
    updateMsg (state, msg) {
      console.log('aaa')

      // 这个代码会报错
      // setTimeout(() => {
      //   state.msg = msg
      // }, 1000)

      state.msg = msg
    }
  },
  actions: {
    updateMsg2 (context, msg) {
      setTimeout(() => {
        context.commit('updateMsg', msg)
      }, 1000)
    }
  }
}
