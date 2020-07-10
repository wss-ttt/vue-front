<template>
  <div class="wrapper">
    <el-upload action="" :on-change="change"
      :http-request="upload" :show-file-list="false">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <button type="button" @click="show">确定</button>
    <hr>
    <input type="file" @change="change2" />
  </div>
</template>

<script>
  export default {
    components: {},
    props: {},
    data() {
      return {
        /* fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }] */
        fileList: [] //  action="https://jsonplaceholder.typicode.com/posts/"
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
      handleRemove(file, fileList) {
        console.log('已经移除了')
        console.log(file, fileList);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        console.log('移除文件')
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      // 改变事件
      change(file, fileList) {
        this.$message.error('超出限制')
        console.log('change file', file)
        console.log('change fileLise', fileList)
      },
      change2(file) {
        console.log('change2', file)
      },
      upload() {
        console.log('upload')
      },
      show() {
        console.log(this.fileList)
      }
    },
    filters: {}
  }

</script>
<style scoped>
</style>
