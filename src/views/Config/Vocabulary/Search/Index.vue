<template>
  <section class="voca-search-index">
    <base-header
      v-bind="headers"
      @handleAdd="handleHeaderAdd"
      @handleDelete="handleHeaderDelete"
      />

      <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearchs"
    ></search-header>
    <base-table
      v-bind="list"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleDelete="handleTableDelete"
      @handleEdit="handleTableEdit"
      @handleRecommend="changeTableEdit"
      @sortInput="changeTableEdit"
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
  name: 'configVocabularySearch',
  mixins: [baseHeader, baseTable, searchHeader, formDialog],
  data () {
    var nameUnique = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          term: value,
          id: this.editForm.id
        }
        this.$request.fetchSysSearchWordsUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('搜索词已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    const columns = [
      {
        prop: 'term',
        label: '搜索词',
        scopeType: 'handle',
        type: 'Edit',
        disabled: !this._checkPermission('/searchWords', 'PUT')
      },
      {
        prop: 'searchCount',
        label: '搜索次数'
      },
      {
        prop: 'sortNum',
        label: '固顶排序',
        scopeType: 'input',
        width: '100px',
        disabled: !this._checkPermission('/searchWords', 'PUT')
      },
      {
        prop: 'isRecommend',
        scopeType: 'switch',
        type: 'Recommend',
        label: '是否推荐',
        enableText: '是',
        disableText: '否',
        align: 'center',
        disabled: !this._checkPermission('/searchWords', 'PUT')
      }
    ]
    var options = [
      {
        label: '所有',
        value: ''
      },
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
        api: 'fetchSysSearchWordsPage',
        params: {
          'isRecommend': '',
          'term': '',
          'page_sort': 'searchCount',
          'page_sort_dir': 'desc',
          'sortType': '1'
        },
        handleColumn: [
          {
            type: 'Delete',
            name: 'global.delete',
            icon: 'delete',
            disabled: !this._checkPermission('/searchWords', 'DELETE')
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
            disabled: !this._checkPermission('/searchWords', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/searchWords', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false
        // content: '操作说明'
      },
      searchHeader: {
        searchItems: [
          {
            label: '排序规则：',
            type: 'select',
            style: {
              width: '150px'
            },
            value: 'sortType',
            options: [
              {
                label: '搜索次数降序',
                value: '1'
              },
              {
                label: '搜索次数升序',
                value: '2'
              },
              {
                label: '固顶顺序降序',
                value: '3'
              },
              {
                label: '固顶顺序升序',
                value: '4'
              }
            ]
          },
          {
            label: '是否推荐：',
            type: 'select',
            style: {
              width: '150px'
            },
            value: 'isRecommend',
            options
          },
          {
            type: 'searchInput',
            value: 'term',
            placeholder: '请输入搜索词名称'
          }
        ]
      },
      editFormLoading: false,
      editForm: {
        'term': '',
        'sortNum': 1,
        'isRecommend': true,
        'searchCount': 0,
        'type': 'add'
      },
      editRules: {
        word: [
          this.$rules.required(),
          { validator: nameUnique, trigger: ['change', 'blur'] }
        ],
        sortNum: [
          this.$rules.required()
        ]
      },
      editFormItems: [
        {
          prop: 'word',
          label: '搜索词名称',
          maxlength: 50,
          placeholder: ''
        },
        {
          prop: 'sortNum',
          label: '固顶排序',
          type: 'inputNum',
          min: 1,
          max: 99,
          explain: '需输入大于0的整数，值越小排序越前'
        },
        {
          prop: 'isRecommend',
          label: '是否推荐',
          type: 'radio',
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        {
          prop: 'searchCount',
          label: '搜索次数',
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
      editTitle: '新建敏感词'
    }
  },
  methods: {
    changeTableEdit (row) {
      var data = row
      let s = /^[1-9]\d*$/
      if (row.sortNum !== '' && (Number(row.sortNum) <= 99 && Number(row.sortNum) >= 1) && s.test(row.sortNum)) {
        data.type = 'edit'
        this.handleConfirmAdd(data)
      } else {
        this.$message('请输入1-99之间的整数')
      }
    },
    // 搜索
    handleSearchs (item) {
      // sortType
      this.list.pageNo = 1
      var data = this.list.params
      let obj = {}
      if (data.sortType) {
        obj = this.sortFilter(data.sortType)
      }
      this.list.params = Object.assign(data, obj)
      this.fetchTableApi()
    },
    sortFilter (val) {
      let obj = {}
      switch (val) {
        case '1':
          obj.page_sort = 'searchCount'
          obj.page_sort_dir = 'desc'
          return obj
        case '2':
          obj.page_sort = 'searchCount'
          obj.page_sort_dir = 'asc'
          return obj
        case '3':
          obj.page_sort = 'sortNum'
          obj.page_sort_dir = 'desc'
          return obj
        case '4':
          obj.page_sort = 'sortNum'
          obj.page_sort_dir = 'asc'
          return obj
        default:
          obj.page_sort = ''
          obj.page_sort_dir = ''
          return obj
      }
    },
    // 搜索头部
    handleHeaderAdd () {
      this.editForm = {
        'word': '',
        'sortNum': 1,
        'isRecommend': true,
        'searchCount': 0,
        'type': 'add'
      }
      this.editTitle = '新建搜索词'
      this.editFormItems[0].placeholder = '多个搜索词用逗号隔开'
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
      this.editTitle = '编辑搜索词'
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
      this.$confirm('是否确定删除该搜索词？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.fetchSysSearchDelete([row.id])
      }).catch(() => {})
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('是否确定删除该搜索词？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchSysSearchDelete(this.list.selectedKeys)
        }).catch(() => {})
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    fetchSysSearchDelete (ids) {
      this.list.loading = true
      var params = {
        'ids': ids
      }
      this.$request.fetchSysSearchWordsDelete(params).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        })
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    handleConfirmAdd (data, btn, type) { // 新增用户
      this.addFormLoading = true
      var params = {}
      if (data.type === 'edit') {
        params = { 'id': data.id, 'word': data.word, 'sortNum': data.sortNum, 'isRecommend': data.isRecommend }
        this.$request.fetchSysSearchWordsPut(params).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.fetchTableApi()
          }
          this.addFormLoading = false
        }).catch(() => {
          this.addFormLoading = false
        })
      } else {
        params = { 'word': data.word, 'sortNum': data.sortNum, 'isRecommend': data.isRecommend }
        this.$request.fetchSysSearchWordsAdd(params).then(res => {
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
 .voca-search-index{
   .el-button{
    margin-bottom: 0 !important;//删除操作说明新增样式
  }
 }
</style>
