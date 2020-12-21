<template>
  <section>
    <form-dialog
        :title="shareTitle"
        ref="shareDialog"
        :loading="shareFormLoading"
        :form="shareForm"
        :buttons="shareButtons"
        :formItems="shareFormItems"
        @handleConfirm="shareConfirmAdd"
        @handleAddOrg="handleAddDatas"
        @handleAddRole="handleAddDatas"
        @handleAddUser="handleAddDatas"
      ></form-dialog>
      <org-dialog ref="addDialog" v-model="orgList" :ids="shareForm.orgIds"></org-dialog>
      <table-dialog
        ref="addUsers"
        v-bind="tablelist"
        @handleSelectionChange="handleTableDialogSelectionChange"
        @handleSizeChange="handleTableDialogSizeChange"
        @handleCurrentChange="handleTableDialogCurrentChange"
        @handleConfirm="fetchRoleAndUsersAdd"
        @handleSearch="handleTableSearch"
      ></table-dialog>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import formDialog from '@/components/mixins/formDialog'
import tableDialog from '@/components/mixins/tableDialog'
import OrgDialog from '@/components/dialog/OrgDialog'
var roleColumns = [
  {
    prop: 'roleName',
    label: '角色名称'
  },
  {
    prop: 'orgName',
    label: '所属组织'
  }
]
var userColumns = [
  {
    prop: 'username',
    label: '用户名',
    width: '165px'
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
  mixins: [formDialog, tableDialog],
  name: 'share-form',
  computed: {
    // 获取系统设置项
    ...mapGetters(['organizeOptionsAll', 'roleOptions'])
  },
  components: {
    OrgDialog
  },
  data () {
    return {
      tableParams: {
        role: {
          title: '添加角色',
          width: '778px',
          api: 'fetchSystemRoleList',
          columns: roleColumns,
          filterParams: ['orgids'],
          params: {
            orgids: [''],
            orgid: '',
            roleName: ''
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
                options: []
              },
              {
                type: 'searchInput',
                value: 'roleName',
                placeholder: '角色名'
              }
            ]
          }
        },
        user: {
          title: '添加用户',
          width: '778px',
          api: 'fetchSysUsersPage',
          columns: userColumns,
          params: {
            orgids: [''],
            orgid: '',
            roleid: '',
            enabled: '',
            userSecretId: '',
            key: ''
          },
          filterParams: ['orgids'],
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
                type: 'select',
                value: 'roleid',
                label: '所属角色：',
                placeholder: '请选择',
                optionLabel: 'roleName',
                optionValue: 'id',
                options: []
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
      orgList: [],
      // 渲染角色，用户结构
      tablelist: {
        title: '添加角色',
        width: '778px',
        api: '',
        columns: [],
        params: {},
        searchHeader: {}
      },
      // 添加组织
      addFormLoading: false,
      addForm: {
        orgIds: []
      },
      addButtons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ],
      addFormItems: [
        {
          prop: 'orgIds',
          type: 'selectTrees',
          tree: [],
          options: [],
          tags: []
        }
      ],
      // 共享弹窗
      shareFormLoading: false,
      shareTitle: '共享到', // 共享 弹窗标题
      shareForm: {
        'orgIds': [],
        'roleIds': [],
        'userIds': [],
        'ids': [],
        'id': '',
        'type': 'Share'
      },
      shareButtons: [
        {
          text: '确定',
          type: 'Submit',
          keepAlive: true
        }
      ],
      shareFormItems: [
        {
          prop: 'orgIds',
          type: 'sharebox',
          title: '组织',
          addType: 'Org',
          optionLabel: 'name',
          optionValue: 'id',
          options: []
        },
        {
          prop: 'roleIds',
          type: 'sharebox',
          title: '角色',
          optionLabel: 'roleName',
          optionValue: 'id',
          addType: 'Role',
          options: []
        },
        {
          prop: 'userIds',
          type: 'sharebox',
          addType: 'User',
          title: '用户',
          optionLabel: 'username',
          optionValue: 'id',
          options: []
        }
      ]
    }
  },
  watch: {
    organizeOptionsAll (newVal, oldVal) {
      if (newVal) {
        this.getTreeList()
      }
    },
    orgList (newVal, oldVal) {
      let ids = newVal.map(v => { return v.value })
      this.shareForm.orgIds = ids
      this.shareFormItems[0].options = this.getorg(ids)
    }
  },
  methods: {
    ...mapActions('system', ['FetchOrganizeOptionsAll', 'FetchRoleOptions']),
    getTreeList () {
      let arr = [{ name: '所有', id: '' }]
      let arr2 = [{ roleName: '所有', id: '' }]
      if (this.organizeOptionsAll instanceof Array) {
        this.addFormItems[0].tree = this.organizeOptionsAll
        this.tableParams.role.searchHeader.searchItems[0].options = arr.concat(this.organizeOptionsAll)
        this.tableParams.user.searchHeader.searchItems[0].options = arr.concat(this.organizeOptionsAll)
      }
      this.tableParams.user.searchHeader.searchItems[1].options = arr2.concat(this.roleOptions)
    },
    showDialog (type, data, ids) {
      switch (type) {
        case 'add':
          this.shareTitle = '共享到'
          this.shareForm.ids = ids
          this.shareForm.type = data.type
          this.getShareData()
          break
        case 'config':
          this.shareForm.ids = ids
          this.shareForm.type = data.type
          this.shareTitle = '资源共享设置'
          this.getShareData()
          break
        case 'datas':
          this.shareTitle = '共享到'
          this.shareForm.id = data.id
          this.shareForm.type = 'Datas'
          this.getShareData()
          break
      }
      if (this.organizeOptionsAll.length < 1) {
        this.FetchOrganizeOptionsAll()
      } else {
        this.getTreeList()
      }
      if (this.roleOptions.length < 1) {
        this.FetchRoleOptions()
      }
      this.$refs.shareDialog.showDialog()
    },
    handleCancel () {
      this.$refs.shareDialog.handleCancel()
    },
    // 初始化数据加载
    getShareData () {
      this.$request.resourceSpaceDatasShareGet().then(res => {
        if (res.code === 200) {
          this.shareForm = Object.assign(this.shareForm, res.data)
          this.orgList = this.getorg(res.data.orgIds)
          this.shareFormItems[0].options = this.getorg(res.data.orgIds)
          this.shareFormItems[1].options = this.getrole(res.data.roleIds)
          this.shareFormItems[2].options = this.getuser(res.data.userIds)
        }
      })
    },
    fetchTableDialogCallBack (res) {
      if (res.code === 200) {
        // var arr = []
        var ids = []
        if (res.data.content instanceof Array) {
          if (this.addType === 'Role') {
            ids = this.shareForm.roleIds
            res.data.content.forEach(v => {
              if (ids.indexOf(v.id) > -1) {
                setTimeout(() => {
                  this.$refs['addUsers'].$refs.theTable.toggleRowSelection(v)
                }, 100)
              }
            })
          } else {
            ids = this.shareForm.userIds
            res.data.content.forEach(v => {
              if (ids.indexOf(v.id) > -1) {
                setTimeout(() => {
                  this.$refs['addUsers'].$refs.theTable.toggleRowSelection(v)
                }, 100)
              }
            })
          }
          this.$set(this.tablelist, 'ids', ids)
          this.$set(this.tablelist, 'data', res.data.content)
          this.$set(this.tablelist, 'totalCount', res.data.totalElements)
        }
      }
    },
    // 添加角色，用户
    fetchRoleAndUsersAdd (data, btn) {
      // let ids = data.map(v => { return v.id })
      let arr = []
      let arr2 = []
      if (this.addType === 'Role') {
        data.forEach(t => {
          if (this.shareForm.roleIds.indexOf(t.id) < 0) {
            arr.push(t.id)
            arr2.push(t)
          }
        })
        this.shareForm.roleIds = this.shareForm.roleIds.concat(arr)
        this.shareFormItems[1].options = this.shareFormItems[1].options.concat(arr2)
      } else if (this.addType === 'User') {
        data.forEach(t => {
          if (this.shareForm.userIds.indexOf(t.id) < 0) {
            arr.push(t.id)
            arr2.push(t)
          }
        })
        this.shareForm.userIds = this.shareForm.userIds.concat(arr)
        this.shareFormItems[2].options = this.shareFormItems[2].options.concat(arr2)
      }
      this.$refs.addUsers.handleCancel()
    },
    handleAddDatas (data, item) {
      switch (item.addType) {
        case 'Org':
          this.addForm.orgIds = this.shareForm.orgIds
          this.$refs.addDialog.showDialog()
          break
        case 'Role':
          this.tablelist = Object.assign(this.tablelist, this.tableParams.role)
          this.$refs.addUsers.showDialog()
          break
        case 'User':
          this.tablelist = Object.assign(this.tablelist, this.tableParams.user)
          this.$refs.addUsers.showDialog()
          break
      }
      this.addType = item.addType
      this.fetchTableDialogApi()
    },
    shareConfirmAdd (data, btn) {
      // 分享
      this.$emit('shareConfirmAdd', data, btn)
    },
    getorg (ids) {
      let list = []
      if (ids) {
        const loop = function (data) {
          if (data instanceof Array) {
            data.forEach(d => {
              list.push(d)
              if (d.children && d.children instanceof Array) {
                loop(d.children)
              }
            })
          }
        }
        loop(this.organizeOptionsAll)
        return this.idsFilter(list, ids)
      } else {
        return []
      }
    },
    idsFilter (data, ids) {
      return data.filter(v => ids.indexOf(v.id) > -1)
    },
    getrole (ids) {
      var arr = []
      if (ids) {
        if (this.roleOptions instanceof Array) {
          arr = this.idsFilter(this.roleOptions, ids)
        }
      }
      return arr
    },
    getuser (ids) {
      var arr = []
      if (ids) {
        this.$request.fetchSystemUserslist().then(res => {
          if (res.code === 200) {
            if (res.data instanceof Array) {
              res.data.forEach(v => {
                if (ids.indexOf(v.id) > -1) {
                  arr.push(v)
                }
              })
            }
          }
        })
      }
      return arr
    }
  }
}
</script>
