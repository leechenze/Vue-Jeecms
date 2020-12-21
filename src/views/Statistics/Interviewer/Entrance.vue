<template>
  <section class="statistics-interviewer-entrance-container">
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
      class="search-header"
      :params="params"
      v-bind="searchHeaders"
      @handleSearch="handleSearchs"
      @handleFocus='handleFocus'
    ></search-header>
    <section class="map">
      <div class="map-header">
        <div class="header-box pv-box">
          <p>浏览量(PV)<jee-popover popoverText="即通常说的Page View(PV)，用户每打开一个网站页面就被记录1次。用户多次打开同一页面，浏览量值累计。"/></p>
          <div class="header-val">{{getNumThousands(pvs)}}<div></div></div>
        </div>
        <div class="header-box uv-box">
          <p>访客数(UV)<jee-popover popoverText="一天之内您网站的独立访客数(优先以用户名为依据，匿名用户以Cookie为依据)，一天内同一访客多次访问您网站只计算1个访客。"/></p>
          <div class="header-val">{{getNumThousands(uvs)}}<div></div></div>
        </div>
        <div class="header-box ip-box">
          <p>贡献浏览量<jee-popover popoverText="该页面给站内其他页面直接带去的浏览量。"/></p>
          <div class="header-val">{{getNumThousands(pageViews)}}<div></div></div>
        </div>
        <div class="header-box jump-box">
          <p>跳出率<jee-popover popoverText="只浏览了一个页面便离开了网站的访问次数占总的访问次数的百分比。"/></p>
          <div class="header-val">{{bounce}}%<div></div></div>
        </div>
        <div class="header-box time-box">
          <p>平均访问时长<jee-popover popoverText="访客在一次访问中，平均打开网站的时长。即每次访问中，打开第一个页面到关闭最后一个页面的平均值，打开一个页面时计算打开关闭的时间差。"/></p>
          <div class="header-val">{{transverterMss(average)}}<div></div></div>
        </div>
      </div>
    </section>

      <search-header
      class="search-header"
      :params="params"
      v-bind="searchBottom"
      @handleSearch="handleSearchs"
    ></search-header>
    <base-table v-bind="list"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @sortChange="handleSortChange"
    >
      <template #url="scope">
        <a class="jee-color" :href="scope.scope.row.url" target="_blank">{{scope.scope.row.url}}</a>
      </template>
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
import { transverterMss, getTime, getNumThousands, getNewTime, accAdd } from '@/utils'
import { deepClone } from '../../../utils'
export default {
  name: 'statisticsInterviewerEntrance',
  mixins: [baseHeader, searchHeader, baseTable],
  data () {
    return {
      headers: {
        buttons: [],
        title: '操作说明',
        showAlertIcon: true,
        content: '访客对您网站各个入口页面的访问情况。重点考量浏览量、访客数、贡献浏览量、跳出率和平均访问时长；'
      },
      siteId: 1,
      params: {
        time2: 0,
        time: [],
        sortType: 1,
        url: ''
      },
      searchHeaders: {
        searchItems: [
          {
            type: 'cutButton',
            value: 'time2',
            label: '时间:',
            options: [
              {
                label: '今日 ',
                value: 0
              },
              {
                label: '昨天',
                value: 1
              },
              {
                label: '最近7天',
                value: 2
              },
              {
                label: '最近30天',
                value: 3
              }
            ]
          },
          {
            type: 'dataPicker',
            rangeText: '-',
            label: '选择时间：',
            value: 'time'
          }
        ]
      },
      searchBottom: {
        searchItems: [
          {
            type: 'searchInput',
            placeholder: '搜索URL',
            value: 'url'
          }
        ]
      },
      tendencyRadio: 0,
      list: {
        tableProps: {
          showSummary: true,
          sumText: '当前列表汇总',
          summaryMethod: this.getSummaries,
          defaultSort: {
            prop: 'pvs',
            order: 'descending'
          }
        },
        columns: [
          {
            scopeType: 'slot',
            label: '页面URL',
            prop: 'url',
            minWidth: '300px',
            showOverflowTooltip: true
          },
          {
            label: '浏览量(PV)',
            prop: 'pvs',
            sortable: 'custom'
          },
          {
            label: '访客数(UV)',
            prop: 'uvs',
            sortable: 'custom'
          },
          {
            label: '贡献浏览量',
            prop: 'pageViews',
            sortable: 'custom',
            formatter: (row, column, cellValue, index) => this.getNumThousands(cellValue)
          },
          {
            label: '跳出率',
            prop: 'bounce',
            sortable: 'custom',
            formatter: (row, column, cellValue, index) => cellValue + '%'
          },
          {
            label: '平均访问时长',
            prop: 'average',
            sortable: 'custom',
            formatter: (row, column, cellValue, index) => this.transverterMss(cellValue)
          }
        ],
        showIndex: true,
        showSelection: false
      },
      sortType: 0,
      pvs: '',
      uvs: '',
      pageViews: '',
      average: '',
      bounce: ''
    }
  },
  computed: {
    ...mapGetters(['ownSiteOptions', 'currentSiteId'])
  },
  methods: {
    ...mapActions('config', ['FetchSitesOwnsite']),
    getTime,
    getNumThousands,
    transverterMss,
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
          if (column.property === 'bounce') {
            sums[index] = sums[index] + '%'
          } else if (column.property === 'average') {
            sums[index] = this.transverterMss(sums[index])
          }
        } else {
          sums[index] = 'N/A'
        }
      })

      return sums
    },
    handleFocus () {
      this.params.time2 = ''
    },
    handleSearchs () {
      this.list.pageNo = 1
      if (this.params.time2 !== '') {
        this.params.time = []
      }
      if (this.params.time2 === 0) {
        this.params.beginTime = this.getTime(0)
        this.params.endTime = this.getTime(0)
      } else if (this.params.time2 === 1) {
        this.params.beginTime = this.getTime(1)
        this.params.endTime = this.getTime(1)
      } else if (this.params.time2 === 2) {
        this.params.beginTime = this.getTime(6)
        this.params.endTime = this.getTime(0)
      } else if (this.params.time2 === 3) {
        this.params.beginTime = this.getTime(29)
        this.params.endTime = this.getTime(0)
      }
      // 清空时间段
      if (this.params.time === null) {
        this.params.time2 = 0
        this.params.beginTime = this.getTime(0)
        this.params.endTime = this.getTime(0)
      } else if (this.params.time.length === 2) {
        this.params.beginTime = this.getNewTime(this.params.time[0])
        this.params.endTime = this.getNewTime(this.params.time[1])
      }
      this.fetchStatisticsAccessPageEntrancePage()
    },
    fetchStatisticsAccessPageEntrancePage () {
      this.params.siteId = this.siteId
      this.params.page = this.list.pageNo
      this.params.size = this.list.pageSize
      /* hyt-link */
      let param = deepClone(this.params)
      param.url = this.$encode(param.url)
      this.$request.fetchStatisticsAccessPageEntrancePage(param).then(res => {
        if (res.code === 200) {
          this.list.data = res.data.page.content
          this.list.totalCount = res.data.page.totalElements
          this.pvs = res.data.pvs
          this.average = res.data.average
          this.uvs = res.data.uvs
          this.pageViews = res.data.pageViews
          this.bounce = res.data.bounce
        }
      })
    },
    // 远程排序
    handleSortChange (column, prop, order) {
      const sortItems = {
        pvs_ascending: 0,
        pvs_descending: 1,
        uvs_ascending: 2,
        uvs_descending: 3,
        pageViews_ascending: 4,
        pageViews_descending: 5,
        bounce_ascending: 6,
        bounce_descending: 7,
        average_ascending: 8,
        average_descending: 9
      }
      const k = `${prop}_${order}`
      if (order && k in sortItems) {
        this.params.sortType = sortItems[k]
      } else {
        this.params.sortType = 1
      }
      this.handleSearchs()
    },
    handleSizeChange (val) {
      this.list.pageSize = val
      this.fetchStatisticsAccessPageEntrancePage()
    },
    handleCurrentChange (val) {
      this.list.pageNo = val
      this.fetchStatisticsAccessPageEntrancePage()
    }
  },
  mounted () {
    this.FetchSitesOwnsite()
    this.siteId = this.currentSiteId
    this.handleSearchs()
  },
  watch: {
    currentSiteId () {
      this.siteId = this.currentSiteId
      this.handleSearchs()
    },
    siteId () {
      this.handleSearchs()
    }
  }
}
</script>

<style lang="scss">
  .statistics-interviewer-entrance-container{
    .search-header-container{
      margin-top: 30px;
      margin-bottom: 8px;
      .el-radio-button__inner{
        min-width: 100px;
      }
    }
    .map{
      height: 122px;
      box-sizing: border-box;
      border:1px solid rgba(232,232,232,1);
      border-radius:4px;
      padding: 10px 30px;
      margin-bottom: 30px;
    }
    .map-header{
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
          padding-top: 20px;
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
          color: #535ACC;
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
      padding-top: 25px;
      label{
        color: #666666;
        font-size: 16px;
      }
      .el-radio__label{
        font-size: 16px;
      }
    }
  }
</style>
