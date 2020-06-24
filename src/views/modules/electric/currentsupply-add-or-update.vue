<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="用户编号" prop="electricUserNumber">
        <el-input v-model="dataForm.electricUserNumber" placeholder="用户编号" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="用户表号" prop="id">
        <el-input v-model="dataForm.id" placeholder="用户表号" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="终端地址" prop="terminalAddress">
        <!-- <el-input v-model="dataForm.terminalAddress" placeholder="终端地址码"></el-input> -->
        <el-input v-model="dataForm.terminalAddress" oninput="if(this.value.length>=10)value=value.slice(0,10)" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" placeholder="请输入内容"></el-input>
        <!-- <el-input-number v-model="dataForm.terminalAddress" :max="999999999"></el-input-number>
        <span class="el-icon-info" style="color:#909399;font-size:12px;margin-left:10px;">整数型</span -->
      </el-form-item>
      <el-form-item label="电流变比值" prop="electrorheologicalThan">
        <!-- <el-input v-model="dataForm.electrorheologicalThan" placeholder="电流变比值" type="number"></el-input> -->
        <el-input-number v-model="dataForm.electrorheologicalThan" :precision="3" :max="9999999.999"></el-input-number>
        <span class="el-icon-info" style="color:#909399;font-size:12px;margin-left:10px;">浮点型</span>
      </el-form-item>
      <el-form-item label="电压变比值" prop="voltageChangeThan">
        <!-- <el-input v-model="dataForm.voltageChangeThan" placeholder="电压变比值" type="number"></el-input> -->
        <el-input-number v-model="dataForm.voltageChangeThan" :precision="3" :max="9999999.999"></el-input-number>
        <span class="el-icon-info" style="color:#909399;font-size:12px;margin-left:10px;">浮点型</span>
      </el-form-item>
      <el-form-item label="计算方式" prop="formMeasurement">
        <el-radio-group v-model="dataForm.formMeasurement">
           <el-radio label="高供低计"></el-radio>
           <el-radio label="高供高计"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="合同容量" prop="contractCapacity">
        <!-- <el-input v-model="dataForm.contractCapacity" placeholder="合同容量" type="number"></el-input> -->
        <el-input-number v-model="dataForm.contractCapacity" :precision="3" :max="9999999.999"></el-input-number>
        <span class="el-icon-info" style="color:#909399;font-size:12px;margin-left:10px;">浮点型</span>
      </el-form-item>
      <el-form-item label="接线方式" prop="modeConnection">
        <el-radio-group v-model="dataForm.modeConnection">
           <el-radio label="三相三线"></el-radio>
           <el-radio label="三相四线"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="电压等级" prop="voltageClasses">
        <el-input v-model="dataForm.voltageClasses" placeholder="电压等级" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="综合倍率" prop="comprehensiveRatio">
        <!-- <el-input v-model="dataForm.comprehensiveRatio" placeholder="综合倍率" type="number"></el-input> -->
        <el-input-number v-model="dataForm.comprehensiveRatio" :precision="3" :max="9999999.999"></el-input-number>
        <span class="el-icon-info" style="color:#909399;font-size:12px;margin-left:10px;">浮点型</span>
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
  export default {
    data() {
      return {
      	addBtnDisabled:false,  // 控制确定按钮的启用和禁用 防止重复添加操作
        visible: false,
        dataForm: {
          id: 0,                       //     用户表号
          electricUserNumber:'',         // 用户编号
          terminalAddress:'',    // 终端地址码
          electrorheologicalThan:'',   // 电流变比值
          voltageChangeThan:'',   //  电压变比值
          formMeasurement:'',     // 计算方式(单选 高供低计|高供高计)
          contractCapacity:'',   // 合同容量
          modeConnection:'',     //  接线方式(单选 三相三线|三相四线)
          voltageClasses:'',     //  电压等级
          comprehensiveRatio:''    // 综合倍率
        },
        dataRule: {
          id:[{
            required: true,
            message: '用户表号不能为空',
            trigger: 'blur'
          }],
          electricUserNumber: [{
            required: true,
            message: '用户编号不能为空',
            trigger: 'blur'
          }],
          terminalAddress: [{
            required: true,
            message: '终端地址码不能为空',
            trigger: 'blur'
          }],
          electrorheologicalThan:[{
            required: true,
            message: '电流变比值不能为空',
            trigger: 'blur'
          }],
          voltageChangeThan:[{
            required: true,
            message: '电压变比值不能为空',
            trigger: 'blur'
          }],
          formMeasurement:[{
            required: true,
            message: '请选择计算方式',
            trigger: 'change'
          }],
          contractCapacity:[{
            required: true,
            message: '合同容量不能为空',
            trigger: 'blur'
          }],
          modeConnection:[{
            required: true,
            message: '请选择接线方式',
            trigger: 'change'
          }],
          voltageClasses:[{
            required: true,
            message: '电压等级不能为空',
            trigger: 'blur'
          }],
          comprehensiveRatio:[{
            required: true,
            message: '综合倍率不能为空',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0
        // 启动'确定'按钮 -> 进行添加操作
        this.addBtnDisabled = false
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (id) {
            this.$http({
              url: this.$http.adornUrl(`/electric/currentsupply/info/`+id),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({
              data
            }) => {
              if (data && data.code === 0) {
                // 查询单条信息进行回显
                this.dataForm.id = data.currentSupply.id  // id
                this.dataForm.electricUserNumber = data.currentSupply.electricUserNumber  // 用户编号
                this.dataForm.terminalAddress = data.currentSupply.terminalAddress  // 终端地址
                this.dataForm.electrorheologicalThan = data.currentSupply.electrorheologicalThan  // 电流变比值
                this.dataForm.voltageChangeThan = data.currentSupply.voltageChangeThan  // 电压变比值
                this.dataForm.formMeasurement = data.currentSupply.formMeasurement  // 计算方式
                this.dataForm.contractCapacity = data.currentSupply.contractCapacity  // 合同容量
                this.dataForm.modeConnection = data.currentSupply.modeConnection  // 接线方式
                this.dataForm.voltageClasses = data.currentSupply.voltageClasses  // 电压等级
                this.dataForm.comprehensiveRatio = data.currentSupply.comprehensiveRatio  // 综合倍率
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
          	// 禁用'确定按钮'
        		this.addBtnDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/electric/currentsupply/replace`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,    // 主键 用户表号
                'electricUserNumber': this.dataForm.electricUserNumber,   //  用户编号
                'terminalAddress': this.dataForm.terminalAddress,       // 终端地址码
                'electrorheologicalThan': this.dataForm.electrorheologicalThan,   // 电流变比值
                'voltageChangeThan': this.dataForm.voltageChangeThan,   // 电压变比值
                'formMeasurement': this.dataForm.formMeasurement,   // 计算方式
                'contractCapacity': this.dataForm.contractCapacity,   // 合同容量
                'modeConnection': this.dataForm.modeConnection,   // 接线方式
                'voltageClasses': this.dataForm.voltageClasses,   // 电压等级
                'comprehensiveRatio': this.dataForm.comprehensiveRatio,   // 综合倍率
              })
            }).then(({
              data
            }) => {
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
      },
    }
  }
</script>
