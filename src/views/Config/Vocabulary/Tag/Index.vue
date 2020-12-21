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
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleDelete="handleTableDelete"
      @handleEdit="handleTableEdit"
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

export default {
  name: 'configVocabularyTag',
  mixins: [baseHeader, baseTable, searchHeader, formDialog],
  data () {
    var nameUnique = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          tagName: value,
          id: this.editForm.id
        }
        this.$request.fetchContentTagsUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('tag词名称已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    const columns = [
      {
        prop: 'id',
        label: '序号'
      },
      {
        prop: 'tagName',
        label: 'tag词',
        scopeType: 'handle',
        type: 'Edit',
        disabled: !this._checkPermission('/contentTags', 'PUT')
      },
      {
        prop: 'refCounter',
        label: '使用次数'
      },
      {
        prop: 'createTime',
        label: '创建时间',
        scopeType: 'time'
      }
    ]
    return {
      list: {
        columns,
        api: 'fetchContentTagsPage',
        params: {
          'tagName': ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: 'global.delete',
            icon: 'delete',
            disabled: !this._checkPermission('/contentTags', 'DELETE')
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
            icon: 'xinjian',
            disabled: !this._checkPermission('/contentTags', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/contentTags', 'DELETE')
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
            value: 'tagName',
            placeholder: '请输入tag词名称'
          }
        ]
      },
      editFormLoading: false,
      editForm: {
        'tagName': '',
        'type': 'add'
      },
      editRules: {
        tagName: [
          this.$rules.required(),
          { validator: nameUnique, trigger: ['change', 'blur'] }
        ]
      },
      editFormItems: [
        {
          prop: 'tagName',
          label: 'tag词名称',
          maxlength: 40,
          placeholder: ''
        },
        {
          prop: 'refCounter',
          label: '使用次数',
          type: 'text',
          hiddenKey: 'type',
          hiddenValue: 'edit'
        }
      ],
      editButtons: [
        {
          text: '保存并继续新建',
          keepAlive: true,
          type: 'Submit'
        },
        {
          text: '保存',
          type: 'Submit'
        }
      ],
      editTitle: '新建tag词'
    }
  },
  methods: {
    // 搜索头部
    handleHeaderAdd () {
      this.editForm.tagName = ''
      this.editTitle = '新建tag词'
      this.editFormItems[0].placeholder = '多个tag词用逗号隔开'
      this.editForm.type = 'add'
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
      this.editTitle = '编辑tag词'
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
      this.$confirm('是否确定删除该tag词？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.fetchSysTagDelete([row.id])
      }).catch(() => {})
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('是否确定删除该tag词？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchSysTagDelete(this.list.selectedKeys)
        }).catch(() => {})
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    fetchSysTagDelete (ids) {
      this.list.loading = true
      var params = {
        'ids': ids
      }
      this.$request.fetchContentTagsDelete(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    handleConfirmAdd (data, btn) { // 新增用户
      this.addFormLoading = true
      var params = {}
      if (data.type === 'edit') {
        params = { 'id': data.id, 'tagName': data.tagName }
        this.$request.fetchContentTagsPut(params).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.fetchTableApi()
          }
          this.addFormLoading = false
        }).catch(() => {
          this.addFormLoading = false
        })
      } else {
        params = {
          'tagName': data.tagName
        }
        this.$request.fetchContentTagsAdd(params).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
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
<style lang="scss">
 .voca-content-index{
   .el-button{
    margin-bottom: 0 !important;//删除操作说明新增样式
  }
 }
</style>
