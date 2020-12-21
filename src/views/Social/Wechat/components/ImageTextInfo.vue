<template>
  <section class="image-text-content" v-if="article">
    <div class="wx-msg-head" v-if="uploadBtn">
      <!-- <label>多媒体：</label>
      <el-button type="primary" size="small">上传图片</el-button> -->
      <label>封面：</label>
      <el-button type="primary" size="small" @click="showUpload">上传封面</el-button>
      <upload
        ref="imageUpload"
        resourceType="image"
        @handleConfirm="handleConfirmImg"
      ></upload>
    </div>
    <!-- 文章内容 -->
      <div class="wx-msg-content">
        <div class="wx-msg-content__inner">
          <el-input type="text" class="wx-content__title"
            v-model="articleObj.title" :readonly="!edit"
            placeholder="请在这里输入标题" autofocus maxlength="48"></el-input>
          <label class="wx-content__label">{{articleObj.title.length || 0}}/48</label>
        </div>
        <div class="wx-msg-content__inner">
          <el-input type="text" class="wx-content__author"
            v-model="articleObj.author" :readonly="!edit"
            placeholder="请输入作者" maxlength="8"></el-input>
          <label class="wx-content__label">{{articleObj.author.length || 0}}/8</label>
        </div>
         <div class="wx-msg-content__inner">
          <el-input type="text" class="wx-content__author"
            v-model="articleObj.sourceUrl" :readonly="!edit"
            placeholder="原创链接地址" maxlength="100"></el-input>
        </div>
        <div class="wx-msg__editor">
          <u-editor v-model="articleObj.content" :isWechatUpload="true" :options="{initialFrameHeight: 500}"></u-editor>
        </div>
      </div>
  </section>
</template>

<script>
import UEditor from '@/components/editor/UEditor'
import Upload from '@/components/editor/Upload'
export default {
  name: 'image-text-info',
  components: {
    UEditor,
    Upload
  },
  props: {
    article: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: {
      type: [Number, String],
      default: 0
    },
    uploadBtn: {
      type: Boolean,
      default: true
    },
    edit: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      articleObj: {
        'author': '',
        'content': '',
        'picId': '',
        'sourceUrl': '',
        'title': '',
        'cover': ''
      },
      // 图文素材集合
      activeIndex: 0,
      editorRes: true
    }
  },
  watch: {
    article: {
      deep: true,
      handler (newVal, oldVal) {
        this.$nextTick(() => {
          this.articleObj = this.article
        })
      }
    },
    index (newVal, oldVal) {
      if (JSON.stringify(this.article) !== JSON.stringify(this.articleObj)) {
        this.activeIndex = newVal
        this.$nextTick(() => {
          this.articleObj = this.article
        })
      }
    },
    articleObj (newVal, oldVal) {
      if (JSON.stringify(this.article || {}) !== JSON.stringify(this.articleObj || {})) {
        this.infoChange()
      }
    }
  },
  methods: {
    showUpload () {
      this.$refs.imageUpload.showDialog()
    },
    infoChange () {
      this.$emit('infoChange', this.articleObj)
    },
    handleConfirmImg (html, data, file) {
      if (data) {
        this.articleObj.picId = data.id
        this.articleObj.cover = data.url
        if (data.id) {
          this.getPicId(data.id)
        } else if (file) {
          let { uploadFile } = file
          if (!uploadFile.get('appId')) {
            uploadFile.append('appId', this.$route.query.appId)
            uploadFile.append('type', 'image')
          }
          this.getPicUrl(uploadFile)
        }
      }
    },
    getPicId (id) {
      if (id && this.$route.query.appId) {
        let params = {
          appId: this.$route.query.appId,
          id: id
        }
        this.$request.fetchWechatMaterialSynchImg(params).then(res => {
          if (res.code === 200) {
            this.articleObj.picId = this.articleObj.mediaId = res.data.request.mediaId
            this.articleObj.cover = this.articleObj.mediaUrl = res.data.request.url
            this.infoChange()
          }
        })
      }
    },
    getPicUrl (params) {
      this.$request.fetchWechatMaterialMaterialAdd(params).then(res => {
        if (res.code === 200) {
          this.articleObj.picId = this.articleObj.mediaId = res.data.request.mediaId
          this.articleObj.cover = this.articleObj.mediaUrl = res.data.request.url
          this.infoChange()
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .image-text-content{
     .wx-msg{
       &-head{
         margin-bottom: 25px;
         color: #333333;
         .el-button{
           margin-left: 5px;
           margin-right: 30px;
         }
       }
       &__editor{
          width: 100%;
          border-radius: 4px;
          // border-bottom: 1px solid #e8e8e8;
          // overflow: hidden;
        }
       // 富文本区域
      &-content {
        &__inner {
          border-top: 1px solid #e8e8e8;
          .el-input{
            width: 92%;
            .el-input__inner{
              height: 55px;
              font-size: 16px;
              color: #333333;
              border: none;
            }
          }
         .wx-content__label {
            font-size: 16px;
            color: #999999;
          }
        }
      }
      .wx-content__title {
        width: 92%;
        display: inline-block;
        border: none;
        outline: none;
        font-size: 16px;
        height: 46px;
        line-height: 46px;
        margin-bottom: 10px;
      }
      .wx-content__author {
        width: 80%;
        display: inline-block;
        border: none;
        outline: none;
        font-size: 14px;
        height: 32px;
        line-height: 32px;
        margin-bottom: 10px;
      }
     }
  }
</style>
