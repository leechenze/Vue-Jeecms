<template>
  <section class="statistics-visitor-network-container">
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
      <div>
        <v-chart v-bind="chartOption()" :height="height" :data="data" :scale="scale">
          <v-tooltip/>
          <v-axis v-bind="axisOption({dataKey:'type'})"/>
          <v-axis v-bind="axisOption({dataKey:'value'})"/>
          <v-bar position="type*value"
            :color="[colorOption(0)[0]]"
          />
        </v-chart>
      </div>

    </section>
    <base-table v-bind="list"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      ref='mapTable'
      class="map-table"
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
import {
  mapActions,
  mapGetters
} from 'vuex'
import { getTime, getData, getNewTime, transverterMss, accAdd } from '@/utils'
export default {
  name: 'statisticsVisitorNetwork',
  mixins: [baseHeader, searchHeader, baseTable],
  data () {
    return {
      headers: {
        buttons: [],
        title: '操作说明',
        showAlertIcon: true,
        content: '访客所使用的网络设备情况。可作为网站设计的参考，从而有效提升访客的网站交互体验。'
      },
      siteId: null,
      params: {
        time2: 1,
        time: [],
        orderType: 1,
        order: false
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
          }
        ]
      },
      typePvs: null,
      typeUvs: null,
      typeIps: null,
      typeBounce: null,
      typeAverage: null,
      list: {
        rowKey: 'name',
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
            label: '网络设备类型',
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
        showSelection: false,
        showPagination: false
      },
      data: [
      ],
      scale: [{
        dataKey: 'sales',
        tickInterval: 20
      }],
      height: 400,
      tendencyRadio: 0
    }
  },
  computed: {
    ...mapGetters('app', ['chartOption', 'axisOption', 'legendOption', 'colorOption']),
    ...mapGetters(['ownSiteOptions', 'currentSiteId'])
  },
  methods: {
    ...mapActions('config', ['FetchSitesOwnsite']),
    getTime,
    getData,
    getNewTime,
    toggleRowExpansion (row) {
      row.expand = !row.expand
      this.$refs.mapTable.$refs.baseTable.toggleRowExpansion(row)
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
        this.params.order = false
      }
      this.handleSearchs()
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
        this.fetchStatisticsdeviceTime()
      } else {
        this.fetchStatisticsdeviceDevices()
      }
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
        this.fetchStatisticsdeviceTimedevice()
        this.fetchStatisticsdeviceTime()
      } else {
        this.fetchStatisticsdeviceDevice()
        this.fetchStatisticsdeviceDevices()
      }
    },
    handleFocus () {
      this.params.time2 = ''
    },
    // 今日图表
    fetchStatisticsdeviceTimedevice () {
      this.params.siteId = this.siteId
      this.$request.fetchStatisticsdeviceTimedevice(this.params).then(res => {
        if (res.code === 200) {
          this.typePvs = res.data.pv
          this.typeUvs = res.data.uv
          this.typeIps = res.data.ips
          this.typeBounce = res.data.jump + '%'
          this.typeAverage = transverterMss(res.data.visitTime)
          if (this.tendencyRadio === 0) {
            this.data = res.data.pvList
          } else if (this.tendencyRadio === 1) {
            this.data = res.data.uvList
          } else if (this.tendencyRadio === 2) {
            this.data = res.data.ipsList
          }
        }
      })
    },
    // 日常图表
    fetchStatisticsdeviceDevice () {
      this.params.siteId = this.siteId
      this.$request.fetchStatisticsdeviceDevice(this.params).then(res => {
        if (res.code === 200) {
          this.typePvs = res.data.pv
          this.typeUvs = res.data.uv
          this.typeIps = res.data.ips
          this.typeBounce = res.data.jump + '%'
          this.typeAverage = transverterMss(res.data.visitTime)
          if (this.tendencyRadio === 0) {
            this.data = res.data.pvList
          } else if (this.tendencyRadio === 1) {
            this.data = res.data.uvList
          } else if (this.tendencyRadio === 2) {
            this.data = res.data.ipsList
          }
        }
      })
    },
    // 今日列表
    fetchStatisticsdeviceTime () {
      this.params.siteId = this.siteId
      this.$request.fetchStatisticsdeviceTime(this.params).then(res => {
        if (res.code === 200) {
          this.list.data = res.data.list.map(d => {
            if (d.deviceList instanceof Array && d.deviceList.length) {
              d.children = d.deviceList
              d.hasChild = true
              d.expand = false
            }
            return d
          })
        }
      })
    },
    // 日常列表
    fetchStatisticsdeviceDevices () {
      this.params.siteId = this.siteId
      this.$request.fetchStatisticsdeviceDevices(this.params).then(res => {
        if (res.code === 200) {
          this.list.data = res.data.list.map(d => {
            if (d.deviceList instanceof Array && d.deviceList.length) {
              d.children = d.deviceList
              d.hasChild = true
              d.expand = false
            }
            return d
          })
        }
      })
    }
  },
  mounted () {
    this.FetchSitesOwnsite()
    if (this.currentSiteId) {
      this.siteId = this.currentSiteId
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
  .statistics-visitor-network-container{
    .search-header-container{
      margin-bottom: 8px;
      .el-radio-button__inner{
        min-width: 100px;
      }
    }
    .map{
      height: 572px;
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
      margin-bottom: 20px;
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
      .el-table__placeholder,
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
