/* system-cms-prefix start */
const prefix = '/cmsmanager'
/* system-cms-prefix change const prefix = '/cmsadmin' system-cms-prefix change */
/* system-cms-prefix end */

export default {
  // 栏目树
  channelGetAllTree: `${prefix}/channel/getAllTree`,
  // 回收站-栏目树
  channelRecycleTree: `${prefix}/channel/recycle/tree`,
  // 查询栏目模型
  channelModelList: `${prefix}/channel/model/list`,
  // 模型默认字段
  // 栏目列表
  channelList: `${prefix}/channel/list`,
  // 模板
  // 校验栏目名称或路径
  channelUnique: `${prefix}/channel/element/unique`,
  // 新增
  channel: `${prefix}/channel`,
  // 新增-顶层
  channelTop: `${prefix}/channel/top`,
  // 删除
  // 彻底删除
  channelThorough: `${prefix}/channel/thorough`,
  // 还原
  channelReduction: `${prefix}/channel/reduction`,
  // 批量新增
  channelBatch: `${prefix}/channel/multiple`,
  // 栏目详情
  // 修改主体
  // 修改扩展
  // 应用工作流
  channelWorkflow: `${prefix}/channel/claim/workflow`,
  // 移动、修改
  channelSort: `${prefix}/channel/sort`,
  // 新增查询结构
  channelPlus: `${prefix}/channel/plus/`,
  // 查询栏目列表-树
  channelTree: `${prefix}/channel/term/tree`,
  // 上级栏目下拉树
  channelTreeOption: `${prefix}/channel/tree`,
  // 修改扩展
  // 发布静态页
  channelStaticPageChannel: `${prefix}/content/staticPage/channel`,
  // 合并
  channelMerge: `${prefix}/channel/merge`,
  // 权限
  channelPermUser: `${prefix}/dataPerm/channel/user`,
  channelPermOrg: `${prefix}/dataPerm/channel/org`,
  // 查询内容模型模板
  channelContentModel: `${prefix}/channel/content/model`,
  // 查询内容模型下的PC、手机端模板
  channelTemplateList: `${prefix}/channel/template/list`
}
