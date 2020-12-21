<template>
  <section class="security-user-detail-container">
    <base-header v-bind="headers"
      v-on:handleDelete="handleHeaderDelete"
    />
    <base-form
      v-bind="form"
      :options="{
        contentSecurityOptions,
        accessorySecurityOptions
      }"
      :rules="rules"
      v-on:handleConfirm="handleConfirm"
    ></base-form>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'securityUserDetail',
  mixins: [baseHeader, baseForm],
  data () {
    return {
      headers: {
        buttons: [
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
        // content: 'system.security.handleDesc2'
      },
      form: {
        width: '190px',
        api: 'fetchUserSecretDetail',
        params: {
          id: ''
        },
        form: {
          id: '',
          name: '',
          contentSecretIds: [],
          annexSecretIds: []
        },
        formItems: [
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
        ],
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/userSecrets', 'PUT')
        }]
      }
    }
  },
  computed: {
    ...mapState('system', ['reflushSecurityUser']),
    ...mapGetters(['contentSecurityOptions', 'accessorySecurityOptions']),
    rules () {
      return {
        name: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (value) {
                var params = {
                  name: value,
                  id: this.form.params.id
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
  inject: ['removeTab'],
  methods: {
    ...mapActions('system', ['ReflushSecurityUser', 'FetchUserSecurityOptions', 'FetchContentSecurityOptions', 'FetchAccessorySecurityOptions']),
    // 顶部操作按钮
    handleHeaderDelete () {
      this._confirmDelete().then(() => {
        this.fetchUserSecretDelete([this.form.form.id])
      })
    },
    handleConfirm (data) {
      this.form.loading = true
      this.$request.fetchUserSecretUpdate(data).then(res => {
        this.hideFormLoading()
        if (res.code === 200) {
          this._messageSuccess('save')
          this.FetchUserSecurityOptions(true)
          this.ReflushSecurityUser(true)
          this.removeTab(this.$route.fullPath)
          this.$router.replace({ name: 'securityUserIndex' }).catch(()=>{});//把error 抛出来
        }
      }).catch(this.hideFormLoading)
    },
    // 发送请求事件
    fetchUserSecretDelete (ids) {
      this.$request.fetchUserSecretDelete(ids).then(res => {
        if (res.code === 200) {
          this._messageSuccess('delete')
          this.FetchUserSecurityOptions(true)
          this.ReflushSecurityUser(true)
          this.removeTab(this.$route.fullPath)
          this.$router.replace({ name: 'securityUserIndex' }).catch(()=>{});//把error 抛出来
        }
      })
    },
    fetchFormCallBack (res) {
      if (res.code === 200) {
        res.data.contentSecretIds = res.data.sysSecrets.filter(d => d.secretType === 1).map(d => d.id)
        res.data.annexSecretIds = res.data.sysSecrets.filter(d => d.secretType === 2).map(d => d.id)
        this.form.form = res.data
      }
    }
  },
  mounted () {
    const { id } = this.$route.query
    this.form.params.id = id
    this.fetchFormApi()
    this.FetchContentSecurityOptions()
    this.FetchAccessorySecurityOptions()
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
.security-user-detail-container{
  height: 100%;
  .el-container,
  .el-aside{
    height: 100%;
  }
  .el-aside{
    border: 1px solid #e8e8e8;
  }
}
</style>
