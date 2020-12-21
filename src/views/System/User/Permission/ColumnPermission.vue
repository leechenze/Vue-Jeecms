<template>
  <section class="site-permission-container">
    <header>
      <div v-if="canEdit && showAssign" class="editable" @click="selectList.disabled = false">
        <jee-icon :iconClass="selectList.disabled?'quanxianbianji01':'quanxianbianji-hover'"></jee-icon>
        <span class="jee-color">权限编辑</span>
      </div>
    </header>

      <search-header
      class="search-header"
      v-bind="searchHeader"
      @handleSearch="handleSearch"
    ></search-header>
    <select-table
      v-bind="selectList"
      v-on:handleCheckColAllChange="handleCheckColAllChange"
      v-on:handleCheckRowAllChange="handleCheckRowAllChange"
      v-on:handleChange="handleChange"
      v-on:handleCheckAllChange="handleCheckAllChange"
    />
    <div class="btn-save" v-if="canEdit && !selectList.disabled">
      <el-button type="primary" size="small" @click="handleSave"
        :disabled="!_checkPermission('/dataPerm', 'PUT') || !managerAble"
      >保存</el-button>
    </div>
  </section>
</template>
<script>
import selectTable from '@/components/mixins/selectTable'
import searchHeader from '@/components/mixins/searchHeader'

