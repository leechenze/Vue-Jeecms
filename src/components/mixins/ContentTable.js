import contentTable from '@/components/table/ContentTable'

export default {
  components: {
    contentTable
  },
  data () {
    return {
      list: {
        loading: false,
        columns: [],
        data: [],
        params: {},
        ids: [],
        pageSize: 10,
        pageNo: 1,
        totalCount: 0,
        totalPages: 0
      }
    }
  },
  watch: {
    'list.totalCount': function (val) {
      if (this.list.pageNo > 1 && this.list.data.length === 0) {
        this.list.pageNo = 1
        this.fetchContentApi()
      }
    }
  },
  methods: {
    handleCheckAll (ids) {
      this.list.ids = ids
    },
    handleContentSizeChange (val) {
      this.list.pageSize = val
      this.list.ids = []
      this.fetchContentApi()
    },
    handleContentCurrentChange (val) {
      this.list.pageNo = val
      this.list.ids = []
      this.fetchContentApi()
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
    fetchContentApi (params) {
      this.list.loading = true
      if (this.list.api) {
        try {
          let data = {
            page: this.list.pageNo,
            size: this.list.pageSize,
            ...(params || this.list.params)
          }
          this.list.ids = []
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
      this.fetchContentApi()
    })
  }
}
