import axios from '../axios'
import columnUrls from '../urls/column'

export default {
  // 栏目树（忽略权限）
  fetchChannelGetAllTree (data) {
    return axios.get(columnUrls.channelGetAllTree, data)
  },
  // 栏目树-回收站
  fetchChannelRecycleTree (data) {
    return axios.get(columnUrls.channelRecycleTree, data)
  },
  // 查询栏目模型
  fetchChannelModelList (data) {
    return axios.get(columnUrls.channelModelList, data)
  },
  // 模型默认字段
  // 栏目列表
  fetchChannelList (data) {
    return axios.get(columnUrls.channelList, data)
  },
  // 模板
  // 校验栏目名称或路径
  fetchChannelUnique (data) {
    return axios.get(columnUrls.channelUnique, data)
  },
  // 新增
  fetchChannelCreate (data) {
    return axios.post(columnUrls.channel, data)
  },
  // 新增-顶层
  fetchChannelCreateTop (data) {
    return axios.post(columnUrls.channelTop, data)
  },
  // 修改主体-顶层
  fetchChannelUpdateTop (data) {
    return axios.put(columnUrls.channelTop, data)
  },
  // 删除
  fetchChannelDelete (data) {
    return axios.delete(columnUrls.channel, data)
  },
  // 彻底删除
  fetchChannelThorough (data) {
    return axios.delete(columnUrls.channelThorough, data)
  },
  // 还原
  fetchChannelReduction (data) {
    return axios.put(columnUrls.channelReduction, data)
  },
  // 批量新增
  fetchChannelBatch (data) {
    return axios.post(columnUrls.channelBatch, data)
  },
  // 栏目详情
  fetchChannelDetail (id) {
    return axios.get(columnUrls.channel + `/${id}`)
  },
  // 修改主体
  fetchChannelUpdate (data) {
    return axios.put(columnUrls.channel, data)
  },
  // 应用工作流
  fetchChannelWorkflow (data) {
    return axios.post(columnUrls.channelWorkflow, data)
  },
  // 移动、修改
  fetchChannelSort (data) {
    return axios.put(columnUrls.channelSort, data)
  },
  // 新增查询结构
  fetchChannelPlus (modelId) {
    return axios.get(columnUrls.channelPlus + modelId)
  },
  // 查询栏目列表-树
  fetchChannelTree (data) {
    return axios.get(columnUrls.channelTree, data)
  },
  // 上级栏目下拉树
  fetchChannelTreeOption (data) {
    return axios.get(columnUrls.channelTreeOption, data)
  },
  // 发布静态页
  fetchChannelStaticPageChannel (data) {
    return axios.put(columnUrls.channelStaticPageChannel, data)
  },
  // 合并
  fetchChannelMerge (data) {
    return axios.put(columnUrls.channelMerge, data)
  },
  // 组织权限
  fetchChannelPermOrg (data) {
    return axios.get(columnUrls.channelPermOrg, data)
  },
  // 组织权限更新
  fetchChannelPermOrgUpdate (data) {
    return axios.put(columnUrls.channelPermOrg, data)
  },
  // 用户权限
  fetchChannelPermUser (data) {
    return axios.get(columnUrls.channelPermUser, data)
  },
  // 用户权限更新
  fetchChannelPermUserUpdate (data) {
    return axios.put(columnUrls.channelPermUser, data)
  },
  // 查询内容模型模板
  fetchChannelContentModel (data) {
    return axios.get(columnUrls.channelContentModel, data)
  },
  // 查询内容模型下的PC、手机端模板
  fetchChannelTemplateList (data) {
    return axios.get(columnUrls.channelTemplateList, data)
  }
}
