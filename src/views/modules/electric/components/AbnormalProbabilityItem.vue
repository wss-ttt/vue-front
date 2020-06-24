<template>
  <div style="height:100%;">
    <div class="abnormalProbability" id="abnormalProbability" v-show="!noData"></div>
    <h2 v-show="noData">暂无数据</h2>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'AbnormalProbabilityItem',
  data() {
    return {
      noData: false 
    }
  },
  props: {
    // 开始时间
    startTime: {
      type: String
    },
    // 结束时间
    endTime: {
      type: String
    },
    // 用户表号
    id: {
      type: String
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      let myChart = null
      if (myChart != null) {
        myChart.dispose()
      }
      myChart = echarts.init(document.getElementById('abnormalProbability'))
      // 显示loading效果
      myChart.showLoading()
      this.getAbnormalProbability()
        .then(data => {
          // 隐藏loading效果
          myChart.hideLoading()
          /* let prev = null
          if (sessionStorage.getItem('abnormalProbabilityData')) {
            prev = JSON.parse(sessionStorage.getItem('abnormalProbabilityData'))
          }
          // 如果两次的数据相同后面的就不执行
          if (_.isEqual(prev, data)) return
          // 保存数据
          sessionStorage.setItem(
            'abnormalProbabilityData',
            JSON.stringify(data)
          )
          console.log('异常概率 初始化图表') */
          this.noData = false
          if (data['xDate'].length === 0 && data['yValue'].length === 0) {
            myChart.clear()
            this.noData = true 
            return
          }
          var option = {
            // legend: {
            //   data: ['异常概率', '供电电流', '参考电流'],
            //   orient: 'vertical',
            //   right: 0
            // },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            dataZoom: [
              {
                show: true
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
              name: '值',
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
              // {
              // 		name:'供电电流',
              // 		data: [489, 470, 580, 760, 2000, 890, 480],
              // 		type: 'line'
              // 	},
              // 	{
              // 		name:'参考电流',
              // 		data: [389, 500, 698, 758, 1458, 798, 400],
              // 		type: 'line'
              // 	},
            ]
          }
          // 清空画布 防止缓存
          myChart.clear()
          myChart.setOption(option)
          window.addEventListener('resize', () => {
            myChart.resize()
          })
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    init(data) {
      let myChart = null
      this.noData = false
      myChart = echarts.init(document.getElementById('abnormalProbability'))
      if (data['xDate'].length === 0 && data['yValue'].length === 0) {
        myChart.clear()
        this.noData = true 
        return
      }
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        dataZoom: [
          {
            show: true
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
          name: '值',
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
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    // 请求异常概率数据
    getAbnormalProbability() {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(
            '/electric/assessresult/abnormalProbability'
          ),
          method: 'get',
          params: this.$http.adornParams(
            {
              startTime: this.startTime,
              endTime: this.endTime,
              electricUserInstrument: this.id // 表号
            },
            false
          )
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // var arr = [data.data.xDate, data.data.yValue]
            // resolve(arr)
            resolve(data.data)
          } else {
            reject(data.msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
.abnormalProbability {
  height: 100%;
}
</style>