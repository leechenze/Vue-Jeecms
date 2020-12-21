<template>
  <section class="workplace-container scrollbar">
    <section class="big-box top-box">
      <div class="left-box box">
        <h3>网站概况</h3>
        <div class="general">
          <div class="general-box">
            <jee-icon iconClass="fabu1"  class="jee-svg-icon-2" style="fontSize:40px;"/>
            <div class="general-text">
              <p>内容发布数</p>
              <p><span>今日：</span><span class="jee-color">{{statistics.todayContent}}</span></p>
              <p><span>累计：</span><span>{{statistics.totalContent}}</span></p>
            </div>
          </div>
          <i></i>
          <div class="general-box">
            <jee-icon iconClass="pinglun1" class="jee-svg-icon-2" style="fontSize:40px;"/>
            <div class="general-text">
              <p>评论数</p>
              <p><span>今日：</span><span class="jee-color">{{statistics.todayComment}}</span></p>
              <p><span>累计：</span><span>{{statistics.totalComment}}</span></p>
            </div>
          </div>
          <i></i>
          <div class="general-box">
            <jee-icon iconClass="huiyuan2"  class="jee-svg-icon-2" style="fontSize:40px;"/>
            <div class="general-text">
              <p>新增会员数</p>
              <p><span>今日：</span><span class="jee-color">{{statistics.todayUser}}</span></p>
              <p><span>累计：</span><span>{{statistics.totalUser}}</span></p>
            </div>
          </div>
          <i></i>
          <div class="general-box">
            <jee-icon iconClass="tougao"  class="jee-svg-icon-2" style="fontSize:40px;"/>
            <div class="general-text">
              <p>投稿数</p>
              <p><span>今日：</span><span class="jee-color">{{statistics.todaySubmission}}</span></p>
              <p><span>累计：</span><span>{{statistics.totalSubmission}}</span></p>
            </div>
          </div>
        </div>
      </div>
      <div class="right-box box">
        <h3>待办事项</h3>
        <div class="backlog">
          <!-- workflow-plugin start -->
          <div class="backlog-box" @click="handleNavWorkflow">
            <p>内容</p>
            <p>{{upcoming.toDealCount||0}}</p>
          </div>
          <i></i>
          <!-- workflow-plugin end -->
          <div class="backlog-box" @click="handleNavComment">
            <p>评论</p>
            <p>{{upcoming.totalComment||0}}</p>
          </div>
          <i></i>
          <div class="backlog-box" @click="handleNavVip">
            <p>会员</p>
            <p>{{upcoming.totalUser||0}}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="big-box bottom-box">
      <div class="left-box box">
        <div class="title">
          <span>趋势图</span>
          <el-link :underline="false" class="jee-color" @click="upTendency()">查看更多</el-link>
        </div>
        <div class="select">
          <el-radio-group v-model="showType">
            <el-radio :label="1">浏览量(PV)</el-radio>
            <el-radio :label="2">访客数(UV)</el-radio>
            <el-radio :label="3">IP数</el-radio>
            <el-radio :label="4">跳出率</el-radio>
            <el-radio :label="5">平均访问时长</el-radio>
          </el-radio-group>
        </div>
        <tendency :tendencyFields='tendencyFields' :tendencyData='finallyData' ></tendency>
      </div>
      <div class="right-box box">
        <div class="title">
          <span>新老访客</span>
          <el-link :underline="false" class="jee-color" @click="upVisitor()">查看更多</el-link>
        </div>
        <div style="display:flex;">
          <div style="width:50%;margin-left:-7%">
            <visitor :rate='visitorObj.newRate || 0' :label='visitorObj.newName ||"新访客"'></visitor>
          </div>
          <div style="width:50%;margin-left:4%">
            <visitor :rate='visitorObj.oldRate || 0' :label='visitorObj.oldName ||"老访客"'></visitor>
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
    </section>
  </section>
