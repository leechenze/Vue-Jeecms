/* system-cms-prefix start */
const prefix = '/cmsmanager'
/* system-cms-prefix change const prefix = '/cmsadmin' system-cms-prefix change */
/* system-cms-prefix end */
export default {
  // 会员待审核列表
  membersAuditList: `${prefix}/members/audit`,
  // 会员通过审核
  membersOn: `${prefix}/members/on`,
  // 会员不通过审核
  membersOff: `${prefix}/members/off`,
  // 会员组列表
  membersGroupList: `${prefix}/memberGroup/page`,
  // 会员组信息编辑
  membersGroup: `${prefix}/memberGroup`,
  // 会员等级列表
  memberLevelList: `${prefix}/memberLevel/page`,
  // 会员等级编辑
  memberLevel: `${prefix}/memberLevel`,
  // 会员管理列表
  membersList: `${prefix}/members`,
  // 会员管理启用
  membersEnable: `${prefix}/members/enable`,
  // 会员管理禁用
  membersDisable: `${prefix}/members/disable`,
  // 会员组下拉列表
  membersGroupPull: `${prefix}/memberGroup/list`,
  // 会员组成员管理列表
  membersGroupListUsers: `${prefix}/memberGroup/list/users`,
  // 会员等级下拉列表
  membersLevelList: `${prefix}/memberLevel/list`,
  // 会员积分配置
  membersScore: `${prefix}/members/score`,
  // 会员积分配置
  membersAddition: `${prefix}/members/addition`,
  // 会员模型字段
  membersAdditionModel: `${prefix}/members/addition/model`
}
