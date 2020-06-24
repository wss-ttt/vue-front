<template>
  <div class="region-top common">
    <div class="title">{{regionName}}各区域异常用电排名前十用户信息表</div>
    <div class="query-area">
      <ul class="left">
        <li>
          <span>区域查询:</span>
          <el-select
            v-model="regionId"
            placeholder="请选择"
            style="width:200px;"
            @change="regionChange"
          >
            <el-option
              v-for="item in regionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
          <button type="button" class="bg-btn" @click="getAssess">获取评估区间</button>
        </li>
        <li>
          <el-select v-model="detectionDay" @change="assessChange" style="width:200px;">
            <el-option
              v-for="(item,index) in assessment"
              :key="index.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <!-- 全部导出 -->
        <li>
          <button
            type="button"
            class="bg-btn"
            @click="exportAll()"
          >全部导出</button>
        </li>
        <!-- 批量忽略 -->
        <li>
          <button
            type="button"
            class="bg-btn"
            @click="ignoreHandle()"
            :disabled="dataListSelections.length <= 0"
            :class="{'disabled':dataListSelections.length <= 0}"
          >批量忽略</button>
        </li>
        <!-- 批量派单 -->
        <li>
          <button
            type="button"
            class="bg-btn"
            @click="dispatchHandle()"
            :disabled="dataListSelections.length <= 0"
            :class="{'disabled':dataListSelections.length <= 0}"
          >批量派单</button>
        </li>
      </ul>

    </div>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      @row-click="handleRowClick"
      style="width: 100%;"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="regionName"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="区域名称"
      ></el-table-column>
      <el-table-column
        prop="electricUserNumber"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="用户编号"
      ></el-table-column>
      <el-table-column
        prop="electricUserInstrument"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="用户表号"
      ></el-table-column>
      <el-table-column
        prop="electricUserName"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="用户名称"
      ></el-table-column>
      <el-table-column prop="detectionResult" align="center" label="评估结果" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="派单状态" align="center" prop="dispatchStatus" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.dispatchStatus === 0" type="danger">未派单</el-tag>
          <el-tag v-else type="success">已派单</el-tag>
        </template>
      </el-table-column>
      
      <!-- <el-table-column
        prop="serialNumber"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="流水号"
        width="220"
      ></el-table-column> -->
      <el-table-column fixed="right" header-align="center" align="center" width="270" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.ignoreStatus === 0"
            @click.stop="ignoreHandle(scope.row.electricUserNumber)"
          >忽略</el-button>
          <el-button v-else type="text" style="color:#ccc;cursor:no-drop;" @click.stop="return false">已忽略</el-button>
          <el-button
            v-if="scope.row.dispatchStatus === 0"
            type="text"
            @click.stop="dispatchHandle(scope.row.electricUserNumber)"
          >派单</el-button>
          <!-- <el-button
            v-else
            type="text"
            @click.stop="seeInfo(scope.row.serialNumber)"
          >查看</el-button> -->
          <el-button type="text" style="color:#ccc;cursor:no-drop;" v-else @click.stop="return false">已派单</el-button>
          <el-button type="text" @click.stop="ignoreDetailsHandle(scope.row.electricUserNumber,scope.row.electricUserInstrument)">忽略详情</el-button>
          <el-button type="text" @click.stop="dispatchDetailsHandle(scope.row.electricUserNumber,scope.row.electricUserInstrument)">派单详情</el-button>
        </template>
      </el-table-column>
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
    <!-- 忽略弹出框 -->
    <ignore-dialog v-if="ignoreDialogVisible" ref="ignoreDialog" @refreshDataList="getDataList" title="忽略"></ignore-dialog>
    <!-- 派单弹出框 -->
    <dispatch-dialog v-if="dispatchDialogVisible" ref="dispatchDialog" @refreshDataList="getDataList"></dispatch-dialog>
    <!-- 查看派单信息 -->
    <dispatch-info-dialog v-if="dispatchInfoDialogVisible" ref="dispatchInfoDialog"></dispatch-info-dialog>
    <!-- 忽略详情弹框 -->
    <ignore-details v-if="ignoreDetailsVisible" ref="ignoreDetails"></ignore-details>
    <!-- 派单详情 -->
    <dispatch-details v-if="dispatchDetailsVisible" ref="dispatchDetails"></dispatch-details>
  </div>
