const prefix = process.env.VUE_APP_YUN_API_HOST

export default {
  // 设置用户身份ID
  collectId: `${prefix}/MODULE-COLLECT/collect/client/createIdentity`,
  // 检查任务数量限制
  fetchAddCollectEnable: `${prefix}/MODULE-COLLECT/collectTaskExt/addCheck`,
  // 设置用户身份ID
  yunAppIdOrModel: `${prefix}/MODULE-COLLECT/collect/client/initData`,
  // 采集任务列表
  collectTask: `${prefix}/MODULE-COLLECT/collectTasks`,
  // 采集数据列表
  collectContentList: `${prefix}/MODULE-COLLECT/collect/data/results`,
  // 采集任务开始
  collectTasksStart: `${prefix}/MODULE-COLLECT/collectTasks/start`,
  // 采集插件版本
  collectPlugin: `${prefix}/MODULE-RES/plus/check`
}
