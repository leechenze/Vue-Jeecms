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
      <template #ftpName="scope">
        <el-link :underline="false" :disable="!_checkPermission('/ftp', 'GET')" class="jee-color" @click="rowHref(scope.scope.row)">{{scope.scope.row.ftpName}}</el-link>
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
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import searchHeader from '@/components/mixins/searchHeader'
import { loginType, deepClone } from '@/utils'
import { mapActions } from 'vuex'

const columns = [
  {
    prop: 'ftpName',
    label: 'FTP名称',
    scopeType: 'slot'
  },
  {
    prop: 'ip',
    label: '服务器IP'
  },
  {
    prop: 'ftpPath',
    label: '远程目录'
  },
  {
    prop: 'encoding',
    label: '编码'
  },
  {
    prop: 'url',
    label: '资源访问域名'
  }
]

export default {
  name: 'storageFtpIndex',
  mixins: [baseHeader, baseTable, formDialog, searchHeader],
  data () {
    return {
      list: {
        columns,
        api: 'fetchFtpStorageList',
        params: {},
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/ftp', 'DELETE')
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
            disabled: !this._checkPermission('/ftp', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/ftp', 'DELETE')
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
            value: 'ftpName',
            placeholder: '请输入ftp名称'
          }
        ]
      },
      addFormLoading: false,
      addForm: {
        ftpName: '',
        ip: '',
        port: '',
        username: '',
        password: '',
        encoding: '',
        ftpPath: '',
        url: ''
      },
      editFormLoading: false,
      editForm: {
        id: '',
        ftpName: '',
        ip: '',
        port: '',
        username: '',
        password: '',
        encoding: '',
        ftpPath: '',
        url: ''
      },
      editButton: [
        {
          text: 'global.save',
          type: 'Submit'
        }
      ],
      editRules: {
        ftpName: [this.$rules.required()],
        ip: [this.$rules.required(), this.$rules.ip()],
        port: [this.$rules.required(), this.$rules.number(), this.$rules.rangeNum(1, 65535)],
        username: [this.$rules.required()],
        encoding: [this.$rules.required()],
        ftpPath: [this.$rules.required()],
        url: [this.$rules.required()]
      },
      addRules: {
        ftpName: [this.$rules.required()],
        ip: [this.$rules.required(), this.$rules.ip()],
        port: [this.$rules.required(), this.$rules.number(), this.$rules.rangeNum(1, 65535)],
        username: [this.$rules.required()],
        password: [this.$rules.required()],
        encoding: [this.$rules.required()],
        ftpPath: [this.$rules.required()],
        url: [this.$rules.required()]
      },
      addFormItems: [
        {
          prop: 'ftpName',
          label: 'FTP名称',
          placeholder: '请输入FTP名称',
          maxlength: 50
        },
        {
          prop: 'ip',
          label: '服务器IP',
          placeholder: '请输入服务器IP',
          maxlength: 40
        },
        {
          prop: 'port',
          label: '端口号',
          placeholder: '请输入端口号',
          maxlength: 5
        },
        {
          prop: 'ftpPath',
          label: '远程目录',
          placeholder: '请输入远程目录',
          maxlength: 204
        },
        {
          prop: 'username',
          label: '登录名',
          placeholder: '请输入登录名',
          maxlength: 50
        },
        {
          prop: 'password',
          label: '密码',
          'show-password': true,
          placeholder: '请输入密码',
          maxlength: 40
        },
        {
          prop: 'encoding',
          label: '编码',
          placeholder: '请输入编码',
          maxlength: 16
        },
        {
          prop: 'url',
          label: '资源访问域名',
          placeholder: '域名必须是http或https协议',
          maxlength: 204
        }
      ]
    }
  },
  methods: {
    ...mapActions('system', ['FetchFTPOptions']),
    // 表格操作按钮
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchFtpStorageDelete([row.id])
      })
    },
    // 顶部操作按钮
    handleHeaderCreate () {
      this.$refs.addDialog.showDialog()
    },
    // 表格详情
    rowHref (row) {
      this.editFormLoading = true
      this.$request.fetchFtpStorageDetail({ id: row.id }).then(res => {
        if (res.code === 200) {
          res.data.password = ''
          this.editForm = res.data
          this.$refs.editDialog.showDialog()
        }
        this.editFormLoading = false
      }).catch(() => {
        this.editFormLoading = false
      })
    },
    // 编辑保存
    async handleConfirmEdit (data) {
      /* hyt-link s */
      let params = deepClone(data)
      params.password = await loginType(data.password)
      params.ftpPath = this.$encode(params.ftpPath)
      params.url = this.$encode(params.url)
      /* hyt-link e */
      this.editFormLoading = true
      await this.$request.fetchFtpStorageUpdate(params).then(res => {
        if (res.code === 200) {
          this._messageSuccess('save')
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
          this.FetchFTPOptions(true)
        }
        this.editFormLoading = false
      }).catch(() => {
        this.editFormLoading = false
      })
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('确定批量删除ftp存储？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchFtpStorageDelete(this.list.selectedKeys)
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    async handleConfirmAdd (data, btn) {
      /* hyt-link s */
      let params = deepClone(data)
      params.password = await loginType(data.password)
      params.ftpPath = this.$encode(params.ftpPath)
      params.url = this.$encode(params.url)
      /* hyt-link e */
      this.addFormLoading = true
      await this.$request
        .fetchFtpStorageCreate(params)
        .then(res => {
          if (res.code === 200) {
            this.$restBack(res, () => {
              this.fetchTableApi()
            })
            // 强制刷新store中的ftp下拉列表
            this.FetchFTPOptions(true)
          }
          this.addFormLoading = false
        })
        .catch(() => {
          this.addFormLoading = false
        })
    },
    // 发送请求事件
    fetchFtpStorageDelete (ids) {
      this.list.loading = true
      this.$request.fetchFtpStorageDelete(ids).then(res => {
        if (res.code === 200) {
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
          // 强制刷新store中的ftp下拉列表
          this.FetchFTPOptions(true)
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
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
