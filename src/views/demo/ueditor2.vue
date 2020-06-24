<template>
  <div>
    好
    <script :id="ueId" class="ueditor-box" type="text/plain" style="width: 100%; height: 260px;">hello world!</script>
  </div>
</template>
<script>
import ueditor from 'ueditor'
export default {
  name: 'ueditor2',
  data() {
    return {
      ue: null,
      ueId: `J_ueditorBox_${new Date().getTime()}`,
      // ueContent: '',
      // dialogVisible: false
    }
  },
  mounted() {
    this.ue = ueditor.getEditor(this.ueId, {
      // serverUrl: '', // 服务器统一请求接口路径
      zIndex: 3000
    })
  }
}

</script>
<style scoped></style>
