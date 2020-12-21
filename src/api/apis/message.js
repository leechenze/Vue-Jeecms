import axios from '../axios'
import message from '../urls/message.js'

export default {
  // 收件箱
  fetchMessageInbox (data) {
    if ('time' in data) delete data.time
    return axios.get(message.messageInbox, data)
  },
  // 发件箱
  fetchMessageOutbox (data) {
    if ('time' in data) delete data.time
    return axios.get(message.messageOutbox, data)
  },
  // 收件箱查看消息
  fetchSystemmessage (data) {
    return axios.get(message.systemmessage, data)
  },
  // 发件箱查看消息
  fetchMessage (data) {
    return axios.get(message.message, data)
  },
  // 新建站内信
  fetchMessageAdd (data) {
    return axios.post(message.message, data)
  },
  // 收件箱修改已读
  fetchSystemmessagePut (data) {
    return axios.put(message.systemmessage, data)
  },
  // 收件箱删除
  fetchSystemmessageDelete (data) {
    return axios.delete(message.systemmessage, data)
  },
  // 发件箱删除
  fetchMessageDelete (data) {
    return axios.delete(message.message, data)
  },
  // 收件箱（系统消息+私信）未读数量
  fetchSystemmessageNumber (data) {
    return axios.get(message.systemmessageNumber, data)
  }
}
