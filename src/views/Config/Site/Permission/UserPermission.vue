<template>
  <section class="site-org-permission-container">

      <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="selectList.params"
      @handleSearch="handleSearch"
    ></search-header>
    <select-table
      v-bind="selectList"
      v-on:handleCheckColAllChange="handleCheckColAllChange"
      v-on:handleCheckRowAllChange="handleCheckRowAllChange"
      v-on:handleChange="handleChange"
      v-on:handleCheckAllChange="handleCheckAllChange"
      @handleSizeChange="handleSelectTableSizeChange"
      @handleCurrentChange="handleSelectTableCurrentChange"
    />
    <div class="btn-save" v-if="!selectList.disabled">
      <el-button type="primary" @click="handleSave"
        :disabled="!_checkPermission('/dataPerm/ownerSite/user', 'PUT')"
      >保存</el-button>
    </div>
  </section>
</template>
<script>
import selectTable from '@/components/mixins/selectTable'
import searchHeader from '@/components/mixins/searchHeader'

const columns = [
  {
    prop: 'username',
    label: '用户名/真实姓名',
    scopeType: 'checkAllRow',
    minWidth: '200',
    formatter: (row, column, cellValue, index) => {
      return `${row.user.username}/${row.user.realname}`
    }
  },
  {
    prop: 'orgName',
    label: '组织/角色',
    minWidth: '150',
    formatter: (row, column, cellValue, index) => {
      return `${row.user.orgName}/${row.user.roleNames}`
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
  name: 'UserPermission',
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
  mixins: [selectTable, searchHeader],
  data () {
    return {
      searchHeader: {
        loading: false,
        searchItems: [
          {
            type: 'cascader',
            label: '所属组织：',
            value: 'orgids',
            props: {
              label: 'name',
              value: 'id',
              checkStrictly: true
            },
            placeholder: '请选择',
            options: []
          },
          {
            type: 'select',
            label: '所属角色：',
            value: 'roleid',
            options: [],
            optionValue: 'id',
            optionLabel: 'roleName'
          },
          {
            type: 'searchInput',
            value: 'key',
            placeholder: '请输入关键字如：用户名、真实姓名、手机号、座机号、邮箱',
            width: 430
          }
        ]
      },
      selectList: {
        api: 'fetchSitesPermUser',
        showPagination: true,
        columns,
        params: {
          [this.name]: this.value,
          orgids: [''],
          orgid: '',
          roleid: '',
          key: ''
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
    },
    'selectList.params.orgids': function (newData) {
      this.getRoleOptions()
    },
    tabIndex (newVal) {
      if (newVal === 'user') {
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
              d.id = d.user.id
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
              if (d.children instanceof Array && d.children.length) {
                d.children = loop(d.children)
              }
              return d
            })
          } else {
            return []
          }
        }
        this.selectList.data = loop(res.data.content)
        this.selectList.totalCount = res.data.totalElements
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
            let ops = []
            that.selectList.columns.forEach(col => {
              if (col.operation) {
                ops.push({
                  operation: col.operation,
                  selected: d[col.prop]
                })
              }
            })
            perms.push({
              userId: d.id,
              ops
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
      this.$request.fetchSitesPermUserUpdate(data).then(res => {
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
    // 搜索
    handleSearch () {
      this.fetchSelectTableApi()
    },
    // 参数过滤
    handleFilterParams (params) {
      params.orgid = params.orgids.length > 0 ? params.orgids[params.orgids.length - 1] : ''
      delete params.orgids
      return params
    },
    // 获取组织
    getOrgOptions () {
      this.$request.fetchOrganizeTreeAll().then(res => {
        if (res.code === 200 && res.data instanceof Array) {
          this.searchHeader.searchItems[0].options = [{
            name: '所有',
            id: ''
          }, ...res.data]
        }
      })
    },
    // 获取角色
    getRoleOptions () {
      let orgIds = this.selectList.params.orgids
      let orgId = ''
      if (orgIds instanceof Array && orgIds.length) {
        orgId = orgIds[orgIds.length - 1]
      }
      const params = {
        orgId
      }
      this.$request.fetchRolesList(params).then(res => {
        if (res.code === 200 && res.data instanceof Array) {
          this.searchHeader.searchItems[1].options = [{
            roleName: '所有',
            id: ''
          }, ...res.data]
        }
      })
    }
  },
  mounted () {
    if (this.name && this.value) {
      this.selectList.params[this.name] = this.value
      this.fetchSelectTableApi()
    }
    this.getOrgOptions()
    this.getRoleOptions()
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
