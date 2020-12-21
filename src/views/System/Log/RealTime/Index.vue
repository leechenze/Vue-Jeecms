<template>
  <section class="log-realtime-index-container">
    <!-- <base-header
      v-bind="headers"
    /> -->
    <section class="roll-box scrollbar" id="roll-box" @scroll="onscroll">
      <div class="scoll-box">
          <p v-for="(item,index) in realTimeList" :key="index">
          <!-- <transition :key="index" name="fade" mode="out-in" > -->
            <span>{{index+1}}</span>{{item}}
          <!-- </transition> -->
          </p>
      </div>
    </section>
    <div class="function-box">
      <div class="jee-hover-color jee-hover-fill"
        :class="{'jee-color':lock}"
        @click="handleLock">
        <jee-icon iconClass="quanxianbianji01"></jee-icon>
        <span>锁屏</span>
      </div>
      <div class="jee-hover-color"  @click="realTimeList=[]">
        <jee-icon iconClass="delete" class='icon-delete'></jee-icon>
        <span>清屏</span>
      </div>
      <div class="jee-hover-color"
        :class="{'jee-color':refresh}"
        @click="handleReflush">
        <jee-icon iconClass="shuaxin"></jee-icon>
        <span>自动刷新</span>
      </div>
    </div>
    <div class="mergeList" v-if='this.lock && this.refresh' @click="handleNewRow">有<span>{{newRows}}</span>行新日志</div>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
export default {
  name: 'logRealTime',
  mixins: [baseHeader],
  data () {
    return {
      headers: {
        buttons: [],
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明'
      },
      realTimeList: [],
      timeHeight: '',
      newRows: 0,
      lock: false,
      refresh: true,
      timer: null
    }
  },
  methods: {
    // 请求数据
    fetchLogsRealTime () {
      let lastTimeFileSize = this.lastTimeFileSize || ''
      this.$request.fetchLogsRealTime({ lastTimeFileSize }).then(res => {
        if (res.code === 200) {
          this.lastTimeFileSize = res.data.lastTimeFileSize
          this.realTimeList = this.realTimeList.concat(res.data.contents)
          if (this.lock) {
            this.newRows += res.data.contents.length
          } else {
            this.$nextTick(this.scrollToBottom)
          }
        }
      })
    },
    // 点击锁定
    handleLock () {
      this.lock = !this.lock
      if (!this.lock) {
        this.scrollToBottom()
      }
    },
    // 点击自动刷新
    handleReflush () {
      this.refresh = !this.refresh
      if (this.refresh) {
        this.createInterval()
      } else {
        this.handleClearInterval()
      }
    },
    // 点击新行
    handleNewRow () {
      this.newRows = 0
      this.lock = false
      this.scrollToBottom()
    },
    // 监听滚动事件，滚到底时解锁
    onscroll () {
      const el = this.$el.querySelector('#roll-box')
      const bt = el.scrollTop + el.clientHeight - el.scrollHeight
      if (bt > -1 && bt < 1) {
        this.lock = false
        this.newRows = 0
      }
    },
    // 滚动到底
    scrollToBottom () {
      let el = this.$el.querySelector('#roll-box')
      el.scrollTop = el.scrollHeight
      // let step = 0
      // this.interval = setInterval(() => {
      //   if (el.scrollTop === el.scrollHeight) {
      //     clearInterval(this.interval)
      //     return
      //   }
      //   step += 10
      //   el.scrollTop += step
      // }, 20)
    },
    // 清空定时器
    handleClearInterval () {
      if (this.timer) {
        clearInterval(this.timer)
        clearInterval(this.interval)
        this.timer = null
      }
    },
    // 创建定时器
    createInterval () {
      if (!this.timer) {
        this.timer = setInterval(this.fetchLogsRealTime, 2000)
      }
    }
  },
  mounted () {
    this.createInterval()
  },
  activated () {
    this.createInterval()
  },
  deactivated () {
    this.handleClearInterval()
  },
  beforeDestroy () {
    this.handleClearInterval()
  }
}
</script>
<style lang="scss" scoped>
.log-realtime-index-container{
  .mergeList{
    position: fixed;
    text-align: center;
    bottom: 20px;
    width: 134px;
    height: 22px;
    background: rgba(29,196,222,1);
    border-radius: 11px;
    left: 50%;
    line-height: 22px;
    font-size: 12px;
    color: #FFF;
    cursor: pointer;
  }
  .roll-box{
    overflow-y: overlay;
    height: calc(100vh - 260px);
    border:1px solid rgba(232,232,232,1);
    border-radius:4px;
    position: relative;
    p{
      font-size: 14px;
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      color: #666666;
      span{
        background-color: #FAFAFA;
        color: #666666;
        width: 45px;
        display: inline-block;
        text-align: center;
        border-right:1px solid #E8E8E8;
        margin-right: 20px;
      }
    }
  }
  .roll-box:hover + .function-box{
    z-index: 1;
  }
  .function-box{
    position: relative;
    display:flex;
    justify-content:center;
    height:43px;
    background:rgba(255,255,255,0.6);
    line-height: 43px;
    margin-top: calc(-100vh + 260px);
    z-index: -1;
    .jee-svg-icon{
      color: #666666;
      fill: #666666;
      padding-right: 8px;
      &.icon-delete{
        vertical-align: baseline;
        font-size: 14px;
      }
    }
    .jee-hover-color{
      margin-right: 30px;
      cursor: pointer;
    }
  }
  .function-box:hover{
    z-index: 1;
  }
}
</style>
