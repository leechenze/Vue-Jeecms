<template>
  <section class="log-statis-index-container">
    <el-main>
        <el-tabs v-model="activeTab" class="forbid-tabs" @tab-click="handleClickTab">
          <el-tab-pane label="操作结果" name="result">
            <!-- 标签头下的操作提示 -->
            <span slot="label">操作结果
              <!-- <jee-icon
              iconClass="caozuoshuoming1"
              @click="tabsHeaders[0].showAlert = !tabsHeaders[0].showAlert"
            /> -->
            </span>
            <el-collapse-transition>
              <div v-show="tabsHeaders[0].showAlert">
                <el-alert
                  :title="$t(tabsHeaders[0].content)"
                  type="warning"
                  show-icon
                  @close="tabsHeaders[0].showAlert = false"
                ></el-alert>
              </div>
            </el-collapse-transition>

              <search-header
      class="search-header"
              v-bind="resultHeader"
              :params="resultParams"
              @handleSearch="handleSearchResult"
            ></search-header>
            <v-chart :data="resultData" v-bind="chartOption()" :scale="scale1">
              <v-tooltip />
              <v-axis v-bind="axisOption({dataKey:'时间'})"/>
              <v-axis v-bind="axisOption({dataKey:'数量'})"/>
              <v-legend v-bind="legendOption()"/>
              <v-stack-bar position="时间*数量"
                :color="['name', colorOption(0)]"
              />
            </v-chart>
          </el-tab-pane>
          <el-tab-pane label="事件类型" name="incident">
            <!-- 标签头下的操作提示 -->
            <span slot="label">事件类型
              <!-- <jee-icon
              iconClass="caozuoshuoming1"
              @click="tabsHeaders[1].showAlert = !tabsHeaders[1].showAlert"
            /> -->
            </span>
            <el-collapse-transition>
              <div v-show="tabsHeaders[1].showAlert">
                <el-alert
                  :title="$t(tabsHeaders[1].content)"
                  type="warning"
                  show-icon
                  @close="tabsHeaders[1].showAlert = false"
                ></el-alert>
              </div>
            </el-collapse-transition>

              <search-header
      class="search-header"
              v-bind="incidentHeader"
              :params="incidentParams"
              @handleSearch="handleSearchIncident"
            ></search-header>
            <v-chart v-bind="chartOption()" :data="incidentData" :scale="scale2">
              <v-tooltip />
              <v-axis v-bind="axisOption({dataKey:'时间'})"/>
              <v-axis v-bind="axisOption({dataKey:'数量'})"/>
              <v-legend v-bind="legendOption()"/>
              <v-stack-bar position="时间*数量"
                :color="['name', colorOption(0)]"
              />
            </v-chart>
          </el-tab-pane>
          <el-tab-pane label="操作类型" name="operate">
            <!-- 标签头下的操作提示 -->
            <span slot="label">操作类型
              <!-- <jee-icon
              iconClass="caozuoshuoming1"
              @click="tabsHeaders[2].showAlert = !tabsHeaders[2].showAlert"
            /> -->
            </span>
            <el-collapse-transition>
              <div v-show="tabsHeaders[2].showAlert">
                <el-alert
                  :title="$t(tabsHeaders[2].content)"
                  type="warning"
                  show-icon
                  @close="tabsHeaders[2].showAlert = false"
                ></el-alert>
              </div>
            </el-collapse-transition>

              <search-header
      class="search-header"
              v-bind="operateHeader"
              :params="operateParams"
              @handleSearch="handleSearchOperate"
            ></search-header>
            <v-chart v-bind="chartOption()" :data="operateData" :scale="scale3">
              <v-tooltip />
              <v-axis v-bind="axisOption({dataKey:'操作类型'})"/>
              <v-axis v-bind="axisOption({dataKey:'数量'})"/>
              <v-legend v-bind="legendOption()"/>
              <v-stack-bar position="操作类型*数量"
                :color="['name', colorOption(2)]"
              />
            </v-chart>
          </el-tab-pane>
          <el-tab-pane label="用户名" name="user">
            <!-- 标签头下的操作提示 -->
            <span slot="label">用户名
              <!-- <jee-icon
              iconClass="caozuoshuoming1"
              @click="tabsHeaders[3].showAlert = !tabsHeaders[3].showAlert"
            /> -->
            </span>
            <el-collapse-transition>
              <div v-show="tabsHeaders[3].showAlert">
                <el-alert
                  :title="$t(tabsHeaders[3].content)"
                  type="warning"
                  show-icon
                  @close="tabsHeaders[3].showAlert = false"
                ></el-alert>
              </div>
            </el-collapse-transition>

              <search-header
      class="search-header"
              v-bind="userHeader"
              :params="userParams"
              @handleSearch="handleSearchUser"
            ></search-header>
            <v-chart v-bind="chartOption()" :data="userData">
              <v-tooltip />
              <v-axis v-bind="axisOption({dataKey:'type'})"/>
              <v-axis v-bind="axisOption({dataKey:'日志条数'})"/>
              <v-legend v-bind="legendOption()"/>
              <v-stack-bar position="type*日志条数"
                :color="colorOption(0)"
              />
            </v-chart>
          </el-tab-pane>
        </el-tabs>
      </el-main>
  </section>
