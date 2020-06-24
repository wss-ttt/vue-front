import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import request from '@/utils/httpRequest'
import {
  Loading
} from 'element-ui'
import merge from 'lodash/merge'

/**
 * 获取uuid
 */
export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth(key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 清除登录信息
 */
export function clearLoginInfo() {
  Vue.cookie.delete('token')
  store.commit('resetStore')
  // 清空掉ssessionStorage中的数据
  sessionStorage.clear()
  router.options.isAddDynamicMenuRoutes = false
}

/**
 * 文件下载
 */

export function excelDownload(data, fileName) {
  if (!data) {
    return
  }
  let url = window.URL.createObjectURL(new Blob([data]))
  let a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.setAttribute('download', fileName)
  document.body.appendChild(a)
  a.click()
}
/*
 	导出->excel
 * */
export function exportDataToExcel(url, dataForm) {
  return new Promise((resolve, reject) => {
    // loading
    const loading = Loading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    request({
      url: request.adornUrl(url),
      method: 'post',
      data: dataForm ? request.adornData(dataForm, false) : undefined
    }).then(({
      data
    }) => {
      if (data.code == 0) {
        // this.dataListLoading = false
        var fileName = data.msg
        request({
          url: request.adornUrl('/common/download'),
          method: 'get',
          params: request.adornParams({
            'fileName': data.msg,
            'delete': true
          }),
          responseType: 'blob'
        }).then(({
          data
        }) => {
          // 导出表格
          excelDownload(data, fileName)
          resolve()
        })
      } else {
        reject(data.msg);
      }
      loading.close()
    })
  })

}
/**
 * 获取字典数据
 */

export function getDictData(dictName) {
  return new Promise((resolve, reject) => {
    request({
      url: request.adornUrl('/sys/sysdictdata/list'),
      method: 'get',
      params: request.adornParams({
        'dict_type': dictName
      })
    }).then(({
      data
    }) => {
      var arr = []
      data.forEach(function (item, index) {
        arr[item.dictValue] = item.dictLabel
      })
      resolve(arr)
    })
  })
}
/* 
	通过查询条件来获取数据列表
*/
export function selectDataList(url, params) {
  return new Promise((resolve, reject) => {
    request({
      url: request.adornUrl(url),
      method: 'get',
      params: request.adornParams(merge({
        'page': 0
      }, params))
    }).then(({
      data
    }) => {
      if (data && data.code === 0) {
        resolve(data)
      } else {
        // 异常信息处理
        reject(data.msg)
      }
    })
  })
}
/*
	格式化 年月日
*/
export function formatDate(date) {
  let t = new Date(date)
  let year = t.getFullYear()
  let month = t.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  let day = t.getDate()
  if (day < 10) {
    day = '0' + day
  }
  return year + '' + month + '' + day
}

/*时间格式化方法*/
/**
 * @param {*} fmt  格式化的字符 eg:'yyyy-MM-dd' | 'yyyy-MM-dd hh-mm-ss'等
 */
export function timeFormat(fmt) {
  let o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
