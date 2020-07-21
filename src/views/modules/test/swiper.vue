<template>
  <div class="wrapper">
    <div class="header row">
      <div class="col">姓名</div>
      <div class="col">年龄</div>
      <div class="col">性别</div>
    </div>
    <!-- v-if="list.length" 这个地方要加上这个代码否则不是从第一条数据开始显示的 -->
    <swiper ref="mySwiper" :options="swiperOption" v-if="list.length">
      <swiper-slide class="item row" v-for="(item,index) in list" :key="index">
        <div class="col">{{item.name}}</div>
        <div class="col">{{item.age}}</div>
        <div class="col">{{item.sex}}</div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      list: [],
      swiperOption: {
        direction: 'vertical',
        slidesPerView: '5', //  显示区域显示几个
        autoplay: true,
        loop: true // 注意这个loop的作用及到底做了哪些事情
      }
    }
  },
  computed: {
    mySwiper() {
      return this.$refs['mySwiper'].$swiper
    }
  },
  watch: {},
  created() {},
  mounted() {
    // 制造数据
    for (let i = 1; i <= 10; i++) {
      this.list.push({
        name: 'aa' + i,
        age: 18,
        sex: '男'
      })
    }
  },
  activated() {
    // 进入的时候，重新开启swiper
    this.mySwiper.autoplay.start()
  },
  deactivated() {
    // 离开的时候，停止swiper
    this.mySwiper.autoplay.stop()
  },
  updated() {},
  destroyed() {}
}
</script>
<style scoped lang="scss">
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper {
  width: 600px;
  height: 300px;
  background: #ccc;
  color: #fff;
  .row {
    display: flex;
    .col {
      flex: 1;
    }
  }
  .header {
    height: 60px;
    background-color: #11a2f5;
    > div {
      @include center;
    }
  }
  .item {
    > div {
      @include center;
    }
    // 奇数
    &:nth-child(odd) {
      background-color: #0780c5;
    }
    // 偶数
    &:nth-child(even) {
      background-color: #1b4888;
    }
  }
  .swiper-container {
    height: calc(100% - 60px);
  }
}
</style>