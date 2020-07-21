<template>
  <div class="wrapper">
    {{ homePageName }}
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState({
      homePageName: state => state
    })
  },
  watch: {},
  created() {},
  mounted() {
    console.log('aa', this.homePageName)
  },
  activated() {},
  deactivated() {},
  updated() {},
  destroyed() {},
  methods: {},
  filters: {}
}
</script>
<style scoped>
</style>