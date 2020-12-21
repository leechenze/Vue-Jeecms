<template>
  <section class="role-member-container left-container">
    <el-container>
      <el-aside>
        <div class="left-head">
          <base-header v-bind="asideHeaders"
            v-on:handleAdd="handleHeaderSave"
          />
        </div>
         <ul class="box-items">
            <li class="box-item jee-hover-color" @click="getRoleDetail(item)"
            :class="item.id == list.params.id?'jee-color':''"
             v-for="(item,index) in roleOptions" :key="index">{{item.roleName}}</li>
          </ul>
      </el-aside>
      <el-main>
        <base-header v-bind="headers"
          v-on:handleBack="handleBack"
            v-on:handleAdd="handleHeaderAdd"
            v-on:handleDelete="handleHeaderDelete"
          />
          <base-table
            v-bind="list"
            v-on:handleSelectionChange="handleSelectKeyChange"
            v-on:handleSizeChange="handleSizeChange"
            v-on:handleCurrentChange="handleCurrentChange"
            v-on:handleDelete="handleTableDelete"
          ></base-table>
          <table-dialog
            ref="addUsers"
            v-bind="tablelist"
            @handleSelectionChange="handleTableDialogSelectionChange"
            @handleSizeChange="handleTableDialogSizeChange"
            @handleCurrentChange="handleTableDialogCurrentChange"
            @handleConfirm="fetchRoleAddUsers"
            @handleSearch="handleTableSearch"
          ></table-dialog>
          <form-dialog
            ref="addDialog"
            :buttons="addButtons"
            :loading="addFormLoading"
            :form="addForm"
            :rules="addRules"
            :formItems="addFormItems"
            v-on:handleConfirm="handleConfirmAdd"
            v-on:handleConfirmRole="handleConfirmRole"
          ></form-dialog>
      </el-main>
    </el-container>
  </section>
</template>
<script>
import role from './role'

const columns = [
  {
    prop: 'username',
    label: '用户名'
  },
  {
    prop: 'userExt.realname',
    label: '真实姓名'
  },
  {
    prop: 'telephone',
    label: '手机号'
  },
  {
    prop: 'userExt.linephone',
    label: '座机号'
  },
  {
    prop: 'email',
    label: '邮箱',
    minWidth: '165px'
  }
]
const columns2 = [
  {
    prop: 'username',
    label: '用户名'
  },
  {
    prop: 'userExt.realname',
    label: '真实姓名'
  },
  {
    prop: 'orgName',
    label: '所属组织'
  },
  {
    prop: 'roleNames',
    label: '所属角色'
  }
]
export default {
  name: 'roleMember',
  mixins: [role],
  data () {
    return {
      backUrl: '/system/role/index',
      list: {
        columns,
        api: 'fetchRolesListUsers',
        params: {
          'id': this.$route.query.id
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '移除',
            icon: 'yichu',
            disabled: !this._checkPermission('/roles/list/users', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '100',
          align: 'left'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '添加',
            icon: 'tianjia',
            disabled: !this._checkPermission('/roles/list/users', 'POST')
          },
          {
            type: 'Delete',
            text: '移除',
            icon: 'delete',
            disabled: !this._checkPermission('/roles/list/users', 'DELETE')
          }
        ],
        showAlertIcon: false
      },
      tablelist: {
        title: '添加成员',
        width: '778px',
        api: 'fetchSysUsersPage',
        columns: columns2,
        params: { 'enabled': '', 'orgid': '', 'roleid': '', 'key': '', 'orgids': [''], userSecretId: '' },
        searchHeader: {
          searchItems: [
            {
              type: 'cascader',
              props: {
                label: 'name',
                value: 'id',
                checkStrictly: true
              },
              label: '所属组织：',
              value: 'orgids',
              options: []
            },
            {
              type: 'searchInput',
              value: 'key',
              placeholder: '用户名/真实姓名'
            }
          ]
        }
      }
    }
  },
  methods: {
    getRoleDetail (item) {
      this.activeName = item.roleName
      this.list.params.id = item.id
      this.fetchTableApi()
    },
    handleHeaderSave () {
      this.$refs.addDialog.showDialog()
    },
    // 表格操作按钮
    handleTableDelete (row, index) {
      this.handleConfirmDel([row.id])
    },
    handleConfirmDel (ids) {
      var params = {
        'id': this.list.params.id,
        'userId': ids
      }
      this.$request.fetchRolesListUsersDelete(params).then(res => {
        if (res.code === 200) {
          this.fetchTableApi()
        }
      })
    },
    // 顶部操作按钮
    handleHeaderAdd () {
      this.$refs.addUsers.showDialog()
      this.fetchTableDialogApi()
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.handleConfirmDel(this.list.selectedKeys)
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    // 发送请求事件
    fetchRoleAddUsers (data, btn) {
      let ids = data.map(v => { return v.id })
      console.log(data)
      if (!ids.length) {
        this.$message('至少选择一项进行操作')
        return
      }
      let params = {
        'id': this.list.params.id,
        'userId': ids
      }
      this.tablelist.loading = true
      this.$request.fetchRoleAddUsersAdd(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$refs.addUsers.handleCancel()
          this.fetchTableApi()
        }
        this.tablelist.loading = false
      }).catch(() => {
        this.tablelist.loading = false
      })
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          if (d.username === this.user.userName) {
            d.disabled = true
          }
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    },
    fetchTableDialogCallBack (res) {
      if (res.code === 200) {
        this.tablelist.data = res.data.content.map(d => {
          if (d.username === this.user.userName) {
            d.disabled = true
          }
          return d
        })
        this.tablelist.totalCount = res.data.totalElements
      }
    },
    getTreeList () {
      if (this.organizeOptions instanceof Array) {
        let arr2 = [{ name: '所有', id: '' }]
        this.tablelist.searchHeader.searchItems[0].options = arr2.concat(this.organizeOptions)
        this.delFormItems[0].options = this.addFormItems.find(d => d.prop === 'orgids').options = this.organizeOptions
      }
      // this.getRoleList()
    },
    getRoleData () {
      const { id } = this.$route.query
      if (id) {
        this.list.params.id = id
        this.fetchTableApi()
      }
      if (this.organizeOptions.length < 1) {
        this.FetchOrganizeOptions()
      } else {
        this.getTreeList()
      }
    }
  },
  activated () {
    if (this.$route.query.type === 'Link') {
      this.getRoleData()
    }
  },
  watch: {
    organizeOptions (newVal, oldVal) {
      if (newVal) {
        this.getTreeList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.box-items{
    padding: 0 9px;
  }
</style>
