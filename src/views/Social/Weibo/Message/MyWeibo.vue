<template>
  <section class="my-weibo-index">
    <ul class="comments-wrap">
      <li class="comments-box t-bottom"
        v-for="(item,index) in comments" :key="index" >
        <div class="comments-box__self">
          <!-- 头像 -->
          <div class="comments-box__head">
            <head-info :infoData="item.user"></head-info>
         </div>
          <!-- 内容  -->
          <div class="comments-box__cont">
            <p class="cont-info t-16">{{item.user.screenName}}</p>
            <p class="cont-info t-label">{{$moment(item.createTime)}} 来自微博  weibo.com</p>
            <div class="cont-content">
              <p class="cont-text" v-html="replaceComment(item.text)"></p>
              <div class="cont-reply" >
                <span class=" jee-hover-color" @click="handleChange(index,item)">
                  <jee-icon
                    iconClass="huifu"
                    :style="{fontSize:'14px'}"></jee-icon>
                    {{handleText}}
                  </span>
                </div>
              </div>
              <div v-if="item.commentShow" class="cont-comment">
                <!-- <el-input
                  class="cont-input"
                  v-model="item.comment"
                  :rows="3" type="textarea"></el-input> -->
                  <jee-emoji class="cont-input" v-model="item.comment"/>
                  <div class="cont-btns">
                    <el-button type="primary" size="small"
                      :disabled="!item.comment || !_checkPermission('/weibomessage', 'POST')"
                      @click="handleEventComment(item,index)" >发送</el-button>
                    <el-button  size="small" type='empty'
                      @click="handleEventCancel(index,item)" >收起</el-button>
                  </div>
              </div>
          </div>
        </div>
        <div class="comments-box__weibo" v-if="item.comments.length">
          <div class="comments-box__flex" v-for="(info,infoIndex) in item.comments" :key="infoIndex">
              <!-- 头像 -->
              <div class="comments-box__head">
                <head-info :infoData="info.user"></head-info>
              </div>
              <!-- 内容  -->
              <div class="comments-box__cont">
                <div class="cont-info" style="display: flex;">
                  <div class="t-16">{{info.user.screenName}} :</div>
                  <div class="t-14" v-html="replaceComment(info.commentText)"></div>
                  <div
                    class="cont-reply cont-reply__level2"
                    :class="{'jee-color':info.commentShow}"
                  >
                    <span class="jee-hover-color t-14"
                      @click="handleChangeInfo(index,infoIndex,info)"
                    >回复</span>
                    <div v-if="info.user.screenName === activeName" class='split-line'>|</div>
                    <span @click="delComent(info)"
                      v-if="info.user.screenName === activeName"><a href="javascript:;"
                      class="jee-hover-color" style="color:#666">删除</a></span>
                  </div>
                </div>
                <p class="cont-info t-label">{{$moment(info.createTime,'YYYY-MM-DD HH:mm:ss',true)}}</p>
                <div v-if="info.commentShow" class="cont-comment">
                      <jee-emoji class="cont-input" v-model="info.comment"/>
                      <div class="cont-btns">
                        <el-button type="primary" size="small"
                          :disabled="!info.comment || !_checkPermission('/weibomessage', 'PUT')"
                          @click="handleEventCommentInfo(info)" >发送</el-button>
                        <el-button  size="small"
                          @click="handleEventCancelInfo(index,infoIndex,info)" >收起</el-button>
                      </div>
                  </div>
                <div  v-for="(info2,info2Index) in info.replys" :key="info2Index">
                  <div class="cont-comments cont-item cont-item__level3">
                    <p>
                      {{info2.screenName}}：<span v-html="replaceComment(info2.commentText)"></span><br>
                      <span class="cont-info t-label">{{$moment(info2.createTime,'YYYY-MM-DD HH:mm:ss',true)}}</span>
                    </p>
                    <div class="cont-reply cont-reply__level3"
                      :class="{'jee-color':info2.commentShow}"
                      > <span class="jee-hover-color"
                      @click="handleChangeInfo2(index,infoIndex,info2Index,info2)">回复</span>
                      <div v-if="info2.screenName === activeName" class='split-line'>|</div>
                      <span @click="delComent(info2)"
                        v-if="info2.screenName === activeName"><a href="javascript:;"
                        class="jee-hover-color" style="color:#666">删除</a></span>
                    </div>
                  </div>
                  <div v-if="info2.commentShow" class="cont-comment">
                      <jee-emoji class="cont-input" v-model="info2.comment"/>
                      <div class="cont-btns">
                        <el-button type="primary" size="small"
                          :disabled="!info2.comment || !_checkPermission('/weibomessage', 'PUT')"
                          @click="handleEventCommentInfo(info2,info)" >发送</el-button>
                        <el-button  size="small" type='empty'
                          @click="handleEventCancelInfo2(index,infoIndex,info2Index,info2)" >收起</el-button>
                      </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </li>
    </ul>
    <div  v-if="count > 2&&comments.length<count"
      class="load-more jee-border jee-color"
      @click="getMoreData">加载更多</div>
  </section>
</template>

