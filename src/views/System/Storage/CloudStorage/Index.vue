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
      v-on:handleDelete="handleTableDelete"
    >
      <template #ossName="scope">
        <el-link :underline="false" :disable="!_checkPermission('/ftp', 'GET')" class="jee-color" @click="rowHref(scope.scope.row)">{{scope.scope.row.ossName}}</el-link>
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
import { deepClone } from '../../../../utils'

const columns = [
  {
    prop: 'ossName',
    label: 'OSS名称',
    scopeType: 'slot'
  },
  {
    prop: 'ossType',
    label: '存储类型',
    formatter: (row, column, cellValue, index) => {
      const options = [
        {
          label: '腾讯云',
          value: 1
        },
        {
          label: '阿里云',
          value: 2
        },
        {
          label: '七牛云',
          value: 3
        }
      ]
      const opt = options.find(d => d.value === cellValue)
      return opt ? opt.label : ''
    }
  }
]

export default {
  name: 'storageCloudIndex',
  mixins: [baseHeader, baseTable, formDialog, searchHeader],
  data () {
    return {
      list: {
        columns,
        api: 'fetchOssStorageList',
        params: {
          ossName: '',
          ossType: ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/sysOss', 'DELETE')
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
            disabled: !this._checkPermission('/sysOss', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/sysOss', 'DELETE')
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
            type: 'select',
            label: '存储类型：',
            value: 'ossType',
            options: [
              {
                value: '',
                label: '所有'
              },
              {
                value: 3,
                label: '七牛云'
              },
              {
                value: 2,
                label: '阿里云'
              },
              {
                value: 1,
                label: '腾讯云'
              }
            ]
          },
          {
            type: 'searchInput',
            value: 'ossName',
            placeholder: '请输入OSS名称'
          }
        ]
      },
      addFormLoading: false,
      addForm: {
        ossName: '',
        appId: '',
        secretId: '',
        ossType: 1,
        bucketName: '',
        bucketArea: '',
        endPoint: '',
        accessDomain: '',
        appKey: ''
      },
      editFormLoading: false,
      editForm: {
        id: '',
        ossName: '',
        appId: '',
        secretId: '',
        ossType: 1,
        bucketName: '',
        bucketArea: '',
        endPoint: '', //
        accessDomain: '',
        appKey: ''
      },
      editButton: [
        {
          text: 'global.save',
          type: 'Submit'
        }
      ],
      addRules: {
        ossName: [this.$rules.required()],
        secretId: [this.$rules.required()],
        ossType: [this.$rules.required()],
        bucketName: [this.$rules.required()],
        appKey: [this.$rules.required()],
        appId: [this.$rules.required()],
        bucketArea: [this.$rules.required()],
        endPoint: [this.$rules.required()],
        accessDomain: [this.$rules.required()]
      },
      addFormItems: [
        {
          prop: 'ossName',
          label: 'OSS名称',
          placeholder: '请输入OSS名称',
          maxlength: 87
        },
        {
          type: 'select',
          prop: 'ossType',
          label: '存储类型',
          placeholder: '请选择存储类型',
          options: [
            {
              label: '腾讯云',
              value: 1
            },
            {
              label: '阿里云',
              value: 2
            },
            {
              label: '七牛云',
              value: 3
            }
          ]
        },
        {
          prop: 'bucketName',
          label: 'Bucket名',
          placeholder: '请输入Bucket名',
          maxlength: 87
        },
        {
          prop: 'appId',
          label: 'AppId',
          placeholder: '请输入AppId',
          hiddenKey: 'ossType',
          hiddenValue: 1,
          maxlength: 255
        },
        {
          prop: 'secretId',
          label: 'secretId',
          placeholder: '请输入secretId',
          maxlength: 255
        },
        {
          prop: 'bucketArea',
          label: '地区码',
          placeholder: '请输入地区码',
          hiddenFunc: (item) => {
            return item.ossType === 1 || item.ossType === 3
          },
          maxlength: 87
        },
        {
          prop: 'endPoint',
          label: 'endPoint',
          placeholder: '请输入endPoint',
          hiddenKey: 'ossType',
          hiddenValue: 2,
          maxlength: 87
        },
        {
          prop: 'accessDomain',
          label: '访问域名',
          placeholder: '请输入访问域名',
          maxlength: 204
        },
        {
          prop: 'appKey',
          label: 'appKey',
          placeholder: '请输入appKey',
          maxlength: 255
        }
      ]
    }
  },
  methods: {
    ...mapActions('system', ['FetchOSSOptions']),
    // 表格操作按钮
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchOsspStorageDelete([row.id])
      })
    },
    // 顶部操作按钮
    handleHeaderCreate () {
      this.$refs.addDialog.showDialog()
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('是否确定批量删除云存储？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchOsspStorageDelete(this.list.selectedKeys)
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    handleConfirmAdd (data, btn) {
      /* hyt-link */
      let params = deepClone(data)
      params.endPoint = this.$encode(params.endPoint)
      params.accessDomain = this.$encode(params.accessDomain)
      this.addFormLoading = true
      this.$request
        .fetchOssStorageCreate(params)
        .then(res => {
          if (res.code === 200) {
            this.$restBack(res, () => {
              this.fetchTableApi()
            })
            this.FetchOSSOptions(true)
          }
          this.addFormLoading = false
        })
        .catch(() => {
          this.addFormLoading = false
        })
    },
    // 表格详情
    rowHref (row) {
      this.editFormLoading = true
      this.$request.fetchOssStorageDetail({ id: row.id }).then(res => {
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
      /* hyt-link */
      let params = deepClone(data)
      params.endPoint = this.$encode(params.endPoint)
      params.accessDomain = this.$encode(params.accessDomain)
      this.editFormLoading = true
      this.$request.fetchOssStorageUpdate(params).then(res => {
        if (res.code === 200) {
          this._messageSuccess('save')
          // this.$restBack(res, () => {
          this.fetchTableApi()
          // })
          this.FetchOSSOptions(true)
        }
        this.editFormLoading = false
      }).catch(() => {
        this.editFormLoading = false
      })
    },
    // 发送请求事件
    fetchOsspStorageDelete (ids) {
      this.list.loading = true
      this.$request.fetchOsspStorageDelete(ids).then(res => {
        if (res.code === 200) {
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
          this.FetchOSSOptions(true)
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    },
    fetchSysSecretAll () {
      this.$request.fetchSysSecretAll({ secretType: 1 }).then(res => {
        this.addFormItems.filter(d => d.prop === 'contentSecretIds')[0].options = res.data.map(d => {
          d.value = d.id
          d.label = d.name
          return d
        })
      })
      this.$request.fetchSysSecretAll({ secretType: 2 }).then(res => {
        this.addFormItems.filter(d => d.prop === 'annexSecretIds')[0].options = res.data.map(d => {
          d.value = d.id
          d.label = d.name
          return d
        })
      })
    }
  },
  activated () {
    if (this.$route.query.type === 'list') {
      this.fetchTableApi()
      this.$router.push({ query: { type: '' } })
    }
  }
}
</script>

<style lang="scss" scoped></style>
