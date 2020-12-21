import request from '@/api'
import { loopOptions, deepClone } from '@/utils'

export default {
  namespaced: true,
  state: {
    directoryTree: [],
    ownerTree: [],
    currentSiteId: '',
    currentSiteName: '',
    issueOrgOptions: [], // 机关代字下拉
    issueYearOptions: [], // 年号下拉
    ownSiteOptions: [], // 有管理权限的站点列表
    workflowOptions: [], // 工作流下拉
    hotWordCategorysList: [], // 热词分类列表
    siteExtendConfig: {
      cfg: {},
      cmsSiteExt: {}
    }, // 当前站点扩展配置
    siteBaseConfig: {
      protocol: '',
      domain: ''
    } // 当前站点基本配置
  },
  mutations: {
    DIRECROTY_TREE: (state, data) => {
      state.directoryTree = data
    },
    GET_OWNER_TREES: (state, data) => {
      state.ownerTree = data
    },
    // 有管理权限的站点列表
    SET_OSO: (state, data) => {
      state.ownSiteOptions = loopOptions(data)
    },
    // 站点id
    SET_SITE: (state, data) => {
      const { id, name } = data
      // if (!state.currentSiteId) {
      //   const siteId = window.localStorage.getItem('siteId')
      //   const siteName = window.localStorage.getItem('siteName')
      //   state.currentSiteId = (siteId && Number(siteId)) || id
      //   state.currentSiteName = siteName || name
      // } else {
      // if (!window.localStorage.getItem('siteId')) {
      window.localStorage.setItem('siteId', id)
      // }
      // if (!window.localStorage.getItem('siteName')) {
      window.localStorage.setItem('siteName', name)
      // }
      state.currentSiteId = id
      state.currentSiteName = name
      // }
    },
    // 机关代字下拉
    SET_IOO: (state, data) => {
      state.issueOrgOptions = loopOptions(data, { label: 'markName' })
    },
    // 年号下拉
    SET_IYO: (state, data) => {
      state.issueYearOptions = loopOptions(data, { label: 'markName' })
    },
    // 工作流下拉
    SET_WFO: (state, data) => {
      state.workflowOptions = loopOptions(data)
    },
    // 热词分类列表
    SET_HOT: (state, data) => {
      state.hotWordCategorysList = data
    },
    // 站点获取详情配置
    SET_SEO: (state, data) => {
      state.siteExtendConfig = deepClone(data)
    },
    // 站点获取详情配置
    SET_SBC: (state, data) => {
      state.siteBaseConfig = data
    }
  },
  actions: {
    // 当前站点基本配置
    FetchSiteBaseConfig ({ commit, state }, id) {
      if (id) {
        request.fetchSitesDetail({ id }).then(res => {
          if (res.code === 200) {
            commit('SET_SBC', res.data)
          }
        })
      }
    },
    // 当前站点扩展配置
    FetchSiteExtentConfig ({ commit, state }, id) {
      if (id) {
        request.fetchSitesExtDetail({ id }).then(res => {
          if (res.code === 200) {
            commit('SET_SEO', res.data)
          }
        })
      }
    },
    // 有管理权限的站点列表
    FetchSitesOwnsite ({ commit, state, dispatch }, reflush) {
      if ((state.ownSiteOptions && !state.ownSiteOptions.length) || reflush) {
        request.fetchSitesOwnsite().then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_OSO', res.data)
            if (res.data.length) {
              const siteId = window.localStorage.getItem('siteId')
              const siteName = window.localStorage.getItem('siteName')
              const site = siteId && res.data.map(d => d.id).includes(Number(siteId)) ? {
                id: Number(siteId),
                name: siteName
              } : res.data[0]
              commit('SET_SITE', site)
              dispatch('FetchSiteExtentConfig', site.id)
              dispatch('FetchSiteBaseConfig', site.id)
            }
          }
        })
      }
    },
    // 热词分类列表
    FetchHotWordCategorys ({ commit, state }, reflush) {
      if (!state.hotWordCategorysList.length || reflush) {
        request.fetchHotWordCategorysList().then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_HOT', res.data)
            return new Promise(resolve => {
              resolve(res.data)
            })
          }
        })
      }
    },
    DirectoryTrees ({ commit }, data) {
      return request.fetchTemplateTree().then(res => {
        commit('DZZIRECROTY_TREE', res.data)
      })
    },
    GetOwnerTrees ({ commit }, data) {
      return request.fetchSitesGetOwnerTree().then(res => {
        if (res.code === 200) {
          commit('GET_OWNER_TREES', res.data)
        }
      })
    },
    // 机关代字下拉
    FetchIssueOrgOptions ({ commit, state }, reflush) {
      if (!state.issueOrgOptions.length || reflush) {
        request.fetchContentMarkList({
          markType: 1
        }).then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_IOO', res.data)
          }
        })
      }
    },
    // 年号下拉
    FetchIssueYearOptions ({ commit, state }, reflush) {
      if (!state.issueYearOptions.length || reflush) {
        request.fetchContentMarkList({
          markType: 2
        }).then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_IYO', res.data)
          }
        })
      }
    },
    // 工作流下拉列表
    FetchWorkFlowOptions ({ commit, state }, reflush) {
      if (!state.workflowOptions.length || reflush) {
        let params = (reflush instanceof Object) ? reflush : {}
        request.fetchFlowOptions(params || {}).then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_WFO', res.data)
          }
        })
      }
    }
  }
}
