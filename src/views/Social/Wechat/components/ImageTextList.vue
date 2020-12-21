<template>
  <div class="image-text-index">
    <div class="wx-msg-list__body">
      <draggable
        :list="articles"
        v-bind="dragOptions"
        class='drag-wrap'
        :move='onMove'
        @end='onEnd'
      >
        <transition-group>
          <template v-for="(item,index) in articles">
            <!-- 第一条新闻-->
            <div
              @click="setActiveIndex(index)"
              v-if="index==0"
              :class="activeIndex==index ?'jee-border is-active':''"
              class="jee-hover-border-important wx-msg-list__thumb wx-msg-item" :key="index">
              <div class="wx-msg-list__img"
                :style="item.cover?{backgroundImage:'url('+ (item.notWechat?$getPath(item.cover):$weChatUrl(item.cover))+')'}:''">
              </div>
                <div class="wx-msg-item__cover wx-msg-list__title">
                  {{item.title!=''?item.title:'标题'}}
              </div>
            </div>
            <!-- 第2-8条新闻-->
            <div v-else
              @click="setActiveIndex(index)" :class="activeIndex==index ?'jee-border is-active':''"
              class="jee-hover-border-important wx-msg-list__sub wx-msg-item" :key="index">
              <div class="wx-msg-list__img--sub"
                :style="item.cover!=''?{backgroundImage:'url('+(item.notWechat?$getPath(item.cover):$weChatUrl(item.cover))+')'}:''">
              </div>
              <div class="wx-msg-list__title--sub">
                {{item.title!=''?item.title:'标题'}}</div>
              <!--删除移动遮罩-->
              <div class="wx-msg-item__cover" v-if="edit&&index<=7">
                <span class="wx-msg-item__cover--delete ">
                  <i class="el-icon-delete" @click="deleteArticle(index)"></i>
                </span>
              </div>
            </div>
          </template>
        </transition-group>
      </draggable>
    </div>
    <div v-if="edit"
      class="wx-msg-list__add jee-hover-fill jee-hover-border" @click="addArticles">
      <i class="el-icon-plus"></i>
      <span class="t-16 icon-text">新增图文</span>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'image-text-list',
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    index: {
      type: [Number, String],
      default: 0
    },
    edit: {
      type: Boolean,
      default: true
    }
  },
  components: {
    draggable
  },
  data () {
    return {
      articles: [
        {
          'author': '',
          'content': '',
          'picId': '',
          'sourceUrl': '',
          'title': '',
          'cover': ''
        }
      ], // 图文素材集合
      activeIndex: 0,
      dragOptions: {
        group: 'articles',
        sort: true,
        forceFallback: true,
        ghostClass: 'ghost',
        chosenClass: 'chosen',
        dragClass: 'dragging',
        swapThreshold: 0.5,
        animation: 100
      }
    }
  },
  methods: {
    onEnd (e) {
      const fromIndex = e.oldIndex
      const toIndex = e.newIndex
      if (fromIndex === this.activeIndex) {
        this.activeIndex = toIndex
      } else if (fromIndex < this.activeIndex) {
        if (toIndex >= this.activeIndex) {
          this.activeIndex -= 1
        }
      } else if (fromIndex > this.activeIndex) {
        if (toIndex <= this.activeIndex) {
          this.activeIndex += 1
        }
      }
      this.listChange()
    },
    onMove ({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    },
    addArticles () {
      // 新增文章
      let data = {
        'author': '',
        'content': '',
        'picId': '',
        'sourceUrl': '',
        'title': '',
        'cover': '',
        'fixed': false
      }
      if (!this.articles.length) {
        data.fixed = true
      }
      if (this.articles.length < 8) {
        this.articles.push(data)
        this.activeIndex = this.articles.length - 1
      } else {
        this.$message('最多只能添加8条图文信息')
      }
    },
    setActiveIndex (index) {
      // 设置当前选中的文章
      this.activeIndex = index
      this.listChange()
    },
    deleteArticle (index) { // 删除图文列表
      let i = index
      if (this.activeIndex === index) {
        i = index - 1
      }
      this.articles.splice(index, 1)
      this.activeIndex = i
    },
    articlesMove (index, status) { // 图片移动
      if (this.articles.length > 1) {
        if (status === 'next') {
          const tmpItems = this.articles[index - 1]
          this.$set(
            this.articles,
            index - 1,
            this.articles[index]
          )
          this.$set(this.articles, index, tmpItems)
        } else {
          const tmpItems = this.articles[index + 1]
          this.$set(
            this.articles,
            index + 1,
            this.articles[index]
          )
          this.$set(this.articles, index, tmpItems)
        }
      }
    },
    listChange () {
      this.$emit('listChange', this.articles, this.activeIndex)
    }
  },
  watch: {
    list (newVal, oldVal) {
      if (newVal) {
        this.articles = newVal.map((d, i) => {
          d.fixed = i === 0
          return d
        })
      }
    },
    index (newVal, oldVal) {
      this.activeIndex = newVal
    },
    articles (newVal, oldVal) {
      if (newVal) {
        this.listChange()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.articles = this.list.map((d, i) => {
        d.fixed = i === 0
        return d
      })
      this.activeIndex = this.index
    })
  }
}
</script>

