<template>
  <div class="comment-set-index">
    <div class="t-border cs-box">
      <div class="cs-box__cont">
        <p style="margin-bottom: 18px;">屏蔽骚扰留言</p>
        <p class="t-label">开启后，存在骚扰行为或黑名单用户的留言会移入“已屏蔽留言”</p>
      </div>
      <div class="cs-box__swith t-text-right">
        <span class="t-16">留言</span> &nbsp;&nbsp;
        <el-switch @change="onComment" v-model="value" size="small"></el-switch>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'comment-set',
  data () {
    return {
      value: false
    }
  },
  methods: {
    onComment (val) {
      // console.log(val)
      if (val) {
        this.$request.fetchWechatcommentOn().then(res => {
          // res
        })
      } else {
        this.$request.fetchWechatcommentOff().then(res => {
          // res
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-set-index{
  .cs-box{
    display: flex;
    max-width: 1100px;
    padding: 20px;
    box-sizing: border-box;
    line-height: 1;
    &__cont{
      flex: 3;
      font-size: 14px;
    }
    &__swith{
      flex: 1;
    }
  }
}
</style>
