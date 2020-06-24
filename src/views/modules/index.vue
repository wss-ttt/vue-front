<template>
  <div class="wrapper">
    <button type="button" @click="change(0)">1线</button>
    <button type="button" @click="change(1)">2线</button>
    <button type="button" @click="change(2)">3线</button>
    <div class="box">
      <v-chart ref="chart" width="100%" height="100%" />
    </div>
  </div>
</template>

<script>
  import VChart from '@/components/chart/index'
  export default {
    components: {
      VChart
    },
    props: {},
    data () {
      return {
        chartData: {}
      }
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {
      let self = this
      this.chartData = {
        legend: {
          icon: 'none',
          textStyle: {
            fontSize: 30
          },
          data: [{
            name: '1线',
            textStyle: {
              fontWeight: 'normal',
              color: '#1acd7e'
            }
          }, {
            name: '2线',
            textStyle: {
              fontWeight: 'normal',
              color: '#1acd7e'
            }
          }, {
            name: '3线',
            textStyle: {
              fontWeight: 'normal',
              color: '#1acd7e'
            }
          }]
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [{
          name: '1线',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          symbolSize: 0,
          lineStyle: {
            color: 'red',
            opacity: 0.3
          }
        }, {
          name: '2线',
          data: [300, 440, 800, 500, 900, 330, 130],
          type: 'line',
          symbolSize: 0,
          lineStyle: {
            color: 'green',
            opacity: 0.3
          }
        }, {
          name: '3线',
          data: [800, 840, 100, 600, 700, 930, 230],
          type: 'line',
          symbolSize: 0,
          lineStyle: {
            color: 'blue',
            opacity: 0.3
          }
        }]
      }
      this.$refs['chart'].initChart(this.chartData, function (params) {
        const myChart = this
        const name = params.name
        const selected = params.selected
        const legend = myChart.getOption().legend[0].data
        let i = 0
        const len = legend.length
        const series = myChart.getOption().series

        // 取消默认的图例变暗
        selected[name] = true
        for (; i < len; i++) {
          if (name === legend[i]['name']) {
            // 高亮显示
            series[i]['lineStyle']['width'] = 4
            series[i]['lineStyle']['opacity'] = 1
            legend[i]['textStyle']['fontWeight'] = 'bold'
            legend[i]['textStyle']['color'] = '#FE3B44'
          } else {
            series[i]['lineStyle']['width'] = 1
            series[i]['lineStyle']['opacity'] = 0.3
            legend[i]['textStyle']['fontWeight'] = 'normal'
            legend[i]['textStyle']['color'] = '#1acd7e'
          }
        }

        self.chartData.legend.selected = selected
        self.chartData.series = series
        self.chartData.legend.data = legend
        // 重新初始化图表
        myChart.clear()
        myChart.setOption(self.chartData)
      })
    },
    activated () {},
    deactivated () {},
    updated () {},
    destroyed () {},
    methods: {
      change (index) {
        // 1.遍历 排它思想
        for (let i = 0, len = this.chartData.series.length; i < len; i++) {
          this.chartData.legend['data'][i]['textStyle']['fontWeight'] = 'normal'
          this.chartData.legend['data'][i]['textStyle']['color'] = '#1acd7e'
          this.chartData.series[i]['lineStyle']['opacity'] = 0.3
          this.chartData.series[i]['lineStyle']['width'] = 1
        }
        // 2.当前的这个高亮
        this.chartData.legend['data'][index]['textStyle']['fontWeight'] = 'bold'
        this.chartData.legend['data'][index]['textStyle']['color'] = '#FE3B44'
        this.chartData.series[index]['lineStyle']['opacity'] = 1
        this.chartData.series[index]['lineStyle']['width'] = 4
        // 3.重新初始化图表
        this.$refs['chart'].initChart(this.chartData)
      }
    },
    filters: {}
  }
</script>
<style scoped lang="scss">
  .box {
    width: 400px;
    height: 400px;
    // background: #000;
    border: 1px solid #ccc;
  }

</style>
