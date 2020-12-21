<template>
  <section class="social-WeChat-statistics-increase">
    <section class="totality">
      <div class="zooid">
        <v-chart :forceFit="true" v-if="radio1==='1'" :height="height" :data="newUserNew" :scale="scale" padding='auto'>
          <v-tooltip :showTitle="false" dataKey="item*percent" />
          <v-axis />
          <v-pie position="percent" :label="labelConfig" :select="false"
            :color="['item', ['#CF2342', '#DF2F4D', '#E9687E', '#ED8597', '#F1AAB6']]"
          />
          <v-coord type="theta" :radius="0.6" :innerRadius="0.5" />
        </v-chart>
        <v-chart :forceFit="true" v-if="radio1==='2'" :height="height" :data="newUserOld" :scale="scale" padding='auto'>
          <v-tooltip :showTitle="false" dataKey="item*percent" />
          <v-axis />
          <v-pie position="percent" :label="labelConfig" :select="false"
            :color="['item', ['#CF2342', '#DF2F4D', '#E9687E', '#ED8597', '#F1AAB6']]"
          />
          <v-coord type="theta" :radius="0.6" :innerRadius="0.5" />
        </v-chart>
        <div class="bottom-select">
          <el-radio v-model="radio1" label="1">今日关注数</el-radio>
          <el-radio v-model="radio1" label="2">昨日关注数</el-radio>
        </div>
      </div>
      <div class="zooid">
        <v-chart :forceFit="true" v-if="radio2==='1'" :height="height" :data="cancelUserNew" :scale="scale" padding='auto'>
          <v-tooltip :showTitle="false" dataKey="item*percent" />
          <v-axis />
          <v-pie position="percent" :label="labelConfig" :select="false"
            :color="['item', ['#317DCD', '#1E84E4', '#68AAE8', '#85BBED', '#ACD0F2']]"
          />
          <v-coord type="theta" :radius="0.6" :innerRadius="0.5" />
        </v-chart>
        <v-chart :forceFit="true" v-if="radio2==='2'" :height="height" :data="cancelUserOld" :scale="scale" padding='auto'>
          <v-tooltip :showTitle="false" dataKey="item*percent" />
          <v-axis />
          <v-pie position="percent" :label="labelConfig" :select="false"
            :color="['item', ['#317DCD', '#1E84E4', '#68AAE8', '#85BBED', '#ACD0F2']]"
          />
          <v-coord type="theta" :radius="0.6" :innerRadius="0.5" />
        </v-chart>
        <div class="bottom-select">
          <el-radio v-model="radio2" label="1">今日取消关注数</el-radio>
          <el-radio v-model="radio2" label="2">昨日取消关注数</el-radio>
        </div>
      </div>
      <div class="zooid">
        <v-chart :forceFit="true" v-if="radio3==='1'" :height="height" :data="netGrowthUserNew" :scale="scale" padding='auto'>
          <v-tooltip :showTitle="false" dataKey="item*percent" />
          <v-axis />
          <v-pie position="percent" :label="labelConfig" :select="false"
            :color="['item', ['#DF641F', '#FF803B', '#FB9D6A', '#FFAC7F', '#FFCEB3']]"
          />
          <v-coord type="theta" :radius="0.6" :innerRadius="0.5" />
        </v-chart>
        <v-chart :forceFit="true" v-if="radio3==='2'" :height="height" :data="netGrowthUserOld" :scale="scale" padding='auto'>
          <v-tooltip :showTitle="false" dataKey="item*percent" />
          <v-axis />
          <v-pie position="percent" :label="labelConfig" :select="false"
            :color="['item', ['#DF641F', '#FF803B', '#FB9D6A', '#FFAC7F', '#FFCEB3']]"
          />
          <v-coord type="theta" :radius="0.6" :innerRadius="0.5" />
        </v-chart>
        <div class="bottom-select">
          <el-radio v-model="radio3" label="1">今日净增关注数</el-radio>
          <el-radio v-model="radio3" label="2">昨日净增关注数</el-radio>
        </div>
      </div>
      <div class="zooid">
        <v-chart :forceFit="true" :height="height" :data="countUser" :scale="scale" padding='auto'>
          <v-tooltip :showTitle="false" dataKey="item*percent" />
          <v-axis />
          <v-pie position="percent" :label="labelConfig" :select="false"
            :color="['item', ['#1AAB46', '#38C060', '#56CE7A', '#79D795', '#B3E3C1']]"
          />
          <v-coord type="theta" :radius="0.6" :innerRadius="0.5" />
        </v-chart>
        <div class="bottom-select">
          累计关注人数
        </div>
      </div>
    </section>
    <div class="switcher">
      <el-radio-group v-model="searchRadio" size="small">
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
      <v-chart :force-fit="true" :height="curveHeight" :data="curveData" :scale="scale">
        <v-tooltip />
        <v-axis v-bind="axisOption({dataKey:'year'})"/>
        <v-axis v-bind="axisOption({dataKey:'人数'})"/>
        <v-legend />
        <v-line position="year*人数" :size="2" shape="smooth"
          :color="colorOption(0)[0]"
        />
      </v-chart>
    </div>
    <div class="amount">

      <search-header
      class="search-header"
      v-bind="searchHeader2"
      :params="params2"
      @handleBtn="handleBtn"
      @handleSearch="fetchWechatfansStatisticsPageSum"
    ></search-header>
    <base-table
      v-bind="list"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
    >
    </base-table>
    </div>
  </section>
