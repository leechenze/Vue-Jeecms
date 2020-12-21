<template>
  <section class="statistics-general-index-container scrollbar">
    <section style="min-width: 1500px;">
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
    <section class="today-box">
      <h3 >网站信息</h3>
      <div class="today-content">
        <ul class="first-today">
          <li>内容发布数</li>
          <li><span>今日</span><span style="color:#DF2F4D">{{listData.contentPublish.today}}</span></li>
          <li><span>昨天</span><span class="yesterday-wrap">{{listData.contentPublish.yesterday}}</span></li>
          <li><span>历史最高</span><span>{{listData.contentPublish.high}}</span></li>
          <li><span>累计</span><span>{{listData.contentPublish.sum}}</span></li>
        </ul>
        <ul>
          <li>微信文章发布数</li>
          <li><span>今日</span><span style="color:#1E84E4">{{listData.wechatPublish.today}}</span></li>
          <li><span>昨天</span><span class="yesterday-wrap">{{listData.wechatPublish.yesterday}}</span></li>
          <li><span>历史最高</span><span>{{listData.wechatPublish.high}}</span></li>
          <li><span>累计</span><span>{{listData.wechatPublish.sum}}</span></li>
        </ul>
        <ul>
          <li>微博文章发布数</li>
          <li><span>今日</span><span style="color:#E7B40E">{{listData.weiboPublish.today}}</span></li>
          <li><span>昨天</span><span class="yesterday-wrap">{{listData.weiboPublish.yesterday}}</span></li>
          <li><span>历史最高</span><span>{{listData.weiboPublish.high}}</span></li>
          <li><span>累计</span><span>{{listData.weiboPublish.sum}}</span></li>
        </ul>
        <ul>
          <li>新增评论数</li>
          <li><span>今日</span><span style="color:#1EBBBA">{{listData.addComment.today}}</span></li>
          <li><span>昨天</span><span class="yesterday-wrap">{{listData.addComment.yesterday}}</span></li>
          <li><span>历史最高</span><span>{{listData.addComment.high}}</span></li>
          <li><span>累计</span><span>{{listData.addComment.sum}}</span></li>
        </ul>
        <ul class="last-toady">
          <li>新建栏目数</li>
          <li><span>今日</span><span style="color:#38C060">{{listData.addChannel.today}}</span></li>
          <li><span>昨天</span><span class="yesterday-wrap">{{listData.addChannel.yesterday}}</span></li>
          <li><span>历史最高</span><span>{{listData.addChannel.high}}</span></li>
          <li><span>累计</span><span>{{listData.addChannel.sum}}</span></li>
        </ul>
      </div>
    </section>
    <section class="today-box p-today-box">
      <!-- <h3>今日流量</h3> -->
      <div class="tabAll" >
        <div class="tabName" :class="[tabShowName === item.value?'tabShow':'']" v-for="(item,index) in tabData" :key="index" @click="handTabNameData(item)"> {{item.name}}</div>
      </div>
      <div class="today-content" v-show="tabShowName === 'today'">
        <ul class="first-today">
          <li>浏览量(PV) <jee-popover popoverText="即通常说的Page View(PV)，用户每打开一个网站页面就被记录1次。用户多次打开同一页面，浏览量值累计。"/></li>
          <li><span>今日</span><span style="color:#DF2F4D">{{todayData.now.pv}}</span></li>
          <li><span>昨天</span><span class="yesterday-wrap">{{todayData.yesterday.pv}}</span></li>
          <li><span>历史最高</span><span>{{todayData.highest.pv}}</span></li>
          <li><span>累计</span><span>{{ todayData.sum.pv }}</span></li>
        </ul>
        <ul>
          <li>访客数(UV) <jee-popover popoverText="一天之内您网站的独立访客数(优先以用户名为依据，匿名用户以Cookie为依据)，一天内同一访客多次访问您网站只计算1个访客。"/></li>
          <li><span>今日</span><span style="color:#1E84E4">{{todayData.now.uv}}</span></li>
          <li><span>昨天</span><span class="yesterday-wrap">{{todayData.yesterday.uv}}</span></li>
          <li><span>历史最高</span><span>{{todayData.highest.uv}}</span></li>
          <li><span>累计</span><span>{{todayData.sum.uv}}</span></li>
        </ul>
        <ul>
          <li>IP数 <jee-popover popoverText="一天之内您网站的独立访问ip数。"/></li>
          <li><span>今日</span><span style='color:#E7B40E'>{{todayData.now.ip}}</span></li>
          <li><span>昨天</span><span class="yesterday-wrap">{{todayData.yesterday.ip}}</span></li>
          <li><span>历史最高</span><span>{{todayData.highest.ip}}</span></li>
          <li><span>累计</span><span>{{todayData.sum.ip}}</span></li>
        </ul>
        <ul>
          <li>跳出率 <jee-popover popoverText="只浏览了一个页面便离开了网站的访问次数占总的访问次数的百分比。"/></li>
          <li><span>今日</span><span style="color:#1EBBBA">{{(todayData.now.depthNum||0)+'%'}}</span></li>
          <li><span>昨天</span><span class="yesterday-wrap">{{(todayData.yesterday.depthNum||0)+'%'}}</span></li>
          <li><span>历史最高</span><span>{{(todayData.highest.depthNum||0)+'%'}}</span></li>
          <!-- <li><span>累计</span><span>{{todayData.sum.time ? todayData.sum.time + '%' : todayData.sum.timeString}}</span></li> -->
        </ul>
        <ul class="last-toady">
          <li>平均访问时长 <jee-popover popoverText="访客在一次访问中，平均打开网站的时长。即每次访问中，打开第一个页面到关闭最后一个页面的平均值，打开一个页面时计算打开关闭的时间差。"/></li>
          <li><span>今日</span><span style="color:#38C060">{{todayData.now.time}}</span></li>
          <li><span>昨天</span><span class="yesterday-wrap">{{todayData.yesterday.time}}</span></li>
          <li><span>历史最高</span><span>{{todayData.highest.time}}</span></li>
          <!-- <li><span>累计</span><span>{{todayData.sum.time ? todayData.sum.time + '%' : todayData.sum.timeString }}</span></li> -->
        </ul>
      </div>

      <div v-show="tabShowName === 'contribution'">
        <div class="contribution">
          <contribution class="contribution-left" @func="getcontributionSon" :siteId="siteId"> </contribution>
          <column class="contribution-right" :siteId="siteId" :funName="funName"> </column>
        </div>
      </div>
    </section>
      <search-header
      class="search-header"
      :params="time"
      v-bind="searchHeaders"
      @handleSearch="handleSearchs"
    ></search-header>
    <section class="statistics">
      <div class="tendency statistics-box">
        <div class="title">
          <span>趋势图</span>
          <span class="jee-color" @click="goToTendency">查看更多</span>
        </div>
        <div class="select">
          <el-radio-group v-model="tendencyRadio">
            <el-radio :label="1">浏览量(PV)</el-radio>
            <el-radio :label="2">访客数(UV)</el-radio>
            <el-radio :label="3">IP数</el-radio>
            <el-radio :label="4">跳出率</el-radio>
            <el-radio :label="5">平均访问时长</el-radio>
          </el-radio-group>
        </div>
        <tendency :tendencyFields='tendencyFields' :tendencyData='revealData' ></tendency>
      </div>
      <div class="visitor statistics-box">
        <div class="line"></div>
        <div class="title">
          <span>新老访客</span>
          <span class="jee-color" @click="goToVisitor">查看更多</span>
        </div>
        <div style="display:flex;">
          <div style="width:50%;margin-right:30px;">
            <visitor :rate='visitorObj.newRate||0' label='新访客'></visitor>
          </div>
          <div style="width:50%;margin-left:30px;">
            <visitor :rate='visitorObj.oldRate||0' label='老访客'></visitor>
          </div>
        </div>
        <div style="display:flex">
          <div style="width:50%;" class="visitor-box">
            <p><span><strong></strong>浏览量</span><span>{{visitorObj.newPv||0}}</span></p>
            <p><span><strong></strong>访客数</span><span>{{visitorObj.newUv||0}}</span></p>
            <p><span><strong></strong>跳出率</span><span>{{visitorObj.newJump||'0%'}}</span></p>
            <p><span><strong></strong>平均访问时长</span><span>{{visitorObj.newTime||'00:00:00'}}</span></p>
          </div>
          <div style="width:50%;" class="visitor-box">
            <p><span><strong></strong>浏览量</span><span>{{visitorObj.oldPv||0}}</span></p>
            <p><span><strong></strong>访客数</span><span>{{visitorObj.oldUv||0}}</span></p>
            <p><span><strong></strong>跳出率</span><span>{{visitorObj.oldJump||'0%'}}</span></p>
            <p><span><strong></strong>平均访问时长</span><span>{{visitorObj.oldTime||'00:00:00'}}</span></p>
          </div>
        </div>
      </div>
      <div class="source statistics-box">
        <div class="title">
          <span>Top10来源网站</span>
          <span class="jee-color" @click="goToSource">查看更多</span>
        </div>
        <base-table v-bind="sourceList">
        </base-table>
      </div>
      <div class="entrance statistics-box">
        <div class="title">
          <span>Top10入口页面</span>
          <span class="jee-color" @click="goToEntrance">查看更多</span>
        </div>
        <base-table v-bind="entranceList">
          <template #url="scope">
            <a class="jee-color" :href="scope.scope.row.url" target="_blank">{{scope.scope.row.url}}</a>
          </template>
        </base-table>
      </div>
      <div class="interviewee statistics-box">
        <div class="title">
          <span>Top10受访页面</span>
          <span class="jee-color" @click="goToInterviewer">查看更多</span>
        </div>
        <base-table v-bind="intervieweeList">
          <template #url="scope">
            <a class="jee-color" :href="scope.scope.row.url" target="_blank">{{scope.scope.row.url}}</a>
          </template>
        </base-table>
      </div>
      <div class="territory statistics-box">
        <div class="title">
          <span>地域分布</span>
          <span class="jee-color" @click="goToTerritory">查看更多</span>
        </div>
        <territory :territoryList="territoryList"></territory>
      </div>
    </section>
    </section>
  </section>
