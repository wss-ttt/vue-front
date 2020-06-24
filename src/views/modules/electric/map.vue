<template>
  <div class="map common">
    <div class="title">{{regionName}}</div>
    <div class="query-area">
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
        <!-- <li v-if="isType.title === 'industry'">
          <span>行业查询:</span>
          <el-select v-model="industryVal" @change="industryChange" style="width:200px;">
            <el-option
              v-for="(item,index) in industryList"
              :key="index.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li> -->
        <li v-if="isType.title === 'industry'">
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
      </ul>
    </div>
    <div class="content clearfix">
      <div class="left-con" v-loading="mapLoading">
        <div class="types">
          <ul>
            <li
              v-for="(item,index) in types"
              :key="index"
              :class="{'active':isType.title === item.title}"
              @click="toggleType(item)"
            >
              <i :class="item.icon"></i>
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
        <div class="top10" @click="toTop10">
          <div>
            <p>各{{isType.name}}异常用电排名前十</p>
            <p>
              用户数量:
              <span class="userCount">{{isType.title === 'region' ? regionUserCount : industryUserCount}}</span>
            </p>
          </div>
        </div>
        <!-- <div class="l-region" id="regionChart" v-if="isType === 'region'"></div>
        <div class="l-industry" id="industruChart" v-if="isType === 'industry'"></div>-->
        <div class="region-industry" id="region-industry"></div>
        <!-- 全屏按钮 -->
        <!-- <div class="full-screen" @click="handlerFullScreen('l1')">
          <icon-svg name="screen"></icon-svg>
        </div> -->
        <div class="full-screen" @click="handlerFullScreen2('left-con')">
          <icon-svg name="screen"></icon-svg>
        </div>
      </div>
      <div class="right-con">
        <div class="r-item r1">
          <!-- 异常 -->
          <div class="abnormal" v-loading="abnormalLoading">
            <div class="r-title">各{{isType.name}}异常用电用户数量对比</div>
            <!-- 图表 -->
            <div class="charts" id="abnormalChart"></div>
          </div>
          <!-- 全屏按钮 -->
          <!-- <div class="full-screen" @click="handlerFullScreen('r1')">
            <icon-svg name="screen"></icon-svg>
          </div>-->
          <div class="full-screen" @click="handlerFullScreen2('r1')">
            <icon-svg name="screen"></icon-svg>
          </div>
        </div>
        <div class="r-item r2">
          <!-- 成功 -->
          <div class="success" v-loading="allLoading">
            <div class="r-title">各{{isType.name}}所有用电用户数量对比</div>
            <!-- 图表 -->
            <div class="charts" id="successChart"></div>
          </div>
          <!-- 全屏按钮 -->
          <!-- <div class="full-screen" @click="handlerFullScreen('r2')">
            <icon-svg name="screen"></icon-svg>
          </div>-->
          <div class="full-screen" @click="handlerFullScreen2('r2')">
            <icon-svg name="screen"></icon-svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { formatDate } from '@/utils'
