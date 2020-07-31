<template>
  <div class="wrapper">
    {{msg}}<br>
    <button type="button" @click="test">确定</button>
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
    })
  },
  watch: {},
  created () {},
  mounted () {
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
    }
  },
  filters: {}
}
</script>
<style scoped>
</style>