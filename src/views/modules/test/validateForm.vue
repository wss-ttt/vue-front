<template>
  <div class="wrapper">
    <el-form :model="dataForm" status-icon :rules="rules" ref="dataForm" label-width="100px">
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="dataForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="dataForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('dataForm')">提交</el-button>
        <el-button @click="resetForm('dataForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
          // callback('密码不能为空') // 这样写好像也是可以的
        } else if (value.length < 6) {
          callback(new Error('密码不能小于6位'))
        } else if (!/^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){6,19}$/.test(value)) { // 注意这个地方的正则表达式
          callback(new Error('只能输入6-20个以字母开头、可带数字、“_”、“.”的字串'))
        } else {
          if (this.dataForm.checkPass !== '') {
            this.$refs.dataForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.dataForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      return {
        dataForm: {
          pass: '', // 密码
          checkPass: '' // 确认密码
        },
        rules: {
          pass: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          checkPass: [{
            validator: validatePass2,
            trigger: 'blur'
          }]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.dataForm.pass)
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }

</script>