<template>
  <div class="upload" @click="open">
    <span>上传</span>
    <input type="file" ref="uploadFile" @change="change($event)" />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    httpRequest: {
      type: Function
    }
  },
  data() {
    return {
      fileList: [] // 保存文件list
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
    open() {
      // this.$refs['uploadFile'].dispatchEvent(new MouseEvent('click'))
      this.$refs['uploadFile'].click()
    },
    change(e) {
      // 兼容性获取event对象
      let event = e || window.event
      // 兼容性获取target对象
      let target = event.target || event.srcElement
      this.fileList = target.files
      this.$emit('on-change', this.fileList)
      console.log(this.httpRequest)
      this.httpRequest && this.httpRequest()
    }
  },
  filters: {}
}
</script>
<style scoped lang="scss">
.upload {
  display: inline-block;
  padding: 12px 20px;
  background: #409eff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  input {
    display: none;
  }
}
</style>