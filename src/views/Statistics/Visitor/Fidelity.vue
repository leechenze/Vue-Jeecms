<template>
  <section class="statistics-visitor-fidelity-container">
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
      <el-tabs v-model="activeTab"  @tab-click="handleClickTab" class="forbid-tabs">
          <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
        <div class="header-top">
          <div class="header-box">
            <p>访问次数<jee-popover popoverText="访客访问您网站的次数，一个访客可以多次访问网站，一次访问可能会浏览多个页面。"/></p>
            <div class="header-val">{{sum}}<div></div></div>
          </div>
          <div class="header-box">
            <p>所占比例<jee-popover popoverText="所占比例。"/></p>
            <div class="header-val">100%<div></div></div>
          </div>
        </div>
        <div style="padding-top:30px;">
          <v-chart v-bind="chartOption()" :height="height" :data="data">
            <v-tooltip/>
            <v-axis v-bind="axisOption({dataKey:'type'})"/>
            <v-axis v-bind="axisOption({dataKey:'value'})"/>
            <v-bar position="type*value"
              :color="['value', [colorOption(0)[0]]]"
            />
          </v-chart>
        </div>
    </section>
    <base-table v-bind="websiteList"
      :columns="columns"
      @sortChange="handleSortChange"
    ></base-table>
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
import { getTime, getData, getNumThousands, accAdd } from '@/utils'

