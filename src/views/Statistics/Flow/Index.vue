<template>
  <section class="statistics-flow-index-container">
    <base-header v-bind="headers"/>
    <el-form>
      <el-form-item label='选择站点：'>
        <el-select
          popper-class="jee-border"
          style="width: 414px;"
          v-model="siteId">
          <el-option
            v-for="option in ownSiteOptions"
            :key="option.id"
            :label="option.name"
            :value="option.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <section class="onLine">
      <div class="title">
        <h3>当前在线</h3>
        <span class="red"><span style="color: #FF0000;">{{countDown}}</span>秒</span>
        <span>后更新数据</span>
      </div>
      <div style="display:flex">
        <div class="population" style="width:25%">
          <p class="t1">在线访客数</p>
          <div class="box1">
            <strong>{{number}}</strong>
            <div class="small-box">
              <v-chart :forceFit="true" :height="smallHeight" :data="tendencyDataSimple">
                <v-smooth-line position="time*temperature" shape="smooth"
                  :color="['city', colorOption(1)]"
                />
              </v-chart>
            </div>
          </div>
          <p class="t2">更新时间：{{newTime}}</p>
        </div>
        <div class="condition" style="width:75%">
          <p class="t3">最近30分钟访问情况</p>
          <v-chart v-bind="chartOption()" :height="tendencyHeight" :data="tendencyData">
            <v-tooltip :hideMarkers='true'/>
            <v-axis v-bind="axisOption({dataKey:'time'})"/>
            <v-axis v-bind="axisOption({dataKey:'temperature'})"/>
            <v-smooth-line
              position="time*temperature"
              :color="['city', colorOption(1)]"
              shape="smooth"
            />
          </v-chart>
        </div>
      </div>
    </section>
    <p class="detail"><span>访问明细</span><span>（仅提供两周内的访问明细）</span></p>

      <search-header
      class="search-header"
      :params="list.params"
      v-bind="searchHeaders"
      @handleSearch="handleSearch"
    ></search-header>
    <base-table v-bind="list"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @sortChange="handleSortChange"
    >
      <template #sourceUrl="scope">
        <a class="jee-color"
          v-if="scope.scope.row.sourceUrl.startsWith('http')"
        :href="scope.scope.row.sourceUrl" target="_blank">{{scope.scope.row.sourceUrl}}</a>
        <span v-else>{{scope.scope.row.sourceUrl}}</span>
      </template>
      <template #entranceUrl="scope">
        <a class="jee-color"
          v-if="scope.scope.row.entranceUrl.startsWith('http')"
        :href="scope.scope.row.entranceUrl" target="_blank">{{scope.scope.row.entranceUrl}}</a>
        <span v-else>{{scope.scope.row.entranceUrl}}</span>
      </template>
    </base-table>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import { transverterMss, getTime, getData, getDateByTimestamp } from '@/utils'
import {
  mapActions,
  mapGetters
} from 'vuex'
const DataSet = require('@antv/data-set')

