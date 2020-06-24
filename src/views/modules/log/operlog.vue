<template>
  <div class="mod-log common">
    <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="query">
			<el-form-item>
				<el-input v-model="dataForm.username" placeholder="用户名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="dataForm.operation" placeholder="用户操作" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="query">查询</el-button>
				<el-button v-if="isAuth('sys:log:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
				<el-button v-if="isAuth('sys:log:deleteAll')" type="danger" @click="deleteAll">清空日志</el-button>
			</el-form-item>
		</el-form> -->
    <div class="query-area">
      <ul>
        <li>
          <span>用户名:</span>
          <el-input v-model="dataForm.username" placeholder="用户名" clearable style="width:200px;"></el-input>
        </li>
        <li>
          <span>用户操作:</span>
          <el-input v-model="dataForm.operation" placeholder="用户操作" clearable style="width:200px;"></el-input>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="query">搜索</button>
        </li>
        <li>
          <button type="button" class="bg-btn" v-if="isAuth('sys:log:deleteAll')" @click="deleteAll">清空日志</button>
        </li>
        <li>
          <button type="button" class="bg-btn" v-if="isAuth('sys:log:delete')" @click="deleteHandle()"
            :disabled="dataListSelections.length <= 0"
            :class="{'disabled':dataListSelections.length <= 0}">批量删除</button>
        </li>
      </ul>
    </div>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
      style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center"  label="ID">
      </el-table-column>
      <el-table-column prop="username" header-align="center" align="center"  label="用户名"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="operation" header-align="center" align="center"  label="用户操作"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="time" header-align="center" align="center"  label="执行时长(毫秒)"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="ip" header-align="center" align="center"  label="IP地址"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="createDate" header-align="center" align="center"  label="创建时间"
        :show-overflow-tooltip="true">
      </el-table-column>
      <!-- <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:log:delete')" type="text" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column> -->
    
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
      :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dataForm: {
          username: '', // 用户名
          operation: '', // 用户操作
        	logType: 1
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 15,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [], // 多选
      }
    },
    created() {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/log/list'),
          method: 'get',
          params: this.$http.adornParams({
            page: this.pageIndex,
            limit: this.pageSize,
            logType: this.dataForm.logType, // type
            username: this.dataForm.username, // 用户名
            operation: this.dataForm.operation // 用户操作
          })
        }).then(({
          data
        }) => {
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
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val
      },
      deleteHandle(id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        // this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        this.$confirm(`确定进行删除操作吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/log/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({
            data
          }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})

      },
      // 清空
      deleteAll() {
        this.$confirm(`确定要清空所有日志数据吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/log/deleteAll'),
            method: 'post',
          }).then(({
            data
          }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      }
    }
  }

</script>