export default {
  name: 'statisticsVisitorFidelity',
  mixins: [baseHeader, searchHeader, baseTable],
  data () {
    return {
      headers: {
        buttons: [],
        title: '操作说明',
        showAlertIcon: true,
        content: '访客对您网站的访问页数、访问深度、以及访问时长情况。助您了解访客对您网站的粘度，尤其在对网站内容改进后，可以通过此报告了解网站吸引力是否有所提升。'
      },
      siteId: null,
      params: {
        senior: false,
        time2: 1,
        time: [],
        areaIds: [''],
        area: '',
        orderType: 1,
        order: false,
        startTime: null,
        endTime: null,
        sourceTypeIds: [''],
        sourceType: '',
        visitor: ''
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
            label: '选择时间：',
            value: 'time'
          },
          {
            type: 'cascader',
            value: 'sourceTypeIds',
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
            type: 'cutButton',
            value: 'visitor',
            label: '访客:',
            options: [
              {
                label: '全部 ',
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
      activeTab: 'number',
      data: [
      ],
      height: 410,
      websiteList: {
        tableProps: {
          showSummary: true,
          sumText: '当前列表汇总',
          summaryMethod: this.getSummaries,
          defaultSort: {
            prop: 'value',
            order: 'descending'
          }
        },
        showIndex: true,
        showSelection: false,
        showPagination: false
      },
      sum: null,
      tabs: [
        {
          label: '访问页数',
          name: 'number'
        },
        {
          label: '访问深度',
          name: 'depth'
        },
        {
          label: '访问时长',
          name: 'duration'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['ownSiteOptions', 'currentSiteId', 'areaOptions']),
    ...mapGetters('app', ['chartOption', 'axisOption', 'legendOption', 'colorOption']),
    columns () {
      const label = this.tabs.find(d => d.name === this.activeTab).label
      return [
        {
          label,
          prop: 'type'
        },
        {
          label: '访问次数',
          prop: 'value',
          sortable: 'custom',
          formatter: (row, column, cellValue, index) => getNumThousands(cellValue)
        },
        {
          label: '所占比例',
          prop: 'decimal',
          width: '110px',
          sortable: 'custom',
          formatter: (row, column, cellValue, index) => cellValue + '%'
        }
      ]
    },
    getParams () {
      let { areaIds, sourceTypeIds, time, senior, ...params } = this.params
      if (areaIds instanceof Array && areaIds.length) {
        params.area = areaIds[areaIds.length - 1]
      } else {
        params.area = ''
      }
      if (sourceTypeIds instanceof Array && sourceTypeIds.length) {
        params.sourceType = sourceTypeIds[sourceTypeIds.length - 1]
      } else {
        params.sourceType = ''
      }
      params.siteId = this.siteId
      return params
    }
  },
  methods: {
    ...mapActions('config', ['FetchSitesOwnsite']),
    ...mapActions('system', ['FetchSystemAreaTree']),
    getTime,
    getData,
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
          if (column.property === 'decimal') {
            sums[index] = sums[index] + '%'
          } else if (column.property === 'value') {
            sums[index] = getNumThousands(sums[index])
          }
        } else {
          sums[index] = 'N/A'
        }
      })

      return sums
    },
    handleClickTab () {
      this.handleSearchs()
    },
    handleSearchs () {
      if (this.params.time2 !== '') {
        this.params.time = []
      }
      if (this.params.time2) {
        if (this.params.time2 === 1) {
          this.params.startTime = this.getData(0)
          this.params.endTime = this.getData(0)
        } else if (this.params.time2 === 2) {
          this.params.startTime = this.getData(1)
          this.params.endTime = this.getData(1)
        } else if (this.params.time2 === 3) {
          this.params.startTime = this.getData(6)
          this.params.endTime = this.getData(0)
        } else if (this.params.time2 === 4) {
          this.params.startTime = this.getData(29)
          this.params.endTime = this.getData(0)
        }
      } else if (this.params.time === null) {
        this.params.time2 = 1
        this.params.time = []
        this.params.startTime = this.getData(0)
        this.params.endTime = this.getData(0)
      }
      if (this.params.time.length === 2) {
        this.params.startTime = this.getNewTime(this.params.time[0])
        this.params.endTime = this.getNewTime(this.params.time[1])
      }
      if (this.params.time2 === 1) {
        if (this.activeTab === 'number') {
          this.fetchstatisticsaccessTimePage()
        } else if (this.activeTab === 'depth') {
          this.fetchstatisticsaccessTimeHigh()
        } else if (this.activeTab === 'duration') {
          this.fetchstatisticsaccessTime()
        }
      } else {
        if (this.activeTab === 'number') {
          this.fetchstatisticsaccessPageInfo()
        } else if (this.activeTab === 'depth') {
          this.fetchstatisticsaccessHighInfo()
        } else if (this.activeTab === 'duration') {
          this.fetchstatisticsaccessTimeInfo()
        }
      }
    },
    handleFocus () {
      this.params.time2 = ''
    },
    // 今日访问页数
    fetchstatisticsaccessTimePage () {
      this.$request.fetchstatisticsaccessTimePage(this.getParams).then(res => {
        if (res.code === 200) {
          this.sum = res.data.sum
          this.data = res.data.value.map(d => {
            d.title = '访问页数'
            return d
          })
          this.websiteList.data = res.data.value
        }
      })
    },
    // 访问页数
    fetchstatisticsaccessPageInfo () {
      this.$request.fetchstatisticsaccessPageInfo(this.getParams).then(res => {
        if (res.code === 200) {
          this.sum = res.data.sum
          this.data = res.data.value
          this.websiteList.data = res.data.value
        }
      })
    },
    // 今日访问深度
    fetchstatisticsaccessTimeHigh () {
      this.$request.fetchstatisticsaccessTimeHigh(this.getParams).then(res => {
        if (res.code === 200) {
          this.sum = res.data.sum
          this.data = res.data.value.map(d => {
            d.title = '访问深度'
            return d
          })
          this.websiteList.data = res.data.value
        }
      })
    },
    // 访问深度
    fetchstatisticsaccessHighInfo () {
      this.$request.fetchstatisticsaccessHighInfo(this.getParams).then(res => {
        if (res.code === 200) {
          this.sum = res.data.sum
          this.data = res.data.value
          this.websiteList.data = res.data.value
        }
      })
    },
    // 今日访问时长
    fetchstatisticsaccessTime () {
      this.$request.fetchstatisticsaccessTime(this.getParams).then(res => {
        if (res.code === 200) {
          this.sum = res.data.sum
          this.data = res.data.value
          this.websiteList.data = res.data.value
        }
      })
    },
    // 访问时长
    fetchstatisticsaccessTimeInfo () {
      this.$request.fetchstatisticsaccessTimeInfo(this.getParams).then(res => {
        if (res.code === 200) {
          this.sum = res.data.sum
          this.data = res.data.value
          this.websiteList.data = res.data.value
        }
      })
    },
    // 日期转换时间戳
    getNewTime (dayNum) {
      var b = dayNum.split(/\D/)
      var date = new Date(b[0], b[1] - 1, b[2])
      var time = date.getTime()
      return time
    },
    // 远程排序
    handleSortChange (column, prop, order) {
      const sortItems = {
        value: 1,
        decimal: 2
      }
      if (sortItems[prop] && order) {
        this.params.orderType = sortItems[prop]
        this.params.order = order === 'ascending'
      } else {
        this.params.orderType = 1
        this.params.order = false
      }
      this.handleSearchs()
    }
  },
  mounted () {
    this.FetchSystemAreaTree()
    this.FetchSitesOwnsite()
    if (this.currentSiteId) {
      this.siteId = this.currentSiteId
    }
    this.searchHeaders.searchItems.find(d => d.value === 'areaIds').options = [
      {
        label: '所有',
        value: ''
      },
      ...this.areaOptions
    ]
  },
  watch: {
    currentSiteId () {
      this.siteId = this.currentSiteId
    },
    siteId () {
      this.handleSearchs()
    },
    areaOptions (newData) {
      this.searchHeaders.searchItems.find(d => d.value === 'areaIds').options = [
        {
          label: '所有',
          value: ''
        },
        ...newData
      ]
    }
  }
}
</script>

<style lang="scss">
  .statistics-visitor-fidelity-container{
    .search-header-container{
      margin-bottom: 8px;
      .el-radio-button__inner{
        min-width: 100px;
      }
    }
    .map{
      height: 603px;
      box-sizing: border-box;
      border:1px solid rgba(232,232,232,1);
      border-radius:4px;
      padding: 20px 30px;
      margin-bottom: 30px;
      .header-top{
        height: 125px;
        box-sizing: border-box;
        border-bottom: 1px solid rgba(232,232,232,1);
        display: flex;
        .header-box{
          width: 100px;
          text-align: right;
          p{
            line-height: 50px;
          }
          p:first-child{
            color: #333;
            font-size: 16px;
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
        .header-box:last-child{
          margin-left: 150px;
          .header-val{
            color: #1E84E4;
          }
        }
      }
    }
  }
</style>