</template>
<script>
import tendency from './Tendency'
import territory from './Territory'
import visitor from './visitor'
import contribution from './Contribution'
import column from './Column'
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import { transverterMss, getTime, getDateByTimestamp } from '@/utils'
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  name: 'statisticsGeneral',
  mixins: [baseHeader, searchHeader, baseTable],
  components: {
    territory,
    tendency,
    visitor,
    contribution,
    column
  },
  data () {
    return {
      funName: '',
      listData: {
        contentPublish: {},
        addChannel: {},
        addComment: {},
        wechatPublish: {},
        weiboPublish: {}
      },
      tabShowName: 'today', // 显示隐藏今日流浪和流量贡献值的切换
      tabData: [ // 头部切换名称
        {
          name: '今日流量',
          value: 'today'
        },
        {
          name: '流量贡献值',
          value: 'contribution'
        }
      ],
      websiteList: [], // 网站信息统计保存值
      headers: {
        buttons: [],
        title: '操作说明',
        showAlertIcon: true,
        content: '提供目标网站运营状况的整体情况，包括各个时间维度相关指标的趋势、访客来源、关注热点、访客属性等宏观数据。助您了解网站的概况性数据。'
      },
      options: [],
      siteId: null,
      todayData: {
        highest: {
          depthNum: null,
          ip: null,
          pv: null,
          time: null,
          uv: null
        },
        now: {
          depthNum: null,
          ip: null,
          pv: null,
          time: null,
          uv: null
        },
        yesterday: {
          depthNum: null,
          ip: null,
          pv: null,
          time: null,
          uv: null
        },
        sum: {
          depthNum: null,
          ip: null,
          pv: null,
          time: null,
          uv: null
        }
      },
      searchHeaders: {
        searchItems: [
          {
            type: 'cutButton',
            value: 'time',
            label: '时间:',
            options: [
              {
                label: '今日',
                value: 0
              },
              {
                label: '昨天',
                value: 1
              },
              {
                label: '最近七天',
                value: 2
              },
              {
                label: '最近30天',
                value: 3
              }
            ]
          }
        ]
      },
      time: {
        time: 0
      },
      minTime: null,
      maxTime: null,
      tendencyData: [],
      tendencyHeight: 350,
      tendencyRadio: 1,
      tendencyFields: [],
      sourceList: {
        columns: [
          {
            label: '来源网站',
            prop: 'name'
          },
          {
            label: '浏览量(PV)',
            prop: 'pvs',
            align: 'right'
          },
          {
            label: '占比',
            prop: 'proportion',
            align: 'right',
            formatter: (row, column, cellValue, index) => cellValue + '%'
          }
        ],
        showSelection: false,
        showPagination: false,
        showIndex: false,
        data: []
      },
      entranceList: {
        columns: [
          {
            scopeType: 'slot',
            label: '入口页面',
            prop: 'url',
            minWidth: '300px',
            showOverflowTooltip: true
          },
          {
            label: '浏览量(PV)',
            prop: 'pvs',
            align: 'right'
          },
          {
            label: '占比',
            prop: 'proportion',
            align: 'right',
            formatter: (row, column, cellValue, index) => cellValue + '%'
          }
        ],
        showSelection: false,
        showPagination: false,
        showIndex: false
      },
      intervieweeList: {
        columns: [
          {
            scopeType: 'slot',
            label: '受访页面',
            prop: 'url',
            minWidth: '300px',
            showOverflowTooltip: true
          },
          {
            label: '浏览量(PV)',
            prop: 'pvs',
            align: 'right'
          },
          {
            label: '占比',
            prop: 'proportion',
            align: 'right',
            formatter: (row, column, cellValue, index) => cellValue + '%'
          }
        ],
        showSelection: false,
        showPagination: false,
        showIndex: false
      },
      visitorObj: {},
      territoryList: [],
      revealData: [],
      nowTime: null,
      yesterdayTime: null
    }
  },
  computed: {
    ...mapGetters(['ownSiteOptions', 'currentSiteId'])
  },
  methods: {
    ...mapActions('config', ['FetchSitesOwnsite']),
    getTime,
    getcontributionSon (data) {
      this.funName = data.name
    },
    handleSearchs () {
      // 获取三十天前日期
      if (this.time.time === 0) {
        this.minTime = this.getTime(0)
        this.maxTime = this.getTime(0)
      } else if (this.time.time === 1) {
        this.minTime = this.getTime(1)
        this.maxTime = this.getTime(1)
      } else if (this.time.time === 2) {
        this.minTime = this.getTime(6)
        this.maxTime = this.getTime(0)
      } else if (this.time.time === 3) {
        this.minTime = this.getTime(29)
        this.maxTime = this.getTime(0)
      } else {
        this.minTime = null
        this.maxTime = null
      }
      this.fetchStatisticsImage()
      this.fetchStatisticsvisitSummarize()
      this.fetchStatisticsSourceSourceUrlPage()
      this.fetchStatisticsAccessPageEntrancePage()
      this.fetchStatisticsAccessPageAccessPage()
      this.fetchStatisticsvisitSummarizeArea()
      this.handWebsiteListData()
    },
    // 趋势图表
    fetchStatisticsImage () {
      let params = {}
      params.siteId = this.siteId
      params.showStyle = 1
      params.showType = this.tendencyRadio
      if (this.time.time === 0) {
        this.tendencyFields = []
        if (this.tendencyRadio === 1) {
          this.tendencyFields[0] = '昨日浏览量'
          this.tendencyFields[1] = '今日浏览量'
        } else if (this.tendencyRadio === 2) {
          this.tendencyFields[0] = '昨日访客数'
          this.tendencyFields[1] = '今日访客数'
        } else if (this.tendencyRadio === 3) {
          this.tendencyFields[0] = '昨日IP数'
          this.tendencyFields[1] = '今日IP数'
        } else if (this.tendencyRadio === 4) {
          this.tendencyFields[0] = '昨日跳出率'
          this.tendencyFields[1] = '今日跳出率'
        } else if (this.tendencyRadio === 5) {
          this.tendencyFields[0] = '昨日访问时长'
          this.tendencyFields[1] = '今日访问时长'
        }

        params.minTime = this.getTime(1)
        params.maxTime = this.getTime(1)
        this.$request.fetchStatisticsImage(params).then(res => {
          if (res.code === 200) {
            this.tendencyData = res.data.array
            for (var i = 0; i < res.data.array.length; i++) {
              if (this.tendencyRadio === 1) {
                this.tendencyData[i].昨日浏览量 = res.data.array[i].pv
              } else if (this.tendencyRadio === 2) {
                this.tendencyData[i].昨日访客数 = res.data.array[i].uv
              } else if (this.tendencyRadio === 3) {
                this.tendencyData[i].昨日IP数 = res.data.array[i].ip
              } else if (this.tendencyRadio === 4) {
                this.tendencyData[i].昨日跳出率 = res.data.array[i].depthNum
              } else if (this.tendencyRadio === 5) {
                this.tendencyData[i].昨日访问时长 = res.data.array[i].time
              }
            }
            params.minTime = this.getTime(0)
            params.maxTime = this.getTime(0)
            this.$request.fetchStatisticsImage(params).then(res => {
              if (res.code === 200) {
                for (var i = 0; i < res.data.array.length; i++) {
                  if (this.tendencyRadio === 1) {
                    this.tendencyData[i].今日浏览量 = res.data.array[i].pv
                  } else if (this.tendencyRadio === 2) {
                    this.tendencyData[i].今日访客数 = res.data.array[i].uv
                  } else if (this.tendencyRadio === 3) {
                    this.tendencyData[i].今日IP数 = res.data.array[i].ip
                  } else if (this.tendencyRadio === 4) {
                    this.tendencyData[i].今日跳出率 = res.data.array[i].depthNum
                  } else if (this.tendencyRadio === 5) {
                    this.tendencyData[i].今日访问时长 = res.data.array[i].time
                  }
                }

                this.revealData = this.tendencyData
              }
            })
          }
        })
      } else {
        this.tendencyFields = []
        if (this.tendencyRadio === 1) {
          this.tendencyFields[0] = '浏览量'
        } else if (this.tendencyRadio === 2) {
          this.tendencyFields[0] = '访客数'
        } else if (this.tendencyRadio === 3) {
          this.tendencyFields[0] = 'IP数'
        } else if (this.tendencyRadio === 4) {
          this.tendencyFields[0] = '跳出率'
        } else if (this.tendencyRadio === 5) {
          this.tendencyFields[0] = '访问时长'
        }
        params.minTime = this.minTime
        params.maxTime = this.maxTime
        if (this.time.time === 2 || this.time.time === 3) {
          params.showStyle = 2
        } else {
          params.showStyle = 1
        }
        this.$request.fetchStatisticsImage(params).then(res => {
          if (res.code === 200) {
            this.tendencyData = res.data.array
            for (var i = 0; i < res.data.array.length; i++) {
              if (this.tendencyRadio === 1) {
                this.tendencyData[i].浏览量 = res.data.array[i].pv
              } else if (this.tendencyRadio === 2) {
                this.tendencyData[i].访客数 = res.data.array[i].uv
              } else if (this.tendencyRadio === 3) {
                this.tendencyData[i].IP数 = res.data.array[i].ip
              } else if (this.tendencyRadio === 4) {
                this.tendencyData[i].跳出率 = res.data.array[i].depthNum
              } else if (this.tendencyRadio === 5) {
                this.tendencyData[i].访问时长 = res.data.array[i].time
              }
            }
            this.revealData = this.tendencyData
          }
        })
      }
    },
    // 客户数据
    fetchStatisticsvisitSummarize () {
      let params = {}
      params.siteId = this.siteId
      params.startTime = this.minTime
      params.endTime = this.maxTime
      this.$request.fetchStatisticsvisitSummarize(params).then(res => {
        if (res.code === 200) {
          if (res.data.length) {
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].isNew) {
                this.visitorObj.newName = '新访客'
                this.visitorObj.newPv = res.data[i].pv
                this.visitorObj.newUv = res.data[i].uv
                this.visitorObj.newJump = Math.round((res.data[i].jump * 100)) + '%'
                this.visitorObj.newTime = transverterMss(res.data[i].visitTime)
              } else {
                this.visitorObj.oldName = '老访客'
                this.visitorObj.oldPv = res.data[i].pv
                this.visitorObj.oldUv = res.data[i].uv
                this.visitorObj.oldJump = Math.round((res.data[i].jump * 100)) + '%'
                this.visitorObj.oldTime = transverterMss(res.data[i].visitTime)
              }
            }
          } else {
            this.visitorObj.newName = '新访客'
            this.visitorObj.newPv = 0
            this.visitorObj.newUv = 0
            this.visitorObj.newJump = 0 + '%'
            this.visitorObj.newTime = 0
            this.visitorObj.oldName = '老访客'
            this.visitorObj.oldPv = 0
            this.visitorObj.oldUv = 0
            this.visitorObj.oldJump = 0 + '%'
            this.visitorObj.oldTime = 0
          }
          this.visitorObj.newRate = (this.visitorObj.newUv / (this.visitorObj.newUv + this.visitorObj.oldUv)) * 10 + ''
          this.visitorObj.newRate = this.visitorObj.newRate.substring(0, this.visitorObj.newRate.indexOf('.') + 4)
          this.visitorObj.newRate = Number(this.visitorObj.newRate)
          if (this.visitorObj.newRate === 0) {
            this.visitorObj.oldRate = this.visitorObj.oldUv * 10 + ''
          } else {
            this.visitorObj.oldRate = 10 - this.visitorObj.newRate
          }
          console.log(this.visitorObj)
        }
      })
    },
    // 来源网站
    fetchStatisticsSourceSourceUrlPage () {
      let params = {}
      params.siteId = this.siteId
      params.beginTime = getDateByTimestamp(this.minTime)
      params.endTime = getDateByTimestamp(this.maxTime)
      params.page = 1
      params.size = 10
      this.$request.fetchStatisticsSourceSourceUrlPage(params).then(res => {
        if (res.code === 200) {
          this.sourceList.data = res.data.content
        }
      })
    },
    // 入口页面
    fetchStatisticsAccessPageEntrancePage () {
      let params = {}
      params.siteId = this.siteId
      params.beginTime = this.minTime
      params.endTime = this.maxTime
      params.page = 1
      params.size = 10
      this.$request.fetchStatisticsAccessPageEntrancePage(params).then(res => {
        if (res.code === 200) {
          this.entranceList.data = res.data.page.content
        }
      })
    },
    // 受访页面
    fetchStatisticsAccessPageAccessPage () {
      let params = {}
      params.siteId = this.siteId
      params.beginTime = this.minTime
      params.endTime = this.maxTime
      params.page = 1
      params.size = 10
      this.$request.fetchStatisticsAccessPageAccessPage(params).then(res => {
        if (res.code === 200) {
          this.intervieweeList.data = res.data.page.content
        }
      })
    },
    // 区域分布
    fetchStatisticsvisitSummarizeArea () {
      let params = {}
      params.siteId = this.siteId
      params.startTime = this.minTime
      params.endTime = this.maxTime
      this.$request.fetchStatisticsvisitSummarizeArea(params).then(res => {
        if (res.code === 200) {
          this.territoryList = res.data
        }
      })
    },
    // 今日流量
    fetchStatisticsFlowOverview () {
      let siteId = this.siteId
      this.$request.fetchStatisticsFlowOverview({ siteId }).then(res => {
        if (res.code === 200) {
          this.todayData = res.data
          this.todayData.now.pv = this.todayData.now.pv.toLocaleString('en-US')
          this.todayData.yesterday.pv = this.todayData.yesterday.pv.toLocaleString('en-US')
          this.todayData.highest.pv = this.todayData.highest.pv.toLocaleString('en-US')

          this.todayData.now.uv = this.todayData.now.uv.toLocaleString('en-US')
          this.todayData.yesterday.uv = this.todayData.yesterday.uv.toLocaleString('en-US')
          this.todayData.highest.uv = this.todayData.highest.uv.toLocaleString('en-US')

          this.todayData.now.ip = this.todayData.now.ip.toLocaleString('en-US')
          this.todayData.yesterday.ip = this.todayData.yesterday.ip.toLocaleString('en-US')
          this.todayData.highest.ip = this.todayData.highest.ip.toLocaleString('en-US')

          this.nowTime = this.todayData.now.time
          this.yesterdayTime = this.todayData.yesterday.time
          this.todayData.highest.time = transverterMss(res.data.highest.time)
          this.todayData.now.time = transverterMss(res.data.now.time)
          this.todayData.yesterday.time = transverterMss(res.data.yesterday.time)
        }
      })
    },
    goToTendency () {
      this.$routerLink('/statistics/flow/tendency')
    },
    goToVisitor () {
      this.$routerLink('/statistics/visitor/visitor')
    },
    goToSource () {
      this.$routerLink('/statistics/source/index')
    },
    goToEntrance () {
      this.$routerLink('/statistics/interviewer/entrance')
    },
    goToInterviewer () {
      this.$routerLink('/statistics/interviewer/index')
    },
    goToTerritory () {
      this.$routerLink('/statistics/visitor/territory')
    },
    async handWebsiteListData () {
      let siteId = this.siteId
      let list = await this.$request.fetchstatisticsSitegeneralInfo({ siteId })
      if (list.code === 200) {
        this.listData = list.data
      }
    },
    handTabNameData (item) {
      this.tabShowName = item.value
    }
  },
  mounted () {
    this.FetchSitesOwnsite()
    this.siteId = this.currentSiteId
  },
  created () {
  },
  watch: {
    currentSiteId (newData) {
      this.siteId = newData
    },
    siteId (newData) {
      if (newData) {
        this.fetchStatisticsFlowOverview()
        this.handleSearchs()
      }
    },
    tendencyRadio () {
      if (this.time.time === 0) {
        this.minTime = this.getTime(0)
        this.maxTime = this.getTime(0)
      } else if (this.time.time === 1) {
        this.minTime = this.getTime(1)
        this.maxTime = this.getTime(1)
      } else if (this.time.time === 2) {
        this.minTime = this.getTime(6)
        this.maxTime = this.getTime(0)
      } else if (this.time.time === 3) {
        this.minTime = this.getTime(29)
        this.maxTime = this.getTime(0)
      } else {
        this.minTime = null
        this.maxTime = null
      }
      this.fetchStatisticsImage()
    }
  }
}
</script>

