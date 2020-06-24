<template>
  <div class="user-ignore common">
    <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="query">
      <el-form-item>
        <el-input v-model="dataForm.electricUserNumber" placeholder="用户编号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.electricUserNumber" placeholder="用户表号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
      </el-form-item>
    </el-form> -->
    <div class="query-area">
      <ul>
        <li>
          <span>用户编号:</span>
          <el-input v-model="dataForm.electricUserNumber" placeholder="用户编号" clearable style="width:200px;"></el-input>
        </li>
        <li>
          <span>用户表号:</span>
          <el-input v-model="dataForm.electricUserInstrument" placeholder="用户表号" clearable style="width:200px;"></el-input>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="query">搜索</button>
        </li>
      </ul>
    </div>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" align="center" width="80" label="ID"></el-table-column>
      <el-table-column prop="electricUserNumber" align="center" label="用户编号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="electricUserInstrument" align="center" label="用户表号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="createBy" align="center" label="操作人" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="ignoreStatus" align="center" label="忽略状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ignoreStatus === 0" type="danger">未忽略</el-tag>
          <el-tag v-else type="success">已忽略</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="detectionDay" align="center" label="评估日期" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="createTime" align="center" width="180" label="创建时间" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="remark" align="center" label="忽略原因" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column fixed="right" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.userIgnoreStatus === 1 && scope.row.ignoreStatus === 1" type="text" @click="ignoreHnadle(scope.row.electricUserNumber,scope.row.detectionDay,0)">不忽略</el-button>
          <el-button v-if="scope.row.ignoreStatus === 0 || scope.row.userIgnoreStatus === 0" @click="ignoreHnadle(scope.row.electricUserNumber,scope.row.detectionDay,1)" type="text" style="color:#ccc;cursor:no-drop;">忽略</el-button>
          <el-button type="text" @click.stop="ignoreDetailsHandle(scope.row.electricUserNumber,scope.row.electricUserInstrument,scope.row.ignoreStatus)">忽略详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[15, 30, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 忽略的确认弹框 -->
    <ignore-dialog v-if="ignoreDialogVisible" ref="ignoreDialog" @refreshDataList="getDataList" title="不忽略"></ignore-dialog>
    <!-- 忽略详情弹框 -->
    <ignore-details v-if="ignoreDetailsVisible" ref="ignoreDetails"></ignore-details>
  </div>
</template>

<script>
import IgnoreDialog from './IgnoreDialog'
import DispatchInfoDialog from './DispatchInfoDialog'
import IgnoreDetails from './IgnoreDetails'
export default {
  data() {
    return {
      dataForm: {
        electricUserNumber: '', // 用户编号
        electricUserInstrument: '' // 用户表号
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 15,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      ignoreDialogVisible: false,
      ignoreDetailsVisible:false,
    }
  },
  components: {
    IgnoreDialog,
    IgnoreDetails
  },
  activated() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/electric/userignore/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          electricUserNumber:this.dataForm.electricUserNumber,    // 用户编号
          electricUserInstrument:this.dataForm.electricUserInstrument   // 用户表号
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          // 异常信息处理
          this.$message.error(data.msg)
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    query() {
      this.pageIndex = 1
      this.getDataList()
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
    },
    ignoreHnadle(id,detectionDay,ignoreStatus) {
      this.ignoreDialogVisible = true
      this.$nextTick(() => {
        this.$refs['ignoreDialog'].init([id],detectionDay,ignoreStatus)
      })
    },
    // 忽略详情
    ignoreDetailsHandle(electricUserNumber,electricUserInstrument,ignoreStatus){
      this.ignoreDetailsVisible = true
      this.$nextTick(()=>{
        this.$refs['ignoreDetails'].init(electricUserNumber,electricUserInstrument,ignoreStatus)
      })
    },
  }
}
</script>
