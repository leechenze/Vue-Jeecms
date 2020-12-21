<template>
  <section class="statistics-source-link-container">
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
      <el-main>
        <el-tabs v-model="activeTab"  @tab-click="handleClickTab" class="forbid-tabs">
          <el-tab-pane label="域名" name="type">
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
              <el-radio-group v-model="typeSortType">
                <el-radio :label="1">浏览量(PV)</el-radio>
                <el-radio :label="2">访客数(UV)</el-radio>
                <el-radio :label="3">IP数</el-radio>
              </el-radio-group>
            </div>
            <div style="display: flex">
              <div style="width:26%;padding-top: 40px;">
                <v-chart :forceFit="true" :height="cakeheight" :data="typeCakeData" :scale="cakescale">
                  <v-tooltip :showTitle="false" dataKey="item*percent" />
                  <v-axis />
                  <v-legend dataKey="item" />
                  <v-pie position="percent" :label="cakelabelConfig" :select="true"
                    :color="['item', ['#ED4A66', '#6BB4FA', '#11B14A', '#FAD551', '#9965E3', '#525ACE', '#425288']]"
                  />
                  <v-coord type="theta" :radius="1" :innerRadius="0.8" />
                </v-chart>
              </div>
              <div style="width:72%;margin-left:2%;padding-top: 40px;">
                <v-chart :forceFit="true" :height="tendencyHeight" :data="typeData">
                  <v-tooltip />
                  <v-axis v-bind="axisOption({dataKey:'time'})"/>
                  <v-axis v-bind="axisOption({dataKey:'temperature'})"/>
                  <v-legend />
                  <v-smooth-line
                    position="time*temperature"
                    :color="['city', ['#EA4C68', '#2E95F8', '#11B14A']]"
                    shape="smooth"
                  />
                </v-chart>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="URL" name="website">
            <div class="map-header">
              <div class="header-box pv-box">
                <p>浏览量(PV)<jee-popover popoverText="即通常说的Page View(PV)，用户每打开一个网站页面就被记录1次。用户多次打开同一页面，浏览量值累计。"/></p>
                <p>{{websitePvs}}</p>
              </div>
              <div class="header-box uv-box">
                <p>访客数(UV)<jee-popover popoverText="一天之内您网站的独立访客数(优先以用户名为依据，匿名用户以Cookie为依据)，一天内同一访客多次访问您网站只计算1个访客。"/></p>
                <p>{{websiteUvs}}</p>
              </div>
              <div class="header-box ip-box">
                <p>IP数<jee-popover popoverText="一天之内您网站的独立访问ip数。"/></p>
                <p>{{websiteIps}}</p>
              </div>
              <div class="header-box jump-box">
                <p>跳出率<jee-popover popoverText="只浏览了一个页面便离开了网站的访问次数占总的访问次数的百分比。"/></p>
                <p>{{websiteBounce}}</p>
              </div>
              <div class="header-box time-box">
                <p>平均访问时间<jee-popover popoverText="访客在一次访问中，平均打开网站的时长。即每次访问中，打开第一个页面到关闭最后一个页面的平均值，打开一个页面时计算打开关闭的时间差。"/></p>
                <p>{{websiteAverage}}</p>
              </div>
            </div>
            <div class="select">
              <label>显示指标：</label>
              <el-radio-group v-model="websiteSortType">
                <el-radio :label="1">浏览量(PV)</el-radio>
                <el-radio :label="2">访客数(UV)</el-radio>
                <el-radio :label="3">IP数</el-radio>
              </el-radio-group>
            </div>
            <div style="display: flex">
              <div style="width:26%;padding-top: 40px;">
                <v-chart :forceFit="true" :height="cakeheight" :data="websiteCakeData" :scale="cakescale">
                  <v-tooltip :showTitle="false" dataKey="item*percent" />
                  <v-axis />
                  <v-legend dataKey="item" />
                  <v-pie position="percent" :label="cakelabelConfig" :select="true"
                    :color="['item', ['#ED4A66', '#6BB4FA', '#11B14A', '#FAD551', '#9965E3', '#525ACE', '#425288']]"
                  />
                  <v-coord type="theta" :radius="1" :innerRadius="0.8" />
                </v-chart>
              </div>
              <div style="width:72%;margin-left:2%;padding-top: 40px;">
                <v-chart :forceFit="true" :height="tendencyHeight" :data="websiteData">
                  <v-tooltip />
                  <v-axis v-bind="axisOption({dataKey:'time'})"/>
                  <v-axis v-bind="axisOption({dataKey:'temperature'})"/>
                  <v-legend />
                  <v-smooth-line
                    position="time*temperature"
                    :color="['city', ['#EA4C68', '#2E95F8', '#11B14A']]"
                    shape="smooth"
                  />
                </v-chart>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-main>
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
      <template #name="scope">
        <a class="jee-color"
          v-if="scope.scope.row.name.startsWith('http')"
        :href="scope.scope.row.name" target="_blank">{{scope.scope.row.name}}</a>
        <span v-else>{{scope.scope.row.name}}</span>
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
import { transverterMss, getTime, getData, getNewTime, accAdd } from '@/utils'
const DataSet = require('@antv/data-set')
export default {
  name: 'statisticsSourceLink',
  mixins: [baseHeader, searchHeader, baseTable],
  data () {
    return {
      headers: {
        buttons: [],
        title: '操作说明',
        showAlertIcon: true,
        content: '各类非搜索引擎网站给您网站带来的流量情况。助您了解哪些非搜索引擎类网站给您网站带来了更多有效访客，可依此页面转化目标数据进行外部推广渠道的选择优化。'
      },
      siteId: 1,
      params: {
        senior: false,
        time2: 1,
        accessSourceClient: '',
        newVisitor: '',
        time: [],
        domain: '',
        sortType: 1
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
      searchBottom: {
        searchItems: [
          {
            type: 'searchInput',
            placeholder: '搜索域名',
            value: 'domain'
          }
        ]
      },
      activeTab: 'type',
      typeSortType: 1,
      websiteSortType: 1,
      typeCakeData: '',
      websiteCakeData: '',
      typeData: [],
      websiteData: [],
      typePvs: null,
      typeUvs: null,
      typeIps: null,
      typeBounce: null,
      typeAverage: null,
      typePie: [],
      typeTable: [],
      typeFields: [],
      websitePvs: null,
      websiteUvs: null,
      websiteIps: null,
      websiteBounce: null,
      websiteAverage: null,
      websitePie: [],
      websiteTable: [],
      websiteFields: [],
      cakescale: [{
        dataKey: 'percent',
        min: 0,
        formatter: '.0%'
      }],
      cakeheight: 290,
      cakepieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      cakelabelConfig: ['percent', {
        formatter: (val, item) => {
          return item.point.item + ': ' + val
        },
        textStyle: {
          fill: '#333333',
          fontSize: 14,
          fontWeight: 100
        }
      }],
      tendencyHeight: 290,
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
            label: '外部链接',
            prop: 'name'
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
            label: 'IP数',
            prop: 'ips',
            sortable: 'custom'
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
            formatter: (row, column, cellValue, index) => transverterMss(cellValue)
          }
        ],
        showIndex: true,
        showSelection: false
      }
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
          this.params.beginTime = this.getData(0)
          this.params.endTime = this.getData(0)
        } else if (this.params.time2 === 2) {
          this.params.beginTime = this.getData(1)
          this.params.endTime = this.getData(1)
        } else if (this.params.time2 === 3) {
          this.params.beginTime = this.getData(6)
          this.params.endTime = this.getData(0)
        } else if (this.params.time2 === 4) {
          this.params.beginTime = this.getData(29)
          this.params.endTime = this.getData(0)
        }
      } else if (this.params.time === null) {
        this.params.time2 = 1
        this.params.time = []
        this.params.beginTime = this.getData(0)
        this.params.endTime = this.getData(0)
      }
      if (this.params.time.length === 2) {
        this.params.beginTime = this.params.time[0]
        this.params.endTime = this.params.time[1]
      }
      if (this.activeTab === 'type') {
        this.fetchStatisticsSourceDomain()
        this.fetchStatisticsSourceDomainPage()
      } else {
        this.fetchStatisticsSourceUrl()
        this.fetchStatisticsSourceUrlOuterPage()
      }
    },
    handleFocus () {
      this.params.time2 = ''
    },
    handleClickTab () {
      this.handleSearchs()
    },
    // 域名
    fetchStatisticsSourceDomain () {
      this.params.siteId = this.siteId
      const params = {
        ...this.params,
        sortType: this.typeSortType
      }
      this.$request.fetchStatisticsSourceDomain(params).then(res => {
        if (res.code === 200) {
          this.typePvs = res.data.pvs
          this.typeUvs = res.data.uvs
          this.typeIps = res.data.ips
          this.typeBounce = res.data.bounce + '%'
          this.typeAverage = transverterMss(res.data.average)
          this.typePie = res.data.pie
          this.typeTable = res.data.objects
          this.typeFields = res.data.fields
          this.getTypeCakeData()
          this.getTypeTendencyData()
        }
      })
    },
    fetchStatisticsSourceDomainPage () {
      this.params.siteId = this.siteId
      this.params.page = this.list.pageNo
      this.params.size = this.list.pageSize
      this.$request.fetchStatisticsSourceDomainPage(this.params).then(res => {
        if (res.code === 200) {
          this.list.data = res.data.content
          this.list.totalCount = res.data.totalElements
        }
      })
    },
    // url
    fetchStatisticsSourceUrl () {
      this.params.siteId = this.siteId
      const params = {
        ...this.params,
        sortType: this.websiteSortType
      }
      this.$request.fetchStatisticsSourceUrl(params).then(res => {
        if (res.code === 200) {
          this.websitePvs = res.data.pvs
          this.websiteUvs = res.data.uvs
          this.websiteIps = res.data.ips
          this.websiteBounce = res.data.bounce + '%'
          this.websiteAverage = transverterMss(res.data.average)
          this.websitePie = res.data.pie
          this.websiteTable = res.data.objects
          this.websiteFields = res.data.fields
          this.getWebsiteCakeData()
          this.getWebsiteTendencyData()
        }
      })
    },
    fetchStatisticsSourceUrlOuterPage () {
      this.params.siteId = this.siteId

      this.$request.fetchStatisticsSourceUrlOuterPage(this.params).then(res => {
        if (res.code === 200) {
          this.list.data = res.data.content
          this.list.totalCount = res.data.totalElements
        }
      })
    },
    // 域名饼
    getTypeCakeData () {
      let array = []
      if (this.typeSortType === 1) {
        for (var i = 0; i < this.typePie.length; i++) {
          let obj = {}
          obj.item = this.typePie[i].name
          obj.count = this.typePie[i].pv
          array.push(obj)
        }
      } else if (this.typeSortType === 2) {
        for (var j = 0; j < this.typePie.length; j++) {
          let obj = {}
          obj.item = this.typePie[j].name
          obj.count = this.typePie[j].uv
          array.push(obj)
        }
      } else if (this.typeSortType === 3) {
        for (var x = 0; x < this.typePie.length; x++) {
          let obj = {}
          obj.item = this.typePie[x].name
          obj.count = this.typePie[x].ip
          array.push(obj)
        }
      }
      let dv = new DataSet.View().source(array)
      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent'
      })
      this.typeCakeData = dv.rows
    },
    // 域名曲线图
    getTypeTendencyData () {
      let dv = new DataSet.View().source(this.typeTable)
      dv.transform({
        type: 'fold',
        fields: this.typeFields,
        key: 'city',
        value: 'temperature'
      })
      this.typeData = dv.rows
    },
    // URL饼图
    getWebsiteCakeData () {
      let array = []
      if (this.websiteSortType === 1) {
        for (var i = 0; i < this.websitePie.length; i++) {
          let obj = {}
          obj.item = this.websitePie[i].name
          obj.count = this.websitePie[i].pv
          array.push(obj)
        }
      } else if (this.websiteSortType === 2) {
        for (var j = 0; j < this.websitePie.length; j++) {
          let obj = {}
          obj.item = this.websitePie[j].name
          obj.count = this.websitePie[j].uv
          array.push(obj)
        }
      } else if (this.websiteSortType === 3) {
        for (var x = 0; x < this.websitePie.length; x++) {
          let obj = {}
          obj.item = this.websitePie[x].name
          obj.count = this.websitePie[x].ip
          array.push(obj)
        }
      }
      let dv = new DataSet.View().source(array)
      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent'
      })
      this.websiteCakeData = dv.rows
    },
    // url曲线图
    getWebsiteTendencyData () {
      let dv = new DataSet.View().source(this.websiteTable)
      dv.transform({
        type: 'fold',
        fields: this.websiteFields,
        key: 'city',
        value: 'temperature'
      })
      this.websiteData = dv.rows
    },
    // 远程排序
    handleSortChange (column, prop, order) {
      const sortItems = {
        pvs_ascending: 0,
        pvs_descending: 1,
        uvs_ascending: 2,
        uvs_descending: 3,
        ips_ascending: 4,
        ips_descending: 5,
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
      if (this.activeTab === 'type') {
        this.fetchStatisticsSourceDomainPage()
      } else {
        this.fetchStatisticsSourceUrlOuterPage()
      }
    },
    handleCurrentChange (val) {
      this.list.pageNo = val
      if (this.activeTab === 'type') {
        this.fetchStatisticsSourceDomainPage()
      } else {
        this.fetchStatisticsSourceUrlOuterPage()
      }
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
    },
    typeSortType () {
      this.fetchStatisticsSourceDomain()
    },
    websiteSortType () {
      this.fetchStatisticsSourceUrl()
    }
  }
}
</script>

<style lang="scss">
  .statistics-source-link-container{
    .search-header-container{
      margin-top: 30px;
      margin-bottom: 8px;
      .el-radio-button__inner{
        min-width: 100px;
      }
    }
    .map{
      height: 581px;
      box-sizing: border-box;
      border:1px solid rgba(232,232,232,1);
      border-radius:4px;
      padding: 20px 30px 10px;
      margin-bottom: 30px;
    }
    .map-header{
        height: 125px;
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
  }
</style>
