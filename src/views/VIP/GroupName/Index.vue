<template>
  <section class="security-index-container">
    <base-header
      v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
      v-on:handleDelete="handleHeaderDelete"
    />
    <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearch"
    ></search-header>
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDetail="handleTableDetail"
      v-on:handleDelete="handleTableDelete"
    >
      <template #groupName="scope">
        <el-link :underline="false" :disable="!_checkPermission('/memberGroup', 'GET')" class="jee-color" @click="rowHref(scope.scope.row)">{{scope.scope.row.groupName}}</el-link>
      </template>
    </base-table>
    <form-dialog
      ref="addDialog"
      :loading="addFormLoading"
      :form="addForm"
      :rules="addRules"
      :formItems="addFormItems"
      v-on:handleConfirm="handleConfirmAdd"
    >
    </form-dialog>
    <form-dialog
      ref="editDialog"
      title='编辑'
      :loading="editFormLoading"
      :form="editForm"
      :rules="addRules"
      :formItems="addFormItems"
      :buttons="editButton"
      v-on:handleConfirm="handleConfirmEdit"
    >
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import searchHeader from '@/components/mixins/searchHeader'
import { mapActions } from 'vuex'
const columns = [
  {
    prop: 'groupName',
    label: '会员组名',
    scopeType: 'slot'
  },
  {
    prop: 'isDefault',
    label: '是否设为默认组',
    formatter: (row, column, cellValue, index) => {
      const options = [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ]
      const opt = options.find(d => d.value === cellValue)
      return opt ? opt.label : ''
    }
  },
  {
    prop: 'remark',
    label: '描述',
    showOverflowTooltip: true,
    width: '350px'
  }
]

export default {
  name: 'vipGroupNameIndex',
  mixins: [baseHeader, baseTable, formDialog, searchHeader],
  data () {
    return {
      list: {
        columns,
        api: 'fetchMembersGroupList',
        params: {},
        handleColumn: [
          {
            type: 'Detail',
            name: '成员管理',
            icon: 'fensiguanli',
            disabled: !this._checkPermission('/members', 'GET')
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/memberGroup', 'DELETE')
          }
        ],
        handleColumnProp: {
          width: '170px'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/memberGroup', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/memberGroup', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false
        // content: '操作说明'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'searchInput',
            value: 'groupName',
            placeholder: '请输入会员组名'
          }
        ]
      },
      addFormLoading: false,
      addForm: {
        groupName: '',
        remark: '',
        isDefault: false,
        isAllChannelView: true,
        isAllChannelContribute: true,
        contributes: [],
        views: []
      },
      editFormLoading: false,
      editForm: {
        id: '',
        groupName: '',
        remark: '',
        isDefault: false,
        isAllChannelView: true,
        isAllChannelContribute: true,
        contributes: [],
        views: []
      },
      editButton: [
        {
          text: 'global.save',
          type: 'Submit'
        }
      ],
      addRules: {
        groupName: [this.$rules.required()],
        isDefault: [this.$rules.required()],
        isAllChannelView: [this.$rules.required()],
        isAllChannelContribute: [this.$rules.required()],
        contributes: [this.$rules.requiredArray()],
        views: [this.$rules.requiredArray()]
      },
      addFormItems: [
        {
          prop: 'groupName',
          label: '会员组名',
          placeholder: '请输入会员组名',
          maxlength: 15
        },
        {
          type: 'textarea',
          prop: 'remark',
          label: '描述',
          placeholder: '请输入会员组描述',
          maxlength: 50,
          autosize: { minRows: 3 }
        },
        {
          type: 'radio',
          prop: 'isDefault',
          label: '是否为默认组',
          options: [
            {
              value: true,
              label: '是'
            },
            {
              value: false,
              label: '否'
            }
          ]
        },
        {
          type: 'checkbox',
          prop: 'isAllChannelView',
          label: '栏目浏览权限',
          class: 'z-checkbox-single',
          options: [
            {
              value: true,
              label: '所有栏目'
            }
          ]
        },
        {
          type: 'checkTree',
          prop: 'views',
          hiddenKey: 'isAllChannelView',
          hiddenValue: false,
          tree: [],
          props: {
            label: 'name',
            value: 'id'
          },
          labelWidth: '166px'
        },
        {
          type: 'checkbox',
          prop: 'isAllChannelContribute',
          label: '栏目投稿权限',
          class: 'z-checkbox-single',
          options: [
            {
              value: true,
              label: '所有栏目'
            }
          ]
        },
        {
          type: 'checkTree',
          prop: 'contributes',
          hiddenKey: 'isAllChannelContribute',
          hiddenValue: false,
          tree: [],
          props: {
            label: 'name',
            value: 'id'
          },
          labelWidth: '166px'
        }
      ]
    }
  },
  methods: {
    ...mapActions('vip', ['FetchMemberGroupOptions']),
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
    handleTableDetail (row, index) {
      this.$router.push({
        name: 'vipGroupNameMembersIndex',
        query: {
          id: row.id
        }
      })
    },
    // 表格详情
    rowHref (row) {
      this.editForm = {}
      this.editFormLoading = true
      this.$request.fetchMembersGroupDetail({ id: row.id }).then(res => {
        if (res.code === 200) {
          this.editForm = res.data
          this.$refs.editDialog.showDialog()
        }
        this.editFormLoading = false
      }).catch(() => {
        this.editFormLoading = false
      })
    },
    // 顶部操作按钮
    handleHeaderCreate () {
      this.$refs.addDialog.showDialog()
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('确定批量删除会员组？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchMembersGroupDelete(this.list.selectedKeys)
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    // 新建保存
    handleConfirmAdd (data) {
      this.addFormLoading = true
      this.$request.fetchMembersGroupAdd(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
          this.FetchMemberGroupOptions(true)
        }
        this.addFormLoading = false
      }).catch(() => {
        this.addFormLoading = false
      })
    },
    // 编辑保存
    handleConfirmEdit (data) {
      this.editFormLoading = true
      this.$request.fetchMembersGroupPut(data).then(res => {
        if (res.code === 200) {
          this._messageSuccess('save')
          this.fetchTableApi()
          this.FetchMemberGroupOptions(true)
        }
        this.editFormLoading = false
      }).catch(() => {
        this.editFormLoading = false
      })
    },
    // 发送请求事件
    fetchMembersGroupDelete (ids) {
      this.list.loading = true
      this.$request.fetchMembersGroupDelete({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchTableApi()
          this.FetchMemberGroupOptions(true)
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    },
    // 会员组下拉
    fetchChannelGetAllTree () {
      this.$request.fetchChannelGetAllTree().then(res => {
        if (res.code === 200) {
          this.addFormItems.find(d => d.prop === 'contributes').tree = res.data
          this.addFormItems.find(d => d.prop === 'views').tree = res.data
        }
      }).catch(() => {
      })
    }
  },
  mounted () {
    this.fetchChannelGetAllTree()
  },
  activated () {
    if (this.$route.query.type === 'list') {
      this.fetchTableApi()
      this.$router.push({ query: { type: '' } })
    }
  }
}
</script>
