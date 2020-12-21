<template>
  <section class="security-content-index-container">
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
      v-on:handleConfirm="handleConfirmAdd"
    ></form-dialog>
    <!-- system-hierarchical start -->
    <secret-progress ref="progress" :allType="allType" :titleDig="titleDig" :secretCode="secretCode" :secretData="secretData" :predictionTimeConsuming="predictionTimeConsuming"></secret-progress>
    <!-- system-hierarchical end -->
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
/* system-hierarchical start */
import secretProgress from '../components/secretProgress'
/* system-hierarchical end */
import { mapState, mapActions, mapGetters } from 'vuex'

const columns = [
  {
    prop: 'name',
    label: 'system.security.name',
    scopeType: 'link',
    href: '/system/security/content/detail'
  }
]

export default {
  name: 'securityContentIndex',
  mixins: [baseHeader, baseTable, formDialog],
  components: {
    // serDig
    /* system-hierarchical start */
    secretProgress
    /* system-hierarchical end */
  },
  data () {
    return {
      allType: false,
      titleDig: '',
      predictionTimeConsuming: 0,
      secretCode: '',
      requestStatus: 1,
      secretData: {},
      secretdig: false,
      list: {
        columns,
        api: 'fetchSysSecretList',
        params: {
          secretType: 1
        },
        handleColumn: [
          {
            type: 'Delete',
            name: 'global.delete',
            icon: 'delete',
            disabled: !this._checkPermission('/secrets', 'DELETE')
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
            type: 'Create',
            text: 'global.create',
            icon: 'xinjian',
            disabled: !this._checkPermission('/secrets', 'POST')
          },
          {
            type: 'Delete',
            text: 'global.delete',
            icon: 'delete',
            disabled: !this._checkPermission('/secrets', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: 'system.security.handleDesc2'
      },
      addFormLoading: false,
      addForm: {
        name: ''
      },
      addFormItems: [
        {
          prop: 'name',
          label: 'system.security.name',
          placeholder: 'system.security.namePlaceholder',
          maxlength: 50
        }
      ]
    }
  },
  computed: {
    ...mapState('system', ['reflushSecurityContent']),
    ...mapGetters(['setting']),
    // 是否开启内容密级
    openContentSecurity () {
      const { openContentSecurity } = this.setting.attrs || {}
      return openContentSecurity
    },
    addRules () {
      return {
        name: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (value) {
                var params = {
                  name: value,
                  secretType: 1
                }
                this.$request.fetchSysSecretCheck(params).then(res => {
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
  watch: {
  },
  methods: {
    ...mapActions('system', ['ReflushSecurityContent', 'FetchContentSecurityOptions']),
    // 表格操作按钮
    handleTableDelete (row, index) {
      this.titleDig = '为保证数据安全,删除内容密级后建议重置所有内容的密级,是否删除后立即重置?'
      if (this.openContentSecurity === '0') {
        this._confirmDelete().then(() => {
          this.fetchSysSecretDelete([ row.id ], this.requestStatus)
        })
      } else {
        this.secretData = row
        /* system-hierarchical start */
        this.$refs.progress.handleSecretOpen()
        /* system-hierarchical change
          this.fetchSysSecretDelete([ row.id ], this.requestStatus)
        system-hierarchical change */
        /* system-hierarchical end */
      }
    },
    // 顶部操作按钮
    handleHeaderCreate () {
      this.$refs.addDialog.showDialog()
    },
    handleHeaderDelete () {
      this.allType = true
      this.titleDig = '为保证数据安全,删除内容密级后建议重置所有内容的密级,是否删除后立即重置?'
      if (this.list.selectedKeys.length) {
        if (this.openContentSecurity === '0') {
          this._confirmDelete().then(() => {
            let type = 1
            this.fetchSysSecretDelete(this.list.selectedKeys, type)
          })
        } else {
          /* system-hierarchical start */
          this.$refs.progress.handleSecretOpen()
        /* system-hierarchical change
          this.fetchSysSecretDelete(this.list.selectedKeys, type)
        system-hierarchical change */
          /* system-hierarchical end */
        }
      } else {
        this._messageOne()
      }
    },
    handAllDeleteData (type) {
      this.fetchSysSecretDelete(this.list.selectedKeys, type)
    },
    handleConfirmAdd (data, btn) {
      this.addFormLoading = true
      data.secretType = this.list.params.secretType
      this.$request.fetchSysSecretCreate(data).then(res => {
        if (res.code === 200) {
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
          this.FetchContentSecurityOptions(true)
        }
        this.addFormLoading = false
      }).catch(() => {
        this.addFormLoading = false
      })
    },
    // 发送请求事件
    fetchSysSecretDelete (ids, requestStatus) {
      this.requestStatus = requestStatus
      let that = this
      this.list.loading = true
      this.$request.fetchSysSecretDelete({ secretIds: ids, type: 1, requestStatus: this.requestStatus }).then(res => {
        if (res.code === 200) {
          /* system-hierarchical start */
          if (res.data) {
            that.secretCode = res.data.code
            that.predictionTimeConsuming = res.predictionTimeConsuming
            if (res.predictionTimeConsuming > 5) {
              that.$refs.progress.handProgressData()
            }
          }
          that.$refs.progress.handleSecretClose()
          /* system-hierarchical end */
          that.$restBack(res, () => {
            that.fetchTableApi()
          })
          that.FetchContentSecurityOptions(true)
        } else {
          /* system-hierarchical start */
          that.$refs.progress.handleSecretClose()
          /* system-hierarchical end */
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
  activated () {
    if (this.reflushSecurityContent) {
      this.fetchTableApi()
      this.ReflushSecurityContent(false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
