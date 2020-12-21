<template>
  <section class="statistics-visitor-visitor-container">
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
      <div style="display:flex;padding-top:27px;padding-bottom: 30px;">
        <div style="width:50%;">
          <visitor :rate='visitorObj.newRate' :label='visitorObj.newName'></visitor>
        </div>
        <div style="width:50%;">
          <visitor :rate='visitorObj.oldRate' :label='visitorObj.oldName'></visitor>
        </div>
      </div>
      <div class='visitor-wrap'>
        <div class="visitor">
          <div class="visitor-box">
            <p><span><strong></strong>浏览量</span><span>{{visitorObj.newPv}}</span></p>
            <p><span><strong></strong>访客数</span><span>{{visitorObj.newUv}}</span></p>
            <p><span><strong></strong>IP数</span><span>{{visitorObj.newIp}}</span></p>
          </div>
          <div class="visitor-box">
            <p><span><strong></strong>跳出率</span><span>{{visitorObj.newJump+'%'}}</span></p>
            <p><span><strong></strong>平均访问时长</span><span>{{visitorObj.newTime}}</span></p>
            <p><span><strong></strong>平均访问页数</span><span>{{visitorObj.newVisitPage}}</span></p>
          </div>
        </div>
        <div class="visitor">
          <div class="visitor-box">
            <p><span><strong></strong>浏览量</span><span>{{visitorObj.oldPv}}</span></p>
            <p><span><strong></strong>访客数</span><span>{{visitorObj.oldUv}}</span></p>
            <p><span><strong></strong>IP数</span><span>{{visitorObj.oldIp}}</span></p>
          </div>
          <div class="visitor-box">
            <p><span><strong></strong>跳出率</span><span>{{visitorObj.oldJump+'%'}}</span></p>
            <p><span><strong></strong>平均访问时长</span><span>{{visitorObj.oldTime}}</span></p>
            <p><span><strong></strong>平均访问页数</span><span>{{visitorObj.oldVisitPage}}</span></p>
          </div>
        </div>
      </div>
    </section>
    <base-table v-bind="websiteList"
      @sortChange="handleSortChange"
    ></base-table>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import visitor from './toVisitor'
