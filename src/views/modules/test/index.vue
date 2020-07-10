<template>
  <div class="wrapper">
    <div class="container" @mouseover="on_enter" @mouseleave="on_leave">
      <div v-for="(item, i) in list" :key="i" :class="{'active': i === index}">{{ item }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        index: 0, // 开始的索引值
        list: ['a', 'b', 'c', 'd'],
        timer: null
      }
    },
    mounted() {
      this.timer = setInterval(this.autoPlay, 1000)
    },
    methods: {
      autoPlay() {
        this.index++
        if (this.index === this.list.length) {
          this.index = 0
        }
      },
      on_enter() {
        clearInterval(this.timer)
      },
      on_leave() {
        this.timer = setInterval(this.autoPlay, 1000)
      }
    }
  }

</script>
<style scoped lang="scss">
  .container {
    width: 400px;
    height: 400px;
    background: #ccc;
    display: flex;
    cursor: pointer;
  }

  .container div {
    flex: 1;
    border: 1px solid #fff;
    background-color: #fb3;

    &.active {
      background-color: #1acd7e;
    }
  }

</style>
