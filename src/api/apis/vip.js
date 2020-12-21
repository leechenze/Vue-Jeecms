import axios from '../axios'
import vipUrls from '../urls/vip.js'

export default {
  // 会员待审核列表
  fetchMembersAuditList (data) {
    return axios.get(vipUrls.membersAuditList, data)
  },
  // 会员通过审核
  fetchMembersOn (data) {
    return axios.post(vipUrls.membersOn, data)
  },
  // 会员不通过审核
  fetchMembersOff (data) {
    return axios.post(vipUrls.membersOff, data)
  },
  // 会员组列表信息
  fetchMembersGroupList (data) {
    return axios.get(vipUrls.membersGroupList, data)
  },
  // 会员组详细信息
  fetchMembersGroupDetail (data) {
    return axios.get(vipUrls.membersGroup + `/${data.id}`)
  },
  // 会员组添加
  fetchMembersGroupAdd (data) {
    return axios.post(vipUrls.membersGroup, data)
  },
  // 会员组修改
  fetchMembersGroupPut (data) {
    return axios.put(vipUrls.membersGroup, data)
  },
  // 会员组删除
  fetchMembersGroupDelete (data) {
    return axios.delete(vipUrls.membersGroup, data)
  },
  // 会员等级列表信息
  fetchMemberLevelList (data) {
    return axios.get(vipUrls.memberLevelList, data)
  },
  // 会员等级详细信息
  fetchMemberLevelDetail (data) {
    return axios.get(vipUrls.memberLevel + `/${data.id}`)
  },
  // 会员等级添加
  fetchMemberLevelAdd (data) {
    return axios.post(vipUrls.memberLevel, data)
  },
  // 会员等级修改
  fetchMemberLevelPut (data) {
    return axios.put(vipUrls.memberLevel, data)
  },
  // 会员等级删除
  fetchMemberLevelDelete (data) {
    return axios.delete(vipUrls.memberLevel, data)
  },
  // 会员管理列表
  fetchMembersList (data) {
    return axios.get(vipUrls.membersList, data)
  },
  // 会员管理启用
  fetchMembersEnable (data) {
    return axios.post(vipUrls.membersEnable, data)
  },
  // 会员管理禁用
  fetchMembersDisable (data) {
    return axios.post(vipUrls.membersDisable, data)
  },
  // 会员删除
  fetchMembersDelete (data) {
    return axios.delete(vipUrls.membersList, data)
  },
  // 会员新增
  fetchMembersAdd (data) {
    return axios.post(vipUrls.membersList, data)
  },
  // 会员组下拉列表
  fetchMembersGroupPull (data) {
    return axios.get(vipUrls.membersGroupPull, data)
  },
  // 会员详情
  fetchMembersDetail (data) {
    return axios.get(vipUrls.membersList + `/${data.id}`)
  },
  // 会员详情
  fetchMembersPut (data) {
    return axios.put(vipUrls.membersList, data)
  },
  // 会员组成员列表
  fetchMembersGroupListUsers (data) {
    return axios.get(vipUrls.membersGroupListUsers, data)
  },
  // 会员组成员添加
  fetchMembersGroupListUsersAdd (data) {
    return axios.post(vipUrls.membersGroupListUsers, data)
  },
  // 会员组成员移动
  fetchMembersGroupListUsersPut (data) {
    return axios.put(vipUrls.membersGroupListUsers, data)
  },
  // 会员等级下拉列表
  fetchMembersLevelList (data) {
    return axios.get(vipUrls.membersLevelList, data)
  },
  // 会员积分配置详情
  fetchMembersScoreDetail (data) {
    return axios.get(vipUrls.membersScore, data)
  },
  // 会员积分配置修改
  fetchMembersScoreAlter (data) {
    return axios.post(vipUrls.membersScore, data)
  },
  // 会员待审核列表动态字段
  fetchMembersAddition (data) {
    return axios.get(vipUrls.membersAddition, data)
  },
  // 会员模型动态字段
  fetchMembersAdditionModel (data) {
    return axios.get(vipUrls.membersAdditionModel, data)
  }
}
