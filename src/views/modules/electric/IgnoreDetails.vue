<template>
  <el-dialog title="忽略详情" :visible.sync="visible" :append-to-body="true" width="50%">
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="操作时间"
        prop="createTime"
      ></el-table-column>
      <el-table-column prop="ignoreStatus" align="center" label="操作名称" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ignoreStatus === 0" type="danger">未忽略</el-tag>
          <el-tag v-else type="success">已忽略</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="操作原因"
        prop="remark"
      ></el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="操作人"
        prop="createBy"
      ></el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <span slot="footer" class="dialog-footer">
      <button type="button" @click="visible = false">确定</button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      visible: false,
      electricUserNumber: '', // 用户表号
      electricUserInstrument: '', // 用户编号
      ignoreStatus: '',//忽略状态
      // 分页数据
      pageIndex: 1,
      pageSize: 10, // 每一页显示的数量
      totalPage: 0, // 总条数
      dataList: [], // 表格数据
      dataListLoading: false
    }
  },
  computed: {},
  methods: {
    // 初始化
    init(electricUserNumber, electricUserInstrument,ignoreStatus) {
      this.visible = true
      this.ignoreStatus = ignoreStatus
      this.electricUserNumber = electricUserNumber
      this.electricUserInstrument = electricUserInstrument
      this.$nextTick(() => {
        this.getDataList()
      })
    },
    getDataList() {
      return new Promise((resovle, reject) => {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/electric/userignore/selectUserIgnoreList'),
          method: 'post',
          data: this.$http.adornData({
            page: this.pageIndex,
            limit: this.pageSize,
            ignoreStatus: this.ignoreStatus, // 忽略状态
            electricUserNumber: this.electricUserNumber, // 用户表号
            electricUserInstrument: this.electricUserInstrument // 用户编号
          })
        })
          .then(({ data }) => {
            if (data && data.code === 0) {
              this.dataList = data.page.list
              this.totalPage = data.page.totalCount
            } else {
              // 提示报错信息
              this.$message.error(data.msg)
              this.dataList = []
              this.totalPage = 0
            }
            this.dataListLoading = false
            resovle()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    }
  }
}
</script>

