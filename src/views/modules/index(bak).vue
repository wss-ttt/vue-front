<template>
  <div class="home">
    <div class="item">
      <v-chart ref="changeAbnormalEval" height="100%" width="100%" />
    </div>
    <div class="item">
      <v-chart ref="measAbnormalEval" height="100%" width="100%" />
    </div>
    <div class="item">
      <v-chart ref="changeUserNum" height="100%" width="100%" />
    </div>
    <div class="item">
      <v-chart ref="measNum" height="100%" width="100%" />
    </div>
  </div>
</template>

<script>
  import VChart from '@/components/chart/index'
  import echarts from 'echarts'
  import echartsSettings from '@/echarts-settings'
  const {
    grid,
    tooltip
  } = echartsSettings
  export default {
    components: {
      VChart
    },
    props: {},
    data() {
      return {
        changeAbnormalEvaltData: {}, // 10kV专变用户异常评估
        changeUserNumData: {}, // 10kV专变用户数量
        measAbnormalEvalData: {}, // 变电站计量点异常评估
        measNumData: {} // 变电站计量点数量
      }
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
      // 0.test
      // this.test()

      // 1.init
      this.init()
      
    },
    activated() {
      console.log('activated')
      this.init()
    },
    deactivated() {},
    updated() {},
    destroyed() {},
    methods: {
      // 0.test
      test() {
        // 1.获取10kV专变用户异常评估范围分布图数据
        this.changeAbnormalEvaltData = {
          title: {
            text: '10kV专变用户异常评估范围分布图',
            subtext: '2020-06-02',
            left: 'center'
          },
          xAxis: {
            name: '异常评估(单位: %)',
            type: 'category',
            splitLine: {
              show: false
            },
            data: [
              '0-10',
              '11-20',
              '21-30',
              '31-40',
              '41-50',
              '51-60',
              '61-70',
              '71-80',
              '81-90',
              '91-100'
            ]
          },
          yAxis: {
            name: '用户数量(单位: 户)',
            splitLine: {
              show: false
            }
          },
          series: {
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                  offset: 0,
                  color: '#3EF3E8'
                },
                {
                  offset: 1,
                  color: '#0AACA2'
                }
              ])
            },
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          },
          grid: grid,
          tooltip: tooltip
        }
        this.$refs['changeAbnormalEval'].initChart(this.changeAbnormalEvaltData)

        // 2.变电站计量点异常评估范围分布图
        this.measAbnormalEvalData = {
          title: {
            text: '变电站计量点异常评估范围分布图',
            subtext: '2020-06-02',
            left: 'center'
          },
          xAxis: {
            name: '异常评估(单位: %)',
            type: 'category',
            splitLine: {
              show: false
            },
            data: [
              '0-10',
              '11-20',
              '21-30',
              '31-40',
              '41-50',
              '51-60',
              '61-70',
              '71-80',
              '81-90',
              '91-100'
            ]
          },
          yAxis: {
            name: '计量点数量(单位: 个)',
            splitLine: {
              show: false
            }
          },
          series: {
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                  offset: 0,
                  color: '#FFDBB1'
                },
                {
                  offset: 1,
                  color: '#F89F58'
                }
              ])
            },
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          },
          grid: grid,
          tooltip: tooltip
        }
        this.$refs['measAbnormalEval'].initChart(this.measAbnormalEvalData)

        // 3.10kV专变用户数量分析图
        this.changeUserNumData = {
          title: {
            text: '10kV专变用户数量分析图',
            left: 'center'
          },
          xAxis: {
            name: '时间(单位: 天)',
            type: 'category',
            splitLine: {
              show: false
            },
            data: ['2020-1-1', '2020-1-5', '2020-1-10']
          },
          yAxis: {
            name: '用户数量(单位: 户)',
            splitLine: {
              show: false
            }
          },
          series: {
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#58B8AE'
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [{
                      offset: 0,
                      color: 'rgba(10, 172, 162, .3)'
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(255, 255, 255, 0)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            data: [1, 2, 1]
          },
          grid: grid,
          tooltip: tooltip
        }
        this.$refs['changeUserNum'].initChart(this.changeUserNumData)

        // 4.变电站计量点数量分析图
        this.measNumData = {
          title: {
            text: '变电站计量点数量分析图',
            left: 'center'
          },
          xAxis: {
            name: '时间(单位: 天)',
            type: 'category',
            splitLine: {
              show: false
            },
            data: ['2020-1-1', '2020-1-5', '2020-1-10']
          },
          yAxis: {
            name: '计量点数量(单位: 个)',
            splitLine: {
              show: false
            }
          },
          series: {
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#F9A15A'
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [{
                      offset: 0,
                      color: 'rgba(255, 219, 177, .3)'
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(255, 255, 255, 0)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            data: [1, 2, 1]
          },
          grid: grid,
          tooltip: tooltip
        }
        this.$refs['measNum'].initChart(this.measNumData)
      },
      init() {
        // 1.获取10kV专变用户异常评估范围分布图数据
        this.$refs['changeAbnormalEval'].showLoading()
        this.getChangeAbnormalEvalData().then(() => {
          this.$refs['changeAbnormalEval'].hideLoading()
          this.$refs['changeAbnormalEval'].initChart(this.changeAbnormalEvaltData)
        })

        // 2.变电站计量点异常评估范围分布图
        this.$refs['measAbnormalEval'].showLoading()
        this.getmeasAbnormalEvalData().then(() => {
          this.$refs['measAbnormalEval'].hideLoading()
          this.$refs['measAbnormalEval'].initChart(this.measAbnormalEvalData)
        })

        // 3.10kV专变用户数量分析图
        this.$refs['changeUserNum'].showLoading()
        this.getChangeUserNumData().then(() => {
          this.$refs['changeUserNum'].hideLoading()
          this.$refs['changeUserNum'].initChart(this.changeUserNumData)
        })

        // 4.变电站计量点数量分析图
        this.$refs['measNum'].showLoading()
        this.getMeasNumData().then(() => {
          this.$refs['measNum'].hideLoading()
          this.$refs['measNum'].initChart(this.measNumData)
        })
      },
      // 1.获取10kV专变用户异常评估范围分布图数据
      getChangeAbnormalEvalData() {
        return new Promise((resolve, reject) => {
          this.$http({
              url: this.$http.adornUrl('/home/chart/userIntervalCount'),
              method: 'get',
              data: {}
            })
            .then(({
              data
            }) => {
              if (data && data.code === 0) {
                // 1.没有数据的情况
                if (Object.keys(data.data).length === 0) {
                  this.changeAbnormalEvaltData = {}
                  resolve()
                  return
                }
                // 2.有数据的情况
                this.changeAbnormalEvaltData = {
                  title: {
                    text: '10kV专变用户异常评估范围分布图',
                    subtext: '最近评估日期' + data.data.datectionDay,
                    left: 'center'
                  },
                  xAxis: {
                    name: '异常评估(单位: %)',
                    type: 'category',
                    splitLine: {
                      show: false
                    },
                    axisLabel: {
                      interval: 0
                    },
                    // data: [
                    //   '0-10',
                    //   '11-20',
                    //   '21-30',
                    //   '31-40',
                    //   '41-50',
                    //   '51-60',
                    //   '61-70',
                    //   '71-80',
                    //   '81-90',
                    //   '91-100'
                    // ]
                    data: data.data.xAxis
                  },
                  yAxis: {
                    name: '用户数量(单位: 户)',
                    splitLine: {
                      show: false
                    }
                  },
                  series: {
                    type: 'bar',
                    itemStyle: {
                      color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                          offset: 0,
                          color: '#3EF3E8'
                        },
                        {
                          offset: 1,
                          color: '#0AACA2'
                        }
                      ])
                    },
                    // data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    data: data.data.seriesData
                  },
                  grid: grid,
                  tooltip: tooltip
                }
                resolve()
              } else {
                this.$message.error(data.msg)
                reject()
              }
            })
            .catch(() => {
              this.$message.error('请求错误，请重试')
            })
        })
      },
      // 2.变电站计量点异常评估范围分布图
      getmeasAbnormalEvalData() {
        return new Promise((resolve, reject) => {
          this.$http({
              url: this.$http.adornUrl('/home/chart/positionIntervalCount'),
              method: 'get',
              data: {}
            })
            .then(({
              data
            }) => {
              if (data && data.code === 0) {
                // 1.没有数据的情况
                if (Object.keys(data.data).length === 0) {
                  this.measAbnormalEvalData = {}
                  resolve()
                  return
                }
                // 2.有数据的情况
                this.measAbnormalEvalData = {
                  title: {
                    text: '变电站计量点异常评估范围分布图',
                    subtext: '最近评估日期' + data.data.datectionDay,
                    left: 'center'
                  },
                  xAxis: {
                    name: '异常评估(单位: %)',
                    type: 'category',
                    splitLine: {
                      show: false
                    },
                    axisLabel: {
                      interval: 0
                    },
                    // data: [
                    //   '0-10',
                    //   '11-20',
                    //   '21-30',
                    //   '31-40',
                    //   '41-50',
                    //   '51-60',
                    //   '61-70',
                    //   '71-80',
                    //   '81-90',
                    //   '91-100'
                    // ]
                    data: data.data.xAxis
                  },
                  yAxis: {
                    name: '计量点数量(单位: 户)',
                    splitLine: {
                      show: false
                    }
                  },
                  series: {
                    type: 'bar',
                    itemStyle: {
                      color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                          offset: 0,
                          color: '#FFDBB1'
                        },
                        {
                          offset: 1,
                          color: '#F89F58'
                        }
                      ])
                    },
                    // data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    data: data.data.seriesData
                  },
                  grid: grid,
                  tooltip: tooltip
                }
                resolve()
              } else {
                this.$message.error(data.msg)
                reject()
              }
            })
            .catch(() => {
              this.$message.error('请求错误，请重试')
            })
        })
      },
      // 3.10kV专变用户数量分析图
      getChangeUserNumData() {
        return new Promise((resolve, reject) => {
          this.$http({
              url: this.$http.adornUrl('/home/chart/userElectricDataCount'),
              method: 'get',
              data: {}
            })
            .then(({
              data
            }) => {
              if (data && data.code === 0) {
                // 1.没有数据的情况
                if (Object.keys(data.data).length === 0) {
                  this.changeUserNumData = {}
                  resolve()
                  return 
                }
                this.changeUserNumData = {
                  title: {
                    text: '10kV专变用户数量分析图',
                    left: 'center'
                  },
                  xAxis: {
                    name: '时间(单位: 天)',
                    type: 'category',
                    splitLine: {
                      show: false
                    },
                    // data: ['2020-1-1', '2020-1-5', '2020-1-10']
                    data: data.data.xAxis
                  },
                  yAxis: {
                    name: '用户数量(单位: 户)',
                    splitLine: {
                      show: false
                    }
                  },
                  series: {
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                      color: '#58B8AE'
                    },
                    areaStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(
                          0,
                          0,
                          0,
                          1,
                          [{
                              offset: 0,
                              color: 'rgba(10, 172, 162, .3)'
                            },
                            {
                              offset: 0.8,
                              color: 'rgba(255, 255, 255, 0)'
                            }
                          ],
                          false
                        ),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                      }
                    },
                    // data: [1, 2, 1]
                    data: data.data.seriesData
                  },
                  grid: grid,
                  tooltip: tooltip
                }
                resolve()
              } else {
                this.$message.error(data.msg)
                reject()
              }
            })
            .catch(() => {
              this.$message.error('请求错误，请重试')
            })
        })
      },
      // 4.变电站计量点数量分析图
      getMeasNumData() {
        return new Promise((resolve, reject) => {
          this.$http({
              url: this.$http.adornUrl('/home/chart/positionElectricDataCount'),
              method: 'get',
              data: {}
            })
            .then(({
              data
            }) => {
              if (data && data.code === 0) {
                // 1.没有数据的情况
                if (Object.keys(data.data).length === 0) {
                  this.measNumData = {}
                  resolve()
                  return
                }
                // 2.有数据的情况
                this.measNumData = {
                  title: {
                    text: '变电站计量点数量分析图',
                    left: 'center'
                  },
                  xAxis: {
                    name: '时间(单位: 天)',
                    type: 'category',
                    splitLine: {
                      show: false
                    },
                    // data: ['2020-1-1', '2020-1-5', '2020-1-10']
                    data: data.data.xAxis
                  },
                  yAxis: {
                    name: '计量点数量(单位: 天)',
                    splitLine: {
                      show: false
                    }
                  },
                  series: {
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                      color: '#F9A15A'
                    },
                    areaStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(
                          0,
                          0,
                          0,
                          1,
                          [{
                              offset: 0,
                              color: 'rgba(255, 219, 177, .3)'
                            },
                            {
                              offset: 0.8,
                              color: 'rgba(255, 255, 255, 0)'
                            }
                          ],
                          false
                        ),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                      }
                    },
                    // data: [1, 2, 1]
                    data: data.data.seriesData
                  },
                  grid: grid,
                  tooltip: tooltip
                }
                resolve()
              } else {
                this.$message.error(data.msg)
                reject()
              }
            })
            .catch(() => {
              this.$message.error('请求错误，请重试')
            })
        })
      }
    },
    filter: {}
  }

</script>
<style scoped lang="scss">
  .home {
    width: 100%;
    height: 100%;
    // background: #fb3;
    display: flex;
    flex-wrap: wrap;

    .item {
      // border: 1px solid red;
      width: 50%;
      height: 50%;
      flex-shrink: 0;
    }
  }

</style>
