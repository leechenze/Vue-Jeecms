import TableDialog from '@/components/dialog/TableDialog'

export default {
  components: {
    TableDialog
  },
  data () {
    return {
      tablelist: {
        loading: false,
        showSelection: true,
        selectionWidth: '55',
        showIndex: false,
        indexWidth: '60',
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        rowKey: 'id',
        data: [],
        selectedKeys: [],
        columns: [],
        api: '',
        ids: [],
        params: {},
        searchHeader: {},
        filterParams: []
      }
    }
  },
  watch: {
    'list.totalCount': function (val) {
      if (this.list.pageNo > 1 && this.list.data.length === 0) {
        this.list.pageNo = 1
        this.fetchTableDialogApi()
      }
    }
  },
  methods: {
    handleTableSearch () {
      if (this.tablelist.params.orgids) {
        this.tablelist.params.orgid = this.tablelist.params.orgids[this.tablelist.params.orgids.length - 1] || ''
      }
      this.fetchTableDialogApi()
    },
    handleTableDialogSelectionChange (val) {
      var ids = val.map(v => v[this.tablelist.rowKey])
      this.tablelist.selectedKeys = ids
    },
    handleTableDialogSizeChange (val) {
      this.tablelist.pageSize = val
      this.tablelist.selectedKeys = []
      this.fetchTableDialogApi()
    },
    handleTableDialogCurrentChange (val) {
      this.tablelist.pageNo = val
      this.tablelist.selectedKeys = []
      this.fetchTableDialogApi()
    },
    handleTableDialogPageChange () {
      // 页面改写切换页码事件
    },
    hideTableDialogLoading () {
      this.tablelist.loading = false
    },
    handleFilterParams (params) {
      if (params instanceof Object && this.tablelist.filterParams instanceof Array) {
        let p = Object.assign({}, params)
        this.tablelist.filterParams.forEach(d => {
          delete p[d]
        })
        return p
      }
      return params
    },
    // api接口请求
    fetchTableDialogApi (params) {
      this.tablelist.loading = true
      if (this.tablelist.api) {
        try {
          let data = {
            page: this.tablelist.pageNo,
            size: this.tablelist.pageSize,
            ...(params || this.tablelist.params)
          }
          return this.$request[this.tablelist.api](this.handleFilterParams(data))
            .then(this.fetchTableDialogCallBack)
            .then(this.hideTableDialogLoading)
            .catch(this.hideTableDialogLoading)
        } catch (error) {
          console.log(error)
          this.tablelist.loading = false
        }
      } else {
        return new Promise((resolve, reject) => {
          this.tablelist.loading = false
          resolve()
        }).catch(this.hideTableDialogLoading)
      }
    },
    fetchTableDialogCallBack (res) {
      this.hideTableDialogLoading()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.fetchTableDialogApi()
    })
  }
}
