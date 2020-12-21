import request from '@/api'
import { loginType, getImageUrl } from '@/utils'
export default {
  namespaced: true,
  state: {
    theme: '',
    themes: [
      {
        name: 'grayBlue',
        color: '#1EC6DF',
        bodyClass: 'custom-grayBlue',
        img: require('../../assets/img/zhuti-01.png')
      },
      {
        name: 'blue',
        color: '#2D5998',
        bodyClass: 'custom-blue',
        img: require('../../assets/img/zhuti-02.png')
      },
      {
        name: 'lightBlue',
        color: '#3C8DBC',
        bodyClass: 'custom-lightBlue',
        img: require('../../assets/img/zhuti-03.png')
      },
      {
        name: 'green',
        color: '#347C54',
        bodyClass: 'custom-green',
        img: require('../../assets/img/zhuti-04.png')
      },
      {
        name: 'red',
        color: '#E32416',
        bodyClass: 'custom-red',
        img: require('../../assets/img/zhuti-05.png')
      },
      {
        name: 'purple',
        color: '#684EA4',
        bodyClass: 'custom-purple',
        img: require('../../assets/img/zhuti-06.png')
      },
      {
        name: 'gray',
        color: '#ECECEC',
        bodyClass: 'custom-gray',
        img: require('../../assets/img/zhuti-07.png')
      }
    ],
    colorObj: {
      'custom-grayBlue': [
        ['#1EC6DF', '#86EDFC'], // 日志统计柱状图
        ['#FF803B', '#1EC6DF', '#08B4CF', '#0B9AB0'], // 首页趋势图
        ['#66E0F2', '#54D0E0', '#26E0FC', '#10C9E6', '#08B4CF', '#0B9AB0'] // 日志统计操作类型
      ],
      'custom-blue': [
        ['#2D5998']
      ],
      'custom-lightBlue': [
        ['#3C8DBC']
      ],
      'custom-green': [
        ['green']
      ],
      'custom-red': [
        ['#E32416']
      ],
      'custom-purple': [
        ['#684EA4']
      ],
      'custom-gray': [
        ['#ECECEC']
      ]
    },
    lang: '',
    langs: [
      {
        name: 'cn',
        label: '中文(简体)'
      },
      {
        name: 'tw',
        label: '中文(繁体)'
      },
      {
        name: 'en',
        label: 'English'
      }
    ],
    user: {
      needChangePassword: false,
      nextNeedCaptcha: false,
      'JEECMS-Auth-Token': '',
      userName: '',
      lastLoginTime: '',
      lastLoginIP: ''
    },
    routings: [], // 权限标识
    menus: [], // 菜单
    setting: {
      id: '',
      aduitMemberFlowId: '',
      dataBackupsMemory: {},
      attrs: {}
    },
    notice: '',
    ssoAuthToken: ''
  },
  mutations: {
    // 主题
    UPDATE_THEME (state, data) {
      document.body.className = data
      state.theme = data
      window.localStorage.setItem('theme', data)
    },
    // 语言
    UPDATE_LANG (state, data) {
      state.lang = data
      window.localStorage.setItem('lang', data)
    },
    // 用户和路由权限
    SET_USER (state, data) {
      const { auth, ...propData } = data
      const { menus, routings, ...user } = auth
      state.user = Object.assign({}, state.user, user, propData)
      state.menus = menus || []
      state.routings = routings || []
      if (localStorage.getItem('userName') && localStorage.getItem('userName') !== user.userName) {
        Object.keys(localStorage).forEach(item => item.indexOf('pageList') !== -1 ? localStorage.removeItem(item) : '')
        window.localStorage.setItem('userName', user.userName)
      } else {
        window.localStorage.setItem('userName', user.userName || '')
      }
      if (propData['JEECMS-Auth-Token']) window.localStorage.setItem('JEECMS-Auth-Token', propData['JEECMS-Auth-Token'])
      if (propData['siteId']) window.localStorage.setItem('siteId', propData['siteId'])
      if (propData['siteName']) window.localStorage.setItem('siteName', propData['siteName'])
    },
    // 退出，清空数据
    SET_OUT (state) {
      window.localStorage.removeItem('JEECMS-Auth-Token')
      state.user = {
        needChangePassword: false,
        nextNeedCaptcha: false,
        'JEECMS-Auth-Token': '',
        userName: '',
        lastLoginTime: '',
        lastLoginIP: ''
      }
      state.menus = []
      state.routings = []
      state.ssoAuthToken = ''
    },
    SET_NCP (state, data) {
      state.user.needChangePassword = data
    },
    UPDATE_USER (state, data) {
      state.user = Object.assign({}, state.user, data)
    },
    UPDATE_ROUTINGS (state, data) {
      state.routings = data || []
    },
    // 系统设置
    SET_SETTING (state, data) {
      state.setting = data
      if (data.attrs && data.attrs.systemFlagResourceUrl) {
        const href = getImageUrl(data.attrs.systemFlagResourceUrl)
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link')
        link.type = 'image/x-icon'
        link.rel = 'shortcut icon'
        link.href = href
        document.getElementsByTagName('head')[0].appendChild(link)
      }
    },
    // 通知
    SET_NOTICE (state, data) {
      state.notice = data > 99 ? '99+' : data
    },
    // 单点登录token
    SET_SSO (state, data) {
      state.ssoAuthToken = data.authToken
    }
  },
  actions: {
    updateRoutings ({ commit }, data) {
      commit('UPDATE_ROUTINGS', data)
    },
    updateUser ({ commit }, data) {
      commit('UPDATE_USER', data)
    },
    changeTheme ({ state, commit, rootState, dispatch }, data) {
      commit('UPDATE_THEME', data)
    },
    changeLang ({ state, commit, rootState, dispatch }, data) {
      commit('UPDATE_LANG', data)
    },
    // 普通登录
    async fetchLogin ({ state, commit, rootState, dispatch }, data) {
      data.desStr = await loginType(JSON.stringify({ pStr: data.desStr }))
      return request.fetchLogin(data).then(res => {
        if (res.code === 200 && !res.data.nextNeedCaptcha) {
          commit('SET_USER', res.data)
          dispatch('fetchSetting')
          dispatch('config/FetchSitesOwnsite', true, { root: true })
        }
        return res
      })
    },
    // 单点登录后获取详情
    fetchSingleInfo ({ state, commit, rootState, dispatch }, data) {
      commit('SET_SSO', data)
      return request.fetchSingleInfo(data).then(res => {
        if (res.code === 200) {
          if (res.data.userType === 1) {
            commit('SET_USER', res.data)
            dispatch('fetchSetting')
            dispatch('config/FetchSitesOwnsite', true, { root: true })
          } else {
            if (res.data.url) window.location.href = res.data.url
          }
        }
        return res
      })
    },
    // 退出
    fetchLogout ({ state, commit, dispatch }) {
      const token = window.localStorage.getItem('JEECMS-Auth-Token')
      const authToken = state.ssoAuthToken
      request.fetchLogout({ token, authToken })
      commit('SET_OUT')
      dispatch('permission/Clear', true, { root: true })
    },
    SetNeedChangePassword ({ commit }) {
      commit('SET_NCP', false)
    },
    async fetchSetting ({ commit }) {
      request.fetchSystemSettingDetail().then(res => {
        if (res.code === 200) {
          commit('SET_SETTING', res.data)
        }
      })
    },
    fetchNotice ({ state, commit, rootState, dispatch }, data) {
      return request.fetchSystemmessageNumber().then(res => {
        if (res.code === 200) {
          commit('SET_NOTICE', res.data.unreadMessage)
        }
      })
    }
  },
  getters: {
    langIndex (state, getters) {
      return state.langs.findIndex(d => d.name === state.lang)
    },
    chartOption: state => opt => {
      return {
        height: 600,
        forceFit: true,
        padding: ['auto', 'auto', 80, 'auto'],
        ...opt
      }
    },
    axisOption: state => opt => {
      return {
        dataKey: '时间',
        label: {
          textStyle: {
            fontSize: 14,
            fill: '#999999'
          }
        },
        line: {
          stroke: '#EEEEEE'
        },
        tickLine: {
          length: -4,
          stroke: '#E8E8E8'
        },
        ...opt
      }
    },
    legendOption: state => opt => {
      return {
        useHtml: true,
        itemTpl: '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}" style="cursor: pointer;font-size: 16px;">' + '<i class="g2-legend-marker" style="width:8px;height:8px;border-radius:50%;display:inline-block;background-color: {color};"></i>' + '<span class="g2-legend-text" style="padding-left:6px;color:#999999">{value}</span>' + '</li>',
        ...opt
      }
    },
    colorOption: state => index => {
      const colors = state.colorObj[state.theme]
      if (colors instanceof Array && colors.length) {
        if (index < colors.length) {
          return colors[index]
        }
      }
      return ''
    }
  }
}
