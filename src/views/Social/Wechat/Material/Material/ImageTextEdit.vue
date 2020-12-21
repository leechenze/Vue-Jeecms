<script>
import ImageTextAdd from './ImageTextAdd'
export default {
  extends: ImageTextAdd,
  name: 'socialWechatMaterialImageTextEdit',
  data () {
    return {
      id: '',
      mediaId: '',
      mediaType: ''
    }
  },
  methods: {
    getDataList (id) {
      this.$request.fetchWechatMaterialGet({ id: id }).then(res => {
        if (res.code === 200) {
          this.mediaId = res.data.mediaId
          this.id = res.data.id
          this.mediaType = res.data.mediaType
          let arr = res.data.requestArray.map(d => {
            d = {
              'author': d.author,
              'content': d.content,
              'picId': d.thumbMediaId,
              'thumbMediaId': d.thumbMediaId,
              'sourceUrl': d.contentSourceUrl,
              'title': d.title,
              'thumbMediaUrl': d.thumbMediaUrl,
              'cover': d.thumbMediaUrl,
              url: d.url
            }
            return d
          })
          this.getData = arr
          // 留言设置回填
          this.form.form.comment = res.data.requestArray[0].needOpenComment ? (res.data.requestArray[0].onlyFansCanComment ? 2 : 1) : 0
        }
      })
    },
    saveArticle (data, type) {
      let params = {
        id: this.id,
        news: data.addNewsRequest.articles.map((t, i) => {
          return {
            'mediaId': this.mediaId,
            'index': i,
            'articles': t,
            'thumbMediaUrl': t.thumbMediaUrl
          }
        })
      }
      const that = this
      this.$request.fetchWechatMaterialNewsPut(params).then(res => {
        this.$restBack(res, () => {
          if (type === 'grupSend') {
            const comment = {
              requestArray: data.addNewsRequest.articles,
              msgType: that.mediaType,
              mediaId: that.mediaId
            }
            that.$set(that.edit.form, 'comment', comment)
            that.$set(that.edit.form, 'materialId', that.id)
            this.$refs.editDialog.showDialog()
          } else {
            this.removeTab(this.$route.fullPath)
            this.$routerLink('/social/wechat/material/index', 'list')
          }
        }, '修改成功')
      })
    }
  },
  activated () {
    let { id } = this.$route.query
    if (id !== this.id) {
      this.id = id
      this.getDataList(id)
    }
  },
  mounted () {
    let { id } = this.$route.query
    if (id) {
      this.id = id
      this.getDataList(id)
    }
  }
}
</script>