<script>
import headInfo from './headInfo'
export default {
  name: 'myWeibo',
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
    },
    activeName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      handleText: '评论',
      comments: [],
      count: 0,
      params: {
        page: 1,
        size: 2
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
      this.$request.weibomessageStatus(params).then(res => {
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
    handleEventComment (data, i) {
      console.log(data)
      var params = {
        'comment': data.comment,
        'weiboId': data.id,
        'weiboUserId': this.id
      }
      this.$request.weibomessagePost(params).then(res => {
        this.$restBack(res, () => {
          this.getDataList()
        }, '评论成功')
      })
    },
    handleEventCommentInfo (data, item) {
      console.log(data)
      var params = {
        'comment': data.comment,
        'weiboId': data.weiboId || item.weiboId,
        'weiboUserId': this.id,
        'commentId': data.commentId
      }
      this.$request.weibomessagePut(params).then(res => {
        this.$restBack(res, () => {
          this.getDataList()
        }, '回复成功')
      })
    },
    handleEventConfirm (data, i) {

      // var params = {
      //   'comment': data.comment,
      //   'weiboId': data.weiboId,
      //   'weiboUserId': this.id,
      //   'commentId': data.commentId
      // }
      // this.$request.weibomessagePut(params).then(res => {
      //   this.$restBack(res, ()={this.getDataList()}, '回复成功')
      // })
    },
    handleEventCancel (i) {
      this.$set(this.comments[i], 'commentShow', false)
    },
    handleEventCancelInfo (i, j) {
      let info = this.comments[i].comments[j]
      info.commentShow = false
      this.comments[i].comments.splice(j, 1, info)
    },
    handleEventCancelInfo2 (i, j, z) {
      this.$set(this.comments[i].comments[j].replys[z], 'commentShow', false)
    },
    handleChange (i, item) {
      this.$set(this.comments[i], 'commentShow', true)
    },
    handleChangeInfo2 (i, j, z, item) {
      this.$set(this.comments[i].comments[j].replys[z], 'commentShow', true)
    },
    handleChangeInfo (i, j, item) {
      let info = this.comments[i].comments[j]
      info.commentShow = true
      this.comments[i].comments.splice(j, 1, info)
    },
    // 弹窗信息
    msgChange (message, fn, params) {
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        fn(params)
      }).catch(() => {})
    },
    delComent (data) {
      let params = {
        'commentId': data.commentId,
        'weiboUserId': this.id
      }
      this.msgChange('确定要删除该回复吗？', () => {
        this.$request.weibomessageDelete(params).then(res => {
          this.$restBack(res, () => {
            this.getDataList()
          })
        })
      })
    }
  },
  watch: {
    id (newVal) {
      this.params.page = 1
      if (this.id && this.name === 'myWeibo') {
        this.getDataList()
      }
    },
    name (newVal, oldVal) {
      this.params.page = 1
      if (this.id && this.name === 'myWeibo') {
        this.getDataList()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.id && this.name === 'myWeibo') {
        this.getDataList()
      }
    })
  }
}
</script>

<style lang="scss">
  .my-weibo-index{
    .load-more{
      width: 104px;
      height: 36px;
      text-align: center;
      line-height: 36px;
      font-size: 16px;
      box-sizing: border-box;
      margin: 50px auto 0;
      border: 1px solid;
      cursor: pointer;
    }
    .cont-text{
      letter-spacing: 1px;
    }
    .comments-wrap{
      margin-top: 10px;
      .comments-box{
        padding-bottom: 30px;
        margin-bottom: 30px;
        box-sizing: border-box;
        &__self{
          box-sizing: border-box;
          display: flex;
        }
        &__weibo{
          background-color: #fafafa;
          padding: 20px 0;
          // width: 100%;
          border-radius:4px;
          margin-top: 20px;
          margin-left: 20px;
          box-sizing: border-box;
        }
        &__flex{
          display: flex;
          margin-bottom: 15px;
        }
        &__head{
          width: 90px;
          .t-img{
            margin: 0 20px;
            width: 50px;
            height: 50px;
            overflow: hidden;
            border-radius: 100%;
            background-color: #f0f0f0;
          }
        }
        &__cont{
          flex: 1;
          font-size: 14px;
          color: #666666;
          .cont-info{
            width: 100%;
            line-height: 1;
            color: #333;
            margin: 5px 0 10px;
          }
          .cont-content{
            margin: 8px 0 0;
            display: flex;
          }
          .cont-comments{
            width: 90%;
            display: flex;
            background-color: #F0F0F0;
          }
          .cont-item{
            padding: 10px 20px;
            line-height: 1.6;
            &__level3{
              padding: 10px 0;
              p{
                padding-left: 20px;
              }
            }
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
            color: #666666;
            .jee-svg-icon{
              fill: #666666;
            }
            .split-line{
              padding: 0 20px;
              color: #e0e0e0;
              display: inline-block;
            }
            &__level2{
              padding-right: 4px;
            }
            &__level3{
              margin-right: 11.1111%;
              padding-right: 4px;
            }
          }
          .cont-comment{
            width: 80%;
            min-height: 75px;
            position: relative;
            margin-top: 15px;
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
