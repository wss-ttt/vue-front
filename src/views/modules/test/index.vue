<template>
  <div class="wrapper">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      text-color="#fff"
      active-text-color="red"
      background-color="#006f69"
      router
    >
      <el-menu-item index="test-vuex">处理中心</el-menu-item>
      <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="/test-roll">选项1</el-menu-item>
        <el-menu-item index="/test-ani">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">选项4</template>
          <el-menu-item index="2-4-1">选项1</el-menu-item>
          <el-menu-item index="2-4-2">选项2</el-menu-item>
          <el-menu-item index="2-4-3">选项3</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="4">
        <a href="#">订单管理</a>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      activeIndex: '1'
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  activated () {},
  deactivated () {},
  updated () {},
  destroyed () {},
  methods: {},
  filters: {}
}
</script>
<style scoped>
</style>