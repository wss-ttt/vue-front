<template>
  <div class="wrapper">
    <input type="text" v-model="num" />
    <button type="button" @click="test">确定</button>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      num: 0
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
    test() {
      // console.log(typeof this.num)
      // console.log(this.isNumber(this.num))
      console.log(this._isNumber(this.num))
      console.log(this.isInteger(this.num))
    },
    isNumber(num) {
      // isNaN()函数 把空串 空格 以及null 按照0来处理 所以先去除，
      if (num === '' || num == null) {
        return false
      }
      if ((typeof num === 'number' || typeof num === 'string') && !isNaN(num)) {
        return true
      } else {
        return false
      }
    },
    _isNumber(num) {
      if (parseFloat(num).toString() === 'NaN') {
        return false
      } else {
        return true
      }
    },
    // 判断是否为一个整数
    isInteger(num) {
      const val = parseInt(num)
      if (num == val) {
        return true
      } else {
        return false
      }
    },
    _isInteger(num) {
      return (typeof num === 'string' || typeof num === 'number') && num % 1 === 0
    }
  },
  filters: {}
}
</script>
<style scoped>
</style>