</template>

<script>
import searchHeader from '@/components/mixins/searchHeader'
import { mapGetters } from 'vuex'
const DataSet = require('@antv/data-set')
export default {
  name: 'logStatistics',
  mixins: [searchHeader],
  data () {
    return {
      tabsHeaders: [
        {
          // content: '操作结果说明',
          showAlert: false
        },
        {
          // content: '事件类型说明',
          showAlert: false
        },
        {
          // content: '操作类型说明',
          showAlert: false
        },
        {
          // content: '用户名说明',
          showAlert: false
        }
      ],
      activeTab: 'result',
      resultData: [],
      incidentData: [],
      operateData: [],
      userData: [],
      resultParams: {
        cycle: 0
      },
      incidentParams: {
        cycle: 0
      },
      operateParams: {
        cycle: 0
      },
      userParams: {
        isToday: true
      }
    }
  },
  computed: {
    ...mapGetters('app', ['chartOption', 'axisOption', 'legendOption', 'colorOption']),
    scale1 () {
      var margin = 1 / this.resultData.length
      return [{
        dataKey: '时间',
        range: [margin, 1 - margin]
      }]
    },
    scale2 () {
      var margin = 1 / this.incidentData.length
      return [{
        dataKey: '时间',
        range: [margin, 1 - margin]
      }]
    },
    scale3 () {
      var margin = 1 / this.operateData.length
      return [{
        dataKey: '操作类型',
        range: [margin, 1 - margin]
      }]
    },
    incidentHeader () {
      return {
        searchItems: [
          {
            type: 'cutButton',
            value: 'cycle',
            label: '时间',
            options: [
              {
                label: '小时统计',
                value: 0
              },
              {
                label: '天统计',
                value: 1
              },
              {
                label: '月统计',
                value: 2
              },
              {
                label: '年统计',
                value: 3
              }
            ]
          },
          {
            type: 'timePicker',
            value: 'time',
            label: '选择时间',
            disabled: this.incidentParams.cycle === 0
          }
        ]
      }
    },
    operateHeader () {
      return {
        searchItems: [
          {
            type: 'cutButton',
            value: 'cycle',
            label: '时间',
            options: [
              {
                label: '小时统计',
                value: 0
              },
              {
                label: '天统计',
                value: 1
              },
              {
                label: '月统计',
                value: 2
              },
              {
                label: '年统计',
                value: 3
              }
            ]
          },
          {
            type: 'timePicker',
            value: 'time',
            label: '选择时间',
            disabled: this.operateParams.cycle === 0
          }
        ]
      }
    },
    userHeader () {
      return {
        searchItems: [
          {
            type: 'cutButton',
            value: 'isToday',
            label: '时间',
            options: [
              {
                label: '今日统计',
                value: true
              },
              {
                label: '历史统计',
                value: false
              }
            ]
          },
          {
            type: 'timePicker',
            value: 'time',
            label: '选择时间',
            disabled: this.userParams.isToday
          }
        ]
      }
    },
    resultHeader () {
      return {
        searchItems: [
          {
            type: 'cutButton',
            value: 'cycle',
            label: '时间',
            options: [
              {
                label: '小时统计',
                value: 0
              },
              {
                label: '天统计',
                value: 1
              },
              {
                label: '月统计',
                value: 2
              },
              {
                label: '年统计',
                value: 3
              }
            ]
          },
          {
            type: 'dataPicker',
            value: 'time',
            label: '选择时间',
            disabled: this.resultParams.cycle === 0
          }
        ]
      }
    }
  },
  methods: {
    handleClickTab () {
      if (this.activeTab === 'result') {
        this.handleSearchResult()
      } else if (this.activeTab === 'incident') {
        this.handleSearchIncident()
      } else if (this.activeTab === 'operate') {
        this.handleSearchOperate()
      } else if (this.activeTab === 'user') {
        this.handleSearchUser()
      }
    },
    // 操作结果搜索
    handleSearchResult () {
      var params = this.resultParams
      if (params.time) {
        params.startTime = params.time[0]
        params.endTime = params.time[1]
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      this.fetchLogStatisticsResult(params)
    },
    // 事件类型搜索
    handleSearchIncident () {
      var params = this.incidentParams
      if (params.time) {
        params.startTime = params.time[0]
        params.endTime = params.time[1]
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      this.fetchLogStatisticsEventType(params)
    },
    // 操作类型搜索
    handleSearchOperate () {
      var params = this.operateParams
      if (params.time) {
        params.startTime = params.time[0]
        params.endTime = params.time[1]
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      this.fetchLogStatisticsOperationType(params)
    },
    // 用户名 搜索
    handleSearchUser () {
      var params = this.userParams
      if (params.time) {
        params.startTime = params.time[0]
        params.endTime = params.time[1]
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      this.fetchLogStatisticsUsername(params)
    },
    // 接口访问
    // 操作结果
    fetchLogStatisticsResult (data) {
      this.$request.fetchLogStatisticsResult(data).then(res => {
        if (res.code === 200) {
          const sourceData = res.data.data
          const fieldsData = res.data.fields
          const dv = new DataSet.View().source(sourceData)
          dv.transform({
            type: 'fold',
            fields: fieldsData,
            key: '时间',
            value: '数量'
          })
          this.resultData = dv.rows
        }
      })
    },
    // 事件类型
    fetchLogStatisticsEventType (data) {
      this.$request.fetchLogStatisticsEventType(data).then(res => {
        if (res.code === 200) {
          const sourceData = res.data.data
          const fieldsData = res.data.fields
          const dv = new DataSet.View().source(sourceData)
          dv.transform({
            type: 'fold',
            fields: fieldsData,
            key: '时间',
            value: '数量'
          })
          this.incidentData = dv.rows
        }
      })
    },
    // 操作类型
    fetchLogStatisticsOperationType (data) {
      this.$request.fetchLogStatisticsOperationType(data).then(res => {
        if (res.code === 200) {
          let sourceData = res.data.data
          let fieldsData = res.data.fields
          let dv = new DataSet.View().source(sourceData)
          dv.transform({
            type: 'fold',
            fields: fieldsData,
            key: '操作类型',
            value: '数量'
          })
          this.operateData = dv.rows
          // console.log(this.operateData)
        }
      })
    },
    // 用户名
    fetchLogStatisticsUsername (data) {
      this.$request.fetchLogStatisticsUsername(data).then(res => {
        if (res.code === 200) {
          this.userData = res.data
        }
      })
    }
  },
  mounted () {
    this.handleClickTab()
  }
}
</script>
<style lang="scss" scoped>
  .log-statis-index-container{
    .log-statis-incident-container{
      margin-top: 15px;
    }
    .log-statis-operate-container{
      margin-top: 15px;
    }
    .log-statis-result-container{
      margin-top: 15px;
    }
    .log-statis-user-container{
      margin-top: 15px;
    }
    .base-header-container{
      margin-top: 10px;
    }
    .search-header{
      margin-bottom: 35px;
      margin-top: 10px;
    }
  }
</style>
