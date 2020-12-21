<template>
  <section class="statistics-visitor-territory-container">
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
          <div class="header-val">{{typePvs}}<div></div></div>
        </div>
        <div class="header-box uv-box">
          <p>访客数(UV)<jee-popover popoverText="一天之内您网站的独立访客数(优先以用户名为依据，匿名用户以Cookie为依据)，一天内同一访客多次访问您网站只计算1个访客。"/></p>
          <div class="header-val">{{typeUvs}}<div></div></div>
        </div>
        <div class="header-box ip-box">
          <p>IP数<jee-popover popoverText="一天之内您网站的独立访问ip数。"/></p>
          <div class="header-val">{{typeIps}}<div></div></div>
        </div>
        <div class="header-box jump-box">
          <p>跳出率<jee-popover popoverText="只浏览了一个页面便离开了网站的访问次数占总的访问次数的百分比。"/></p>
          <div class="header-val">{{typeBounce}}<div></div></div>
        </div>
        <div class="header-box time-box">
          <p>平均访问时间<jee-popover popoverText="访客在一次访问中，平均打开网站的时长。即每次访问中，打开第一个页面到关闭最后一个页面的平均值，打开一个页面时计算打开关闭的时间差。"/></p>
          <div class="header-val">{{typeAverage}}<div></div></div>
        </div>
      </div>
      <div class="select">
        <label>显示指标：</label>
        <el-radio-group v-model="tendencyRadio">
          <el-radio :label="0">浏览量(PV)</el-radio>
          <el-radio :label="1">访客数(UV)</el-radio>
          <el-radio :label="2">IP数</el-radio>
        </el-radio-group>
      </div>
      <div style="display:flex">
        <div style='width:50%'>
          <div id="territory" style="width: 100%;height:500px;"></div>
        </div>
        <div style='width:50%;height: 500px;overflow-x: hidden;overflow-y: overlay;'>
          <base-table v-bind="typeList"></base-table>
        </div>
      </div>
    </section>
    <base-table v-bind="list"
      ref='mapTable'
      class="map-table"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @sortChange="handleSortChange"
    >
      <template #name="scope">
        <div class="handle-expand-wrap">
          <span>{{scope.scope.row.name}}</span>
          <span v-if="scope.scope.row.hasChild" class="jee-color" @click="toggleRowExpansion(scope.scope.row)">{{scope.scope.row.expand ? '收起' : '详细'}}<i :class="scope.scope.row.expand?'el-icon-caret-bottom':'el-icon-caret-top'"></i></span>
        </div>
      </template>
    </base-table>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import '@/../node_modules/echarts/map/js/china.js' // 引入中国地图数据
