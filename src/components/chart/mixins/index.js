import mixins from '@/mixins/index'
export default {
  mixins: [mixins],
  computed: {
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold
      }
    }
  },
  activated() {
    this.resize()
  },
  deactivated() {

  },
  methods: {
    resize() {
      const { myChart } = this // 对象解构
      myChart && myChart.resize()
    }
  },
  watch: {
    sidebarFold: {
      handler(newVal, oldVal) {
        if (this.activatedFlag) {
          this.resize()
        }
      }
    }
  }
}
