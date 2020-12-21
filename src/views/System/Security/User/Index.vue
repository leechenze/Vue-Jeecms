<template>
  <section class="security-index-container">
    <base-header v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
      v-on:handleDelete="handleHeaderDelete"
    />
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDelete="handleTableDelete"
    ></base-table>
    <form-dialog
      ref="addDialog"
      :loading="addFormLoading"
      :form="addForm"
      :rules="addRules"
      :formItems="addFormItems"
      :options="{
        contentSecurityOptions,
        accessorySecurityOptions
      }"
      v-on:handleConfirm="handleConfirmAdd"
    ></form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import { mapState, mapActions, mapGetters } from 'vuex'

const columns = [
  {
    prop: 'name',
    label: 'system.security.name',
    scopeType: 'link',
    href: '/system/security/user/detail'
  },
  {
    prop: 'contentSecretNames',
    label: 'system.security.contentSecretNames'
  },
  {
    prop: 'annexSecretNames',
    label: 'system.security.annexSecretNames'
  }
]

export default {
  name: 'securityUserIndex',
  mixins: [baseHeader, baseTable, formDialog],
  data () {
    return {
      list: {
        columns,
        api: 'fetchUserSecretList',
        params: {},
        handleColumn: [
          {
            type: 'Delete',
            name: 'global.delete',
            icon: 'delete',
            disabled: !this._checkPermission('/userSecrets', 'DELETE')
          }
        ]
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: 'global.create',
            icon: 'xinjian',
            disabled: !this._checkPermission('/userSecrets', 'POST')
          },
          {
            type: 'Delete',
            text: 'global.delete',
            icon: 'delete',
            disabled: !this._checkPermission('/userSecrets', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: 'system.security.handleDesc'
      },
      addFormLoading: false,
      addForm: {
        name: '',
        contentSecretIds: [],
        annexSecretIds: []
      },
      addFormItems: [
        {
          prop: 'name',
          label: 'system.security.name',
          placeholder: 'system.security.namePlaceholder',
          maxlength: 50
        },
        {
          type: 'checkbox',
          prop: 'contentSecretIds',
          label: 'system.security.contentSecretNames',
          options: 'contentSecurityOptions'
        },
        {
          type: 'checkbox',
          prop: 'annexSecretIds',
          label: 'system.security.annexSecretNames',
          options: 'accessorySecurityOptions'
        }
      ]
    }
  },
  computed: {
    ...mapState('system', ['reflushSecurityUser']),
    ...mapGetters(['contentSecurityOptions', 'accessorySecurityOptions']),
    addRules () {
      return {
        name: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (value) {
                var params = {
                  name: value
                }
                this.$request.fetchUserSecretCheck(params).then(res => {
                  if (res.code === 200 && res.data) {
                    callback()
                  } else {
                    callback(new Error('密级名称不能重复'))
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions('system', ['ReflushSecurityUser', 'FetchUserSecurityOptions', 'FetchContentSecurityOptions', 'FetchAccessorySecurityOptions']),
    // 表格操作按钮
    handleTableDelete (row, index) {
      this._confirmDelete().then(() => {
        this.fetchUserSecretDelete([row.id])
      })
    },
    // 顶部操作按钮
    handleHeaderCreate () {
      this.$refs.addDialog.showDialog()
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this._confirmDelete().then(() => {
          this.fetchUserSecretDelete(this.list.selectedKeys)
        })
      } else {
        this._messageOne()
      }
    },
    handleConfirmAdd (data, btn) {
      this.addFormLoading = true
      this.$request.fetchUserSecretCreate(data).then(res => {
        if (res.code === 200) {
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
          this.FetchUserSecurityOptions(true)
        }
        this.addFormLoading = false
      }).catch(() => {
        this.addFormLoading = false
      })
    },
    // 发送请求事件
    fetchUserSecretDelete (ids) {
      this.list.loading = true
      this.$request.fetchUserSecretDelete(ids).then(res => {
        if (res.code === 200) {
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
          this.FetchUserSecurityOptions(true)
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    }
  },
  mounted () {
    this.FetchContentSecurityOptions()
    this.FetchAccessorySecurityOptions()
  },
  activated () {
    if (this.reflushSecurityUser) {
      this.fetchTableApi()
      this.ReflushSecurityUser(false)
    }
  }
}
</script>
