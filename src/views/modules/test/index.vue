<template>
  <div class="wrapper">
    <el-form :model="dataForm" status-icon :rules="rules" ref="dataForm" label-width="100px">
      <el-form-item label="密码">
        <el-input-number v-model="dataForm.num" :precision="3" :step="0.1"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('dataForm')">提交</el-button>
        <el-button @click="resetForm('dataForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <button type="button" @click="show">ok</button>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {},
    data() {
      const vm = this
      const validateNum = (rule, value, callback) => {
        debugger
        if (!vm.isNumber(value)) {
          callback(new Error('必须为一个数字'))
        } else {
          callback()
        }
      }
      return {
        dataForm: {
          num: 0
        },
        rules: {
          num: [{
            validator: validateNum,
            trigger: 'blur'
          }]
        }
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
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('submit', this.dataForm.num)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      show() {
        console.log(this.dataForm.num)
      },
      isNumber(num) {
        return typeof num === 'number' && !isNaN(num)
      }
    },
    filters: {}
  }

</script>
<style scoped>
</style>
