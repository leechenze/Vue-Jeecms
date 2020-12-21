import request from '@/api'
import { loopOptions } from '@/utils'

export default {
  namespaced: true,
  state: {
    reflushColumnTree: false, // 是否刷新栏目树
    columnOptions: [], // 栏目树
    contentColumnOptions: [], // 内容下的栏目下拉树
    columnModelOptions: [], // 栏目模型下拉数据
    detail: {},
    detailForm: {},
    detailLoading: false
  },
  mutations: {
    SET_RCT: (state, data) => {
      state.reflushColumnTree = data
    },
    // 设置栏目下拉选项数据
    SET_COLOPT: (state, data) => {
      state.columnOptions = loopOptions(data)
    },
    // 内容下的栏目下拉树
    SET_CCO: (state, data) => {
      state.contentColumnOptions = loopOptions(data)
    },
    // 设置栏目模型下拉数据
    SET_CMO: (state, data) => {
      state.columnModelOptions = loopOptions(data, { label: 'modelName' })
    },
    // 设置栏目详情
    SET_DETAIL: (state, data) => {
      const { id, modelId, modelName, dataField, renderingField } = data
      let detailForm = Object.assign({}, dataField || {}, {
        id,
        modelId,
        modelName
      })
      const fieldKeys = Object.keys(renderingField || {})
      if (fieldKeys.length) {
        fieldKeys.forEach(field => {
          const items = renderingField[field]
          if (items instanceof Array && items.length) {
            items.forEach(item => {
              if (!(item.value.name in detailForm)) {
                detailForm[item.value.name] = item.value.defaultValue
              }
            })
          }
        })
      }
      state.detailForm = detailForm
      state.detail = data
    },
    SET_DL: (state, data) => {
      state.detailLoading = data
    }
  },
  actions: {
    ReflushSecurityAccessory ({ commit }, data) {
      commit('SET_RSA', data)
    },
    // 请求栏目下拉选项
    FetchColumnOptions ({ commit, state }, reflush) {
      if (!state.columnOptions.length || reflush) {
        request.fetchChannelTreeOption().then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_COLOPT', res.data)
          }
        })
      }
    },
    // 内容下的栏目下拉树
    FetchContentColumnOptions ({ commit, state }, reflush) {
      if (!(state.contentColumnOptions && state.contentColumnOptions.length) || reflush) {
        const params = {
          operator: 2
        }
        request.fetchContentCommonTree(params).then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_CCO', res.data)
          }
        })
      }
    },
    // 请求栏目模型下拉选项
    FetchColumnModelOptions ({ commit, state }, reflush) {
      if (!state.columnModelOptions.length || reflush) {
        const params = {
          tplType: 1
        }
        request.fetchChannelModelList(params).then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_CMO', res.data)
          }
        })
      }
    },
    // 获取栏目详情
    FetchChannelDetail ({ commit, state }, columnId) {
      commit('SET_DL', true)
      request.fetchChannelDetail(columnId).then(res => {
        if (res.code === 200) {
          commit('SET_DETAIL', res.data)
        }
        commit('SET_DL', false)
      }).catch(() => {
        commit('SET_DL', false)
      })
    }
  },
  getters: {
    detail: state => state.detail,
    detailForm: state => state.detailForm,
    detailLoading: state => state.detailLoading
  }
}
