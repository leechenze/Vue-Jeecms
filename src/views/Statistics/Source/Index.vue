<template>
  <section class="statistics-source-index-container">
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
          <el-tab-pane label="来源类型" name="type">
            <div class="map-header">
              <div class="header-box pv-box">
                <p>浏览量(PV) <jee-popover popoverText="即通常说的Page View(PV)，用户每打开一个网站页面就被记录1次。用户多次打开同一页面，浏览量值累计。"/></p>
                <div class="header-val">{{typePvs}}<div></div></div>
              </div>
              <div class="header-box uv-box">
                <p>访客数(UV) <jee-popover popoverText="一天之内您网站的独立访客数(优先以用户名为依据，匿名用户以Cookie为依据)，一天内同一访客多次访问您网站只计算1个访客。"/></p>
                <div class="header-val">{{typeUvs}}<div></div></div>
              </div>
              <div class="header-box ip-box">
                <p>IP数 <jee-popover popoverText="一天之内您网站的独立访问ip数。"/></p>
                <div class="header-val">{{typeIps}}<div></div></div>
              </div>
              <div class="header-box jump-box">
                <p>跳出率 <jee-popover popoverText="只浏览了一个页面便离开了网站的访问次数占总的访问次数的百分比。"/></p>
                <div class="header-val">{{typeBounce}}<div></div></div>
              </div>
              <div class="header-box time-box">
                <p>平均访问时间 <jee-popover popoverText="访客在一次访问中，平均打开网站的时长。即每次访问中，打开第一个页面到关闭最后一个页面的平均值，打开一个页面时计算打开关闭的时间差。"/></p>
                <div class="header-val">{{typeAverage}}<div></div></div>
              </div>
            </div>
            <div class="select">
              <label>显示指标：</label>
              <el-radio-group v-model="typeRadio">
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
                  <v-pie position="percent" :label="cakelabelConfig" :select="false"
                    :color="['item', ['#ED4A66', '#6BB4FA', '#11B14A']]"
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
          <el-tab-pane label="来源网站" name="website">
            <div class="map-header">
              <div class="header-box pv-box">
                <p>浏览量(PV) <jee-popover popoverText="即通常说的Page View(PV)，用户每打开一个网站页面就被记录1次。用户多次打开同一页面，浏览量值累计。"/></p>
                <div class="header-val">{{websitePvs}}<div></div></div>
              </div>
              <div class="header-box uv-box">
                <p>访客数(UV) <jee-popover popoverText="一天之内您网站的独立访客数(优先以用户名为依据，匿名用户以Cookie为依据)，一天内同一访客多次访问您网站只计算1个访客。"/></p>
                <div class="header-val">{{websiteUvs}}<div></div></div>
              </div>
              <div class="header-box ip-box">
                <p>IP数 <jee-popover popoverText="一天之内您网站的独立访问ip数。"/></p>
                <div class="header-val">{{websiteIps}}<div></div></div>
              </div>
              <div class="header-box jump-box">
                <p>跳出率 <jee-popover popoverText="只浏览了一个页面便离开了网站的访问次数占总的访问次数的百分比。"/></p>
                <div class="header-val">{{websiteBounce}}<div></div></div>
              </div>
              <div class="header-box time-box">
                <p>平均访问时间 <jee-popover popoverText="访客在一次访问中，平均打开网站的时长。即每次访问中，打开第一个页面到关闭最后一个页面的平均值，打开一个页面时计算打开关闭的时间差。"/></p>
                <div class="header-val">{{websiteAverage}}<div></div></div>
              </div>
            </div>
            <div class="select">
              <label>显示指标：</label>
              <el-radio-group v-model="websiteRadio">
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
                  <v-pie position="percent" :label="cakelabelConfig" :select="false"
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
    <base-table v-bind="typeList" v-if="activeTab==='type'"
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
    <base-table v-bind="websiteList" v-if="activeTab==='website'"
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
  name: 'statisticsSourceIndex',
  mixins: [baseHeader, searchHeader, baseTable],
  data () {
    return {
      headers: {
        buttons: [],
        title: '操作说明',
        showAlertIcon: true,
        content: '您网站上流量的来源分布情况，主要包括直接访问、搜索引擎和外部链接。助您了解哪些来源给您网站带来了更多有效访客，从而合理规划网络推广渠道。'
      },
      siteId: 1,
      params: {
        senior: false,
        time2: 1,
        accessSourceClient: '',
        newVisitor: '',
        time: [],
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
            label: '选择日期：',
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
      typeSortType: 0,
      websiteSortType: 0,
      activeTab: 'type',
      typeRadio: 1,
      websiteRadio: 1,
      typeCakeData: '',
      websiteCakeData: '',
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
      typeData: [],
      websiteData: [],
      tendencyHeight: 290,
      typeList: {
        rowKey: 'name',
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
            label: '来源类型',
            scopeType: 'slot',
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
        showSelection: false,
        showPagination: false

      },
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
      websiteList: {
        tableProps: {
          showSummary: true,
          sumText: '当前列表汇总',
          summaryMethod: this.getSummaries
        },
        columns: [
          {
            scopeType: 'slot',
            label: '来源网站',
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
    // 搜索列表
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
        this.params.time[0] = this.params.beginTime
        this.params.time[1] = this.params.endTime
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
        this.fetchStatisticsSourceType()
      } else {
        this.fetchStatisticsSourceSourceUrl()
        this.fetchStatisticsSourceUrlPage()
      }
    },
    handleFocus () {
      this.params.time2 = ''
    },
    handleClickTab () {
      this.handleSearchs()
    },
    // 来源类型
    fetchStatisticsSourceType () {
      const params = {
        ...this.params,
        siteId: this.siteId,
        showType: this.typeRadio
      }
      this.$request.fetchStatisticsSourceType(params).then(res => {
        if (res.code === 200) {
          this.typePvs = res.data.pvs
          this.typeUvs = res.data.uvs
          this.typeIps = res.data.ips
          this.typeBounce = res.data.bounce + '%'
          this.typeAverage = transverterMss(res.data.average)
          this.typeList.data = res.data.list.map(d => {
            if (d.list instanceof Array && d.list.length) {
              d.children = d.list
              d.hasChild = true
              d.expand = false
            }
            return d
          })
          this.typePie = res.data.pie
          this.typeTable = res.data.objects
          this.typeFields = res.data.fields
          this.getTypeCakeData()
          this.getTypeTendencyData()
        }
      })
    },
    // 来源网站
    fetchStatisticsSourceSourceUrl () {
      const params = {
        ...this.params,
        siteId: this.siteId,
        showType: this.websiteRadio
      }
      this.$request.fetchStatisticsSourceSourceUrl(params).then(res => {
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
    fetchStatisticsSourceUrlPage () {
      this.params.siteId = this.siteId
      this.$request.fetchStatisticsSourceUrlPage(this.params).then(res => {
        if (res.code === 200) {
          this.websiteList.data = res.data.content
          this.websiteList.totalCount = res.data.totalElements
        }
      })
    },
    // 类型饼
    getTypeCakeData () {
      let array = []
      if (this.typeRadio === 1) {
        for (var i = 0; i < this.typePie.length; i++) {
          let obj = {}
          obj.item = this.typePie[i].name
          obj.count = this.typePie[i].pv
          array.push(obj)
        }
      } else if (this.typeRadio === 2) {
        for (var j = 0; j < this.typePie.length; j++) {
          let obj = {}
          obj.item = this.typePie[j].name
          obj.count = this.typePie[j].uv
          array.push(obj)
        }
      } else if (this.typeRadio === 3) {
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
    // 类型曲线图
    getTypeTendencyData () {
      let dv = new DataSet.View().source(this.typeTable)
      dv.transform({
        type: 'fold',
        fields: this.typeFields,
        key: 'city',
        value: 'temperature'
      })
      console.log(this.typeTable)
      console.log(this.typeFields)
      this.typeData = dv.rows
    },
    // URL饼图
    getWebsiteCakeData () {
      let array = []
      if (this.typeRadio === 1) {
        for (var i = 0; i < this.websitePie.length; i++) {
          let obj = {}
          obj.item = this.websitePie[i].name
          obj.count = this.websitePie[i].pv
          array.push(obj)
        }
      } else if (this.typeRadio === 2) {
        for (var j = 0; j < this.websitePie.length; j++) {
          let obj = {}
          obj.item = this.websitePie[j].name
          obj.count = this.websitePie[j].uv
          array.push(obj)
        }
      } else if (this.typeRadio === 3) {
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
      console.log(this.websiteFields)
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
    typeRadio () {
      this.fetchStatisticsSourceType()
    },
    websiteRadio () {
      this.fetchStatisticsSourceSourceUrl()
    }
  }
}
</script>

<style lang="scss">
  .statistics-source-index-container{
    .search-header-container{
      margin-top: 30px;
      margin-bottom: 8px;
      .el-radio-button__inner{
        min-width: 100px;
      }
    }
    .map{
      min-height: 581px;
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
