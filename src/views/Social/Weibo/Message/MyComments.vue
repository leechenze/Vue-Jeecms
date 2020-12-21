<template>
  <section class="my-comments-index">
    <ul class="comments-wrap">
      <li class="comments-box t-bottom"
        v-for="(item,index) in comments" :key="index" >
        <!-- 头像 -->
        <div class="comments-box__head">
          <head-info :infoData="item.user"></head-info>
        </div>
        <!-- 内容  -->
        <div class="comments-box__cont">
          <p class="cont-info t-16">{{item.user.screenName}}</p>
          <p class="cont-info t-label">{{$moment(item.createTime,'YYYY-MM-DD HH:mm:ss',true)}} 来自微博  weibo.com</p>
          <div class="cont-content">
            <p v-html="replaceComment(item.commentText)"></p>
            <el-link :underline='false' class="cont-reply"
              :disabled="handleType === 'delete' && !_checkPermission('/weibomessage', 'DELETE')"
              @click="handleChange(index,item.user,item)">{{handleText}}</el-link>
          </div>
            <div v-if="item.commentShow" class="cont-comment">
              <!-- <el-input
                class="cont-input"
                v-model="item.comment"
                :rows="3" type="textarea"></el-input> -->
                <jee-emoji class="cont-input" v-model="item.comment"/>
                <!-- <span class="cont-span" :title="">{{item.label}}</span> -->
                <div class="cont-btns">
                  <el-button type="primary" size="small"
                    :disabled="!item.comment || !_checkPermission('/weibomessage', 'PUT')"
                    @click="handleEventConfirm(item,index)" >发送</el-button>
                  <el-button  size="small" type='empty'
                    @click="handleEventCancel(index,item)" >收起</el-button>
                </div>
            </div>
          <div class="cont-weibo">
            <label class="t-gray cont-label">微博内容 :</label>
            <span v-html="replaceComment(item.weiboContent)"></span>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="count > 5&&comments.length<count"
      class="load-more jee-border jee-color"
      @click="getMoreData">加载更多</div>
  </section>
</template>

<script>
import headInfo from './headInfo'
export default {
  name: 'myComments',
  components: {
    headInfo
  },
  props: {
    id: {
      type: [Number, String],
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      handleType: '',
      handleText: '回复',
      comments: [],
      count: 0,
      params: {
        page: 1,
        size: 5
      }
    }
  },
  methods: {
    getMoreData () {
      this.params.page += 1
      this.getDataList()
    },
    replaceComment (text) {
      return text.replace(/(@\S+)\s?/g, '<span class="jee-color">$1</span>')
    },
    getDataList () {
      var params = {
        id: this.id,
        ...this.params
      }
      this.$request.weibomessageAtcomments(params).then(res => {
        if (res.code === 200 && res.data) {
          if (this.params.page === 1 && res.data.content.length) {
            this.comments = res.data.content
          } else if (this.comments.length < res.data.totalElements && res.data.content.length) {
            this.comments = this.comments.concat(res.data.content)
          } else {
            this.count = 0
            this.comments = []
          }
          this.count = res.data.totalElements
        } else {
          this.count = 0
          this.comments = []
        }
      })
    },
    handleChange (i, item) {
      this.$set(this.comments[i], 'commentShow', true)
      this.$set(this.comments[i], 'comment', '回复 @' + item.screenName + '：')
    },
    // 弹窗信息
    msgChange (message, fn) {
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        fn()
      }).catch(() => {})
    },
    handleEventConfirm (data, i) {
      var params = {
        'comment': data.comment,
        'weiboId': data.weiboId,
        'weiboUserId': this.id,
        'commentId': data.commentId
      }
      this.$request.weibomessagePut(params).then(res => {
        this.$restBack(res, () => {
          this.getDataList()
        }, '回复成功')
      })
    },
    handleEventCancel (i) {
      this.$set(this.comments[i], 'commentShow', false)
    }
  },
  watch: {
    id (newVal) {
      this.params.page = 1
      if (this.id && this.name === 'myComments') {
        this.getDataList()
      }
    },
    name (newVal, oldVal) {
      this.params.page = 1
      if (this.id && this.name === 'myComments') {
        this.getDataList()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.id && this.name === 'myComments') {
        this.getDataList()
      }
    })
  }
}
</script>

<style lang="scss">
  .cont-btns{
      margin-bottom: 20px;
    }
  .my-comments-index{
    .load-more{
      width: 104px;
      height: 36px;
      text-align: center;
      line-height: 36px;
      box-sizing: border-box;
      margin: 50px auto 0;
      border-width: 1px;
      font-size: 16px;
      border: 1px solid;
      cursor: pointer;
    }
    .comments-wrap{
      margin-top: 10px;
      .comments-box{
        padding-bottom: 30px;
        margin-bottom: 30px;
        box-sizing: border-box;
        display: flex;
        &__head{
          width: 90px;
          .t-img{
            margin: 0 20px;
            width: 50px;
            height: 50px;
            overflow: hidden;
            border-radius: 100%;
            background-color: #fafafa;
          }
        }
        &__cont{
          flex: 1;
          font-size: 14px;
          color: #666666;
          margin-bottom: 10px;
          .cont-info{
            line-height: 1;
            color: #333;
            margin: 5px 0 10px;
          }
          .cont-content{
            margin: 8px 0 15px;
            display: flex;
          }
          .cont-weibo{
            background-color: #fafafa;
            line-height: 25px;
            padding: 20px;
            width: 90%;
            border-radius:4px;
          }
          .cont-label{
            min-width: 105px;
            margin-right: 5px;
          }
          .cont-reply{
            display: inline-block;
            flex: 1;
            margin-right: 20%;
            text-align: right;
            min-width: 48px;
            font-size: 14px;
            cursor: pointer;
            .jee-svg-icon{
              fill: #666666;
            }
          }
          .cont-comment{
            width: 80%;
            min-height: 75px;
            position: relative;
            margin-bottom: 20px;
          }
          .cont-input{
            margin-bottom: 20px;
            .el-textarea__inner{
              margin-bottom: 20px;
              color: #333333;
            }
          }
          .cont-span{
            position: absolute;
            left: 18px;
            top: 8px;
            min-width: 80px;
            display: block;
          }
        }
      }
    }
  }
</style>
