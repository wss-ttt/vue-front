<template>
  <div class="mod-assessment common">
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
          <span>查询评估日期:</span>
          <el-date-picker v-model="selectDate" value-format="yyyyMMdd" @change="selectDateChange" type="daterange"
            align="center" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
            :picker-options="pickerOptions" style="width:260px;"></el-date-picker>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="query">搜索</button>
        </li>
        <li>
          <button type="button" class="bg-btn" @click="exportData"
            v-if="isAuth('electric:assessresult:export')">导出</button>
        </li>
      </ul>
    </div>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;" @row-click="openErrorLine">
      <el-table-column prop="id" header-align="center" align="center" width="80" label="ID">
      </el-table-column>
      <el-table-column prop="electricUserCode" header-align="center" align="center" label="用户编号"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="electricUserInstrument" header-align="center" align="center" label="用户表号"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="electricUserName" header-align="center" align="center" label="用户名称"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="terminalAddress" header-align="center" align="center" label="终端地址"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="detectionResult" header-align="center" align="center" label="评估结果"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="assessStatus" header-align="center" align="center" label="是否检测">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.assessStatus === '1'">是</el-tag>
          <el-tag type="danger" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tailAfterStatus" header-align="center" align="center" label="跟踪状态"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ trackStatus[scope.row.tailAfterStatus] }}
        </template>
      </el-table-column>
      <el-table-column prop="startTime" header-align="center" align="center" label="评估数据开始时间"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="endTime" header-align="center" align="center" label="评估数据结束时间"
        :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column prop="detectionDay" header-align="center" align="center" label="评估日期"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.tailAfterStatus !== 1" type="text"
            size="small" @click.stop="track(scope.row.id, scope.row.electricUserCode)">
            异常跟踪</el-button>
          <el-button v-else type="text" style="color:#ccc;cursor:no-drop;" @click.stop="return;">异常跟踪</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
      :page-sizes="[15, 30, 50, 100]" :page-size="pageSize" :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 异常评估折线图 -->
    <el-dialog :title="errorLine.electricUserCode + ' 异常评估折线图'" :visible.sync="errorLine.visible" width="40%">
      <div class="line-header">
        <ul>
          <li>
            <span>评估日期:</span>
            <el-date-picker v-model="errorLineSelectDate" value-format="yyyyMMdd" @change="errorLineSelectDateChange"
              type="daterange" align="center" unlink-panels range-separator="-" start-placeholder="开始日期"
              end-placeholder="结束日期" :picker-options="pickerOptions" :clearable="false" style="width:260px;">
            </el-date-picker>
          </li>
          <li>
            <button type="button" class="bg-btn" @click="errorLineSearch">搜索</button>
          </li>
        </ul>
      </div>
      <div class="line-body">
        <v-chart ref="errorLine" width="100%" height="100%" />
      </div>
      <span slot="footer">
        <button type="button" @click="errorLine.visible = false">取消</button>
        <button type="button" @click="errorLine.visible = false">确定</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    exportDataToExcel,
    getDictData
  } from '@/utils'
  import VChart from '@/components/chart/index'
  import echartsSettings from '@/echarts-settings'
  const {
    dataZoom,
    tooltip
  } = echartsSettings
  export default {
    data() {
      return {
        selectDate: '', // 查询日期
        errorLineSelectDate: '', // 误差折线图弹框中的查询日期
        errorLine: {
          electricUserCode: '', // 误差折线图弹框中的用户编号
          electricUserName: '', // 误差折线图弹框中的用户名称
          startTime: '', // 误差折线图弹框开始时间
          endTime: '', // 误差折线图弹框开始时间
          chartData: {}, // 误差折线图数据
          visible: false // 用户误差折线图弹框的显示和隐藏
        },
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
          electricUserCode: '', // 用户编号
          electricUserInstrument: '', // 用户表号
          electricUserName: '', // 用户名称
          startTime: '', // 开始日期
          endTime: '' // 结束日期
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 15,
        totalPage: 0,
        dataListLoading: false,
        trackStatus: [] // 保存字典数据 跟踪状态
      }
    },
    components: {
      VChart
    },
    computed: {
      defaultTime() {
        let start = new Date()
        let end = new Date(+start - 30 * 24 * 3600 * 1000)
        return [end.timeFormat('yyyyMMdd'), start.timeFormat('yyyyMMdd')]
      }
    },
    mounted() {
      // 获取供电单位字典数据
      getDictData('tail_after_status').then(res => {
        this.trackStatus = res
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
          url: this.$http.adornUrl('/electric/assessresult/list'),
          method: 'get',
          params: this.$http.adornParams({
            page: this.pageIndex,
            limit: this.pageSize,
            electricUserCode: this.dataForm.electricUserCode, // 用户编号
            electricUserInstrument: this.dataForm.electricUserInstrument, // 用户表号
            electricUserName: this.dataForm.electricUserName, // 用户名称
            startTime: this.dataForm.startTime, // 开始时间
            endTime: this.dataForm.endTime // 结束时间
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
      exportData() {
        exportDataToExcel('/electric/assessresult/export', this.dataForm).then(() => {}).catch(err => {
          this.$message.error(err)
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
      errorLineSelectDateChange(val) {
        this.errorLine.startTime = val[0] // 开始时间
        this.errorLine.endTime = val[1] // 结束时间
      },
      // 打开误差折线图
      openErrorLine(row) {
        this.errorLine.electricUserCode = row.electricUserCode // 用户编号
        this.errorLine.electricUserName = row.electricUserName // 用户名称
        this.errorLine.visible = true
        this.$nextTick(() => {
          this.errorLineSelectDate = this.selectDate || this.defaultTime
          // this.errorLineSelectDate = ['20190125', '20190202']
          this.errorLineSelectDateChange(this.errorLineSelectDate)
          this.$refs['errorLine'].showLoading()
          this.getErrorLineData().then(() => {
            this.$refs['errorLine'].hideLoading()
            this.$refs['errorLine'].initChart(this.errorLine.chartData)
            // 注意: 这个地方需要resize一下(否在在某些 场景下，图表会被压缩)
            this.$refs['errorLine'].myChart.resize()
          })
        })
      },
      // 显示误差折线图 搜索功能
      errorLineSearch() {
        this.$refs['errorLine'].showLoading()
        this.getErrorLineData().then(() => {
          this.$refs['errorLine'].hideLoading()
          this.$refs['errorLine'].initChart(this.errorLine.chartData)
        })
      },
      // 获取误差折线图数据
      getErrorLineData() {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/electric/assessresult/abnormalProbability'),
            method: 'get',
            params: this.$http.adornParams({
              electricUserCode: this.errorLine.electricUserCode, // 用户编号
              startTime: this.errorLine.startTime, // 开始时间
              endTime: this.errorLine.endTime // 结束时间
            })
          }).then(({
            data
          }) => {
            if (data && data.code === 0) {
              // 1.没有数据的情况
              if (Object.keys(data.data).length === 0) {
                this.errorLine.chartData = {}
                resolve()
                return
              }
              // 2.有数据的情况
              this.errorLine.chartData = {
                xAxis: {
                  name: '日期',
                  splitLine: {
                    show: false
                  },
                  // data: ['18/2/29', '18/2/28', '18/2/30']
                  data: data.data.xAxis
                },
                yAxis: {
                  name: '值',
                  splitLine: {
                    show: false
                  }
                },
                series: {
                  type: 'line',
                  smooth: true,
                  itemStyle: {
                    color: '#C0002A'
                  },
                  // data: [1, 2, 3]
                  data: data.data.seriesData
                },
                grid: {
                  top: 10,
                  right: 80,
                  bottom: 70,
                  left: 80
                },
                dataZoom: dataZoom,
                tooltip: {
                  ...tooltip,
                  formatter: params => {
                    let html = ''
                    if(params[0].data.symbolSize === 15) {
                      html += '异常状态' + '<br>'
                    }
                    html += params[0].name + '<br>' + params[0].marker + params[0].value
                    return html
                  }
                }
              }
              resolve()
            } else {
              this.$message.error(data.msg)
              reject()
            }
          })
        })
      },
      // 异常跟踪
      track(id, electricUserCode) {
        this.$confirm('确认进行异常跟踪操作吗？', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/electric/assessresult/updateUserRecordTail'),
            method: 'post',
            data: this.$http.adornData({
              id: id,
              electricUserCode: electricUserCode,
              tailAfterStatus: 1
            })
          }).then(({
            data
          }) => {
            if (data && data.code === 0) {
              this.$message({
                type: 'info',
                message: '操作成功！该用户可在“异常跟踪”功能页跟踪用电评估信息'
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          }).catch(() => {
            this.$message.erro('请求错误, 请重试...')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作取消!'
          })
        })
      }
    }
  }

</script>
<style scoped lang="scss">
  .line-header {
    ul {
      overflow: hidden;

      li {
        float: left;

        &+li {
          margin-left: 15px;
        }
      }
    }
  }

  .line-body {
    // height: 300px;
    height: 50vh;
    margin-top: 15px;
    // background: #ccc;
  }

</style>
<style lang="scss">
  .mod-assessment {
    .el-table tr {
      cursor: pointer;
    }
  }

</style>
