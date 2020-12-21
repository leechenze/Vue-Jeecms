<template>
  <el-popover
      placement="right-start"
      width="723"
      trigger="hover"
      :visible-arrow='false'
      popper-class="wx-head-info-popper"
    >
      <div class="wechat-info">
        <div class="wechat-info__img">
          <el-image
            class="t-img t-radius "
            :src="$getPath(infoData.headimgurl)"
            fit="contain">
              <div slot="error">
                <i class="el-icon-picture-outline"></i>
              </div>
          </el-image>
        </div>
        <div class="wechat-info__cont">
          <div class="wechat-info__name">
            <span>
              {{$showEmojiName(infoData.nickname)}} &nbsp;
              <jee-icon :iconClass="infoData.sex===1?'nanren':'nvren'"
                :style="{fill:infoData.sex===1?'#1488F5':'#EA7F51'}"></jee-icon>
            </span>
            <span class="wechat-info__black jee-hover-color jee-hover-border" @click="setBlacklist">加入黑名单</span>
          </div>
          <div class="wechat-info__tags" v-if="tags&&tags.length">
            <div class="t-label t-12"
                v-if="infoData.tagidList === ''">无标签
                  <set-tags
                  :tags="tags"
                  :appId="appId"
                  :data="infoData"
                  @setTags="setTags" ></set-tags>
                </div>
              <div class="wechat-name-tag" v-else>
                <el-tag
                  v-for="(item,index) in infoData.tags"
                  :key="item"
                  v-show="index<3"
                  type="info"
                  size="mini"
                  effect="plain">
                  {{ item }}
                </el-tag>
                <span class="t-label" v-show="infoData.tags.length>3">共{{infoData.tags.length}}个标签</span>&nbsp;
                <set-tags
                  :tags="tags"
                  :appId="appId"
                  :data="infoData"
                  @setTags="setTags" ></set-tags>
              </div>
          </div>
          <!-- <p class="t-12 t-label">{{infoData.location}}</p> -->
          <div class="t-bottom t-label wechat-info__label" v-if="infoData.fansExt">
            <span>消息 &nbsp;&nbsp;&nbsp;<span class='count'>{{infoData.fansExt.mesCount ||0}}</span></span> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
            <span>留言 &nbsp;&nbsp;&nbsp;<span class='count'>{{infoData.fansExt.commentCount||0}}</span></span> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
            <span>精选留言 &nbsp;&nbsp;&nbsp;<span class='count'>{{infoData.fansExt.topCommentCount||0}}</span></span>
          </div>
          <p class="t-text-right" style="padding-top:20px;">于{{infoData.subscribeTimes}}关注你</p>
        </div>
      </div>
      <div slot="reference" class="fans-head-img">
        <el-image
          class="t-img t-radius"
          :src="$getPath(infoData.headimgurl)"
          fit="contain">
            <div slot="error">
              <i class="el-icon-picture-outline"></i>
            </div>
        </el-image>
      </div>
    </el-popover>
</template>
<script>
import setTags from '../Fans/setTags'
export default {
  name: 'head-info-wechat',
  components: {
    setTags
  },
  props: {
    infoData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tags: {
      type: Array,
      default: () => {
        return []
      }
    },
    appId: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  // data () {
  //   return {
  //     tags: []
  //   }
  // },
  // mounted () {
  //   this.$nextTick(() => {
  //     if (!this.tags.length) {
  //       this.getTags()
  //     }
  //   })
  // },
  methods: {
    setTags () {
      this.$emit('setTags')
    },
    // 获取标签列表
    // getTags () {
    //   if (this.appId) {
    //     let params = { appId: this.appId }
    //     this.$request.wechattagsApp(params).then(res => {
    //       if (res.code === 200) {
    //         this.tags = res.data.tagList
    //       }
    //     })
    //   }
    // },
    // 加入黑名单
    setBlacklist () {
      this.$confirm(
        '加入黑名单后，你将无法接收该用户发来的消息，且该用户无法接收公众号发出的消息，无法参与留言和赞赏，确认加入黑名单？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        let params = {
          appId: this.appId,
          ids: [this.infoData.id]
        }
        this.$request.fetchWechatfansBlack(params).then(res => {
          this.$restBack(res, () => {
            this.$emit('setTags')
          })
        })
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss">
  .wx-head-info-popper.el-popover{
    padding: 0;
  }
  .wechat-info{
    width: 100%;
    display: flex;
    &__img{
      width: 230px;
      height: 230px;
      box-sizing: border-box;
      .el-image{
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      }
    }
    &__cont{
      padding: 20px;
      flex: 1;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .wechat-name-tag{
        .el-tag{
          margin-right: 10px;
          padding: 1px 19px;
          height: 22px;
          border-radius: 10px;
          background-color: #ffffff;
          border: 1px solid #e8e8e8;
        }
      }
    }
    &__name{
      height: 28px;
      width: 100%;
      font-size: 16px;
      color: #333333;
      position: relative;
      margin-bottom: 22px;
    }
    &__black{
      position: absolute;
      right: 0;
      display: inline-block;
      border: 1px solid #e8e8e8;
      line-height: 26px;
      box-sizing: border-box;
      padding: 0 18px;
      cursor: pointer;
      border-radius: 2px;
    }
    &__label{
      line-height: 20px;
      font-size: 15px;
      flex: 1;
      .count{
        color: #333333;
      }
    }
    &__tags{
      padding-bottom: 20px;
      .t-label.t-12{
        font-size: 14px!important;
      }
    }
  }
  .fans-head-img{
    width: 50px;
    height: 50px;
    margin: 15px 0;
  }
</style>
