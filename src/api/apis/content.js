import axios from '../axios'
import contentUrls from '../urls/content'

export default {
  // 内容搜索列表
  fetchContentextPage (data) {
    return axios.post(contentUrls.contentextPage, data)
  },
  // 排序列表
  fetchContentextOrder (data) {
    return axios.get(contentUrls.contentextOrder, data)
  },
  // 内容状态
  fetchContentextStatus (data) {
    return axios.post(contentUrls.contentextStatus, data)
  },

  // 回收站列表
  fetchContentextRecycle (data) {
    if ('times' in data) delete data.times
    return axios.get(contentUrls.contentextRecycle, data)
  },
  // 归档列表
  fetchContentextPigeonhole (data) {
    return axios.post(contentUrls.contentextPigeonhole, data)
  },
  // 出档
  fetchContentextFile (data) {
    return axios.post(contentUrls.contentextFile, data)
  },
  // 查询模板列表
  fetchContentTemplateList (data) {
    return axios.get(contentUrls.contentTemplateList, data)
  },
  // 内容/附件密级列表
  fetchContentSecretList (data) {
    return axios.get(contentUrls.contentSecretList, data)
  },
  // 来源列表
  fetchContentSourceList (data) {
    return axios.get(contentUrls.contentSourceList, data)
  },
  // 发文字号列表
  fetchContentMarkList (data) {
    return axios.get(contentUrls.contentMarkList, data)
  },
  // 可新建内容栏目列表
  fetchContentChannelList (data) {
    return axios.get(contentUrls.contentChannelList, data)
  },
  // 内容模型-所有
  fetchContentModelList (data) {
    return axios.get(contentUrls.contentModelList, data)
  },
  // 删除内容（逻辑删除）
  fetchContentextDelete (data) {
    return axios.delete(contentUrls.contentext, data)
  },
  // 还原内容
  fetchContentextRest (data) {
    return axios.put(contentUrls.contentext, data)
  },
  // 删除内容（加入回收站）
  fetchContentextRubbish (data) {
    return axios.post(contentUrls.contentextRubbish, data)
  },
  // 置顶
  fetchContentextTop (data) {
    return axios.post(contentUrls.contentextTop, data)
  },
  // 取消置顶
  fetchContentextNotop (data) {
    return axios.post(contentUrls.contentextNotop, data)
  },
  // 移动
  fetchContentextMove (data) {
    return axios.post(contentUrls.contentextMove, data)
  },
  // 复制
  fetchContentextDuplication (data) {
    return axios.post(contentUrls.contentDuplication, data)
  },
  // 引用
  fetchContentextQuote (data) {
    return axios.post(contentUrls.contentextQuote, data)
  },
  // 取消引用
  fetchContentextNoquote (data) {
    return axios.post(contentUrls.contentextNoquote, data)
  },
  // 排序
  fetchContentextSort (data) {
    return axios.post(contentUrls.contentextSort, data)
  },
  // 内容类型操作
  fetchContentextOperation (data) {
    return axios.post(contentUrls.contentextOperation, data)
  },
  // 新增时获取字段
  fetchContentPlus (modelId) {
    return axios.get(contentUrls.contentPlus + `/${modelId}`)
  },
  // 新增
  fetchContentCreate (data) {
    return axios.post(contentUrls.content, data)
  },
  // 详情
  fetchContentDetail (id) {
    return axios.get(contentUrls.content + `/${id}`)
  },
  // 修改
  fetchContentUpdate (data) {
    return axios.put(contentUrls.content, data)
  },
  // 版本-分页
  fetchContentVersionPage (data) {
    return axios.get(contentUrls.contentVersionPage, data)
  },
  // 版本-新增
  fetchContentVersionAdd (data) {
    return axios.post(contentUrls.contentVersion, data)
  },
  // 版本-修改
  fetchContentVersionPut (data) {
    return axios.put(contentUrls.contentVersion, data)
  },
  // 版本-删除
  fetchContentVersionDelete (data) {
    return axios.delete(contentUrls.contentVersion, data)
  },
  // 版本-查询
  fetchContentVersionGet (data) {
    return axios.get(contentUrls.contentVersion + `/${data.id}`)
  },
  // 版本-对比
  fetchContentVersionCompare (data) {
    return axios.post(contentUrls.contentVersionCompare, data)
  },
  // 版本-回复
  fetchContentVersionRecovery (data) {
    return axios.put(contentUrls.contentVersionRecovery, data)
  },
  // 操作记录
  fetchContentrecordPage (data) {
    if ('times' in data) delete data.times
    return axios.get(contentUrls.contentrecordPage, data)
  },
  // 回收站栏目id合集
  fetchChannelRecycleIds (data) {
    return axios.get(contentUrls.channelRecycleIds, data)
  },
  // 推送到站群
  fetchContentPushSites (data) {
    return axios.put(contentUrls.contentPushSites, data)
  },
  // 相关内容-列表
  fetchContentrelationPage (data) {
    return axios.get(contentUrls.contentrelationPage, data)
  },
  // 相关内容-关联
  fetchContentrelationRelation (data) {
    return axios.post(contentUrls.contentrelation, data)
  },
  // 相关内容-删除
  fetchContentrelationDelete (data) {
    return axios.delete(contentUrls.contentrelation, data)
  },
  // 相关内容-排序
  fetchContentrelationSort (data) {
    return axios.put(contentUrls.contentrelationSort, data)
  },
  // 推送-微博预览
  fetchWeiboarticlepushPreview (data) {
    return axios.post(contentUrls.weiboarticlepushPreview, data)
  },
  // 查看流程图信息
  fetchTaskProcessDiagram (data) {
    return axios.get(contentUrls.taskProcessDiagram, data)
  },
  // 查看内容审核记录
  fetchTaskActions (data) {
    return axios.get(contentUrls.taskActions, data)
  },
  // 栏目是否工作流
  fetchChannelWorkflowBeing (data) {
    return axios.get(contentUrls.channelWorkflowBeing + `/${data.id}`)
  },
  // 校验内容标题是否可以使用
  fetchContentTitleUnique (data) {
    return axios.get(contentUrls.contentTitleUnique, data)
  },
  // 撤回审核
  fetchContentTaskRevoke (data) {
    return axios.get(contentUrls.taskRevoke, data)
  },
  // 内容提交审核
  fetchContentSubmit (data) {
    return axios.post(contentUrls.contentSubmit, data)
  },
  fetchChannelDefaults (id) {
    return axios.get(contentUrls.channelDefaults + `/${id}`)
  },
  // 清空回收站
  fetchContentextClearAll (data) {
    return axios.get(contentUrls.contentextClearAll, data)
  },
  // 用户使用模型记录
  fetchContentModelRecord (data) {
    return axios.get(contentUrls.contentModelRecord, data)
  },
  // 内容智能审核 搜索列表
  fetchContentextChackPage (data) {
    return axios.get(contentUrls.contentextChackPage, data)
  },
  // 内容智能审核 审核内容数量
  fetchContentextChackAmout (data) {
    return axios.get(contentUrls.contentextChackAmount, data)
  },
  // 内容智能审核 是否显示强制发布按钮
  fetchContentForceButton (data) {
    return axios.get(contentUrls.contentForceButton, data)
  },
  // 处理文档（文库文档转换）
  fetchContentConversionDoc (data) {
    return axios.get(contentUrls.contentConversionDoc, data)
  },
  // 获取按钮树形
  fetchContentButton (data) {
    return axios.get(contentUrls.contentButton, data)
  },
  // 内容浏览记录
  fetchContentRecord (data) {
    return axios.get(contentUrls.contentRecord, data)
  },
  // 内容浏览记录
  fetchContentTable (data) {
    return axios.get(contentUrls.contentTable, data)
  },
  // 内容模型-内容状态(全部)
  fetchContentListData (data) {
    return axios.get(contentUrls.contentListData, data)
  }
}
