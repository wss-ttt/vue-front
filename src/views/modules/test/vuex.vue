<template>
  <div class="wrapper">
    {{msg}}<br>
    {{msg2}}<br>
    {{newMsg}}<br>
  </div>
</template>

<script>
import { mapState, mapGetters } from '@/assets/js/vuex.js'
import store from '@/store/index'
export default {
  components: {},
  props: {},
  data () {
    return {
      msg: store.state.test.msg,
      msg2: this.$store.state.test.msg
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
    test () {
    }
  },
  filters: {}
}
</script>
<style scoped>
</style>