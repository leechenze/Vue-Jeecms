import request from '@/api'

export default {
  namespaced: true,
  state: {
    wechatTags: [] // 粉丝标签列表
  },
  mutations: {
    // 会员组下拉选项
    SET_TAGS: (state, data) => {
      state.wechatTags = data
    }
  },
  actions: {
    // 会员组下拉选项
    FetchWechatTags ({ commit, state }, params, reflush) {
      if (!state.wechatTags.length || reflush) {
        var query = {
          appId: params.appId
        }
        request.wechattagsApp(query).then(res => {
          if (res.code === 200 && res.data.tagList instanceof Array) {
            commit('SET_TAGS', res.data.tagList)
          }
        })
      }
    }
  }
}
