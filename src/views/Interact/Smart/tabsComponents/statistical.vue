<template>
<!-- 统计分析详情 -->
  <section class="interact-smart-stat-ques">
    <div class="detailTitle">
      <p class="info-txt t-overflow">主题：<span class="text">{{dataInfo.title}}</span></p>
      <p class="info-txt">浏览量：<span class="text">{{dataInfo.viewCount}}</span></p>
      <p class="info-txt">参与人次：<span class="text">{{dataInfo.joinCount}}</span></p>
      <p class="info-txt">参与率：<span class="text">{{dataInfo.viewCount?((dataInfo.joinCount / dataInfo.viewCount) * 100).toFixed(0):0}}%</span></p>
      <p class="info-txt">状态：<span class="text">{{formViewStatusArr[dataInfo.viewStatus]}}</span></p>
      <p class="info-txt">收集时间：<span class="text">{{dataInfo.beginTime}} — {{dataInfo.endTime}}</span></p>
    </div>
    <div>
      <el-button :type="isCheck?'primary':'empty'" @click="resultButton" size="medium">
        <jee-icon iconClass="jieguofenxi"></jee-icon>
        <span class="textbutton">结果分析</span>
      </el-button>
      <el-button :type="isCheck?'empty':'primary'" @click="sourceButton" size="medium">
        <jee-icon iconClass="laiyuanfenxi"></jee-icon>
        <span class="textbutton">来源分析 </span>
      </el-button>
    </div>
    <component :is="activeTab" :tabName="dataInfo.title"></component>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import resultAnalysis from '../statisticalComponents/resultAnalysis'
import sourceAnalysis from '../statisticalComponents/sourceAnalysis'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'statisticalQues',
  mixins: [baseHeader],
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  components: {
    resultAnalysis,
    sourceAnalysis
  },
  watch: {
    async name (newVal) {
      if (newVal === 'statistical') {
        this.fetchSmartFormDetail()
      }
    }
  },
  data () {
    return {
      isCheck: true,
      dataInfo: {},
      activeTab: 'resultAnalysis',
      formViewStatusArr: ['未发布', '进行中', '已结束'],
      headers: {
        buttons: [
          {
            type: 'ResultAnalysis',
            text: '结果分析',
            icon: 'jieguofenxi'
          },
          {
            type: 'SourceAnalysis',
            text: '来源分析',
            icon: 'jieguofenxi'
          }
        ],
        showAlertIcon: true,
        content: '操作说明'
      }
    }
  },
  methods: {
    ...mapActions('interact', ['getSmartDetailData']),
    resultButton () {
      this.activeTab = 'resultAnalysis'
      if (!this.isCheck) {
        this.isCheck = !this.isCheck
      }
    },
    sourceButton () {
      this.activeTab = 'sourceAnalysis'
      if (this.isCheck) {
        this.isCheck = !this.isCheck
      }
    },
    async fetchSmartFormDetail () {
      const res = await this.$request.fetchSmartFormDetail({ id: this.$route.query.id })
      if (res.code === 200) {
        this.dataInfo = res.data
      }
    }
  },
  mounted () {
    this.$nextTick(async () => {
      if (this.name === 'statistical') {
        this.fetchSmartFormDetail()
      }
    })
  },
  activated () {
    if (this.name === 'statistical') {
      this.fetchSmartFormDetail()
    }
  }
}
</script>
<style lang="scss">
.interact-smart-stat-ques{
  .detailTitle{
    padding-top: 10px;
    padding-bottom: 30px;
    line-height: 1.5;
    .info-txt{
      font-size: 16px;
      color: #666666;
      margin-right: 50px;
      display: inline-block;
      vertical-align: top;
      &:first-of-type{
        max-width: 380px;
        color: #333;
      }
      &:last-of-type{
        margin-right: 0;
      }
      .text{
        color: #333333;
      }
    }
  }
  .button{
    .textbutton{
      padding-left: 10px;
      font-size: 16px;
    }
  }
}
</style>