export default {
  name: 'statisticsFlowIndex',
  mixins: [baseHeader, searchHeader, baseTable],
  data () {
    return {
      headers: {
        buttons: [],
        title: '操作说明',
        showAlertIcon: true,
        content: '提供最新访客的来源、访问轨迹、地域、客户端等详细信息。助您了解当前的访客行为，及时根据访客特征优化网站。'
      },
      siteId: null,
      tendencyData: [],
      tendencyDataSimple: [],
      smallHeight: 150,
      tendencyHeight: 350,
      searchHeaders: {
        searchItems: [
          {
            type: 'select',
            value: 'time',
            placeholder: '请选择访问时间',
            label: '访问时间：',
            options: [
              {
                label: '所有',
                value: ''
              }
            ]
          },
          {
            type: 'cutButton',
            value: 'accessSourceClient',
            label: '设备：',
            options: [
              {
                label: '全部 ',
                value: ''
              },
              {
                label: '计算机',
                value: 1
              },
              {
                label: '移动设备',
                value: 2
              }
            ]
          },
          {
            type: 'cascader',
            value: 'sorceUrlTypeIds',
            label: '来源：',
            options: this.$enums.sourceType,
            props: {
              checkStrictly: true
            },
            hiddenKey: 'senior',
            hiddenValue: true
          },
          {
            type: 'cascader',
            value: 'areaIds',
            placeholder: '请选择地域',
            label: '地域：',
            options: [
              {
                label: '所有',
                value: ''
              }
            ],
            props: {
              checkStrictly: true
            },
            hiddenKey: 'senior',
            hiddenValue: true
          },
          {
            type: 'select',
            value: 'frequency',
            label: '访问频次:',
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '1次',
                value: '1-1'
              },
              {
                label: '2次',
                value: '1-2'
              },
              {
                label: '3次',
                value: '1-3'
              },
              {
                label: '4次',
                value: '1-4'
              },
              {
                label: '5~10次',
                value: '5-10'
              },
              {
                label: '11~20次',
                value: '11-20'
              },
              {
                label: '20次以上',
                value: '20-'
              }
            ],
            hiddenKey: 'senior',
            hiddenValue: true
          },
          {
            type: 'select',
            value: 'depth',
            label: '访问深度:',
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '1页',
                value: '1-1'
              },
              {
                label: '2页',
                value: '1-2'
              },
              {
                label: '3~5页',
                value: '3-5'
              },
              {
                label: '6~10页',
                value: '6-10'
              },
              {
                label: '11~15页',
                value: '11-15'
              },
              {
                label: '16~20页',
                value: '16-20'
              },
              {
                label: '20页以上',
                value: '20-'
              }
            ],
            hiddenKey: 'senior',
            hiddenValue: true
          },
          {
            type: 'select',
            value: 'duration',
            label: '访问时长:',
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '0~30s',
                value: 1
              },
              {
                label: '31~60s',
                value: 2
              },
              {
                label: '61~90s',
                value: 3
              },
              {
                label: '91~180s',
                value: 4
              },
              {
                label: '181~300s',
                value: 5
              },
              {
                label: '301~600s',
                value: 6
              },
              {
                label: '600s以上',
                value: 7
              }
            ],
            hiddenKey: 'senior',
            hiddenValue: true
          },
          {
            type: 'cutButton',
            value: 'newVisitor',
            label: '访客:',
            options: [
              {
                label: '全部 ',
                value: null
              },
              {
                label: '新访客',
                value: true
              },
              {
                label: '老访客',
                value: false
              }
            ],
            hiddenKey: 'senior',
            hiddenValue: true
          },
          {
            type: 'cutButton',
            value: 'isLogin',
            label: '用户类型:',
            options: [
              {
                label: '全部 ',
                value: null
              },
              {
                label: '登录用户',
                value: true
              },
              {
                label: '匿名用户',
                value: false
              }
            ],
            hiddenKey: 'senior',
            hiddenValue: true
          },
          {
            type: 'input',
            value: 'entranceUrl',
            label: '入口页面：',
            placeholder: '请输入页面地址',
            hiddenKey: 'senior',
            hiddenValue: true
          },
          {
            type: 'input',
            value: 'accessIp',
            label: 'IP：',
            placeholder: '请输入IP',
            hiddenKey: 'senior',
            hiddenValue: true
          },
          {
            type: 'searchInput',
            value: 'userName',
            label: '用户名：',
            placeholder: '请输入用户名',
            hiddenKey: 'senior',
            hiddenValue: true
          },
          {
            type: 'senior',
            value: 'senior'
          }
        ]
      },
      list: {
        tableProps: {
          defaultSort: {
            prop: 'createTime',
            order: 'descending'
          }
        },
        columns: [
          {
            scopeType: 'time',
            label: '访问时间',
            prop: 'createTime',
            sortable: 'custom'
          },
          {
            label: '地域',
            prop: 'areaName'
          },
          {
            scopeType: 'slot',
            label: '来源',
            prop: 'sourceUrl'
          },
          {
            scopeType: 'slot',
            label: '入口页面',
            prop: 'entranceUrle',
            minWidth: '170px',
            showOverflowTooltip: true
          },
          {
            label: '用户名',
            prop: 'userName'
          },
          {
            label: '访问IP',
            prop: 'accessIp'
          },
          {
            label: '访问时长',
            prop: 'accessTime',
            sortable: 'custom',
            formatter: (row, column, cellValue, index) => {
              const now = new Date()
              if (!cellValue && this.getDateByTimestamp(now.getTime()) === this.getDateByTimestamp(this.list.params.time)) {
                return '正在访问'
              }
              return transverterMss(cellValue)
            }
          },
          {
            label: '访问页数',
            prop: 'accessPage',
            sortable: 'custom'
          }
        ],
        params: {
          senior: false,
          siteId: null,
          order: false,
          sortTerm: 1,
          frequency: '',
          sorceUrlTypeIds: [''],
          sorceUrlType: '',
          accessSourceClient: '',
          time: '',
          areaIds: [''],
          area: '',
          depth: '',
          duration: '',
          newVisitor: null,
          isLogin: null,
          entranceUrl: '',
          userName: '',
          accessIp: '',
          entranceUrle: ''
        },
        filterParams: ['entranceUrle'],
        showSelection: false,
        showIndex: true,
        indexWidth: '60px'
      },
      countDown: 60,
      number: 0,
      sourceData: [],
      newTime: '',
      timer: null
    }
  },
  computed: {
    ...mapGetters('app', ['chartOption', 'axisOption', 'legendOption', 'colorOption']),
    ...mapGetters(['ownSiteOptions', 'currentSiteId', 'areaOptions'])
  },
  methods: {
    ...mapActions('config', ['FetchSitesOwnsite']),
    ...mapActions('system', ['FetchSystemAreaTree']),
    getTime,
    getData,
    getDateByTimestamp,
    getTendencyData () {
      let dv = new DataSet.View().source(this.sourceData)
      dv.transform({
        type: 'fold',
        fields: ['pv', 'uv'],
        key: 'city',
        value: 'temperature'
      })
      this.tendencyData = dv.rows

      let dv2 = new DataSet.View().source(this.sourceData)
      dv2.transform({
        type: 'fold',
        fields: ['uv'],
        key: 'city',
        value: 'temperature'
      })
      this.tendencyDataSimple = dv2.rows
    },
    flowRealtime () {
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.countDown -= 1
          if (this.countDown === 0) {
            this.countDown = 60
            this.fetchStatisticsflowRealtime()
          }
        }, 1000)
      }
    },
    handleClearInterval () {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    // 获取图表数据
    fetchStatisticsflowRealtime () {
      let siteId = this.siteId
      if (!siteId) {
        return false
      }
      this.$request.fetchStatisticsflowRealtime({ siteId }).then(res => {
        if (res.code === 200) {
          this.sourceData = res.data
          this.getTendencyData()
          this.newTime = res.data[res.data.length - 1].time
        }
      })
      this.$request.fetchstatisticsflowRealtimeUvnum({ siteId }).then(res => {
        if (res.code === 200) {
          this.number = res.data
        }
      })
    },
    handleSearch () {
      this.list.pageNo = 1
      this.list.params.entranceUrl = this.$encode(this.list.params.entranceUrle)
      this.fetchStatisticsflowRealtimePage()
    },
    // 获取访问明细列表
    fetchStatisticsflowRealtimePage () {
      this.list.loading = true
      let { areaIds, sorceUrlTypeIds, senior, ...params } = this.list.params
      if (!params.siteId) return
      if (areaIds instanceof Array && areaIds.length) {
        params.area = areaIds[areaIds.length - 1]
      } else {
        params.area = ''
      }
      if (sorceUrlTypeIds instanceof Array && sorceUrlTypeIds.length) {
        params.sorceUrlType = sorceUrlTypeIds[sorceUrlTypeIds.length - 1]
      } else {
        params.sorceUrlType = ''
      }
      const frequency = params.frequency.split('-')
      if (frequency.length === 2) {
        params.minFrequency = Number(frequency[0])
        params.maxFrequency = Number(frequency[1])
      } else {
        params.minFrequency = ''
        params.maxFrequency = ''
      }
      const depth = params.depth.split('-')
      if (depth.length === 2) {
        params.minDepth = Number(depth[0])
        params.maxDepth = Number(depth[1])
      } else {
        params.minDepth = ''
        params.maxDepth = ''
      }
      params.page = this.list.pageNo
      params.size = this.list.pageSize
      this.$request.fetchStatisticsflowRealtimePage(params).then(res => {
        if (res.code === 200) {
          this.list.params.entranceUrl = this.$decode(this.list.params.entranceUrl)
          this.list.data = res.data.content
          this.list.totalCount = res.data.totalElements
        }
        this.list.loading = false
      })
    },
    getoptions () {
      for (var i = 0; i < 15; i++) {
        let obj = {}
        obj.label = this.getData(i)
        obj.value = this.getTime(i)
        this.searchHeaders.searchItems[0].options.push(obj)
      }
    },
    // 远程排序
    handleSortChange (column, prop, order) {
      const sortItems = {
        createTime: 1,
        accessTime: 2,
        accessPage: 3
      }
      if (sortItems[prop] && order) {
        this.list.params.sortTerm = sortItems[prop]
        this.list.params.order = order === 'ascending'
      } else {
        this.list.params.sortTerm = 1
        this.list.params.order = true
      }
      this.handleSearch()
    },
    handleSizeChange (val) {
      this.list.pageSize = val
      this.fetchStatisticsflowRealtimePage()
    },
    handleCurrentChange (val) {
      this.list.pageNo = val
      this.fetchStatisticsflowRealtimePage()
    }
  },
  mounted () {
    this.FetchSitesOwnsite()
    this.FetchSystemAreaTree()
    this.siteId = this.currentSiteId
    this.flowRealtime()
    this.searchHeaders.searchItems.find(d => d.value === 'areaIds').options = [
      {
        label: '所有',
        value: ''
      },
      ...this.areaOptions
    ]
  },
  watch: {
    areaOptions (newData) {
      this.searchHeaders.searchItems.find(d => d.value === 'areaIds').options = [
        {
          label: '所有',
          value: ''
        },
        ...newData
      ]
    },
    currentSiteId (newData) {
      this.siteId = newData
    },
    siteId () {
      this.list.params.siteId = this.siteId
      if (this.list.params.siteId) {
        this.getoptions()
        this.fetchStatisticsflowRealtime()
        this.fetchStatisticsflowRealtimePage()
      }
    }
  },
  activated () {
    this.flowRealtime()
  },
  deactivated () {
    this.handleClearInterval()
  },
  beforeDestroy () {
    this.handleClearInterval()
  }
}
</script>

