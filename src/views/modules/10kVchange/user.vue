<template>
  <div class="mod-user common">
    <div class="query-area">
      <ul>
        <li>
          <span>用户编号:</span>
          <el-input v-model="dataForm.electricUserCode" placeholder="用户编号" clearable style="width:200px;"></el-input>
        </li>
        <li>
          <span>用户表号:</span>
          <el-input v-model="dataForm.electricUserInstrument" placeholder="用户表号" clearable style="width:200px;">
          </el-input>
        </li>
        <li>
          <span>用户名称:</span>
          <el-input v-model="dataForm.electricUserName" placeholder="用户名称" clearable style="width:200px;"></el-input>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="query">搜索</button>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="downloadTemplate">下载模板</button>
        </li>
        <li style="display:flex;align-items: center;">
          <el-upload action="#" ref="fileupload"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :show-file-list="false" :http-request="uploadFile">
            <el-tooltip effect="dark" content="只能上传xls、xslx文件" placement="bottom">
              <button v-if="isAuth('record:userrecord:implort')" class="bg-btn">导入</button>
            </el-tooltip>
          </el-upload>
          <span v-if="isAuth('record:userrecord:implort')" style="color:#ccc;">注意:只能上传xls、xslx文件</span>
        </li>
      </ul>
    </div>
    <el-table :data="dataList" class="my-table" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="electricUserCode" header-align="center" align="center" label="用户编号"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="electricUserInstrument" header-align="center" align="center" label="用户表号"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="electricUserName" header-align="center" align="center" :show-overflow-tooltip="true"
        label="用户名称"></el-table-column>
      <el-table-column prop="powerSupplyUnit" header-align="center" align="center" label="供电单位"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ powerSupplyUnitDictData[scope.row.powerSupplyUnit] }}
        </template>
      </el-table-column>

      <el-table-column prop="ct" header-align="center" align="center" :show-overflow-tooltip="true" label="电流变比值">
      </el-table-column>
      <el-table-column prop="pt" header-align="center" align="center" :show-overflow-tooltip="true" label="电压变比值">
      </el-table-column>
      <el-table-column prop="formMeasurement" header-align="center" align="center" :show-overflow-tooltip="true"
        label="计量方式"></el-table-column>
      <el-table-column prop="contractCapacity" header-align="center" align="center" :show-overflow-tooltip="true"
        label="合同容量"></el-table-column>
      <el-table-column prop="modeConnection" header-align="center" align="center" :show-overflow-tooltip="true"
        label="接线方式"></el-table-column>
      <el-table-column prop="voltageClasses" header-align="center" align="center" :show-overflow-tooltip="true"
        label="电压等级"></el-table-column>
      <el-table-column prop="comprehensiveRatio" header-align="center" align="center" :show-overflow-tooltip="true"
        label="综合倍率"></el-table-column>
      <el-table-column prop="marketingCentre" header-align="center" align="center" label="营销分中心"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ marketingCenterDictData[scope.row.marketingCentre] }}
        </template>
      </el-table-column>
      <el-table-column prop="meterReader" header-align="center" align="center" label="抄表部门"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ meterReaderDictData[scope.row.meterReader] }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
      :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
  </div>
</template>

<script>
  import {
    getDictData,
    excelDownload
  } from '@/utils'
  import { validateFile } from '@/utils/validate.js'
  export default {
    data() {
      return {
        dataForm: {
          electricUserCode: '', // 用户编号
          electricUserInstrument: '', // 用户表号
          electricUserName: '' // 用户名称
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 15,
        totalPage: 0,
        dataListLoading: false,
        powerSupplyUnitDictData: [], // 保存供电单位字典数据
        marketingCenterDictData: [], // 保存营销中心字典数据
        meterReaderDictData: [], // 保存抄表部门字典数据
        url: '/record/userrecord/list'
      }
    },
    components: {},
    mounted() {
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
      })
    },
    activated() {
      this.getDataList()
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
            electricUserCode: this.dataForm.electricUserCode, // 用户编号
            electricUserInstrument: this.dataForm.electricUserInstrument, // 用户表号
            electricUserName: this.dataForm.electricUserName // 用户名称
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
      // 导入文件
      uploadFile(item) {
        let file = item.file
        let res = validateFile(file, {
          suffixTypes: ['.xls', '.xlsx'], // 文件格式
          fileMaxSize: 50, // 文件大小
        })
        if (!res.status) {
          this.$message.error(res.msg)
          return
        }
        let form = new FormData()
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
            url: this.$http.adornUrl('/record/userrecord/userImplort'),
            method: 'post',
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
                type: 'success'
              })
              // 刷新
              this.getDataList()
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
      // 下载模板
      downloadTemplate() {
        this.$http({
          url: this.$http.adornUrl('/common/downloadModel'),
          method: 'get',
          params: this.$http.adornParams({
            modelType: 1
          }),
          responseType: 'blob'
        }).then(({data}) => {
          excelDownload(data, '10kV用户档案模板.xlsx')
        }).catch(() => {
          this.$message.error('请求错误, 请重试...')
        })
      }
    }
  }

</script>
