export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    msg: '好好学习'
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateMsg (state, msg) {
      state.msg = msg
    }
  }
}
