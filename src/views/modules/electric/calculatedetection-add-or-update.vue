<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户编号">
        <el-input placeholder="用户编号" v-model="dataForm.electricUserNumber"></el-input>
      </el-form-item>
      <el-form-item label="用户表号">
        <el-input placeholder="用户表号" v-model="dataForm.electricUserInstrument"></el-input>
      </el-form-item>
      <el-form-item label="终端地址">
        <el-input placeholder="终端地址" v-model="dataForm.terminalAddress"></el-input>
      </el-form-item>
      <el-form-item label="终端地址">
        <el-input placeholder="终端地址" v-model="dataForm.terminalAddress"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button> -->
      <button type="button" @click="visible = false">取消</button>
      <button type="button" @click="dataFormSubmit()">确定</button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,        // 主键
          electricUserNumber: '',      // 用户编号
          electricUserInstrument:'',   // 用户表号
          terminalAddress:'',    // 终端地址
          detectionDay:'',      // 检测日期
          detectionMinute:'',    // 检测分钟
          detectionTime:'',     // 检测时间
          warehouseEntryTime:'',    // 入库时间
          detectionVoltageA:'',    // 电压A相
          detectionVoltageB:'',    // 电压B相
          detectionVoltageC:'',   // 电压C相
          detectionElectricityA:'',    // 电流A相
          detectionElectricityB:'',    // 电流B相
          detectionElectricityC:'' ,   // 电流C相
          activePower:'',    // 有功率
          nothingPower:'',    // 无功率
          powerFactor:'',    // 功率因素
          electricQuantity:'',    // 电量
          electricLoad:'',   // 负荷
          electricDeficiency:'',   // 是否缺失(单选 缺失|未缺失)
          calculateSuccess:'',    //  是否计算(单选 未计算|已调用|已计算)
        },
        dataRule: {
          paramKey: [
            { required: true, message: '参数名不能为空', trigger: 'blur' }
          ],
          paramValue: [
            { required: true, message: '参数值不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/config/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.paramKey = data.config.paramKey
                this.dataForm.paramValue = data.config.paramValue
                this.dataForm.remark = data.config.remark
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/config/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'paramKey': this.dataForm.paramKey,
                'paramValue': this.dataForm.paramValue,
                'remark': this.dataForm.remark
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
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