import {
  mapActions,
  mapGetters
} from 'vuex'
import { getTime, getData, transverterMss, accAdd } from '@/utils'
const echarts = require('echarts')
export default {
  name: 'statisticsVisitorTerritory',
  mixins: [baseHeader, searchHeader, baseTable],
  data () {
    return {
      headers: {
        buttons: [],
        title: '操作说明',
        showAlertIcon: true,
        content: '各个地域给您网站带来的访客数及流量情况。助您了解网站访问的地域分布，特定地域用户偏好可进行针对性的运营和推广。'
      },
      siteId: null,
      params: {
        senior: false,
        time2: 1,
        sourceType: '',
        visitor: '',
        time: [],
        startTime: null,
        endTime: null,
        sourceTypeIds: [''],
        orderType: 1,
        order: false
      },
      typePvs: null,
      typeUvs: null,
      typeIps: null,
      typeBounce: null,
      typeAverage: null,
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
      typeList: {
        columns: [
          {
            label: '省份',
            prop: 'type'
          },
          {
            label: '浏览量(PV)',
            prop: 'value'
          },
          {
            label: '占比',
            prop: 'decimal',
            align: 'right',
            formatter: (row, column, cellValue, index) => cellValue + '%'
          }
        ],
        showSelection: false,
        showPagination: false,
        showIndex: false
      },
      list: {
        rowKey: 'id',
        tableProps: {
          showSummary: true,
          sumText: '当前列表汇总',
          summaryMethod: this.getSummaries,
          defaultSort: {
            prop: 'pv',
            order: 'descending'
          }
        },
        columns: [
          {
            label: '地域',
            prop: 'name',
            scopeType: 'slot'
          },
          {
            label: '浏览量(PV)',
            prop: 'pv',
            sortable: 'custom'
          },
          {
            label: '访客数(UV)',
            prop: 'uv',
            sortable: 'custom'
          },
          {
            label: 'IP数',
            prop: 'ips',
            sortable: 'custom'
          },
          {
            label: '跳出率',
            prop: 'jump',
            sortable: 'custom',
            formatter: (row, column, cellValue, index) => cellValue + '%'
          },
          {
            label: '平均访问时长',
            prop: 'visitTime',
            sortable: 'custom',
            formatter: (row, column, cellValue, index) => transverterMss(cellValue)
          }
        ],
        showIndex: true,
        showSelection: false
      },
      tendencyRadio: 0,
      mapList: [],
      mapName: ''
    }
  },
  computed: {
    ...mapGetters(['ownSiteOptions', 'currentSiteId']),
    getParams () {
      let { sourceTypeIds, time, senior, ...params } = this.params
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
    getTime,
    getData,
    toggleRowExpansion (row) {
      try {
        row.expand = !row.expand
        this.$refs.mapTable.$refs.baseTable.toggleRowExpansion(row)
      } catch (error) {
        console.log(error)
      }
    },
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
          if (column.property === 'jump') {
            sums[index] = sums[index] + '%'
          } else if (column.property === 'visitTime') {
            sums[index] = transverterMss(sums[index])
          }
        } else {
          sums[index] = 'N/A'
        }
      })

      return sums
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
        this.params.time[0] = this.params.startTime
        this.params.time[1] = this.params.endTime
      } else if (this.params.time === null) {
        this.params.time2 = 1
        this.params.time = []
        this.params.startTime = this.getData(0)
        this.params.endTime = this.getData(0)
      }
      if (this.params.time && this.params.time.length === 2) {
        console.log(this.params.time)
        this.params.startTime = this.getNewTime(this.params.time[0])
        this.params.endTime = this.getNewTime(this.params.time[1])
      }
      if (this.params.time2 === 1) {
        this.fetchStatisticsvisitTimearea()
        this.fetchStatisticsvisitTimepage()
      } else {
        this.fetchStatisticsvisitArea()
        this.fetchStatisticsvisitAreapage()
      }
    },
    handleFocus () {
      this.params.time2 = ''
    },
    // 今日图表
    fetchStatisticsvisitTimearea () {
      this.$request.fetchStatisticsvisitTimearea(this.getParams).then(res => {
        if (res.code === 200) {
          this.typePvs = res.data.pv
          this.typeUvs = res.data.uv
          this.typeIps = res.data.ips
          this.typeBounce = res.data.jump + '%'
          this.typeAverage = transverterMss(res.data.visitTime)
          if (this.tendencyRadio === 0) {
            this.mapList = res.data.pvList
            this.mapName = '浏览量'
            this.typeList.data = res.data.pvList
            this.typeList.columns[1].label = '浏览量（PV）'
          } else if (this.tendencyRadio === 1) {
            this.mapList = res.data.uvList
            this.mapName = '访客数'
            this.typeList.columns[1].label = '访客数（UV）'
            this.typeList.data = res.data.uvList
          } else if (this.tendencyRadio === 2) {
            this.mapList = res.data.ipsList
            this.mapName = 'ip数'
            this.typeList.data = res.data.ipsList
            this.typeList.columns[1].label = 'IP数'
          }
          this.territory()
        }
      })
    },
    // 日常图表数据
    fetchStatisticsvisitArea () {
      this.$request.fetchStatisticsvisitArea(this.getParams).then(res => {
        if (res.code === 200) {
          this.typePvs = res.data.pv
          this.typeUvs = res.data.uv
          this.typeIps = res.data.ips
          this.typeBounce = res.data.jump + '%'
          this.typeAverage = transverterMss(res.data.visitTime)
          if (this.tendencyRadio === 0) {
            this.mapList = res.data.pvList
            this.mapName = '浏览量'
            this.typeList.data = res.data.pvList
            this.typeList.columns[1].label = '浏览量（PV）'
          } else if (this.tendencyRadio === 1) {
            this.mapList = res.data.uvList
            this.mapName = '访客数'
            this.typeList.columns[1].label = '访客数（UV）'
            this.typeList.data = res.data.uvList
          } else if (this.tendencyRadio === 2) {
            this.mapList = res.data.ipsList
            this.mapName = 'ip数'
            this.typeList.data = res.data.ipsList
            this.typeList.columns[1].label = 'IP数'
          }
          this.territory()
        }
      })
    },
    // 今日列表
    fetchStatisticsvisitTimepage () {
      let params = {
        ...this.getParams,
        page: this.list.pageNo,
        size: this.list.pageSize
      }
      this.$request.fetchStatisticsvisitTimepage(params).then(res => {
        if (res.code === 200) {
          this.list.data = res.data.page.content.map((d, idx) => {
            d.id = idx + d.name + d.ips + d.pv + d.uv
            if (d.cityList instanceof Array && d.cityList.length) {
              d.children = d.cityList.map((c, i) => {
                c.id = '' + idx + i + c.name + c.ips + c.pv + c.uv
                return c
              })
              d.hasChild = true
              d.expand = false
            }
            return d
          })
          this.list.totalCount = res.data.page.totalElements
        }
      })
    },
    // 日常列表
    fetchStatisticsvisitAreapage () {
      let params = {
        ...this.getParams,
        page: this.list.pageNo,
        size: this.list.pageSize
      }
      this.$request.fetchStatisticsvisitAreapage(params).then(res => {
        if (res.code === 200) {
          this.list.data = res.data.page.content.map((d, idx) => {
            d.id = '' + idx + d.name + d.ips + d.pv + d.uv
            if (d.cityList instanceof Array && d.cityList.length) {
              d.children = d.cityList.map((c, i) => {
                c.id = idx + i + c.name + c.ips + c.pv + c.uv
                return c
              })
              d.hasChild = true
              d.expand = false
            }
            return d
          })
          this.list.totalCount = res.data.page.totalElements
        }
      })
    },
    handleSizeChange (val) {
      this.list.pageSize = val
      if (this.params.time2 === 1) {
        this.fetchStatisticsvisitTimepage()
      } else {
        this.fetchStatisticsvisitAreapage()
      }
    },
    handleCurrentChange (val) {
      this.list.pageNo = val
      if (this.params.time2 === 1) {
        this.fetchStatisticsvisitTimepage()
      } else {
        this.fetchStatisticsvisitAreapage()
      }
    },
    territory () {
      var myChart = echarts.init(document.getElementById('territory'))
      var max = 0
      for (var i = 0; i < this.mapList.length; i++) {
        this.mapList[i].name = this.mapList[i].type
        if (this.mapList[i].value > max) {
          max = this.mapList[i].value
        }
      }
      var option = {
        title: {
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          min: 0,
          max: max,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'], // 文本，默认为数值文本
          inRange: {
            color: ['#f0ffff', '#2993fc']
          },
          calculable: true
        },
        series: [
          {
            name: this.mapName,
            type: 'map',
            map: 'china',
            mapType: 'china',
            roam: false,
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                areaColor: '#cdcdcd',
                borderColor: '#ffffff',
                borderWidth: 1
              },
              emphasis: {
                label: {
                  show: true
                }
              }
            },
            data: this.mapList
          }
        ]
      }
      myChart.setOption(option)
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
        pv: 1,
        uv: 2,
        ips: 3,
        jump: 4,
        visitTime: 5
      }
      if (sortItems[prop] && order) {
        this.params.orderType = sortItems[prop]
        this.params.order = order === 'ascending'
      } else {
        this.params.orderType = 1
        this.params.order = true
      }
      this.handleSearchs()
    }
  },
  mounted () {
    this.FetchSitesOwnsite()
    if (this.currentSiteId) {
      this.siteId = this.currentSiteId
      this.handleSearchs()
    }
  },
  watch: {
    currentSiteId () {
      this.siteId = this.currentSiteId
    },
    siteId () {
      this.handleSearchs()
    },
    tendencyRadio () {
      this.handleSearchs()
    }
  }
}
</script>

<style lang="scss">
  .statistics-visitor-territory-container{
    .search-header-container{
      margin-top: 30px;
      margin-bottom: 8px;
      .el-radio-button__inner{
        min-width: 100px;
      }
    }
    .map{
      height: 700px;
      box-sizing: border-box;
      border:1px solid rgba(232,232,232,1);
      border-radius:4px;
      padding: 10px 30px;
      margin-bottom: 30px;
    }
    .map-header{
        height: 125px;
        padding-top: 20px;
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
      padding-top: 25px;
      label{
        color: #666666;
        font-size: 16px;
      }
      .el-radio__label{
        font-size: 16px;
      }
    }
    .map-table{
      .el-table__indent,
      .el-table__expand-icon{
        display: none!important;
      }
    }
    .handle-expand-wrap{
      display: flex;
      align-items: center;
      .jee-color{
        padding-left: 30px;
        cursor: pointer;
        i{
          padding-left: 10px;
        }
      }
    }
  }
</style>
