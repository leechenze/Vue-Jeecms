<template>
  <section class="statistics-flow-tendency-container">
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
    <search-header
      :params="list.params"
      v-bind="searchHeaders"
      @handleSearch="handleSearch"
      @handleFocus='handleFocus'
    ></search-header>
    <section class="map">
      <div class="map-header">
        <div class="header-box pv-box">
          <p>浏览量(PV) <jee-popover popoverText="即通常说的Page View(PV)，用户每打开一个网站页面就被记录1次。用户多次打开同一页面，浏览量值累计。"/></p>
          <div class="header-val">{{total.pv}}<div></div></div>
        </div>
        <div class="header-box uv-box">
          <p>访客数(UV) <jee-popover popoverText="一天之内您网站的独立访客数(优先以用户名为依据，匿名用户以Cookie为依据)，一天内同一访客多次访问您网站只计算1个访客。"/></p>
          <div class="header-val">{{total.uv}}<div></div></div>
        </div>
        <div class="header-box ip-box">
          <p>IP数 <jee-popover popoverText="一天之内您网站的独立访问ip数。"/></p>
          <div class="header-val">{{total.ip}}<div></div></div>
        </div>
        <div class="header-box jump-box">
          <p>跳出率 <jee-popover popoverText="只浏览了一个页面便离开了网站的访问次数占总的访问次数的百分比。"/></p>
          <div class="header-val">{{total.depthNum +'%'}}<div></div></div>
        </div>
        <div class="header-box time-box">
          <p>平均访问时间 <jee-popover popoverText="访客在一次访问中，平均打开网站的时长。即每次访问中，打开第一个页面到关闭最后一个页面的平均值，打开一个页面时计算打开关闭的时间差。"/></p>
          <div class="header-val">{{total.time}}<div></div></div>
        </div>
      </div>
      <div class="select">
        <el-radio-group v-model="tendencyRadio">
          <el-radio :label="1">浏览量(PV)</el-radio>
          <el-radio :label="2">访客数(UV)</el-radio>
          <el-radio :label="3">IP数</el-radio>
          <el-radio :label="4">跳出率</el-radio>
          <el-radio :label="5">平均访问时长</el-radio>
        </el-radio-group>
      </div>
      <div class="chart">
        <v-chart v-bind="chartOption()" :height="height" :data="Data">
          <v-tooltip />
          <v-axis v-bind="axisOption({dataKey:'showTime'})"/>
          <v-axis v-bind="axisOption({dataKey:'value'})"/>
          <v-line position="showTime*value" :size="2" shape="smooth"
            :color="['type', colorOption(0)]"
          />
          <v-area position="showTime*value" shape="smooth"
            :color="['type', colorOption(0)]"
          />
        </v-chart>
      </div>

    </section>
    <base-table v-bind="list"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @sortChange="handleSortChange"
    >
    </base-table>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import {
  mapActions,
  mapGetters
} from 'vuex'
import { transverterMss, getTime, getData, getNewTime, accAdd } from '@/utils'
const DataSet = require('@antv/data-set')
export default {
  name: 'statisticsFlowTendency',
  mixins: [baseHeader, searchHeader, baseTable],
  data () {
    return {
      headers: {
        buttons: [],
        title: '操作说明',
        showAlertIcon: true,
        content: '今日零点至当前时间内访客对您网站的访问情况。助您了解今日的访客和浏览量变化趋势。'
      },
      siteId: null,
      searchHeaders: {
        searchItems: [
          {
            type: 'cutButton',
            value: 'time2',
            label: '时间:',
            options: [
              {
                label: '今日 ',
                value: 1
              },
              {
                label: '昨天',
                value: 2
              },
              {
                label: '最近7天',
                value: 3
              },
              {
                label: '最近30天',
                value: 4
              }
            ]
          },
          {
            type: 'dataPicker',
            rangeText: '-',
            value: 'time',
            pickerOptions: {
              disabledDate (time) {
                return time.getTime() > Date.now() - 8.64e6
              }
            }
          },
          {
            type: 'cutButton',
            value: 'showStyle',
            label: '显示方式:',
            hiddenKey: 'senior',
            hiddenValue: true,
            options: [
              {
                label: '按时 ',
                value: 1
              },
              {
                label: '按日',
                value: 2
              },
              {
                label: '按周',
                value: 3
              },
              {
                label: '按月',
                value: 4
              }
            ]
          },
          {
            type: 'cascader',
            value: 'sorceUrlTypeIds',
            placeholder: '选择来源网站类型',
            label: '来源：',
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '搜索引擎',
                value: 1,
                children: [
                  {
                    label: '百度搜索',
                    value: 11
                  },
                  {
                    label: '360搜索',
                    value: 12
                  },
                  {
                    label: '搜狗搜索',
                    value: 13
                  },
                  {
                    label: '中国搜索',
                    value: 14
                  },
                  {
                    label: '微软搜索',
                    value: 15
                  },
                  {
                    label: '雅虎搜索',
                    value: 16
                  },
                  {
                    label: '谷歌搜索',
                    value: 17
                  },
                  {
                    label: '其他',
                    value: 18
                  }
                ]
              },
              {
                label: '外部链接',
                value: 2
              },
              {
                label: '直接访问',
                value: 3
              }
            ],
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
            type: 'cutButton',
            value: 'accessSourceClient',
            label: '设备:',
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
                label: '全部',
                value: ''
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
            type: 'senior',
            value: 'senior'
          }
        ]
      },
      tendencyRadio: 1,
      data: [],
      Data: [],
      year: 'showTime',
      tendencyFields: [],
      height: 450,
      list: {
        params: {
          senior: false,
          order: true,
          sortTerm: 1,
          time2: 1,
          time: [],
          showStyle: 1,
          sorceUrlTypeIds: [''],
          sorceUrlType: '',
          areaIds: [''],
          area: '',
          accessSourceClient: '',
          newVisitor: ''
        },
        tableProps: {
          showSummary: true,
          sumText: '当前列表汇总',
          summaryMethod: this.getSummaries,
          defaultSort: {
            prop: 'date',
            order: 'descending'
          }
        },
        columns: [
          {
            label: '日期时间',
            prop: 'date',
            sortable: 'custom'
          },
          {
            label: '浏览量(PV)',
            prop: 'pvNum',
            sortable: 'custom'
          },
          {
            label: '访客数(UV)',
            prop: 'uvNum',
            sortable: 'custom'
          },
          {
            label: 'IP数',
            prop: 'ipNum',
            sortable: 'custom'
          },
          {
            label: '跳出率',
            prop: 'depthNum',
            sortable: 'custom',
            formatter: (row, column, cellValue, index) => cellValue + '%'
          },
          {
            label: '平均访问时长',
            prop: 'timeNum',
            sortable: 'custom',
            formatter: (row, column, cellValue, index) => transverterMss(cellValue)
          }
        ],
        showPagination: false,
        showSelection: false,
        showIndex: true,
        indexWidth: '60px',
        indexLabel: '序号'
      },
      total: {},
      sortTerm: 1,
      order: true
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
    getNewTime,
    // 统计数据
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) return
        if (index === 1) {
          sums[index] = '当前列表汇总'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return accAdd(prev, curr)
            } else {
              return prev
            }
          }, 0)
          if (column.property === 'depthNum') {
            sums[index] = sums[index] + '%'
          } else if (column.property === 'timeNum') {
            sums[index] = transverterMss(sums[index])
          }
        } else {
          sums[index] = 'N/A'
        }
      })

      return sums
    },
    handleFocus () {
      this.list.params.time2 = ''
    },
    handleSearch () {
      if (!this.siteId) return
      if (this.list.params.time2 !== '') {
        this.list.params.time = []
      }
      this.list.params.siteId = this.siteId
      if (this.list.params.time2 === 1) {
        this.list.params.time[0] = this.getData(0)
        this.list.params.time[1] = this.getData(0)
      } else if (this.list.params.time2 === 2) {
        this.list.params.time[0] = this.getData(1)
        this.list.params.time[1] = this.getData(1)
      } else if (this.list.params.time2 === 3) {
        this.list.params.time[0] = this.getData(6)
        this.list.params.time[1] = this.getData(0)
      } else if (this.list.params.time2 === 4) {
        this.list.params.time[0] = this.getData(29)
        this.list.params.time[1] = this.getData(0)
      } else if (this.list.params.time === null) {
        this.list.params.time2 = 1
        this.list.params.time = []
        this.list.params.time[0] = this.getData(0)
        this.list.params.time[1] = this.getData(0)
      }
      if (this.list.params.time.length === 2) {
        this.list.params.minTime = this.getNewTime(this.list.params.time[0])
        this.list.params.maxTime = this.getNewTime(this.list.params.time[1])
      }
      if (this.list.params.showStyle === 1) {
        this.list.showPagination = false
      } else {
        this.list.showPagination = true
      }
      this.list.pageNo = 1
      this.fetchStatisticsImage()
      this.fetchStatisticsflowPage()
    },
    fetchStatisticsImage () {
      if (this.tendencyRadio === 1) {
        this.tendencyFields[0] = 'pv'
      } else if (this.tendencyRadio === 2) {
        this.tendencyFields[0] = 'uv'
      } else if (this.tendencyRadio === 3) {
        this.tendencyFields[0] = 'ip'
      } else if (this.tendencyRadio === 4) {
        this.tendencyFields[0] = 'depthNum'
      } else if (this.tendencyRadio === 5) {
        this.tendencyFields[0] = 'time'
      }
      this.list.params.showType = this.tendencyRadio
      this.$request.fetchStatisticsImage(this.list.params).then(res => {
        if (res.code === 200) {
          this.data = res.data.array
          this.getTendencyData()
          this.total = res.data.total
          this.total.time = transverterMss(res.data.total.time)
        }
      })
    },
    getTendencyData () {
      let sourceData = this.data
      let dv = new DataSet.View().source(sourceData)
      dv.transform({
        type: 'fold',
        fields: this.tendencyFields,
        key: 'type',
        value: 'value'
      })
      this.Data = dv.rows
    },
    fetchStatisticsflowPage () {
      let { areaIds, sorceUrlTypeIds, senior, time, time2, ...params } = this.list.params
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
      params.page = this.list.pageNo
      params.size = this.list.pageSize
      this.$request.fetchStatisticsflowPage(params).then(res => {
        if (res.code === 200) {
          this.list.data = res.data.vos.content
          this.list.totalCount = res.data.vos.totalElements
        }
      })
    },
    // 比较两个时间之间的天数
    compare (start, end) {
      start = start.split(/\D/)
      start = new Date(start[0], start[1] - 1, start[2])
      start = start.getTime()
      end = end.split(/\D/)
      end = new Date(end[0], end[1] - 1, end[2])
      end = end.getTime()
      var time = 0
      if (start > end) {
        time = start - end
      } else {
        time = end - start
      }
      return Math.floor(time / 86400000)
    },
    // 远程排序
    handleSortChange (column, prop, order) {
      const sortItems = {
        date: 1,
        pvNum: 2,
        uvNum: 3,
        ipNum: 4,
        depthNum: 5,
        timeNum: 6
      }
      if (sortItems[prop] && order) {
        this.list.params.sortTerm = sortItems[prop]
        this.list.params.order = order === 'ascending'
      } else {
        this.list.params.sortTerm = 2
        this.list.params.order = true
      }
      this.handleSearch()
    },
    handleSizeChange (val) {
      this.list.pageSize = val
      this.fetchStatisticsflowPage()
    },
    handleCurrentChange (val) {
      this.list.pageNo = val
      this.fetchStatisticsflowPage()
    }
  },
  mounted () {
    this.FetchSitesOwnsite()
    this.FetchSystemAreaTree()
    this.siteId = this.currentSiteId
    this.handleSearch()
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
    tendencyRadio () {
      this.fetchStatisticsImage()
    },
    siteId () {
      this.handleSearch()
    }
  }
}
</script>

