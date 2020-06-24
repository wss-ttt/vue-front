<template>
  <div class="mod-calculateimport common">
    <!-- 用电检测临时数据 -->
    <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="query">
			<el-form-item>
				<el-input v-model="dataForm.electricUserNumber" placeholder="用户编号" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="dataForm.electricUserInstrument" placeholder="用户表号" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-date-picker v-model="selectDate" @change="selectDateChange" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy年MM月dd日" value-format="yyyyMMdd" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button @click="query">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-upload action="#" ref="fileupload_1" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :show-file-list="false" :data="{type:1}" :http-request="uploadFile">
					<el-tooltip effect="dark" content="只能上传csv、xls、xslx文件" placement="bottom">
						<el-button v-if="isAuth('electric:calculateimport:import')" type="primary">
							上传(电流)
						</el-button>
					</el-tooltip>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-upload action="#" ref="fileupload_2" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :show-file-list="false" :data="{type:2}" :http-request="uploadFile">
					<el-tooltip effect="dark" content="只能上传xls、xslx文件" placement="bottom">
						<el-button v-if="isAuth('electric:calculateimport:import')" type="primary">
							上传(电压)
						</el-button>
					</el-tooltip>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-upload action="#" ref="fileupload_3" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :show-file-list="false" :data="{type:3}" :http-request="uploadFile">
					<el-tooltip effect="dark" content="只能上传xls、xslx文件" placement="bottom">
						<el-button v-if="isAuth('electric:calculateimport:import')" type="primary">
							上传(总功率因数)
						</el-button>
					</el-tooltip>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-upload action="#" ref="fileupload_4" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :show-file-list="false" :data="{type:4}" :http-request="uploadFile">
					<el-tooltip effect="dark" content="只能上传xls、xslx文件" placement="bottom">
						<el-button v-if="isAuth('electric:calculateimport:import')" type="primary">
							上传(有/无功率因数)
						</el-button>
					</el-tooltip>
				</el-upload>
			</el-form-item>
    </el-form> -->
    <div class="query-area">
      <ul>
        <li>
          <span>用户编号:</span>
          <el-input
            v-model="dataForm.electricUserNumber"
            placeholder="用户编号"
            clearable
            style="width:200px"
          ></el-input>
        </li>
        <li>
          <span>用户表号:</span>
          <el-input
            v-model="dataForm.electricUserInstrument"
            placeholder="用户表号"
            clearable
            style="width:200px"
          ></el-input>
        </li>
        <li>
          <span>查询时间:</span>
          <el-date-picker
            v-model="selectDate"
            :clearable="false"
            value-format="yyyyMMdd"
            @change="selectDateChange"
            type="daterange"
            align="center"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            style="width:260px;"
          ></el-date-picker>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="query">搜索</button>
        </li>
        <li>
          <el-tooltip effect="dark" content="只能上传xls、xslx文件" placement="bottom">
            <button type="button" class="bg-btn" @click="importFile">导入</button>
          </el-tooltip>
        </li>
      </ul>
    </div>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <!--<el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>-->
      <!--<el-table-column prop="id"
			 header-align="center"
			 align="center"
			 width="80"
			 label="ID">
      </el-table-column>-->
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
        prop="detectionVoltageA"
        header-align="center"
        align="center"
        width="80"
        label="电压A相"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="detectionVoltageB"
        header-align="center"
        align="center"
        width="80"
        label="电压B相"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="detectionVoltageC"
        header-align="center"
        align="center"
        width="80"
        label="电压C相"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="detectionElectricityA"
        header-align="center"
        align="center"
        width="80"
        label="电流A相"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="detectionElectricityB"
        header-align="center"
        align="center"
        width="80"
        label="电流B相"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="detectionElectricityC"
        header-align="center"
        align="center"
        width="80"
        label="电流C相"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="powerFactor"
        header-align="center"
        align="center"
        width="80"
        label="总功率"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="activePower"
        header-align="center"
        align="center"
        width="80"
        label="有功率"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="nothingPower"
        header-align="center"
        align="center"
        width="80"
        label="无功率"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="detectionDay" header-align="center" align="center" label="检测日期" :show-overflow-tooltip="true"></el-table-column>
      <!-- <el-table-column prop="detectionMinute" header-align="center" align="center" label="检测分钟">
      </el-table-column>-->
      <el-table-column prop="warehouseEntryTime" header-align="center" align="center" label="入库时间" :show-overflow-tooltip="true"></el-table-column>
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
      </el-table-column>-->
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <el-dialog :visible.sync="importFileVisible" title="导入" width="30%">
      <div class="fileType">
        <span>选择导入:</span>
        <el-radio-group v-model="fileType">
            <el-radio :label="1">电流</el-radio>
            <el-radio :label="2">电压</el-radio>
            <el-radio :label="3">总功率因素</el-radio>
            <el-radio :label="4">有/无功率因素</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="importFile">
        <button @click="importFileVisible = false">取消</button>
        <el-upload action="#" ref="fileupload_3" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :show-file-list="false" :data="{type:fileType}" :http-request="uploadFile">
						<button type="button" v-if="isAuth('electric:calculateimport:import')">
							确定
						</button>
				</el-upload>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AddOrUpdate from './calculatedetection-add-or-update'
import { excelDownload, getDictData, exportDataToExcel } from '@/utils'
export default {
  data() {
    return {
      selectDate: '', // 查询日期
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      dataForm: {
        electricUserNumber: '', // 用户编号
        electricUserInstrument: '', // 用户表号,
        startTime: '', // 开始日期
        endTime: '' // 结束日期
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 15,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      calculateSuccessDictData: '', // 保存是否计算字典数据
      importFileVisible:false,
      fileType:1,
    }
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/electric/calculateimport/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          electricUserNumber: this.dataForm.electricUserNumber, // 用户编号
          electricUserInstrument: this.dataForm.electricUserInstrument, // 用户表号
          startTime: this.dataForm.startTime, // 开始日期
          endTime: this.dataForm.endTime // 结束日期
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
      this.$confirm(
        `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/electric/calculateimport/delete'),
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
    exportData() {
      // loading
      /*this.dataListLoading = true
				this.$http({
					url: this.$http.adornUrl('/electric/calculateimport/export'),
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
      exportDataToExcel('/electric/calculateimport/export', this.dataForm)
        .then(() => {})
        .catch(err => {
          this.$message.error(err)
        })
    },
    uploadFile(item) {
      var type = item.data.type
      var file = item.file
      var form = new FormData()
      form.append('multipartFile', file)
      form.append('filePath', '')
      form.append('type', type)
      // 开启整夜loading效果
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$http({
        url: this.$http.adornUrl('/electric/calculateimport/import'),
        method: 'post',
        // headers: { "Content-Type": "multipart/form-data" } ,
        data: form
      })
        .then(({ data }) => {
          // 关闭loading效果
          loading.close()
          if (data && data.code === 0) {
            this.$message({
              message: '上传成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.importFileVisible = false
                this.getDataList()
              }
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
    },
    selectDateChange(val) {
      this.dataForm.startTime = val[0]
      this.dataForm.endTime = val[1]
    },
    // 导入文件
    importFile(){
      // 弹出模态窗口
      this.importFileVisible = true
    }
  }
}
</script>
<style lang="scss">
.mod-calculateimport{
  .importFile{
    >div{
      display: inline-block;
    }
  }
}
</style>