let abnormalMyChart = null
let successMyChart = null
let regionOrIndustryMyChart = null
let abnormalChartBox = null
let successChartBox = null 
let regionOrIndustryBox = null
export default {
  name: 'map',
  data() {
    return {
      types: [
        {
          icon: 'el-icon-edit',
          name: '区域',
          title: 'region'
        },
        {
          icon: 'el-icon-share',
          name: '行业',
          title: 'industry'
        }
      ],
      isType: {},
      typeVisible: true, // 控制显示和隐藏的
      regionUserCount:0,   // 区域的用户数量
      industryUserCount:0,    // 行业的用户熟练
      selectDate: '', // 时间组件选择的时间
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
      assessment: [], // 评估区间下拉框数据
      industryVal: '', // 行业选中的值
      industryList: [], // 所有的行业数据
      regionId:'',    // 区域编号
      regionList:[],    // 区域列表数据
      detectionDay: '',
      isFullScreen: true,
      /* successMyChart: null,
      abnormalMyChart: null,
      regionOrIndustryMyChart: null, */
      mapData:'',   // 保存地图上散点的数据
      industryLegendData:[],
      industrySeriesData:[],
      industryAbnormalXData:[],
      industryAbnormalYData:[],
      regionAbnormalXData:[],
      regionAbnormalYData:[],
      regionRankingAllXData:[],
      regionRankingAllYData:[],
      industryRankingAllXData:[],
      industryRankingAllYData:[],
      mapLoading:false,
      abnormalLoading:false,
      allLoading:false,
    }
  },
  computed: {
    regionName() {
      return this.$store.state.common.userRegion.regionName
    },
    userRegionMap() {
      return this.$store.state.common.userRegionMap
    },
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold }
    }
  },
  activated(){
    /* regionOrIndustryMyChart ? regionOrIndustryMyChart.resize() : ''
    abnormalMyChart ? abnormalMyChart.resize() : ''
    successMyChart ? successMyChart.resize() : '' */
    
    regionOrIndustryMyChart && regionOrIndustryMyChart.resize()
    abnormalMyChart && abnormalMyChart.resize()
    successMyChart && successMyChart.resize()
  },
  mounted() {
    // 获取dom元素
    abnormalChartBox = document.querySelector('#abnormalChart')
    successChartBox = document.querySelector('#successChart')
    regionOrIndustryBox = document.querySelector('#region-industry')
    // tab默认显示第一个
    this.isType = this.types[0]
    // 获取行业数据
    /* this.industryList = JSON.parse(sessionStorage.getItem('industryList'))
    this.industryList = [
      {
        label: '全部',
        value: ''
      }
    ].concat(this.industryList) */
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
    // 动态设置初始时间
    /* let now = new Date()
    let oneDay = 24*3600*1000 // 一天的毫秒数
    let endTime = formatDate(now) 
    let startTime = formatDate(new Date(+now - 90*oneDay))
    this.selectDate = [startTime,endTime] */
    // 获取评估区间
    this.getAssess()
  },
  methods: {
    test() {
      let xData = []
      let yData = []
      for (let i = 1; i <= 3000; i++) {
        xData.push('' + i)
      }
      // 模拟随机产生的数据
      for (let i = 1; i <= 3000; i++) {
        var num = Math.floor(Math.random() * (1500 - 100 + 1) + 100) // 向下取整
        yData.push(num)
      }
      this.initChartBar(xData, yData, 'successChart')
    },
    // 初始化柱状图
    initChartBar(xData, yData, el) {
      let myCharts = null
      myCharts = echarts.init(document.getElementById(el))
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {},
        xAxis: [
          {
            type: 'category',
            // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            data: xData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            // data: [120, 200, 150, 80, 70, 110, 130],
            data: yData,
            type: 'bar'
          }
        ]
      }
      myCharts.clear()
      myCharts.setOption(option)
      window.addEventListener('resize', () => {
        myCharts.resize()
      })
    },
    toTop10() {
      if (this.isType.name === '区域') {
        // 时间区间时间
        sessionStorage.setItem('selectDateMapToRegionTop',JSON.stringify(this.selectDate))
        // 检测日期
        sessionStorage.setItem('detectionDayMapToRegionTop',this.detectionDay)
        // 评估区间数据
        sessionStorage.setItem('assessmentMapToRegionTop',JSON.stringify(this.assessment))
        // 区域
        this.$router.push({
          name: 'electric-region-top'
        })
      } else {
        // 时间区间时间
        sessionStorage.setItem('selectDateMapToIndustryTop',JSON.stringify(this.selectDate))
        // 检测日期
        sessionStorage.setItem('detectionDayMapToIndustryTop',this.detectionDay)
        // 评估区间数据
        sessionStorage.setItem('assessmentMapToIndustryTop',JSON.stringify(this.assessment))
        // 行业
        this.$router.push({
          name: 'electric-industry-top'
        })
      }
    },
    // 时间组件改变事件
    selectDateChange(val) {
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
            // 默认选中第一个
            this.detectionDay = this.assessment[0]['value']
          } else {
            this.assessment = res
            this.detectionDay = ''
          }
            this.assessChange(this.detectionDay)
        })
    },
    // 评估区间下拉框改变事件
    assessChange(val) {
      this.detectionDay = val
      // 获取区域的用户数量
      this.getRegionUserCount().then((data)=>{
        this.regionUserCount = data.count
      })
      // 获取行业的用户数量
      this.getIndustryUserCount().then((data)=>{
        this.industryUserCount = data.count
      })
      // 获取前三数据
      let p1 = this.getRegionTop().then(()=>{

      })
      // 获取行业饼状图的数据(饼状图)
      let p2 = this.getIndustryChartData().then((data)=>{
        // 每次需要清空数据
        this.industryLegendData.length = 0
        this.industrySeriesData.length = 0
        data.forEach(item=>{
          this.industryLegendData.push( item.industryName)
          this.industrySeriesData.push({
            name:item.industryName,
            value:item.countNumber,
            industryId:item.industryId
          }) 
        })
      })
      // 获取各行业异常厂家数量对比(柱状图)
      let p3 = this.getIndustryAbnormalData().then((data)=>{
        this.industryAbnormalXData.length = 0
        this.industryAbnormalYData.length = 0
        data.forEach(item=>{
          this.industryAbnormalXData.push(item.industryName)
          this.industryAbnormalYData.push(item.countNumber)
        })
      })
      // 获取各区域异常厂家数量对比(柱状图)
      let p4 = this.getRegionAbnormalData().then((data)=>{
        this.regionAbnormalXData.length = 0
        this.regionAbnormalYData.length = 0
        data.forEach(item=>{
          this.regionAbnormalXData.push(item.regionName)
          this.regionAbnormalYData.push(item.countNumber)
        })
      })
      // 区域的所有厂家数量对比
      let p5 = this.getRegionRankingAllData().then((data)=>{
        this.regionRankingAllXData.length = 0
        this.regionRankingAllYData.length = 0
        data.forEach(item=>{
          this.regionRankingAllXData.push(item.regionName)
          this.regionRankingAllYData.push(item.countNumber)
        })
      })

      // 行业的所有厂家数量对齐
      let p6 = this.getIndustryRankingAllData().then((data)=>{
        this.industryRankingAllXData.length = []
        this.industryRankingAllYData.length = []
        data.forEach(item=>{
          this.industryRankingAllXData.push(item.industryName)
          this.industryRankingAllYData.push(item.countNumber)
        })
      })
      this.mapLoading = true
      this.abnormalLoading = true
      this.allLoading = true
      Promise.all([p1,p2,p3,p4,p5,p6]).then(()=>{
        this.mapLoading = false
        this.abnormalLoading = false
        this.allLoading = false 
        // 获取完数据以后进行绘制图表
        this.toggleType(this.isType)
      })
    },
    toggleType(type) {
      this.isType = type
      switch (this.isType.title) {
        case 'region': // 区域
          this.$nextTick(() => {
            this.initRegionOrIndustryChart()
            // 异常厂家
            if(!this.regionAbnormalXData.length && !this.regionAbnormalYData.length){
              abnormalChartBox.innerHTML = '<div style="font-size:16px;text-align:center;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);font-weight: bold;">暂无数据</div>'
              abnormalChartBox.removeAttribute('_echarts_instance_')
            }else{
              this.initAbnormalChart()
            }
            // 所有厂家
            if(!this.regionRankingAllXData.length && !this.regionRankingAllYData.length){
              successChartBox.innerHTML = '<div style="font-size:16px;text-align:center;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);font-weight: bold;">暂无数据</div>'
              successChartBox.removeAttribute('_echarts_instance_')
            }else{
              this.initRankingAllChart()
            }
          })
          break
        case 'industry': // 行业
          this.$nextTick(() => {
            // 行业(饼状图)
            if(!this.industryLegendData.length && !this.industrySeriesData.length){
              regionOrIndustryBox.innerHTML = '<div style="font-size:16px;text-align:center;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);font-weight: bold;">暂无数据</div>'
              regionOrIndustryBox.removeAttribute('_echarts_instance_')
            }else{
              this.initRegionOrIndustryChart()
            }
            // 异常厂家
            if(!this.industryAbnormalXData.length && !this.industryAbnormalYData.length){
              abnormalChartBox.innerHTML='<div style="font-size:16px;text-align:center;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);font-weight: bold;">暂无数据</div>'
              abnormalChartBox.removeAttribute('_echarts_instance_')
            }else{
              this.initAbnormalChart()
            }
            // 所有厂家
            if(!this.industryRankingAllXData.length && !this.industryRankingAllYData.length){
              successChartBox.innerHTML = '<div style="font-size:16px;text-align:center;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);font-weight: bold;">暂无数据</div>'
              successChartBox.removeAttribute('_echarts_instance_')
            }else{
              this.initRankingAllChart()
            }
          })
          break
      }
    },
    // 行业下拉框改变事件
    industryChange(val) {
    },
    // 区域下拉框改变事件
    regionChange(val){
      this.regionId = val
      this.assessChange(this.detectionDay)
    },
    // 绘制地区地图
    initRegionChart() {
      echarts.registerMap(this.regionName, this.userRegionMap)
      let myChart = null
      let oBox = document.querySelector('#regionChart')
      myChart = echarts.init(oBox)
      let option = {
        title: {},
        tooltip: {
          /* formatter: function(params) {
            console.log(params)
            var info =
              '<p style="font-size:18px">' +
              params.name +
              '</p><p style="font-size:14px">{b}这里可以写一些，想展示在页面上的别的信息</p>'
            return info
          },
          //					formatter: '{b}<br/>{c}',
          backgroundColor: 'rgba(0,0,0,.5)', //提示标签背景颜色
          textStyle: {
            //提示标签字体颜色
            color: '#fff'
          } */
        },
        geo: {
          map: this.regionName,
          label: {
            emphasis: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#fff',
              borderColor: '#111'
            },
            emphasis: {
              areaColor: '#2a333d'
            }
          }
        },
        series: [
          /* {
            type: 'scatter',
            coordinateSystem: 'geo' // 对应上方配置
          }, */
          {
            name: 'test', // 浮动框的标题
            type: 'map',
            geoIndex: 0,
            data: []
          }
        ]
      }
      // 清空数据
      myChart.clear()
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    // 行业饼状图绘制
    initIndustryChart() {
      let myChart = null
      let oBox = document.querySelector('#industruChart')
      myChart = echarts.init(oBox)
      let option = {
        title: {},
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          top: '15%',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.clear()
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    // 区域 或者 行业 图表绘制(共用一个方法)
    initRegionOrIndustryChart() {
      if(!echarts.getInstanceByDom(regionOrIndustryBox)){
        regionOrIndustryMyChart = echarts.init(regionOrIndustryBox)
      }
      let option = null
      if (this.isType.name === '区域') {
        // 区域
        echarts.registerMap(this.regionName, this.userRegionMap)
        option = {
          title: {},
          tooltip: {
            formatter: function(params) {
              var info =
                '<p style="font-size:16px">用户名:' +
                params.name +
                '</p><p style="font-size:14px">评估值:' +
                params.value[2]['detectionResult'] +
                '</p>'
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
                textStyle: {
                  color: '#000'
                }
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
                areaColor: '#a6dcd9',
                borderColor: '#529D97'
              }
            },
            roam:true,
            scaleLimit:{
              min: 0.5,
              max:2
            }
          },
          series: [
            {
              name: '排名前三', // 浮动框的标题
              coordinateSystem: 'geo',
              type: 'scatter',
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              symbolSize: 10,
              /* data: [
                {
                  name:'222',
                  value:[112.102756,37.899348,900]
                },
                {
                  name:'333',
                  value:[112.202756,37.909948,900]
                },
                {
                  name:'4444',
                  value:[112.168551,37.899356,900]
                },
              ] */
              data:this.mapData
              // data:[]
            }
          ]
        }
      } else {
        // 行业
        option = {
          title: {},
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 'right',
            top: '15%',
            // data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
            data: this.industryLegendData
          },
          series: [
            {
              name: '异常概率占比',
              type: 'pie',
              // radius: '55%',   // 设置饼状图的大小
              // center: ['50%', '60%'],
              /* data: [
                { value: 335, name: '直接访问' },
                { value: 310, name: '邮件营销' },
                { value: 234, name: '联盟广告' },
                { value: 135, name: '视频广告' },
                { value: 1548, name: '搜索引擎' }
              ], */
              data:this.industrySeriesData,
              itemStyle: {
                normal:{
                  /* color:function(value){
                    // 随机颜色
                    return "#" + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6)
                  }, */
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label:{
                normal:{
                  show:false
                }
              }
            }
          ]
        }
      }
      // 清空数据
      regionOrIndustryMyChart.clear()
      regionOrIndustryMyChart.setOption(option)
      regionOrIndustryMyChart.on('click',(params)=>{
        if(params.componentType === 'geo'){
          // 次数点击的是整个区域部分
          // 需要跳转到异常用电管理页面去
          // 时间
          sessionStorage.setItem('selectDateMapToManage',JSON.stringify(this.selectDate))
          // 评估区间
          sessionStorage.setItem('assessmentMapToManage',JSON.stringify(this.assessment))
          // 检测时间节点
          sessionStorage.setItem('detectionDayMapToManage',this.detectionDay)
          // 区域名称
          sessionStorage.setItem('regionNameMapToManage',params.name)
          // 跳转到管理页面
          this.$router.push({
            name:'electric-manage'
          })
        }else {
          if(params.seriesType === 'scatter'){
            // 此处说明点击的是 前N中的某一个点  进入到详情页面
            // 用户表号
            sessionStorage.setItem('electricUserInstrument',params.value[2]['electricUserInstrument'])
            sessionStorage.setItem('selectDate',JSON.stringify(this.selectDate))  // 时间组件
            sessionStorage.setItem('detectionDay', this.detectionDay)    // 检测日期
            sessionStorage.setItem('detectionResult', params.data.value[2]['detectionResult'])  // 检测结果
            this.$router.push({
              name: 'electric-details'
            })
          }else if(params.seriesType === 'pie'){
            // 此处说明点击的是饼状图  进入到管理页面
            sessionStorage.setItem('industryIdMapToManage',params.data.industryId)
            // 时间
            sessionStorage.setItem('selectDateMapToManage',JSON.stringify(this.selectDate))
            // 检测时间节点
            sessionStorage.setItem('detectionDayMapToManage',this.detectionDay)
            // 评估区间
            sessionStorage.setItem('assessmentMapToManage',JSON.stringify(this.assessment))
            // 跳转到管理页面
            this.$router.push({
              name:'electric-manage'
            })
          }
        }
      })
      window.addEventListener('resize', () => {
        regionOrIndustryMyChart.resize()
      })
    },
    // 所有的厂家对比
    initRankingAllChart() {
      if(!echarts.getInstanceByDom(successChartBox)){
        successMyChart = echarts.init(successChartBox)
      }
      let option = {
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          position: function (point, params, dom, rect, size) {
              // 固定在顶部
              return [point[0] - 100, '10%']
          },
          formatter: function (params) {
            let name = params[0]['axisValueLabel']
            let marker = params[0]['marker']
            if (name.length > 5) {
              // 对悬浮的文字截取长度 避免太长 超出页面抖动
                name = name.substring(0, 5) + '...'
            }
            return name + '<br>' + marker + params[0]['value']
          }
        },
        xAxis: {
          type: 'category',
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          data:this.isType.title === 'region'?this.regionRankingAllXData:this.industryRankingAllXData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            // data: [120, 200, 150, 80, 70, 110, 130],
            data:this.isType.title === 'region'?this.regionRankingAllYData:this.industryRankingAllYData,
            type: 'bar',
            itemStyle: {
                // 给柱状图添加渐变色
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#45D7CE'},
                            {offset: 1, color: '#0C7972'}
                        ]
                    )
                },
                // 鼠标悬浮的样式
                emphasis: {
                    /* color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#2378f7'},
                            {offset: 1, color: '#83bff6'}
                        ]
                    ) */
                }
            },
          }
        ]
      }
      // 清空数据
      successMyChart.clear()
      successMyChart.setOption(option)
      window.addEventListener('resize', () => {
        successMyChart.resize()
      })
    },
    // 异常厂家对比
    initAbnormalChart() {
      if(!echarts.getInstanceByDom(abnormalChartBox)){
        abnormalMyChart = echarts.init(abnormalChartBox)
      }
      let option = {
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          position: function (point, params, dom, rect, size) {
              // 固定在顶部
              return [point[0] - 100, '10%']
          },
          formatter: function (params) {
            let name = params[0]['axisValueLabel']
            let marker = params[0]['marker']
            if (name.length > 5) {
              // 对悬浮的文字截取长度 避免太长 超出页面抖动
                name = name.substring(0, 5) + '...'
            }
            return name + '<br>' + marker + params[0]['value']
          }
        },
        xAxis: {
          type: 'category',
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          // data :this.industryAbnormalXData
          data:this.isType.title === 'region'?this.regionAbnormalXData:this.industryAbnormalXData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            // data: [45, 689, 589, 900, 54, 287, 345],
            // data:this.industryAbnormalYData,
            data:this.isType.title === 'region'?this.regionAbnormalYData:this.industryAbnormalYData,
            type: 'bar',
            itemStyle: {
                // 给柱状图添加渐变色
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#F5A100'},
                            {offset: 1, color: '#C0002A'}
                        ]
                    )
                },
                // 鼠标悬浮的样式
                emphasis: {
                    /* color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#2378f7'},
                            {offset: 1, color: '#83bff6'}
                        ]
                    ) */
                }
            },
          }
        ]
      }
      // 清空数据
      abnormalMyChart.clear()
      abnormalMyChart.setOption(option)
      window.addEventListener('resize', () => {
        abnormalMyChart.resize()
      })
    },
    handlerFullScreen(name) {
      this.isFullScreen = false
      let oBox = null
      switch (name) {
        case 'l1':
          oBox = document.querySelector('.left-con')
          break
        case 'r1':
          oBox = document.querySelector('.r1')
          break
        case 'r2':
          oBox = document.querySelector('.r2')
          break
      }
      this.requestFullScreen(oBox)
    },
    // 全屏展示方法封装
    requestFullScreen(element) {
      let requestMethod =
        element.requestFullScreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullScreen
      if (requestMethod) {
        requestMethod.call(element)
      } else if (typeof window.ActiveXObject !== 'undefined') {
        var wscript = new ActiveXObject('WScript.Shell')
        if (wscript !== null) {
          wscript.SendKeys('{F11}')
        }
      }
    },
    requestExitFullScreen() {
      this.isFullScreen = true
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    },
    // 全屏展示
    handlerFullScreen2(el) {
      let oBox = document.querySelector('.' + el)
      oBox.classList.toggle('max')
      switch (el) {
        case 'r1':
          abnormalMyChart.resize()
          break
        case 'r2':
          successMyChart.resize()
          break
        case 'left-con':
          regionOrIndustryMyChart.resize()
          break
      }
    },
    // 获取排名前N的数据
    getRegionTop() {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/electric/homeRegion/regionThree'),
          method: 'get',
          params: this.$http.adornParams({
            countNumber: 3,
            detectionDay: this.detectionDay
          })
        }).then(({ data }) => {
          this.mapData = data.map(item => {
            return {
              name:item.electricUserName,
              // 经度 维度 异常概率值
              value:[item.longitude,item.latitude,item]
            }
          })
          resolve()    // 这个代码不能少的
        })
      })
    },
    // 获取区域用户数量
    getRegionUserCount(){
      return new Promise((resolve,reject)=>{
        this.$http({
          url:this.$http.adornUrl('/electric/homeRegion/regionCount'),
          method:'get',
          params:this.$http.adornParams({
            detectionDay: this.detectionDay
          })
        }).then(({data})=>{
            resolve(data)
        }).catch((err)=>{
            reject(err)
        })
      })
    },
    // 获取行业用户数量
    getIndustryUserCount(){
      return new Promise((resolve,reject)=>{
        this.$http({
          url:this.$http.adornUrl('/electric/homeIndustry/industryCount'),
          method:'get',
          params:this.$http.adornParams({
            detectionDay: this.detectionDay
          })
        }).then(({data})=>{
            resolve(data)
        }).catch((err)=>{
            reject(err)
        })
      })
    },
    // 获取行业饼状图数据(饼状图)
    getIndustryChartData(){
      return new Promise((resolve,reject)=>{
        this.$http({
          url:this.$http.adornUrl('/electric/homeIndustry/industryRanking'),
          method:'get',
          params:this.$http.adornParams({
            detectionDay: this.detectionDay,
            regionId:this.regionId
          })
        }).then(({data})=>{
          resolve(data)
        }).catch(err=>{
          reject(err)
        })
      })
    },
    // 获取各行业异常厂家数量对比(柱状图)
    getIndustryAbnormalData(){
      return new Promise((resolve,reject)=>{
        this.$http({
          url:this.$http.adornUrl('/electric/homeIndustry/industryRanking'),
          method:'get',
          params:this.$http.adornParams({
            detectionDay: this.detectionDay,
            regionId:'',
          })
        }).then(({data})=>{
          resolve(data)
        }).catch(err=>{
          reject(err)
        })
      })
    },
    // 获取区域厂家数量对比(柱状图)
    getRegionAbnormalData(){
      return new Promise((resolve,reject)=>{
        this.$http({
          url:this.$http.adornUrl('/electric/homeRegion/regionRanking'),
          method:'get',
          params:this.$http.adornParams({
            detectionDay: this.detectionDay,
            regionId:'',
          })
        }).then(({data})=>{
          resolve(data)
        }).catch(err=>{
          reject(err)
        })
      })
    },
    // 区域的所有厂家数量对比
    getRegionRankingAllData(){
      return new Promise((resolve,reject)=>{
        this.$http({
          url:this.$http.adornUrl('/electric/homeRegion/regionRankingAll'),
          method:'get',
          params:this.$http.adornParams({
            detectionDay: this.detectionDay,
            regionId:'',
          })
        }).then(({data})=>{
          resolve(data)
        }).catch(err=>{
          reject(err)
        })
      })
    },
    // 行业的所有厂家数量对比
    getIndustryRankingAllData(){
      return new Promise((resolve,reject)=>{
        this.$http({
          url:this.$http.adornUrl('/electric/homeIndustry/industryRankingAll'),
          method:'get',
          params:this.$http.adornParams({
            detectionDay: this.detectionDay,
            regionId:'',
          })
        }).then(({data})=>{
          resolve(data)
        }).catch(err=>{
          reject(err)
        })
      })
    },
  },
  components: {},
  watch:{
    sidebarFold:{
      handler(newVal,oldVal){
        regionOrIndustryMyChart.resize()
        abnormalMyChart.resize()
        successMyChart.resize()
      }
    }
  }
}
</script>

