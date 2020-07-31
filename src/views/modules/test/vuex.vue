<template>
  <div class="wrapper">
    {{name}}
    <hr>
    {{name2}}
    <hr>
    {{name3}}
    <button type="button" @click="test">commit</button>
  </div>
</template>

<script>
import { mapState } from '@/assets/js/vuex.js'
import Vue from 'vue'
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
      name: state => state.user.msg
    }),
    name2 () {
      return this.$store.state.user.msg
    },
    name3: {
      get () {
        return this.$store.state.user.msg
      },
      set (val) {
        this.$store.commit('user/updateMsg', val)
      }
    }
  },
  watch: {},
  created () {},
  mounted () {
    // console.log('vuex页面', this.$store)
    console.log('vuex页面', this)
    console.log('a', new Vue())
  },
  activated () {},
  deactivated () {},
  updated () {},
  destroyed () {},
  methods: {
    test () {
      this.name3 = '天天向上'
    }
  },
  filters: {}
}
</script>
<style scoped>
</style>