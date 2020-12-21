<template>
 <section class="voca-hot-manage-index">
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
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'configVocabularyHotManage',
  mixins: [baseHeader, baseTable, searchHeader, formDialog],
  data () {
    var nameUnique = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          hotTerm: value,
          id: this.editForm.id
        }
        this.$request.fetchHotWordsUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('热词名称已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    const columns = [
      {
        prop: 'hotTerm',
        label: '热词',
        scopeType: 'handle',
        type: 'Edit',
        disabled: !this._checkPermission('/hotWords', 'PUT')
      },
      {
        prop: 'linkUrl',
        label: '链接',
        scopeType: 'link',
        showOverflowTooltip: true,
        maxWidth: '250px',
        target: true
      },
      {
        prop: 'useCount',
        label: '使用次数'
      },
      {
        prop: 'clickCount',
        label: '点击次数'
      },
      {
        prop: 'isTargetBlank',
        label: '新窗口打开',
        scopeType: 'boolean'
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true,
        maxWidth: '250px'
      }
    ]
    return {
      list: {
        columns,
        api: 'fetchHotWordsPage',
        params: {
          'hotTerm': '',
          'hotTermCategoryId': Number(this.$route.query.id)
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
          align: 'left'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/hotWords', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/hotWords', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: true,
        content: '操作说明'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'searchInput',
            value: 'hotTerm',
            placeholder: '请输入热词名称'
          }
        ]
      },
      editFormLoading: false,
      editForm: {
        'hotTermCategoryId': Number(this.$route.query.id),
        'hotWord': '',
        'linkUrl': '',
        'isTargetBlank': true,
        'remark': '',
        'dealWithType': 1,
        'clickCount': 0,
        'useCount': 0,
        'type': 'add'
      },
      editRules: {
        hotWord: [
          this.$rules.required(),
          { validator: nameUnique, trigger: ['change', 'blur'] }
        ],
        isTargetBlank: [
          this.$rules.required()
        ],
        hotTermCategoryId: [
          this.$rules.required()
        ],
        linkUrl: [
          this.$rules.required()
        ]
      },
      editFormItems: [
        {
          prop: 'hotTermCategoryId',
          label: '所属分类',
          type: 'select',
          disabled: true,
          optionLabel: 'cateName',
          optionValue: 'id',
          options: []
        },
        {
          prop: 'hotWord',
          label: '热词名称',
          maxlength: 50,
          placeholder: '多个热词用逗号隔开'
        },
        {
          prop: 'linkUrl',
          label: '链接地址',
          maxlength: 50
        },
        {
          prop: 'isTargetBlank',
          label: '新窗口打开',
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
          prop: 'remark',
          label: '备注',
          type: 'textarea',
          maxlength: 150,
          showWordLimit: true
        },
        {
          prop: 'dealWithType',
          label: '热词重复处理',
          type: 'radio',
          hiddenKey: 'type',
          hiddenValue: 'add',
          explain: '覆盖已有热词时，原有的使用次数和点击次数会清零',
          options: [
            {
              label: '覆盖已有热词',
              value: 1
            },
            {
              label: '跳过已有热词',
              value: 2
            }
          ]
        },
        {
          prop: 'useCount',
          label: '引用次数',
          hiddenKey: 'type',
          hiddenValue: 'edit',
          type: 'text'
        },
        {
          prop: 'clickCount',
          label: '点击次数',
          hiddenKey: 'type',
          hiddenValue: 'edit',
          type: 'text'
        }
      ],
      editButtons: [],
      editTitle: '新建热词'
    }
  },
  computed: {
    ...mapGetters(['config'])
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      if (newRoute.name === 'configVocabularyHotManage') {
        const { id } = newRoute.query
        if (id) {
          this.list.params.hotTermCategoryId = Number(id)
          this.fetchTableApi()
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.config.hotWordCategorysList.length > 0) {
        this.editFormItems[0].options = this.config.hotWordCategorysList
      } else {
        this.FetchHotWordCategorys()
      }
    })
  },
  methods: {
    ...mapActions('config', ['FetchHotWordCategorys']),
    // 搜索头部
    handleHeaderAdd () {
      this.editTitle = '新建热词'
      this.editForm = {
        'hotTermCategoryId': Number(this.$route.query.id),
        'hotWord': '',
        'linkUrl': '',
        'isTargetBlank': true,
        'remark': '',
        'dealWithType': 1,
        'clickCount': 0,
        'useCount': 0,
        'type': 'add'
      }
      this.editFormItems[0].options = this.config.hotWordCategorysList
      this.editFormItems[1].placeholder = '多个热词用逗号隔开'
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
      this.editTitle = '编辑热词'
      this.editFormItems[1].placeholder = ''
      this.editForm = Object.assign(this.editForm, data)
      this.editForm.type = 'edit'
      this.editFormItems[0].options = this.config.hotWordCategorysList
      this.editButtons = [
        {
          text: '保存',
          type: 'Submit'
        }
      ]
      this.$refs.editDialog.showDialog()
    },
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除该热词？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.fetchSysHotDelete([row.id])
      }).catch(() => {})
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('是否确定删除该热词？', '提示', {
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
      this.$request.fetchHotWordsDelete(params).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        })
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    handleConfirmAdd (data, btn) { // 新增用户
      this.addFormLoading = true
      var params = {}
      /* hyt-link s */
      let link = this.$encode(data.linkUrl)
      // let link = data.linkUrl
      /* hyt-link e */
      if (data.type === 'edit') {
        params = { 'id': data.id, 'hotWord': data.hotWord, 'linkUrl': link, 'isTargetBlank': data.isTargetBlank, 'remark': data.remark }
        this.$request.fetchHotWordsPut(params).then(res => {
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
          'hotTermCategoryId': data.hotTermCategoryId,
          'hotWord': data.hotWord,
          'linkUrl': link,
          'isTargetBlank': data.isTargetBlank,
          'remark': data.remark,
          'dealWithType': data.dealWithType }
        this.$request.fetchHotWordsAdd(params).then(res => {
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
