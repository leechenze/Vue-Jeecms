import axios from '../axios'
import interactUrls from '../urls/interact.js'

export default {
  // 评论管理列表
  fetchInteractUsercommentList (data) {
    if ('replyTimes' in data) delete data.replyTimes
    if ('criticalTimes' in data) delete data.criticalTimes
    return axios.get(interactUrls.interactUsercommentList, data)
  },
  // 评论管理修改审核状态
  fetchInteractUsercommentStatus (data) {
    return axios.put(interactUrls.interactUsercommentStatus, data)
  },
  // 评论管理回复信息编辑
  fetchInteractUsercommentReply (data) {
    return axios.put(interactUrls.interactUsercommentReply, data)
  },
  // 评论管理删除评论
  fetchInteractUsercommentDelete (data) {
    return axios.delete(interactUrls.interactUsercomment, data)
  },
  // 评论管理新增禁止
  fetchInteractUsercommentPlusStop (data) {
    return axios.put(interactUrls.interactUsercommentPlusStop, data)
  },
  // 评论管理取消禁止
  fetchInteractUsercommentCancelStop (data) {
    return axios.put(interactUrls.interactUsercommentCancelStop, data)
  },
  // 评论管理推荐编辑
  fetchInteractUsercommentTop (data) {
    return axios.put(interactUrls.interactUsercommentTop, data)
  },
  // 评论管理查询列表数量
  fetchInteractUsercommentCount (data) {
    return axios.get(interactUrls.interactUsercommentCount, data)
  },
  // 特定条件分页列表
  fetchInteractUsercommentSpecific (data) {
    if ('criticalTimes' in data) delete data.criticalTimes
    if ('replyTimes' in data) delete data.replyTimes
    return axios.get(interactUrls.interactUsercommentSpecific, data)
  },
  // 黑名单列表
  fetchSysblacklistPage (data) {
    return axios.get(interactUrls.sysblacklistPage, data)
  },
  // 删除单个黑名单
  fetchSysblacklistDelete (data) {
    return axios.delete(interactUrls.sysblacklist, data)
  },

  // 以下是采集 ////////////////////////////////////////////////////
  // 获取APPID和栏目数据
  fetchCollectGetId () {
    return axios.get(interactUrls.collectGetId)
  },
  // 手动移库
  fetchCollectConsumeByIds (data) {
    return axios.post(interactUrls.collectConsumeByIds + `?appId=${data.appId}&identity=${data.identity}`, { 'ids': data.ids, 'taskId': data.taskId })
  },
  // 数据迁移
  fetchCollectConsume (data) {
    return axios.get(interactUrls.collectConsume + `?taskId=${data.taskId}&appId=${data.appId}&identity=${data.identity}`)
  },
  // 以上是采集 ////////////////////////////////////////////////////////////

  // 举报列表
  fetchUsercommentReportList (data) {
    const params = {
      page: data.page,
      size: data.size
    }
    return axios.get(interactUrls.usercommentReportPage, params)
  },
  // 清除举报状态
  fetchUsercommentReportDelete (data) {
    return axios.delete(interactUrls.usercommentReport, data)
  },

  // 友情链接 ///////////////////////////////////////////

  // 链接类别列表
  fetchLinkTypesPage (data) {
    return axios.get(interactUrls.linkTypesPage, data)
  },
  // 链接类别详情
  fetchLinkTypesDetail (data) {
    return axios.get(interactUrls.linkTypes + `/${data.id}`)
  },
  // 链接类别添加
  fetchLinkTypesAdd (data) {
    return axios.post(interactUrls.linkTypes, data)
  },
  // 链接类别修改
  fetchLinkTypesChange (data) {
    return axios.put(interactUrls.linkTypes, data)
  },
  // 链接类别删除
  fetchLinkTypesDelete (data) {
    return axios.delete(interactUrls.linkTypes, data)
  },
  // 检验类别名称是否唯一
  fetchlinkTypesTypeNameUnique (data) {
    return axios.get(interactUrls.linkTypesTypeName, data)
  },
  // 友情链接列表
  fetchlinkTsPage (data) {
    return axios.get(interactUrls.linkTsPage, data)
  },
  // 友情链接添加
  fetchlinksAdd (data) {
    return axios.post(interactUrls.links, data)
  },
  // 友情链接修改
  fetchlinksChange (data) {
    return axios.put(interactUrls.links, data)
  },
  // 友情链接详情
  fetchlinksDetail (data) {
    return axios.get(interactUrls.links + `/${data.id}`)
  },
  // 友情链接删除
  fetchlinksDelete (data) {
    return axios.delete(interactUrls.links, data)
  },
  // 友情链接启用
  fetchlinksEnable (data) {
    return axios.put(interactUrls.linksEnable, data)
  },
  // 友情链接取消启用
  fetchlinksunEnable (data) {
    return axios.put(interactUrls.linksunEnable, data)
  },
  // 友情链接类别选择列表
  fetchlinkTypesList (data) {
    return axios.get(interactUrls.linkTypesList, data)
  },
  // 友情链接类别选择列表
  fetchlinksMove (data) {
    return axios.put(interactUrls.linksMove, data)
  },
  // 友情链接拖动
  fetchlinksSort (data) {
    return axios.put(interactUrls.linksSort, data)
  },
  // 友情链接类别拖动
  fetchlinksTypesSort (data) {
    return axios.put(interactUrls.linksTypesSort, data)
  },
  // 投票调查-分页列表
  fetchQuestionnairePage (data) {
    return axios.get(interactUrls.questionnairePage, data)
  },
  // 投票调查-增加
  fetchQuestionnaireAdd (data) {
    return axios.post(interactUrls.questionnaire, data)
  },
  // 投票调查-提交审核
  fetchquestionnaireSubmit (data) {
    return axios.put(interactUrls.questionnaireSubmit, data)
  },
  // 投票调查-审核通过
  fetchQuestionnaireReviewOk (data) {
    return axios.put(interactUrls.questionnaireReviewOk, data)
  },
  // 投票调查-审核不通过
  fetchQuestionnaireReviewFail (data) {
    return axios.put(interactUrls.questionnaireReviewFail, data)
  },
  // 投票调查-删除
  fetchQuestionnaireDelete (data) {
    return axios.delete(interactUrls.questionnaire, data)
  },
  // 投票调查-发布
  fetchQuestionnaireRelease (data) {
    return axios.put(interactUrls.questionnaireRelease, data)
  },
  // 投票调查-暂停
  fetchQuestionnairePause (data) {
    return axios.put(interactUrls.questionnairePause, data)
  },
  // 投票调查-预览
  fetchQuestionnairePreview (data) {
    return axios.get(interactUrls.questionnairePreview + `/${data.id}`)
  },
  // 投票调查-撤回
  fetchQuestionnaireWithdraw (data) {
    return axios.get(interactUrls.questionnaireWithdraw, data)
  },
  // 投票调查-复制
  fetchQuestionnaireCopy (data) {
    return axios.post(interactUrls.questionnaireCopy, data)
  },
  // 投票调查-详情
  fetchQuestionnaireDetail (data) {
    return axios.get(interactUrls.questionnaire + `/${data.id}?type=${data.type}`)
  },
  // 投票调查-问卷链接
  fetchQuestionnaireLink (data) {
    return axios.get(interactUrls.questionnaireLink + `/${data.id}`)
  },
  // 投票调查-修改设置
  fetchQuestionnaireSetting (data) {
    return axios.put(interactUrls.questionnaire, data)
  },
  // 投票调查-下载二维码
  fetchQuestionnaireQrcode (data) {
    return axios.download(interactUrls.questionnaireQrcode, data)
  },
  // 投票调查-待办列表
  fetchTaskQuestionnaireToDeal (data) {
    return axios.get(interactUrls.taskQuestionnaireToDeal, data)
  },
  // 投票调查-审核
  fetchTaskQuestionnaireAudit (data) {
    return axios.get(interactUrls.taskQuestionnaireAudit, data)
  },
  // 投票调查-已办列表
  fetchTaskQuestionnaireHandle (data) {
    return axios.get(interactUrls.taskQuestionnaireHandle, data)
  },
  // 投票调查-逾期未办
  fetchTaskQuestionnaireOverDue (data) {
    return axios.get(interactUrls.taskQuestionnaireOverDue, data)
  },
  // 投票调查-撤回(有工作流)
  fetchTaskQuestionnaireRevoke (data) {
    return axios.get(interactUrls.taskQuestionnaireRevoke, data)
  },
  // 投票调查-判断是否配置工作流
  fetchQuestionnaireWorkflow (data) {
    return axios.get(interactUrls.questionnaireWorkflow, data)
  },
  // 投票调查-统计-按用户
  fetchQuestionnaireAnswerPage (data) {
    return axios.get(interactUrls.questionnaireAnswerPage, data)
  },
  // 投票调查-统计-按用户-删除
  fetchQuestionnaireAnswerDelete (data) {
    return axios.delete(interactUrls.questionnaireAnswer, data)
  },
  // 投票调查-统计-按用户-查看
  fetchQuestionnaireAnswerView (data) {
    return axios.get(interactUrls.questionnaireAnswer + `/${data.id}`)
  },
  // 投票调查-统计-按用户-有效
  fetchQuestionnaireAnswerValid (data) {
    return axios.put(interactUrls.questionnaireAnswerValid, data)
  },
  // 投票调查-统计-按用户-无效
  fetchQuestionnaireAnswerInvalid (data) {
    return axios.put(interactUrls.questionnaireAnswerInvalid, data)
  },
  // 投票调查-统计-按用户-导出
  fetchQuestionnaireAnswerExport (data) {
    return axios.download(interactUrls.questionnaireAnswerExport, data)
  },
  // 投票调查-统计-按题目-导出
  fetchQuestionnaireAnswerSubjectExport (data) {
    return axios.download(interactUrls.questionnaireAnswerSubjectExport, data)
  },
  // 投票调查-统计-问卷统计
  fetchQuestionnaireFind (data) {
    return axios.get(interactUrls.questionnaireFind, data)
  },
  // 投票调查-统计-按题目分页列表
  fetchQuestionnaireAnswerSubjectPage (data) {
    return axios.get(interactUrls.questionnaireAnswerSubjectPage, data)
  },
  // 投票调查-统计-题目分类-饼图
  fetchQuestionnaireFindSubjectPieChart (data) {
    return axios.get(interactUrls.questionnaireFindSubjectPieChart, data)
  },
  // 投票调查-统计-按题目列表（左侧）
  fetchQuestionnaireAnswerSubjectList (data) {
    return axios.get(interactUrls.questionnaireAnswerSubjectList, data)
  },
  // 投票调查-统计-设备分析-饼图
  fetchQuestionnaireAnswerChartDevice (data) {
    return axios.get(interactUrls.questionnaireAnswerChartDevice, data)
  },
  // 投票调查-统计-来源分析-地图
  fetchQuestionnaireAnswerChartMap (data) {
    return axios.get(interactUrls.questionnaireAnswerChartMap, data)
  },
  // 投票调查-统计-趋势分析-折线图
  fetchQuestionnaireAnswerChartTrend (data) {
    return axios.get(interactUrls.questionnaireAnswerChartTrend, data)
  },
  // 投票调查-图片
  fetchQuestionnairePic (data) {
    return axios.get(interactUrls.questionnairePic, data)
  },
  // 智能表单
  // 智能表单-类型列表
  fetchsmartFormTypeList (data) {
    return axios.get(interactUrls.smartFormTypeList, data)
  },
  // 智能表单-添加类型
  fetchsmartFormTypeAdd (data) {
    return axios.post(interactUrls.smartFormType, data)
  },
  // 智能表单-检测分组名称是否可用
  fetchsmartFormTypeUnique (data) {
    return axios.get(interactUrls.smartFormTypeUnique, data)
  },
  // 智能表单-修改类型
  fetchsmartFormTypeAlter (data) {
    return axios.put(interactUrls.smartFormType, data)
  },
  // 智能表单-删除类型
  fetchsmartFormTypeDelete (data) {
    return axios.delete(interactUrls.smartFormType, data)
  },
  // 智能表单-表单列表
  fetchsmartFormPage (data) {
    return axios.get(interactUrls.smartSmartFormGetPage, data)
  },
  // 智能表单-图片
  fetchSmartPic (data) {
    return axios.get(interactUrls.smartionnairePic, data)
  },
  // 智能表单-统计-列表
  fetchSmartFormDataList (data) {
    return axios.get(interactUrls.smartFormDataList, data)
  },
  // 智能表单-统计-列表删除
  fetchSmartFormListDelete (data) {
    return axios.delete(interactUrls.smartFormDataDetail, data)
  },
  // 智能表单-统计-图表
  fetchSmartFormGraph (data) {
    return axios.get(`${interactUrls.smartFormGraph}${data.id}`)
  },
  // 智能表单-统计-标记已读未读
  fetchSmartFormReadSet (data) {
    return axios.put(`${interactUrls.smartFormDataDetail}`, data)
  },
  // 智能表单-统计-导出
  fetchSmartFormDataExport (data) {
    return axios.download(`${interactUrls.smartFormDataExport}`, data)
  },
  // 智能表单-统计-导出全部
  fetchSmartFormDataAllExport (data) {
    return axios.get(`${interactUrls.smartFormDataExport}`, data)
  },
  // 智能表单-表单详情
  fetchSmartFormDetail (data) {
    return axios.get(`${interactUrls.smartFormDetail}/${data.id}`)
  },
  // 智能表单-表单重名验证
  fetchSmartFormUnique (data) {
    return axios.get(interactUrls.smartFormUnique, data)
  },
  // 智能表单-表单保存
  fetchSmartFormAdd (data) {
    return axios.post(interactUrls.smartForm, data)
  },
  // 智能表单-表单设置保存
  fetchSmartFormPut (data) {
    return axios.put(interactUrls.smartForm, data)
  },
  // 智能表单-表单分组保存
  fetchSmartGroupingPut (data) {
    return axios.put(interactUrls.simpleUpdate, data)
  },
  // 智能表单-表单删除
  fetchSmartFormDelete (data) {
    return axios.delete(interactUrls.smartForm, data)
  },
  // 智能表单-字段编辑
  fetchSmartFormUpdateFieldsPut (data) {
    return axios.post(interactUrls.smartFormUpdateFields, data)
  },
  // 智能表单-表单发布
  fetchSmartFormPublishPut (data) {
    return axios.put(interactUrls.smartFormPublish, data)
  },
  // 智能表单-表单复制
  fetchSmartFormCopy (data) {
    return axios.post(interactUrls.smartFormCopy, data)
  },
  // 智能表单-清空表单数据
  fetchSmartFormClearData (data) {
    /* system-cms-prefix start */
    return axios.post(interactUrls.smartFormClearData + '/delete/' + data)
    /* system-cms-prefix change
    return axios.post(interactUrls.smartFormClearData + '/' + data)
    system-cms-prefix change */
    /* system-cms-prefix end */
  },
  // 智能表单-统计分析详情
  fetchSmartFormData (data) {
    return axios.get(`${interactUrls.smartFormDataDetail}/${data.id}`)
  },
  // 智能表单-统计-设备统计
  fetchSmartFormStatisticDevice (data) {
    return axios.get(`${interactUrls.smartFormStatisticDevice}/${data.id}`)
  },
  // 智能表单-统计-地区统计
  fetchSmartFormStatisticProvince (data) {
    return axios.get(`${interactUrls.smartFormStatisticProvince}/${data.id}`)
  },
  // 智能表单-统计-趋势统计
  fetchSmartFormStatisticTrend (data) {
    return axios.get(`${interactUrls.smartFormStatisticTrend}/${data.id}`, data)
  }
}
