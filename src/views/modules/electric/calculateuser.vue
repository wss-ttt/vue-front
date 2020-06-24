<template>
  <div class="mod-calculateuser common">
<!--     <el-form :inline="true" :model="dataForm" @keyup.enter.native="query">
      <el-form-item label="用户编号:">
        <el-input v-model="dataForm.electricUserNumber" placeholder="用户编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户表号:">
        <el-input v-model="dataForm.electricUserInstrument" placeholder="用户表号" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户名称:">
        <el-input v-model="dataForm.electricUserName" placeholder="用户名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
        <el-button
          v-if="isAuth('electric:calculateuser:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >新增</el-button>
        <el-button
          v-if="isAuth('electric:calculateuser:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button>
        <el-button
          v-if="isAuth('electric:calculateuser:export')"
          type="success"
          @click="exportData"
        >导出</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
          action="#"
          ref="fileupload"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :show-file-list="false"
          :http-request="uploadFile"
        >
          <el-tooltip effect="dark" content="只能上传xls、xslx文件" placement="bottom">
            <el-button v-if="isAuth('electric:calculateuser:implort')" type="primary">导入</el-button>
          </el-tooltip>
        </el-upload>
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
          <span>用户名称:</span>
          <el-input v-model="dataForm.electricUserName" placeholder="用户名称" clearable style="width:200px;"></el-input>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="query">搜索</button>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="addOrUpdateHandle()" v-if="isAuth('electric:calculateuser:save')">新增</button>
        </li>
        <li>
          <el-upload
          action="#"
          ref="fileupload"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :show-file-list="false"
          :http-request="uploadFile"
        >
          <el-tooltip effect="dark" content="只能上传xls、xslx文件" placement="bottom">
            <button v-if="isAuth('electric:calculateuser:implort')" class="bg-btn">导入</button>
          </el-tooltip>
        </el-upload>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="exportData" v-if="isAuth('electric:calculateuser:export')">全部导出</button>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0" :class="{'disabled':dataListSelections.length <= 0}" v-if="isAuth('electric:calculateuser:delete')">批量删除</button>
        </li>
      </ul>
    </div>
    <el-table
      :data="dataList"
      class="my-table"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="electricUserNumber" header-align="center" align="center" label="用户编号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column
        prop="electricUserInstrument"
        header-align="center"
        align="center"
        label="用户表号"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="electricUserName"
        header-align="center"
        align="center"
        width="500"
        :show-overflow-tooltip="true"
        label="用户名称"
      ></el-table-column>
      <el-table-column
        prop="powerSupplyUnit"
        header-align="center"
        align="center"
        label="供电单位"
        :formatter="formatterColumn"
        :show-overflow-tooltip="true"
      >
        <!-- <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">市区供电单位</el-tag>
          <el-tag v-else size="small">省供电单位</el-tag>
        </template>-->
      </el-table-column>
      <el-table-column
        prop="marketingCentre"
        header-align="center"
        align="center"
        label="营销分中心"
        :formatter="formatterColumn"
        :show-overflow-tooltip="true"
      >
        <!-- <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">市区供电单位</el-tag>
          <el-tag v-else size="small">省供电单位</el-tag>
        </template>-->
      </el-table-column>
      <el-table-column
        prop="meterReader"
        header-align="center"
        align="center"
        label="抄表部门"
        :formatter="formatterColumn"
        :show-overflow-tooltip="true"
      >
        <!-- <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">市区供电单位</el-tag>
          <el-tag v-else size="small">省供电单位</el-tag>
        </template>-->
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('electric:calculateuser:update')"
            type="text"
            @click="addOrUpdateHandle(scope.row.id)"
          >修改</el-button>
          <el-button
            v-if="isAuth('electric:calculateuser:delete')"
            type="text"
            @click="deleteHandle(scope.row.id)"
          >删除</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
      :powerSupplyUnitDictData="powerSupplyUnitDictData"
      :marketingCenterDictData="marketingCenterDictData"
      :meterReaderDictData="meterReaderDictData"
    ></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './calculateuser-add-or-update'
import {
  getDictData,
  excelDownload,
  exportDataToExcel,
} from '@/utils'
export default {
  data() {
    return {
      dataForm: {
        electricUserNumber: '', // 用户编号
        electricUserInstrument: '', // 用户表号
        electricUserName: '' // 用户名称
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 15,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      powerSupplyUnitDictData: '', // 保存供电单位字典数据
      marketingCenterDictData: '', // 保存营销中心字典数据
      meterReaderDictData: '', // 保存抄表部门字典数据
      url: '/electric/calculateuser/list'
    }
  },
  components: {
    AddOrUpdate
  },
  activated() {
    // 获取供电单位字典数据
    var p1 = getDictData('power_supply_unit')
    // 获取营销中心字典数据
    var p2 = getDictData('marketing_centre')
    // 获取抄表部门字典数据
    var p3 = getDictData('meter_reader')
    Promise.all([p1, p2, p3]).then(res => {
      this.powerSupplyUnitDictData = res[0]
      this.marketingCenterDictData = res[1]
      this.meterReaderDictData = res[2]
      this.getDataList()
    })
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(this.url),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          electricUserNumber: this.dataForm.electricUserNumber, // 用户编号
          electricUserInstrument: this.dataForm.electricUserInstrument, // 用户表号
          electricUserName: this.dataForm.electricUserName // 用户名称
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
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.id
          })
      // this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
      this.$confirm(`确定进行删除操作吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/electric/calculateuser/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
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
        })
        .catch(() => {})
    },
    formatterColumn(row, column) {
      if (column.property === 'powerSupplyUnit') {
        // 供电单位
        // column.property获取的是列名称  row[column.property] 获取的是对应的值
        return this.powerSupplyUnitDictData[row[column.property]]
      } else if (column.property === 'marketingCentre') {
        // 营销分中心
        return this.marketingCenterDictData[row[column.property]]
      } else if (column.property === 'meterReader') {
        // 抄表部门
        return this.meterReaderDictData[row[column.property]]
      }
    },
    exportData() {
      // loading
      /*this.dataListLoading = true
				this.$http({
					url: this.$http.adornUrl('/electric/calculateuser/export'),
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
      exportDataToExcel('/electric/calculateuser/export', this.dataForm)
        .then(() => {})
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 导入文件
    uploadFile(item) {
      var file = item.file
      var form = new FormData()
      form.append('multipartFile', file)
      form.append('filePath', '')
      // 开启整夜loading效果
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$http({
        url: this.$http.adornUrl('/electric/calculateuser/implort'),
        method: 'post',
        data: form
      })
        .then(({ data }) => {
          // 关闭loading效果
          loading.close()
          if (data && data.code === 0) {
            this.$message({
              message: '上传成功',
              type: 'success'
            })
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(error => {
          // 关闭loading效果
          loading.close()
          this.$message.error(error)
        })
    }
    // 获取字典数据
    /* getDictData(dictName){
			  this.$http({
			    url:this.$http.adornUrl('/sys/sysdictdata/list'),
			    method:'get',
			    params: this.$http.adornParams({
			      'dict_type': dictName
			    })
			  }).then(({data})=>{
			    var arr = []
			    data.forEach(function(item,index){
			      arr[item.dictValue] = item.dictLabel
			    })
			    this.dictData = arr
			  })
			} */
  }
}
</script>