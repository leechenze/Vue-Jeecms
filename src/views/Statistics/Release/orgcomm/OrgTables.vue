<template>
  <section class="member-org-tables-chart-wrap">
    <search-header
      class="search-header"
      :params="list.params"
      v-bind="searchHeaders"
      @handleSearch="handleSearchs"
      @handleBtnExport='handleEventAlarmExport'
    ></search-header>
    <div class="pie-chart-title">内容发布总数: <span>{{numTitle}}</span></div>
    <base-table
      v-bind="list"
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
let Nowdate = new Date()
let M = Number(Nowdate.getMonth()) + 1
let nowYear = Nowdate.getFullYear() // 当前年
let date1 = Nowdate.getDate() // 当前日
let nowDayOfWeek = Nowdate.getDay() // 今天本周的第几天
let nowMonth = Nowdate.getMonth() // 当前月
const columns = [
  {
    prop: 'name',
    label: '组织名称',
    width: '400px'
  },
  {
    prop: 'value',
    label: '内容发布数',
    sortable: 'custom'
  }
]
export default {
  name: 'org-tables',
  mixins: [searchHeader, baseTable],
  props: {
    tabName: {
      type: String,
      default: ''
    },
    siteId: {
      type: Number,
      default: null
    }
  },
  watch: {
    'tabName': function (item) {
      if (item === this.navName) {
        this.list.api = this.urlApi
        this.fetchTableApi()
      }
    }
  },
  data () {
    return {
      numTitle: '',
      data: [],
      navName: 'orgTables',
      urlApi: 'fetchstatisticsSitegeneralOrgData',
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
          },
          {
            type: 'searchInput',
            value: 'key',
            placeholder: '请输入组织名称'
          },
          {
            btnType: 'Export',
            type: 'henderBorderBtn',
            text: '导出',
            icon: 'daochu-tianchong'
          }
        ]
      },
      list: {
        filterParams: ['time', 'time2'],
        api: '',
        indexWidth: '85px',
        params: {
          'key': '',
          'sort': true,
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
  },
  methods: {
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
      if (order === 'descending') {
        params.sort = true
      } else {
        params.sort = false
      }
      this.fetchTableApi()
    },
    fetchTableCallBack (res) {
      this.numTitle = res.data.sum
      if (res.code === 200) {
        this.list.data = res.data.page.content.map(v => {
          return v
        })
        this.list.totalCount = res.data.page.totalElements
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
      // if (this.params.time[1] > this.formatDate(new Date(nowYear, nowMonth, date1))) {
      //   this.params.time[1] = this.formatDate(new Date(nowYear, nowMonth, date1))
      // }
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
    }
  },
  activated () {
  },
  mounted () {
    let dates = new Date()
    let date = []
    this.list.params.startDate = this.formatDate(new Date(dates.getFullYear(), M - 1, date1))
    this.list.params.endDate = this.formatDate(new Date(dates.getFullYear(), M - 1, date1))
    date.push(this.list.params.startDate)
    date.push(this.list.params.endDate)
    this.list.params.time = date
    this.$nextTick(() => {
    })
  }
}
</script>
<style lang="scss">
  .member-org-tables-chart-wrap{
    .search-header-container{
      padding-bottom: 0px;
      .el-row{
        background: none;
        padding: 0px;
        .search-wrap{
          .search-item-wrap{
            padding-bottom: 0px;
            margin-left: 0;
            margin-right: 20px;
          }
        }
      }
    }

  }

</style>
<style lang="scss" scoped>
  .member-org-tables-chart-wrap{
    .pie-chart-title{
      margin-top: 14px;
      font-size: 14px;
      margin-bottom: 18px;
      color: #666666;
      span {
        color: #333333;
        font-size: 20px;
        font-weight: 700;
        margin-left: 5px;
      }
    }
  }
</style>
