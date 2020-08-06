<template>
  <div class="wrapper">
    <div class="container">
      <div class="item" v-for="(item ,index) in list" :key="index">
        {{ item.name }}
        <span class="btn" :class="{'active': item.status}" @click="change(item)"></span>
      </div>
      <hr />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      list: [],
      arr: []
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    for (let i = 0; i < 30; i++) {
      this.list.push({
        id: i,
        status: false,
        name: i
      })
    }
  },
  activated () {},
  deactivated () {},
  updated () {},
  destroyed () {},
  methods: {
    change (item) {
      item.status = !item.status
      this.arr.push(item)
      console.log(this.arr)
    }
  },
  filters: {}
}
</script>
<style scoped lang="scss">
.container {
  > .item {
    width: 200px;
    height: 150px;
    background: #ccc;
    float: left;
    margin: 5px;
    position: relative;
    > .btn {
      cursor: pointer;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      position: absolute;
      top: 5px;
      right: 5px;
      border: 1px solid #eee;
      &.active {
        // border: 1px solid #1acd7e;
        &::before {
          content: '';
          top: 3px;
          left: 3px;
          position: absolute;
          background: transparent;
          border: black solid 3px;
          border-top: none;
          border-right: none;
          height: 6px;
          width: 8px;
          -moz-transform: rotate(-45deg);
          -ms-transform: rotate(-45deg);
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
          color: #fff;
        }
      }
    }
  }
}
</style>