import axios from '../axios'
import configUrls from '../urls/config'

export default {
  // 站点管理列表
  fetchSiteseList (data) {
    return axios.get(configUrls.sitesList, data)
  },
  // 可管理站点列表
  fetchSitesOwnsite (data) {
    return axios.get(configUrls.sitesOwnsite, data)
  },
  // 模板管理列表数据
  fetchTemplateList (data) {
    return axios.get(configUrls.templateList, data)
  },
  // 模板管理文件树结构
  fetchTemplateTree (data) {
    return axios.get(configUrls.templateTree, data)
  },
  // 模板管理添加目录
  fetchTemplateDir (data) {
    return axios.post(configUrls.templateDir, data)
  },
  // 模板管理上传
  fetchTemplateUpload (data, onUploadProgress) {
    return axios.upload(configUrls.templateUpload, data, onUploadProgress)
  },
  // 模板管理添加
  fetchTemplateCreate (data) {
    return axios.post(configUrls.template, data)
  },
  // 模板管理修改
  fetchTemplateUpdate (data) {
    return axios.put(configUrls.template, data)
  },
  // 模板管理删除
  fetchTemplateDelete (data) {
    return axios.delete(configUrls.template, data)
  },
  // 模板管理获取模板信息
  fetchTemplateDetail (data) {
    return axios.get(configUrls.template, data)
  },
  // 模板管理导入
  fetchTemplateImport (data, onUploadProgress) {
    return axios.upload(configUrls.templateImport, data, onUploadProgress)
  },
  // 模板管理导出
  fetchTemplateExport (data, onUploadProgress) {
    return axios.download(configUrls.templateExport, data, onUploadProgress)
  },
  // 模板管理模型列表
  fetchTemplateModelList (data) {
    return axios.get(configUrls.templateModelList, data)
  },
  // 模板管理检验目录名称
  fetchTemplateUniqueDirName (data) {
    return axios.get(configUrls.templateUniqueDirName, data)
  },
  // 模板管理检验模板方案名称
  fetchTemplateUniqueName (data) {
    return axios.get(configUrls.templateUniqueName, data)
  },
  // 文件管理新建目录
  fetchResourceDir (data) {
    return axios.post(configUrls.resourceDir, data)
  },
  // 文件管理新增资源
  fetchResourceCreate (data) {
    return axios.post(configUrls.resource, data)
  },
  // 文件管理修改资源
  fetchResourcePut (data) {
    return axios.put(configUrls.resource, data)
  },
  // 文件管理删除资源
  fetchResourceDelete (data) {
    return axios.delete(configUrls.resource, data)
  },
  // 文件管理查询资源
  fetchResourceDetail (data) {
    return axios.get(configUrls.resource, data)
  },
  // 文件管理查询列表
  fetchResourceList (data) {
    return axios.get(configUrls.resourceList, data)
  },
  // 文件管理查询所有文件树
  fetchResourceTree (data) {
    return axios.get(configUrls.resourceTree, data)
  },
  // 文件管理文件上传
  fetchResourceUpload (data, onUploadProgress) {
    return axios.upload(configUrls.resourceUpload, data, onUploadProgress)
  },
  // 文件管理检验文件夹是否唯一
  fetchResourceUniqueDir (data) {
    return axios.get(configUrls.resourceUniqueDir, data)
  },
  // 站点管理修改站点扩展配置
  fetchSitesExt (data) {
    return axios.put(configUrls.sitesExt, data)
  },
  // 站点管理站点扩展配置详细
  fetchSitesExtDetail (data) {
    return axios.get(configUrls.sitesExt, data)
  },
  // 站点管理站点模板设置详情
  fetchSitesModelDetail (data) {
    return axios.get(configUrls.sitesModel, data)
  },
  // 站点管理模板方案列表
  fetchSitesSolutions (data) {
    return axios.get(configUrls.sitesSolutions, data)
  },
  // 站点管理首页模板列表
  fetchSitesTplList (data) {
    return axios.get(configUrls.sitesTplList, data)
  },
  // 站点管理站点修改模板设置
  fetchSitesModelUpdate (data) {
    return axios.put(configUrls.sitesModel, data)
  },
  // 站点管理站点基本信息详情
  fetchSitesDetail (data) {
    return axios.get(configUrls.sites + `/${data.id}`)
  },
  // 站点管理站点新增
  fetchSitesCreate (data) {
    return axios.post(configUrls.sites, data)
  },
  // 站点管理站点基本信息修改
  fetchSitesUpdate (data) {
    return axios.put(configUrls.sites, data)
  },
  // 站点管理站点删除至回收站
  fetchSitesDelete (data) {
    return axios.delete(configUrls.sites, data)
  },
  // 站点管理验证域名
  fetchSitesDomainUnique (data) {
    return axios.get(configUrls.sitesDomainUnique, data)
  },
  // 站点管理验证目录
  fetchSitesPathUnique (data) {
    return axios.get(configUrls.sitesPathUnique, data)
  },
  // 站点管理回收站
  fetchSitesRecycle (data) {
    return axios.get(configUrls.sitesRecycle, data)
  },
  // 站点管理回收站还原
  fetchSitesRestore (data) {
    return axios.post(configUrls.sitesRestore, data)
  },
  // 站点管理回收站物理删除
  fetchSitesRecycleDelete (data) {
    return axios.delete(configUrls.sitesRecycle, data)
  },
  // 站点管理站点模板列表
  fetchSitesModelsList (data) {
    return axios.get(configUrls.sitesModels, data)
  },
  // 站点管理上级站点联级选择器
  fetchSitesChilds (data) {
    return axios.get(configUrls.sitesChilds, data)
  },
  // 站点管理-静态化-栏目-进度
  fetchStaticChannelProgress (data) {
    return axios.get(configUrls.staticChannelProgress, data)
  },
  // 站点管理-静态化-内容-进度
  fetchStaticContentProgress (data) {
    return axios.get(configUrls.staticContentProgress, data)
  },
  // 发布静态页查询可静态化栏目树
  fetchSitesStaticChannelTree (data) {
    return axios.get(configUrls.staticChannelTree, data)
  },
  // 发布静态页查询可发布内容栏目树
  fetchSitesPublicContentChannelTree (data) {
    return axios.get(configUrls.publicContentChannelTree, data)
  },
  // 站点管理发布静态页发布首页
  fetchstaticPageIndex (data) {
    return axios.post(configUrls.staticPageIndex, data)
  },
  // 站点管理发布静态页取消首页
  fetchstaticPageIndexDelete (data) {
    return axios.delete(configUrls.staticPageIndex, data)
  },
  // 站点管理发布静态页发布栏目
  fetchstaticChannelBatch (data) {
    return axios.post(configUrls.sitesChannelBatch, data)
  },
  // 站点管理发布静态页取消发布栏目
  fetchstaticChannel (data) {
    return axios.delete(configUrls.sitesChannel, data)
  },
  // 站点管理发布静态页发布内容
  fetchsitesContentBatch (data) {
    return axios.post(configUrls.sitesContentBatch, data)
  },
  // 站点管理发布静态页取消发布内容
  fetchsitesContent (data) {
    return axios.delete(configUrls.sitesContent, data)
  },
  // 站点管理开启站点
  fetchsitesOn (data) {
    return axios.post(configUrls.sitesOn, data)
  },
  // 站点管理关闭站点
  fetchsitesOff (data) {
    return axios.post(configUrls.sitesOff, data)
  },
  // 站点管理排序
  fetchsitesSort (data) {
    return axios.put(configUrls.sitesSort, data)
  },
  // 站点管理权限-组织
  fetchSitesPermOrg (data) {
    return axios.get(configUrls.sitesPermOrg, data)
  },
  // 站点管理权限-组织
  fetchSitesPermOrgUpdate (data) {
    return axios.put(configUrls.sitesPermOrg, data)
  },
  // 站点管理权限-用户
  fetchSitesPermUser (data) {
    return axios.get(configUrls.sitesPermUser, data)
  },
  // 站点管理权限-用户
  fetchSitesPermUserUpdate (data) {
    return axios.put(configUrls.sitesPermUser, data)
  },
  // 站群管理权限-组织
  fetchSitesGroupPermOrg (data) {
    return axios.get(configUrls.sitesGroupPermOrg, data)
  },
  // 站群管理权限-组织
  fetchSitesGroupPermOrgUpdate (data) {
    return axios.put(configUrls.sitesGroupPermOrg, data)
  },
  // 站群管理权限-用户
  fetchSitesGroupPermUser (data) {
    return axios.get(configUrls.sitesGroupPermUser, data)
  },
  // 站群管理权限-用户
  fetchSitesGroupPermUserUpdate (data) {
    return axios.put(configUrls.sitesGroupPermUser, data)
  },
  // 消息模板-列表
  fetchMessageTplPage (data) {
    return axios.get(configUrls.messageTplPage, data)
  },
  // 消息模板-短信模板集合 短信模板集合
  fetchMessageTplPhoneListPage (data) {
    return axios.get(configUrls.messageTplPhoneListPage, data)
  },
  // 消息模板-同步子站点列表
  fetchMessaggetAllTree (data) {
    return axios.get(configUrls.messaggetAllTree, data)
  },
  // 消息模板-同步子站点保存
  fetchMessaggetSynchChild (data) {
    return axios.post(configUrls.messaggetSynchChild, data)
  },
  // 消息模板-同步子站点保存
  fetchMessaggetHaveNumber (data) {
    return axios.get(configUrls.messaggetHaveNumber, data)
  },
  // 消息模板-是否显示隐藏同步子站按钮
  fetchMessageSynchButData (data) {
    return axios.get(configUrls.messageSynchBut, data)
  },
  // 消息模板-修改单个
  fetchMessageDetailsStatus (data) {
    return axios.put(configUrls.messageDetailsStatus, data)
  },
  // 消息模板-详情
  fetchMessageTplGet (data) {
    return axios.get(configUrls.messageTpl + `/${data.id}`)
  },
  // 消息模板-修改
  fetchMessageTplPut (data) {
    return axios.put(configUrls.messageTpl, data)
  },
  // 消息模板-添加
  fetchMessageTplAdd (data) {
    return axios.post(configUrls.messageTpl, data)
  },
  // 消息模板-检验模板标识是否可用
  fetchMessageTplMesCodeUnique (data) {
    return axios.get(configUrls.messageTplMesCodeUnique, data)
  },
  // 敏感词-列表
  fetchSensitiveWordsPage (data) {
    return axios.get(configUrls.sensitiveWordsPage, data)
  },
  // 敏感词-添加
  fetchSensitiveWordsAdd (data) {
    return axios.post(configUrls.sensitiveWords, data)
  },
  // 敏感词-修改
  fetchSensitiveWordsPut (data) {
    return axios.put(configUrls.sensitiveWords, data)
  },
  // 敏感词-删除
  fetchSensitiveWordsDelete (data) {
    return axios.delete(configUrls.sensitiveWords, data)
  },
  // 敏感词-详情
  fetchSensitiveWordsGet (data) {
    return axios.delete(configUrls.sensitiveWords + `/${data.id}`)
  },
  // 敏感词-重名验证
  fetchSensitiveWordsUnique (data) {
    return axios.get(configUrls.sensitiveWordsUnique, data)
  },
  // 敏感词-导入
  fetchSensitiveWordsImport (data, onUploadProgress) {
    return axios.upload(configUrls.sensitiveWordsImport, data, onUploadProgress)
  },
  // 敏感词-导出
  fetchSensitiveWordsDownload (data) {
    return axios.download(configUrls.sensitiveWordsDownload, data)
  },
  // 搜索词-列表
  fetchSysSearchWordsPage (data) {
    return axios.get(configUrls.sysSearchWordsPage, data)
  },
  // 搜索词-新增
  fetchSysSearchWordsAdd (data) {
    return axios.post(configUrls.sysSearchWords, data)
  },
  // 搜索词-修改
  fetchSysSearchWordsPut (data) {
    return axios.put(configUrls.sysSearchWords, data)
  },
  // 搜索词-删除
  fetchSysSearchWordsDelete (data) {
    return axios.delete(configUrls.sysSearchWords, data)
  },
  // 搜索词-删除
  fetchSysSearchWordsUnique (data) {
    return axios.get(configUrls.sysSearchWordsUnique, data)
  },
  // 热词-分页
  fetchHotWordCategorysPage (data) {
    return axios.get(configUrls.hotWordCategorysPage, data)
  },
  // 热词-列表
  fetchHotWordCategorysList (data) {
    return axios.get(configUrls.hotWordCategorysList, data)
  },
  // 热词-详情
  fetchHotWordCategorysGet (data) {
    return axios.get(configUrls.hotWordCategorys + `/${data.id}`)
  },
  // 热词-新增
  fetchHotWordCategorysAdd (data) {
    return axios.post(configUrls.hotWordCategorys, data)
  },
  // 热词-修改
  fetchHotWordCategorysPut (data) {
    return axios.put(configUrls.hotWordCategorys, data)
  },
  // 热词-删除
  fetchHotWordCategorysDelete (data) {
    return axios.delete(configUrls.hotWordCategorys, data)
  },
  // 热词-重名
  fetchHotWordCategorysUnique (data) {
    return axios.get(configUrls.hotWordCategorysCateNameUnique, data)
  },
  // 热词管理-列表
  fetchHotWordsPage (data) {
    return axios.get(configUrls.hotWordsPage, data)
  },
  // 热词管理-重名
  fetchHotWordsUnique (data) {
    return axios.get(configUrls.hotWordsUnique, data)
  },
  // 热词管理-新增
  fetchHotWordsAdd (data) {
    return axios.post(configUrls.hotWords, data)
  },
  // 热词管理-修改
  fetchHotWordsPut (data) {
    return axios.put(configUrls.hotWords, data)
  },
  // 热词管理-删除
  fetchHotWordsDelete (data) {
    return axios.delete(configUrls.hotWords, data)
  },
  // 定时任务-列表数据
  fetchjobsList (data) {
    return axios.get(configUrls.jobsPage, data)
  },
  // 定时任务-新增任务
  fetchjobsAdd (data) {
    return axios.post(configUrls.jobs, data)
  },
  // 定时任务-修改任务
  fetchjobsPut (data) {
    return axios.put(configUrls.jobs, data)
  },
  // 定时任务-任务详情
  fetchjobsDetail (data) {
    return axios.get(configUrls.jobs + `/${data.id}`)
  },
  // 定时任务-任务删除
  fetchjobsDelete (data) {
    return axios.delete(configUrls.jobs, data)
  },
  // 定时任务-状态取消
  fetchjobsDisabledJobs (data) {
    return axios.post(configUrls.jobsDisabledJobs, data)
  },
  // 定时任务-状态启用
  fetchjobsEnabledJobs (data) {
    return axios.post(configUrls.jobsEnabledJobs, data)
  },
  // 定时任务-状态启用
  fetchjobsUnique (data) {
    return axios.get(configUrls.jobsUnique, data)
  },
  // 内容类型-列表
  fetchContentTypePage (data) {
    return axios.get(configUrls.contentTypePage, data)
  },
  // 内容类型-新增
  fetchContentTypeAdd (data) {
    return axios.post(configUrls.contentType, data)
  },
  // 内容类型-修改
  fetchContentTypePut (data) {
    return axios.put(configUrls.contentType, data)
  },
  // 内容类型-删除
  fetchContentTypeDelete (data) {
    return axios.delete(configUrls.contentType, data)
  },
  // 内容类型-重名
  fetchContentTypeUnique (data) {
    return axios.get(configUrls.contentTypeUnique, data)
  },
  // 内容索引-重置
  fetchContentResetIndex (data) {
    return axios.put(configUrls.contentResetIndex, data)
  },
  // 内容索引-索引开关
  fetchChannelSetOpenIndex (data) {
    return axios.put(configUrls.channelSetOpenIndex, data)
  },
  // 发文字号-机关代字-列表
  fetchContentMarksAgencyPage (data) {
    return axios.get(configUrls.contentMarksAgencyPage, data)
  },
  // 发文字号-机关代字-新增
  fetchContentMarksAgencyAdd (data) {
    return axios.post(configUrls.contentMarksAgency, data)
  },
  // 发文字号-机关代字-修改
  fetchContentMarksAgencyPut (data) {
    return axios.put(configUrls.contentMarksAgency, data)
  },
  // 发文字号-机关代字-删除
  fetchContentMarksAgencyDelete (data) {
    return axios.delete(configUrls.contentMarksAgency, data)
  },
  // 发文字号-机关代字-排序
  fetchContentMarksAgencySort (data) {
    return axios.put(configUrls.contentMarksAgencySort, data)
  },
  // 发文字号-年号-列表
  fetchContentMarksYearPage (data) {
    return axios.get(configUrls.contentMarksYearPage, data)
  },
  // 发文字号-年号-新增
  fetchContentMarksYearAdd (data) {
    return axios.post(configUrls.contentMarksYear, data)
  },
  // 发文字号-年号-修改
  fetchContentMarksYearPut (data) {
    return axios.put(configUrls.contentMarksYear, data)
  },
  // 发文字号-年号-删除
  fetchContentMarksYearDelete (data) {
    return axios.delete(configUrls.contentMarksYear, data)
  },
  // 发文字号-年号-排序
  fetchContentMarksYearSort (data) {
    return axios.put(configUrls.contentMarksYearSort, data)
  },
  // tag-列表
  fetchContentTagsPage (data) {
    return axios.get(configUrls.contentTagsPage, data)
  },
  // tag-新增
  fetchContentTagsAdd (data) {
    return axios.post(configUrls.contentTags, data)
  },
  // tag-修改
  fetchContentTagsPut (data) {
    return axios.put(configUrls.contentTags, data)
  },
  // tag-删除
  fetchContentTagsDelete (data) {
    return axios.delete(configUrls.contentTags, data)
  },
  // tag-重名
  fetchContentTagsUnique (data) {
    return axios.get(configUrls.contentTagsUnique, data)
  },
  // 来源管理-列表
  fetchSysSourcePage (data) {
    return axios.get(configUrls.sysSourcePage, data)
  },
  // 来源管理-新增
  fetchSysSourceAdd (data) {
    return axios.post(configUrls.sysSource, data)
  },
  // 来源管理-修改
  fetchSysSourcePut (data) {
    return axios.put(configUrls.sysSource, data)
  },
  // 来源管理-删除
  fetchSysSourceDelete (data) {
    return axios.delete(configUrls.sysSource, data)
  },
  // 来源管理-重名
  fetchSysSourceUnique (data) {
    return axios.get(configUrls.sysSourceUnique, data)
  },
  // 站点树
  fetchSitesGetOwnerTree (data) {
    return axios.get(configUrls.sitesGetOwnerTree, data)
  },
  // 工作流分页
  fetchFlowList (data) {
    return axios.get(configUrls.flowPage, data)
  },
  // 工作流下拉列表
  fetchFlowOptions (data) {
    return axios.get(configUrls.flowList, data)
  },
  // 工作流详情
  fetchFlowDetail (id) {
    return axios.get(configUrls.flow + `/${id}`)
  },
  // 工作流创建
  fetchFlowCreate (data) {
    return axios.post(configUrls.flow, data)
  },
  // 工作流修改
  fetchFlowUpdate (data) {
    return axios.put(configUrls.flow, data)
  },
  // 工作流删除
  fetchFlowDelete (data) {
    return axios.delete(configUrls.flow, data)
  },
  // 工作流检查
  fetchFlowCheck (data) {
    return axios.post(configUrls.flowCheck, data)
  },
  // 工作流查重
  fetchFlowUnique (data) {
    return axios.get(configUrls.flowUnique, data)
  },
  // 机关代字重名
  fetchContentMarksAgencyUnique (data) {
    return axios.get(configUrls.contentMarksAgencyUnique, data)
  },
  // 年号重名
  fetchContentMarksYearUnique (data) {
    return axios.get(configUrls.contentMarksYearUnique, data)
  },
  // 审核策略管理-分页列表
  fetchAuditStrategyPage (data) {
    return axios.get(configUrls.auditStrategyPage, data)
  },
  // 审核策略管理-校验名称是否可用
  fetchAuditStrategyUnique (data) {
    return axios.get(configUrls.auditStrategyUnique, data)
  },
  // 审核策略管理-修改审核策略名称
  fetchAuditStrategyName (data) {
    return axios.put(configUrls.auditStrategyName, data)
  },
  // 审核策略管理-修改文本审核场景
  fetchAuditStrategySceneText (data) {
    return axios.put(configUrls.auditStrategySceneText, data)
  },
  // 审核策略管理-修改文本审核场景
  fetchAuditStrategyScenePicture (data) {
    return axios.put(configUrls.auditStrategyScenePicture, data)
  },
  // 审核策略管理-开启
  fetchAuditStrategyOpen (data) {
    return axios.get(configUrls.auditStrategyOpen, data)
  },
  // 审核策略管理-关闭
  fetchAuditStrategyClose (data) {
    return axios.get(configUrls.auditStrategyClose, data)
  },
  // 审核策略管理-删除
  fetchAuditStrategy (data) {
    return axios.delete(configUrls.auditStrategy, data)
  },
  // 审核策略管理-创建
  fetchAddAuditStrategy (data) {
    return axios.post(configUrls.auditStrategy, data)
  },
  // 审核栏目设置-审核栏目设置
  fetchAuditchannelsetList (data) {
    return axios.get(configUrls.auditchannelsetList, data)
  },
  // 审核栏目设置-强制通过
  fetchAuditchannelsetPass (data) {
    return axios.post(configUrls.auditchannelsetPass, data)
  },
  // 审核栏目设置-强制不通过
  fetchAuditchannelsetNopass (data) {
    return axios.post(configUrls.auditchannelsetNopass, data)
  },
  // 审核栏目设置-开启状态
  fetchAuditchannelsetOn (data) {
    return axios.post(configUrls.auditchannelsetOn, data)
  },
  // 审核栏目设置-开启状态
  fetchAuditchannelsetOff (data) {
    return axios.post(configUrls.auditchannelsetOff, data)
  },
  // 审核栏目设置-删除栏目设置
  fetchAuditchannelset (data) {
    return axios.delete(configUrls.auditchannelset, data)
  },
  // 审核栏目设置-选择栏目详情
  fetchSelectAuditchannelset (data) {
    return axios.get(configUrls.auditchannelset, data)
  },
  // 审核栏目设置-保存选择栏目
  fetchSaveAuditchannelset (data) {
    return axios.post(configUrls.auditchannelset, data)
  },
  // 审核模型设置-内容模型设置列表
  fetchAuditmodelsetList (data) {
    return axios.get(configUrls.auditmodelsetList, data)
  },
  // 审核模型设置-内容模型设置列表
  fetchAuditmodelsetModels (data) {
    return axios.get(configUrls.auditmodelsetModels, data)
  },
  // 审核模型设置-删除模型设置
  fetchAuditmodelset (data) {
    return axios.delete(configUrls.auditmodelset, data)
  },
  // 审核模型设置-模型设置获取详情
  fetchGetAuditmodelset (data) {
    return axios.get(configUrls.auditmodelset + `/${data.id}`)
  },
  // 审核模型设置-选择内容模型ID查询字段
  fetchAuditmodelsetItems (data) {
    return axios.get(configUrls.auditmodelsetItems, data)
  },
  // 审核模型设置-添加/修改模型设置
  fetchAddEditAuditmodelset (data) {
    return axios.post(configUrls.auditmodelset, data)
  }
}
