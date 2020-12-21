<template>
  <section class="apis-index-container">
    <base-header v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
      v-on:handleDelete="handleHeaderDelete"
    />

      <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearchs"
    ></search-header>
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDelete="handleTableDelete"
    >
      <template #apiName="scope">
        <el-link :underline="false" :disable="!_checkPermission('/ftp', 'GET')" class="jee-color" @click="rowHref(scope.scope.row)">{{scope.scope.row.apiName}}</el-link>
      </template>
    </base-table>
    <form-dialog
      ref="addDialog"
      :loading="addFormLoading"
      :form="addForm"
      :rules="addRules"
      :formItems="addFormItems"
      v-on:handleConfirm="handleConfirmAdd"
    ></form-dialog>
    <form-dialog
      ref="editDialog"
      title='编辑'
      :loading="editFormLoading"
      :form="editForm"
      :rules="editRules"
      :formItems="addFormItems"
      :buttons="editButton"
      v-on:handleConfirm="handleConfirmEdit"
    >
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import { mapState, mapActions } from 'vuex'
import { deepClone } from '@/utils'

const columns = [
  {
    prop: 'apiName',
    label: '接口名称',
    scopeType: 'slot'
  },
  {
    prop: 'apiUrl',
    label: '接口地址'
  },
  {
    prop: 'requestMethod',
    label: '请求方式',
    formatter: (row, column, cellValue, index) => {
      const options = [
        {
          label: 'GET',
          value: 1
        },
        {
          label: 'POST',
          value: 2
        },
        {
          label: 'DELETE',
          value: 3
        },
        {
          label: 'UPDATE',
          value: 4
        },
        {
          label: 'PUT',
          value: 5
        }
      ]
      const opt = options.find(d => d.value === cellValue)
      return opt ? opt.label : ''
    }
  },
  {
    prop: 'useScene',
    label: '使用场景'
  }
]

export default {
  name: 'menusApisIndex',
  mixins: [baseHeader, searchHeader, baseTable, formDialog],
  data () {
    return {
      searchHeader: {
        searchItems: [
          {
            type: 'input',
            value: 'apiName',
            placeholder: 'API名称'
          },
          {
            type: 'searchInput',
            value: 'apiUrle',
            placeholder: 'API地址'
          }
        ]
      },
      list: {
        columns,
        api: 'fetchApisList',
        params: {
          apiName: '',
          apiUrl: '',
          apiUrle: ''
        },
        filterParams: ['apiUrle'],
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/apis', 'DELETE')
          }
        ],
        handleColumnProp: {
          width: '75px'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/apis', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/apis', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: '操作说明'
      },
      addFormLoading: false,
      addForm: {
        requestMethod: 1,
        apiName: '',
        apiUrl: '',
        useScene: ''
      },
      editFormLoading: false,
      editForm: {
        id: '',
        requestMethod: 1,
        apiName: '',
        apiUrl: '',
        useScene: ''
      },
      editButton: [
        {
          text: 'global.save',
          type: 'Submit'
        }
      ],
      editRules: {
        requestMethod: [
          this.$rules.required()
        ],
        apiName: [
          this.$rules.required()
        ],
        apiUrl: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (value) {
                var params = {
                  url: this.$encode(value),
                  id: this.editForm.id,
                  requestMethod: this.editForm.requestMethod
                }
                this.$request.fetchApisUnique(params).then(res => {
                  if (res.code === 200 && res.data) {
                    callback()
                  } else {
                    callback(new Error('API地址不能重复'))
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ]
      },
      addRules: {
        requestMethod: [
          this.$rules.required()
        ],
        apiName: [
          this.$rules.required()
        ],
        apiUrl: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (value) {
                var params = {
                  url: this.$encode(value),
                  requestMethod: this.addForm.requestMethod
                }
                this.$request.fetchApisUnique(params).then(res => {
                  if (res.code === 200 && res.data) {
                    callback()
                  } else {
                    callback(new Error('API地址不能重复'))
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ]
      },
      addFormItems: [
        {
          prop: 'apiName',
          label: '接口名称',
          placeholder: '请输入接口名称',
          maxLength: 50
        },
        {
          prop: 'apiUrl',
          label: '接口地址',
          placeholder: '请输入接口地址',
          maxLength: 120
        },
        {
          type: 'select',
          prop: 'requestMethod',
          label: '请求方式',
          placeholder: '请选择',
          options: [
            {
              label: 'GET',
              value: 1
            },
            {
              label: 'POST',
              value: 2
            },
            {
              label: 'DELETE',
              value: 3
            },
            {
              label: 'UPDATE',
              value: 4
            },
            {
              label: 'PUT',
              value: 5
            }
          ]
        },
        {
          prop: 'useScene',
          label: '使用场景',
          placeholder: '请输入使用场景',
          maxLength: 75
        }
      ]
    }
  },
  computed: {
    ...mapState('system', ['reflushApi'])
  },
  methods: {
    ...mapActions('system', ['ReflushApi']),
    // 表格操作按钮
    handleTableDelete (row, index) {
      this._confirmDelete().then(() => {
        this.fetchApisDelete([row.id])
      })
    },
    handleSearchs () {
      this.list.params.apiUrl = this.$encode(this.list.params.apiUrle)
      this.handleSearch()
    },
    // 顶部操作按钮
    handleHeaderCreate () {
      this.$refs.addDialog.showDialog()
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this._confirmDelete().then(() => {
          this.fetchApisDelete(this.list.selectedKeys)
        })
      } else {
        this._messageOne()
      }
    },
    handleConfirmAdd (data, btn) {
      this.addFormLoading = true
      /* hyt-link s */
      let params = deepClone(data)
      params.apiUrl = this.$encode(params.apiUrl)
      /* hyt-link e */
      this.$request.fetchApisCreate(params).then(res => {
        if (res.code === 200) {
          this._messageSuccess('save')
          this.fetchTableApi()
        }
        this.addFormLoading = false
      }).catch(() => {
        this.addFormLoading = false
      })
    },
    // 表格详情
    rowHref (row) {
      this.editFormLoading = true
      this.$request.fetchApisDetail({ id: row.id }).then(res => {
        if (res.code === 200) {
          this.editForm = res.data
          this.$refs.editDialog.showDialog()
        }
        this.editFormLoading = false
      }).catch(() => {
        this.editFormLoading = false
      })
    },
    // 编辑保存
    handleConfirmEdit (data) {
      this.editFormLoading = true
      /* hyt-link s */
      let params = deepClone(data)
      params.apiUrl = this.$encode(params.apiUrl)
      /* hyt-link e */
      this.$request.fetchApisUpdate(params).then(res => {
        if (res.code === 200) {
          this._messageSuccess('save')
          this.fetchTableApi()
          this.ReflushApi(true)
        }
        this.editFormLoading = false
      }).catch(() => {
        this.editFormLoading = false
      })
    },
    // 发送请求事件
    fetchApisDelete (ids) {
      this.list.loading = true
      this.$request.fetchApisDelete(ids).then(res => {
        if (res.code === 200) {
          this._messageSuccess('delete')
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        /* hyt-link s */
        this.list.params.apiUrl = this.$decode(this.list.params.apiUrl)
        /* hyt-link e */
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    }
  },
  mounted () {
    this.fetchTableApi()
  },
  activated () {
    if (this.reflushApi) {
      this.fetchTableApi()
      this.ReflushApi(false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