</template>

<script>
import IgnoreDialog from './IgnoreDialog'
import DispatchDialog from './DispatchDialog'
import DispatchInfoDialog from './DispatchInfoDialog'
import IgnoreDetails from './IgnoreDetails'
import DispatchDetails from './DispatchDetails'
import { exportDataToExcel,formatDate } from '@/utils'
export default {
  components: {
    IgnoreDialog,
    DispatchDialog,
    DispatchInfoDialog,
    IgnoreDetails,
    DispatchDetails
  },
  props: {},
  data() {
    return {
      selectDate: '', // 保存日期选择器选择的时间值
      regionId: '', // 区域编号
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
      regionList: [
      ],
      assessment: [], // 评估区间
      dataList: [],
      pageIndex: 1,
      pageSize: 15,
      totalPage: 0,
      dataListLoading: false,
      detectionDay: '',
      dataListSelections: [], // 多选
      ignoreDialogVisible: false,
      dispatchDialogVisible: false,
      dispatchInfoDialogVisible: false,
      ignoreDetailsVisible:false,
      dispatchDetailsVisible:false,
    }
  },
  watch: {},
  computed: {
    regionName() {
      return this.$store.state.common.userRegion.regionName
    },
  },
  activated(){
    // 获取传递过来的参数-- start
    if(sessionStorage.getItem('selectDateMapToRegionTop')){
      this.selectDate = JSON.parse(sessionStorage.getItem('selectDateMapToRegionTop'))
    }
    if(sessionStorage.getItem('assessmentMapToRegionTop')){
      this.assessment = JSON.parse(sessionStorage.getItem('assessmentMapToRegionTop'))
    }
    if(sessionStorage.getItem('detectionDayMapToRegionTop')){
      this.detectionDay = sessionStorage.getItem('detectionDayMapToRegionTop')
    }
    // 获取参数过来的参数-- end
    if (this.assessment.length) {
      // 从其他页面跳转进行的
      this.getDataList()
    }else{
      // 从菜单点击进入
      this.getAssess()
    }
  },
  created() {},
  mounted() {
    // 获取区域数据
    this.regionList = JSON.parse(sessionStorage.getItem('regionList'))
    this.regionList = [
      {
        label: '全部',
        value: ''
      }
    ].concat(this.regionList)
    // test: 设置默认时间
    this.selectDate = ['20190201', '20190228']
    /* let now = new Date()
    let oneDay = 24*3600*1000 // 一天的毫秒数
    let endTime = formatDate(now) 
    let startTime = formatDate(new Date(+now - 90*oneDay))
    this.selectDate = [startTime,endTime] */
    // this.getAssess()
  },
  destroyed(){
    // 还原操作
    // test: 设置默认时间
    this.selectDate = ['20190201', '20190228']
    /* let now = new Date()
    let oneDay = 24*3600*1000 // 一天的毫秒数
    let endTime = formatDate(now) 
    let startTime = formatDate(new Date(+now - 90*oneDay))
    this.selectDate = [startTime,endTime] */
    sessionStorage.setItem('selectDateMapToRegionTop',JSON.stringify(this.selectDate))
    sessionStorage.setItem('assessmentMapToRegionTop','')
  },
  methods: {
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/electric/homeRegion/region'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          countNumber: 10,
          detectionDay: this.detectionDay,
          regionId: this.regionId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        }
        this.dataListLoading = false
      })
    },
    // 区域选择改变事件
    regionChange(val) {
      this.regionId = val
      this.getDataList()
    },
    // 时间日期选择改变事件
    selectDateChange(val) {
      this.selectDate = val
      sessionStorage.setItem('selectDateMapToRegionTop',JSON.stringify(this.selectDate))
    },
    // 评估区间改变事件
    assessChange(val) {
      this.detectionDay = val
      sessionStorage.setItem('detectionDayMapToRegionTop',this.detectionDay)
      this.getDataList()
    },
    // 获取评估区间
    getAssess() {
      this.$store
        .dispatch({
          type: 'electric/getAssess',
          startTime: this.selectDate[0],
          endTime: this.selectDate[1]
        })
        .then(res => {
          if (res.length) {
            this.assessment = res
            sessionStorage.setItem('assessmentMapToRegionTop',JSON.stringify(this.assessment))
            // 默认选中第一个
            this.detectionDay = this.assessment[0]['value']
            sessionStorage.setItem('detectionDayMapToRegionTop',this.detectionDay)
            this.getDataList()
          } else {
            this.assessment = res
            sessionStorage.setItem('assessmentMapToRegionTop',JSON.stringify(this.assessment))
            this.detectionDay = ''
            sessionStorage.setItem('detectionDayMapToRegionTop',this.detectionDay)
            this.getDataList()
          }
        })
        .catch(err => {
          console.log(err)
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
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 忽略派单
    ignoreHandle(id){
      this.ignoreDialogVisible = true
      this.$nextTick(() => {
        let ids = id
          ? [id]
          : this.dataListSelections.map(item => {
              return item.electricUserNumber
            })
        this.$refs['ignoreDialog'].init(ids, this.detectionDay, 1)
      })
    },
    // 进行派单
    dispatchHandle(id){
      this.dispatchDialogVisible = true
      this.$nextTick(() => {
        let ids = id
          ? [id]
          : this.dataListSelections.map(item => {
              return item.electricUserNumber
            })
        this.$refs['dispatchDialog'].init(ids, this.detectionDay)
      })
    },
    // 查看派单信息
    seeInfo(id){
      this.dispatchInfoDialogVisible = true
      this.$nextTick(() => {
        this.$refs['dispatchInfoDialog'].init(id)
      })
    },
    // 行单击事件
    handleRowClick(row, column, event){
      sessionStorage.setItem('electricUserInstrument', row.electricUserInstrument)
      sessionStorage.setItem('selectDate',JSON.stringify(this.selectDate))   // 时间组件时间
      sessionStorage.setItem('detectionResult', row.detectionResult) // 检测结果
      sessionStorage.setItem('detectionDay', this.detectionDay)    // 检测日期
      this.$router.push({
        name: 'electric-details'
      })
    },
    // 全部导出
    exportAll() {
      exportDataToExcel('/electric/homeRegion/exportRegion', {
        detectionDay: this.detectionDay,  // 导出时间节点
        type: 6, //导出类型
        regionId: this.regionId, // 区域编号
        countNumber: 10, // 导出条数
        electricUserNumber: this.electricUserNumber, // 用户编号
        electricUserInstrument: this.electricUserInstrument // 用户表号
      })
        .then(() => {})
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 忽略详情
    ignoreDetailsHandle(electricUserNumber,electricUserInstrument){
      this.ignoreDetailsVisible = true
      this.$nextTick(()=>{
        this.$refs['ignoreDetails'].init(electricUserNumber,electricUserInstrument,2)
      })
    },
    // 派单详情
    dispatchDetailsHandle(electricUserNumber,electricUserInstrument){
      this.dispatchDetailsVisible = true
      this.$nextTick(()=>{
        this.$refs['dispatchDetails'].init(electricUserNumber,electricUserInstrument)
      })
    }
  }
}
</script>
<style scoped lang="scss">
.region-top{
  .query-area {
    // background-color: #ccc;
    overflow: hidden;
    padding: 15px 0;
    ul {
      &.left {
        li {
          float: left;
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.region-top{
  .el-table__row {
    cursor: pointer;
  }
  .el-table__body tr.hover-row>td{
    background-color: rgb(232, 247, 246)
  }
}
</style>