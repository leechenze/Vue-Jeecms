<template>
<section class="role-index-container">
    <base-header v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
      v-on:handleEnable="handleHeaderEnable"
      v-on:handleDisable="handleHeaderDisable"
      v-on:handleDelete="handleHeaderDelete"
    />

      <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearchs"
    ></search-header>
    <base-table
      v-bind="list"
      @handleSelectionChange="handleSelectKeyChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleDelete="handleTableDelete"
    ></base-table>
    <msg-dialog
      v-bind="msgDialog"
      v-on:handleConfirm="handleConfirmMsg"
      v-on:handleCancel="hideMsgDialog"
    />
    <form-dialog
      ref="addDialog"
      :loading="addFormLoading"
      :form="addForm"
      :rules="addRules"
      :buttons="addButtons"
      :formItems="addFormItems"
      v-on:handleConfirm="handleConfirmAdd"
      v-on:handleConfirmRole="handleConfirmRole"
    ></form-dialog>
  </section>
</template>

<script>
import role from './role'

const columns = [
  {
    prop: 'roleName',
    label: '角色名称',
    scopeType: 'link',
    href: '/system/role/edit'
    // width: '325px'
  },
  {
    prop: 'orgName',
    label: '所属组织'
  },
  {
    prop: 'createUser',
    label: '创建人',
    minWidth: '125px',
    align: 'center'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    minWidth: '175px',
    scopeType: 'time'
  }
]
export default {
  name: 'roleIndex',
  mixins: [role],
  data () {
    return {
      backUrl: '/system/role/index',
      list: {
        columns,
        api: 'fetchSystemRoleList',
        params: { 'roleName': '', 'orgid': '', 'orgids': [''] },
        filterParams: ['orgids'],
        handleColumn: [
          {
            type: 'Link',
            name: '成员管理',
            icon: 'chengyuanguanli',
            notDisabled: true,
            href: '/system/role/member'
          },
          {
            type: 'Link',
            name: '权限管理',
            notDisabled: true,
            icon: 'kaiqiquanxian',
            href: '/system/role/permission'
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            notDisabled: true,
            power: 'deleteAble',
            disabled: !this._checkPermission('/roles', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '300',
          align: 'left'
        }
      },
      searchHeader: {
        searchItems: [
          {
            type: 'cascader',
            value: 'orgids',
            props: {
              label: 'name',
              value: 'id',
              checkStrictly: true
            },
            label: '所属组织：',
            placeholder: '请选择',
            options: [
              { name: '所有', id: '' }
            ]
          },
          {
            type: 'searchInput',
            value: 'roleName',
            placeholder: '请输入角色名'
          }
        ]
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/roles', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/roles', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false
        // content: '任何用户不可编辑自己所属角色的权限；不可删除自己所属的角色。'
      }

    }
  },
  activated () {
    if (this.$route.query.type === 'list') {
      this.fetchTableApi()
      this.$router.push({ query: { type: '' } })
    }
  },
  methods: {
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
    handleSearchs (data) {
      if (data instanceof Array) {
        this.list.params.orgid = data[data.length - 1]
      }
      this.fetchTableApi()
    },
    // 表格操作按钮
    handleTableDelete (row, index) {
      this.msgDialog.type = 'DeleteOne'
      this.msgDialog.content = '删除角色时会影响与其关联的用户权限，是否确定删除？'
      this.msgDialog.data = [row.id]
      this.showMsgDialog()
    },
    handleHeaderCreate () {
      this.$refs.addDialog.showDialog()
    },
    handleHeaderEnable () {
      if (this.list.selectedKeys.length) {
        this.msgDialog.type = 'Enable'
        this.msgDialog.content = '确定要启用所有选择的数据吗？'
        this.showMsgDialog()
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    handleHeaderDisable () {
      if (this.list.selectedKeys.length) {
        this.msgDialog.type = 'Disable'
        this.msgDialog.content = '确定要禁用所有选择的数据吗？'
        this.showMsgDialog()
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.msgDialog.type = 'Delete'
        this.msgDialog.content = '删除角色时会影响与其关联的用户权限，是否确定删除？'
        this.showMsgDialog()
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    // 弹出框操作按钮
    handleConfirmMsg (type) {
      switch (type) {
        case 'DeleteOne':
          this.fetchSystemRoleDelete(this.msgDialog.data)
          break
        case 'Delete':
          this.fetchSystemRoleDelete(this.list.selectedKeys)
          break
      }
    },
    // 发送请求事件
    getTreeList () {
      if (this.organizeOptions instanceof Array) {
        let arr2 = [{ name: '所有', id: '' }]
        this.addFormItems.find(d => d.prop === 'orgids').options = this.organizeOptions
        this.searchHeader.searchItems[0].options = arr2.concat(this.organizeOptions)
      }
    },
    fetchSystemRoleDelete (ids) {
      this.list.loading = true
      var params = {
        ids: ids,
        type: this.type
      }
      this.$request.fetchSystemRoleDelete(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
          this.FetchRoleOptions(true)
          this.type = 1
        } else if (res.code === 14023) {
          this.type = 2
        }
        this.hideMsgDialog()
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          d.disabled = !d.managerAble
          return d
        })
        if (this.organizeOptions.length < 1) {
          this.FetchOrganizeOptions()
        } else {
          this.getTreeList()
        }
        this.list.totalCount = res.data.totalElements
      }
    }
  },
  watch: {
    organizeOptions (newVal, oldVal) {
      if (newVal) {
        this.getTreeList()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.FetchOrganizeOptions()
    })
  }
}
</script>
<style lang="scss">
.role-index-container{
  .box-items{
    padding: 0 9px;
  }
.el-button{
    margin-bottom: 0 !important;//删除操作说明新增样式
  }
}
</style>
