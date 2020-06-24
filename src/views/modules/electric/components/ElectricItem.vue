<template>
  <div style="height:100%;">
    <div class="electric" id="electric" v-show="!noData"></div>
    <h2 v-show="noData">暂无数据</h2>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'ElectricItem',
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
    // 初始化图表
    initChart() {
      let myChart = null
      if (myChart != null) {
        myChart.dispose()
      }
      myChart = echarts.init(document.getElementById('electric'))
      // 显示loading效果
      myChart.showLoading()
      this.getDetectionElectricity()
        .then(data => {
          // 隐藏loading效果
          myChart.hideLoading()
          /* let prev = null
          if (sessionStorage.getItem('electricData')) {
            prev = JSON.parse(sessionStorage.getItem('electricData'))
          }
          if (_.isEqual(prev, data)) return
          sessionStorage.setItem('electricData', JSON.stringify(data))
          console.log('三项电流 初始化图表') */
          this.noData = false
          // 暂无数据处理
          if (
            data.yA.length === 0 &&
            data.yB.length === 0 &&
            data.yC.length === 0 &&
            data.yTime.length === 0
          ) {
            myChart.clear()
            this.noData = true 
            return
          }
          var option = {
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
            xAxis: {
              type: 'category',
              name: '日期',
              /* axisLabel: {
              //决定是否显示数据
              show: true,
              interval: 0, //横轴信息全部显示
              rotate: -15 //-15度角倾斜显示
            }, */
              data: data.yTime // 时间刻度数据
            },
            yAxis: {
              name: '值'
            },
            dataZoom: [
              {
                show: true
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
      myChart = echarts.init(document.getElementById('electric'))
      if (
        data.yA.length === 0 &&
        data.yB.length === 0 &&
        data.yC.length === 0 &&
        data.yTime.length === 0
      ) {
        myChart.clear()
        this.noData = true 
        return
      }
      var option = {
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
        xAxis: {
          type: 'category',
          name: '日期',
          /* axisLabel: {
              //决定是否显示数据
              show: true,
              interval: 0, //横轴信息全部显示
              rotate: -15 //-15度角倾斜显示
            }, */
          data: data.yTime // 时间刻度数据
        },
        yAxis: {
          name: '值'
        },
        dataZoom: [
          {
            show: true
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
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    // 请求三项电流数据
    getDetectionElectricity() {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(
            '/electric/calculatedetection/detectionElectricity'
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
            // 返回数据
            resolve(data.data[0])
          } else {
            // 请求失败
            reject(data.msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
.electric {
  height: 100%;
  text-align: left;
}
</style>