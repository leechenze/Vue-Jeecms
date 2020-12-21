<template>
  <section class="member-pie-chart-wrap">
    <search-header
      class="search-header"
      :params="params"
      v-bind="searchHeaders"
      @handleSearch="handleSearchs"
    ></search-header>
    <div class="pie-chart-title">内容发布总数: <span>{{dataInfo.sum}}</span></div>
    <div style="width:100%;">
      <div class="graphs" id="test1" style="height: 380px"></div>
    </div>
  </section>
</template>
<script>
import searchHeader from '@/components/mixins/searchHeader'
// import { split } from 'lodash'
var echarts = require('echarts')
let Nowdate = new Date()
let M = Number(Nowdate.getMonth()) + 1
let nowYear = Nowdate.getFullYear() // 当前年
let date1 = Nowdate.getDate() // 当前日
let nowDayOfWeek = Nowdate.getDay() // 今天本周的第几天
let nowMonth = Nowdate.getMonth() // 当前月
export default {
  name: 'bar',
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
      if (item === 'siteColumn') {
        this.getDatasColumn()
      } else if (item === 'orgColumn') {
        this.getDatasColumn()
      } else if (item === 'userColumn') {
        this.getDatasColumn()
      } else if (item === 'columnChart') {
        this.getDatasColumn()
      }
    },
    siteId (newData) {
      if (newData) {
        this.params.siteId = newData
        this.getDatasColumn()
      }
    }
  },
  data () {
    return {
      dataInfo: [],
      tendencyHeight: 290,
      searchHeaders: {
        searchItems: [{
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
        }]
      },
      pieOption: {
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: [],
          axisTick: {
            show: false,
            lineStyle: {
              color: '#000'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              fontSize: 14,
              color: '#eee',
              fontWeight: 'normal'
            }
          },
          axisLabel: {
            show: true,
            interval: 0,
            textStyle: {
              fontSize: 14,
              color: '#333' // 坐标值得具体的颜色
            },
            formatter: function (value) {
              return (value.length > 4 ? (value.slice(0, 4) + '...') : value)
            }
          }
        },
        grid: {
          left: '0%',
          right: '30%',
          top: '46px',
          bottom: '10%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          splitLine: { // gird 区域中的分割线
            show: true, // 是否显示
            lineStyle: {
              color: '#E8E8E8',
              width: 1,
              type: 'dashed'
            }
          },
          axisTick: {
            show: false,
            alignWithLabel: true
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            interval: 0,
            textStyle: {
              fontSize: 13,
              color: '#999' // 坐标值得具体的颜色
            }
          }
        },
        // ---  提示框 ----
        tooltip: {
          show: true, // 是否显示提示框，默认为true
          trigger: 'axis', // 数据项图形触发
          axisPointer: { // 指示样式
            type: 'shadow',
            // axis: 'auto',
            shadowStyle: { // 阴影指示器样式设置
              width: 'auto',
              color: 'rgba(229, 235, 247, 0.7)' // 阴影颜色
            }
          },
          extraCssText: 'box-shadow: 0px 0px 20px 1px rgba(0,0,0,0.2);',
          backgroundColor: '#FFFFFF', // 通过设置rgba调节背景颜色与透明度
          padding: 10,
          borderRadius: 4, // 边框圆角
          formatter: function (value) {
            var htmlStr = '<div>'
            var color = value[0].color
            htmlStr += `<p style="font-size: 12px"> ${value[0].name}</p>` // 获取纵坐标的值
            htmlStr += '<span min-height: 16px; font-size: 12px; font-family: Consolas; ' + color + '></span>'
            htmlStr += `
              <div style="display: flex; align-items: center; font-size: 12px;">
                <div style="width: 6px; height: 6px; background: ${color}; border-radius: 50%"></div>
                <div style="margin-left: 4px; color: #666666; font-size: 12px;">
                  内容发布数  <span  style="margin-left: 15px; color: #333"></span>${value[0].value}
                </div>
              </div>
            `
            return htmlStr
          },
          triggerEvent: true, // 设置为true后具有x轴文字过长，显示省略号，hover上去显示全部的功能
          textStyle: { // 提示框内容的样式
            color: '#666666'
          }
        },
        series: [{
          name: '内容发布',
          width: 'auto',
          legendHoverLink: true, // 是否启用图列 hover 时的联动高亮
          itemStyle: { // 图形的形状
            color: '#1DC4DE',
            normal: {
              color: '#1DC4DE',
              show: true,
              barBorderRadius: [2, 2, 0, 0],
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#333333',
                  fontSize: 14
                }
              }
            }
          },
          emphasis: {
            itemStyle: {
            }
          },
          barWidth: 40, // 柱形的宽度
          barCategoryGap: 60, // 柱形的间距
          data: [],
          type: 'bar',
          showBackground: false,
          backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)'
          }
        }]
      },
      params: {
        siteId: '',
        startDate: '',
        endDate: '',
        time2: 1,
        time: []
      }
    }
  },
  methods: {
    async getDatasColumn () {
      let paramsData = {
        startDate: this.params.startDate,
        endDate: this.params.endDate
      }
      if (this.tabName === 'columnChart') {
        paramsData.siteId = this.params.siteId
      } else {
        delete paramsData.siteId
      }
      if (this.tabName === 'siteColumn') {
        const res = await this.$request.fetchstatisticsSitegeneralSite(paramsData)
        if (res.code === 200) {
          this.dataInfo = res.data
          this.showPie()
        }
      } else if (this.tabName === 'orgColumn') {
        const res = await this.$request.fetchstatisticsSitegeneralOrg(paramsData)
        if (res.code === 200) {
          this.dataInfo = res.data
          this.showPie()
        }
      } else if (this.tabName === 'userColumn') {
        const res = await this.$request.fetchstatisticsSitegeneralUser(paramsData)
        if (res.code === 200) {
          this.dataInfo = res.data
          this.showPie()
        }
      } else if (this.tabName === 'columnChart') {
        const res = await this.$request.fetchstatisticsSitegeneralChannel(paramsData)
        if (res.code === 200) {
          this.dataInfo = res.data
          this.showPie()
        }
      }
    },
    initPie (pieOption) {
      // 基于准备好的dom，初始化echarts实例
      var myCharts = echarts.init(document.getElementById('test1'))
      // 绘制图表
      myCharts.resize({
        width: '1650px'
      })
      myCharts.setOption(pieOption)
    },
    showPie () {
      let arr = []
      let pieOption = Object.assign({}, this.pieOption)
      arr = this.dataInfo.publishs
      pieOption.xAxis.data = []
      for (let i in arr) {
        pieOption.xAxis.data.push(arr[i].name)
      }
      pieOption.series[0].data = this.dataInfo.publishs
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
            await this.getDatasColumn()
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
      await this.getDatasColumn()
    }
  },
  activated () {
    this.getDatasColumn()
  },
  mounted () {
    let date = []
    this.params.startDate = Nowdate.getFullYear() + '-' + M + '-' + date1
    this.params.endDate = Nowdate.getFullYear() + '-' + M + '-' + date1
    date.push(this.params.startDate)
    date.push(this.params.endDate)
    this.params.time = date
    this.$nextTick(() => {
      this.params.siteId = this.siteId
      this.getDatasColumn()
    })
  }
}
</script>
<style lang="scss" scoped>
  .member-pie-chart-wrap{
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
  .member-pie-chart-wrap{
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