import {
  mapActions,
  mapGetters
} from 'vuex'
import { getTime, getData, transverterMss, accAdd } from '@/utils'
const visitorObjs = {
  newName: '新客户',
  newPv: 0,
  newUv: 0,
  newJump: 0,
  newTime: 0,
  newIp: 0,
  newVisitPage: 0,
  oldName: '老客户',
  oldPv: 0,
  oldUv: 0,
  oldJump: 0,
  oldTime: 0,
  oldIp: 0,
  oldVisitPage: 0
}
export default {
  name: 'statisticsVisitorVisitor',
  mixins: [baseHeader, searchHeader, baseTable],
  components: {
    visitor
  },
  data () {
    return {
      headers: {
        buttons: [],
        title: '操作说明',
        showAlertIcon: true,
        content: '一天的独立访客中，历史上第一次访问您网站的访客记为新访客；今日之前有过访问，且今日再次访问的访客，记为老访客。助您了解网站的访客构成以及不同渠道带来的访客情况，新老访客关注的差异对比。'
      },
      siteId: null,
      params: {
        senior: false,
        time2: 1,
        time: [],
        startTime: null,
        endTime: null,
        areaIds: [''],
        area: '',
        orderType: 1,
        sourceTypeIds: [''],
        sourceType: '',
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
            type: 'senior',
            value: 'senior'
          }
        ]
      },
      websiteList: {
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
            label: '新老访客',
            prop: 'name'
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
          },
          {
            label: '平均访问页数',
            prop: 'visitPage',
            sortable: 'custom'
          }
        ],
        showSelection: false,
        showPagination: false
      },
      scale: [{
        dataKey: 'sales',
        tickInterval: 20
      }],
      height: 400,
      visitorObj: {}
    }
  },
  computed: {
    ...mapGetters(['ownSiteOptions', 'currentSiteId', 'areaOptions']),
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
        this.fetchStatisticsvisitTimeuser()
      } else {
        this.fetchStatisticsvisitUser()
      }
    },
    handleFocus () {
      this.params.time2 = ''
    },
    setData (data) {
      this.$set(this.websiteList, 'data', data)
      if (data instanceof Array && data.length) {
        data.forEach(d => {
          const k = d.name === '新客户' ? 'new' : 'old'
          this.visitorObj[`${k}Name`] = d.name
          this.visitorObj[`${k}Pv`] = d.pv
          this.visitorObj[`${k}Uv`] = d.uv
          this.visitorObj[`${k}Jump`] = d.jump
          this.visitorObj[`${k}Time`] = transverterMss(d.visitTime)
          this.visitorObj[`${k}Ip`] = d.ips
          this.visitorObj[`${k}VisitPage`] = d.visitPage
        })
      } else {
        const visitorObjs = {
          newName: '新客户',
          newPv: 0,
          newUv: 0,
          newJump: 0,
          newTime: 0,
          newIp: 0,
          newVisitPage: 0,
          oldName: '老客户',
          oldPv: 0,
          oldUv: 0,
          oldJump: 0,
          oldTime: 0,
          oldIp: 0,
          oldVisitPage: 0
        }
        this.visitorObj = visitorObjs
      }
      const totalUv = this.visitorObj.newUv + this.visitorObj.oldUv
      this.visitorObj.newRate = totalUv ? this.visitorObj.newUv * 10 / totalUv : 0
      if (this.visitorObj.newRate === 0) {
        this.visitorObj.oldRate = this.visitorObj.oldUv * 10 + ''
      } else {
        this.visitorObj.oldRate = 10 - this.visitorObj.newRate
      }
    },
    // 今日
    fetchStatisticsvisitTimeuser () {
      const that = this
      this.$request.fetchStatisticsvisitTimeuser(this.getParams).then(res => {
        if (res.code === 200) {
          that.setData(res.data.list)
        }
      })
    },
    // 日常
    fetchStatisticsvisitUser () {
      const that = this
      this.$request.fetchStatisticsvisitUser(this.getParams).then(res => {
        if (res.code === 200) {
          that.setData(res.data.list)
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
        pv: 1,
        uv: 2,
        ips: 3,
        jump: 4,
        visitTime: 5,
        visitPage: 6
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
    this.visitorObj = visitorObjs
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
  .statistics-visitor-visitor-container{
    .search-header-container{
      margin-bottom: 8px;
      .el-radio-button__inner{
        min-width: 100px;
      }
    }
    .map{
      height: 540px;
      box-sizing: border-box;
      border:1px solid rgba(232,232,232,1);
      border-radius:4px;
      padding: 10px 30px;
      margin-bottom: 30px;
      .circle{
        margin-left: -7.2%;
      }
    }
    .visitor-wrap{
      display: flex;
      justify-content: space-between;
    }
    .visitor{
      display: flex;
      justify-content: center;
      width: 50%;
    }
    .visitor-box{
      width: 250px;
      &:last-of-type{
        width: 350px;
      }
      &+.visitor-box{
        padding-left: 30px;
      }
      p{
        display: flex;
        justify-content:space-between;
        align-items: center;
        padding-right: 20px;
        line-height: 45px;
        strong{
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 10px;
          line-height: 45px;
        }
        span:nth-of-type(2){
          font-size: 18px;
          font-weight: 600px;
        }
      }

    }
    .visitor-box:first-child{
      p:nth-child(1){
        strong{
          background-color: #ED4A66;
        }
      }
      p:nth-child(2){
        strong{
          background-color: #2593FC;
        }
      }
      p:nth-child(3){
        strong{
          background-color: #F9CB34;
        }
      }
    }
    .visitor-box:last-child{
      p:nth-child(1){
        strong{
          background-color: #1EBBBA;
        }
      }
      p:nth-child(2){
        strong{
          background-color: #38C060;
        }
      }
      p:nth-child(3){
        strong{
          background-color: #9669DF;
        }
      }
    }
  }
</style>
