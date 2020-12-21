import SelectTable from '@/components/table/SelectTable'
import { deepClone } from '@/utils'

export default {
  components: {
    SelectTable
  },
  data () {
    return {
      selectList: {
        loading: false,
        showSelection: false,
        selectionWidth: '55',
        showIndex: false,
        indexWidth: '60',
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        filterParams: [],
        showPagination: false,
        rowKey: 'id',
        data: [],
        selectedKeys: [],
        columns: [],
        api: '',
        params: {},
        checkColAll: {},
        checkAll: false,
        isIndeterminate: false
      }
    }
  },
  watch: {
    'list.totalCount': function (val) {
      if (this.list.pageNo > 1 && this.list.data.length === 0) {
        this.list.pageNo = 1
        this.fetchSelectTableApi()
      }
    }
  },
  methods: {
    // 重选分页大小
    handleSelectTableSizeChange (val) {
      this.selectList.pageSize = val
      this.selectList.selectedKeys = []
      this.fetchSelectTableApi()
    },
    // 重选分页
    handleSelectTableCurrentChange (val) {
      this.selectList.pageNo = val
      this.selectList.selectedKeys = []
      this.fetchSelectTableApi()
    },
    handleSelectTablePageChange () {
      // 页面改写切换页码事件
    },
    // 取消loading
    hideSelectTableLoading () {
      this.selectList.loading = false
    },
    // 选择行
    handleSelectionChange (val) {
      this.selectList.selectedKeys = val
    },
    // 参数过滤
    handleFilterParams (params) {
      if (params instanceof Object && this.selectList.filterParams instanceof Array) {
        let p = Object.assign({}, params)
        this.selectList.filterParams.forEach(d => {
          delete p[d]
        })
        return p
      }
      return params
    },
    // api接口请求
    fetchSelectTableApi (params) {
      this.selectList.loading = true
      if (this.selectList.api) {
        try {
          let data = {
            page: this.selectList.pageNo,
            size: this.selectList.pageSize,
            ...(params || this.selectList.params)
          }
          return this.$request[this.selectList.api](this.handleFilterParams(data)).then(this.fetchTableCallBack)
            .then(this.hideSelectTableLoading)
            .catch(this.hideSelectTableLoading)
        } catch (error) {
          console.log(error)
          this.selectList.loading = false
        }
      } else {
        return new Promise((resolve, reject) => {
          this.selectList.loading = false
          resolve()
        }).catch(this.hideSelectTableLoading)
      }
    },
    // 需要复写的请求回调
    fetchTableCallBack (res) {
      // if (res.code === 200) {
      //   this.selectList.data = res.data.content
      //   this.selectList.totalCount = res.data.totalElements
      // }
      this.hideSelectTableLoading()
    },

    // 表格头状态
    getCheckColAll (columns) {
      let checkColAll = {}
      columns.forEach(c => {
        if (c.scopeType === 'checkbox') {
          checkColAll[c.prop] = {
            checkAll: false,
            isIndeterminate: false
          }
        }
      })
      return checkColAll
    },
    // 树型数据平铺出来
    getDataArray () {
      const data = deepClone(this.selectList.data)
      let list = []
      const loop = function (data) {
        if (data instanceof Array) {
          data.forEach(d => {
            list.push(d)
            if (d.children && d.children instanceof Array) {
              loop(d.children)
            }
          })
        }
      }
      loop(data)
      return list
    },
    // 处理每列全选状态
    handleCheckColAll () {
      const list = this.getDataArray()
      // 以列名为key，计算是否全选
      let checkColAll = {}
      this.selectList.columns.forEach(c => {
        if (c.scopeType === 'checkbox') {
          const checked = list.filter(d => d[c.prop] === true)
          const unChecked = list.filter(d => d[c.prop] === false)
          checkColAll[c.prop] = {
            checkAll: unChecked.length <= 0,
            isIndeterminate: unChecked.length > 0 && checked.length > 0
          }
        }
      })
      this.selectList.checkColAll = checkColAll
      return checkColAll
    },
    // 处理每行全选状态
    handleCheckAllRow (row) {
      const unChecked = Object.keys(row).filter(k => !['checkAllRow', 'isRowIndeterminate'].includes(k) && !k.endsWith('Disabled') && row[k] === false)
      let result = unChecked.length <= 0
      return result
    },
    // 处理每列全选状态
    handleCheckIndeterminateRow (row) {
      const checked = Object.keys(row).filter(k => !['checkAllRow', 'isRowIndeterminate'].includes(k) && !k.endsWith('Disabled') && row[k] === true)
      const unChecked = Object.keys(row).filter(k => !['checkAllRow', 'isRowIndeterminate'].includes(k) && !k.endsWith('Disabled') && row[k] === false)
      let result = unChecked.length > 0 && checked.length > 0
      return result
    },
    // 处理首次加载的数据
    handleChangeData (data) {
      if (data instanceof Array) {
        data.map(d => {
          if (d.children && d.children instanceof Array) {
            d.children = this.handleChangeData(d.children)
          }
          Object.keys(d).forEach(k => {
            if (d[k] === '1') {
              d[k] = true
            } else if (d[k] === '0') {
              d[k] = false
            }
          })
          d.checkAllRow = this.handleCheckAllRow(d)
          d.isRowIndeterminate = this.handleCheckIndeterminateRow(d)
          return d
        })
      }
      return data
    },
    // 全选行
    handleCheckRowAllChange (row) {
      const checkAllRow = !row.checkAllRow
      // 该行全选或全不选
      const handleRow = function (d) {
        d.checkAllRow = checkAllRow
        d.isRowIndeterminate = false
        Object.keys(d).forEach(k => {
          if (!['checkAllRow', 'isRowIndeterminate'].includes(k) && !k.endsWith('Disabled') && !d[k + 'Disabled']) {
            if (d.checkAllRow && d[k] === false) {
              d[k] = true
            }
            if (!d.checkAllRow && d[k] === true) {
              d[k] = false
            }
          }
        })
        return d
      }
      const loop = function (data, handleChildren = false) {
        if (data instanceof Array) {
          return data.map(d => {
            if (d.id === row.id || handleChildren) {
              d = handleRow(d)
              if (d.children && d.children instanceof Array) {
                d.children = loop(d.children, true)
              }
            } else {
              if (d.children && d.children instanceof Array) {
                d.children = loop(d.children)
              }
            }
            return d
          })
        }
      }

      loop(this.selectList.data)
      this.handleChangeExtra()
    },
    // 全选列
    handleCheckColAllChange (col, checkAll) {
      const that = this
      if (that.selectList.checkColAll[col]) {
        that.selectList.checkColAll[col].checkAll = checkAll
        that.selectList.checkColAll[col].isIndeterminate = false
      }
      const loop = function (data) {
        if (data instanceof Array) {
          return data.map(d => {
            if (d[col] !== checkAll && !d[col + 'Disabled']) {
              d[col] = checkAll
              d.checkAllRow = that.handleCheckAllRow(d)
              d.isRowIndeterminate = that.handleCheckIndeterminateRow(d)
            }
            if (d.children && d.children instanceof Array) {
              d.children = loop(d.children)
            }
            return d
          })
        }
      }

      loop(this.selectList.data)
      this.handleChangeExtra()
    },
    // 单元格选择单元格
    handleChange (row, col) {
      const that = this
      const loop = function (data) {
        if (data instanceof Array) {
          return data.map(d => {
            if (!row || d.id === row.id) {
              d.checkAllRow = that.handleCheckAllRow(d)
              d.isRowIndeterminate = that.handleCheckIndeterminateRow(d)
            }
            if ((!row || d.id !== row.id) && d.children && d.children.length) {
              loop(d.children)
            }
            return d
          })
        }
      }
      // 改变每行的全选状态
      loop(this.selectList.data)
      // 改变每列的全选状态
      this.handleCheckColAll()
      // 额外处理事件
      this.handleChangeExtra()
    },
    // 全选
    handleCheckAllChange (value) {
      const loop = function (data) {
        if (data instanceof Array) {
          return data.map(d => {
            Object.keys(d).forEach(k => {
              if (typeof d[k] === 'boolean' && !k.endsWith('Disabled') && !d[k + 'Disabled']) d[k] = value
            })
            d.isRowIndeterminate = false

            if (d.children instanceof Array && d.children.length) {
              d.children = loop(d.children)
            }
            return d
          })
        }
      }
      // 处理每行、每单元格选择
      loop(this.selectList.data)
      // 处理列头选择
      Object.keys(this.selectList.checkColAll).forEach(k => {
        if (this.selectList.checkColAll[k]) {
          this.selectList.checkColAll[k].checkAll = value
          this.selectList.checkColAll[k].isIndeterminate = false
        }
      })
      this.handleChangeExtra()
      // console.log(value, this.selectList.checkColAll)
    },
    // 初始化所有选择框状态
    initCheckStatus () {
      this.handleChange()
    },
    // 额外操作事件
    handleChangeExtra () {}
  }
}
