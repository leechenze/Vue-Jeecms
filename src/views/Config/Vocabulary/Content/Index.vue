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
const columns = [
  {
    prop: 'id',
    label: 'ID'
  },
  {
    prop: 'typeName',
    label: '内容类型名称',
    scopeType: 'handle',
    type: 'Edit'
  },
  {
    prop: 'logoResource.url',
    label: '类型图标',
    scopeType: 'img'
  },
  {
    prop: 'createUser',
    label: '创建人'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    scopeType: 'time'
  }
]
export default {
  name: 'configVocabularyContent',
  mixins: [baseHeader, baseTable, searchHeader, formDialog],
  data () {
    var nameUnique = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          typeName: value,
          id: this.editForm.id
        }
        this.$request.fetchContentTypeUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('内容类型已存在'))
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
        api: 'fetchContentTypePage',
        params: {
          'typeName': ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: 'global.delete',
            icon: 'delete',
            disabled: !this._checkPermission('/contentType', 'DELETE')
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
            disabled: !this._checkPermission('/contentType', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/contentType', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: '操作说明'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'searchInput',
            value: 'typeName',
            placeholder: '请输入内容类型名称'
          }
        ]
      },
      editFormLoading: false,
      editForm: {
        'typeName': '',
        'logoId': '',
        'imgUrl': '',
        'type': 'add'
      },
      editRules: {
        typeName: [
          this.$rules.required(),
          { validator: nameUnique, trigger: ['change', 'blur'] }
        ]
      },
      editFormItems: [
        {
          prop: 'typeName',
          label: '内容类型名称',
          maxlength: 50,
          placeholder: '请输入内容类型名称'
        },
        {
          prop: 'logoId',
          label: '内容类型图标',
          type: 'imageUpload',
          urlProp: 'imgUrl',
          option: {
            width: 40,
            height: 40
          }
        },
        {
          prop: 'id',
          label: '内容类型ID',
          type: 'text',
          hiddenKey: 'type',
          hiddenValue: 'edit'
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
      editTitle: '新建内容类型'
    }
  },
  methods: {
    // 搜索头部
    handleHeaderAdd () {
      this.editForm.imgUrl = ''
      this.editForm.logoId = ''
      this.editForm.typeName = ''
      this.editTitle = '新建内容类型'
      this.editFormItems.find(t => t.prop === 'typeName').placeholder = '请输入内容类型名称'
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
      this.editTitle = '编辑内容类型'
      this.editFormItems.find(t => t.prop === 'typeName').placeholder = ''
      this.editForm = Object.assign(this.editForm, data)
      this.editForm.type = 'edit'
      this.editButtons = [
        {
          text: '保存',
          type: 'Submit'
        }
      ]
      this.editForm.imgUrl = data.logoResource ? data.logoResource.url : ''
      this.$refs.editDialog.showDialog()
    },
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除该内容类型？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.fetchSysContentDelete([row.id])
      }).catch(() => {})
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('是否确定删除该内容类型？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchSysContentDelete(this.list.selectedKeys)
        }).catch(() => {})
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    fetchSysContentDelete (ids) {
      this.list.loading = true
      var params = {
        'ids': ids
      }
      this.$request.fetchContentTypeDelete(params).then(res => {
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
        params = { 'id': data.id, 'typeName': data.typeName, 'logoId': data.logoId }
        this.$request.fetchContentTypePut(params).then(res => {
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
          'typeName': data.typeName,
          'logoId': data.logoId
        }
        this.$request.fetchContentTypeAdd(params).then(res => {
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
