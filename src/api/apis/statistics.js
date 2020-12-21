import axios from '../axios'
import statistics from '../urls/statistics.js'

export default {
  // 网站统计 网站概况
  fetchStatisticsFlowOverview (data) {
    return axios.get(statistics.statisticsFlowOverview, data)
  },
  // 趋势分析-图表数据
  fetchStatisticsImage (data) {
    return axios.post(statistics.statisticsImage, data)
  },
  // 访客数据-今日访客
  fetchStatisticsvisitTimeuser (data) {
    return axios.post(statistics.statisticsvisitTimeuser, data)
  },
  // 访客数据-访客
  fetchStatisticsvisitUser (data) {
    return axios.post(statistics.statisticsvisitUser, data)
  },
  // 来源网站
  fetchStatisticsSourceSourceUrl (data) {
    if ('time' in data) delete data.time
    return axios.get(statistics.statisticsSourceSourceUrl, data)
  },
  // 入口页面
  fetchStatisticsAccessPageEntrancePage (data) {
    if ('time' in data) delete data.time
    return axios.get(statistics.statisticsAccessPageEntrancePage, data)
  },
  // 访问页面
  fetchStatisticsAccessPageAccessPage (data) {
    if ('time' in data) delete data.time
    return axios.get(statistics.statisticsAccessPageAccessPage, data)
  },
  // 今日地域分布
  fetchStatisticsvisitTimearea (data) {
    return axios.post(statistics.statisticsvisitTimearea, data)
  },
  // 区域分布
  fetchStatisticsvisitArea (data) {
    return axios.post(statistics.statisticsvisitArea, data)
  },
  // 网站概述新老客户
  fetchStatisticsvisitSummarize (data) {
    return axios.get(statistics.statisticsvisitSummarize, data)
  },
  // 网站概述地域分布
  fetchStatisticsvisitSummarizeArea (data) {
    return axios.get(statistics.statisticsvisitSummarizeArea, data)
  },
  // 实时访客图表数据
  fetchStatisticsflowRealtime (data) {
    return axios.get(statistics.statisticsflowRealtime, data)
  },
  // 实时访客列表数据
  fetchStatisticsflowRealtimePage (data) {
    return axios.post(statistics.statisticsflowRealtimePage, data)
  },
  // 来源网站分页
  fetchStatisticsSourceSourceUrlPage (data) {
    return axios.get(statistics.statisticsSourceSourceUrlPage, data)
  },
  // 趋势分析-列表数据
  fetchStatisticsflowPage (data) {
    return axios.post(statistics.statisticsflowPage, data)
  },
  // 来源分析-来源类型
  fetchStatisticsSourceType (data) {
    if ('time' in data) delete data.time
    return axios.get(statistics.statisticsSourceType, data)
  },
  // 来源分析-来源类型
  fetchStatisticsSourceUrlPage (data) {
    if ('time' in data) delete data.time
    return axios.get(statistics.statisticsSourceUrlPage, data)
  },
  // 来源分析-搜索引擎
  fetchStatisticsSourceSearchEngine (data) {
    if ('time' in data) delete data.time
    return axios.get(statistics.statisticsSourceSearchEngine, data)
  },
  // 来源分析-外部链接（域名）
  fetchStatisticsSourceDomain (data) {
    if ('time' in data) delete data.time
    return axios.get(statistics.statisticsSourceDomain, data)
  },
  // 来源分析-外部链接（url）
  fetchStatisticsSourceUrl (data) {
    if ('time' in data) delete data.time
    return axios.get(statistics.statisticsSourceUrl, data)
  },
  // 来源分析-外部链接（域名）分页
  fetchStatisticsSourceDomainPage (data) {
    if ('time' in data) delete data.time
    return axios.get(statistics.statisticsSourceDomainPage, data)
  },
  // 来源分析-外部链接（url）分页
  fetchStatisticsSourceUrlOuterPage (data) {
    if ('time' in data) delete data.time
    return axios.get(statistics.statisticsSourceUrlOuterPage, data)
  },
  // 地域分布-今天列表分页
  fetchStatisticsvisitTimepage (data) {
    return axios.post(statistics.statisticsvisitTimepage, data)
  },
  // 地域分布-日常列表分页
  fetchStatisticsvisitAreapage (data) {
    return axios.post(statistics.statisticsvisitAreapage, data)
  },
  // 设备信息-今日图表
  fetchStatisticsdeviceTimedevice (data) {
    return axios.get(statistics.statisticsdeviceTimedevice, data)
  },
  // 设备信息-今日列表
  fetchStatisticsdeviceTime (data) {
    return axios.get(statistics.statisticsdeviceTime, data)
  },
  // 设备信息-日常图表
  fetchStatisticsdeviceDevice (data) {
    return axios.post(statistics.statisticsdeviceDevice, data)
  },
  // 设备信息-日常列表
  fetchStatisticsdeviceDevices (data) {
    return axios.post(statistics.statisticsdeviceDevices, data)
  },
  // 忠诚度-今日访问次数
  fetchstatisticsaccessTimePage (data) {
    return axios.post(statistics.statisticsaccessTimePage, data)
  },
  // 忠诚度-访问次数
  fetchstatisticsaccessPageInfo (data) {
    return axios.post(statistics.statisticsaccessPageInfo, data)
  },
  // 忠诚度-今日访问深度
  fetchstatisticsaccessTimeHigh (data) {
    return axios.post(statistics.statisticsaccessTimeHigh, data)
  },
  // 忠诚度-访问深度
  fetchstatisticsaccessHighInfo (data) {
    return axios.post(statistics.statisticsaccessHighInfo, data)
  },
  // 忠诚度-今日访问时长
  fetchstatisticsaccessTime (data) {
    return axios.post(statistics.statisticsaccessTime, data)
  },
  // 忠诚度-访问时长
  fetchstatisticsaccessTimeInfo (data) {
    return axios.post(statistics.statisticsaccessTimeInfo, data)
  },
  // 实时访客-在线访问人数
  fetchstatisticsflowRealtimeUvnum (data) {
    return axios.get(statistics.statisticsflowRealtimeUvnum, data)
  },
  // 网站信息统计
  fetchstatisticsSitegeneralInfo (data) {
    return axios.get(statistics.statisticsSitegeneralInfo, data)
  },
  // 流量贡献值-图标  statisticsSitegeneralChannel
  fetchstatisticsSitegeneralViews (data) {
    return axios.get(statistics.statisticsSitegeneralViews, data)
  },
  // 内容发布-饼图
  fetchstatisticsSitegeneralChannel (data) {
    return axios.get(statistics.statisticsSitegeneralChannel, data)
  },
  // 内容发布统计-栏目表格
  fetchstatisticsSitegeneralChannelData (data) {
    return axios.get(statistics.statisticsSitegeneralChannelData, data)
  },
  // 内容发布-用户饼图
  fetchstatisticsSitegeneralUser (data) {
    return axios.get(statistics.statisticsSitegeneralUser, data)
  },
  // 内容发布-用户表格
  fetchstatisticsSitegeneralUserData (data) {
    return axios.get(statistics.statisticsSitegeneralUserData, data)
  },
  // 内容发布-用户表格导出
  fetchstatisticsUserExcelData (data) {
    return axios.get(statistics.statisticsUserExcelData, data)
  },
  // 内容发布-组织饼图、柱形图
  fetchstatisticsSitegeneralOrg (data) {
    return axios.get(statistics.statisticsSitegeneralOrg, data)
  },
  // 内容发布-组织表格
  fetchstatisticsSitegeneralOrgData (data) {
    return axios.get(statistics.statisticsSitegeneralOrgData, data)
  },
  // 内容发布-组织表格导出
  fetchstatisticsOrgExcelData (data) {
    return axios.get(statistics.statisticsOrgExcelData, data)
  },
  // 内容发布-站点饼图、柱形图
  fetchstatisticsSitegeneralSite (data) {
    return axios.get(statistics.statisticsSitegeneralSite, data)
  },
  // 内容发布-站点表格
  fetchstatisticsSitegeneralSiteData (data) {
    return axios.get(statistics.statisticsSitegeneralSiteData, data)
  },
  // 内容数据统计-表格
  fetchsitegeneralChannelData (data) {
    return axios.get(statistics.sitegeneralChannelData, data)
  },
  // 内容数据统计-表格
  fetchsitegeneralContentData (data) {
    return axios.get(statistics.sitegeneralContentData, data)
  },
  // 内容数据统计-统计
  fetchsitegeneralListData (data) {
    return axios.get(statistics.sitegeneralListData, data)
  }
}
