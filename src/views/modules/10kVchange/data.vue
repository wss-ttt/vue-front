<template>
  <div class="mod-data common">
    <div class="query-area">
      <ul>
        <li>
          <span>用户编号:</span>
          <el-input v-model="dataForm.electricUserNumber" placeholder="用户编号" clearable style="width:200px"></el-input>
        </li>
        <li>
          <span>用户表号:</span>
          <el-input v-model="dataForm.electricUserInstrument" placeholder="用户表号" clearable style="width:200px">
          </el-input>
        </li>
        <li>
          <span>检测日期:</span>
          <!-- <el-date-picker v-model="selectDate" value-format="yyyyMMdd" @change="selectDateChange" type="daterange"
            align="center" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
            :picker-options="pickerOptions" style="width:260px;"></el-date-picker> -->
            <el-select v-model="dataForm.detectionDay" width="200px">
              <el-option v-for="(item, index) in detectionDayOptions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="query">搜索</button>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="downloadTemplate">下载模板</button>
        </li>
        <li>
          <el-tooltip effect="dark" content="只能上传xls、xslx文件" placement="bottom">
            <button type="button" class="bg-btn" @click="importFile">导入</button>
          </el-tooltip>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="startAnalysis">开始分析</button>
        </li>
      </ul>
    </div>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="electricUserNumber" header-align="center" align="center" label="用户编号"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="electricUserInstrument" header-align="center" align="center" label="用户表号"
        :show-overflow-tooltip="true"></el-table-column>

      <el-table-column prop="detectionVoltageA" header-align="center" align="center" width="80" label="电压A相"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="detectionVoltageB" header-align="center" align="center" width="80" label="电压B相"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="detectionVoltageC" header-align="center" align="center" width="80" label="电压C相"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="detectionElectricityA" header-align="center" align="center" width="80" label="电流A相"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="detectionElectricityB" header-align="center" align="center" width="80" label="电流B相"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="detectionElectricityC" header-align="center" align="center" width="80" label="电流C相"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="powerFactor" header-align="center" align="center" width="80" label="总功率"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="activePower" header-align="center" align="center" width="80" label="有功功率"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="nothingPower" header-align="center" align="center" width="80" label="无功功率"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="detectionDay" header-align="center" align="center" label="检测日期"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="warehouseEntryTime" header-align="center" align="center" label="入库时间"
        :show-overflow-tooltip="true"></el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
      :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <el-dialog :visible.sync="importFileVisible" title="导入" width="580px">
      <div class="fileType">
        <span>选择导入:</span>
        <el-radio-group v-model="fileType">
          <el-radio :label="1">电流</el-radio>
          <el-radio :label="2">电压</el-radio>
          <el-radio :label="3">总功率因数</el-radio>
          <el-radio :label="4">有功/无功功率</el-radio>
          <el-radio :label="5" v-if="isAuth('electric:calculateimport:importcsv')">检测数据</el-radio>
        </el-radio-group>
      </div>
      <div class="tips">
        <span style="color:#ccc;">注意:只能上传xls、xslx文件,同时只能选择15000行以内数据</span>
      </div>
      <span slot="footer" class="importFile">
        <button @click="importFileVisible = false">取消</button>
        <el-upload action="#" ref="fileupload_3"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :show-file-list="false" :data="{type:fileType}" :http-request="uploadFile">
          <button type="button" v-if="isAuth('electric:calculateimport:import')">确定</button>
        </el-upload>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { validateFile } from '@/utils/validate.js'
  import {
    excelDownload
  } from '@/utils'
  export default {
    data() {
      return {
        // selectDate: '', // 查询日期
        pickerOptions: {
          shortcuts: [{
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
          endTime: '', // 结束日期
          detectionDay: '', // 检测日期
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 15,
        totalPage: 0,
        dataListLoading: false,
        importFileVisible: false,
        fileType: 1,
        detectionDayOptions: []
      }
    },
    components: {},
    mounted() {
      this.getDetectionDay().then(() => {
        if (this.detectionDayOptions.length) {
          // 1.默认选中第一个
          this.dataForm.detectionDay = this.detectionDayOptions[0]['value']
          this.getDataList()
        }
      })
    },
    activated() {
    },
    methods: {
      // 获取数据列表
      getDataList() {
        if (this.detectionDayOptions.length) {
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('/electric/calculateimport/list'),
            method: 'get',
            params: this.$http.adornParams({
              page: this.pageIndex,
              limit: this.pageSize,
              electricUserNumber: this.dataForm.electricUserNumber, // 用户编号
              electricUserInstrument: this.dataForm.electricUserInstrument, // 用户表号
              // startTime: this.dataForm.startTime, // 开始日期
              // endTime: this.dataForm.endTime, // 结束日期
              detectionDay: this.dataForm.detectionDay, // 检测日期
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
        }
      },
      query() {
        if (!this.detectionDayOptions.length) return
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
      uploadFile(item) {
        let type = item.data.type
        let file = item.file
        let res = validateFile(file, {
          suffixTypes: ['.xls', '.xlsx', '.csv'], // 文件格式
          fileMaxSize: 50, // 文件大小
        })
        if (!res.status) {
          this.$message.error(res.msg)
          return
        }
        let form = new FormData()
        form.append('multipartFile', file)
        form.append('filePath', '')
        form.append('type', type)
        // 开启整屏loading效果
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)'
        })
        this.$http({
            url: this.$http.adornUrl('/electric/calculateimport/import'),
            method: 'post',
            // headers: { "Content-Type": "multipart/form-data" } ,
            data: form
          })
          .then(({
            data
          }) => {
            // 关闭loading效果
            loading.close()
            if (data && data.code === 0) {
              this.$message({
                message: '上传成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.importFileVisible = false
                  // 重新更新 查询时间数据 和 list数据
                  this.getDetectionDay().then(() => {
                    if (this.detectionDayOptions.length) {
                      // 1.默认选中第一个
                      this.dataForm.detectionDay = this.detectionDayOptions[0]['value']
                      this.getDataList()
                    }
                  })
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
        if (!val) {
          // 清空时，没有选中任何事件范围
          this.dataForm.startTime = ''
          this.dataForm.endTime = ''
        } else {
          this.dataForm.startTime = val[0]
          this.dataForm.endTime = val[1]
        }
      },
      // 导入文件
      importFile() {
        // 弹出模态窗口
        this.importFileVisible = true
      },
      // 开始分析
      startAnalysis() {

        // 开启整屏loading效果
        const loading = this.$loading({
          lock: true,
          text: '正在分析数据是否正确,请稍等...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)'
        })
        this.$http({
          url: this.$http.adornUrl('/electric/calculateimport/checkImportCount'),
          method: 'post'
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {
            let status = data.data.status // 状态 1:表示正常 0：表示异常
            // 关闭loading
            loading.close()
            this.$alert(data.data.prompt, '提示', {
              confirmButtonText: '确定',
              type: status ? 'warning' : 'error',
              callback: action => {
              }
            })
          } else {
            // 1.关闭loading
            loading.close()
            // 2.提示
            this.$message.error(data.msg)
          }
        }).catch(() => {
          // 1.关闭loading
          loading.close()
          // 2.提示消失
          this.$message.error('请求错误，请确认文件大小!')
        })
      },
      // 获取查询时间
      getDetectionDay() {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/electric/calculateimport/selectImportDay'),
            method: 'get',
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.detectionDayOptions = data.data.map(item => {
                return {
                  label: item,
                  value: item
                }
              })
              resolve()
            } else {
              this.$message.error(data.msg)
              reject()
            }
          })
        })
      },
      // 下载模板
      downloadTemplate() {
        this.$http({
          url: this.$http.adornUrl('/common/downloadModel'),
          method: 'get',
          params: this.$http.adornParams({
            modelType: 2
          }),
          responseType: 'blob'
        }).then(({data}) => {
          excelDownload(data, '10kV专变用户检测数据模板.zip')
        }).catch(() => {
          this.$message.error('请求错误, 请重试...')
        })
      }
    }
  }

</script>
<style lang="scss">
  .mod-data {
    .importFile {
      >div {
        display: inline-block;
      }
    }
  }
  .el-loading-spinner{
    .el-icon-loading{
      font-size: 40px;
    }
    .el-loading-text{
      font-size: 40px;
    }
  }

</style>
