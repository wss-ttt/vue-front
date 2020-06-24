<template>
  <div class="mod-details common">
    <div class="title">异常用电详情</div>
    <!-- <div class="query-area">
      <ul>
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
          ></el-date-picker>
        </li>
      </ul>
    </div> -->
    <!--详情展示-->
    <el-table :data="dataTable" border style="width: 100%;" class="my-table">
      <el-table-column
        label="用户编号"
        :show-overflow-tooltip="true"
        align="center"
        width="160"
        prop="electricUserNumber"
      ></el-table-column>
      <el-table-column
        label="用户表号"
        :show-overflow-tooltip="true"
        align="center"
        width="160"
        prop="id"
      ></el-table-column>
      <el-table-column
        label="用户名称"
        :show-overflow-tooltip="true"
        align="center"
        prop="electricUserName"
      ></el-table-column>
      <el-table-column
        label="区域名称"
        :show-overflow-tooltip="true"
        align="center"
        prop="regionName"
      ></el-table-column>
      <el-table-column
        label="行业名称"
        :show-overflow-tooltip="true"
        align="center"
        prop="industryName"
      ></el-table-column>
      <el-table-column
        label="用户地址"
        :show-overflow-tooltip="true"
        align="center"
        prop="electricityAddress"
      ></el-table-column>
      
      <el-table-column
        label="电压变比值"
        :show-overflow-tooltip="true"
        align="center"
        width="100"
        prop="voltageChangeThan"
      ></el-table-column>
      <el-table-column
        label="电流变比值"
        :show-overflow-tooltip="true"
        align="center"
        width="100"
        prop="electrorheologicalThan"
      ></el-table-column>
      <el-table-column
        label="计量方式"
        :show-overflow-tooltip="true"
        align="center"
        width="100"
        prop="formMeasurement"
      ></el-table-column>
      <el-table-column
        label="合同容量"
        :show-overflow-tooltip="true"
        align="center"
        width="80"
        prop="contractCapacity"
      ></el-table-column>
      <el-table-column
        label="接线方式"
        :show-overflow-tooltip="true"
        align="center"
        width="100"
        prop="modeConnection"
      ></el-table-column>
      <el-table-column
        label="评估结果"
        :show-overflow-tooltip="true"
        align="center"
        width="80"
        prop="detectionResult"
      ></el-table-column>
      <el-table-column prop="dispatchStatus" align="center" label="派单状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.dispatchStatus === 0" type="danger">未派单</el-tag>
          <el-tag v-else type="success">已派单</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ignoreStatus" align="center" label="忽略状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ignoreStatus === 0" type="danger">未忽略</el-tag>
          <el-tag v-else type="success">已忽略</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" width="270" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="isAuth('electric:manage:updateIgnore') && scope.row.ignoreStatus === 0"
            @click.stop="ignoreHandle(scope.row.electricUserNumber)"
          >忽略</el-button>
          <el-button v-if="isAuth('electric:manage:updateIgnore') && scope.row.ignoreStatus === 1" type="text" style="color:#ccc;cursor:no-drop;">已忽略</el-button>
          <el-button
            v-if="isAuth('electric:manage:updateDispach') && scope.row.dispatchStatus === 0"
            type="text"
            @click.stop="dispatchHandle(scope.row.electricUserNumber)"
          >派单</el-button>
          <!-- <el-button
            v-if="isAuth('electric:manage:updateDispach') && scope.row.dispatchStatus === 1"
            type="text"
            @click.stop="seeInfo(scope.row.serialNumber)"
          >查看</el-button> -->
          <el-button type="text" style="color:#ccc;cursor:no-drop;" v-else @click.stop="return false">已派单</el-button>
          <el-button type="text" @click.stop="ignoreDetailsHandle(scope.row.electricUserNumber,scope.row.electricUserInstrument)">忽略详情</el-button>
          <el-button type="text" @click.stop="dispatchDetailsHandle(scope.row.electricUserNumber,scope.row.electricUserInstrument)">派单详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="charts">
      <el-row style="height:100%;">
        <el-col :span="24">
          <div class="left">
            <ul>
              <li
                v-for="(item,index) in tabs"
                :key="index"
                @click="tabChart(item.name)"
                :class="{'active':isShow === item.name,'disabled':isShow === item.name}"
              >{{item.title}}</li>
            </ul>
            <div style="clear:both;"></div>
            <div class="showCharts" v-loading="loading" ref="showCharts"></div>
            <div class="noData" v-show="noData">暂无数据,请重新查询</div>
          </div>
        </el-col>
      </el-row>
    </div> -->
    <div class="charts">
      <div class="l-charts" v-loading="loading">
          <ul class="tabs">
            <li
              v-for="(item,index) in tabs"
              :key="index"
              @click="tabChart(item.name)"
              :class="{'active':isShow === item.name,'disabled':isShow === item.name}"
            >{{item.title}}</li>
          </ul>
          <ul class="date">
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
              ></el-date-picker>
            </li>
          </ul>
          <div class="showCharts"  ref="showCharts"></div>
          <!-- <div class="noData" v-show="noData">暂无数据,请重新查询</div> -->
      </div>
    </div>
    <!-- 忽略的确认弹框 -->
    <ignore-dialog
      v-if="ignoreDialogVisible"
      ref="ignoreDialog"
      @refreshDataList="getDetails"
      title="忽略"
    ></ignore-dialog>
    <!-- 派单的确认弹框 -->
    <dispatch-dialog
      v-if="dispatchDialogVisible"
      ref="dispatchDialog"
      @refreshDataList="getDetails"
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
// 此种实现方法应该是最优的
import echarts from 'echarts'
import IgnoreDialog from './IgnoreDialog'
import DispatchDialog from './DispatchDialog'
import DispatchInfoDialog from './DispatchInfoDialog'
import IgnoreDetails from './IgnoreDetails'
import DispatchDetails from './DispatchDetails'
let myChart = null   // echart实例
let oBox = null // dom
let timer = null
export default {
  name: 'details',
  data() {
    return {
      id: '', // 保存用户表号
      selectDate: '', // 保存日期选择器选择的时间值
      detectionResult: '', // 检测结果
      detectionDay:'',    // 检测日期
      dataTable: [], // 保存表格数据
      isShow: 'AbnormalProbabilityItem', // 默认显示异常概率
      noData: false, // 控制'暂无数据'的显示和隐藏
      tabs: [
        {
          title: '异常概率',
          name: 'AbnormalProbabilityItem'
        },
        {
          title: '三相电压',
          name: 'VoltageItem'
        },
        {
          title: '三相电流',
          name: 'ElectricItem'
        },
        {
          title: '功率因数',
          name: 'PowerItem'
        }
      ],
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
      abnormalProbabilityObj: {}, // 异常概率数据
      detectionElectricityObj: {}, // 三项电流数据
      detectionVoltageObj: {}, // 三项电压数据
      detectionPowerObj: {}, // 功率数据
      loading: false,
      ignoreDialogVisible: false,
      dispatchDialogVisible: false,
      dispatchInfoDialogVisible: false,
      ignoreDetailsVisible:false,
      dispatchDetailsVisible:false,
      isCan:true
    }
  },
  deactivated(){
    // window.removeEventListener('')
    // 注销onresize事件
    this.isCan = false
    clearTimeout(timer)
    // window.onresize = null
    window.removeEventListener('resize',this.adjustChartsHeight)
  },
  activated() {
    this.isCan = true
    window.removeEventListener('resize',this.adjustChartsHeight)
    window.addEventListener('resize',this.adjustChartsHeight)
    // 1 主动触发一次resize事件
    let myEvent = new Event('resize')
    window.dispatchEvent(myEvent)
    // 2 对图表进行重绘 达到自适应的效果
    // myChart ? myChart.resize() : ''
    myChart && myChart.resize()
    // 用户编号
    this.id = sessionStorage.getItem('electricUserInstrument')
    this.selectDate = JSON.parse(sessionStorage.getItem('selectDate')) // 时间组件日期
    this.detectionResult = sessionStorage.getItem('detectionResult') // 检测结果
    this.detectionDay = sessionStorage.getItem('detectionDay')     // 检测日期
    this.getDetails()
    this.selectDateChange(this.selectDate)
  },
  mounted() {
    this.$nextTick(()=>{
      this.adjustChartsHeight()
      oBox = document.querySelector('.showCharts')
    })
    /* window.addEventListener('resize',()=>{
      this.$nextTick(()=>{
        this.adjustChartsHeight()
      })
    }) */
    /* let that = this
    window.onresize = function () {
     that.$nextTick(()=>{
       that.adjustChartsHeight()
     }) 
    } */
    window.addEventListener('resize',this.adjustChartsHeight)
  },
  methods: {
    // 时间组件选择器改变事件处理方法
    selectDateChange(val) {
      // 重新存一次时间数据
      // sessionStorage.setItem('selectDate',this.selectDate)
      // 一次性获取所有的数据
      // 异常概率数据
      let p1 = this.getAbnormalProbability()
      let p2 = this.getDetectionTriphaseData()
      this.loading = true
      Promise.all([p1, p2]).then(res => {
        this.loading = false
        this.abnormalProbabilityObj = res[0]['xDate'].length
          ? res[0]
          : {}
        this.detectionElectricityObj = res[1]['electricity'][0]['yA'].length
          ? res[1]['electricity'][0]
          : {}
        this.detectionVoltageObj = res[1]['voltage'][0]['yA'].length
          ? res[1]['voltage'][0]
          : {}
        this.detectionPowerObj = res[1]['power'][0]['yA'].length
          ? res[1]['power'][0]
          : {}
        this.tabChart(this.isShow)
      })
    },
    // 获取详细信息
    getDetails() {
      this.$http({
        url: this.$http.adornUrl('/electric/manage/electricityDetails'),
        method: 'get',
        params: this.$http.adornParams({
          id: this.id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var res = data.page
          res['detectionResult'] = this.detectionResult
          // 每次进入到该页面时,情况表格的数据
          this.dataTable = []
          this.dataTable.push(res)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 切换图表
    tabChart(name) {
      this.isShow = name
      this.toggleChart(name)
    },
    toggleChart(name) {
      switch (name) {
        case 'AbnormalProbabilityItem':
          this.initChart(1, this.abnormalProbabilityObj,'评估值')
          break
        case 'ElectricItem':
          this.initChart(0, this.detectionElectricityObj,'电流值')
          break
        case 'VoltageItem':
          this.initChart(0, this.detectionVoltageObj,'三相值')
          break
        case 'PowerItem':
          this.initChart(0, this.detectionPowerObj,'功率值')
          break
      }
    },
    // 请求异常概率数据
    getAbnormalProbability() {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(
            '/electric/assessresult/abnormalProbability'
          ),
          method: 'get',
          params: this.$http.adornParams({
            startTime: this.selectDate[0],
            endTime: this.selectDate[1],
            electricUserInstrument: this.id // 表号
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            resolve(data.data)
          } else {
            reject(data.msg)
          }
        })
      })
    },
    // 请求 三项电流 三项电压 功率(一起返回数据)
    getDetectionTriphaseData() {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(
            '/electric/calculatedetection/detectionTriphaseData'
          ),
          method: 'get',
          params: this.$http.adornParams({
            startTime: this.selectDate[0],
            endTime: this.selectDate[1],
            electricUserInstrument: this.id // 表号
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // 返回数据
            resolve(data.data)
          } else {
            // 请求失败
            reject(data.msg)
          }
        })
      })
    },
    // 初始化图表
    initChart(type, data,yAxisName) {
      /* let oBox = document.querySelector('.showCharts')
      if (myChart != null) {
        myChart.dispose()
      }
      myChart = echarts.init(oBox) */
      /* oBox.removeAttribute('_echarts_instance_')
      myChart.clear()
      this.noData = false
      if (Object.keys(data).length === 0) {
        this.noData = true
        return
      } */
      if(Object.keys(data).length === 0){
        oBox.removeAttribute('_echarts_instance_')
        oBox.innerHTML = '<div style="text-align:center;font-size:24px;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);font-weight: bold;">暂无数据,请重试</div>'
        return
      }
      if(!echarts.getInstanceByDom(oBox)){
        myChart = echarts.init(oBox)
      } 
      let option = type
        ? {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid:{
              top:'100px'
            },
            dataZoom: [
              {
                show: true,
              }
            ],
            xAxis: {
              type: 'category',
              name: '日期',
              // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              data: data['xDate']
            },
            yAxis: {
              type: 'value',
              name: yAxisName,
              splitLine: {
                show: false // 去掉y轴上的分割线
              }
            },
            series: [
              {
                name: '异常概率',
                // data: [820, 932, 901, 934, 1290, 1330, 1320],
                data: data['yValue'],
                type: 'line'
              }
            ]
          }
        : {
            legend: {
              data: ['A相', 'B相', 'C相']
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid:{
              top:'100px'
            },
            xAxis: {
              type: 'category',
              name: '日期',
              data: data.yTime // 时间刻度数据
            },
            yAxis: {
              name: yAxisName
            },
            dataZoom: [
              {
                show: true,
              }
            ],
            series: [
              {
                name: 'A相',
                data: data.yA,
                symbolSize: 2,
                type: 'scatter'
              },
              {
                name: 'B相',
                data: data.yB,
                symbolSize: 2,
                type: 'scatter'
              },
              {
                name: 'C相',
                data: data.yC,
                symbolSize: 2,
                type: 'scatter'
              }
            ]
          }
      myChart.clear()
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    // 忽略派单
    ignoreHandle(id) {
      this.ignoreDialogVisible = true
      this.$nextTick(() => {
        this.$refs['ignoreDialog'].init([id], this.detectionDay, 1)
      })
    },
    // 派单
    dispatchHandle(id) {
      this.dispatchDialogVisible = true
      this.$nextTick(() => {
        this.$refs['dispatchDialog'].init([id], this.detectionDay)
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
    },
    /*动态设置类名为charts的div的高度*/
    adjustChartsHeight(){
      // let totalH = document.querySelector('.mod-details').offsetHeight
      let totalH = this.documentClientHeight - 50 - 40 - 15*2 - 15*2 
      let tH = document.querySelector('.mod-details .title').offsetHeight
      let tableH = document.querySelector('.mod-details .my-table').offsetHeight
      // let qH = document.querySelector('.mod-details .query-area').offsetHeight
      // let h = totalH - tH - tableH - qH - 15  // 还需要减去margin-top:15px的距离
      let h = totalH - tH - tableH - 15 - 15  // 还需要减去margin-top:15px的距离 有两个地方有15的margin
      let oCharts = document.querySelector('.mod-details .charts')
      oCharts.style.height = h + 'px'
    }
  },
  components: {
    IgnoreDialog,
    DispatchDialog,
    DispatchInfoDialog,
    IgnoreDetails,
    DispatchDetails
  },
  computed:{
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold }
    },
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight
      }
    }
  },
  watch:{
    sidebarFold:{
      handler(newVal,oldVal){
        if(this.isCan){
            timer = setTimeout(()=>{
              this.adjustChartsHeight()
              myChart.resize()
            },0)
        }
      }
    }
  },
}
</script>

