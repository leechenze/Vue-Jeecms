<template>
  <section class="voca-content-index">
    <base-header
      v-bind="headers"
      @handleAdd="handleHeaderAdd"
      @handleDelete="handleHeaderDelete"
      />

      <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearch"
    ></search-header>
    <base-table
      v-bind="list"
      ref="font-m"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleDelete="handleTableDelete"
      @handleEdit="handleTableEdit"
      :onDropEnd="handleDragEnd"
    >
    </base-table>
    <form-dialog
      :title="editTitle"
      ref="editDialog"
      :loading="editFormLoading"
      :form="editForm"
      :rules="editRules"
      :buttons="editButtons"
      :formItems="editFormItems"
      v-on:handleConfirm="handleConfirmAdd"
    ></form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import {
  mapActions
} from 'vuex'
const columns = [
  {
    prop: 'markName',
    label: '机关代字',
    scopeType: 'handle',
    type: 'Edit',
    minWidth: '120px'
  },
  {
    prop: 'createUser',
    label: '创建人',
    minWidth: '120px'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    scopeType: 'time',
    minWidth: '120px'
  }
]

export default {
  name: 'FontMechanism',
  mixins: [baseHeader, baseTable, searchHeader, formDialog],
  data () {
    var nameUnique = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          markName: value,
          id: this.editForm.id
        }
        this.$request.fetchContentMarksAgencyUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('机关代字已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    return {
      list: {
        columns,
        draggable: true,
        api: 'fetchContentMarksAgencyPage',
        params: {
          'markName': ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: 'global.delete',
            icon: 'delete'
          }
        ],
        handleColumnProp: {
          label: 'global.handle',
          width: '75px',
          align: 'left'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '新建',
            icon: 'xinjian'
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete'
          }
        ],
        title: '',
        showAlertIcon: false,
        content: '操作说明'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'searchInput',
            value: 'markName',
            placeholder: '请输入机关代字名称'
          }
        ]
      },
      editFormLoading: false,
      editForm: {
        'markName': '',
        'type': 'add'
      },
      editRules: {
        markName: [
          this.$rules.required(),
          { validator: nameUnique, trigger: 'blur' }
        ]
      },
      editFormItems: [
        {
          prop: 'markName',
          label: '机关代字',
          maxlength: 50,
          placeholder: ''
        },
        {
          prop: 'createUser',
          label: '创建人',
          type: 'text',
          hiddenKey: 'type',
          hiddenValue: 'edit'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'time',
          hiddenKey: 'type',
          hiddenValue: 'edit'
        }
      ],
      editButtons: [],
      editTitle: '新建机关代字'
    }
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  watch: {
    name (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchTableApi()
      }
    }
  },
  methods: {
    ...mapActions('config', ['FetchIssueOrgOptions']),
    handleDragEnd (startIndex, endIndex) {
      this.list.loading = true
      const params = {
        toId: this.list.data[startIndex].id,
        fromId: this.list.data[endIndex].id
      }
      this.$request.fetchContentMarksAgencySort(params).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '排序成功'
          })
          this.fetchTableApi()
        }
        this.list.loading = false
      }).catch(() => {
        this.list.loading = false
      })
    },
    // 搜索头部
    handleHeaderAdd () {
      this.editForm.markName = ''
      this.editTitle = '新建机关代字'
      this.editForm.type = 'add'
      this.editFormItems[0].placeholder = '多个机关代字用逗号隔开'
      this.editButtons = [
        {
          text: '保存并继续新建',
          keepAlive: true,
          type: 'Submit'
        },
        {
          text: '保存',
          type: 'Submit'
        }
      ]
      this.$refs.editDialog.showDialog()
    },
    handleTableEdit (data, btn) {
      this.editTitle = '编辑机关代字'
      this.editFormItems[0].placeholder = ''
      this.editButtons = [
        {
          text: '保存',
          type: 'Submit'
        }
      ]
      this.editForm = Object.assign(this.editForm, data)
      this.editForm.type = 'edit'
      this.$refs.editDialog.showDialog()
    },
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除该机关代字？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.fetchSysFontDelete([row.id])
      }).catch(() => {})
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('是否确定删除该机关代字？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchSysFontDelete(this.list.selectedKeys)
        }).catch(() => {})
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    fetchSysFontDelete (ids) {
      this.list.loading = true
      var params = {
        'ids': ids
      }
      this.$request.fetchContentMarksAgencyDelete(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.FetchIssueOrgOptions(true)
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    handleConfirmAdd (data, btn) { // 新增用户
      this.addFormLoading = true
      var params = {}
      if (data.type === 'edit') {
        params = { 'id': data.id, 'markName': data.markName }
        this.$request.fetchContentMarksAgencyPut(params).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.FetchIssueOrgOptions(true)
            this.fetchTableApi()
          }
          this.addFormLoading = false
        }).catch(() => {
          this.addFormLoading = false
        })
      } else {
        params = {
          'markName': data.markName
        }
        this.$request.fetchContentMarksAgencyAdd(params).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.FetchIssueOrgOptions(true)
            this.fetchTableApi()
          }
          this.addFormLoading = false
        }).catch(() => {
          this.addFormLoading = false
        })
      }
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    }
  }
}
</script>
