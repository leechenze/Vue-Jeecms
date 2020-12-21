<template>
  <section class="member-browse-index-wrap">
    <search-header
      class="search-header"
      :params="list.params"
      v-bind="searchHeaders"
      @handleSearch="handleSearchs"
    ></search-header>
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
        <span class="comment-num" @click="handStatisticsListData">{{statisticsList.commentCount}}</span>
      </li>
    </ul>
    <div class="browse-all">
      <div class="all-left">
        <p class="all-title">访问设备</p>
        <chart-pie :statisticsList="statisticsList"></chart-pie>
      </div>
      <div class="all-right">
        <div class="right-title">
          <p class="all-title">访问地域</p>
          <div class="right-text" @click="handRightBut">{{showData==='地图'?'地图':'表格'}}</div>
        </div>
        <div class="right-show">
          <chart-map class="right-mp" v-show="showData === '表格'" :statisticsList="statisticsList"></chart-map>
          <base-table
            class="right-table"
            :defaultSort="defaultSort"
            v-show="showData === '地图'"
            v-bind="list"
            @sortChange="sortChange"
          >
          </base-table>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import chartPie from './ChartPie'
import chartMap from './ChartMap'
const columns = [
  {
    prop: 'province',
    minWidth: '110px',
    label: '省份'
  },
  {
    prop: 'readCount',
    label: '访问量',
    minWidth: '110px',
    sortable: 'custom'
  },
  {
    prop: 'peopleCount',
    label: '访问人数',
    minWidth: '115px',
    sortable: 'custom'
  },
  {
    prop: 'commentCount',
    label: '评论数',
    sortable: 'custom'
  }
]
let Nowdate = new Date()
let nowYear = Nowdate.getFullYear() // 当前年
let date1 = Nowdate.getDate() // 当前日
let nowDayOfWeek = Nowdate.getDay() // 今天本周的第几天
let nowMonth = Nowdate.getMonth() // 当前月
export default {
  name: 'browse-index',
  mixins: [searchHeader, baseTable],
  props: {
    contentId: {
      type: Number,
      default: null
    }
  },
  components: {
    chartPie,
    chartMap
  },
  watch: {
    contentId (newData) {
      console.log(newData)
      this.showData = '表格'
      if (newData) {
        this.list.params.contentId = newData
        this.fetchContentRecordData()
      }
    }
  },
  data () {
    return {
      defaultSort: {
        prop: 'readCount',
        order: 'descending'
      },
      showData: '表格',
      statisticsList: {},
      numTitle: '',
      searchHeaders: {
        searchItems: [
          {
            type: 'cutButton',
            value: 'time2',
            label: '',
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
                label: '累计',
                value: 5
              }
            ]
          },
          {
            type: 'dataPicker',
            rangeText: '-',
            label: '',
            value: 'time'
          }
        ]
      },
      list: {
        filterParams: ['time', 'time2'],
        api: 'fetchContentTable',
        indexWidth: '85px',
        params: {
          'sortType': 1,
          'contentId': '',
          'sort': '',
          'time': [],
          'time2': 5,
          'startDate': '',
          'endDate': ''
        },
        columns,
        showIndex: false,
        showSelection: false,
        showPagination: false,
        data: []
      }
    }
  },
  computed: {
  },
  methods: {
    // 总评论数跳转页面
    handStatisticsListData () {
      this.$emit('handStatisData')
      this.$router.push({ path: '/interact/comment/Content?contentId=' + this.contentId })
    },
    handRightBut () {
      if (this.showData === '地图') {
        this.list.api = 'fetchContentTable'
        this.fetchTableApi()
        this.showData = '表格'
      } else {
        this.fetchContentRecordData()
        this.showData = '地图'
      }
    },
    // 排序
    sortChange (column, prop, order) {
      let params = this.list.params
      if (prop === 'readCount') {
        params.sortType = 1
        if (order === 'ascending') {
          params.sort = false
        } else if (order === 'descending') {
          params.sort = true
        }
      } else if (prop === 'peopleCount') {
        params.sortType = 2
        if (order === 'ascending') {
          params.sort = false
        } else if (order === 'descending') {
          params.sort = true
        }
      } else if (prop === 'likeCount') {
        params.sortType = 3
        if (order === 'ascending') {
          params.sort = false
        } else if (order === 'descending') {
          params.sort = true
        }
      } else if (prop === 'commentCount') {
        params.sortType = 4
        if (order === 'ascending') {
          params.sort = false
        } else if (order === 'descending') {
          params.sort = true
        }
      }
      this.list.params = params
      this.fetchTableApi()
    },
    async fetchContentRecordData () {
      let paramsData = {
        contentId: this.list.params.contentId,
        startDate: this.list.params.startDate,
        endDate: this.list.params.endDate
      }
      const res = await this.$request.fetchContentRecord(paramsData)
      if (res.code === 200) {
        this.statisticsList = res.data
      }
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.map(v => {
          return v
        })
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
            this.fetchContentRecordData()
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
      this.fetchContentRecordData()
    }
  },
  activated () {
  },
  mounted () {
    this.list.params.contentId = this.contentId
    console.log(this.contentId)
    this.list.params.time = ''
    this.list.params.startDate = ''
    this.list.params.endDate = ''
    this.fetchContentRecordData()
    this.$nextTick(() => {
    })
  }
}
</script>
<style lang="scss">
.member-browse-index-wrap{
  .search-header{
    .el-row{
      .search-item-wrap{
        margin-left: 0px;
        margin-right: 20px;
      }
    }
  }
  .right-table{
    .el-table{
      .el-table__header{
        thead{
          tr{
            th:last-of-type{
              .cell{
                padding-right: 0px !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
  .member-browse-index-wrap{
    .statisticsList{
      display: flex;
      margin-bottom: 28px;
      margin-top: 7px;
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
        .comment-num{
          color: #1EC6DF;
          cursor: pointer;
        }
        span{
          color: #333333;
          font-size: 20px;
          font-weight: 600;
        }
      }
    }
    .browse-all{
      display: flex;
      margin-top: 9px;
      color: #333333;
      .all-title{
        font-size: 16px;
        border-left: 2px solid #1EC6DF;
        padding-left: 5px;
      }
      .all-left{
        flex: 4;
      }
      .all-right{
        flex: 10;
        margin-left: 2%;
        .right-title{
          display: flex;
          .right-text{
            font-size: 16px;
            margin-left: auto;
            color: #1EC6DF;
            cursor: pointer;
          }

        }
      }
      .right-show{
        .right-table{
          margin-top: 20px;
        }
        .right-mp{

        }
      }
    }
  }
</style>
