import axios from '../axios'
import collectUrls from '../urls/collect.js'

export default {
  // 采集任务详情
  setCollectId () {
    return axios.put(collectUrls.collectId)
  },
  // 检查任务数量限制
  fetchAddCollectEnable (data) {
    return axios.get(collectUrls.fetchAddCollectEnable, data)
  },
  // 采集获取APPID和模型
  fetchSetYunAppIdOrModel (data) {
    return axios.put(collectUrls.yunAppIdOrModel, data)
  },
  // 采集任务详情
  fetchCollectTaskDetail (id) {
    return axios.get(collectUrls.collectTask + `/${id}`)
  },
  // 采集任务列表
  fetchCollectTaskList (data) {
    return axios.get(collectUrls.collectTask + `?appId=${data.id}&identity=${data.identity}&size=1000`)
  },
  // 采集模板详情
  fetchCollectTemplate (data) {
    return axios.get(collectUrls.collectTask + `/${data.id}?appId=${data.appId}&identity=${data.identity}`)
  },
  // 删除采集任务
  deleteCollectTask (data) {
    return axios.delete(collectUrls.collectTask + `/${data.id}?appId=${data.appId}&identity=${data.identity}`)
  },
  // 采集数据列表分页
  fetchCollectContentPage (data) {
    data.page = data.page || 1
    data.size = data.size || 10
    return axios.get(collectUrls.collectContentList + `?taskId=${data.id}&appId=${data.appId}&identity=${data.identity}&page=${data.page}&size=${data.size}`)
  },
  // 删除采集内容
  fetchCollectContent (data) {
    return axios.delete(collectUrls.collectContentList + `?appId=${data.appId}&identity=${data.identity}`, data.data)
  },
  // 清空所有数据
  fetchCollectContentAll (data) {
    return axios.delete(collectUrls.collectContentList + `/clear?id=${data.id}&appId=${data.appId}&identity=${data.identity}`, {})
  },
  // 采集任务开始采集
  fetchCollectTasksStart (data) {
    return axios.get(collectUrls.collectTasksStart + `/${data.id}?appId=${data.appId}&identity=${data.identity}`, {})
  },
  // 采集插件信息
  fetchCollectPlugin (data) {
    return axios.get(collectUrls.collectPlugin, data)
  }
}