<style lang="scss" scoped="scoped">
.mod-details{
  height: 100%;
  .title{
    margin-bottom:15px;
  }
  // min-height: 562px;
  .charts{
    margin-top:15px;
    // min-height: 400px;
    
    .l-charts {
      // height: 520px;
      height: 100%;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      padding: 15px;
      position: relative;
      overflow: hidden;
      /*background-color: #66AFE9;*/
      ul.tabs {
        padding-left: 0;
        margin: 0;
        // display: flex;
        // justify-content: flex-start;
        position: absolute;
        top:100px;
        // background-color: #1acd7e;
        z-index:100;
        li {
          cursor: pointer;
          margin-bottom: 30px;
          width: 90px;
          height: 40px;
          line-height: 40px;
          // background-color: #57b8ad;
          background-color: #dedede;
          // color: #fff;
          color: #000;
          box-shadow: 0px 2px 4px 0px rgba(105, 105, 105, 0.54);
          border-radius: 4px;
          text-align: center;
          &.active {
            background-color: #57b8ad;
            color: #fff;
          }
          &:last-child{
            margin-bottom: 0;
          }
        }
      }
      ul.date{
        position: absolute;
        z-index:100;
      }
      .showCharts {
        // height: 420px;
        width: 100%;
        height: 100%;
        // background-color: #57b8ad;
        /*background-color: #ccc;*/
      }
      .noData {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        font-weight: bold;
      }
    }
  }

  .right {
    height: 490px;
    /*background-color: #ddd;*/
  }
  .disabled {
    pointer-events: none;
  }
}
</style>