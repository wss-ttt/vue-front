<template>
  <div class="wrapper">
    <div class="title">
      <ul ref="inner" class="inner" @mouseover="on_enter" @mouseout="on_leave" :style="{left: isRoll ? 0 : 'unset'}">
        <li v-for="(item, index) in titleArr" :key="index" class="unit">{{item}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      title: '湘西土家族苗族自治州站点监控信息',
      // title: '湘西土家族苗族自治',
      timer: null,
      unitWidth: 0
    }
  },
  computed: {
    titleArr () {
      if (this.title.length > 10) {
        return [this.title, this.title]
      } else {
        return [this.title]
      }
    },
    isRoll () {
      return this.title.length > 10
    }
  },
  watch: {},
  created () {},
  mounted () {
    let unit = this.$refs['inner'].children
    this.unitWidth = unit[0].offsetWidth
    this.isRoll && (this.timer = setInterval(this.autoPlay, 30))
  },
  activated () {},
  deactivated () {},
  updated () {},
  destroyed () {},
  methods: {
    autoPlay () {
      if (this.$refs['inner'].offsetLeft === -this.unitWidth) {
        this.$refs['inner'].style.left = 0
      }
      this.$refs['inner'].style.left = this.$refs['inner'].offsetLeft - 1 + 'px'
    },
    on_enter () {
      this.isRoll && clearInterval(this.timer)
    },
    on_leave () {
      this.isRoll && (this.timer = setInterval(this.autoPlay, 30))
    }
  },
  filters: {}
}
</script>
<style scoped lang="scss">

.title {
  width: 660px;
  height: 100px;
  font-size: 54px;
  background: #ccc;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  ul.inner {
    display: flex;
    flex-wrap: nowrap;
    position: absolute;
    li {
      white-space: nowrap;
    }
  }
}
</style>