</template>
<script>
import tendency from './Tendency'
import visitor from './visitor'
import { transverterMss } from '@/utils'
import {
  mapActions,
  mapGetters
} from 'vuex'
export default {
  components: {
    tendency,
    visitor
  },
  name: 'workplaceIndex',
  data () {
    return {
      showType: 1,
      visitorObj: {},
      tendencyFields: ['pv', 'old'],
      tendencyData: [],
      statistics: {},
      upcoming: {},
      finallyData: []
    }
  },
  computed: {
    ...mapGetters(['ownSiteOptions', 'currentSiteId'])
  },
  methods: {
    ...mapActions('config', ['FetchSitesOwnsite']),
    // 今日统计和累计统计
    fetchTaskStatistics () {
      this.$request.fetchTaskStatistics().then(res => {
        if (res.code === 200) {
          this.statistics = res.data
        }
      })
    },
    upTendency () {
      this.$routerLink('/statistics/flow/tendency')
    },
    upVisitor () {
      this.$routerLink('/statistics/visitor/visitor')
    },
    // 待办事项
    fetchTaskUpcoming () {
      this.$request.fetchTaskUpcoming().then(res => {
        if (res.code === 200) {
          this.upcoming = res.data
        }
      })
    },
    // 客户数据
    fetchStatisticsvisitSummarize () {
      let params = {}
      params.siteId = this.currentSiteId
      params.startTime = this.getTime(0)
      params.endTime = this.getTime(0)
      this.$request.fetchStatisticsvisitSummarize(params).then(res => {
        if (res.code === 200) {
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
          if (res.data.length > 0) {
            this.visitorObj.newRate = (this.visitorObj.newUv / (this.visitorObj.newUv + this.visitorObj.oldUv)) * 10 + ''
            this.visitorObj.newRate = this.visitorObj.newRate.substring(0, this.visitorObj.newRate.indexOf('.') + 4)
            this.visitorObj.newRate = Number(this.visitorObj.newRate)
            this.visitorObj.oldRate = 10 - this.visitorObj.newRate
          }
        }
      })
    },
    // 趋势图表
    fetchStatisticsImage () {
      let params = {}
      params.siteId = this.currentSiteId
      params.showStyle = 1
      params.showType = this.showType
      if (this.showType === 1) {
        this.tendencyFields[0] = '昨日浏览量'
        this.tendencyFields[1] = '今日浏览量'
      } else if (this.showType === 2) {
        this.tendencyFields[0] = '昨日访客数'
        this.tendencyFields[1] = '今日访客数'
      } else if (this.showType === 3) {
        this.tendencyFields[0] = '昨日IP数'
        this.tendencyFields[1] = '今日IP数'
      } else if (this.showType === 4) {
        this.tendencyFields[0] = '昨日跳出率'
        this.tendencyFields[1] = '今日跳出率'
      } else if (this.showType === 5) {
        this.tendencyFields[0] = '昨日访问时长'
        this.tendencyFields[1] = '今日访问时长'
      }

      params.minTime = this.getTime(1)
      params.maxTime = this.getTime(1)
      this.$request.fetchStatisticsImage(params).then(res => {
        if (res.code === 200) {
          this.tendencyData = res.data.array
          for (var i = 0; i < res.data.array.length; i++) {
            if (this.showType === 1) {
              this.tendencyData[i].昨日浏览量 = res.data.array[i].pv
            } else if (this.showType === 2) {
              this.tendencyData[i].昨日访客数 = res.data.array[i].uv
            } else if (this.showType === 3) {
              this.tendencyData[i].昨日IP数 = res.data.array[i].ip
            } else if (this.showType === 4) {
              this.tendencyData[i].昨日跳出率 = res.data.array[i].depthNum
            } else if (this.showType === 5) {
              this.tendencyData[i].昨日访问时长 = res.data.array[i].time
            }
          }
          params.minTime = this.getTime(0)
          params.maxTime = this.getTime(0)
          this.$request.fetchStatisticsImage(params).then(res => {
            if (res.code === 200) {
              for (var i = 0; i < res.data.array.length; i++) {
                if (this.showType === 1) {
                  this.tendencyData[i].今日浏览量 = res.data.array[i].pv
                } else if (this.showType === 2) {
                  this.tendencyData[i].今日访客数 = res.data.array[i].uv
                } else if (this.showType === 3) {
                  this.tendencyData[i].今日IP数 = res.data.array[i].ip
                } else if (this.showType === 4) {
                  this.tendencyData[i].今日跳出率 = res.data.array[i].depthNum
                } else if (this.showType === 5) {
                  this.tendencyData[i].今日访问时长 = res.data.array[i].time
                }
              }

              this.finallyData = this.tendencyData
            }
          })
        }
      })
    },
    // 获取日期时间戳
    getTime (dayNum) {
      var myDate = new Date()
      var lw = new Date(myDate - 1000 * 60 * 60 * 24 * dayNum)// 最后一个数字多少天前的意思
      var lastY = lw.getFullYear()
      var lastM = lw.getMonth() + 1
      var lastD = lw.getDate()
      var startdate = lastY + '-' + (lastM < 10 ? '0' + lastM : lastM) + '-' + (lastD < 10 ? '0' + lastD : lastD)
      var b = startdate.split(/\D/)
      var date = new Date(b[0], b[1] - 1, b[2])
      var time = date.getTime()
      return time
    },
    searrchData () {
      if (this.currentSiteId) {
        this.fetchStatisticsImage()
        this.fetchStatisticsvisitSummarize()
        this.fetchTaskStatistics()
        this.fetchTaskUpcoming()
      }
    },
    handleNavWorkflow () {
      this.$router.push({
        name: 'workplaceWorkflow'
      })
    },
    handleNavComment () {
      this.$router.push({
        name: 'interactCommentIndex'
      })
    },
    handleNavVip () {
      this.$router.push({
        name: 'vipMemberIndex'
      })
    }
  },
  mounted () {
    this.FetchSitesOwnsite()
    this.searrchData()
  },
  watch: {
    currentSiteId (newValue) {
      if (newValue && newValue !== '') {
        this.searrchData()
      }
    },
    showType () {
      this.fetchStatisticsImage()
    }
  }
}
</script>
<style lang="scss" scoped>
.workplace-container{
  overflow: overlay;
  height: 100%;
  .select{
    margin-bottom: 40px;
  }
  .interval{
    width:1px;
    height:438px;
    background-color: #E8E8E8;
    margin-top: -230px;
  }
  .visitor-box{
    p{
      display: flex;
      justify-content:space-between;
      padding-right: 20px;
      padding-left: 20px;
      line-height: 56px;
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
  }
  .title{
    display: flex;
    justify-content:space-between;
    margin-bottom: 39px;
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
  .backlog{
    display: flex;
    justify-content:space-between;
    .backlog-box{
      width: 33%;
      box-sizing: border-box;
      padding: 15px 0 55px;
      cursor: pointer;
      p{
        text-align:center;
      }
      p:first-child{
        font-size: 16px;
        color: #666;
        margin-bottom: 15px;
      }
      p:last-child{
        font-size: 30px;
        color:#333;
      }
    }
    i{
      width:1px;
      min-width: 1px !important;
      border-left: 1px rgba(230,230,230,1);
      height:60px;
      margin-top: 20px;
    }
  }
  .big-box{
    display: flex;
    .left-box{
      width: 60%;
      margin-right: 30px;
      min-width: 875px;
    }
    .right-box{
      width: 40%;
      min-width: 600px;
    }
    .box{
      border:1px solid rgba(232,232,232,1);
      border-radius:4px;
      height: 100%;
      box-sizing: border-box;
      padding: 30px;
      h3{
        font-size: 18px;
        font-weight: bold;
        color:#333;
        margin-bottom: 20px;
      }
      .general{
        display: flex;
        justify-content:space-between;
        i{
          width:1px;
          min-width: 1px !important;
          height:60px;
          background:rgba(230,230,230,1);
          margin-top: 20px;
        }
        .general-box{
          width: 24%;
          min-width: 200px;
          padding: 8px 20px 8px 20px;
          display: flex;
          box-sizing: border-box;
          .jee-svg-icon-2{
            margin-top: 20px;
            margin-right: 30px;
          }
          .general-text{
            p:first-child{
              font-size: 18px;
              color: #333;
            }
            p:nth-child(2){
              line-height: 50px;
              font-size: 14px;
              span:first-child{
                color: #999999;
                display:inline-block;
                margin-right: 5px;
              }
              span:last-child{
                font-size: 16px;
              }
            }
            p:last-child{
              font-size: 14px;
              span:first-child{
                color: #999999;
                display:inline-block;
                margin-right: 5px;
              }
              span:last-child{
                color: #666666;
                font-size: 16px;
              }
            }
          }
        }
        .general-box:first-child{
          padding-left: 20px;
        }
      }

    }
  }
  .top-box{
    height: 200px;
    margin-bottom: 30px;
  }
  .bottom-box{
    height: 558px;
  }
}
</style>
