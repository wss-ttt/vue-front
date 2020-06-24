<template>
  <el-dialog :title="title" :visible.sync="visible" :append-to-body="true" width="30%">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="100px"
    >
      <el-form-item label="账号">
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item label="密码" prop="passWord">
        <el-input type="password" v-model="dataForm.passWord" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item :label="title+'原因'" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :class="{disabled:addBtnDisabled}">确定</el-button> -->
      <button type="button" @click="visible = false">取消</button>
      <button type="button" @click="dataFormSubmit()" :class="{disabled:addBtnDisabled}">确定</button>
    </span>
  </el-dialog>
</template>

<script>
import { clearLoginInfo } from '@/utils'
import { Decrypt, Encrypt } from '@/utils/crypto.js'
export default {
  props:['title'],
  data() {
    return {
      addBtnDisabled: false, // 控制确定按钮的启用和禁用 防止重复添加操作
      visible: false,
      electricUserNumbers: [], // 用户编号(数组 可以进行批量忽略)
      ignoreStatus:'',    // 忽略的状态 1：忽略  0:不进行忽略
      dataForm: {
        passWord: '',
        remark: '' // 忽略原因
      },
      dataRule: {
        passWord: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '忽略原因不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    userName: {
      get() {
        return this.$store.state.user.name
      }
    }
  },
  methods: {
    // 初始化
    init(id,detectionDay,ignoreStatus) {
      // 启动'确定'按钮 -> 进行添加操作
      this.addBtnDisabled = false
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.electricUserNumbers = id
        this.ignoreStatus = ignoreStatus
        this.detectionDay = detectionDay
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // 禁用'确定按钮'
          this.addBtnDisabled = true
          this.$http({
            url: this.$http.adornUrl('/electric/manage/updateIgnore'),
            method: 'post',
            data: this.$http.adornData({
              userName: this.userName,
              passWord: Encrypt(this.dataForm.passWord),
              remark: this.dataForm.remark,
              detectionDay: this.detectionDay,
              ignoreStatus: this.ignoreStatus, // 1：忽略操作  0:启用操作
              electricUserNumbers: this.electricUserNumbers // 用户编号
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: data.msg,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
              // 添加失败的时候,需要再次启动'确定按钮'
              this.addBtnDisabled = false
            }
          })
        }
      })
    }
  }
}
</script>

