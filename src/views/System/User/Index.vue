<template>
  <section class="user-index-container">
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
      v-on:handleSelectionChange="handleSelectKeyChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDelete="handleTableDelete"
      @handleStatus="handleModelStatus"
      @handleEdit="handleTableEdit"
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
    <form-dialog
      title="重置密码"
      ref="updateDialog"
      :loading="updateFormLoading"
      :form="updateForm"
      :rules="updateRules"
      :formItems="updateFormItems"
      :buttons="updateButtons"
      v-on:handleConfirm="handleConfirmUpdate"
    ></form-dialog>
  </section>
</template>

<script>
import user from './user'
const columns = [
  {
    prop: 'username',
    label: '用户名',
    scopeType: 'link',
    href: '/system/user/create',
    width: '122px'
  },
  {
    prop: 'userExt.realname',
    label: '真实姓名',
    minWidth: '120px'
  },
  {
    prop: 'orgName',
    label: '所属组织',
    minWidth: '142px'
  },
  {
    prop: 'roleNames',
    label: '所属角色',
    minWidth: '180px'
  },
  {
    prop: 'createUser',
    label: '创建人',
    minWidth: '162px'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    scopeType: 'time',
    minWidth: '170px'
  },
  {
    prop: 'enabled',
    label: '状态',
    scopeType: 'switch',
    type: 'Status'
  }
]
const columns2 = [
  {
    prop: 'username',
    label: '用户名',
    scopeType: 'link',
    href: '/system/user/create',
    width: '122px'
  },
  {
    prop: 'userExt.realname',
    label: '真实姓名',
    minWidth: '120px'
  },
  {
    prop: 'orgName',
    label: '所属组织',
    minWidth: '142px'
  },
  {
    prop: 'roleNames',
    label: '所属角色',
    minWidth: '180px'
  },
  {
    prop: 'userSecretName',
    label: '人员密级',
    minWidth: '110px'
  },
  {
    prop: 'createUser',
    label: '创建人',
    minWidth: '162px'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    scopeType: 'time',
    minWidth: '170px'
  },
  {
    prop: 'enabled',
    label: '状态',
    scopeType: 'switch',
    type: 'Status'
  }
]
export default {
  name: 'userIndex',
  mixins: [user],
  data () {
    return {
      list: {
        columns: [],
        api: 'fetchSysUsersPage',
        params: { 'enabled': '', 'orgid': '', 'roleid': '', 'key': '', 'orgids': [''], 'userSecretId': '' },
        filterParams: ['orgids'],
        handleColumn: [
          {
            type: 'Edit',
            name: '重置密码',
            notDisabled: true,
            power: 'deleteAble',
            icon: 'zhongzhimima',
            disabled: !this._checkPermission('/users/psw', 'POST')
          },
          {
            type: 'Link',
            name: '权限管理',
            notDisabled: true,
            icon: 'kaiqiquanxian',
            href: '/system/user/permission'
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            notDisabled: true,
            power: 'deleteAble',
            disabled: !this._checkPermission('/users', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '280',
          align: 'left'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/users', 'POST')
          },
          {
            type: 'Enable',
            text: '启用',
            icon: 'qiyong',
            disabled: !this._checkPermission('/users/on', 'POST')
          },
          {
            type: 'Disable',
            text: '禁用',
            icon: 'jinyong',
            disabled: !this._checkPermission('/users/off', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/users', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false
        // content: '任何用户不能删除自己；也不可编辑自己的权限；不可禁用或启用自己；'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            label: '状态：',
            value: 'enabled',
            style: {
              width: '100px'
            },
            options: [
              {
                value: '',
                label: '所有'
              },
              {
                value: '1',
                label: '启用'
              },
              {
                value: '0',
                label: '禁用'
              }
            ]
          },
          {
            type: 'cascader',
            value: 'orgids',
            props: {
              label: 'name',
              value: 'id',
              checkStrictly: true
            },
            style: {
              width: '163px'
            },
            label: '所属组织：',
            placeholder: '请选择',
            options: [
              {
                name: '所有',
                id: ''
              }
            ]
          },
          {
            type: 'select',
            value: 'roleid',
            label: '所属角色：',
            placeholder: '请选择',
            optionLabel: 'roleName',
            optionValue: 'id',
            style: {
              width: '120px'
            },
            options: []
          },
          {
            type: 'select',
            label: '人员密级：',
            value: 'userSecretId',
            optionLabel: 'name',
            optionValue: 'id',
            style: {
              width: '100px'
            },
            options: [
              {
                name: '所有',
                id: ''
              }
            ]
          },
          {
            type: 'searchInput',
            value: 'key',
            placeholder: '请输入关键字'
          }
        ]
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
    // 表格操作按钮
    handleTableEdit (data, btn) {
      this.updateForm.username = data.username
      this.updateForm.id = data.id
      this.$refs.updateDialog.showDialog()
    },
    handleTableDelete (row, index) {
      this.msgDialog.type = 'DeleteOne'
      this.msgDialog.content = '是否确定删除该用户？'
      this.msgDialog.data = [row.id]
      this.showMsgDialog()
    },
    // 顶部操作按钮
    handleSearchs (data) {
      if (data instanceof Array) {
        this.list.params.orgid = data[data.length - 1]
        this.list.params.roleid = ''
        this.getRoleList(data[data.length - 1])
      }
      this.fetchTableApi()
    },
    handleHeaderCreate () {
      if (this.isDisFenBao) {
        this.addForm.enabled = false
      }
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
        this.msgDialog.content = '是否确定删除所选用户？'
        this.showMsgDialog()
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    getRoleList (id) {
      this.$request.fetchRolesList({ orgId: id }).then(res => {
        if (res.code === 200) {
          let arr2 = [{ roleName: '所有', id: '' }]
          this.searchHeader.searchItems[2].options = arr2.concat(res.data)
        }
      })
    },
    handleModelStatus (row, index) {
      if (row.enabled) {
        this.fetchSysUsersOn([row.id])
      } else {
        this.fetchSysUsersOff([row.id])
      }
    },
    // 弹出框操作按钮
    handleConfirmMsg (type) {
      switch (type) {
        case 'DeleteOne':
          this.fetchSysUsersDelete(this.msgDialog.data)
          break
        case 'Delete':
          this.fetchSysUsersDelete(this.list.selectedKeys)
          break
        case 'Enable':
          this.fetchSysUsersOn(this.list.selectedKeys)
          break
        case 'Disable':
          this.fetchSysUsersOff(this.list.selectedKeys)
          break
      }
    },
    // 启用
    fetchSysUsersOn (ids, type) {
      this.list.loading = true
      this.$request.fetchSysUsersOn({ ids: ids, type: this.type }).then(res => {
        if (res.code === 200) {
          this.fetchTableApi()
          this.$message({
            type: 'success',
            message: '启用成功'
          })
          this.type = 1
        } else if (res.code === 14023) {
          this.type = 2
          this.fetchTableApi()
        }
        this.hideMsgDialog()
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    // 禁用
    fetchSysUsersOff (ids, type) {
      this.list.loading = true
      this.$request.fetchSysUsersOff({ ids: ids, type: this.type }).then(res => {
        if (res.code === 200) {
          this.type = 1
          this.$message({
            type: 'success',
            message: '禁用成功'
          })
          this.fetchTableApi()
        } else if (res.code === 14023) {
          this.type = 2
          this.fetchTableApi()
        }
        this.hideMsgDialog()
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    // 发送请求事件
    fetchSysUsersDelete (ids, type) {
      this.list.loading = true
      var params = {
        'ids': ids,
        'type': this.type
      }
      this.$request.fetchSysUsersDelete(params).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.fetchTableApi()
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
          d.disabledStatus = !d.deleteAble || (this.isDisFenBao && !d.userSecretName)
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    },
    setOrganizeOptions (newData) {
      if (newData instanceof Array && newData.length) {
        let arr = [{ name: '所有', id: '' }]
        this.addFormItems.find(d => d.prop === 'orgids').options = newData
        this.searchHeader.searchItems.find(d => d.value === 'orgids').options = arr.concat(newData)
      }
    },
    setRoleOptions (newData) {
      if (newData instanceof Array && newData.length) {
        this.addFormItems[4].options = newData
        if (!this.searchHeader.searchItems[2].options.length) {
          let arr2 = [{ roleName: '所有', id: '' }]
          this.searchHeader.searchItems[2].options = arr2.concat(newData)
        }
      }
    },
    setUserSecurityOptions (newData) {
      if (newData instanceof Array && newData.length) {
        if (this.openContentSecurity === '1') {
          let arr = [{ name: '所有', id: '' }]
          this.searchHeader.searchItems[3].options = arr.concat(newData)
          this.addFormItems[5].options = newData
          this.list.columns = columns2
        } else {
          this.list.columns = columns
          this.searchHeader.searchItems[3].hiddenKey = 'hiddenKey'
          this.searchHeader.searchItems[3].hiddenValue = 'hiddenValue'
          this.addFormItems[5].hiddenKey = 'hiddenKey'
          this.addFormItems[5].hiddenValue = 'hiddenValue'
        }
      }
    }
  },
  watch: {
    organizeOptions (newData) {
      this.setOrganizeOptions(newData)
    },
    roleOptions (newData) {
      this.setRoleOptions(newData)
    },
    userSecurityOptions (newData) {
      this.setUserSecurityOptions(newData)
    }
  },
  mounted () {
    this.setOrganizeOptions(this.organizeOptions)
    this.setRoleOptions(this.roleOptions)
    this.setUserSecurityOptions(this.userSecurityOptions)
    this.FetchUserSecurityOptions()
    this.FetchOrganizeOptions()
    this.FetchRoleOptions()
  }
}
</script>
<style lang="scss">
.user-index-container{
  .box-items{
    padding: 0 9px;
  }
.el-button{
    margin-bottom: 0 !important;//删除操作说明新增样式
  }
}
</style>
