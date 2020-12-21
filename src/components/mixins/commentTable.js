import commentTable from '@/components/table/CommentTable'

export default {
  components: {
    commentTable
  },
  data () {
    return {
      list: {
        loading: false,
        columns: [],
        comments: [],
        data: [],
        params: {},
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        ids: []
      }
    }
  },
  watch: {
    'list.totalCount': function (val) {
      if (this.list.pageNo > 1 && this.list.data.length === 0) {
        this.list.pageNo = 1
        this.fetchTableApi()
      }
    }
  },
  methods: {
    handleCheckAll (ids) {
      this.list.ids = ids
    },
    handleSizeChange (val) {
      this.list.pageSize = val
      this.list.selectedKeys = []
      this.fetchCommentApi()
    },
    handleCurrentChange (val) {
      this.list.pageNo = val
      this.list.selectedKeys = []
      this.fetchCommentApi()
    },
    handlePageChange () {
      // 页面改写切换页码事件
    },
    hideTableLoading () {
      this.list.loading = false
    },
    handleFilterParams (params) {
      if (params instanceof Object && this.list.filterParams instanceof Array) {
        let p = Object.assign({}, params)
        this.list.filterParams.forEach(d => {
          delete p[d]
        })
        return p
      }
      return params
    },
    // 拖动后重新排序
    changeDataByDrag (newIndex, oldIndex) {
      const currRow = this.list.data.splice(oldIndex, 1)[0]
      this.list.data.splice(newIndex, 0, currRow)
    },
    // api接口请求
    fetchCommentApi (params) {
      this.list.loading = true
      if (this.list.api) {
        try {
          let data = {
            page: this.list.pageNo,
            size: this.list.pageSize,
            ...(params || this.list.params)
          }
          this.list.selectedKeys = []
          return this.$request[this.list.api](this.handleFilterParams(data))
            .then(this.fetchContentCallBack)
            .then(this.hideTableLoading)
            .catch(this.hideTableLoading)
        } catch (error) {
          console.log(error)
          this.list.loading = false
        }
      } else {
        return new Promise((resolve, reject) => {
          this.list.loading = false
          resolve()
        }).catch(this.hideTableLoading)
      }
    },
    fetchContentCallBack (res) {
      // if (res.code === 200) {
      //   this.list.data = res.data.content
      //   this.list.totalCount = res.data.totalElements
      // }
      this.hideTableLoading()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.fetchCommentApi()
    })
  }
}
