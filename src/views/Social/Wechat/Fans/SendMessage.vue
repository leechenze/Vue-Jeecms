<template>
  <section class="fans-send-message">
    <!-- <base-header v-bind="headers"/> -->
    <base-form
      ref="baseForm"
      class="fsm-form"
      v-bind="form"
      @handleConfirm="handleConfirm"
    >
      <template #detail="scope">
        <div class="fsm-detail t-top">
          <div class="fsm-detail__img">
            <el-image
              class="t-img t-radius"
              :src="form.form.headimgurl"
              fit="contain">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
            </el-image>
          </div>
          <div class="fsm-detail__detail">
            <p class="fsm-detail__title" v-html="$showEmojiName(scope.form.nickname)"></p>
            <p class="fsm-detail__text">粉丝编号： {{form.form.openid}}</p>
            <p class="fsm-detail__text">关注时间： {{form.form.subscribeTimes}}</p>
          </div>
        </div>
      </template>
      <template #msgtype="scope">
        <el-radio-group
          v-model="form.form.msgtype">
          <el-radio-button label="mpnews">图文消息</el-radio-button>
          <el-radio-button label="text">文字</el-radio-button>
          <el-radio-button label="image">图片消息</el-radio-button>
          <el-radio-button label="voice">语音消息</el-radio-button>
          <el-radio-button label="video">视频消息</el-radio-button>
        </el-radio-group>
      </template>
      <template #comment="scope">
        <div class="fsm-comment t-border">
          <material-sel
            :type="form.form.msgtype" :appId="$route.query.appId"
            @materialSel="materialSel"></material-sel>
        </div>
      </template>
    </base-form>
    <div class="fans-send__history">
      <div class="form-item-title">
        <div class="jee-bg-light"></div>
        <h1> 消息发送历史记录</h1>
      </div>
      <message-box :data="msgData" @refushData="refushData" :isShow="true"
        :appId="$route.query.appId" :totalCount="totalCount"></message-box>
    </div>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import materialSel from './materialSel'
import messageBox from '../Message/messageBox'
export default {
  name: 'socialWechatFansSend',
  mixins: [baseHeader, baseForm],
  components: {
    materialSel,
    messageBox
  },
  data () {
    return {
      headers: {
        title: '操作说明',
        content: '操作说明'
      },
      form: {
        api: 'fetchWechatfans',
        labelWidth: '0px',
        form: {
          'appId': '',
          'touser': '',
          'msgtype': 'mpnews',
          'content': '',
          'media_id': '',
          'detail': '',
          'comment': ''
        },
        formItems: [
          {
            prop: 'detail',
            type: 'slot'
          },
          {
            prop: 'msgtype',
            type: 'slot'
          },
          {
            prop: 'comment',
            type: 'slot'
          }
        ],
        rules: {
          appSecret: [
            this.$rules.required()
          ]
        },
        submitBtns: [
          { text: '发送', subType: 'submit' }
        ],
        request: true
      },
      params: {
        'appId': '',
        'times': null,
        'startTime': '',
        'endTime': '',
        'black': true, // true 屏蔽黑名单，false 不屏蔽
        'title': '',
        'timeType': '',
        'openId': '',
        page: 1,
        size: 10
      },
      msgData: [],
      totalCount: 0
    }
  },
  inject: ['removeTab'],
  methods: {
    refushData (page, size) {
      this.params.page = page || 1
      this.params.size = size || 10
      this.getMsgData()
    },
    getMsgData  () {
      if (this.params.appId) {
        let query = this.params
        this.$request.fetchWechatfanssendlogPage(query).then(res => {
          if (res.code === 200) {
            if (res.data && res.data.content instanceof Array) {
              this.msgData = res.data.content
              this.totalCount = res.data.totalElements
            }
          }
        })
      }
    },
    handleConfirm (data, btn) {
      let params = {
        'appId': data.appId,
        'touser': data.touser,
        'msgtype': data.msgtype,
        'content': data.content,
        'media_id': data.media_id
      }
      this.$request.fetchWechatfansSend(params).then(res => {
        this.$restBack(res, () => {
          this.form.form.msgtype = ''
          setTimeout(() => {
            this.form.form.msgtype = 'mpnews'
          }, 1)
          this.fetchFormApi()
          this.getMsgData()
          // this.removeTab(this.$route.fullPath)
          // this.$routerLink('/social/wechat/fans/index', 'list')
        }, '发送成功')
      })
    },
    // 素材选择
    materialSel (data) {
      this.form.form.content = data.content || ''
      this.form.form.media_id = data.mediaId || ''
    },
    // 回调
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.form.form = Object.assign(this.form.form, res.data)
      }
    },
    getFormData () {
      let query = this.$route.query
      this.form.api = this.form.api
      this.form.params = {
        openId: query.openid
      }
      this.params.appId = this.form.form.appId = query.appId
      this.params.openId = this.form.form.touser = query.openid
      this.fetchFormApi()
      this.getMsgData()
    }
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      if (newRoute.name === 'socialWechatFansSend') {
        this.getFormData()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getFormData()
    })
  }
}
</script>

<style lang="scss">
  .fans-send-message{
    .fsm-detail{
      padding: 20px;
      display: flex;
      &__img{
        width: 100px;
        height: 100px;
        margin-right: 20px;
        .t-img{
          display: block;
        }
      }
      &__detail{
        line-height: 1;
        display: block;
      }
      &__title{
        color: #333;
        line-height: 36px;
      }
      &__text{
        margin-top: 8px;
        color: #999999;
      }
    }
    .fsm-form{
      .form-item-wrap{
        .el-form-item{
          margin-bottom: 0px;
          .el-radio-button__inner{
            padding: 10px 20px;
            min-width: 100px;
          }
        }
      }
    }
    .fsm-comment{
      min-height: 200px;
      position: relative;
      bottom: 2px;
      margin-bottom: 22px;
    }

  }
</style>
