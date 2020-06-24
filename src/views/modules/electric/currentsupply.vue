<template>
  <div class="mod-calculateuser common">
    <!-- 供电基准页面 -->
    <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="query">
      <el-form-item>
        <el-input v-model="dataForm.electricUserNumber" placeholder="用户编号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="用户表号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
        <el-button v-if="isAuth('electric:currentsupply:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('electric:currentsupply:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        <el-button v-if="isAuth('electric:currentsupply:export')" type="success" @click="exportData">导出</el-button>
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
          <el-input v-model="dataForm.id" placeholder="用户表号" clearable style="width:200px;"></el-input>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="query">搜索</button>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="addOrUpdateHandle()" v-if="isAuth('electric:currentsupply:save')">新增</button>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="exportData" v-if="isAuth('electric:currentsupply:export')">全部导出</button>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="deleteHandle()" v-if="isAuth('electric:currentsupply:delete')" :disabled="dataListSelections.length <= 0" :class="{'disabled':dataListSelections.length <= 0}">批量删除</button>
        </li>
      </ul>
    </div>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="electricUserNumber" header-align="center" align="center" label="用户编号" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" label="用户表号" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="terminalAddress" header-align="center" align="center" label="终端地址" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="voltageChangeThan" header-align="center" align="center" width="100" label="电压变比值" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="electrorheologicalThan" header-align="center" align="center" width="100" label="电流变比值" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="formMeasurement" header-align="center" align="center" label="计量方式" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="contractCapacity" header-align="center" align="center" width="80" label="合同容量" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="modeConnection" header-align="center" align="center" label="接线方式" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="voltageClasses" header-align="center" align="center" label="电压等级">
      </el-table-column>
      <el-table-column prop="comprehensiveRatio" header-align="center" align="center" width="80" label="综合倍率" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('electric:currentsupply:update')" type="text" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('electric:currentsupply:delete')" type="text" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
      :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" :powerSupplyUnitDictData="powerSupplyUnitDictData"
      :marketingCenterDictData="marketingCenterDictData" :meterReaderDictData="meterReaderDictData"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './currentsupply-add-or-update'
  import {
    getDictData,
    excelDownload,
    exportDataToExcel
  } from '@/utils'
  export default {
    data() {
      return {
        dataForm: {
          id: '', // 用户表号(主键)
          electricUserNumber: '', // 用户编号
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
          url: this.$http.adornUrl('/electric/currentsupply/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'id':this.dataForm.id||'',       // 用户表号(主键)
            'electricUserNumber': this.dataForm.electricUserNumber||'',  // 用户编号
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
      query(){
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
            url: this.$http.adornUrl('/electric/currentsupply/delete'),
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
      exportData() {
        // loading
        /*this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/electric/currentsupply/export'),
          method: 'post',
          data:this.$http.adornData(this.dataForm, false)
        }).then(({
          data
        }) => {
          if (data.code == 0) {
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
				exportDataToExcel('/electric/currentsupply/export',this.dataForm).then(()=>{
				}).catch(err=>{
					this.$message.error(err)
				})
      }
    }
  }
</script>