const columnColumns = [
  {
    prop: 'name',
    label: '栏目',
    scopeType: 'checkAllRow',
    width: '200',
    fixed: 'left'
  },
  {
    operation: 1,
    prop: 'detail',
    label: '查看',
    scopeType: 'checkbox',
    minWidth: '80'
  },
  {
    operation: 2,
    prop: 'create',
    label: '新建子栏目',
    scopeType: 'checkbox',
    minWidth: '120'
  },
  {
    operation: 3,
    prop: 'update',
    label: '修改',
    scopeType: 'checkbox',
    minWidth: '80'
  },
  {
    operation: 4,
    prop: 'delete',
    label: '删除',
    scopeType: 'checkbox',
    minWidth: '80'
  },
  {
    operation: 5,
    prop: 'deploy',
    label: '发布静态页',
    scopeType: 'checkbox',
    minWidth: '120'
  },
  {
    operation: 6,
    prop: 'merge',
    label: '栏目合并',
    scopeType: 'checkbox',
    minWidth: '110'
  },
  {
    operation: 7,
    prop: 'allocation',
    label: '权限分配',
    scopeType: 'checkbox',
    minWidth: '110'
  }
]
const documentColumns = [
  {
    prop: 'name',
    label: '栏目',
    scopeType: 'checkAllRow',
    width: '200',
    fixed: 'left'
  },
  {
    operation: 1,
    prop: 'detail',
    label: '查看',
    scopeType: 'checkbox',
    minWidth: '80'
  },
  {
    operation: 2,
    prop: 'create',
    label: '新建',
    scopeType: 'checkbox',
    minWidth: '80'
  },
  {
    operation: 3,
    prop: 'deploy',
    label: '发布',
    scopeType: 'checkbox',
    minWidth: '80'
  },
  {
    operation: 4,
    prop: 'update',
    label: '修改',
    scopeType: 'checkbox',
    minWidth: '80'
  },
  {
    operation: 5,
    prop: 'archive',
    label: '归档',
    scopeType: 'checkbox',
    minWidth: '80'
  },
  {
    operation: 6,
    prop: 'delete',
    label: '删除',
    scopeType: 'checkbox',
    minWidth: '80'
  },
  {
    operation: 7,
    prop: 'top',
    label: '置顶',
    scopeType: 'checkbox',
    minWidth: '80'
  },
  {
    operation: 8,
    prop: 'move',
    label: '移动',
    scopeType: 'checkbox',
    minWidth: '80'
  },
  {
    operation: 9,
    prop: 'sort',
    label: '排序',
    scopeType: 'checkbox',
    minWidth: '80'
  },
  {
    operation: 10,
    prop: 'copy',
    label: '复制',
    scopeType: 'checkbox',
    minWidth: '80'
  },
  {
    operation: 11,
    prop: 'quote',
    label: '引用',
    scopeType: 'checkbox',
    minWidth: '80'
  },
  {
    operation: 12,
    prop: 'type',
    label: '内容类型',
    scopeType: 'checkbox',
    minWidth: '120'
  },
  {
    operation: 13,
    prop: 'sites',
    label: '内容站群推送',
    scopeType: 'checkbox',
    minWidth: '150'
  },
  {
    operation: 14,
    prop: 'weibo',
    label: '内容微博推送',
    scopeType: 'checkbox',
    minWidth: '150'
  },
  {
    operation: 15,
    prop: 'weixin',
    label: '内容微信推送',
    scopeType: 'checkbox',
    minWidth: '150'
  },
  {
    operation: 16,
    prop: 'liulan',
    label: '访问记录',
    scopeType: 'checkbox',
    minWidth: '150'
  }
]
export default {
  name: 'ColumnPermission',
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    dataType: {
      type: Number,
      default: 2
    },
    dataPermStatus: {
      type: Number,
      default: 1
    }
  },
  mixins: [selectTable, searchHeader],
  data () {
    return {
      managerAble: false,
      showAssign: true,
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            value: 'siteId',
            placeholder: '请选择',
            options: [],
            optionValue: 'id',
            optionLabel: 'name'
          }
        ],
        params: {
          [this.name]: this.value,
          siteId: '',
          dataType: this.dataType
        }
      },
      selectList: {
        api: 'fetchSysUsersDataPerm',
        columns: this.dataType === 2 ? columnColumns : documentColumns,
        disabled: true,
        isTree: true
      }
    }
  },
  watch: {
    value (newData, oldData) {
      if (newData && newData !== oldData) {
        this.searchHeader.params[this.name] = newData
        this.handleSearch()
        this.getTreeList()
      }
    }
  },
  computed: {
    canEdit () {
      const p = this.searchHeader.params
      return p[this.name] && p.siteId
    }
  },
  methods: {
    // 请求数据并处理
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.selectList.disabled = !res.data.assigned
        const that = this
        const loop = function (data) {
          if (data instanceof Array && data.length) {
            return data.map(d => {
              // 判断增量对象
              if (d.id === 0) {
                d.popoverText = that.dataType === 2 ? '增量栏目指的是对后续新增栏目的权限做设置' : '增量文档指的是对后续新增文档的权限做设置'
              }
              // 循环操作字段
              if (d.rowDatas instanceof Array && d.rowDatas.length) {
                d.rowDatas.forEach(row => {
                  const rd = that.selectList.columns.find(c => c.operation === row.operation)
                  if (rd) {
                    d[rd.prop] = row.hasPerm
                    d[rd.prop + 'Disabled'] = !row.canAssign
                  }
                })
              }
              if (d.children instanceof Array && d.children.length) {
                d.children = loop(d.children)
              }
              return d
            })
          } else {
            return []
          }
        }
        if (res.data.moreDataIds) this.selectList.data = loop(res.data.moreDataIds.units)
        this.managerAble = res.data.managerAble
        this.showAssign = !res.data.assigned
        this.initCheckStatus()
      }
    },
    // 保存按钮
    handleSave () {
      this.selectList.loading = true
      let dataIds = []
      const that = this
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          data.forEach(d => {
            let rowDatas = []
            that.selectList.columns.forEach(col => {
              if (col.operation) {
                rowDatas.push({
                  operation: col.operation,
                  selected: d[col.prop]
                })
              }
            })
            dataIds.push({
              keyId: d.id,
              rowDatas
            })
            if (d.children instanceof Array && d.children.length) {
              loop(d.children)
            }
          })
        }
      }
      loop(this.selectList.data)
      const { dataType, siteId } = this.searchHeader.params
      const data = {
        dataType,
        [this.name]: this.value,
        moreDataIds: {
          siteId,
          units: dataIds
        }
      }
      this.$request.fetchSysUsersDataPermUpdate(data, this.dataPermStatus).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        }
        this.hideSelectTableLoading()
      }).catch(() => {
        this.hideSelectTableLoading()
      })
    },
    // 请求站点树
    getTreeList () {
      const { dataType } = this.searchHeader.params
      const params = {
        [this.name]: this.value,
        dataType
      }
      this.$request.fetchSysPermSite(params).then(res => {
        if (res.code === 200 && res.data instanceof Array) {
          this.searchHeader.searchItems[0].options = res.data
          const siteId = this.searchHeader.params.siteId
          if (siteId && !res.data.find(d => d.id === siteId)) {
            this.searchHeader.params.siteId = ''
            this.selectList.data = []
          }
        }
      })
    },
    // 搜索站点
    handleSearch () {
      const { siteId } = this.searchHeader.params
      if (this.value && siteId) {
        this.fetchSelectTableApi(this.searchHeader.params)
      }
    },
    // 额外处理: 查看权限、上级查看权限
    handleChangeExtra () {
      // 判断是否需要查看权限
      const hasDetailPerm = function (row) {
        const checked = Object.keys(row).filter(k => !['checkAllRow', 'isRowIndeterminate', 'detail'].includes(k) && !k.endsWith('Disabled') && row[k] === true)
        return checked.length > 0
      }
      // 循环增加查看权限
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          return data.map(d => {
            let detail = false
            if (d.children && d.children instanceof Array) {
              d.children = loop(d.children)
            }
            if (!detail) {
              detail = hasDetailPerm(d)
              if (detail) d.detail = detail // 节点中有查询权限的就设查看权限为真，否则不处理
            }
            if (d.children && d.children instanceof Array) {
              if (!d.detail) {
                const childrenDetail = d.children.some(c => c.detail)
                if (childrenDetail) d.detail = childrenDetail // 子节点中有查询权限的就设查看权限为真，否则不处理
              }
            }
            return d
          })
        }
      }
      loop(this.selectList.data)
    }
  },
  mounted () {
    if (this.name && this.value) {
      this.searchHeader.params[this.name] = this.value
      this.handleSearch()
      this.getTreeList()
    }
  }
}
</script>
