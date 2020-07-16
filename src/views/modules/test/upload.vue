<template>
  <div class="wrapper">
    <div class="upload" @click="open">
      <span>上传</span>
      <input type="file" ref="uploadFile" @change="change($event)" multiple />
    </div>
    <ul>
      <li v-for="(item, index) in fileList" :key="index">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      fileList: [] // 存放文件
    }
  },
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
      const files = target.files
      this.fileList = [].slice.call(files)
      // 可以在这个地方对文件进行校验
      if (files[0].size / 1024 / 1024 > 1) {
        this.$message.error('选择的文件不能超过1M')
        return
      }
      // 在这个地方可以进行发送请求,进行上传
      this.uploadFile()
    },
    uploadFile() {}
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