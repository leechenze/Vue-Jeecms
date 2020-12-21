
<script>
import myComments from './MyComments'
export default {
  extends: myComments,
  name: 'issueComments',
  data () {
    return {
      handleType: 'delete',
      handleText: '删除评论',
      params: {
        page: 1,
        size: 5
      }
    }
  },
  watch: {
    id (newVal) {
      this.params.page = 1
      if (this.id && this.name === 'issueComments') {
        this.getDataList()
      }
    },
    name (newVal, oldVal) {
      this.params.page = 1
      if (this.id && this.name === 'issueComments') {
        this.getDataList()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.id && this.name === 'issueComments') {
        this.getDataList()
      }
    })
  },
  methods: {
    getDataList () {
      var params = {
        id: this.id,
        ...this.params
      }
      this.$request.weibomessageSendComments(params).then(res => {
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
    handleChange (i, item, data) {
      this.msgChange('确定要删除该回复吗？', () => {
        var params = {
          'commentId': data.commentId,
          'weiboUserId': this.id
        }
        this.$request.weibomessageDelete(params).then(res => {
          this.$restBack(res, () => {
            this.getDataList()
          })
        })
      })
    }

  }
}
</script>
