<template>
  <div class="mod-manage common">
    <div class="title">{{regionName}}异常用电管理</div>
    <div class="query-area">
      <ul class="search">
        <!-- 区域选择 -->
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
        <!-- 行业选择 -->
        <li>
          <span>行业查询:</span>
          <el-select v-model="industryId" @change="industryChange" style="width:200px;">
            <el-option
              v-for="(item,index) in industryList"
              :key="index.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <!-- 状态选择 -->
        <li>
          <span>状态选择:</span>
          <el-select v-model="status">
            <el-option
              v-for="item in statusList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            >
              <span class="status" :class="item.className"></span>
              <span>{{item.label}}</span>
            </el-option>
          </el-select>
        </li>
        <!-- 用户编号 -->
        <li>
          <span>用户编号:</span>
          <el-input v-model="electricUserNumber" placeholder="用户编号" clearable style="width:200px;"></el-input>
        </li>
        <!-- 用户表号 -->
        <li>
          <span>用户表号:</span>
          <el-input
            v-model="electricUserInstrument"
            placeholder="用户表号"
            clearable
            style="width:200px;"
          ></el-input>
        </li>
        <!-- 时间选择 -->
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
        <!-- 获取评估区间按钮 -->
        <li>
          <button type="button" class="bg-btn" @click="getAssess">获取评估区间</button>
        </li>
        <!-- 评估区间选择 -->
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
        <!-- 搜索按钮 -->
        <li>
          <button type="button" class="bg-btn" @click="query">搜索</button>
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
      <!--<el-table-column prop="id"
			 header-align="center"
			 align="center"
			 width="80"
			 label="ID">
      </el-table-column>-->
      <el-table-column label="等级" prop="status" width="50" align="center">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="statusLabel[scope.row.status]" placement="top">
            <span class="status" :class="statusClassNames[scope.row.status]"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="区域名称" prop="regionName" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column
        label="行业名称"
        prop="industryName"
        align="center"
        :show-overflow-tooltip="true"
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
      <!-- <el-table-column prop="serialNumber" align="center" label="流水号" width="220" :show-overflow-tooltip="true"></el-table-column> -->
      <el-table-column fixed="right" align="center" width="270" label="操作">
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
    <ignore-dialog
      v-if="ignoreDialogVisible"
      ref="ignoreDialog"
      @refreshDataList="getDataList"
      title="忽略"
    ></ignore-dialog>
    <!-- 派单的确认弹框 -->
    <dispatch-dialog
      v-if="dispatchDialogVisible"
      ref="dispatchDialog"
      @refreshDataList="getDataList"
    ></dispatch-dialog>
    <!-- 查看派单的弹框 -->
    <dispatch-info-dialog v-if="dispatchInfoDialogVisible" ref="dispatchInfoDialog"></dispatch-info-dialog>
    <!-- 忽略详情弹框 -->
    <ignore-details v-if="ignoreDetailsVisible" ref="ignoreDetails"></ignore-details>
    <!-- 派单详情 -->
    <dispatch-details v-if="dispatchDetailsVisible" ref="dispatchDetails"></dispatch-details>
  </div>
</template>

