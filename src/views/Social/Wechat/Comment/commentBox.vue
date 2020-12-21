<template>
  <div class="t-border comment-box-index">
    <div style="padding:0 20px">
      <el-date-picker
        v-model="params.times"
        type="month"
        style="margin-bottom:20px;"
        size="small"
        value-format="yyyy-MM"
        :picker-options="pickerOptions"
        @change="handleSearchHead"
        placeholder="筛选文章年月">
      </el-date-picker>
      <el-select
        size="small"
        style="margin-bottom:20px;width:220px"
        popper-class="jee-border"
        v-model="params.comment"
        @change="handleSearchHead"
      >
          <el-option label="全部文章" :value="false"></el-option>
          <el-option label="有留言的文章" :value="true"></el-option>
      </el-select>
    </div>
    <ul class="cb-items">
      <li class="cb-item t-top" :class="{'is-active':item.article.id === activeId}"
        v-for="(item,index) in commentList" :key="index"
         @click="changeMsgId(item)">
        <div class="cb-item__title">{{item.article.title}}</div>
        <div class="cb-item__label">
          <span class="fl">{{item.article.createTime}}</span>
          <span class="fr t-12">{{item.article.open?(item.comments||0)+'条':'留言功能暂未开启'}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'comment-box',
  props: {
    appId: {
      type: String,
      default: ''
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      params: {
        'appId': '',
        'year': '',
        'month': '',
        'comment': false,
        'times': null
      },
      commentList: [],
      activeId: '',
      pickerOptions: {
        disabledDate: function (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  watch: {
    appId (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.params.appId = this.appId
        this.handleSearchHead()
      }
    },
    isOpen (newval, oldval) {
      if (newval) {
        this.handleSearchHead()
      }
    }
  },
  mounted () {
    if (this.appId) {
      this.params.appId = this.appId
      this.handleSearchHead()
    }
  },
  methods: {
    handleSearchHead () {
      let times = []
      if (this.params.times) {
        times = this.params.times.split('-')
      } else {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        times = [year, month]
        this.params.times = times.join('-')
      }
      this.params.year = times[0]
      this.params.month = times[1]
      this.getData()
    },
    // 获取列表
    getData () {
      if (this.appId) {
        this.$request.fetchWechatcommentArticles(this.params).then(res => {
          if (res.code === 200) {
            this.commentList = res.data
            if (res.data instanceof Array && res.data.length > 0) {
              this.changeMsgId(res.data[0])
            } else {
              this.$emit('changeMsgId', {})
            }
          }
        })
      }
    },
    // 传递数据到父级
    changeMsgId (data) {
      this.activeId = data.article.id
      this.$emit('changeMsgId', data.article, this.params)
    }
  }
}
</script>

<style lang="scss" scoped>
  .comment-box-index{
    width: 280px;
    height: 100%;
    padding: 20px 0;
    box-sizing: border-box;
    margin-right: 20px;
    border-radius: 4px;
    .cb-items{
      .cb-item{
        cursor: pointer;
        min-height: 95px;
        line-height: 1;
        padding: 17px 20px 20px;
        font-size: 14px;
        box-sizing: border-box;
        position: relative;
        &__label{
          position: absolute;
          width:calc(100% - 40px);
          bottom: 20px;
          font-size: 12px;
          color: #999999;
        }
        &__title{
          line-height: 1.5;
          // 两行显示省略号
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
    .is-active{
      background-color: #F9F9F9;
      // color: #999999;
    }
  }
</style>
