import request from '@/utils/httpRequest.js'
export default {
  namespaced: true,
  state: {
    test: '乔峰'
  },
  getters: {

  },
  actions: {
        // 获取评估区间
    getAssess ({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: request.adornUrl('/electric/assessresult/resultComputeNodes'),
          method: 'get',
          params: request.adornParams({
            startTime: payload.startTime,
            endTime: payload.endTime
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            let arr = []
            if (data.list.length > 0) {
              data.list.forEach((item, index) => {
                                // 动态添加数据
                arr.push({
                  value: item,
                  label: item
                })
              })
            }
            resolve(arr)
          } else {
            reject(data.msg)
          }
        })
      })
    },
        // 获取区域
    getRegion ({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: request.adornUrl('/sys/region/selectList'),
          method: 'post',
          data: request.adornData({
            regionId: payload.regionId,
            parentId: payload.parentId
          })
        }).then(data => {
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
        // 获取行业数据
    getIndustry ({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: request.adornUrl('/sys/industry/selectList'),
          method: 'post'
        }).then(data => {
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
  mutations: {
  }
}