<script>
import QueryBox from '@/components/query-box.vue'
import IgnoreDialog from './IgnoreDialog'
import DispatchDialog from './DispatchDialog'
import DispatchInfoDialog from './DispatchInfoDialog'
import IgnoreDetails from './IgnoreDetails'
import DispatchDetails from './DispatchDetails'
import { exportDataToExcel,formatDate } from '@/utils'
export default {
  name: '',
  data() {
    return {
      electricUserNumber: '', // 用户编号
      electricUserInstrument: '', // 用户表号
      selectDate: '', // 时间空间的选中的时间值
      assessment: [], // 评估区间
      regionId: '', // 区域id
      regionList: [], // 区域数据
      industryId: '', // 行业选中的值
      industryList: [], // 行业数据
      status: 6, // 状态
      statusList: [
        {
          label: '全部',
          value: 6,
          className: 'all'
        },
        {
          label: '严重',
          value: 1,
          className: 'serious'
        },
        {
          label: '重要',
          value: 2,
          className: 'important'
        },
        {
          label: '较重要',
          value: 3,
          className: 'little-important'
        },
        {
          label: '一般',
          value: 4,
          className: 'just'
        },
        {
          label: '忽略',
          value: 5,
          className: 'ignore'
        }
      ],
      dataListLoading: false, // loading
      dataListSelections: [], // 多选
      // 分页数据
      pageIndex: 1,
      pageSize: 15, // 每一页显示的数量
      totalPage: 0, // 总条数
      dataList: [], // 表格数据
      detectionDay: '', // 时间节点
      url: '/electric/manage/selectAnomalyResult',
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
      ignoreDialogVisible: false,
      dispatchDialogVisible: false,
      dispatchInfoDialogVisible: false,
      ignoreDetailsVisible:false,
      dispatchDetailsVisible:false,
    }
  },
  computed: {
    regionName() {
      return this.$store.state.common.userRegion.regionName
    },
    statusClassNames() {
      return this.statusList.map(item => {
        return item.className
      })
    },
    statusLabel() {
      return this.statusList.map(item => {
        return item.label
      })
    }
  },
  activated() {
    // 获取从监控地图跳转进来的数据
    // 时间
    if(sessionStorage.getItem('selectDateMapToManage')){
      this.selectDate = JSON.parse(sessionStorage.getItem('selectDateMapToManage'))
    }
    if(sessionStorage.getItem('assessmentMapToManage')){
      this.assessment = JSON.parse(sessionStorage.getItem('assessmentMapToManage'))
    }
    // 检测日期
    if(sessionStorage.getItem('detectionDayMapToManage')){
      this.detectionDay = sessionStorage.getItem('detectionDayMapToManage')
    }
    // 区域id
    if(sessionStorage.getItem('regionNameMapToManage')){
      let region = this.regionList.filter(item=>{
        if(item.label ===  sessionStorage.getItem('regionNameMapToManage')){
          return item
        }
      })
      this.regionId = region[0].value
    }
    // 点击的是饼状图 行业id
    if(sessionStorage.getItem('industryIdMapToManage')){
      this.industryId = sessionStorage.getItem('industryIdMapToManage')
    }

    if (this.assessment.length) {
      this.getDataList()
    }else{
      // 获取评估区间
      this.getAssess()
    }
    
  },
  mounted() {
    // test: 设置默认时间
    this.selectDate = ['20190201', '20190228']
    // 动态设置初始时间
    /* let now = new Date()
    let oneDay = 24*3600*1000 // 一天的毫秒数
    let endTime = formatDate(now) 
    let startTime = formatDate(new Date(+now - 90*oneDay))
    this.selectDate = [startTime,endTime] */
    // 获取行业数据
    this.industryList = JSON.parse(sessionStorage.getItem('industryList'))
    this.industryList = [
      {
        label: '全部',
        value: ''
      }
    ].concat(this.industryList)
    // 获取区域数据
    this.regionList = JSON.parse(sessionStorage.getItem('regionList'))
    this.regionList = [
      {
        label: '全部',
        value: ''
      }
    ].concat(this.regionList)
    // 一进入页面手动调用一次时间组件改变事件
    // this.selectDateChange(this.selectDate)
  },
  destroyed(){
    // 需要进行还原操作
    this.selectDate = ['20190201', '20190228']
    // 动态设置初始时间
    /* let now = new Date()
    let oneDay = 24*3600*1000 // 一天的毫秒数
    let endTime = formatDate(now) 
    let startTime = formatDate(new Date(+now - 90*oneDay))
    this.selectDate = [startTime,endTime] */
    sessionStorage.setItem('selectDateMapToManage',JSON.stringify(this.selectDate))
    sessionStorage.setItem('assessmentMapToManage','')
    sessionStorage.setItem('regionNameMapToManage','全部')
    sessionStorage.setItem('industryIdMapToManage','')
  },
  methods: {
    // 获取数据列表
    getDataList() {
      // 显示loading效果
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(this.url),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          type: this.status,
          regionId: this.regionId, // 区域编号
          industryId: this.industryId, // 行业编号
          detectionDay: this.detectionDay,
          electricUserNumber: this.electricUserNumber, // 用户编号
          electricUserInstrument: this.electricUserInstrument // 用户表号
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          // 提示报错信息
          this.$message.error(data.msg)
          this.dataList = []
          this.totalPage = 0
        }
        // 隐藏loading效果
        this.dataListLoading = false
      })
    },
    query() {
      this.pageIndex = 1
      this.getDataList()
    },
    // 时间选择改变事件
    selectDateChange(val) {
      this.selectDate = val
      sessionStorage.setItem('selectDateMapToManage',JSON.stringify(this.selectDate))
    },
    // 评估区间选择改变事件
    assessChange(val) {
      this.detectionDay = val
      sessionStorage.setItem('detectionDayMapToManage',this.detectionDay)
      this.getDataList()
    },
    // 区域下拉框改变事件
    regionChange(val) {
      let obj = this.regionList.find(item=>{
        return item.value === val
      })
      sessionStorage.setItem('regionNameMapToManage',obj.label)
    },
    // 行业下拉框改变事件
    industryChange(val) {
      sessionStorage.setItem('industryIdMapToManage',val)
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
            sessionStorage.setItem('assessmentMapToManage',JSON.stringify(this.assessment))
            // 默认选中第一个
            this.detectionDay = this.assessment[0]['value']
            sessionStorage.setItem('detectionDayMapToManage',this.detectionDay)
            this.getDataList()
          } else {
            this.assessment = res
            sessionStorage.setItem('assessmentMapToManage',JSON.stringify(this.assessment))
            this.detectionDay = ''
            sessionStorage.setItem('detectionDayMapToManage',this.detectionDay)
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
    
    // 行单击事件
    handleRowClick(row, column, event) {
      sessionStorage.setItem('electricUserInstrument', row.electricUserInstrument)
      sessionStorage.setItem('selectDate',JSON.stringify(this.selectDate))  // 时间组件
      sessionStorage.setItem('detectionResult', row.detectionResult) // 检测结果
      sessionStorage.setItem('detectionDay', this.detectionDay)    // 检测日期
      // sessionStorage.setItem('assessment',JSON.stringify(this.assessment))  // 评估区间
      this.$router.push({
        name: 'electric-details'
      })
    },
    // 全部导出
    exportAll() {
      exportDataToExcel('/electric/manage/exportManage', {
        detectionDay: this.detectionDay,  // 导出时间节点
        type: this.status, //导出类型
        regionId: this.regionId, // 区域编号
        industryId: this.industryId, // 行业编号
        electricUserNumber: this.electricUserNumber, // 用户编号
        electricUserInstrument: this.electricUserInstrument // 用户表号
      })
        .then(() => {})
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 忽略派单
    ignoreHandle(id) {
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
    // 派单
    dispatchHandle(id) {
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
    seeInfo(id) {
      this.dispatchInfoDialogVisible = true
      this.$nextTick(() => {
        this.$refs['dispatchInfoDialog'].init(id)
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
  },
  components: {
    QueryBox,
    IgnoreDialog,
    DispatchDialog,
    DispatchInfoDialog,
    IgnoreDetails,
    DispatchDetails
  }
}
</script>

<style lang="scss" scoped="scoped">
.mod-manage {
  .query-area {
    overflow: hidden;
    padding: 15px 0;
    ul.search {
      li {
        float: left;
        margin-right: 15px;
        margin-top: 5px;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
<style lang="scss">
.mod-manage {
  .el-table__row {
    cursor: pointer;
  }
  .el-table__body tr.hover-row>td{
    background-color: rgb(232, 247, 246)
  }
}
// "状态"样式
.status {
  width: 20px;
  height: 20px;
  background-color: #ccc;
  border-radius: 50%;
  display: inline-block;
  // 严重
  &.serious {
    background-color: #c0002a;
  }
  // 重要
  &.important {
    background-color: #f56800;
  }
  // 较重要
  &.little-important {
    background-color: #f5a100;
  }
  // 一般
  &.just {
    background-color: #f5ca00;
  }
  // 忽略
  &.ignore {
    background-color: #007069;
  }
}
.el-select-dropdown__item {
  display: flex;
  align-items: center;
  > span {
    &:first-child {
      margin-right: 5px;
    }
  }
}
</style>