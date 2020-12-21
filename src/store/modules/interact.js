import request from '@/api'
import { loopOptions } from '@/utils'

export default {
  namespaced: true,
  state: {
    collectTaskList: [],
    detailData: {},
    smartDetailData: {},
    smartSkin: {
      bgConfig: {
        bgType: 2,
        bgImage: '',
        bgImage2: '',
        bgImageUrl: '',
        phoneImgUrl: '',
        alignType: 'left top',
        opacity: 100,
        isRepeat: 2,
        bgColor: '#F0F0F0'
      },
      headConfig: {
        bgImage: '',
        bgImageUrl: '',
        phoneImgUrl: '',
        bgImage2: ''
      },
      contConfig: {
        bgColor: '#ffffff',
        hasBorder: 1,
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 0,
        hasBody: 1,
        bodyWidth: 1000
      },
      componentConfig: {
        bgColor: '#F0F0F0',
        fontStyle: {
          fontSize: 16,
          fontWigth: 400,
          fontColor: '#333333'
        },
        fontKey: {
          fontSize: 14,
          fontWigth: 400,
          fontColor: '#333333'
        },
        fontHelp: {
          fontSize: 12,
          fontWigth: 400,
          fontColor: '#999999'
        },
        displayType: 2,
        moduleDisplay: 'left',
        titleWidth: 20
      },
      subConfig: {
        text: '提交',
        fontStyle: {
          fontSize: 14,
          fontWigth: 400,
          fontColor: '#ffffff'
        },
        bgColor: '#1ec6df',
        hasBorder: 1,
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 4,
        btnWidth: 80,
        btnHeight: 32
      }
    },
    closeLayerState: false
  },
  mutations: {
    SET_CTL: (state, data) => {
      state.collectTaskList = loopOptions(data)
    },
    GET_DATA: (state, data) => {
      state.detailData = data
    },
    GET_SMART_DATA: (state, data) => {
      let arr = ['bgConfig', 'headConfig', 'contConfig', 'componentConfig', 'subConfig']
      let obj = data
      arr.forEach((t, i) => {
        obj[t] = obj[t] ? (data[t] instanceof Object ? data[t] : JSON.parse(data[t])) : state.smartSkin[t]
      })
      state.smartDetailData = obj
    },
    GET_CLOSE_DATA: (state, data) => {
      state.closeLayerState = data
    }
  },
  getters: {
    collectTaskList: state => state.collectTaskList,
    collectTaskTree: state => {
      return [{
        value: '',
        label: '采集任务',
        expandedIcon: 'dakaiwenjianjia-copy',
        collectIcon: 'weidakaiwenjianjia-copy',
        children: state.collectTaskList
      }]
    }
  },
  actions: {
    // 重置数据
    resetDetailData ({ commit }, data) {
      commit('GET_DATA', data)
    },
    resetSmartDetailData ({ commit, state }, data) {
      commit('GET_SMART_DATA', data)
    },
    FetchCollectTaskList ({ commit, state }, reflush) {
      if (!state.collectTaskList.length || reflush) {
        request.fetchCollectTaskList().then(res => {
          if (res.code === 200 && res.data.content instanceof Array) {
            commit('SET_CTL', res.data.content)
          }
        })
      }
    },
    getDetailData ({ commit }, params) {
      request.fetchQuestionnaireDetail(params).then(res => {
        if (res.code === 200) {
          if (res.data.processType === 2) {
            var Data = Object.assign(res.data, { prompt2: res.data.prompt })
            Data.prompt = '您的答卷已经提交，感谢您的参与'
            commit('GET_DATA', Data)
          } else {
            commit('GET_DATA', res.data)
          }
        }
      })
    },
    getSmartDetailData ({ commit, state }, params) {
      let { id, type } = params
      if (!state.smartDetailData.id || type) {
        request.fetchSmartFormDetail({ id }).then(res => {
          if (res.code === 200) {
            if (res.data.processType === 2) {
              var Data = Object.assign(res.data, { prompt2: res.data.prompt })
              commit('GET_SMART_DATA', Data)
            } else {
              commit('GET_SMART_DATA', res.data)
            }
          }
        })
      }
    },
    getCloseData ({ commit, state }, data) {
      commit('GET_CLOSE_DATA', data)
    }
  }
}
