<template>
  <section class="security-index-container">
    <base-header
      v-bind="headers"
      v-on:handleAddition="handleHeaderAddition"
      v-on:handleMove="handleHeaderMove"
    />
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
    ></base-table>
    <form-dialog
      title="移动会员"
      ref="moveDialog"
      :form="moveForm"
      :formItems="moveFormItems"
      :rules="moveFormRules"
      :buttons="moveButtons"
      v-on:handleConfirm="handleConfirmMove"
    ></form-dialog>
    <table-dialog
      ref="addUsers"
      v-bind="tablelist"
      @handleSelectionChange="handleTableDialogSelectionChange"
      @handleSizeChange="handleTableDialogSizeChange"
      @handleCurrentChange="handleTableDialogCurrentChange"
      @handleConfirm="fetchRoleAddUsers"
      @handleSearch="handleTableSearch"
    ></table-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import tableDialog from '@/components/mixins/tableDialog'

const columns = [
  {
    prop: 'username',
    label: '用户名'
  },
  {
    prop: 'email',
    label: '电子邮箱'
  },
  {
    prop: 'userGroup.groupName',
    label: '所属会员组'
  },
  {
    prop: 'userLevel.levelName',
    label: '会员等级'
  },
  {
    prop: 'integral',
    label: '积分'
  },
  {
    prop: 'sourceSite.name',
    label: '来源站点'
  },
  {
    prop: 'enabled',
    label: '状态',
    formatter: (row, column, cellValue, index) => {
      const options = [
        {
          label: '启用',
          value: true
        },
        {
          label: '禁用',
          value: false
        }
      ]
      const opt = options.find(d => d.value === cellValue)
      return opt ? opt.label : ''
    }
  }
]

export default {
  name: 'vipGroupNameMembersIndex',
  mixins: [baseHeader, baseTable, formDialog, tableDialog],
  data () {
    return {
      list: {
        columns,
        api: 'fetchMembersGroupListUsers',
        params: {
          groupId: '',
          sourceSite: '',
          levelId: '',
          key: '',
          enabled: ''
        },
        handleColumn: []
      },
      headers: {
        buttons: [
          {
            type: 'Addition',
            text: '添加',
            icon: 'tianjia',
            disabled: !this._checkPermission('/members', 'POST')
          },
          {
            type: 'Move',
            text: '移动',
            icon: 'yidong',
            disabled: !this._checkPermission('/members', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: true,
        content: '操作说明'
      },
      tablelist: {
        title: '添加会员',
        width: '778px',
        api: 'fetchMembersList',
        columns: [
          {
            label: '用户名',
            prop: 'username'
          },
          {
            label: '所属会员组',
            prop: 'userGroup.groupName'
          }
        ],
        params: {
          groupId: '',
          sourceSite: '',
          levelId: '',
          key: '',
          enabled: ''
        },
        searchHeader: {
          searchItems: [
            {
              type: 'select',
              label: '所属会员组：',
              value: 'groupId',
              optionValue: 'id',
              optionLabel: 'groupName',
              options: []
            },
            {
              type: 'searchInput',
              value: 'key',
              placeholder: '请输出用户名'
            }
          ]
        }
      },
      moveFormLoading: false,
      moveForm: {
      },
      moveFormRules: {
        id: [this.$rules.required()]
      },
      moveButtons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ],
      moveFormItems: [
        {
          type: 'select',
          label: '选择会员组',
          prop: 'id',
          optionValue: 'id',
          optionLabel: 'groupName',
          options: []
        }
      ]
    }
  },
  methods: {
    // 表格操作按钮
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchMembersGroupDelete([row.id])
      })
    },
    // 添加按钮
    handleHeaderAddition () {
      this.$refs.addUsers.showDialog()
    },
    // 确定添加
    fetchRoleAddUsers () {
      var obj = {}
      obj.userId = this.tablelist.selectedKeys
      obj.id = this.list.params.groupId
      this.tablelist.loading = true
      this.$request.fetchMembersGroupListUsersAdd(obj).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.fetchTableApi()
          this.$refs.addUsers.handleCancel()
        }
        this.tablelist.loading = false
      }).catch(() => {
        this.tablelist.loading = false
      })
    },
    // 移动
    handleHeaderMove () {
      if (this.list.selectedKeys.length) {
        this.$refs.moveDialog.showDialog()
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    // 移动保存
    handleConfirmMove (data) {
      this.list.loading = true
      data.userId = this.list.selectedKeys
      this.$request.fetchMembersGroupListUsersPut(data).then(res => {
        if (res.code === 200) {
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 发送请求事件
    fetchMembersGroupDelete (ids) {
      this.list.loading = true
      this.$request.fetchMembersGroupDelete({ ids }).then(res => {
        if (res.code === 200) {
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    },
    fetchTableDialogCallBack (res) {
      if (res.code === 200) {
        this.tablelist.data = res.data.content
        this.tablelist.totalCount = res.data.totalElements
      }
    },
    // 会员组下拉
    fetchMembersGroupPull () {
      this.$request.fetchMembersGroupPull().then(res => {
        if (res.code === 200) {
          this.tablelist.searchHeader.searchItems.find(d => d.value === 'groupId').options = [
            { groupName: '全部', id: '' },
            ...res.data
          ]
          this.moveFormItems[0].options = res.data
        }
      })
    }
  },
  mounted () {
    this.fetchMembersGroupPull()
  },
  activated () {
    const { id } = this.$route.query
    if (id && id !== this.list.params.groupId) {
      this.list.params.groupId = id
      this.fetchTableApi()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
