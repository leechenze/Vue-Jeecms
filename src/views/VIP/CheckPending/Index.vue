<template>
  <section class="security-index-container">
    <base-header
      v-bind="headers"
      v-on:handleAudit="handleHeaderAudit"
      v-on:handleAuditNo="handleHeaderAuditNo"
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
      v-on:handlePass="handleTablePass"
      v-on:handleNoPass="handleTableNoPass"
      v-on:handleDelete="handleTableDelete"
    >
      <template #checkStatus='scope'>
        <span :style="{color: getColor(scope.scope.row.checkStatus)}">
          {{scope.scope.row.checkStatus}}
        </span>
      </template>
    </base-table>
    <form-dialog
      title="审核原因"
      ref="causeDialog"
      :form="causeForm"
      :rules="causeRules"
      :formItems="causeFormItems"
      v-on:handleConfirm="handleConfirmCause"
      :buttons="causeButtons"
      class="cause-dialog"
    ></form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import searchHeader from '@/components/mixins/searchHeader'
import formDialog from '@/components/mixins/formDialog'
import {
  mapActions,
  mapGetters
} from 'vuex'
export default {
  name: 'vipCheckPendingIndex',
  mixins: [baseHeader, baseTable, searchHeader, formDialog],
  data () {
    return {
      rowId: '',
      list: {
        columns: [],
        api: 'fetchMembersAuditList',
        params: {
          checkStatus: '',
          sourceSite: '',
          key: ''
        },
        handleColumn: [
          {
            type: 'Pass',
            name: '审核通过',
            icon: 'shenghetongguo',
            disabled: !this._checkPermission('/members/on', 'POST')
          },
          {
            type: 'NoPass',
            name: '审核不通过',
            icon: 'shenghebutongguo',
            disabled: !this._checkPermission('/members/off', 'POST')
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/members', 'DELETE')
          }
        ],
        handleColumnProp: {
          width: '275px'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Audit',
            text: '审核通过',
            icon: 'shenghetongguo',
            disabled: !this._checkPermission('/members/on', 'POST')
          },
          {
            type: 'AuditNo',
            text: '审核不通过',
            icon: 'shenghebutongguo',
            disabled: !this._checkPermission('/members/off', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/members', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: true,
        content: '审核通过后将进入会员列表'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            value: 'checkStatus',
            placeholder: '请选择状态',
            label: '状态',
            options: [
              {
                label: '所有',
                value: ''
              },
              {
                label: '待审核',
                value: 0
              },
              {
                label: '审核不通过',
                value: 2
              }
            ]
          },
          {
            type: 'select',
            value: 'sourceSite',
            placeholder: '选择注册站点',
            label: '注册站点',
            optionValue: 'id',
            optionLabel: 'name',
            options: [],
            clearable: true
          },
          {
            type: 'searchInput',
            value: 'key',
            placeholder: '请输入关键字'
          }
        ]
      },
      causeForm: {
      },
      causeRules: {
        reason: [this.$rules.required()]
      },
      causeFormItems: [
        {
          prop: 'reason',
          type: 'textarea',
          autosize: { minRows: 3 },
          maxlength: 50,
          labelWidth: 0
        }
      ],
      causeButtons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['ownSiteOptions'])
  },
  methods: {
    ...mapActions('config', ['FetchSitesOwnsite']),
    getColor (status) {
      switch (status) {
        case '待审核':
          return '#ff9300'
        case '审核通过':
          return '#6ac043'
        case '审核不通过':
          return '#ff0000'
        default:
          return ''
      }
    },
    // 顶部审核通过
    handleHeaderAudit () {
      if (this.list.selectedKeys.length) {
        this.$confirm('确定批量审核通过？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchMembersOn(this.list.selectedKeys)
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    // 顶部审核不通过
    handleHeaderAuditNo () {
      this.rowId = null
      if (this.list.selectedKeys.length) {
        this.$confirm('确定批量审核不通过？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.causeForm = {}
          this.$refs.causeDialog.showDialog()
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    // 顶部批量删除
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('确定批量删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchMembersDelete(this.list.selectedKeys)
        })
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    // 表格删除操作按钮
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchMembersDelete([row.id])
      })
    },
    // 表格审核通过
    handleTablePass (row, index) {
      this.$confirm('是否确定审核通过？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchMembersOn([row.id])
      })
    },
    // 表格审核不通过
    handleTableNoPass (row, index) {
      this.$confirm('是否确定审核不通过？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.causeForm = {}
        this.rowId = row.id
        this.$refs.causeDialog.showDialog()
      })
    },
    // 审核不通过原因
    handleConfirmCause (data) {
      if (this.rowId) {
        data.ids = []
        data.ids.push(this.rowId)
        this.fetchMembersOff(data)
      } else if (this.list.selectedKeys) {
        data.ids = this.list.selectedKeys
        this.fetchMembersOff(data)
      }
    },
    // 发送请求事件
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    },
    // 审核通过
    fetchMembersOn (ids) {
      this.$request.fetchMembersOn({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 审核不通过
    fetchMembersOff (data) {
      this.$request.fetchMembersOff(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 删除
    fetchMembersDelete (ids) {
      this.$request.fetchMembersDelete({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    // 获得动态表格
    fetchMembersAddition () {
      this.$request.fetchMembersAddition().then(res => {
        if (res.code === 200) {
          var array = res.data
          if (array.length > 0) {
            for (var i = 0; i < array.length; i++) {
              let obj = {}
              obj.prop = array[i].value
              obj.label = array[i].label
              if (i === 0) {
                obj.scopeType = 'link'
                obj.href = '/vip/member/detail'
              }
              if (obj.prop === 'checkStatus') {
                obj.scopeType = 'slot'
              }
              this.list.columns.push(obj)
            }
          }
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    }
  },
  activated () {
    if (this.$route.query.type === 'list') {
      this.fetchTableApi()
      this.$router.push({ query: { type: '' } })
    }
  },
  mounted () {
    this.fetchMembersAddition()
    this.FetchSitesOwnsite()
    this.searchHeader.searchItems[1].options = this.ownSiteOptions
  },
  watch: {
    'ownSiteOptions': function (newData) {
      this.searchHeader.searchItems[1].options = newData
    }
  }
}
</script>

<style lang="scss">
.cause-dialog .el-dialog__body .el-form .el-form-item__content{
  margin-left: 0 !important;
  .el-textarea{
    max-width: 530px;
    width: 530px;
  }
}

</style>
