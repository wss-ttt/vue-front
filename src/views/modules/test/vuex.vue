<template>
  <div class="wrapper">
    {{name}}
    <hr>
    {{name2}}
    <button type="button" @click="test">commit</button>
  </div>
</template>

<script>
import { mapState, version } from '@/assets/js/vuex.js'
import Vue from 'vue'
export default {
  components: {},
  props: {},
  data() {
    return {
    }
  },
  computed: {
    // 混入进来
    ...mapState({
      name: function(state) {
        return state.common.name
      }
    }),
    name2() {
      return this.$store.state.common.name
    }
  },
  watch: {},
  created() {},
  mounted() {
    // console.log('vuex页面', this.$store)
    console.log('vuex页面', this)
    console.log('a', new Vue())
  },
  activated() {},
  deactivated() {},
  updated() {},
  destroyed() {},
  methods: {
    test() {
      debugger
      this.$store.commit('common/updateName', 'xxx')
    }
  },
  filters: {}
}
</script>
<style scoped>
</style>