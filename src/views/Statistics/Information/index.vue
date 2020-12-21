<template>
  <section class="information-infor-index-wrap">
    <el-form>
      <el-form-item label='选择站点：'>
        <el-select
          popper-class="jee-border"
          style="width: 360px;"
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
      :params="list.params"
      v-bind="searchHeaders"
      @handleSearch="handleSearchs"
      @handleBtnExport='handleEventAlarmExport'
    ></search-header>
    <!-- <div class="pie-chart-title">内容发布总数: <span>{{numTitle}}</span></div> -->
    <ul class="statisticsList">
      <li>
        总访问量：
        <span>{{statisticsList.readCount}}</span>
      </li>
      <li>
        总访问人数：
        <span>{{statisticsList.peopleCount}}</span>
      </li>
      <li>
        总点赞数：
        <span>{{statisticsList.likeCount}}</span>
      </li>
      <li>
        总评论数：
        <span>{{statisticsList.commentCount}}</span>
      </li>
    </ul>
    <base-table
      v-bind="list"
      :defaultSort="defaultSort"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleCurrentChange="handleCurrentChange"
      @sortChange="sortChange"
    >
    </base-table>
  </section>
</template>
<script>
import qs from 'qs'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import { mapActions, mapGetters } from 'vuex'
let Nowdate = new Date()
let M = Number(Nowdate.getMonth()) + 1
let nowYear = Nowdate.getFullYear() // 当前年
let date1 = Nowdate.getDate() // 当前日
let nowDayOfWeek = Nowdate.getDay() // 今天本周的第几天
let nowMonth = Nowdate.getMonth() // 当前月
const columns = [
  {
    prop: 'name',
    label: '栏目名称',
    minWidth: '330px'
  },
  {
    prop: 'readCount',
    label: '访问量',
    // minWidth: '180px',
    width: '260px',
    sortable: 'custom'
  },
  {
    prop: 'peopleCount',
    label: '访问人数',
    width: '270px',
    sortable: 'custom'
  },
  {
    prop: 'likeCount',
    label: '点赞数',
    width: '260px',
    sortable: 'custom'
  },
  {
    prop: 'commentCount',
    label: '评论数',
    width: '260px',
    sortable: 'custom'
  }
]
export default {
  name: 'statisticsInformationIndex',
  mixins: [searchHeader, baseTable],
  props: {
  },
  watch: {
    'tabName': function (item) {
      if (item === this.navName) {
        this.list.api = this.urlApi
        this.fetchTableApi()
      }
    },
    currentSiteId (newData) {
      this.siteId = newData
      this.list.params.siteId = this.siteId
      this.fetchTableApi()
      this.handfetchsitegeneralListData()
    },
    siteId (newData) {
      if (newData) {
        this.siteId = newData
        this.list.params.siteId = this.siteId
        this.fetchTableApi()
        this.handfetchsitegeneralListData()
      }
    }
  },
  data () {
    return {
      defaultSort: {
        prop: 'readCount',
        order: 'descending'
      },
      statisticsList: {},
      siteId: null,
      numTitle: '',
      data: [],
      navName: 'columnIndex',
      urlApi: 'fetchsitegeneralChannelData',
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
                label: '本周',
                value: 2
              },
              {
                label: '本月',
                value: 3
              },
              {
                label: '今年',
                value: 4
              },
              {
                label: '累计',
                value: 5
              }
            ]
          },
          {
            type: 'dataPicker',
            rangeText: '-',
            label: '选择日期:',
            value: 'time'
          }
        ]
      },
      list: {
        filterParams: ['time', 'time2'],
        api: 'fetchsitegeneralChannelData',
        indexWidth: '85px',
        params: {
          'sortType': '',
          'siteId': 1,
          'sort': '',
          'time': [],
          'time2': 1,
          'startDate': '',
          'endDate': ''
        },
        columns,
        showIndex: false,
        showSelection: false,
        data: []
      }
    }
  },
  computed: {
    ...mapGetters(['ownSiteOptions', 'currentSiteId'])
  },
  methods: {
    ...mapActions('config', ['FetchSitesOwnsite']),
    // 导出
    handleEventAlarmExport () {
      let params = {
        key: this.list.params.key,
        sort: true,
        startDate: this.list.params.startDate,
        endDate: this.list.params.endDate
      }
      this.$confirm('是否确定导出表格？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let token = localStorage.getItem('JEECMS-Auth-Token')
        if (this.tabName === 'orgTables') {
          window.open(`${this.$path}${this.$prefix}/sitegeneral/excel/org?${qs.stringify(params)}&JEECMS-Auth-Token=${token}`)
        } else if (this.tabName === 'siteTables') {
          window.open(`${this.$path}${this.$prefix}/sitegeneral/excel/site?${qs.stringify(params)}&JEECMS-Auth-Token=${token}`)
        } else if (this.tabName === 'userTables') {
          window.open(`${this.$path}${this.$prefix}/sitegeneral/excel/user?${qs.stringify(params)}&JEECMS-Auth-Token=${token}`)
        }
        this.fetchTableApi()
      })
    },
    // 排序
    sortChange (column, prop, order) {
      let params = this.list.params
      if (prop === 'readCount') {
        params.sortType = 1
        if (order === 'ascending') {
          params.sort = true
        } else if (order === 'descending') {
          params.sort = false
        }
      } else if (prop === 'peopleCount') {
        params.sortType = 2
        if (order === 'ascending') {
          params.sort = true
        } else if (order === 'descending') {
          params.sort = false
        }
      } else if (prop === 'likeCount') {
        params.sortType = 3
        if (order === 'ascending') {
          params.sort = true
        } else if (order === 'descending') {
          params.sort = false
        }
      } else if (prop === 'commentCount') {
        params.sortType = 4
        if (order === 'ascending') {
          params.sort = true
        } else if (order === 'descending') {
          params.sort = false
        }
      } else {
        params.sortType = 0
        if (order === 'ascending') {
          params.sort = true
        } else if (order === 'descending') {
          params.sort = false
        }
      }
      this.list.params = params
      this.fetchTableApi()
    },
    async handfetchsitegeneralListData () {
      let paramsData = {
        siteId: this.list.params.siteId,
        startDate: this.list.params.startDate,
        endDate: this.list.params.endDate,
        flag: true
      }
      const res = await this.$request.fetchsitegeneralListData(paramsData)
      if (res.code === 200) {
        this.statisticsList = res.data
      }
    },
    fetchTableCallBack (res) {
      this.numTitle = res.data.sum
      if (res.code === 200) {
        this.list.data = res.data.content.map(v => {
          return v
        })
        this.list.totalCount = res.data.totalElements
      }
    },
    // 格局化日期：yyyy-MM-dd
    formatDate (date) {
      var myyear = date.getFullYear()
      var mymonth = date.getMonth() + 1
      var myweekday = date.getDate()
      if (mymonth < 10) {
        mymonth = '0' + mymonth
      }
      if (myweekday < 10) {
        myweekday = '0' + myweekday
      }
      return (myyear + '-' + mymonth + '-' + myweekday)
    },
    // 获得某月的天数
    getMonthDays (myMonth) {
      var monthStartDate = new Date(nowYear, myMonth, 1)
      var monthEndDate = new Date(nowYear, myMonth + 1, 1)
      var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
      return days
    },
    handleSearchs (data) {
      let date = []
      if (this.list.params.time2) {
        if (data === 1) {
          this.list.params.startDate = this.formatDate(new Date(nowYear, nowMonth, date1))
          this.list.params.endDate = this.formatDate(new Date(nowYear, nowMonth, date1))
          date.push(this.list.params.startDate)
          date.push(this.list.params.endDate)
          this.list.params.time = date
        } else if (data === 2) {
          this.list.params.startDate = this.formatDate(new Date(nowYear, nowMonth, date1 + 1 - nowDayOfWeek))
          this.list.params.endDate = this.formatDate(new Date(nowYear, nowMonth, date1))
          date.push(this.list.params.startDate)
          date.push(this.list.params.endDate)
          this.list.params.time = date
        } else if (data === 3) {
          this.list.params.startDate = this.formatDate(new Date(nowYear, nowMonth, 1))
          this.list.params.endDate = this.formatDate(new Date(nowYear, nowMonth, date1))
          date.push(this.list.params.startDate)
          date.push(this.list.params.endDate)
          this.list.params.time = date
        } else if (data === 4) {
          this.list.params.startDate = this.formatDate(new Date(nowYear, '00', 1))
          this.list.params.endDate = this.formatDate(new Date(nowYear, nowMonth, date1))
          date.push(this.list.params.startDate)
          date.push(this.list.params.endDate)
          this.list.params.time = date
        } else if (data === 5) {
          this.list.params.time = ''
          this.list.params.startDate = ''
          this.list.params.endDate = ''
          date = []
        } else {
          if (!this.list.params.time) {
            this.list.params.time2 = 5
            this.list.params.startDate = ''
            this.list.params.endDate = ''
            this.fetchTableApi()
            this.handfetchsitegeneralListData()
            return
          }
          if (this.formatDate(new Date(this.list.params.time[0])) === this.formatDate(new Date(nowYear, nowMonth, date1)) && this.formatDate(new Date(this.list.params.time[1])) === this.formatDate(new Date(nowYear, nowMonth, date1))) {
            this.list.params.time2 = 1
          } else if (this.formatDate(new Date(this.list.params.time[0])) === this.formatDate(new Date(nowYear, nowMonth, date1 + 1 - nowDayOfWeek)) && this.formatDate(new Date(this.list.params.time[1])) === this.formatDate(new Date(nowYear, nowMonth, date1))) {
            this.list.params.time2 = 2
          } else if (this.formatDate(new Date(this.list.params.time[0])) === this.formatDate(new Date(nowYear, nowMonth, 1)) && this.formatDate(new Date(this.list.params.time[1])) === this.formatDate(new Date(nowYear, nowMonth, date1))) {
            this.list.params.time2 = 3
          } else if (this.formatDate(new Date(this.list.params.time[0])) === this.formatDate(new Date(nowYear, '00', 1)) && this.formatDate(new Date(this.list.params.time[1])) === this.formatDate(new Date(nowYear, nowMonth, date1))) {
            this.list.params.time2 = 4
          } else if (this.formatDate(new Date(this.list.params.time[0])) === '' && this.formatDate(new Date(this.list.params.time[1])) === '') {
            this.list.params.time2 = 5
          } else {
            this.list.params.time2 = 6
          }
          this.list.params.startDate = this.formatDate(new Date(this.list.params.time[0]))
          this.list.params.endDate = this.formatDate(new Date(this.list.params.time[1]))
        }
      }
      this.fetchTableApi()
      this.handfetchsitegeneralListData()
    }
  },
  activated () {
  },
  mounted () {
    this.FetchSitesOwnsite()
    this.siteId = this.currentSiteId
    this.list.params.siteId = this.siteId
    let dates = new Date()
    let date = []
    this.list.params.startDate = this.formatDate(new Date(dates.getFullYear(), M - 1, date1))
    this.list.params.endDate = this.formatDate(new Date(dates.getFullYear(), M - 1, date1))
    date.push(this.list.params.startDate)
    date.push(this.list.params.endDate)
    this.list.params.time = date
    this.handfetchsitegeneralListData()
    this.$nextTick(() => {
    })
  }
}
</script>
<style lang="scss" scoped>
  .information-infor-index-wrap{
    .statisticsList{
      display: flex;
      margin-bottom: 18px;
      margin-top: 17px;
      li:first-child{
        padding-left: 0;
      }
      li:last-of-type{
        border-right: none;
      }
      li{
        color: #666666;
        font-size: 14px;
        padding: 0 18px;
        line-height: 14px;
        border-right: 1px solid #999999;
        span{
          color: #333333;
          font-size: 20px;
          font-weight: 600;
        }
      }
    }
  }
</style>
