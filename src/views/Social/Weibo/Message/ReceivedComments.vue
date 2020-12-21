
<script>
import myComments from './MyComments'
export default {
  extends: myComments,
  name: 'receivedComments',
  data () {
    return {
      params: {
        page: 1,
        size: 5
      }
    }
  },
  methods: {
    getDataList () {
      var params = {
        id: this.id,
        ...this.params
      }
      this.$request.weibomessageRecComments(params).then(res => {
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
    }
  },
  watch: {
    id (newVal) {
      this.params.page = 1
      if (this.id && this.name === 'receivedComments') {
        this.getDataList()
      }
    },
    name (newVal, oldVal) {
      this.params.page = 1
      if (this.id && this.name === 'receivedComments') {
        this.getDataList()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.id && this.name === 'receivedComments') {
        this.getDataList()
      }
    })
  }
}
</script>
