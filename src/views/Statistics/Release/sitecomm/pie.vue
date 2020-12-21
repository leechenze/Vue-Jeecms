<template>
  <section class="member-org-pie-chart-wrap">
    <search-header
      class="search-header"
      :params="params"
      v-bind="searchHeaders"
      @handleSearch="handleSearchs"
    ></search-header>
    <div class="pie-chart-title">内容发布总数: <span>{{dataInfo.sum}}</span></div>
    <div style="width: 100%; padding-top: 23px;">
      <div class="graph" id="test" style="width: 56%; height: 320px"></div>
    </div>
  </section>
</template>
<script>
import searchHeader from '@/components/mixins/searchHeader'
// import { getTime, getData, getNewTime } from '@/utils'
var echarts = require('echarts')
let Nowdate = new Date()
let M = Number(Nowdate.getMonth()) + 1
let nowYear = Nowdate.getFullYear() // 当前年
let date1 = Nowdate.getDate() // 当前日
let nowDayOfWeek = Nowdate.getDay() // 今天本周的第几天
let nowMonth = Nowdate.getMonth() // 当前月
export default {
  name: 'pie',
  mixins: [searchHeader],
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
      if (item === 'sitePie') {
      // 判断是站点
        this.getDatas()
      } else if (item === 'orgPie') {
      // 判断是组织
        this.getDatas()
      } else if (item === 'userPie') {
      // 判断是用户
        this.getDatas()
      } else if (item === 'pieChart') {
      // 判断是栏目
        this.getDatas()
      }
    },
    siteId (newData) {
      if (newData) {
        this.params.siteId = newData
        this.getDatas()
      }
    }
  },
  data () {
    return {
      dataInfo: [],
      tendencyHeight: 290,
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
      params: {
        siteId: '',
        startDate: '',
        endDate: '',
        time2: 1,
        time: []
      },
      pieOption: {
        legend: {
          show: true,
          orient: 'vertical',
          left: 0
        },
        // 设置canvas内部表格的内距
        grid: {
          left: '0%',
          right: '30%',
          top: '52px',
          bottom: '0%',
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#45A3FC', '#8BD1E9', '#47CBCA', '#86DEBF', '#56CA77', '#ADDE87', '#FAD352', '#E9A679', '#F0657D', '#DB84D1', '#9765E2'],
        series: [
          {
            name: '内容发布统计',
            type: 'pie',
            radius: [38, 130],
            center: ['60%', '48%'],
            roseType: 'area',
            data: [],
            itemStyle: {
              normal: {
                label: {
                  textStyle: {
                    color: '#333',
                    fontSize: 14
                  }
                }
              }
            }
          }
        ]
      }
    }
  },
  computed: {
  },
  methods: {
    async getDatas () {
      let paramsData = {
        startDate: this.params.startDate,
        endDate: this.params.endDate
      }
      if (this.tabName === 'pieChart') {
        paramsData.siteId = this.params.siteId
        const res = await this.$request.fetchstatisticsSitegeneralChannel(paramsData)
        if (res.code === 200) {
          this.dataInfo = res.data
          console.log(res.data)
          this.showPie(res.data)
        }
      } else {
        delete paramsData.siteId
      }
      if (this.tabName === 'sitePie') {
        const res = await this.$request.fetchstatisticsSitegeneralSite(paramsData)
        if (res.code === 200) {
          this.dataInfo = res.data
          this.showPie(res.data)
        }
      } else if (this.tabName === 'orgPie') {
        const res = await this.$request.fetchstatisticsSitegeneralOrg(paramsData)
        if (res.code === 200) {
          this.dataInfo = res.data
          this.showPie(res.data)
        }
      } else if (this.tabName === 'userPie') {
        const res = await this.$request.fetchstatisticsSitegeneralUser(paramsData)
        if (res.code === 200) {
          this.dataInfo = res.data
          this.showPie(res.data)
        }
      }
    },
    initPie (pieOption) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('test'))
      // 绘制图表
      myChart.setOption(pieOption)
    },
    showPie (res) {
      let pieOption = Object.assign({}, this.pieOption)
      for (let i in res.publishs) {
        console.log(res.publishs[i])
        res.publishs[i].name = res.publishs[i].name + '(' + res.publishs[i].value + ')'
      }
      pieOption.series[0].data = res.publishs
      this.initPie(pieOption)
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
    async handleSearchs (data) {
      let date = []
      if (this.params.time2) {
        if (data === 1) {
          this.params.startDate = this.formatDate(new Date(nowYear, nowMonth, date1))
          this.params.endDate = this.formatDate(new Date(nowYear, nowMonth, date1))
          date.push(this.params.startDate)
          date.push(this.params.endDate)
          this.params.time = date
        } else if (data === 2) {
          this.params.startDate = this.formatDate(new Date(nowYear, nowMonth, date1 + 1 - nowDayOfWeek))
          this.params.endDate = this.formatDate(new Date(nowYear, nowMonth, date1))
          date.push(this.params.startDate)
          date.push(this.params.endDate)
          this.params.time = date
        } else if (data === 3) {
          this.params.startDate = this.formatDate(new Date(nowYear, nowMonth, 1))
          this.params.endDate = this.formatDate(new Date(nowYear, nowMonth, date1))
          date.push(this.params.startDate)
          date.push(this.params.endDate)
          this.params.time = date
        } else if (data === 4) {
          this.params.startDate = this.formatDate(new Date(nowYear, '00', 1))
          this.params.endDate = this.formatDate(new Date(nowYear, nowMonth, date1))
          date.push(this.params.startDate)
          date.push(this.params.endDate)
          this.params.time = date
        } else if (data === 5) {
          this.params.time = ''
          this.params.startDate = ''
          this.params.endDate = ''
          date = []
        } else {
          if (!this.params.time) {
            this.params.time2 = 5
            this.params.startDate = ''
            this.params.endDate = ''
            await this.getDatas()
            return
          }
          if (this.formatDate(new Date(this.params.time[0])) === this.formatDate(new Date(nowYear, nowMonth, date1)) && this.formatDate(new Date(this.params.time[1])) === this.formatDate(new Date(nowYear, nowMonth, date1))) {
            this.params.time2 = 1
          } else if (this.formatDate(new Date(this.params.time[0])) === this.formatDate(new Date(nowYear, nowMonth, date1 + 1 - nowDayOfWeek)) && this.formatDate(new Date(this.params.time[1])) === this.formatDate(new Date(nowYear, nowMonth, date1))) {
            this.params.time2 = 2
          } else if (this.formatDate(new Date(this.params.time[0])) === this.formatDate(new Date(nowYear, nowMonth, 1)) && this.formatDate(new Date(this.params.time[1])) === this.formatDate(new Date(nowYear, nowMonth, date1))) {
            this.params.time2 = 3
          } else if (this.formatDate(new Date(this.params.time[0])) === this.formatDate(new Date(nowYear, '00', 1)) && this.formatDate(new Date(this.params.time[1])) === this.formatDate(new Date(nowYear, nowMonth, date1))) {
            this.params.time2 = 4
          } else if (this.formatDate(new Date(this.params.time[0])) === '' && this.formatDate(new Date(this.params.time[1])) === '') {
            this.params.time2 = 5
          } else {
            this.params.time2 = 6
          }
          this.params.startDate = this.formatDate(new Date(this.params.time[0]))
          this.params.endDate = this.formatDate(new Date(this.params.time[1]))
        }
      }
      await this.getDatas()
    }
  },
  activated () {
    this.getDatas()
  },
  mounted () {
    let date = []
    // console.log(this.siteId)
    this.params.startDate = Nowdate.getFullYear() + '-' + M + '-' + date1
    this.params.endDate = Nowdate.getFullYear() + '-' + M + '-' + date1
    date.push(this.params.startDate)
    date.push(this.params.endDate)
    this.time = Nowdate.getFullYear() + '-' + M + '-' + date1
    this.params.time = date
    this.$nextTick(async () => {
      this.params.siteId = this.siteId
      await this.getDatas()
    })
  }
}
</script>
<style lang="scss" scoped>
  .member-org-pie-chart-wrap{
    .pie-chart-title{
      margin-top: 14px;
      font-size: 14px;
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
<style lang="scss">
  .member-org-pie-chart-wrap{
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
