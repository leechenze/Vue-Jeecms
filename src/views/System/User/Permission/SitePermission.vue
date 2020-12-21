<template>
  <section class="site-permission-container">
    <header>
      <div v-if="name && value && showAssign" class="editable" @click="selectList.disabled = false">
        <jee-icon :iconClass="selectList.disabled?'quanxianbianji01':'quanxianbianji-hover'"></jee-icon>
        <span class="jee-color">权限编辑</span>
      </div>
    </header>
    <select-table
      v-bind="selectList"
      v-on:handleCheckColAllChange="handleCheckColAllChange"
      v-on:handleCheckRowAllChange="handleCheckRowAllChange"
      v-on:handleChange="handleChange"
      v-on:handleCheckAllChange="handleCheckAllChange"
    />
    <div class="btn-save" v-if="!selectList.disabled">
      <el-button type="primary" size="small" @click="handleSave"
        :disabled="!_checkPermission('/dataPerm', 'PUT') || !managerAble"
      >保存</el-button>
    </div>
  </section>
</template>
<script>
import selectTable from '@/components/mixins/selectTable'
const columns = [
  {
    prop: 'name',
    label: '站点',
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
    label: '新建子站点',
    scopeType: 'checkbox',
    minWidth: '130'
  },
  {
    operation: 3,
    prop: 'deploy',
    label: '发布静态页',
    scopeType: 'checkbox',
    minWidth: '130'
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
    prop: 'delete',
    label: '删除',
    scopeType: 'checkbox',
    minWidth: '80'
  },
  {
    operation: 6,
    prop: 'status',
    label: '开启/关闭',
    scopeType: 'checkbox',
    minWidth: '120'
  },
  {
    operation: 7,
    prop: 'allocation',
    label: '权限分配',
    scopeType: 'checkbox',
    minWidth: '110'
  }
]
export default {
  name: 'SitePermission',
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
  mixins: [selectTable],
  data () {
    return {
      managerAble: false,
      showAssign: true,
      selectList: {
        api: 'fetchSysUsersDataPerm',
        columns,
        disabled: true,
        isTree: true,
        params: {
          [this.name]: this.value,
          dataType: this.dataType
        }
      }
    }
  },
  watch: {
    value (newData, oldData) {
      if (newData && newData !== oldData) {
        this.selectList.params[this.name] = newData
        this.fetchSelectTableApi()
      }
    }
  },
  methods: {
    // 请求数据并处理
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.selectList.disabled = !res.data.assigned
        const loop = function (data) {
          if (data instanceof Array && data.length) {
            return data.map(d => {
              // 判断增量对象
              if (d.id === 0) {
                d.popoverText = '增量站点指的是对后续新增站点的权限做设置'
              }
              // 循环操作字段
              if (d.rowDatas instanceof Array && d.rowDatas.length) {
                d.rowDatas.forEach(row => {
                  const rd = columns.find(c => c.operation === row.operation)
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
        this.selectList.data = loop(res.data.dataIds)
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
              siteId: d.id,
              rowDatas
            })
            if (d.children instanceof Array && d.children.length) {
              loop(d.children)
            }
          })
        }
      }
      loop(this.selectList.data)
      const data = {
        dataType: this.dataType,
        [this.name]: this.value,
        dataIds
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
              if (detail) {
                d.detail = detail // 节点中有查询权限的就设查看权限为真，否则不处理
                if (!d.checkAllRow && !d.isRowIndeterminate) {
                  d.isRowIndeterminate = true
                }
              }
            }
            if (d.children && d.children instanceof Array) {
              if (!d.detail) {
                const childrenDetail = d.children.some(c => c.detail)
                if (childrenDetail) {
                  d.detail = childrenDetail // 子节点中有查询权限的就设查看权限为真，否则不处理
                  if (!d.checkAllRow && !d.isRowIndeterminate) {
                    d.isRowIndeterminate = true
                  }
                }
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
      this.selectList.params[this.name] = this.value
      this.fetchSelectTableApi()
    }
  }
}
</script>

<style lang="scss">

</style>
