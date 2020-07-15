<template>
  <div class="wrapper">
    <div v-for="(i, index) in 3" :key="index" class="box" :class="{ani: anis[index]}">{{i}}</div>
    <button type="button" @click="start">开始动画</button>
    <button type="button" @click="stop">停止动画</button>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      anis: [
        {
          status: false
        },
        {
          status: false
        },
        {
          status: false
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  activated() {},
  deactivated() {},
  updated() {},
  destroyed() {},
  methods: {
    // 开始动画
    start() {
      this.anis.forEach(item => {
        console.log('item', item)
        item.status = false
      })
      console.log(this.anis)
      setTimeout(() => {
        this.anis[0]['status'] = true
        setTimeout(() => {
          this.anis[1]['status'] = true
          setTimeout(() => {
            this.anis[2]['status'] = true
          }, 100)
        }, 100)
      }, 100)
    },
    // 停止动画
    stop() {}
  },
  filters: {}
}
</script>
<style scoped lang="scss">
.box {
  width: 100px;
  height: 50px;
  background: #fb3;
  margin: 5px;
  &.ani {
    animation: buzz-out 0.75s linear;
  }
}

@keyframes buzz-out {
  10% {
    transform: translateX(3px) rotate(2deg);
  }

  20% {
    transform: translateX(-3px) rotate(-2deg);
  }

  30% {
    transform: translateX(3px) rotate(2deg);
  }

  40% {
    transform: translateX(-3px) rotate(-2deg);
  }

  50% {
    transform: translateX(2px) rotate(1deg);
  }

  60% {
    transform: translateX(-2px) rotate(-1deg);
  }

  70% {
    transform: translateX(2px) rotate(1deg);
  }

  80% {
    transform: translateX(-2px) rotate(-1deg);
  }

  90% {
    transform: translateX(1px) rotate(0);
  }

  100% {
    transform: translateX(-1px) rotate(0);
  }
}
</style>