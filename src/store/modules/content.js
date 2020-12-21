import request from '@/api'
import { loopOptions } from '@/utils'

export default {
  namespaced: true,
  state: {
    contentModelOptions: [], // 内容模型
    contentSortList: [], // 排序列表下拉
    wechatInfoList: [], // 微信公众号列表
    weiboinfoList: [], // 微博账号列表
    weiboinfoNoauthList: [] // 微博账号列表-无权限
  },
  mutations: {
    SET_CMO: (state, data) => {
      state.contentModelOptions = loopOptions(data, { label: 'modelName' })
    },
    // 排序列表下拉
    SET_ORDER: (state, data) => {
      var arr = []
      for (var item in data) {
        arr.push({
          label: data[item],
          value: Number(item)
        })
      }
      state.contentSortList = arr
    },
    SET_WX_LIST: (state, data) => {
      state.wechatInfoList = data
    },
    SET_WEIBO_LIST: (state, data) => {
      state.weiboinfoList = data
    },
    SET_WEIBO_NOAUTH_LIST: (state, data) => {
      state.weiboinfoNoauthList = data
    }
  },
  actions: {
    // 排序列表下拉
    FetchContentSortList ({ commit, state }, reflush) {
      if (!state.contentSortList.length || reflush) {
        const params = {}
        request.fetchContentextOrder(params).then(res => {
          if (res.code === 200 && res.data instanceof Object) {
            commit('SET_ORDER', res.data)
          }
        })
      }
    },
    // 请求内容模型下拉选项
    FetchContentModeList ({ commit, state }, reflush) {
      if (!state.contentModelOptions.length || reflush) {
        const params = {}
        request.fetchContentModelList(params).then(res => {
          if (res.code === 200) {
            commit('SET_CMO', res.data)
          }
        })
      }
    },
    // 微信列表分页
    FetchWechatInfoPage ({ commit, state }, param, reflush) {
      if (!state.wechatInfoList.length || reflush) {
        const params = {
          type: 1,
          ...param
        }
        request.fetchWechatInfoList(params).then(res => {
          if (res.code === 200) {
            if (res.data instanceof Array) {
              commit('SET_WX_LIST', res.data)
            }
          }
        })
      }
    },
    // 微博账号列表
    FetchWeiboinfoList ({ commit, state }, param, reflush) {
      if (!state.weiboinfoList.length || reflush) {
        request.weiboinfoList().then(res => {
          if (res.code === 200) {
            commit('SET_WEIBO_LIST', res.data)
          }
        })
      }
    },
    // 微博账号列表-无权限
    FetchWeiboinfoNoauthList ({ commit, state }, param) {
      let params = {
        siteId: param.siteId
      }
      request.weiboinfoNoauthList(params).then(res => {
        if (res.code === 200) {
          commit('SET_WEIBO_NOAUTH_LIST', res.data)
        }
      })
    }
  }
}
