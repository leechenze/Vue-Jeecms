import axios from '../axios'
import wechat from '../urls/wechat'

export default {
  // 微信公众号，小程序授权
  weChatGrantAuth (data) {
    return axios.request({
      method: 'GET',
      url: process.env.VUE_APP_API_HOST + wechat.weChatGrantAuth,
      headers: { 'Content-Type': 'application/json' },
      data
    })
  },
  // 微信公众号，小程序 分页
  fetchWechatInfoPage (data) {
    return axios.get(wechat.wechatInfoPage, data)
  },
  // 微信公众号，小程序 列表
  fetchWechatInfoList (data) {
    return axios.get(wechat.wechatInfoList, data)
  },
  // 微信公众号无权限列表
  fetchWechatInfoNoauthList (data) {
    return axios.get(wechat.wechatInfoNoauthList, data)
  },
  // 微信推送预览
  contentextPreview (data) {
    return axios.post(wechat.contentextPreview, data)
  },
  // 微信推送
  contentextPush (data) {
    return axios.post(wechat.contentextPush, data)
  },
  // 标签列表
  wechattagsApp (data) {
    return axios.get(wechat.wechattagsApp, data)
  },
  // 取消授权-公众号，小程序
  wechatInfoRevoke (data) {
    return axios.delete(wechat.wechatInfo, data)
  },
  // 获取公众号，小程序详情
  wechatInfoGet (data) {
    return axios.get(wechat.wechatInfo + `/${data.id}`)
  },
  // 设置默认登录授权账号
  wechatInfoDefault (data) {
    return axios.get(wechat.wechatInfoDefault, data)
  },
  // 获取小程序最新服务类目
  wechatInfoCategory (data) {
    return axios.get(wechat.wechatInfoCategory, data)
  },
  // 获取开发版本
  miniprogramversionRecord (data) {
    return axios.get(wechat.miniprogramversionRecord, data)
  },
  // 获取审核版本
  miniprogramversionAudit (data) {
    return axios.get(wechat.miniprogramversionAudit, data)
  },
  // 提交审核
  miniprogramversionRecordSubmit (data) {
    return axios.post(wechat.miniprogramversionAudit, data)
  },
  // 撤销审核
  miniprogramversionRecordDelete (data) {
    return axios.delete(wechat.miniprogramversionAudit, data)
  },
  // 获取线上版本
  miniprogramversionRelease (data) {
    return axios.get(wechat.miniprogramversionRelease, data)
  },
  // 发布小程序
  miniprogramversionReleaseSubmit (data) {
    return axios.post(wechat.miniprogramversionRelease, data)
  },
  // 提交代码
  miniprogramversionSubmit (data) {
    return axios.post(wechat.miniprogramversionSubmit, data)
  },
  // 修改线上版本状态
  miniprogramversionReleaseStatus (data) {
    return axios.put(wechat.miniprogramversionReleaseStatus, data)
  },
  // 提交代码的页面配置
  miniprogramversionLeaf (data) {
    return axios.get(wechat.miniprogramversionLeaf, data)
  },
  // 小程序可选类目名称
  miniprogramversionCategory (data) {
    return axios.get(wechat.miniprogramversionCategory, data)
  },
  // 获取体验二维码
  miniprogramversionQrcode (data) {
    return axios.get(wechat.miniprogramversionQrcode, data)
  },
  // 小程序显示
  miniprogramversionButton (data) {
    return axios.get(wechat.miniprogramversionButton, data)
  },
  // 体验者列表
  miniprogrammemberList (data) {
    return axios.get(wechat.miniprogrammemberList, data)
  },
  // 体验者-新增
  miniprogrammemberAdd (data) {
    return axios.post(wechat.miniprogrammember, data)
  },
  // 体验者-解绑
  miniprogrammemberDelete (data) {
    return axios.delete(wechat.miniprogrammember, data)
  },
  // 服务器列表-小程序
  wechatInfoDisplayModifyDomainGet (data) {
    return axios.get(wechat.wechatInfoDisplayModifyDomain + `/${data.id}`)
  },
  // 服务器列表-小程序 重置
  wechatInfoModifyDomain (data) {
    return axios.get(wechat.wechatInfoModifyDomain + `/${data.id}`)
  },
  // 菜单列表
  fetchWechatmenugroupPage (data) {
    return axios.get(wechat.wechatmenugroupPage, data)
  },
  // 菜单-详情
  fetchWechatmenugroupGet (data) {
    return axios.get(wechat.wechatmenugroup + `/${data.id}`)
  },
  // 菜单-新增
  fetchWechatmenuAdd (data) {
    return axios.post(wechat.wechatMenu, data)
  },
  // 菜单-修改
  fetchWechatmenuPut (data) {
    return axios.put(wechat.wechatMenu, data)
  },
  // 菜单-删除
  fetchWechatmenugroupDelete (data) {
    return axios.delete(wechat.wechatmenugroup, data)
  },
  // 菜单-生效
  fetchWechatmenugroupStatus (data) {
    return axios.put(wechat.wechatmenugroupStatus, data)
  },
  // 素材-列表
  fetchWechatMaterialPage (data) {
    return axios.get(wechat.wechatMaterialPage, data)
  },
  // 素材-单个查询
  fetchWechatMaterialGet (data) {
    return axios.get(wechat.wechatMaterial + `/${data.id}`)
  },
  // 素材-删除
  fetchWechatMaterialDelete (data) {
    return axios.delete(wechat.wechatMaterial, data)
  },
  // 素材-新增图文素材
  fetchWechatMaterialNewsAdd (data) {
    return axios.post(wechat.wechatMaterialNews, data)
  },
  // 素材-修改图文素材
  fetchWechatMaterialNewsPut (data) {
    return axios.put(wechat.wechatMaterialNews, data)
  },
  // 素材-新增其他素材
  fetchWechatMaterialMaterialAdd (data) {
    return axios.upload(wechat.wechatMaterialMaterial, data)
  },
  // 素材-新增视频素材
  fetchWechatMaterialVideoAdd (data) {
    return axios.upload(wechat.wechatMaterialVideo, data)
  },
  // 素材-上传图片返回URL，此处建议在新建永久图文素材时使用
  fetchWechatMaterialUploadImg (data) {
    return axios.upload(wechat.wechatMaterialUploadImg, data)
  },
  // 素材-同步图文素材
  fetchWechatMaterialSynchNews (data) {
    return axios.get(wechat.wechatMaterialSynchNews, data)
  },
  // 素材-同步其他素材
  fetchWechatMaterialSynchMaterial (data) {
    return axios.get(wechat.wechatMaterialSynchMaterial, data)
  },
  // 素材-同步服务器图片
  fetchWechatMaterialSynchImg (data) {
    return axios.get(wechat.wechatMaterialSynchImg, data)
  },
  // 素材-下载视频素材
  fetchWechatMaterialDowloadVideo (data) {
    return axios.get(wechat.wechatMaterialDowloadVideo, data)
  },
  // 素材-下载其他素材
  fetchWechatMaterialDowloadMaterial (data) {
    return axios.get(wechat.wechatMaterialDowloadMaterial, data)
  },
  // 回复信息列表
  fetchWechatreplycontentPage (data) {
    return axios.get(wechat.wechatreplycontentPage, data)
  },
  // 关键词列表
  fetchKeyWordList (data) {
    return axios.get(wechat.keyWordList, data)
  },
  // 添加回复
  fetchKeyWord (data) {
    return axios.post(wechat.keyWord, data)
  },
  // 修改自动回复
  fetchWechatreplycontent (data) {
    return axios.put(wechat.wechatreplycontent, data)
  },
  // 删除自动回复
  fetchWechatreplycontentDelete (data) {
    return axios.delete(wechat.wechatreplycontent, data)
  },
  // 查询自动回复
  fetchWechatreplycontentGet (data) {
    return axios.get(wechat.wechatreplycontent + `/${data.id}`)
  },
  // 事件回复
  fetchWwechatreplyclick (data) {
    return axios.get(wechat.wechatreplyclick, data)
  },
  // 事件回复-新增
  fetchWwechatreplyclickAdd (data) {
    return axios.post(wechat.wechatreplyclick, data)
  },
  // 事件回复-修改
  fetchWwechatreplyclickPut (data) {
    return axios.put(wechat.wechatreplyclick, data)
  },
  // 事件回复-删除
  fetchWwechatreplyclickDelete (data) {
    return axios.delete(wechat.wechatreplyclick, data)
  },
  // 小程序代码管理分页
  fetchWechatMiniprogramCodePage (data) {
    return axios.get(wechat.wechatMiniprogramCodePage, data)
  },
  // 小程序代码管理同步草稿箱
  fetchWechatMiniprogramCodeSynchDraft (data) {
    return axios.get(wechat.wechatMiniprogramCodeSynchDraft, data)
  },
  // 小程序代码管理同步模板库
  fetchWechatMiniprogramCodeSynchTemplate (data) {
    return axios.get(wechat.wechatMiniprogramCodeSynchTemplate, data)
  },
  // 小程序代码管理转换模板
  fetchWechatMiniprogramCodeTemplate (data) {
    return axios.put(wechat.wechatMiniprogramCodeTemplate, data)
  },
  // 小程序代码管理删除模板
  fetchWechatMiniprogramCodeTemplateDelete (data) {
    return axios.delete(wechat.wechatMiniprogramCodeTemplate, data)
  },
  // 小程序代码管理设置最新模板
  fetchWechatMiniprogramCodeTemplateStatus (data) {
    return axios.put(wechat.wechatMiniprogramCodeTemplateStatus, data)
  },
  // 粉丝列表分页
  fetchWechatfansPage (data) {
    if ('ids' in data) delete data.ids
    if ('tagids' in data) delete data.tagids
    return axios.get(wechat.wechatfansPage, data)
  },
  // 黑名单
  fetchWechatfansBlackList (data) {
    return axios.get(wechat.wechatfansBlack, data)
  },
  // 拉黑粉丝
  fetchWechatfansBlack (data) {
    return axios.post(wechat.wechatfansBlack, data)
  },
  // 粉丝详情
  fetchWechatfans (data) {
    return axios.get(wechat.wechatfans, data)
  },
  // 发送消息
  fetchWechatfansSend (data) {
    return axios.post(wechat.wechatfansSend, data)
  },
  // 同步粉丝
  fetchWechatfansSync (data) {
    return axios.get(wechat.wechatfansSync, data)
  },
  // 同步多个粉丝
  fetchWechatfansSyncFans (data) {
    return axios.post(wechat.wechatfansSyncFans, data)
  },
  // 取消拉黑
  fetchWechatfansCancelblack (data) {
    return axios.post(wechat.wechatfansCancelblack, data)
  },
  // 同步标签
  fetchWechattagsSyncTags (data) {
    return axios.get(wechat.wechattagsSyncTags, data)
  },
  // 标签新建
  fetchWechattagsAdd (data) {
    return axios.post(wechat.wechattags, data)
  },
  // 标签修改
  fetchWechattagsPut (data) {
    return axios.put(wechat.wechattags, data)
  },
  // 标签删除
  fetchWechattagsDelete (data) {
    return axios.delete(wechat.wechattags, data)
  },
  // 查标签是否存在
  fetchWechattagsCheck (data) {
    return axios.get(wechat.wechattagsCheck, data)
  },
  // 设置标签
  fetchWechattagsSet (data) {
    return axios.post(wechat.wechattagsSet, data)
  },
  // 本月群发-列表
  fetchWechatsendList (data) {
    return axios.get(wechat.wechatsendList, data)
  },
  // 本月群发-新增
  fetchWechatsendAdd (data) {
    return axios.post(wechat.wechatsend, data)
  },
  // 本月群发-修改
  fetchWechatsendPut (data) {
    return axios.put(wechat.wechatsend, data)
  },
  // 本月群发-删除
  fetchWechatsendDelete (data) {
    return axios.delete(wechat.wechatsend, data)
  },
  // 推送汇总
  fetchWechatsendCollect (data) {
    return axios.get(wechat.wechatsendCollect, data)
  },
  // 推送详情
  fetchWechatsendGet (data) {
    return axios.get(wechat.wechatsend + `/${data.id}`)
  },
  // 消息列表分页
  fetchWechatfanssendlogPage (data) {
    return axios.get(wechat.wechatfanssendlogPage, data)
  },
  // 群发文章列表
  fetchWechatcommentArticles (data) {
    return axios.get(wechat.wechatcommentArticles, data)
  },
  // 留言列表分页
  fetchWechatcommentPage (data) {
    return axios.get(wechat.wechatcommentPage, data)
  },
  // 粉丝统计用户增长
  fetchwechatStatistics (data) {
    return axios.get(wechat.wechatStatistics, data)
  },
  // 粉丝统计趋势图
  fetchwechatStatisticsMap (data) {
    return axios.post(wechat.wechatStatisticsMap, data)
  },
  // 粉丝统计用户属性性别
  fetchwechatStatisticsSex (data) {
    return axios.get(wechat.wechatStatisticsSex, data)
  },
  // 粉丝统计用户省份信息
  fetchwechatStatisticsProvince (data) {
    return axios.get(wechat.wechatStatisticsProvince, data)
  },
  // 粉丝统计用户省份下拉列表
  fetchwechatStatisticsProvinceList (data) {
    return axios.get(wechat.wechatStatisticsProvinceList, data)
  },
  // 粉丝统计用户城市信息
  fetchwechatStatisticsCity (data) {
    return axios.get(wechat.wechatStatisticsCity, data)
  },
  // 粉丝统计用户语言信息
  fetchwechatStatisticsLga (data) {
    return axios.get(wechat.wechatStatisticsLga, data)
  },
  // 粉丝统计下载表格
  fetchwechatStatisticsDownload (data, onUploadProgress) {
    return axios.download(wechat.wechatStatisticsDownload, data, onUploadProgress)
  },
  // 粉丝统计用户增长列表
  fetchwechatStatisticspage (data) {
    if ('time' in data) delete data.time
    return axios.get(wechat.wechatStatisticspage, data)
  },
  // 统计汇总用户增长
  fetchwechatStatisticsCollect (data) {
    return axios.get(wechat.wechatStatisticsCollect, data)
  },
  // 统计汇总趋势
  fetchwechatStatisticsMapCollect (data) {
    return axios.post(wechat.wechatStatisticsMapCollect, data)
  },
  // 统计汇总性别
  fetchwechatStatisticsSexCollect (data) {
    return axios.get(wechat.wechatStatisticsSexCollect, data)
  },
  // 统计汇总省份
  fetchwechatStatisticsProvinceCollect (data) {
    return axios.get(wechat.wechatStatisticsProvinceCollect, data)
  },
  // 统计汇总城市
  fetchwechatStatisticsCityCollect (data) {
    return axios.get(wechat.wechatStatisticsCityCollect, data)
  },
  // 统计汇总语言
  fetchwechatStatisticsLgaCollect (data) {
    return axios.get(wechat.wechatStatisticsLgaCollect, data)
  },
  // 粉丝汇总用户增长列表分页
  fetchWechatfansStatisticsPageSum (data) {
    if ('time' in data) delete data.time
    return axios.get(wechat.wechatfansStatisticsPageSum, data)
  },
  // 回复留言
  fetchWechatcommentReply (data) {
    return axios.post(wechat.wechatcommentReply, data)
  },
  // 回复留言
  fetchWechatcommentReplyDelete (data) {
    return axios.delete(wechat.wechatcommentReply, data)
  },
  // 同步粉丝黑名单
  fetchWechatfansSyncblack (data) {
    return axios.get(wechat.wechatfansSyncblack, data)
  },
  // 手动同步消息
  fetchWechatcommentHand (data) {
    return axios.get(wechat.wechatcommentHand, data)
  },
  // 留言设置开启
  fetchWechatcommentOn (data) {
    return axios.get(wechat.wechatcommentOn, data)
  },
  // 留言设置关闭
  fetchWechatcommentOff (data) {
    return axios.get(wechat.wechatcommentOff, data)
  },
  // 设置留言为精选
  fetchWechatcommentMarkelect (data) {
    return axios.get(wechat.wechatcommentMarkelect, data)
  },
  // 取消留言精选
  fetchWechatcommentUnmarkelect (data) {
    return axios.get(wechat.wechatcommentUnmarkelect, data)
  },
  // 删除留言
  fetchWechatcommentDelete (data) {
    return axios.delete(wechat.wechatcomment, data)
  },
  // 内容栏目树
  fetchContentCommonTree (data) {
    return axios.get(wechat.contentCommonTree, data)
  },
  // 立即群发
  fetchWechatsendSend (data) {
    return axios.post(wechat.wechatsendSend, data)
  }

}
