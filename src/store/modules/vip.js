import request from '@/api'
import { loopOptions } from '@/utils'

export default {
  namespaced: true,
  state: {
    memberGroupOptions: [], // 会员组下拉选项
    memberLevelOptions: [] // 会员等级下拉数据
  },
  mutations: {
    // 会员组下拉选项
    SET_MGO: (state, data) => {
      state.memberGroupOptions = loopOptions(data, { label: 'groupName' })
    },
    // 会员等级下拉数据
    SET_MLO: (state, data) => {
      state.memberLevelOptions = loopOptions(data, { label: 'levelName' })
    }
  },
  actions: {
    // 会员组下拉选项
    FetchMemberGroupOptions ({ commit, state }, reflush) {
      if (!state.memberGroupOptions.length || reflush) {
        request.fetchMembersGroupPull().then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_MGO', res.data)
          }
        })
      }
    },
    // 会员等级下拉数据
    FetchMembersLevelOptions ({ commit, state }, tplType, reflush) {
      if (!state.memberLevelOptions.length || reflush) {
        request.fetchMembersLevelList().then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_MLO', res.data)
          }
        })
      }
    }
  }
}
