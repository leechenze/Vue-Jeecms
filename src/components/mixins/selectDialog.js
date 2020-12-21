import SelectDialog from '@/components/dialog/SelectDialog'

export default {
  components: {
    SelectDialog
  },
  data () {
    return {
      selectDialog: {
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
        selectedKeys: [], // 表格选择的keys
        columns: [],
        api: '',
        params: {},
        searchHeader: []
      }
    }
  },
  methods: {
    // 搜索
    handleSelectSearch () {
      this.selectDialog.pageNo = 1
      this.fetchSelectDialogApi()
    },
    // 表格选择项改变
    handleSelectDialogSelectionChange (val) {
      this.selectDialog.selectedKeys = val
      const id = this.selectDialog.rowKey
      const keys = val.map(v => v[id])
      const tableSelectedRows = this.selectDialog.data.filter(d => keys.includes(d[id]))
      tableSelectedRows.forEach(row => {
        row.isNew = true
        this.handleAddSelectedRows(row)
        // if (!this.form.form.apis.find(r => r[id] === row[id])) {
        //   this.form.form.apis.push(row)
        // }
      })
      const tableUnSelectedRows = this.selectDialog.data.filter(d => !keys.includes(d[id]))
      tableUnSelectedRows.forEach(row => {
        row.isNew = true
        this.handleDelSelectedRows(row)
        // const index = this.form.form.apis.findIndex(r => r[id] === row[id])
        // if (index >= 0) {
        //   this.form.form.apis.splice(index, 1)
        // }
      })
    },
    handleAddSelectedRows (row) {},
    handleDelSelectedRows (row) {},
    handleSelectDialogSizeChange (val) {
      this.selectDialog.pageSize = val
      this.selectDialog.selectedKeys = []
      this.fetchSelectDialogApi()
    },
    handleSelectDialogCurrentChange (val) {
      this.selectDialog.pageNo = val
      this.selectDialog.selectedKeys = []
      this.fetchSelectDialogApi()
    },
    handleSelectDialogPageChange () {
      // 页面改写切换页码事件
    },
    hideSelectDialogLoading () {
      this.selectDialog.loading = false
    },
    // api接口请求
    fetchSelectDialogApi () {
      this.selectDialog.loading = true
      if (this.selectDialog.api) {
        try {
          let params = {
            page: this.selectDialog.pageNo,
            size: this.selectDialog.pageSize,
            ...this.selectDialog.params
          }
          return this.$request[this.selectDialog.api](params).then(this.fetchSelectDialogCallBack)
            .then(this.hideSelectDialogLoading)
            .catch(this.hideSelectDialogLoading)
        } catch (error) {
          console.log(error)
          this.selectDialog.loading = false
        }
      } else {
        return new Promise((resolve, reject) => {
          this.selectDialog.loading = false
          resolve()
        }).catch(this.hideSelectDialogLoading)
      }
    },
    fetchSelectDialogCallBack (res) {
      // if (res.code === 200) {
      //   this.selectDialog.data = res.data.content
      //   this.selectDialog.totalCount = res.data.totalElements
      // }
      this.hideSelectDialogLoading()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.fetchSelectDialogApi()
    })
  }
}
