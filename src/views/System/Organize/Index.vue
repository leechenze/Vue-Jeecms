<template>
<section class="org-index-container">
    <base-header v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
      v-on:handleDelete="handleHeaderDelete"
    />
    <search-header
      class="search-header-dialog"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearch"
    ></search-header>
    <base-table
      ref="orgTable"
      v-bind="list"
      v-on:handleSelectionChange="handleSelectKeyChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDelete="handleTableDelete"
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
import organize from './organize'
import { mapActions } from 'vuex'
const columns = [
  {
    prop: 'name',
    label: '组织名称',
    scopeType: 'link',
    href: '/system/organize/detail',
    minWidth: '180px',
    fixed: 'left'
  },
  {
    prop: 'orgNum',
    label: '组织编号',
    width: '144px',
    align: 'center'
  },
  {
    prop: 'orgLeader',
    label: '负责人',
    width: '144px'
  },
  {
    prop: 'phone',
    label: '电话',
    width: '178px'
  },
  {
    prop: 'isVirtual',
    label: '虚拟组织',
    scopeType: 'boolean',
    width: '144px'
  },
  {
    prop: 'createUser',
    label: '创建人',
    width: '144px'
  },
  {
    prop: 'createTimes',
    label: '创建时间',
    width: '218px',
    scopeType: 'time'
  }
]

export default {
  name: 'organizeIndex',
  mixins: [organize],
  data () {
    return {
      list: {
        columns,
        isTree: true,
        expandAll: true,
        lazy: false,
        treeProps: {
          children: 'children' },
        showPagination: false,
        api: 'fetchOrganizeList',
        params: {
          'isVirtual': '',
          'key': '',
          'parentId': ''
        },
        handleColumn: [
          {
            type: 'Link',
            name: '成员管理',
            icon: 'chengyuanguanli',
            notDisabled: true,
            href: '/system/organize/member'
          },
          {
            type: 'Link',
            name: '权限管理',
            icon: 'kaiqiquanxian',
            notDisabled: true,
            href: '/system/organize/permission'
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            notDisabled: true,
            power: 'deleteAble',
            disabled: !this._checkPermission('/orgs', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '260',
          align: 'left'
        }
      },
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            label: '虚拟组织：',
            value: 'isVirtual',
            options: [
              {
                value: '',
                label: '所有'
              },
              {
                value: '1',
                label: '是'
              },
              {
                value: '0',
                label: '否'
              }
            ],
            style: {
              width: '120px'
            }
          },
          {
            type: 'searchInput',
            value: 'key',
            placeholder: '请输入组织名/组织编号/负责人',
            style: {
              width: '320px'
            }
          }
        ]
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/orgs', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/orgs', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: true,
        content: '系统中只能存在一个顶层组织，该组织拥有最高权限。顶层组织可以修改信息，但不能删除和修改权限；'
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
    ...mapActions('system', ['FetchOrganizeOptions']),
    // 表格操作按钮
    handleTableDelete (row, index) {
      this.msgDialog.type = 'DeleteOne'
      this.msgDialog.content = '删除组织时会删除下级所有组织，以及组织内的角色及用户，是否确定删除？'
      this.msgDialog.data = [row.id]
      this.showMsgDialog()
    },
    // 顶部操作按钮
    handleHeaderCreate () {
      this.$refs.addDialog.showDialog()
    },
    handleHeaderDelete (data) {
      // console.log(this.list)
      if (this.list.selectedKeys.length) {
        this.msgDialog.type = 'Delete'
        this.msgDialog.content = '删除组织时会删除下级所有组织，以及组织内的角色及用户，是否确定删除？'
        this.msgDialog.data = this.list.selectedKeys
        this.showMsgDialog()
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    // 弹出框操作按钮
    handleConfirmMsg (type) {
      switch (type) {
        case 'DeleteOne':
          this.fetchOrganizeDelete(this.msgDialog.data)
          break
        case 'Delete':
          this.fetchOrganizeDelete(this.list.selectedKeys)
          break
      }
    },
    // 发送请求事件
    fetchOrganizeDelete (ids, type) {
      // this.list.loading = true
      var params = {
        ids: ids,
        type: this.type
      }
      this.$request.fetchOrganizeDelete(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
          this.type = 1
          this.FetchOrganizeOptions(true)
        }
        if (res.code === 14023) {
          this.type = 2
        }
        this.hideMsgDialog()
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.map((d, i) => {
          d.disabled = !d.managerAble
          if (d.children && d.children.length > 0) {
            const loop = function (data) {
              if (data instanceof Array) {
                data.forEach(v => {
                  v.disabled = !v.managerAble
                })
              }
            }
            loop(d.children)
          }
          return d
        })
        if (this.organizeOptions.length > 0) {
          this.getTreeList()
        } else {
          this.FetchOrganizeOptions(true)
        }
        this.list.totalCount = res.data.totalElements
      }
      this.hideTableLoading()
    },
    getTreeList () {
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
      this.addFormItems.find(d => d.prop === 'orgids').options = this.organizeOptions
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.FetchOrganizeOptions()
    })
  },
  watch: {
    'list.selectedKeys': function (newData) {
      if (newData instanceof Array && newData.length) {
        if (this.list.data.find(d => {
          if (!d.deleteAble && newData.includes(d.id)) {
            return d
          }
        })) {
          this.headers.buttons[1].disabled = true
          return
        }
      }
      this.headers.buttons[1].disabled = !this._checkPermission('/orgs', 'DELETE')
    },
    organizeOptions (newVal, oldVal) {
      if (newVal) {
        this.getTreeList()
      }
    }
  }
}
</script>
