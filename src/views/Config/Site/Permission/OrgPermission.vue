<template>
  <section class="site-org-permission-container">
    <select-table
      v-bind="selectList"
      v-on:handleCheckColAllChange="handleCheckColAllChange"
      v-on:handleCheckRowAllChange="handleCheckRowAllChange"
      v-on:handleChange="handleChange"
      v-on:handleCheckAllChange="handleCheckAllChange"
    />
    <div class="btn-save" v-if="!selectList.disabled">
      <el-button type="primary" @click="handleSave"
        :disabled="!_checkPermission('/dataPerm/ownerSite/org', 'PUT')"
      >保存</el-button>
    </div>
</section>
</template>
<script>
import selectTable from '@/components/mixins/selectTable'
const columns = [
  {
    prop: 'orgPerm',
    label: '组织',
    scopeType: 'checkAllRow',
    minWidth: '200',
    fixed: 'left',
    formatter: (row, column, cellValue, index) => {
      return row.orgId ? row.orgName : ''
    },
    hidden: (row, column) => {
      if (row.orgId) {
        return false
      } else {
        return true
      }
    }
  },
  {
    prop: 'rolePerm',
    label: '角色',
    scopeType: 'checkAllRow',
    minWidth: '120',
    hiddenHeader: true,
    formatter: (row, column, cellValue, index) => {
      return row.orgId ? '' : row.roleName
    },
    hidden: (row, column) => {
      if (row.orgId) {
        return true
      } else {
        return false
      }
    }
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
  name: 'OrgPermission',
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    tabIndex: {
      type: String,
      default: ''
    }
  },
  mixins: [selectTable],
  data () {
    return {
      managerAble: false,
      showAssign: true,
      selectList: {
        api: 'fetchSitesPermOrg',
        columns,
        isTree: true,
        params: {
          [this.name]: this.value
        }
        // rowStyle (row, rowIndex) {
        //   return row.orgId ? '' : { backgroundColor: '#f9f9f9' }
        // }
      }
    }
  },
  watch: {
    value (newData, oldData) {
      if (newData && newData !== oldData) {
        this.selectList.params[this.name] = newData
        this.fetchSelectTableApi()
      }
    },
    tabIndex (newVal) {
      if (newVal === 'org') {
        this.fetchSelectTableApi()
      }
    }
  },
  methods: {
    // 请求数据并处理
    fetchTableCallBack (res) {
      if (res.code === 200) {
        const loop = function (data) {
          if (data instanceof Array && data.length) {
            return data.map(d => {
              if (d.ops instanceof Array && d.ops.length) {
                d.ops.forEach(row => {
                  // 操作对象转为勾选框+禁用状态
                  const rd = columns.find(c => c.operation === row.operation)
                  if (rd) {
                    d[rd.prop] = row.hasPerm
                    d[rd.prop + 'Disabled'] = !row.canAssign
                  }
                })
              }
              d.id = d.orgId ? 'orgId_' + d.orgId : 'roleId_' + d.roleId
              if (d.children instanceof Array && d.children.length) {
                d.children = loop(d.children)
              }
              return d
            })
          } else {
            return []
          }
        }
        this.selectList.data = loop(res.data)
        this.managerAble = res.data.managerAble
        this.showAssign = !res.data.assigned
        this.initCheckStatus()
      }
    },
    // handleChange (row, col) {
    //   console.log(row, col)
    // },
    // 保存按钮
    handleSave () {
      this.selectList.loading = true
      let perms = []
      const that = this
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          data.forEach(d => {
            let orgOps = []
            let roleOps = []
            that.selectList.columns.forEach(col => {
              if (col.operation) {
                const oper = {
                  operation: col.operation,
                  selected: d[col.prop]
                }
                if (d.orgId) {
                  orgOps.push(oper)
                } else {
                  roleOps.push(oper)
                }
              }
            })
            perms.push({
              orgId: d.orgId,
              orgOps,
              roleId: d.roleId,
              roleOps
            })
            if (d.children instanceof Array && d.children.length) {
              loop(d.children)
            }
          })
        }
      }
      loop(this.selectList.data)
      const data = {
        dataType: 1,
        dataId: this.value,
        perms
      }
      this.$request.fetchSitesPermOrgUpdate(data).then(res => {
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
.site-org-permission-container{
  .btn-save{
    margin-top: 20px;
  }
  .el-table{
    .role{
      background-color: #f9f9f9;
    }
  }
}
</style>
