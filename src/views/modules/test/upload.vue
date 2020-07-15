<template>
  <div class="wrapper">
    <v-upload  @on-change="change"></v-upload>
  </div>
</template>

<script>
import VUpload from './components/upload'
export default {
  components: { VUpload },
  props: {},
  data() {
    return {}
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
    httpRequest() {
      console.log('发送请求,进行上传文件')
    },
    change(fileList) {
      console.log('fileList', fileList)
    }
  },
  filters: {}
}
</script>
<style scoped>
</style>