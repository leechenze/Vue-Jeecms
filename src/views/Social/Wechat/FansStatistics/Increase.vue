<template>
  <section class="social-WeChat-fansStatistics-increase">
  <el-button type="empty" size="small" @click="fetchWechatfansSync"><jee-icon iconClass='tongbu' style="margin-right:5px;margin-bottom: -1px;font-size: 15px;"></jee-icon>同步所有粉丝</el-button>
    <section class="totality">
      <div class="zooid">
        <p class="title">今日关注度</p>
        <div class="red">{{increaseToday.newUser}}<jee-icon iconClass="dizeng" class="xiangshang"/></div>
        <div class="zooid-bottom">
          <span>昨日</span>
          <span>{{increaseYesterday.newUser}}</span>
        </div>
      </div>
      <div class="zooid">
        <p class="title">今日取消关注度</p>
        <div class="bule">{{increaseToday.cancelUser}}<jee-icon iconClass="bubian" class="bubian"/></div>
        <div class="zooid-bottom">
          <span>昨日</span>
          <span>{{increaseYesterday.cancelUser}}</span>
        </div>
      </div>
      <div class="zooid">
        <p class="title">今日净增关注数</p>
        <div class="orange">{{increaseToday.netGrowthUser}}<jee-icon iconClass="dijian" class="xiangxia"/></div>
        <div class="zooid-bottom">
          <span>昨日</span>
          <span>{{increaseYesterday.netGrowthUser}}</span>
        </div>
      </div>
      <div class="zooid">
        <p class="title">累积关注人数</p>
        <div class="green">{{increaseToday.countUser}}</div>
      </div>
    </section>
    <div class="switcher">
      <el-radio-group v-model="radio1" size="small">
        <el-radio-button label="1">新增人数</el-radio-button>
        <el-radio-button label="2">取消关注人数</el-radio-button>
        <el-radio-button label="3">净增人数</el-radio-button>
        <el-radio-button label="4">累计人数</el-radio-button>
      </el-radio-group>
    </div>
    <div class="tendency">

        <search-header
      class="search-header"
        v-bind="searchHeader"
        :params="params"
        @handleSearch="handleSearchs"
        @handleFocus='handleFocus'
      ></search-header>
      <p class="title">趋势图</p>
      <v-chart :forceFit="true" :height="height" :data="curveData">
        <v-tooltip />
        <v-axis v-bind="axisOption({dataKey:'year'})"/>
        <v-axis v-bind="axisOption({dataKey:'人数'})"/>
        <v-line position="year*人数" :size="2" shape="smooth"
          :color="colorOption(0)[0]"
        />
        <v-area position="year*人数" shape="smooth"
          :color="colorOption(0)[1]"
        />
      </v-chart>
    </div>

      <search-header
      class="search-header"
      v-bind="searchHeader2"
      :params="params2"
      @handleBtn="handleBtn"
      @handleSearch="fetchwechatStatisticspage"
    ></search-header>
    <base-table
      v-bind="list"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      @sortChange="handleSortChange"
    >
    </base-table>
  </section>
</template>