<style lang="scss">
  .statistics-general-index-container::-webkit-scrollbar {
    display: none
  }
  .statistics-general-index-container{
    height: 100%;
    overflow: overlay;
    overflow-x: hidden;
    .p-today-box{
      padding:  23px 30px 8px 30px !important;
    }
    .today-box{
      // height: 252px;
      border: 1px solid rgba(232,232,232,1);
      border-radius:4px;
      box-sizing: border-box;
      padding: 23px 30px 30px 30px;
      margin-bottom: 30px;
      .contribution{
        display: flex;
        .contribution-right{
          margin-top: 30px;
          margin-left: 80px;
        }
      }
      .tabAll{
        display: flex;
        .tabName{
          color: #333333;
          font-size: 18px;
          // height: 30px;
          // line-height: 30px;
          padding-bottom: 3px;
          font-weight: 600;
          margin-right: 30px;
          cursor: pointer;
        }
        .tabShow{
          color: #1EC6DF;
          border-bottom: 2px solid #1EC6DF;
        }
      }
      .jee-popover{
        margin-right: -20px;
      }
      .lookUp{
        fill: #FF0000;
        color: #FF0000;
        font-size: 10px;
      }
      .downUp{
        font-size: 10px;
        fill: #12C45D;
        color: #12C45D;
      }
      h3{
        color: #333333;
        font-size: 18px;
        height: 30px;
        line-height: 30px;
      }
      .today-content{
        // padding: 9px;
        display: flex;
        justify-content:space-between;
        .last-toady{
          li{
            padding-right: 0;
          }
        }
        .first-today{
          margin-left: 0!important;
        }
        ul{
          flex: 6;
          margin-left: 29px;
          font-size: 14px;
          li:first-child{
            text-align: right;
            display: block;
            border-right:none;
            font-size: 16px;
            color: #333333;
            position: relative;
            padding-bottom: 34px;
            padding-top: 15px;
            .jee-popover{
              margin-left: 16px;
              right: 0;
              margin-right: 0;
            }
          }
          li:nth-child(2){
            padding-top: 0;
          }
          li:last-child{
            padding-bottom: 0;
          }
          li{
            line-height: 12px;
            display: flex;
            padding: 15px 0;
            justify-content:space-between;
            border-right: 1px dashed rgba(232,232,232,1);
            padding-right: 29px;
            color: #666666;
            span:last-child{
              font-size: 18px;
              color: #999999;
            }
          }
          li:nth-child(3){
            span:last-child{
              color: #333333;
            }
          }
          li:nth-child(2){
            span:last-child{
              font-size: 24px;
            }
          }
          .yesterday-wrap{
            position: relative;
            .jee-svg-icon{
              position: absolute;
              right: -18px;
              top: 15px;
            }
          }
        }
        ul:last-child{
          li{
            border-right:none;
          }
        }
      }
    }
    .search-header-container{
      margin-top: 30px;
      margin-bottom: 8px;
      .el-radio-group{
        label{
          span{
            width: 100px;
          }
        }
      }
    }
    .statistics{
      display: flex;
      justify-content:space-between;
      flex-wrap: wrap;
      .tendency{
        width: 65%;
        height: 498px;
        .select{
          padding-bottom: 25px;
        }
      }
      .visitor{
        width: 33%;
        height: 498px;
        position: relative;
        .line{
          position: absolute;
          width: 0px;
          height: 438px;
          border-right: 1px dashed #e8e8e8;
          top: 30px;
          left: 50%;
        }
      }
      .source{
        width: 49%;
        height: 586px;
      }
      .entrance{
        width: 49%;
        height: 586px;
      }
      .interviewee{
        width: 49%;
        height: 581px;
      }
      .territory{
        width: 49%;
        height: 581px;
      }
      .statistics-box{
        box-sizing: border-box;
        padding: 30px;
        border:1px solid rgba(232,232,232,1);
        border-radius: 4px;
        margin-bottom: 30px;
        .title{
          display: flex;
          justify-content:space-between;
          margin-bottom: 30px;
          span:first-child{
            font-size: 18px;
            color: #333333;
            font-weight: bold;
          }
          span:last-child{
            font-size: 14px;
            cursor: pointer;
          }
        }
      }
    }
    .visitor-box{
      p{
        display: flex;
        justify-content:space-between;
        padding-right: 30px;
        line-height: 46px;
        strong{
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 10px;
          margin-top: -4px;
        }
      }
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
      p:nth-child(4){
        strong{
          background-color: #38C060;
        }
      }
      &:nth-of-type(2) p{
        padding-left: 30px;
        padding-right: 0;
      }
    }
  }
</style>
