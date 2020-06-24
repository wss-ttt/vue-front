<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户编号" prop="electricUserNumber">
        <el-input placeholder="用户编号" v-model="dataForm.electricUserNumber" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="用户表号" prop="electricUserInstrument">
        <el-input placeholder="用户表号" v-model="dataForm.electricUserInstrument" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="用户名称" prop="electricUserName">
        <el-input placeholder="用户名称" v-model="dataForm.electricUserName" maxlength="300"></el-input>
      </el-form-item>
      <el-form-item label="用电地址" prop="electricityAddress">
        <el-input placeholder="用电地址" v-model="dataForm.electricityAddress" maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="终端地址" prop="terminalAddress">
        <!-- <el-input placeholder="终端地址" v-model="dataForm.terminalAddress"></el-input> -->
        <el-input v-model="dataForm.terminalAddress" oninput="if(this.value.length>=10)value=value.slice(0,10)" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" placeholder="请输入内容"></el-input>
        <!-- <el-input-number v-model="dataForm.terminalAddress" :max="999999999"></el-input-number>
        <span class="el-icon-info" style="color:#909399;font-size:12px;margin-left:10px;">整数型</span> -->
      </el-form-item>
      
      <el-form-item label="供电单位" prop="powerSupplyUnit">
        <el-select v-model="dataForm.powerSupplyUnit" placeholder="请选择供电单位">
          <el-option v-for="(item,index) in powerSupplyUnitDictData" :label="item" :key="index" :value="index"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="营销中心" prop="marketingCentre">
        <el-select v-model="dataForm.marketingCentre" placeholder="请选择营销中心">
          <el-option v-for="(item,index) in marketingCenterDictData" :label="item" :key="index" :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="抄表部门" prop="meterReader">
        <el-select v-model="dataForm.meterReader" placeholder="请选择抄表部门">
          <el-option v-for="(item,index) in meterReaderDictData" :label="item" :key="index" :value="index"></el-option>
        </el-select>
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
          id: 0,
          electricUserNumber: '', // 用户编号
          electricUserInstrument: '', // 用户表号
          terminalAddress: '', // 终端地址
          electricUserName: '', // 用户名称
          powerSupplyUnit: '', // 供电单位(字典数据)
          electricityAddress: '', // 用电地址
          marketingCentre: '', // 营销中心(字典数据)
          meterReader: '', // 抄表部门(字典数据)
        },
        dataRule: {
          electricUserNumber: [{
            required: true,
            message: '用户编号不能为空',
            trigger: 'blur'
          }],
          electricUserInstrument: [{
            required: true,
            message: '用户表号不能为空',
            trigger: 'blur'
          }],
          terminalAddress: [{
            required: true,
            message: '终端地址不能为空',
            trigger: 'blur'
          }],
          electricUserName: [{
            required: true,
            message: '用户名称不能为空',
            trigger: 'blur'
          }],
          powerSupplyUnit: [{
            required: true,
            message: '供电单位不能为空',
            trigger: 'change'
          }],
          electricityAddress: [{
            required: true,
            message: '用电地址不能为空',
            trigger: 'blur'
          }],
          marketingCentre: [{
            required: true,
            message: '营销中心不能为空',
            trigger: 'change'
          }],
          meterReader:[{
            required: true,
            message: '抄表部门不能为空',
            trigger: 'change'
          }]
        }
      }
    },
    props: {
      // 保存供电单位字典数据
      powerSupplyUnitDictData: {
        type: Array,
      },
      // 保存营销中心字典数据
      marketingCenterDictData: {
        type: Array,
      },
      // 抄表部门
      meterReaderDictData: {
        type: Array,
      }
    },
    mounted() {
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0
        // 启动'确定'按钮 -> 进行添加操作
        this.addBtnDisabled = false
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/electric/calculateuser/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({
              data
            }) => {
              if (data && data.code === 0) {
                this.dataForm.electricUserNumber = data.calculateUser.electricUserNumber // 用户编号
                this.dataForm.electricUserInstrument = data.calculateUser.electricUserInstrument // 用农户表号
                this.dataForm.terminalAddress = data.calculateUser.terminalAddress // 终端地址
                this.dataForm.electricUserName = data.calculateUser.electricUserName // 用户名称
                this.dataForm.powerSupplyUnit = parseInt(data.calculateUser.powerSupplyUnit) // 供电单位
                this.dataForm.electricityAddress = data.calculateUser.electricityAddress // 用电地址
                this.dataForm.marketingCentre = parseInt(data.calculateUser.marketingCentre) // 营销中心
                this.dataForm.meterReader = parseInt(data.calculateUser.meterReader) // 抄表部门
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
              url: this.$http.adornUrl(`/electric/calculateuser/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'electricUserNumber': this.dataForm.electricUserNumber,   // 用户编号
                'electricUserInstrument': this.dataForm.electricUserInstrument,  // 用户表号
                'terminalAddress': this.dataForm.terminalAddress,     // 终端地址
                'electricUserName': this.dataForm.electricUserName,      // 用户名称
                'powerSupplyUnit': this.dataForm.powerSupplyUnit,   // 供电单位(字典数据)
                'electricityAddress': this.dataForm.electricityAddress,    // 用电地址
                'marketingCentre': this.dataForm.marketingCentre,      // 营销中心(字典数据)
                'meterReader': this.dataForm.meterReader,      // 抄表部门(字典数据)
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
      }
    }
  }
</script>