<style lang="scss" scoped>
  .statistics-flow-index-container{
    .onLine{
      height: 450px;
      border:1px solid rgba(232,232,232,1);
      border-radius:4px;
      box-sizing: border-box;
      padding: 30px 29px;
      .title{
        display: flex;
        line-height: 18px;
        h3{
          font-size: 18px;
          color: #333333;
          margin-right: 29px;
        }
        span{
          color: #666666;
          font-size: 12px;
        }
        .red{
          color: #FF0000;
          font-size: 12px;
          letter-spacing: 2px;
        }
      }
    }
    .population{
      .t1{
        color: #000000;
        font-size: 16px;
        margin-top: 60px;
      }
      .box1{
        height: 130px;
        display: flex;
        strong{
          padding-top: 55px;
          display: inline-block;
          font-size: 42px;
          color: #333333;
        }
        .small-box{
          padding-top: 30px;
          width: 80%;
          margin-left: -20px;
        }
      }
      .t2{
        color: #999999;
        font-size: 16px;
      }
    }
    .condition{
      .t3{
        line-height: 45px;
        padding-left: 53px;
        font-size: 16px;
        color: #333333;
      }
    }
    .detail{
      margin-top: 30px;
      margin-bottom: 20px;
      span:first-child{
        color: #333333;
        font-size: 18px;
      }
      span:last-child{
        color: #999999;
        font-size: 12px;
      }
    }
  }
</style>