<style lang="scss" scoped="scoped">
.map {
  height: 100%;
  // position: relative;
  /*最小高度的指定 笔记本上不出现滚动的最大高度，也就是在高一点就会出现滚动*/
  min-height: 562px;
  .query-area {
    height: 66px;
    overflow: hidden;
    display: flex;
    align-items: center;
    // background-color: #aaa;
    ul {
      li {
        float: left;
        margin-right: 15px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .content {
    // height: calc(100% - 96px);
    height: calc(100% - 66px);
    margin-top:-15px;
    // background-color: #ccc;
    overflow: hidden;
    padding:15px;
    margin-left:-15px;
    margin-right:-15px;
    // 全屏按钮样式
    .full-screen {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      z-index: 2;
      top: 15px;
      right: 15px;
      padding: 10px;
      background: #DAE8E8;
      border-radius: 4px;
      cursor: pointer;
      transition: box-shadow 1s;
      // font-size:16px;
      &:hover {
        background-color: #c0e5e5;
        box-shadow:0px 3px 10px 0px rgba(69, 90, 92, 0.35);
      }
    }
    .left-con {
      float: left;
      width: percentage(1070/1628);
      height: 100%;
      // background-color: #1094fa;
      box-shadow:0px 3px 10px 0px rgba(69, 90, 92, 0.35);
      position: relative;
      z-index:100;
      .types {
        position: absolute;
        z-index: 2;
        top: 15px;
        left: 15px;
        ul {
          li {
            width: 80px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            background-color: #dedede;
            box-shadow: 0px 2px 4px 0px rgba(105, 105, 105, 0.54);
            border-radius: 4px;
            margin-bottom: 15px;
            cursor: pointer;
            transition: all .3s;
            &.active,&:hover {
              color: #fff;
              background-color: #57b8ad;
            }
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
      .top10 {
        width: 250px;
        height: 90px;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #D3F4F2;
        box-shadow: 0px 4px 6px 1px rgba(214, 214, 214, 0.81);
        border-radius: 4px;
        position: absolute;
        z-index: 2;
        bottom: 30px;
        left: 15px;
        cursor: pointer;
        .userCount {
          font-size: 24px;
          color: #ee2b16;
          font-weight: 400;
        }
      }
      .l-region {
        width: 100%;
        height: 100%;
        // background-color: cornflowerblue;
      }
      .l-industry {
        width: 100%;
        height: 100%;
        // background-color: #1acd7e;
      }
      .region-industry {
        width: 100%;
        height: 100%;
        background-color: #F6FAFA;
      }
      &.max {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
      }
    }
    .right-con {
      float: right;
      width: percentage(500/1628);
      height: 100%;
      // background-color: #17b3a3;

      .r-item {
        height: calc((100% - 30px) / 2);
        width: 100%;
        background-color: #F6FAFA;
        box-shadow:0px 3px 10px 0px rgba(69, 90, 92, 0.35);
        margin-bottom: 30px;
        position: relative;
        &:last-child {
          margin-bottom: 0;
        }
        .r-title {
          text-align: center;
          font-weight: bold;
          height: 18px;
          padding-top:5px;
        }
        // 区域
        .success,
        .abnormal {
          height: 100%;
          .charts {
            /*需要减去标题的高度*/
            height: calc(100% - 18px);
            width: 100%;
          }
        }
        //全屏代码
        &.r1,
        &.r2 {
          &.max {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 100;
            .r-title{
              font-size:28px;
            }
          }
        }
      }
    }
  }
}
</style>
