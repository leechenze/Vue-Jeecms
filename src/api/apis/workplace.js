import axios from '../axios'
import workPlaceUrls from '../urls/workplace'

export default {
  // 代办
  fetchTaskToDeal (data) {
    return axios.get(workPlaceUrls.toDeal, data)
  },
  // 已办
  fetchTaskHandle (data) {
    return axios.get(workPlaceUrls.handle, data)
  },
  // 未办
  fetchTaskOverDue (data) {
    return axios.get(workPlaceUrls.overDue, data)
  },
  // 操作
  fetchTaskAudit (data) {
    return axios.get(workPlaceUrls.audit, data)
  },
  // 撤回
  fetchTaskRevoke (data) {
    return axios.get(workPlaceUrls.revoke, data)
  },
  // 首页今日统计和累计统计
  fetchTaskStatistics (data) {
    return axios.get(workPlaceUrls.statistics, data)
  },
  // 首页待办事项
  fetchTaskUpcoming (data) {
    return axios.get(workPlaceUrls.upcoming, data)
  }
}
