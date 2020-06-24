<template>
  <div class="map-fullscreen">
    <h2>{{regionName}}</h2>
    <div class="map-chart"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {},
  data() {
    return {
      mapData: '' //
    }
  },
  computed: {
    regionName() {
      return this.$store.state.common.userRegion.regionName
    },
    userRegionMap() {
      return this.$store.state.common.userRegionMap
    }
  },
  components: {},
  created() {},
  mounted() {
    this.getRegionTop().then(()=>{
      this.initRegionChart(this.mapData)
    })
  },
  destroyed() {},
  watch: {},
  methods: {
    // 绘制地区地图
    initRegionChart() {
      echarts.registerMap(this.regionName, this.userRegionMap)
      let myChart = null
      let oBox = document.querySelector('.map-chart')
      myChart = echarts.init(oBox)
      let option = {
        title: {},
        tooltip: {
          formatter: function(params) {
            let info = `<p style="font-size:16px;">用户名:${params.name}</p>
                        <p style="font-size:14px;">异常概率:${params.value[2]}`
            return info
          },
          backgroundColor: 'rgba(0,0,0,.5)', //提示标签背景颜色
          textStyle: {
            //提示标签字体颜色
            color: '#fff'
          }
        },
        geo: {
          map: this.regionName,
          label: {
            normal: {
              show: true, // 显示地区名称
              textStyle: {}
            },
            emphasis: {
              show: true,
              textStyle: {
                color: '#000'
              }
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#EDFCFC',
              borderColor: '#529D97'
            },
            emphasis: {
              areaColor: '#EDFCFC',
              borderColor: '#529D97'
            }
          },
          roam:true
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo', // 对应上方配置
            type: 'scatter',
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            symbolSize: 8,
            /* data: [
              {
                name: '222',
                value: [112.102756, 37.899348, 900]
              },
              {
                name: '333',
                value: [112.202756, 37.909948, 900]
              },
              {
                name: '4444',
                value: [112.168551, 37.899356, 900]
              }
            ] */
            // data:this.mapData
          }
        ]
      }
      // 清空数据
      myChart.clear()
      myChart.setOption(option)
      // 添加单击事件
      // 添加单击事件
      myChart.on('click',params=>{
      })
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    getRegionTop() {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/electric/homeIndustry/regionThree'),
          method: 'get',
          params: this.$http.adornParams({
            countNumber: 3,
            detectionDay: '20190228'
          })
        }).then(({ data }) => {
          this.mapData = data.map(item => {
            return {
              name:item.electricUserName,
              value:[item.longitude,item.latitude,item.detectionResult]
            }
          })
          resolve()    // 这个代码不能少的
        })
      })
    }
  }
}
</script>
<style scoped lang="scss">
.map-fullscreen {
  height: 100%;
  h2 {
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #ccc;
  }
  .map-chart {
    height: calc(100% - 50px);
  }
}
</style>