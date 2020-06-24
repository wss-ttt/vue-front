export default {
  seriesColors: [
    '#FFBB44',
    '#FF5C77',
    '#8170FF',
    '#7FEBFF',
    '#FFD68E',
    '#F98094',
    '#AC96FF',
    '#26D1DC',
    '#FDB488',
    '#F9ACD2',
    '#96A2FF',
    '#0EA4AE',
    '#FE9541',
    '#CB64A8',
    '#207EFF',
    '#62C6B9',
    '#FF866A',
    '#BE76D9',
    '#68A8FF',
    '#68A8FF',
    '#68A8FF',
    '#AB47FF',
    '#68C8FF',
    '#89D492'
  ],
  title: {
    textStyle: {
      fontSize: 30,
      fontWeight: 400
    },
    left: 'center'
  },
  dataZoom: {
    show: true,
    realtime: true,
    start: 0,
    end: 100,
    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
    handleSize: '80%',
    handleStyle: {
      color: '#fff',
      shadowBlur: 3,
      shadowColor: '#007069',
      shadowOffsetX: 2,
      shadowOffsetY: 2
    },
    fillerColor: 'rgba(4, 129, 127, .6)', // 选中的颜色
    dataBackground: { // 未选中颜色
      areaStyle: {
        color: '#08b4a9'
      },
      lineStyle: {
        color: '#fff',
        opacity: 1
      }

    },
    textStyle: {
      color: '#000'
    },
    backgroundColor: '#007069' // 背景色
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#208585'
  },
  grid: {
    left: 60, // 左边
    right: 120, // 右边
    top: 80, // 上边
    bottom: 50 // 下边
  },
  legend: {
    top: 15,
    right: 15,
    orient: 'vertical',
    type: 'scroll'
  },
  loading: {
    text: 'loading',
    textColor: '#000',
    maskColor: 'rgba(255,255,255,0)'
  }
}
