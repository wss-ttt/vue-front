<template>
  <div class="wrapper">
    <div class="box">
      <v-chart ref="chart" width="100%" height="100%"></v-chart>
    </div>
    <div class="box">
      <v-chart ref="chart2" width="100%" height="100%"></v-chart>
    </div>
  </div>
</template>

<script>
import VChart from '@/components/chart/index.vue'
export default {
  components: { VChart },
  props: {},
  data() {
    return {
      chartData: {}
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.chartData = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }
      ]
    }
    this.$refs['chart'].initChart(this.chartData)
    this.$refs['chart2'].initChart(this.chartData)
  },
  activated() {},
  deactivated() {},
  updated() {},
  destroyed() {},
  methods: {},
  filters: {}
}
</script>
<style scoped lang="scss">
.box {
  width: 50%;
  height: 400px;
  background: #fb3;
}
</style>