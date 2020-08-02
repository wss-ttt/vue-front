<template>
  <div class="wrapper">
    {{msg}}<br>
    <button type="button" @click="test">确定</button>
    <br>
    {{ name }}
    <br>
    <button type="button" @click="change">改变</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from '@/assets/js/vuex.js'
export default {
  components: {},
  props: {},
  data () {
    return {
    }
  },
  computed: {
    // 混入进来
    ...mapState({
      msg: state => state.user.msg
    }),
    ...mapGetters({
      newMsg: 'test/newMsg'
    }),
    name() {
      return '哈哈'
    }
  },
  watch: {},
  created () {},
  mounted () {
    console.log('getters', this.$store.getters) // 可以取到所有modules的getters
    console.log('state', this.$store.state) // 可以取到所有modules的state
    console.log('_mutation', this.$store._mutations)
  },
  activated () {},
  deactivated () {},
  updated () {},
  destroyed () {},
  methods: {
    ...mapMutations({
      updateMsg: 'test/updateMsg'
    }),
    ...mapActions({
      updateMsg2: 'test/updateMsg2'
    }),
    test () {
      this.updateMsg()
      // this.updateMsg2()
      // console.log(this.$store)
      // this.$store.dispatch('test/updateMsg2')

      // this.$store.commit('test/updateMsg', '太难太难')

      // this.$store.dispatch('test/updateMsg2', '太难太难')
    },
    change() {
      // this.$store.commit('test/updateMsg', '今天天气很热')
      this.$store.dispatch('test/updateMsg2', '今天天气很热')
    }
  },
  filters: {}
}
</script>
<style scoped>
</style>