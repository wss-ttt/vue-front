<template>
  <div class="wrapper">
    <div class="num-box">
      <div v-for="(item,index) in newRanking" :key="index" class="num-box-item">
        <ul class="num-inner" :style="{'top': -item * 90 + 'px'}">
          <li v-for="(i,index) in 10" :key="index">{{ index }}</li>
        </ul>
      </div>
    </div>
    <hr>
    <div class="num-box">
      <div v-for="(item,index) in newRanking2" :key="index" class="num-box-item">
        <ul class="num-inner" :style="{'top': -item * 90 + 'px'}">
          <li v-for="(i,index) in 10" :key="index">{{ index }}</li>
        </ul>
      </div>
    </div>
    <button type="button" @click="change">改变数据</button>
    <button type="button" @click="change2">改变数据</button>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {},
    data() {
      return {
        ranking: 0,
        ranking2: 0
      }
    },
    computed: {
      newRanking() {
        let res = []
        let str
        if (this.ranking < 10) {
          // 只有一位(前面需要补充2个0)
          res = [0, 0, this.ranking]
        } else if (this.ranking < 100) {
          // 只有两位(前面需要补充1个0)
          str = '0' + this.ranking
          res = [0, +str.charAt(1), +str.charAt(2)]
        } else if (this.ranking < 1000) {
          // 只有3位(前面就不需要补充0)
          str = '' + this.ranking
          res = [+str.charAt(0), +str.charAt(1), +str.charAt(2)]
        }
        return res
      },
      newRanking2() {
        return this.ranking2 && [...('' + this.ranking2)] || [0, 0, 0]
      }
    },
    watch: {},
    created() {},
    mounted() {
      setTimeout(() => {
        this.ranking = 33
        this.ranking2 = 22
      }, 1000)
    },
    activated() {},
    deactivated() {},
    updated() {},
    destroyed() {},
    methods: {
      change() {
        // this.ranking = 112
        console.log(this.newRanking)
        console.log(this.newRanking2)
      },
      change2() {
        this.ranking2 = 11
      }
    },
    filters: {}
  }

</script>
<style scoped lang="scss">
  .num-box {
    display: flex;

    .num-box-item {
      width: 60px;
      height: 90px;
      margin: 0 5px;
      background: rgba(4, 21, 56, 1);
      border: 1px solid rgba(66, 168, 255, 1);
      box-shadow: 0 0 10px 2px #42a8ff inset;
      overflow: hidden;
      position: relative;

      ul.num-inner {
        transition: all 2s ease-in-out;
        position: absolute;
        top: 0;
        left: 0;

        li {
          width: 60px;
          height: 90px;
          line-height: 90px;
          text-align: center;
          font-size: 72px;
          color: #fff;
        }
      }
    }
  }

</style>