<script>
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import { getData, getNewTime } from '@/utils'
import { mapGetters } from 'vuex'
// const DataSet = require('@antv/data-set')
export default {
  mixins: [searchHeader, baseTable],
  props: {
    name: {
      type: String,
      default: ''
    },
    activeId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      increaseToday: {},
      increaseYesterday: {},
      height: 380,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      labelConfig: ['percent', {
        formatter: (val, item) => {
          return item.point.item + ': ' + val
        }
      }],
      scale: [{
        dataKey: 'percent',
        min: 0,
        formatter: '.0%'
      }],
      radio: '1',
      radio1: '1',
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            value: 'time2',
            options: [
              {
                label: '最近7天',
                value: 1
              },
              {
                label: '最近15天',
                value: 2
              },
              {
                label: '最近30天',
                value: 3
              }
            ]
          },
          {
            type: 'dataPicker',
            value: 'time'
          },
          {
            type: 'select',
            value: 'userSource',
            options: [
              {
                label: '全部来源',
                value: ''
              },
              {
                label: '其他合计',
                value: 0
              },
              {
                label: '公众号搜索',
                value: 1
              },
              {
                label: '名片分享',
                value: 17
              },
              {
                label: '扫描二维码',
                value: 30
              },
              {
                label: '图文页右上角菜单',
                value: 43
              },
              {
                label: '支付后关注（在支付完成页）',
                value: 51
              },
              {
                label: '图文页内公众号名称',
                value: 57
              },
              {
                label: '公众号文章广告',
                value: 75
              },
              {
                label: '朋友圈广告',
                value: 78
              }
            ]
          }
        ]
      },
      searchHeader2: {
        searchItems: [
          {
            type: 'dataPicker',
            value: 'time'
          },
          {
            type: 'henderBtns',
            text: '下载表格',
            btnType: 'default',
            command: 'download'
          }
        ]
      },
      params: {
        time2: 3,
        time: [],
        userSource: '',
        beginDate: '',
        endDate: ''
      },
      params2: {
        time: [],
        beginDate: '',
        endDate: '',
        sortType: 1,
        order: false
      },
      curveData: [
      ],
      curveHeight: 500,
      list: {
        showSelection: false,
        showIndex: false,
        tableProps: {
          defaultSort: {
            prop: 'statisticsDates',
            order: 'descending'
          }
        },
        columns: [
          {
            type: 'time',
            prop: 'statisticsDates',
            label: '日期时间',
            minWidth: '175px',
            sortable: 'custom'
          },
          {
            prop: 'newUser',
            label: '新关注人数',
            minWidth: '175px',
            sortable: 'custom'
          },
          {
            prop: 'cancelUser',
            label: '取消关注人数',
            minWidth: '200px',
            sortable: 'custom'
          },
          {
            prop: 'netGrowthUser',
            label: '净增关注人数',
            minWidth: '175px',
            sortable: 'custom'
          },
          {
            prop: 'countUser',
            label: '累计关注人数',
            minWidth: '175px',
            sortable: 'custom'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('app', ['chartOption', 'axisOption', 'legendOption', 'colorOption']),
    getParams2 () {
      let params = {
        ...this.params2,
        appId: this.activeId,
        page: this.list.pageNo,
        size: this.list.pageSize
      }
      if (this.params2.time.length === 2) {
        params.beginDate = this.params2.time[0]
        params.endDate = this.params2.time[1]
      } else {
        params.beginDate = ''
        params.endDate = ''
      }
      return params
    }
  },
  methods: {
    getData,
    getNewTime,
    // 同步粉丝
    fetchWechatfansSync () {
      let appId = this.activeId
      this.$request.fetchWechatfansSync({ appId }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '同步成功',
            type: 'success'
          })
          this.inceraseSearchs()
        }
      })
    },
    inceraseSearchs () {
      this.fetchwechatStatistics()
      this.handleSearchs()
      this.fetchwechatStatisticspage()
    },
    fetchwechatStatistics () {
      let appId = this.activeId
      this.$request.fetchwechatStatistics({ appId }).then(res => {
        if (res.code === 200) {
          this.increaseToday = res.data[0].today
          this.increaseYesterday = res.data[0].yesterday
        }
      })
    },
    handleSearchs () {
      if (this.params.time2 !== '') {
        this.params.time = []
        this.params2.time = []
      }
      if (this.params.time2 === 1) {
        this.params.time[0] = this.getData(6)
        this.params.time[1] = this.getData(0)
        this.params2.time[0] = this.getData(6)
        this.params2.time[1] = this.getData(0)
      } else if (this.params.time2 === 2) {
        this.params.time[0] = this.getData(14)
        this.params.time[1] = this.getData(0)
        this.params2.time[0] = this.getData(14)
        this.params2.time[1] = this.getData(0)
      } else if (this.params.time2 === 3) {
        this.params.time[0] = this.getData(29)
        this.params.time[1] = this.getData(0)
        this.params2.time[0] = this.getData(29)
        this.params2.time[1] = this.getData(0)
      }
      if (this.params.time.length === 2) {
        this.params.beginDate = this.getNewTime(this.params.time[0])
        this.params.endDate = this.getNewTime(this.params.time[1])
        this.params2.beginDate = this.getNewTime(this.params2.time[0])
        this.params2.endDate = this.getNewTime(this.params2.time[1])
      }
      this.fetchwechatStatisticsMap()
      this.fetchwechatStatisticspage()
    },
    handleFocus () {
      this.params.time2 = ''
    },
    // 图表数据
    fetchwechatStatisticsMap () {
      this.params.appId = this.activeId
      this.$request.fetchwechatStatisticsMap(this.params).then(res => {
        if (res.code === 200) {
          this.curveData = []
          for (var i = 0; i < res.data.length; i++) {
            let obj = {}
            obj.year = res.data[i].date
            if (this.radio1 === '1') {
              obj.人数 = res.data[i].info.newUser
            } else if (this.radio1 === '2') {
              obj.人数 = res.data[i].info.cancelUser
            } else if (this.radio1 === '3') {
              obj.人数 = res.data[i].info.netGrowthUser
            } else if (this.radio1 === '4') {
              obj.人数 = res.data[i].info.countUser
            }
            this.curveData.push(obj)
          }
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 表格数据
    fetchwechatStatisticspage () {
      this.list.loading = true
      this.$request.fetchwechatStatisticspage(this.getParams2).then(res => {
        if (res.code === 200) {
          this.list.data = res.data.content
          this.list.totalCount = res.data.totalElements
          this.list.loading = false
        } else {
          this.list.loading = false
        }
      })
    },
    // 详细表排序
    handleSortChange (column, prop, order) {
      const sortItems = {
        statisticsDates: 1,
        newUser: 2,
        cancelUser: 3,
        netGrowthUser: 4,
        countUser: 5
      }
      if (sortItems[prop] && order) {
        this.params2.sortType = sortItems[prop]
        this.params2.order = order === 'ascending'
      } else {
        this.params2.sortType = 1
        this.params2.order = true
      }
      this.handleSearchs()
    },
    // 下载
    handleBtn (item) {
      if (item.command === 'download') {
        this.$request.fetchwechatStatisticsDownload(this.getParams2).then(res => {
          this.$exportClick(res, '粉丝统计.xls')
        })
      }
    },
    handleSizeChange (val) {
      this.list.pageSize = val
      this.fetchwechatStatisticspage()
    },
    handleCurrentChange (val) {
      this.list.pageNo = val
      this.fetchwechatStatisticspage()
    }
  },
  mounted () {
    this.inceraseSearchs()
  },
  watch: {
    activeId () {
      this.inceraseSearchs()
    },
    name () {
      if (this.name === '1') {
        this.inceraseSearchs()
      }
    },
    radio1 () {
      this.fetchwechatStatisticsMap()
    },
    'params.time2': function (newData) {

    }
  }
}
</script>

<style lang="scss">
  .social-WeChat-fansStatistics-increase{
    .title{
      color: #333;
      font-size: 16px;
      padding: 10px 20px;
    }
    .switcher{
      margin-top: 30px;
      margin-bottom: 20px;
    }
    .tendency{
      border:1px solid rgba(232,232,232,1);
      border-radius:4px;
      margin-bottom: 30px;
    }
    .totality{
      display: flex;
      margin-top: 20px;
      .zooid{
        width:280px;
        height:139px;
        border:1px solid rgba(232,232,232,1);
        box-sizing: border-box;
        border-radius:4px;
        margin-right: 30px;
        padding: 19px 20px;
        .xiangshang{
          fill: #DF2F4D;
          font-size: 54px;
          color: #DF2F4D;
          margin-left: 20px;
          margin-bottom: -8px;
        }
        .bubian{
          fill: #1E84E4;
          font-size: 54px;
          color: #1E84E4;
          margin-left: 20px;
          margin-bottom: -8px;
        }
        .xiangxia{
          fill: #FF803B;
          font-size: 54px;
          color: #FF803B;
          margin-left: 20px;
          margin-bottom: -8px;
        }
        .title{
          color: #333;
          font-size: 14px;
          padding: 0;
          font-weight: 400;
        }
        .red{
          color: #DF2F4D;
          font-size: 32px;
          margin: 5px 0 15px 0;
        }
        .bule{
          color: #1E84E4;
          font-size: 32px;
          margin: 5px 0 15px 0;
        }
        .orange{
          color: #FF803B;
          font-size: 32px;
          margin: 5px 0 15px 0;
        }
        .green{
          color: #38C060;
          font-size: 32px;
          padding-top: 15px;
        }
        .zooid-bottom{
          font-size: 14px;
          color: #999999;
          width: 60px;
          display: flex;
          justify-content: space-between;
        }
      }
      .zooid:last-child{
        margin-right: 0;
      }
    }
  }
</style>
