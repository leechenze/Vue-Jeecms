import BaseTable from '@/components/table/BaseTable'
import i18n from '@/i18n'

export default {
  components: {
    BaseTable
  },
  data () {
    return {
      list: {
        loading: false,
        showSelection: true,
        selectionWidth: '55',
        showIndex: false,
        treeProps: {
          children: 'children',
          hasChildren: 'hasChildren'
        },
        expandAll: false,
        indexWidth: '60',
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        rowKey: 'id',
        data: [],
        selectedKeys: [],
        columns: [],
        handleColumn: [],
        handleColumnProp: {
          label: i18n.t('global.handle')
          // width: ''
          // align: 'left'
        },
        api: '',
        params: {},
        filterParams: []
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
    handleTableBack () {
      this.$router.go(-1)
    },
    cellClick (val) {
      // console.log(val)
    },
    handleTableRoutePush (url, row, e) {
      e.preventDefault()
      var param = {
        id: row[this.rowKey],
        ...row.params
      }
      this.$routerLink(url, row.type || 'Link', param)
    },
    handleSelectionChange (data) {
      var ids = []
      const key = this.list.rowKey || 'id'
      const children = this.list.treeProps.children || 'children'
      const loop = function (list) {
        if (list instanceof Array && list.length) {
          list.forEach(d => {
            ids.push(d[key])
            if (d[children]) loop(d[children])
          })
        }
      }
      loop(data)
      this.list.selectedKeys = ids
      console.log(this.list.selectedKeys)
    },
    handleSizeChange (val) {
      this.list.pageSize = val
      this.list.selectedKeys = []
      this.fetchTableApi()
    },
    handleCurrentChange (val) {
      this.list.pageNo = val
      this.list.selectedKeys = []
      this.fetchTableApi()
    },
    handlePageChange () {
      // 页面改写切换页码事件
    },
    hideTableLoading () {
      this.list.loading = false
    },
    handleFilterParams (params, name = 'list') {
      if (params instanceof Object && this[name].filterParams instanceof Array) {
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
    fetchTableApi (params) {
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
            .then(this.fetchTableCallBack)
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
    fetchTableCallBack (res) {
      // if (res.code === 200) {
      //   this.list.data = res.data.content
      //   this.list.totalCount = res.data.totalElements
      // }
      this.hideTableLoading()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.fetchTableApi()
    })
  }
}
