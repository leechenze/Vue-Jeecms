/* system-cms-prefix start */
const prefix = '/cmsmanager'
/* system-cms-prefix change const prefix = '/cmsadmin' system-cms-prefix change */
/* system-cms-prefix end */

export default {
  // 微博授权
  weiboAuthorize: '/weibo',
  // 应用配置详情
  weiboSet: `${prefix}/weiboSet`,
  // 账号列表分页，取消授权
  weiboinfo: `${prefix}/weiboinfo`,
  // 账号列表
  weiboinfoList: `${prefix}/weiboinfo/list`,
  // 账号列表-无权限
  weiboinfoNoauthList: `${prefix}/weiboinfo/noauth/list`,
  // 账号列表-设置管理员
  weiboinfoUser: `${prefix}/weiboinfo/user`,
  // 粉丝列表
  weibofans: `${prefix}/weibofans`,
  // 同步粉丝
  weibofansSync: `${prefix}/weibofans/sync`,
  // 公众号管理员列表
  wechatInfoCoreUserList: `${prefix}/wechatInfo/coreUser/list`,
  // 公众号管理员列表
  wechatInfoCoreUser: `${prefix}/wechatInfo/coreUser`,
  // 管理员列表-第三方平台
  usersThirdManagerPage: `${prefix}/users/third/manager/page`,
  // 管理员列表-微信-微博
  weiboinfoAdmins: `${prefix}/weiboinfo/admins`,
  // 推送记录列表分页（推送汇总）
  weiboarticlepushPage: `${prefix}/weiboarticlepush/page`,
  // @ 我的微博
  weibomessageStatus: `${prefix}/weibomessage/status`,
  // @我的评论
  weibomessageAtcomments: `${prefix}/weibomessage/atcomments`,
  // 收到的评论
  weibomessageRecComments: `${prefix}/weibomessage/recComments`,
  // 发出的评论
  weibomessageSendComments: `${prefix}/weibomessage/sendComments`,
  // 删除评论（只限于自己发表的评论）
  weibomessage: `${prefix}/weibomessage`,
  // 微博-编辑后推送文章
  weiboarticlepushUpdatePush: `${prefix}/weiboarticlepush/updatePush`,
  // 微博-推送
  weiboarticlepush: `${prefix}/weiboarticlepush`

}
