import axios from '../axios'
import weibo from '../urls/weibo'

export default {
  // 应用配置详情
  weiboSetGet (data) {
    return axios.get(weibo.weiboSet, data)
  },
  // 添加应用配置
  weiboSetAdd (data) {
    return axios.post(weibo.weiboSet, data)
  },
  // 账号列表-分页
  weiboinfoPage (data) {
    return axios.get(weibo.weiboinfo, data)
  },
  // 账号列表-取消授权
  weiboinfoCancel (data) {
    return axios.delete(weibo.weiboinfo, data)
  },
  // 账号列表
  weiboinfoList (data) {
    return axios.get(weibo.weiboinfoList, data)
  },
  // 账号列表-无权限
  weiboinfoNoauthList (data) {
    return axios.get(weibo.weiboinfoNoauthList, data)
  },
  // 账号列表-设置管理员
  weiboinfoUser (data) {
    return axios.post(weibo.weiboinfoUser, data)
  },
  // 微博授权
  weiboAuthorize (data) {
    return axios.request({
      method: 'GET',
      url: process.env.VUE_APP_API_HOST + weibo.weiboAuthorize,
      headers: { 'Content-Type': 'application/json' },
      data
    })
  },
  // 粉丝列表
  weibofansPage (data) {
    return axios.get(weibo.weibofans, data)
  },
  // 同步粉丝
  weibofansSync (data) {
    return axios.get(weibo.weibofansSync, data)
  },
  // 查询管理员列表-分页
  wechatInfoCoreUserList (data) {
    return axios.get(weibo.wechatInfoCoreUserList, data)
  },
  // 查询管理员列表-分页
  wechatInfoCoreUserAdd (data) {
    return axios.post(weibo.wechatInfoCoreUser, data)
  },
  // 管理员列表-第三方
  usersThirdManagerPage (data) {
    return axios.get(weibo.usersThirdManagerPage, data)
  },
  // 微博管理员列表
  weiboinfoAdmins (data) {
    return axios.get(weibo.weiboinfoAdmins, data)
  },
  // 推送记录列表分页（推送汇总）
  weiboarticlepushPage (data) {
    return axios.get(weibo.weiboarticlepushPage, data)
  },
  // @ 我的微博
  weibomessageStatus (data) {
    return axios.get(weibo.weibomessageStatus, data)
  },
  // @我的评论
  weibomessageAtcomments (data) {
    return axios.get(weibo.weibomessageAtcomments, data)
  },
  // 收到的评论
  weibomessageRecComments (data) {
    return axios.get(weibo.weibomessageRecComments, data)
  },
  // 发出的评论
  weibomessageSendComments (data) {
    return axios.get(weibo.weibomessageSendComments, data)
  },
  // 删除评论
  weibomessageDelete (data) {
    return axios.delete(weibo.weibomessage, data)
  },
  // 回复评论
  weibomessagePut (data) {
    return axios.put(weibo.weibomessage, data)
  },
  // 回复评论
  weibomessagePost (data) {
    return axios.post(weibo.weibomessage, data)
  },
  // 微博-推送
  weiboarticlepush (data) {
    return axios.post(weibo.weiboarticlepush, data)
  },
  // 微博-编辑后推送文章
  weiboarticlepushUpdatePush (data) {
    return axios.post(weibo.weiboarticlepush, data)
  }

}
