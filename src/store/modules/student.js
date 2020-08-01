export default {
  namespaced: true,
  state: {
    hobby: '睡觉'
  },
  getters: {
    newHobby(state) {
      return state.hobby + ', 打豆豆' 
    }
  },
  mutations: {
  },
  actions: {
  }
}