<style lang="scss">
  .statistics-flow-tendency-container{
    .jee-popover{
        margin-right: -20px;
      }
    .search-header-container{
      margin-bottom: 8px;
      .el-radio-button__inner{
        min-width: 100px;
      }
    }
    .map{
      height: 600px;
      border:1px solid rgba(232,232,232,1);
      border-radius:4px;
      box-sizing: border-box;
      padding: 30px;
      margin-bottom: 30px;
      .map-header{
        height: 91px;
        border-bottom: 1px solid rgba(232,232,232,1);
        box-sizing: border-box;
        display:flex;
        .header-box{
          width: 100px;
          text-align: right;
          margin-left: 120px;
          p:first-child{
            color: #333333;
            font-size: 16px;
            margin-bottom: 27px;
            display: flex;
            justify-content: flex-end;
            position: relative;
            .jee-popover{
              position: absolute;
              right: -18px;
              margin-right: -20px;
            }
          }
          .header-val{
            color: #DF2F4D;
            font-size: 24px;
            position: relative;
            div{
              position: absolute;
              top: 4px;
              right: -36px;
              width: 1px;
              height: 20px;
              border-right: 1px dashed #e8e8e8;
            }
          }
        }
        .header-box:first-child{
          margin-left: 0;
        }
        .pv-box{
          .header-val{
            color:#DF2F4D;
          }
        }
        .uv-box{
          .header-val{
            color:#1E84E4;
          }
        }
        .ip-box{
          .header-val{
            color: #E7B40E;
          }
        }
        .jump-box{
          .header-val{
            color: #1EBBBA;
          }
        }
        .time-box{
          .header-val{
            color: #38C060;
          }
        }
      }
      .select{
        margin-top: 30px;
        margin-bottom: 20px;
        .el-radio__label{
          font-size: 16px;
        }
      }
      .chart{
        width: 100%;
        overflow: hidden;
      }
    }

  }
</style>
