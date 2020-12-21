<template>
<!-- 统计分析详情 -->
  <section class="interact-vote-stat-ques">
    <div class="detailTitle">
      <p class="info-txt t-overflow"><span class="text">{{dataInfo.title}}</span></p>
      <p class="info-txt">浏览量：<span class="text">{{dataInfo.pageViews}}</span></p>
      <p class="info-txt">参与人次：<span class="text">{{dataInfo.number}}</span></p>
      <p class="info-txt">参与率：<span class="text">{{dataInfo.rate}}%</span></p>
      <p class="info-txt">状态：<span class="text">{{typeFilter(dataInfo.status)}}</span></p>
      <p class="info-txt">投票时间：<span class="text">{{dataInfo.beginTime}} — {{dataInfo.endTime}}</span></p>
    </div>
    <div>
      <el-button :type="isCheck?'primary':'empty'" @click="resultButton" size="medium">
        <jee-icon iconClass="jia"></jee-icon>
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
    name (newVal) {
      if (newVal === 'statistical') {
        this.getData()
      }
    }
  },
  data () {
    return {
      isCheck: true,
      activeTab: 'resultAnalysis',
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
      },
      dataInfo: {}
    }
  },
  methods: {
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
    getData () {
      let { id } = this.$route.query
      if (id) {
        this.$request.fetchQuestionnaireFind({ questionnaireId: id }).then(res => {
          if (res.code === 200) {
            this.dataInfo = res.data
          }
        })
      }
    },
    typeFilter (status) {
      let arr = ['未发布', '流转中', '已驳回', '进行中(已发布)', '已结束']
      return arr[parseInt(status)]
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.name === 'statistical') {
        this.getData()
      }
    })
  },
  activated () {
    this.$nextTick(() => {
      if (this.name === 'statistical') {
        this.getData()
      }
    })
  }
}
</script>
<style lang="scss">
.interact-vote-stat-ques{
  .detailTitle{
    padding-top: 10px;
    padding-bottom: 30px;
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
