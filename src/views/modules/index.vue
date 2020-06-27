<template>
    <div class="wrapper">
      <a-a :list="list" />
   </div>
</template>

<script>
  import AA from './components/AA'
  export default {
    components: {
      AA
    },
    props: {},
    data() {
      return {
         list: [] 
      }
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
      this.list = [{
        name: 'aa',
        age: 18
      }, {
        name: 'bb',
        age: 28
      }]
    },
    activated() {},
    deactivated() {},
    updated() {},
    destroyed() {},
    methods: {},
    filters: {}
  }
</script>
<style scoped lang="scss">
.wrapper {

}
</style>