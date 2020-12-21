<template>
  <section class="security-user-detail-container">
    <base-header v-bind="headers"
      v-on:handleDelete="handleHeaderDelete"
    />
    <base-form
      v-bind="form"
      :rules="rules"
      v-on:handleConfirm="handleConfirm"
    ></base-form>
    <!-- system-hierarchical start -->
    <secret-progress ref="progress" :titleDig="titleDig" :secretCode="secretCode" :secretData="secretData" :predictionTimeConsuming="predictionTimeConsuming"></secret-progress>
    <!-- system-hierarchical end -->
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
/* system-hierarchical start */
import secretProgress from '../components/secretProgress'
/* system-hierarchical end */
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'securityAccessoryDetail',
  mixins: [baseHeader, baseForm],
  components: {
    /* system-hierarchical start */
    secretProgress
    /* system-hierarchical end */
  },
  data () {
    return {
      titleDig: '',
      predictionTimeConsuming: 0,
      secretCode: '',
      requestStatus: 1,
      secretData: {},
      headers: {
        buttons: [
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
        // content: 'system.security.handleDesc3'
      },
      form: {
        api: 'fetchSysSecretDetail',
        params: {
          id: ''
        },
        form: {
          id: '',
          name: ''
        },
        formItems: [
          {
            prop: 'name',
            label: 'system.security.name',
            placeholder: 'system.security.namePlaceholder',
            maxlength: 50
          }
        ],
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/secrets', 'PUT')
        }]
      }
    }
  },
  computed: {
    ...mapGetters(['setting']),
    // 是否开启内容密级
    openAttachmentSecurity () {
      const { openAttachmentSecurity } = this.setting.attrs || {}
      return openAttachmentSecurity
    },
    // 是否开启内容密级
    openContentSecurity () {
      const { openContentSecurity } = this.setting.attrs || {}
      return openContentSecurity
    },
    rules () {
      return {
        name: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (value) {
                var params = {
                  name: value,
                  secretType: 2,
                  id: this.form.params.id
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
  inject: ['removeTab'],
  methods: {
    ...mapActions('system', ['ReflushSecurityAccessory', 'FetchAccessorySecurityOptions']),
    // 顶部操作按钮
    handleHeaderDelete () {
      this.titleDig = '为保证数据安全,删除附件密级后建议重置所有附件的密级,是否删除后立即重置?'
      if (this.openAttachmentSecurity === '0' || this.openContentSecurity === '0') {
        this._confirmDelete().then(() => {
          this.fetchSysSecretDelete([this.form.form.id], this.requestStatus)
        })
      } else {
        this.secretData = this.form.form
        /* system-hierarchical start */
        this.$refs.progress.handleSecretOpen()
        /* system-hierarchical change
          this.fetchSysSecretDelete([this.form.form.id], this.requestStatus)
        system-hierarchical change */
        /* system-hierarchical end */
      }
    },
    handleConfirm (data) {
      this.form.loading = true
      this.$request.fetchSysSecretUpdate(data).then(res => {
        this.hideFormLoading()
        if (res.code === 200) {
          this._messageSuccess('save')
          this.ReflushSecurityAccessory(true)
          this.FetchAccessorySecurityOptions(true)
          this.removeTab(this.$route.fullPath)
          this.$router.replace({ name: 'securityAccessoryIndex' }).catch(()=>{});//把error 抛出来
        }
      }).catch(this.hideFormLoading)
    },
    // 发送请求事件
    fetchSysSecretDelete (ids, requestStatus) {
      this.requestStatus = requestStatus
      let that = this
      this.$request.fetchSysSecretDelete({ secretIds: ids, type: 2, requestStatus: this.requestStatus }).then(res => {
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
          this._messageSuccess('delete')
          this.ReflushSecurityAccessory(true)
          this.FetchAccessorySecurityOptions(true)
          this.removeTab(this.$route.fullPath)
          this.$router.replace({ name: 'securityAccessoryIndex' }).catch(()=>{});//把error 抛出来
        }
      })
    },
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.form.form = res.data
      }
    }
  },
  mounted () {
    const { id } = this.$route.query
    this.form.params.id = id
    this.fetchFormApi()
  },
  activated () {
    const { id } = this.$route.query
    if (id && id !== this.form.params.id) {
      this.form.params.id = id
      this.fetchFormApi()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
