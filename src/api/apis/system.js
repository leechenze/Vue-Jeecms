import axios from '../axios'
import systemUrls from '../urls/system'

export default {
  // 组织
  fetchOrganizeList (data) {
    return axios.get(systemUrls.organizeList, data)
  },
  fetchOrganizeCreate (data) {
    return axios.post(systemUrls.organize, data)
  },
  fetchOrganizeUpdate (data) {
    return axios.put(systemUrls.organize, data)
  },
  fetchOrganizeDelete (data) {
    return axios.delete(systemUrls.organize, data)
  },
  fetchOrganizeGet ({ id }) {
    return axios.get(systemUrls.organize + `/${id}`)
  },
  fetchOrganizeTree (data) {
    return axios.get(systemUrls.organizeTree, data)
  },
  fetchOrganizeTreeAll (data) {
    return axios.get(systemUrls.organizeTreeAll, data)
  },
  fetchOrganizeListUsers (data) {
    return axios.get(systemUrls.organizeListUsers, data)
  },
  fetchOrganizeListUsersDelete (data) {
    return axios.delete(systemUrls.organizeListUsers, data)
  },
  fetchOrganizeListUsersAdd (data) {
    return axios.post(systemUrls.organizeListUsers, data)
  },
  fetchOrganizeNameUnique (data) {
    return axios.get(systemUrls.organizeNameUnique, data)
  },
  fetchOrganizeSort (data) {
    return axios.get(systemUrls.organizeSort, data)
  },
  // 系统设置
  fetchSystemSettingDetail () {
    return axios.get(systemUrls.systemSetting)
  },
  fetchSystemSettingUpdate (data) {
    return axios.put(systemUrls.systemSetting, data)
  },
  // 角色
  fetchSystemRoleList (data) {
    return axios.get(systemUrls.sysRolePage, data)
  },
  fetchSystemRoleSave (data) {
    return axios.post(systemUrls.sysRoles, data)
  },
  fetchSystemRoleDelete (data) {
    return axios.delete(systemUrls.sysRoles, data)
  },
  fetchSystemRoleUpdate (data) {
    return axios.put(systemUrls.sysRoles, data)
  },
  fetchSystemRoleGet ({ id }) {
    return axios.get(systemUrls.sysRoles + `/${id}`)
  },
  fetchRoleAddUsers (data) {
    return axios.post(systemUrls.rolesAddUsers, data)
  },
  fetchRoleAddUsersAdd (data) {
    return axios.post(systemUrls.rolesAddUsers, data)
  },
  // 系统安全设置
  fetchSafeSettingDetail () {
    return axios.get(systemUrls.safeSetting)
  },
  fetchSafeSettingUpdate (data) {
    return axios.put(systemUrls.safeSetting, data)
  },
  fetchFtpList () {
    return axios.get(systemUrls.ftpList)
  },
  fetchOssList () {
    return axios.get(systemUrls.ossList)
  },
  // 人员密级
  fetchUserSecretList (data) {
    return axios.get(systemUrls.userSecretList, data)
  },
  fetchUserSecretCheck (data) {
    return axios.get(systemUrls.userSecretCheck, data)
  },
  fetchUserSecretDelete (ids) {
    return axios.delete(systemUrls.userSecret, { ids })
  },
  fetchUserSecretDetail ({ id }) {
    return axios.get(systemUrls.userSecret + `/${id}`)
  },
  fetchUserSecretCreate (data) {
    return axios.post(systemUrls.userSecret, data)
  },
  fetchUserSecretUpdate (data) {
    return axios.put(systemUrls.userSecret, data)
  },
  // 内容、附件密级
  fetchSysSecretList (data) {
    return axios.get(systemUrls.sysSecretsList, data)
  },
  fetchSysSecretCheck (data) {
    return axios.get(systemUrls.sysSecretsCheck, data)
  },
  fetchSysSecretDelete (data) {
    return axios.delete(systemUrls.sysSecrets, data)
  },
  fetchSysSecretDetail (data) {
    return axios.get(systemUrls.sysSecrets + `/${data.id}`)
  },
  fetchSysSecretCreate (data) {
    return axios.post(systemUrls.sysSecrets, data)
  },
  fetchSysSecretUpdate (data) {
    return axios.put(systemUrls.sysSecrets, data)
  },
  fetchSysSecretAll (data) {
    return axios.get(systemUrls.sysSecretsAll, data)
  },
  // 用户列表
  fetchSysUsersPage (data) {
    if ('orgids' in data) delete data.orgids
    return axios.get(systemUrls.sysUsersPage, data)
  },
  // 用户启用
  fetchSysUsersOn (data) {
    return axios.post(systemUrls.sysUsersOn, data)
  },
  // 用户禁用
  fetchSysUsersOff (data) {
    return axios.post(systemUrls.sysUsersOff, data)
  },
  // 用户详情
  fetchSysUsersGet (data) {
    return axios.get(systemUrls.sysUsers + `/${data.id}`)
  },
  fetchSysUsersAdd (data) {
    return axios.post(systemUrls.sysUsers, data)
  },
  fetchSysUsersUpdate (data) {
    return axios.put(systemUrls.sysUsers, data)
  },
  fetchSysUsersPwd (data) {
    return axios.post(systemUrls.usersPwd, data)
  },
  fetchSysUsersDelete (data) {
    return axios.delete(systemUrls.sysUsers, data)
  },
  fetchSysPermSite (data) {
    return axios.get(systemUrls.sysPermSite, data)
  },
  fetchSysUsersDataPerm (data) {
    return axios.get(systemUrls.sysUsersDataPerm, data)
  },
  fetchSysUsersDataPermUpdate (data, type) {
    return axios.put(systemUrls.sysUsersDataPerm, data, { 'dataPermStatus': type })
  },
  // 用户名验证
  fetchSysUsernameUnique (data) {
    return axios.get(systemUrls.usersUsernameUnique, data)
  },
  // 邮箱验证
  fetchSysMailUnique (data) {
    return axios.get(systemUrls.usersMailUnique, data)
  },
  // 手机号验证
  fetchSysPhoneUnique (data) {
    return axios.get(systemUrls.usersPhoneUnique, data)
  },
  // 密码格式验证
  fetchSysPwdUnique (data) {
    return axios.post(systemUrls.usersPwdUnique, data)
  },
  fetchSite () {
    /* system-cms-prefix start */
    return axios.get('/cmsmanager/site')
    /* system-cms-prefix change return axios.get('/cmsadmin/site') system-cms-prefix change */
    /* system-cms-prefix end */
  },
  // 角色下拉列表
  fetchRolesList (data) {
    return axios.get(systemUrls.sysRolesList, data)
  },
  // 角色成员管理
  fetchRolesListUsers (data) {
    return axios.get(systemUrls.sysRolesListUsers, data)
  },
  // 角色成员管理-移除
  fetchRolesListUsersDelete (data) {
    return axios.delete(systemUrls.sysRolesListUsers, data)
  },
  // 角色成员管理-添加
  fetchRolesListUsersAdd (data) {
    return axios.post(systemUrls.sysRolesListUsers, data)
  },
  // API-新增
  fetchApisCreate (data) {
    return axios.post(systemUrls.apis, data)
  },
  // API-删除
  fetchApisDelete (ids) {
    return axios.delete(systemUrls.apis, { ids })
  },
  // API-修改
  fetchApisUpdate (data) {
    return axios.put(systemUrls.apis, data)
  },
  // API-详情
  fetchApisDetail (data) {
    return axios.get(systemUrls.apis + `/${data.id}`)
  },
  // API-列表
  fetchApisList (data) {
    return axios.get(systemUrls.apisList, data)
  },
  // API-验证
  fetchApisUnique (data) {
    return axios.get(systemUrls.apisUnique, data)
  },
  // 菜单-新增
  fetchMenusCreate (data) {
    return axios.post(systemUrls.menus, data)
  },
  // 菜单-删除
  fetchMenusDelete (ids) {
    return axios.delete(systemUrls.menus, { ids })
  },
  // 菜单-修改
  fetchMenusUpdate (data) {
    return axios.put(systemUrls.menus, data)
  },
  // 菜单-详情
  fetchMenusDetail (data) {
    return axios.get(systemUrls.menus + `/${data.id}`)
  },
  // 菜单-列表
  fetchMenusList () {
    return axios.get(systemUrls.menusList)
  },
  // 菜单-显示
  fetchMenusShow (ids) {
    return axios.put(systemUrls.menusShow, { ids })
  },
  // 菜单-隐藏
  fetchMenusHidden (ids) {
    return axios.put(systemUrls.menusHidden, { ids })
  },
  // 菜单-开启权限控制
  fetchMenusOpenAuth (ids) {
    return axios.put(systemUrls.menusOpenAuth, { ids })
  },
  // 菜单-关闭权限控制
  fetchMenusCloseAuth (ids) {
    return axios.put(systemUrls.menusCloseAuth, { ids })
  },
  // 菜单-排序
  fetchMenusSort (sorts) {
    return axios.put(systemUrls.menusSort, { sorts })
  },
  // 菜单-权限
  fetchMenusPermission () {
    return axios.get(systemUrls.menusPermission)
  },
  // 菜单-验证唯一
  fetchMenusUnique (data) {
    return axios.get(systemUrls.menusUnique, data)
  },
  // 菜单-验证唯一
  fetchMenusNameUnique (data) {
    return axios.get(systemUrls.menusNameUnique, data)
  },
  // 防火墙配置-详情
  fetchIptablesGet (data) {
    return axios.get(systemUrls.iptables, data)
  },
  // 防火墙配置-修改
  fetchIptablesUpdate (data) {
    return axios.put(systemUrls.iptables, data)
  },
  // FTP存储列表
  fetchFtpStorageList (data) {
    return axios.get(systemUrls.ftpStorageList, data)
  },
  // FTP获取单个信息
  fetchFtpStorageDetail (data) {
    return axios.get(systemUrls.ftpStorage + `/${data.id}`)
  },
  // FTP新增信息
  fetchFtpStorageCreate (data) {
    return axios.post(systemUrls.ftpStorage, data)
  },
  // FTP删除信息
  fetchFtpStorageDelete (ids) {
    return axios.delete(systemUrls.ftpStorage, { ids })
  },
  // FTP修改信息
  fetchFtpStorageUpdate (data) {
    return axios.put(systemUrls.ftpStorage, data)
  },
  // 模型-列表
  fetchModelList (data) {
    return axios.get(systemUrls.modelList, data)
  },
  // 模型-新增全站
  fetchModelCreateAll (data) {
    return axios.post(systemUrls.modelCreateAll, data)
  },
  // 模型-新增本站
  fetchModelCreateThis (data) {
    return axios.post(systemUrls.modelCreateThis, data)
  },
  // 模型-是否启用
  fetchModelEnable (data) {
    return axios.put(systemUrls.modelEnable, data)
  },
  // 模型-添加模型字段信息
  fetchModelItem (data) {
    return axios.post(systemUrls.modelItem, data)
  },
  // 模型-修改
  fetchModelUpdate (data) {
    return axios.put(systemUrls.model, data)
  },
  // 模型-删除
  fetchModelDelete (ids) {
    return axios.delete(systemUrls.model, { ids })
  },
  // 模型-详情
  fetchModelDetail (data) {
    return axios.get(systemUrls.model + `/${data.id}`)
  },
  // 模型-排序
  fetchModelSort (data) {
    return axios.put(systemUrls.modelSort, data)
  },
  // 会员模型详情
  fetchModelMember () {
    return axios.get(systemUrls.modelMember)
  },
  // 模型名称是否可用
  fetchModelUnique (data) {
    return axios.get(systemUrls.modelUnique, data)
  },
  // 云存储列表
  fetchOssStorageList (data) {
    return axios.get(systemUrls.ossStorageList, data)
  },
  // 云存储获取单个信息
  fetchOssStorageDetail (data) {
    return axios.get(systemUrls.ossStorage + `/${data.id}`)
  },
  // 云存储新增信息
  fetchOssStorageCreate (data) {
    return axios.post(systemUrls.ossStorage, data)
  },
  // 云存储删除信息
  fetchOsspStorageDelete (ids) {
    return axios.delete(systemUrls.ossStorage, { ids })
  },
  // 云存储修改信息
  fetchOssStorageUpdate (data) {
    return axios.put(systemUrls.ossStorage, data)
  },
  // 通过code获取第三方登录配置
  fetchThirdPartyDetail (data) {
    return axios.get(systemUrls.thirdParty, data)
  },
  // 修改第三方登录信息
  fetchThirdPartyUpdate (data) {
    return axios.post(systemUrls.thirdParty, data)
  },
  // 资源空间-我的资源列表
  resourceUserPage (data) {
    if ('times' in data) delete data.times
    return axios.get(systemUrls.resourceUserPage, data)
  },
  // 资源空间-共享资源列表
  resourceSharePage (data) {
    return axios.get(systemUrls.resourcePage, data)
  },
  // 资源空间-我的资源树形
  resourceUserTree (data) {
    return axios.get(systemUrls.resourceSpacesPage, data)
  },
  // 资源空间-共享资源树形
  resourceShareTree (data) {
    return axios.get(systemUrls.resourceSpacesSharePage, data)
  },
  // 资源空间-新增
  resourceSpaceSave (data) {
    return axios.post(systemUrls.resourceSpaces, data)
  },
  // 资源空间-修改名称
  resourceSpaceUpdate (data) {
    return axios.put(systemUrls.resourceSpaces, data)
  },
  // 资源空间-删除
  resourceSpaceDelete (data) {
    return axios.delete(systemUrls.resourceSpaces, data)
  },
  // 资源空间-移动
  resourceSpaceMove (data) {
    return axios.put(systemUrls.resourceSpacesMove, data)
  },
  // 资源空间-共享
  resourceSpaceShare (data) {
    return axios.post(systemUrls.resourceSpacesShare, data)
  },
  // 资源空间-取消共享
  resourceSpaceUnShare (data) {
    return axios.post(systemUrls.resourceSpacesUnShare, data)
  },
  // 资源-保存到我的资源
  resourceSpaceDatasSave (data) {
    return axios.post(systemUrls.resourceSpaceDatas, data)
  },
  // 资源-修改名称
  resourceSpaceDatasUpdate (data) {
    return axios.put(systemUrls.resourceSpaceDatas, data)
  },
  // 资源-删除
  resourceSpaceDatasDelete (data) {
    return axios.delete(systemUrls.resourceSpaceDatas, data)
  },
  // 资源-详情
  resourceSpaceDatasGet (data) {
    return axios.get(systemUrls.resourceSpaceDatas + `/${data.id}`)
  },
  // 资源-移动
  resourceSpaceDatasMove (data) {
    return axios.put(systemUrls.resourceSpaceDatasShift, data)
  },
  // 资源-共享
  resourceSpaceDatasShare (data) {
    return axios.post(systemUrls.resourceSpaceDatasShare, data)
  },
  // 资源-修改
  resourceSpaceDatasSharePut (data) {
    return axios.put(systemUrls.resourceSpaceDatasShare, data)
  },
  // 资源-获取共享设置
  resourceSpaceDatasShareGet (data) {
    return axios.get(systemUrls.resourceSpaceDatasShare, data)
  },
  // 资源-取消共享
  resourceSpaceDatasUnShare (data) {
    return axios.post(systemUrls.resourceSpaceDatasUnShare, data)
  },
  // 资源-下载到本地
  resourceSpaceDatasDownload (data) {
    return axios.download(systemUrls.resourceSpaceDatasDownload, data)
  },
  // 资源空间-名称验证
  resourceSpaceNameUnique (data) {
    return axios.get(systemUrls.resourceSpaceDatasNameUnique, data)
  },
  // 资源-名称验证
  resourceSpaceDatasNameUnique (data) {
    return axios.get(systemUrls.resourceSpaceDatasAliaUnique, data)
  },
  // 获取邮件服务器设置
  fetchEmailDetail (data) {
    return axios.get(systemUrls.email, data)
  },
  // 修改邮件服务器设置
  fetchEmailUpdate (data) {
    return axios.post(systemUrls.email, data)
  },
  // 发送测试邮件
  fetchEmailTest (data) {
    return axios.post(systemUrls.emailTest, data)
  },
  // 获取微信开放平台信息
  fetchWeiXinDetail (data) {
    return axios.get(systemUrls.weiXin, data)
  },
  // 修改微信开放平台信息
  fetchWeiXinUpdate (data) {
    return axios.put(systemUrls.weiXin, data)
  },
  // 添加微信开放平台信息
  fetchWeiXinCreate (data) {
    return axios.post(systemUrls.weiXin, data)
  },
  // 日志 ///////////////////////////////////////////////////
  // 实时日志
  fetchLogsRealTime (data) {
    return axios.get(systemUrls.logsRealTime, data)
  },
  // 日志列表
  fetchlogspage (data) {
    if ('time' in data) delete data.time
    return axios.get(systemUrls.logspage, data)
  },
  // 告警日志列表
  fetchLogsAlarmPage (data) {
    if ('time' in data) delete data.time
    return axios.get(systemUrls.logsAlarmPage, data)
  },
  // 日志策略详情
  fetchLogsConfigs (data) {
    return axios.get(systemUrls.logsConfigs, data)
  },
  // 日志策略详情修改
  fetchLogsConfigsPut (data) {
    return axios.put(systemUrls.logsConfigs, data)
  },
  // 日志详情
  fetchLogs (data) {
    return axios.get(systemUrls.logs + `/${data.id}`)
  },
  // 日志备份列表
  fetchLogBackupsPage (data) {
    if ('time1' in data) delete data.time1
    if ('time2' in data) delete data.time2
    return axios.get(systemUrls.logBackupsPage, data)
  },
  // 日志备份详情
  fetchLogBackups (data) {
    return axios.get(systemUrls.logBackups + `/${data.id}`)
  },
  // 新建日志备份
  fetchLogBackupsSave (data) {
    return axios.post(systemUrls.logBackupsSave, data)
  },
  // 日志备份恢复
  fetchLogBackupsRestore (data) {
    return axios.get(systemUrls.logBackupsRestore, data)
  },
  // 日志导出
  fetchLogExport (data) {
    return axios.download(systemUrls.logExport, data)
  },
  // 日志操作数据统计
  fetchLogStatisticsResult (data) {
    if ('time' in data) delete data.time
    return axios.get(systemUrls.logStatisticsResult, data)
  },
  // 日志统计事件类型
  fetchLogStatisticsEventType (data) {
    if ('time' in data) delete data.time
    return axios.get(systemUrls.logStatisticsEventType, data)
  },
  // 日志统计操作类型
  fetchLogStatisticsOperationType (data) {
    if ('time' in data) delete data.time
    return axios.get(systemUrls.logStatisticsOperationType, data)
  },
  // 日志统计用户名
  fetchLogStatisticsUsername (data) {
    if ('time' in data) delete data.time
    return axios.get(systemUrls.logStatisticsUsername, data)
  },
  // 系统信息
  // 获取系统信息
  fetchSysteminfo (data) {
    return axios.get(systemUrls.systeminfo, data)
  },
  // 更改授权码
  fetchSysteminfoChange (data) {
    return axios.get(systemUrls.systeminfoChange, data)
  },
  // 查询区域层级列表
  fetchSystemAreaList (data) {
    return axios.get(systemUrls.systemAreaList, data)
  },
  // 区域排序
  fetchSystemAreaSort (data) {
    return axios.put(systemUrls.systemAreaSort, data)
  },
  // 删除区域
  fetchSystemAreaDelete (data) {
    return axios.delete(systemUrls.systemArea, data)
  },
  // 校验区域编号
  fetchSystemAreaCodeUnique (data) {
    return axios.get(systemUrls.systemAreaCodeUnique, data)
  },
  // 新建区域
  fetchSystemAreAdd (data) {
    return axios.post(systemUrls.systemArea, data)
  },
  // 区域详情
  fetchSystemAreaDetails (data) {
    return axios.get(systemUrls.systemArea + `/${data.id}`)
  },
  // 区域修改
  fetchSystemAreaPut (data) {
    return axios.put(systemUrls.systemArea, data)
  },
  // 区域树形
  fetchSystemAreaTree () {
    return axios.get(systemUrls.systemAreaTree)
  },
  // 告警日志导出
  fetchlogsAlarmExport (data) {
    return axios.download(systemUrls.logsAlarmExport, data)
  },
  // 备份下载
  fetchSystemDatabaseBackupDownload (data, onUploadProgress) {
    return axios.download(systemUrls.systemDatabaseBackupDownload + `/${data.id}`, onUploadProgress)
  },
  // 新建备份
  fetchSystemDatabaseBackupNew (data) {
    return axios.get(systemUrls.systemDatabaseBackupNew, data)
  },
  // 还原备份
  fetchSystemDatabaseBackupRecovery (data) {
    return axios.get(systemUrls.systemDatabaseBackupRecovery + `/${data.id}`)
  },
  // 备份删除
  fetchSystemDatabaseBackupDelete (data) {
    return axios.delete(systemUrls.systemDatabaseBackup + `/${data.id}`)
  },
  // 备份列表
  fetchSystemDatabaseBackupPage (data) {
    return axios.get(systemUrls.systemDatabaseBackupPage, data)
  },
  // 用户列表-无分页
  fetchSystemUserslist (data) {
    return axios.get(systemUrls.systemUserslist, data)
  },
  // 单点登录设置-设置详情
  fetchSoo (data) {
    return axios.get(systemUrls.sso, data)
  },
  // 单点登录设置-保存单点登录
  fetchSaveSoo (data) {
    return axios.post(systemUrls.sso, data)
  },
  // 三员管理-列表
  fetAuditManagePage (data) {
    return axios.get(systemUrls.auditManagePage, data)
  },
  // 三员管理-审核接口
  fetAuditOperate (data) {
    return axios.put(systemUrls.auditOperate, data)
  },
  // 三员管理审核-头部数量统计
  fetAuditOperateStatistics (data) {
    return axios.get(systemUrls.auditOperate, data)
  },
  // 三员管理-操作详情
  fetAuditOperateGet (data) {
    return axios.get(systemUrls.auditOperate + `/${data.id}`)
  },
  // 管理员列表分页
  fetchUsersSafeManagePage (data) {
    return axios.post(systemUrls.usersSafeManagePage, data)
  },
  // 三员管理-详情
  fetchSafeManageGet (data) {
    return axios.get(systemUrls.safeManage, data)
  },
  // 三员管理-修改
  fetchSafeManagePut (data, type) {
    return axios.put(systemUrls.safeManage, data, { 'safeManageStatus': type })
  },
  // 三员管理-验证
  fetchSafeManageCheck (data) {
    return axios.post(systemUrls.safeManageCheck, data)
  },
  // 三员管理日志 - 列表
  fetcHauditManageLogPage (data) {
    return axios.get(systemUrls.auditManageLogPage, data)
  },
  // 三员管理 - 校验安全管理员用户权限
  fetchSafeManageCheckUser (data) {
    return axios.post(systemUrls.safeManageCheckUser, data)
  },
  // 双因子详情
  fetchDoubleElement (data) {
    return axios.get(systemUrls.doubleElement, data)
  },
  // 双因子-设置
  fetchDoubleElementPost (data) {
    return axios.post(systemUrls.doubleElement, data)
  },
  // 双因子-绑定手机
  fetchDoubleElementHasBind (data) {
    return axios.get(systemUrls.doubleElementHasBind, data)
  },
  // 双因子-发送验证码
  fetchDoubleElementSendBind (data) {
    return axios.get(systemUrls.doubleElementSendBind, data)
  },
  // 双因子-提交
  fetchDoubleElementBind (data) {
    return axios.get(systemUrls.doubleElementBind, data)
  },
  // 双因子-判断是否开启
  fetchDoubleElementStatus (data) {
    return axios.get(systemUrls.doubleElementStatus, data)
  },
  // 绩效管理-列表
  fetchPfrulePage (data) {
    return axios.get(systemUrls.pfrulePage, data)
  },
  // 绩效管理-检测规则名称
  fetchPfruleUniqueName (data) {
    return axios.get(systemUrls.pfruleUniqueName, data)
  },
  // 绩效管理-复制规则
  fetchPfruleCopy (data) {
    return axios.get(systemUrls.pfruleCopy, data)
  },
  // 绩效管理-删除规则
  fetchPfruleDelete (data) {
    return axios.delete(systemUrls.pfrule, data)
  },
  // 绩效管理-保存
  fetchPfruleSave (data) {
    return axios.post(systemUrls.pfrule, data)
  },
  // 绩效管理-修改
  fetchPfrulePut (data) {
    return axios.put(systemUrls.pfrule, data)
  },
  // 绩效管理-详情
  fetchPfruleDetail (data) {
    return axios.get(systemUrls.pfrule + `/${data.id}`)
  },
  // 评分列表 pfscorePage
  fetchPfruleScorelist (data) {
    return axios.get(systemUrls.pfruleScorelist, data)
  },
  // 绩效管理-查看绩效列表
  fetchPfscorePage (data) {
    return axios.get(systemUrls.pfscorePage, data)
  },
  // 绩效管理-查看绩效列表
  fetchPfscoreExcel (data) {
    return axios.get(systemUrls.pfscoreExcel, data)
  },
  // 绩效管理-查看绩效列表
  fetchPfscoreDetele (data) {
    return axios.delete(systemUrls.pfscore, data)
  },
  // 绩效管理-开始评分
  fetchPfscoreStart (data) {
    return axios.post(systemUrls.pfscore, data)
  },
  // 绩效管理-查看绩效列表
  fetchPfscore (data) {
    return axios.get(systemUrls.pfscore + `/${data.id}`)
  },
  // 绩效管理-查看总数量评分查看明细
  fetchPfscoreDetailsNumber (data) {
    return axios.get(systemUrls.pfscoreDetailsNumber, data)
  },
  // 绩效管理-查看访问量评分查看明细
  fetchPfscoreDetailsViews (data) {
    return axios.get(systemUrls.pfscoreDetailsViews, data)
  },
  // 绩效管理-查看点赞查看明细
  fetchPfscoreDetailsLike (data) {
    return axios.get(systemUrls.pfscoreDetailsLike, data)
  },
  // 绩效管理-查看评论评分查看明细
  fetchPfscoreDetailsComment (data) {
    return axios.get(systemUrls.pfscoreDetailsComment, data)
  },
  // 绩效管理-时效性评分查看明细
  fetchPfscoreDetailsTime (data) {
    return axios.get(systemUrls.pfscoreDetailsTime, data)
  },
  // 用户密级设置-待设置列表
  fetchUsersecretNosetpage (data) {
    return axios.get(systemUrls.usersecretNosetpage, data)
  },
  // 用户密级设置-已设置列表
  fetchUsersecretSetpage (data) {
    return axios.get(systemUrls.usersecretSetpage, data)
  },
  // 用户密级设置-已设置列表
  fetchUserSecretsList (data) {
    return axios.get(systemUrls.userSecretsList, data)
  },
  // 用户密级设置-已设置列表
  fetchUserSecretIds (data) {
    return axios.post(systemUrls.userSecretIds, data)
  },
  // 用户密级设置-用户日志
  fetchReinsuranceUserPages (data) {
    return axios.get(systemUrls.reinsuranceUserPages, data)
  },
  // 用户密级设置-校验用户权限
  fetchReinsuranceCheckMenus (data) {
    return axios.get(systemUrls.reinsuranceCheckMenus, data)
  },
  // 分级保护-判断是否开启
  fetchReinsuranceIsShow (data) {
    return axios.get(systemUrls.reinsuranceIsShow, data)
  },
  // 分级保护-查询详情
  fetchReinsuranceGet (data) {
    return axios.get(systemUrls.reinsurance, data)
  },
  // 分级保护-修改分级设置
  fetchReinsurancePut (data) {
    return axios.put(systemUrls.reinsurance, data)
  },
  // 分级保护-校验用户菜单权限
  fetchReinsuranceCheckMenu (data) {
    return axios.get(systemUrls.reinsuranceCheckMenu, data)
  },
  // 分级保护-设置安全员或审计员的人员分页列表 reinsResult
  fetchReinsuranceUserPage (data) {
    return axios.get(systemUrls.reinsuranceUserPage, data)
  },
  // 分级保护-校验重置内容是否完成 resetSecret
  fetchReinsResult (data) {
    return axios.get(systemUrls.reinsResult, data)
  },
  // 分级保护-校验重置内容密级
  fetchResetSecret (data) {
    return axios.post(systemUrls.resetSecret, data)
  }

}
