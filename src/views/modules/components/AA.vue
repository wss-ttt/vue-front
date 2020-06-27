<template>
    <div class="box">
      <div v-for="(item, index) in list" :key="index">
        姓名: {{ item.name }}
        <br>
        年龄: {{ item.age }}
      </div>

      显示其中的某一个
      <!-- {{ list[0]['name'] }} -->
      解决办法
      {{ list[0] && list[0]['name'] }}

   </div>
</template>

<script>
  export default {
    components: {},
    props: {
      list: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
          
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
    methods: {},
    filters: {}
  }
</script>
<style scoped>
</style>