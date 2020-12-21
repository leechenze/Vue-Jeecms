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
        :disabled="!_checkPermission('/dataPerm/channel/org', 'PUT')"
      >保存</el-button>
    </div>
  </section>
</template>
<script>
import selectTable from '@/components/mixins/selectTable'
const baseColumns = [
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
  }
]
const columnColumns = [
  ...baseColumns,
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
    minWidth: '130'
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
    minWidth: '130'
  },
  {
    operation: 6,
    prop: 'merge',
    label: '栏目合并',
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
const documentColumns = [
  ...baseColumns,
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
    dataType: {
      type: Number,
      default: 2
    },
    tabIndex: {
      type: String,
      default: ''
    },
    permAssignAble: {
      type: Boolean,
      default: true
    }
  },
  mixins: [selectTable],
  data () {
    return {
      selectList: {
        api: 'fetchChannelPermOrg',
        columns: this.dataType === 2 ? columnColumns : documentColumns,
        isTree: true,
        params: {
          dataType: this.dataType,
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
      console.log(newVal)
      if (newVal === 'org') {
        this.fetchSelectTableApi()
      }
    }
  },
  methods: {
    // 请求数据并处理
    fetchTableCallBack (res) {
      if (res.code === 200) {
        const that = this
        const loop = function (data) {
          if (data instanceof Array && data.length) {
            return data.map(d => {
              if (d.ops instanceof Array && d.ops.length) {
                d.ops.forEach(row => {
                  // 操作对象转为勾选框+禁用状态
                  const rd = that.selectList.columns.find(c => c.operation === row.operation)
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
        this.initCheckStatus()
      }
    },
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
        dataType: this.dataType,
        dataId: this.value,
        perms
      }
      this.$request.fetchChannelPermOrgUpdate(data).then(res => {
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