</template>

<script>
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import { getData, getNewTime } from '@/utils'
import { mapGetters } from 'vuex'
const DataSet = require('@antv/data-set')
export default {
  mixins: [searchHeader, baseTable],
  data () {
    return {
      newUserNew: [],
      newUserOld: [],
      cancelUserNew: [],
      cancelUserOld: [],
      netGrowthUserNew: [],
      netGrowthUserOld: [],
      countUser: [],
      attentionData: [],
      height: 230,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      labelConfig: ['percent', {
        formatter: (val, item) => {
          return item.point.item + ': ' + val
        },
        textStyle: {
          fill: '#333333',
          fontSize: 14,
          fontWeight: 100
        }
      }],
      scale: [{
        dataKey: 'percent',
        min: 0,
        formatter: '.0%'
      }],
      radio1: '1',
      radio2: '1',
      radio3: '1',
      searchRadio1: '1',
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
        userSource: '',
        time2: 3,
        time: []
      },
      params2: {
        userSource: '',
        time: [],
        beginDate: '',
        endDate: '',
        sortType: 1,
        order: false
      },
      curveData: [],
      sourceData2: [
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
      },
      searchRadio: 1
    }
  },
  computed: {
    ...mapGetters('app', ['chartOption', 'axisOption', 'legendOption', 'colorOption']),
    getParams2 () {
      let params = {
        ...this.params2,
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
    inceraseSearchs () {
      this.fetchwechatStatisticsCollect()
      this.handleSearchs()
      this.fetchWechatfansStatisticsPageSum()
    },
    // 用户增长
    fetchwechatStatisticsCollect () {
      this.$request.fetchwechatStatisticsCollect().then(res => {
        if (res.code === 200) {
          this.newUserNew = []
          this.newUserOld = []
          this.cancelUserNew = []
          this.cancelUserOld = []
          this.netGrowthUserNew = []
          this.netGrowthUserOld = []
          this.countUser = []
          for (var i = 0; i < res.data.length; i++) {
            var newUserNewObj = {}
            var newUserOldObj = {}
            var cancelUserNewObj = {}
            var cancelUserOldObj = {}
            var netGrowthUserNewObj = {}
            var netGrowthUserOldObj = {}
            var countUserObj = {}

            newUserNewObj.item = res.data[i].today.name
            newUserNewObj.count = res.data[i].today.newUser
            newUserOldObj.item = res.data[i].yesterday.name
            newUserOldObj.count = res.data[i].yesterday.newUser

            cancelUserNewObj.item = res.data[i].today.name
            cancelUserNewObj.count = res.data[i].today.cancelUser
            cancelUserOldObj.item = res.data[i].yesterday.name
            cancelUserOldObj.count = res.data[i].yesterday.cancelUser

            netGrowthUserNewObj.item = res.data[i].today.name
            netGrowthUserNewObj.count = res.data[i].today.netGrowthUser
            netGrowthUserOldObj.item = res.data[i].yesterday.name
            netGrowthUserOldObj.count = res.data[i].yesterday.netGrowthUser

            countUserObj.item = res.data[i].today.name
            countUserObj.count = res.data[i].today.countUser

            this.newUserNew.push(newUserNewObj)
            this.newUserOld.push(newUserOldObj)
            this.cancelUserNew.push(cancelUserNewObj)
            this.cancelUserOld.push(cancelUserOldObj)
            this.netGrowthUserNew.push(netGrowthUserNewObj)
            this.netGrowthUserOld.push(netGrowthUserOldObj)
            this.countUser.push(countUserObj)
          }
          this.getAttentionData(this.newUserNew, 'newUserNew')
          this.getAttentionData(this.newUserOld, 'newUserOld')
          this.getAttentionData(this.cancelUserNew, 'cancelUserNew')
          this.getAttentionData(this.cancelUserOld, 'cancelUserOld')
          this.getAttentionData(this.netGrowthUserNew, 'netGrowthUserNew')
          this.getAttentionData(this.netGrowthUserOld, 'netGrowthUserOld')
          this.getAttentionData(this.countUser, 'countUser')
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    handleFocus () {
      this.params.time2 = ''
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
      this.fetchwechatStatisticsMapCollect()
      this.fetchWechatfansStatisticsPageSum()
    },
    // 用户趋势
    fetchwechatStatisticsMapCollect () {
      this.$request.fetchwechatStatisticsMapCollect(this.params).then(res => {
        if (res.code === 200) {
          this.curveData = []
          for (var i = 0; i < res.data.length; i++) {
            let obj = {}
            obj.year = res.data[i].date
            if (this.searchRadio === 1) {
              obj.人数 = res.data[i].info.newUser
            } else if (this.searchRadio === 2) {
              obj.人数 = res.data[i].info.cancelUser
            } else if (this.searchRadio === 3) {
              obj.人数 = res.data[i].info.netGrowthUser
            } else if (this.searchRadio === 4) {
              obj.人数 = res.data[i].info.countUser
            }
            this.curveData.push(obj)
          }
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    fetchWechatfansStatisticsPageSum () {
      this.list.loading = true
      this.$request.fetchWechatfansStatisticsPageSum(this.getParams2).then(res => {
        if (res.code === 200) {
          this.list.data = res.data.content
          this.list.totalCount = res.data.totalElements
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    getAttentionData (data, string) {
      let dv = new DataSet.View().source(data)
      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent'
      })
      this[string] = dv.rows
    },
    getAttentionData2 (data) {
      let dv = new DataSet.View().source(data)
      dv.transform({
        type: 'fold',
        fields: ['Tokyo', 'London'],
        key: 'city',
        value: 'temperature'
      })
      this[data] = dv.rows
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
          this.$exportClick(res, '粉丝汇总.xls')
        })
      }
    },
    handleSizeChange (val) {
      this.list.pageSize = val
      this.fetchWechatfansStatisticsPageSum()
    },
    handleCurrentChange (val) {
      this.list.pageNo = val
      this.fetchWechatfansStatisticsPageSum()
    }
  },
  mounted () {
    this.inceraseSearchs()
  },
  watch: {
    searchRadio () {
      this.handleSearchs()
    }
  }
}
</script>

<style lang="scss">
  .social-WeChat-statistics-increase{
    overflow-x: scroll;
    overflow-y: scroll;
    .title{
      color: #333;
      font-size: 16px;
      padding: 10px 20px;
    }
    .switcher{
      margin-top: 30px;
      margin-bottom: 20px;
    }
    .amount{
      min-width: 1400px;
    }
    .tendency{
      border:1px solid rgba(232,232,232,1);
      border-radius:4px;
      margin-bottom: 30px;
      min-width: 1400px;
    }
    .totality{
      display: flex;
      margin-top: 10px;
      .zooid{
        width: 380px;
        height: 305px;
        box-sizing: border-box;
        padding: 25px 0;
        border:1px solid rgba(232,232,232,1);
        border-radius:4px;
        margin-right: 30px;
        min-width: 320px;
        .bottom-select{
          text-align: center;
          font-size: 16px;
        }
      }
      .zooid:last-child{
        margin-right: 0;
      }
      .zooid:nth-of-type(1){
        .bottom-select{
          .el-radio.is-checked{
            .el-radio__inner{
              border-color: #DF2F4D;
              background: #DF2F4D;
            }
            .el-radio__label{
              color: #DF2F4D;
            }
          }
        }
      }
      .zooid:nth-of-type(2){
        .bottom-select{
          .el-radio.is-checked{
            .el-radio__inner{
              border-color: #1E84E4;
              background: #1E84E4;
            }
            .el-radio__label{
              color: #1E84E4;
            }
          }
        }
      }
      .zooid:nth-of-type(3){
        .bottom-select{
          .el-radio.is-checked{
            .el-radio__inner{
              border-color: #FF803B;
              background: #FF803B;
            }
            .el-radio__label{
              color: #FF803B;
            }
          }
        }
      }
      .zooid:nth-of-type(4){
        .bottom-select{
          color: #38C060;
        }
      }
    }
  }
</style>
