import request from '@/api'
import { loopOptions, deepClone } from '@/utils'

export default {
  namespaced: true,
  state: {
    reflushSecurityAccessory: false, // 是否刷新附件密级
    reflushSecurityContent: false, // 是否刷新内容密级
    reflushSecurityUser: false, // 是否刷新用户密级
    reflushApi: false, // 是否刷新api管理列表
    reflushMenus: false, // 是否刷新菜单管理列表
    areaOptions: [], // 区域树下拉选项
    areaOptionsId: [], // 区域树下拉选项ID
    userSecurityOptions: [], // 人员密级下拉选项
    contentSecurityOptions: [], // 内容密级下拉选项
    accessorySecurityOptions: [], // 附件密级下拉选项
    ftpOptions: [], // FTP下拉选项
    ossOptions: [], // OSS下拉选项
    organizeOptions: [], // 组织下拉选项
    organizeOptionsAll: [], // 组织下拉选项
    roleOptions: [], // 角色下拉选项
    resourceOptions: [], // 资源库下拉选项
    shareResourceOptions: [], // 共享资源下拉选项
    emailIsGloable: null, // 邮件服务是否全站统一使用
    emailIsEnable: null,
    reinsuranceShow: {
      hasShow: false
    }
  },
  mutations: {
    // 区域
    SET_AREA: (state, data) => {
      state.areaOptions = loopOptions(data, {
        value: 'areaCode',
        label: 'areaName'
      })
    },
    SET_AREAID: (state, data) => {
      state.areaOptionsId = loopOptions(data, {
        value: 'id',
        label: 'areaName'
      })
    },
    SET_RSA: (state, data) => {
      state.reflushSecurityAccessory = data
    },
    SET_RSC: (state, data) => {
      state.reflushSecurityContent = data
    },
    SET_RSU: (state, data) => {
      state.reflushSecurityUser = data
    },
    SET_RAPI: (state, data) => {
      state.reflushApi = data
    },
    SET_RMENUS: (state, data) => {
      state.reflushMenus = data
    },
    // 设置人员密级下拉选项数据
    SET_USO: (state, data) => {
      state.userSecurityOptions = data
    },
    // 设置内容密级下拉选项数据
    SET_CSO: (state, data) => {
      state.contentSecurityOptions = loopOptions(data)
    },
    // 设置附件密级下拉选项数据
    SET_ASO: (state, data) => {
      state.accessorySecurityOptions = loopOptions(data)
    },
    // 设置FTP下拉选项数据
    SET_FTP: (state, data) => {
      state.ftpOptions = data.map(d => {
        d.id = String(d.id)
        d.value = d.id
        d.label = d.ftpName
        return d
      })
    },
    // 设置OSS下拉选项数据
    SET_OSS: (state, data) => {
      state.ossOptions = data.map(d => {
        d.id = String(d.id)
        d.value = d.id
        d.label = d.ossName
        return d
      })
    },
    // 设置组织下拉选项数据
    SET_ORG_OPT: (state, data) => {
      state.organizeOptions = loopOptions(data)
    },
    // 设置组织下拉选项数据
    SET_ORG_OPT_ALL: (state, data) => {
      state.organizeOptionsAll = loopOptions(data)
    },
    // 设置角色下拉选项数据
    SET_ROLE_OPT: (state, data) => {
      state.roleOptions = loopOptions(data, {
        label: 'roleName'
      })
    },
    // 设置资源库下拉
    SET_REC_OPT: (state, data) => {
      state.resourceOptions = loopOptions(data)
    },
    // 设置共享资源下拉
    SET_SREC_OPT: (state, data) => {
      state.shareResourceOptions = loopOptions(data)
    },
    // 设置是否全站使用邮件服务
    SET_EMAIL_ISGLOABLE: (state, data) => {
      state.emailIsGloable = data.isGloable
      state.emailIsEnable = data.isEnable
    },
    SET_REIN_SHOW: (state, data) => {
      state.reinsuranceShow = data
    }
  },
  actions: {
    ReflushSecurityAccessory ({ commit }, data) {
      commit('SET_RSA', data)
    },
    ReflushSecurityContent ({ commit }, data) {
      commit('SET_RSC', data)
    },
    ReflushSecurityUser ({ commit }, data) {
      commit('SET_RSU', data)
    },
    ReflushApi ({ commit }, data) {
      commit('SET_RAPI', data)
    },
    ReflushMenus ({ commit }, data) {
      commit('SET_RMENUS', data)
    },
    // 区域树
    FetchSystemAreaTree ({ state, commit }, reflush) {
      if (!state.areaOptions.length || reflush) {
        request.fetchSystemAreaTree().then(res => {
          if (res.code === 200) {
            commit('SET_AREA', res.data)
            commit('SET_AREAID', res.data)
          }
        })
      }
    },
    // 请求人员密级下拉选项
    FetchUserSecurityOptions ({ commit, state }, reflush) {
      if (!state.userSecurityOptions.length || reflush) {
        request.fetchUserSecretList().then(res => {
          if (res.code === 200 && res.data.content instanceof Array) {
            commit('SET_USO', res.data.content)
          }
        })
      }
    },
    // 请求内容密级下拉选项
    FetchContentSecurityOptions ({ commit, state }, reflush) {
      if (!state.contentSecurityOptions.length || reflush) {
        request.fetchSysSecretAll({ secretType: 1 }).then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_CSO', res.data)
          }
        })
      }
    },
    // 请求附件密级下拉选项
    FetchAccessorySecurityOptions ({ commit, state }, reflush) {
      if (!state.accessorySecurityOptions.length || reflush) {
        request.fetchSysSecretAll({ secretType: 2 }).then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_ASO', res.data)
          }
        })
      }
    },
    // 请求FTP下拉选项
    FetchFTPOptions ({ commit, state }, reflush) {
      if (!state.ftpOptions.length || reflush) {
        request.fetchFtpList().then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_FTP', res.data)
          }
        })
      }
    },
    // 请求OSS下拉选项
    FetchOSSOptions ({ commit, state }, reflush) {
      if (!state.ossOptions.length || reflush) {
        request.fetchOssList().then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_OSS', res.data)
          }
        })
      }
    },
    // 请求组织下拉选项，有限制控制的
    FetchOrganizeOptions ({ commit, state }, reflush) {
      if (!state.organizeOptions.length || reflush) {
        request.fetchOrganizeTree().then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_ORG_OPT', res.data)
          }
        })
      }
    },
    // 请求组织下拉选项，无限制控制的
    FetchOrganizeOptionsAll ({ commit, state }, reflush) {
      if (!state.organizeOptionsAll.length || reflush) {
        request.fetchOrganizeTreeAll().then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_ORG_OPT_ALL', res.data)
          }
        })
      }
    },
    // 请求角色下拉选项
    FetchRoleOptions ({ commit, state }, reflush, params = {}) {
      if (!state.roleOptions.length || reflush) {
        request.fetchRolesList(params).then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_ROLE_OPT', res.data)
          }
        })
      }
    },
    // 请求资源库下拉选项
    FetchResourceOptions ({ commit, state }, reflush) {
      if (!state.resourceOptions.length || reflush) {
        request.resourceUserTree().then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_REC_OPT', res.data)
          }
        })
      }
    },
    // 请求共享资源下拉选项
    FetchShareResourceOptions ({ commit, state }, reflush) {
      if (!state.shareResourceOptions.length || reflush) {
        request.resourceShareTree().then(res => {
          if (res.code === 200 && res.data instanceof Array) {
            commit('SET_SREC_OPT', res.data)
          }
        })
      }
    },
    // 请求邮件服务配置
    FetchEmailDetail ({ commit }) {
      request.fetchEmailDetail().then(res => {
        if (res.code === 200) {
          commit('SET_EMAIL_ISGLOABLE', res.data)
        }
      })
    },
    /**
     * 分级保护start ******
     */
    ReinsuranceShow ({ commit }) {
      request.fetchReinsuranceIsShow().then(res => {
        if (res.code === 200) {
          commit('SET_REIN_SHOW', res.data)
        }
      })
    }
    /**
     * 分级保护end ******
     */
  },
  getters: {
    reinsuranceShow (state) {
      return state.reinsuranceShow
    },
    getProvinces (state) {
      return deepClone(state.areaOptions).map(d => {
        d.children = []
        return d
      })
    },
    getCitys: (state) => (provinceCode) => {
      const province = state.areaOptions.find(d => d.value === provinceCode)
      return province && province.children ? deepClone(province.children).map(d => {
        d.children = []
        return d
      }) : []
    },
    getCountrys: (state, getters) => (provinceCode, cityCode) => {
      const province = state.areaOptions.find(d => d.value === provinceCode)
      if (province && province.children) {
        const city = province.children.find(d => d.value === cityCode)
        return city && city.children ? deepClone(city.children).map(d => {
          d.children = []
          return d
        }) : []
      }
      return []
    }
  }
}