<style lang="scss" scoped>
  .image-text-index{
    .wx-msg {
      width: 95%;
      min-width: 900px;
      min-height: 750px;
      margin: 25px auto;
      border: 1px solid #e8e8e8;
      position: relative;
      overflow: hidden;
      &__header {
        padding: 10px 20px;
        font-size: 16px;
      }
      &__footer{
        text-align: center;
        padding: 0  0 10px 0;
      }
      &-list {
        width: 270px;
        border-right: 1px solid #e8e8e8;
        padding: 0 15px;
        float: left;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        &__body {
          cursor: pointer;
        }
        &__thumb {
          position: relative;
          overflow: hidden;
          border: 1px solid #e8e8e8;
          border-radius: 4px 4px 0 0;
        }
        &__sub {
          border: 1px solid #e8e8e8;
          margin-top: -1px;
          overflow: hidden;
          padding: 20px 20px 20px 10px;
        }
        &__img {
          display: block;
          width: 100%;
          height: 100px;
          background: #999999;
          background-size: cover;
          background-repeat: no-repeat;
          &--sub {
            float: right;
            width: 60px;
            height: 60px;
            border-radius: 4px;
            background: #999;
            background-size: cover;
            background-repeat: no-repeat;
          }
        }
        &__thumb{
          .wx-msg-list__img{
            height: 156px;
          }
        }
        &__title {
          color: #ffffff;
          font-size: 16px;
          line-height: 36px;
          font-weight: 400;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          max-height: 36px;
          padding-left: 10px;
          &--sub {
            color: #666666;
            height: 60px;
            line-height: 60px;
            margin-right: 58px;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
          }
        }
        &__add {
          cursor: pointer;
          margin-top: 5px;
          border: 2px dotted #e8e8e8;
          text-align: center;
          height: 90px;
          line-height: 90px;
          font-size: 24px;
          color: #999;
          .icon-text{
            position: relative;
            bottom: 3px;
            left: 20px;
          }
        }
      }
    }
    .wx-msg-item {
      position: relative;
      &__cover{
        position: absolute;
        width: 100%;
        height: 0px;
        background: rgba(0, 0, 0, 0.55);
        bottom: 0;
        left: 0;
        overflow: hidden;
        cursor: pointer;
        z-index: 100;
        &.wx-msg-list__title{
          height: 36px;
        }
        &--move{
          font-size: 20px;
          color: #fff;
          width:36px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          float: left;
        }
        &--delete{
          font-size: 20px;
          color: #fff;
          width:36px;
          height: 36px;
          line-height: 36px;
          float: right;
          text-align: center;
        }
      }
      &:hover{
        .wx-msg-item__cover{
          height: 36px;
        }
      }
      &:hover,
      &.is-active{
        border-width: 1px;
        z-index: 1;
      }
    }
  }
</style>
