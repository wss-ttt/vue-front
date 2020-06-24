<template>
  <el-dialog title="查看详情" :visible.sync="visible" :append-to-body="true" width="50%">
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item label="流水号">
        <el-input v-model="dataForm.id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="用户编号">
        <el-input v-model="dataForm.electricUserNumber" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="用户表号">
        <el-input v-model="dataForm.electricUserInstrument" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="工单号">
        <el-input v-model="dataForm.orderNumber" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="评估日期">
        <el-input v-model="dataForm.detectionDay" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="派单状态">
        <el-tag :type="dataForm.dispatchStatus === 1?'danger':'success'">{{dataForm.dispatchStatus?'已派单':'已处理'}}</el-tag>
      </el-form-item>
      <el-form-item label="派单原因">
        <el-input
          :disabled="true"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 5}"
          v-model="dataForm.dispatchRemark"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="visible = false">确定</el-button> -->
      <button type="button" @click="visible = false">确定</button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: '', // 派单流水号
        electricUserNumber: '', // 用户编号
        electricUserInstrument: '', // 用户表号
        orderNumber: '', // 工单号
        dispatchRemark: '', // 派单备注
        dispatchStatus:'',     // 派单状态
        detectionDay:'',    // 评估日期
      }
    }
  },
  computed: {},
  methods: {
    // 初始化
    init(id) {
      this.dataForm.id = id // 派单流水号
      this.visible = true
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl(`/electric/userdispatch/info/${id}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({ data }) => {
          this.dataForm.electricUserNumber = data.userDispatch.electricUserNumber // 用户编号
          this.dataForm.electricUserInstrument =
            data.userDispatch.electricUserInstrument // 用户表号
          this.dataForm.orderNumber = data.userDispatch.orderNmuber // 工单号
          this.dataForm.dispatchRemark = data.userDispatch.dispachRemark // 工单号
          this.dataForm.dispatchStatus = data.userDispatch.dispatchStatus // 工单号
          this.dataForm.detectionDay = data.userDispatch.detectionDay    // 检测日期
        })
      })
    }
  }
}
</script>

