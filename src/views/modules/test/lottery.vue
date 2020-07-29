<template>
  <div class="wrapper">
    <div class="box-lottery">
      <div ref="boxLottery" class="box" :style="{'transform' : rollging ? 'rotate('+ rotateAngle +'deg)' : 'rotate('+ randomAngle +'deg)', 'transition' : rollging ? 'all 5s' : 'none'}">
        <div
          v-for="(item, index) in list"
          :key="index"
          :style="{'transform' : 'rotate('+ ((360 / list.length * index) + (360 / list.length / 2)) + 'deg)'}"
        >
          <span>{{ item.title }}</span>
        </div>
      </div>
      <div class="lottery-btn" @click="rotate">
        <i></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      rotateAngle: 0, // 旋转的角度
      roundNum: 2, // 转的圈数
      randomAngle: 0, // 随机产生一个角度
      rollging: false,
      list: [
        {
          title: '111'
        },
        {
          title: '222'
        },
        {
          title: '333'
        },
        {
          title: '444'
        },
        {
          title: '555'
        },
        {
          title: '666'
        },
        {
          title: '777'
        },
        {
          title: '888'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    this.$refs['boxLottery'].addEventListener('transitionend', () => {
      this.rollging = false
      this.$refs['boxLottery'].style.transform = 'rotate(' + this.randomAngle + 'deg)'
      this.lotteryEnd(this.randomAngle)
    })
  },
  activated () {},
  deactivated () {},
  updated () {},
  destroyed () {},
  methods: {
    // 旋转
    rotate () {
      // 1.如果在转，就不需要执行
      if (this.rollging) return
      this.rollging = true
      // 2.随机产生一个角度
      this.randomAngle = Math.floor(Math.random() * 360)
      // 3.需要转的角度
      this.rotateAngle = this.randomAngle + this.roundNum * 360
    },
    lotteryEnd (angle) {
      if (angle > 0 && angle < 45) {
        console.log('888')
      } else if (angle > 45 && angle <= 90) {
        console.log('777')
      } else if (angle > 90 && angle <= 135) {
        console.log('666')
      } else if (angle > 135 && angle <= 180) {
        console.log('555')
      } else if (angle > 180 && angle <= 225) {
        console.log('444')
      } else if (angle > 225 && angle <= 270) {
        console.log('333')
      } else if (angle > 270 && angle <= 315) {
        console.log('222')
      } else if (angle > 315 && angle <= 360) {
        console.log('111')
      }
    }
  },
  filters: {}
}
</script>
<style scoped lang="scss">
.box-lottery {
  position: relative;
  width: 615px;
  height: 615px;
  .box {
    width: 100%;
    height: 100%;
    background: #fb3;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    background: url(../../../assets/img/bg_lottery_f.png) center no-repeat;
    > div {
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 32.7%;
      width: 214px;
      height: 50%;
      // border: 1px solid red;
      transform-origin: 50% 100%;
      text-align: center;
      font-size: 30px;
      // color: #fff;
    }
  }
  .lottery-btn {
    width: 161px;
    height: 161px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid red;
    cursor: pointer;
    i {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -90%);
      width: 40px;
      height: 40px;
      background: url(../../../assets/img/icon_point.png) center no-repeat;
    }
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // background: url(../../../assets/img/btn_lottery.png) center no-repeat;
    }
  }
}
</style>