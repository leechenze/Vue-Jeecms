<template>
  <section class="org-member-container left-container">
    <el-container>
      <el-aside>
        <div class="left-head">
          <base-header v-bind="asideHeaders"
            v-on:handleAdd="handleHeaderSave"
          />
        </div>
          <div class="box-items">
            <drag-tree v-bind="tree" v-if="tree.currentNodeKey" @handleClick="handleClick"></drag-tree>
          </div>
      </el-aside>
      <el-main>
        <base-header
          v-bind="headers"
          :buttons="headerBtns"
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
            title="移除成员"
            ref="delDialog"
            :loading="delFormLoading"
            :form="delForm"
            :buttons="delButtons"
            :rules="delRules"
            :formItems="delFormItems"
            @handleConfirm="handleConfirmDel"
          ></form-dialog>
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
      </el-main>
    </el-container>
  </section>
</template>
<script>

import organize from './organize'

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
    label: '电话'
  },
  {
    prop: 'userExt.linephone',
    label: '座机号'
  },
  {
    prop: 'email',
    label: '邮箱'
  }
]
const columnsUsers = [
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
  }
]
export default {
  name: 'organizeMember',
  mixins: [organize],
  data () {
    return {
      backUrl: '/system/organize/index',
      list: {
        columns,
        api: '',
        params: {
          'id': ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '移除',
            icon: 'yichu',
            disabled: !this._checkPermission('/orgs/list/users', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '100',
          align: 'left'
        }
      },
      headers: {
        showAlertIcon: false
      },
      tablelist: {
        title: '添加成员',
        width: '778px',
        api: 'fetchSysUsersPage',
        columns: columnsUsers,
        params: { 'enabled': '', 'orgid': '', 'roleid': '', 'key': '', 'orgids': [''], userSecretId: '' },
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
              options: []
            },
            {
              type: 'searchInput',
              value: 'key',
              placeholder: '用户名/真实姓名'
            }
          ]
        }
      },
      tree: {
        data: [],
        currentNodeKey: '',
        draggable: false,
        showLevel: false
      },
      userIds: [],
      managerAble: true,
      api: 'fetchOrganizeListUsers'
    }
  },
  computed: {
    headerBtns () {
      return [
        {
          type: 'Add',
          text: '添加',
          icon: 'tianjia',
          disabled: !this._checkPermission('/orgs/list/users', 'POST') || !this.managerAble
        },
        {
          type: 'Delete',
          text: '移除',
          icon: 'delete',
          disabled: !this._checkPermission('/orgs/list/users', 'DELETE') || !this.managerAble
        }
      ]
    }
  },
  methods: {
    handleConfirmAdd (item, data) {
      console.log(item)
    },
    // 顶部操作按钮
    handleClick (item, node) {
      this.list.params.id = item.id
      // this.managerAble = item.managerAble
      this.list.api = this.managerAble ? this.api : ''
      this.setCurrentNodeKey(item.id)
      this.fetchTableApi()
    },
    // 表格操作按钮
    handleTableDelete (row, index) {
      this.userIds = [row.id]
      this.$refs.delDialog.showDialog()
    },
    handleConfirmDel (data, btn) {
      this.organizeListUsersDelete(data)
    },
    organizeListUsersDelete (data, btn) {
      var params = {
        'id': data.orgids[data.orgids.length - 1],
        'userId': this.userIds
      }
      this.delFormLoading = true
      this.$request.fetchOrganizeListUsersDelete(params).then(res => {
        if (res.code === 200) {
          this.fetchTableApi()
        }
        this.delFormLoading = false
      }).catch(() => {
        this.delFormLoading = false
      })
    },
    // 顶部操作按钮
    handleHeaderSave () {
      console.log(1111111111111)
      this.$refs.addDialog.showDialog()
    },
    handleHeaderAdd () {
      this.$refs.addUsers.showDialog()
      this.fetchTableDialogApi()
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.userIds = this.list.selectedKeys
        this.$refs.delDialog.showDialog()
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
      this.tablelist.loading = true
      var params = {
        userId: ids,
        id: this.list.params.id
      }
      this.$request.fetchOrganizeListUsersAdd(params).then(res => {
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
        // const loop = function (data) {
        //   return data.map(d => {
        //     if (!d.managerAble) {
        //       d.disabled = true
        //     }
        //     if (d.children && d.children instanceof Array) {
        //       d.children = loop(d.children)
        //     }
        //     return d
        //   })
        // }
        // let arr = loop(this.organizeOptions)
        let arr2 = [{ name: '所有', id: '' }]
        this.tablelist.searchHeader.searchItems[0].options = arr2.concat(this.organizeOptions)
        this.delFormItems[0].options = this.addFormItems.find(d => d.prop === 'orgids').options = this.organizeOptions
        this.$request.fetchOrganizeList({ 'isVirtual': '', 'key': '', 'parentId': '' }).then(res => {
          if (res.code === 200) {
            this.tree.data = res.data
            this.setHeaderPerm(this.list.params.id)
          }
        })
      }
    },
    fetchTableCallBack (res) { // 表格返回数据
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          if (d.username === this.user.userName) {
            d.disabled = true
          }
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
      this.hideTableLoading()
    },
    setHeaderPerm (id) {
      let that = this
      const loop = data => {
        if (data instanceof Array && data.length) {
          data.forEach(d => {
            if ((d.id + '') === (id + '')) {
              that.managerAble = d.managerAble
              that.list.api = that.managerAble ? that.api : ''
            }
            if (d.children) {
              loop(d.children)
            }
          })
        }
      }
      loop(this.tree.data)
    },
    getData () {
      if (this.organizeOptions.length < 1) {
        this.FetchOrganizeOptions()
      } else {
        this.getTreeList()
      }
      const { id } = this.$route.query
      if (id) {
        // let item = this.searchId(id)
        // console.log(item)
        this.handleClick({ id: id })
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getData()
    })
  },
  activated () {
    this.getData()
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

</style>
