import request from '@/api'

export default {
  namespaced: true,
  state: {
    tencentList: [], // 公众号列表
    wechatNoauthList: [] // 公众号列表-无权限
  },
  mutations: {
    TENCENT_LIST: (state, data) => {
      state.tencentList = data
    },
    WECHAT_NOAUTH_LIST: (state, data) => {
      state.wechatNoauthList = data
    }
  },
  actions: {
    // 公众号列表
    GetTencentList ({ commit }, data) {
      const params = {
        type: 1
      }
      return request.fetchWechatInfoList(params).then(res => {
        if (res.code === 200) {
          commit('TENCENT_LIST', res.data)
        }
      })
    },
    // 公众号列表-无权限
    GetWechatInfoNoauthList ({ commit }, data) {
      const params = {
        siteId: data.siteId || 1
      }
      return request.fetchWechatInfoNoauthList(params).then(res => {
        if (res.code === 200) {
          commit('WECHAT_NOAUTH_LIST', res.data)
        }
      })
    }
  }
}
