<template>
 <section class="voca-hot-index">
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
    prop: 'cateName',
    label: '热词分类',
    scopeType: 'link',
    href: '/config/vocabulary/hot/detail'
  },
  {
    prop: 'applyScope',
    label: '应用范围',
    formatter: (row) => {
      if (row.applyScope === 1) {
        return '所有栏目'
      } else {
        return row.range
      }
    }
  }
]
export default {
  name: 'configVocabularyHotIndex',
  mixins: [baseHeader, baseTable, searchHeader, formDialog],
  data () {
    var nameUnique = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          cateName: value,
          id: this.editForm.id
        }
        this.$request.fetchHotWordCategorysUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('热词分类名称已存在'))
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
        api: 'fetchHotWordCategorysPage',
        params: {
          'cateName': ''
        },
        handleColumn: [
          {
            type: 'Link',
            name: '热词管理',
            href: '/config/vocabulary/hot/manage/index',
            icon: 'reciguangli'
          },
          {
            type: 'Delete',
            name: 'global.delete',
            icon: 'delete',
            disabled: !this._checkPermission('/hotWordCategorys', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: 'global.handle',
          width: '167px',
          align: 'left'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '新建分类',
            icon: 'xinjian',
            disabled: !this._checkPermission('/hotWordCategorys', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/hotWordCategorys', 'DELETE')
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
            value: 'cateName',
            placeholder: '请输入热词分类名'
          }
        ]
      },
      editFormLoading: false,
      editForm: {
        'cateName': '',
        'channelId': [],
        'applyScope': 1
      },
      editRules: {
        cateName: [
          this.$rules.required(),
          { validator: nameUnique, trigger: ['change', 'blur'] }
        ],
        applyScope: [
          this.$rules.required()
        ],
        channelId: [
          this.$rules.required()
        ]
      },
      editFormItems: [
        {
          prop: 'cateName',
          label: '热词分类名称',
          maxlength: 50,
          placeholder: '请输入热词分类名称'
        },
        {
          prop: 'applyScope',
          label: '应用范围',
          type: 'checkbox',
          complex: true,
          defaultValue: 2,
          optionValue: 1,
          optionLabel: '所有栏目'
        },
        {
          prop: 'channelId',
          type: 'checkTree',
          labelWidth: '166px',
          hiddenKey: 'applyScope',
          hiddenValue: 2,
          tree: [],
          props: {
            children: 'children',
            label: 'name'
          }
        }
      ],
      editButtons: [],
      editTitle: '新建热词分类'
    }
  },
  methods: {
    // 搜索头部
    handleHeaderAdd () {
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
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除该热词分类？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.fetchSysHotDelete([row.id])
      }).catch(() => {})
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('是否确定删除该热词分类？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchSysHotDelete(this.list.selectedKeys)
        }).catch(() => {})
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    fetchSysHotDelete (ids) {
      this.list.loading = true
      var params = {
        'ids': ids
      }
      this.$request.fetchHotWordCategorysDelete(params).then(res => {
        if (res.code === 200) {
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    handleConfirmAdd (data, btn, type) { // 新增用户
      this.addFormLoading = true
      var params = Object.assign({}, data)
      this.$request.fetchHotWordCategorysAdd(params).then(res => {
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
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          return d
        })
        this.list.totalCount = res.data.totalElements
        this.getTreeList()
      }
    },
    getTreeList () {
      this.$request.fetchChannelGetAllTree().then(res => {
        if (res.code === 200) {
          this.editFormItems.find(v => v.prop === 'channelId').tree = res.data
        }
      })
    }
  },
  activated () {
    if (this.$route.query.type === 'list') {
      this.fetchTableApi()
      this.$router.push({ query: { type: '', ...this.$route.query } })
    }
  }

}
</script>
<style lang="scss">
 .voca-hot-index{
   .el-button{
    margin-bottom: 0 !important;//删除操作说明新增样式
  }
 }
</style>
