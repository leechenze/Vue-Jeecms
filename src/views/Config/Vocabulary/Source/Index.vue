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
      <template #sourceLink='scope'>
        <a class="jee-color"
          v-if="scope.scope.row.sourceLink.startsWith('http')"
        :href="scope.scope.row.sourceLink" target="_blank">{{scope.scope.row.sourceLink}}</a>
        <span v-else>{{scope.scope.row.sourceLink}}</span>
      </template>
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

var placeholder = ''
export default {
  name: 'configVocabularySource',
  mixins: [baseHeader, baseTable, searchHeader, formDialog],
  data () {
    var nameUnique = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          sourceName: value,
          id: this.editForm.id
        }
        this.$request.fetchSysSourceUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('来源名称已存在'))
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
        prop: 'sourceName',
        label: '来源',
        scopeType: 'handle',
        type: 'Edit',
        disabled: !this._checkPermission('/sysSource', 'PUT')
      },
      {
        prop: 'sourceLink',
        label: '来源链接',
        minWidth: '230px',
        scopeType: 'slot',
        showOverflowTooltip: true
      },
      {
        prop: 'isDefault',
        label: '是否为默认',
        scopeType: 'boolean'
      },
      {
        prop: 'isOpenTarget',
        label: '新窗口打开',
        scopeType: 'boolean'
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
    var options = [
      {
        label: '是',
        value: true
      },
      {
        label: '否',
        value: false
      }
    ]
    return {
      list: {
        columns,
        api: 'fetchSysSourcePage',
        params: {
          'sourceName': ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: 'global.delete',
            icon: 'delete',
            disabled: !this._checkPermission('/sysSource', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: 'global.handle',
          align: 'left',
          width: '75px'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/sysSource', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/sysSource', 'DELETE')
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
            value: 'sourceName',
            placeholder: '请输入来源名称'
          }
        ]
      },
      editFormLoading: false,
      editForm: {
        'sourceName': '',
        'sourceLink': '',
        'isOpenTarget': true,
        'isDefault': false,
        'type': 'add'
      },
      editRules: {
        sourceName: [
          this.$rules.required(),
          { validator: nameUnique, trigger: ['change', 'blur'] }
        ],
        isOpenTarget: [
          this.$rules.required()
        ],
        isDefault: [
          this.$rules.required()
        ]
      },
      editFormItems: [
        {
          prop: 'sourceName',
          label: '来源名称',
          maxlength: 50,
          placeholder: placeholder
        },
        {
          prop: 'sourceLink',
          label: '来源链接',
          maxlength: 150,
          placeholder: '请输入来源链接'
        },
        {
          prop: 'isOpenTarget',
          label: '新窗口打开',
          type: 'radio',
          options
        },
        {
          prop: 'isDefault',
          label: '设为默认来源',
          type: 'radio',
          options
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
          type: 'text',
          hiddenKey: 'type',
          hiddenValue: 'edit'
        }
      ],
      editButtons: [
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
      this.editForm = {
        'sourceName': '',
        'sourceLink': '',
        'isOpenTarget': true,
        'isDefault': false
      }
      this.editTitle = '新建来源'
      placeholder = '请输入来源名称'
      this.editForm.type = 'add'
      this.$refs.editDialog.showDialog()
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
    },
    handleTableEdit (data, btn) {
      this.editTitle = '编辑来源'
      placeholder = ''
      this.editForm = Object.assign(this.editForm, data)
      this.editForm.type = 'edit'
      this.$refs.editDialog.showDialog()
      this.editButtons = [
        {
          text: '保存',
          type: 'Submit'
        }
      ]
    },
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除该来源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.fetchSysSourceDelete([row.id])
      }).catch(() => {})
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('是否确定删除该来源？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchSysSourceDelete(this.list.selectedKeys)
        }).catch(() => {})
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    fetchSysSourceDelete (ids) {
      this.list.loading = true
      var params = {
        'ids': ids
      }
      this.$request.fetchSysSourceDelete(params).then(res => {
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
      params = data
      /* hyt-link s */
      params.sourceLink = this.$encode(data.sourceLink)
      /* hyt-link e */
      delete params.createUser
      delete params.createTime
      if (data.type === 'edit') {
        delete params.type
        this.$request.fetchSysSourcePut(params).then(res => {
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
        delete params.type
        delete params.id
        this.$request.fetchSysSourceAdd(params).then(res => {
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
