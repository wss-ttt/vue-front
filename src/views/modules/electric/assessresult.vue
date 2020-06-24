<template>
  <div class="mod-assessresult common">
    <!-- 用电检测页面 -->
    <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="query">
      <el-form-item>
        <el-input v-model="dataForm.electricUserNumber" placeholder="用户编号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.electricUserInstrument" placeholder="用户表号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
        <el-button v-if="isAuth('electric:assessresult:export')" type="success" @click="exportData">全部导出</el-button>
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
        <li>
          <button type="button" class="bg-btn" @click="exportData" v-if="isAuth('electric:assessresult:export')">全部导出</button>
        </li>
      </ul>
    </div>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <!--<el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>-->
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="electricUserNumber"
        header-align="center"
        align="center"
        label="用户编号"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="electricUserInstrument"
        header-align="center"
        align="center"
        label="用户表号"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="terminalAddress"
        header-align="center"
        align="center"
        label="终端地址"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="detectionResult"
        header-align="center"
        align="center"
        label="评估结果"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="assessStatus"
        header-align="center"
        align="center"
        label="是否检测">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.assessStatus === '1'">是</el-tag>
          <el-tag type="danger" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="detectionDay"
        header-align="center"
        align="center"
        label="评估日期"
        :show-overflow-tooltip="true">
      </el-table-column>
      <!-- 不需要修改操作-->
      <!-- <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[15, 30, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './assessresult-add-or-update'
  import { excelDownload,exportDataToExcel} from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          electricUserNumber: ''    ,   // 用户编号
          electricUserInstrument:''    // 用户表号
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 15,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/electric/assessresult/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'electricUserNumber':this.dataForm.electricUserNumber,    // 用户编号
            'electricUserInstrument':this.dataForm.electricUserInstrument   // 用户表号
          })
        }).then(({data}) => {
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
      query(){
        this.pageIndex = 1
        this.getDataList()
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/electric/assessresult/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
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
      exportData() {
      	// loading
      	/*this.dataListLoading = true
      	this.$http({
      		url: this.$http.adornUrl('/electric/assessresult/export'),
      		method: 'post',
      		data:this.$http.adornData(this.dataForm, false)
      	}).then(({
      		data
      	}) => {
      		if(data.code == 0) {
      			this.dataListLoading = false
      			var fileName = data.msg
      			this.$http({
      				url: this.$http.adornUrl('/common/download'),
      				method: 'get',
      				params: this.$http.adornParams({
      					'fileName': data.msg,
      					'delete': true
      				}),
      				responseType: 'blob'
      			}).then(({
      				data
      			}) => {
      				// 导出表格
      				excelDownload(data, fileName)
      			})
      		} else {}
      	})*/
				exportDataToExcel('/electric/assessresult/export',this.dataForm).then(()=>{
				}).catch(err=>{
					this.$message.error(err)
				})
      }
    }
  }
</script>
