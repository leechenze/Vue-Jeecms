<template>
  <section class="message-box-index">
    <ul class="msg-box__wrap scrollbar">
      <template v-for="(item, index) in comments">
        <li class="msg-box__items t-border" :key="index">
          <div class="msg-box__item">
            <div class="msg-box__img">
                <head-info :infoData="item.fans" :appId="appId"
                    :tags="tags" @setTags="refushData"></head-info>
              </div>
            <div class="msg-box__content">
              <div class="msg-box__flex">
                <div class="msg-box__cont">
                  <p class="msg-box__name" v-html="$showEmojiName(item.fans.nickname)"></p>
                </div>
                <div class="msg-box__time t-14">{{item.createTime}}
                  <span v-show="item.reply&&!isShow" class="msg-box__reply">已回复</span></div>
                <div class="msg-box__btn" @click="commentReply(item,index)">
                  <jee-icon v-if="!isShow" iconClass="huifu" :style="{fontSize:'14px'}"></jee-icon>
                  <span v-if="!isShow" class="jee-color t-14">回复</span>
                  <!-- <span class="jee-color t-14">删除</span> -->
                </div>
              </div>
              <div class="msg-box__label t-14">
                <material-show :msgType="item.msgType" :comment="item.madia"></material-show>
               </div>
            </div>
          </div>
          <div class="msg-box__comment t-top" v-show="item.showComment" >
            <!-- <el-input type="textarea"
              :autosize="{minRows: 5}"
              maxlength="600"
              v-model="item.comment" ></el-input> -->
              <jee-emoji v-model="item.comment"/>
              <div style="padding-top:20px;">
                <el-button type="primary" size="small" @click="toComment(item,index)">发送</el-button>
                <el-button size="small" type='empty'
                  @click="hideReply(item,index)">收起</el-button>
              </div>
          </div>
        </li>
      </template>
    </ul>
    <div class="t-label nothing" v-show="comments.length === 0">暂无数据</div>
    <jee-pagination
          :total="totalCount"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"></jee-pagination>
  </section>
</template>

<script>
import headInfo from '../components/headInfo'
import materialShow from '../components/materialShow'
export default {
  name: 'message-box',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    tags: {
      type: Array,
      default: () => {
        return []
      }
    },
    appId: {
      type: [String, Number],
      default: ''
    },
    totalCount: {
      type: Number,
      default: 0
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    headInfo,
    materialShow
  },
  data () {
    return {
      comments: []
    }
  },
  watch: {
    data (newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.comments = newVal
      }
    }
  },
  mounted () {
    if (this.data) {
      this.comments = this.data
    }
  },
  methods: {
    refushData (page, size) {
      this.$emit('refushData', page || 1, size || 10)
    },
    handleSizeChange (val) {
      this.refushData('', val)
    },
    handleCurrentChange (val) {
      this.refushData(val)
    },
    commentReply (data, i) {
      this.$set(this.comments[i], 'showComment', true)
    },
    hideReply (data, i) {
      this.$set(this.comments[i], 'showComment', false)
    },
    toComment (data, i) {
      let params = {
        'appId': this.appId,
        'touser': data.openId, // openid
        'msgtype': 'text',
        'content': data.comment,
        'media_id': ''
      }
      this.$request.fetchWechatfansSend(params).then(res => {
        this.$restBack(res, () => {
          this.hideReply(data, i)
          this.$emit('toComment', true)
        }, '发送成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .message-box-index{
    .msg-box{
      &__items{
        padding: 20px;
        margin-bottom: 30px;
        box-sizing: border-box;
        border-radius: 4px;
      }
      &__item{
        min-height: 50px;
        box-sizing: border-box;
        display: flex;
      }
      &__flex{
        display: flex;
        width: 100%;
      }
      &__img{
        margin-right: 20px;
        min-width: 50px;
        width: 50px;
        border-radius: 4px;
        height: 50px;
        position: relative;
        bottom: 15px;
      }
      &__content{
        width: 100%;
      }
      &__cont{
        font-size: 14px;
        max-width: 650px;
        line-height: 1;
        flex: 1;
      }
      &__name{
        color: #333333;
        margin-bottom: 8px;
        margin-top: 5px;
      }
      &__label{
        color: #999999;
      }
      &__time{
        margin-top: 5px;
        color: #999999;
        min-width: 245px;
        position: relative;
        line-height: 1;
      }
      &__reply{
        color: #0ABF41;
        margin-left: 30px;
      }
      &__btn{
        margin-top: 5px;
        min-width: 65px;
        margin-left: 110px;
        line-height: 1;
        cursor: pointer;
        .jee-svg-icon{
          margin-right:8px;
        }
      }
      &__comment{
        margin-top: 20px;
        box-sizing: border-box;
        padding: 20px 20px 0;
      }
    }
  }
</style>
