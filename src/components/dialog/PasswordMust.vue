<template>
  <section class="password-dialog-container">
    <form-dialog
      title="修改密码"
      ref="updateDialog"
      :loading="updateFormLoading"
      :form="updateForm"
      :rules="updateRules"
      :show-close="false"
      :formItems="updateFormItems"
      :buttons="updateButtons"
      :handleClose="handleClose"
      @handleConfirm="handleConfirmUpdate"
    ></form-dialog>
  </section>
</template>
<script>
import formDialog from '@/components/mixins/formDialog'
import { loginType } from '@/utils/index'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'PasswordMust',
  mixins: [formDialog],
  data () {
    var pswRepeat = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.updateForm.psw) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var passoword = async (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        let psw = await loginType(value)
        var params = {
          psw: psw,
          username: this.user.userName
        }
        await this.$request.fetchSysPwdUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data === true) {
              callback()
            } else {
              callback(new Error(res.message))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    var IsEqually = (rule, value, callback) => {
      if (value && value === this.updateForm.oldpsw) {
        callback(new Error('新密码与旧密码不允许相同'))
      } else {
        callback()
      }
    }
    var IsEqually2 = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        if (this.setting.attrs.passIsEqually === '0') {
          if (this.updateForm.psw === this.user.userName) {
            callback(new Error('密码与用户名不允许相同'))
          }
          callback()
        } else {
          callback()
        }
      }
    }
    return {
      updateFormLoading: false,
      updateRules: {
        oldpsw: [
          this.$rules.required()
        ],
        psw: [
          this.$rules.required(),
          { validator: passoword, trigger: 'blur' },
          { validator: IsEqually, trigger: 'blur' },
          { validator: IsEqually2, trigger: 'blur' }
        ],
        psw2: [
          this.$rules.required(),
          { validator: pswRepeat, trigger: 'blur' }
        ]
      },
      updateForm: {
        oldpsw: '',
        psw: '',
        psw2: ''
      },
      updateFormItems: [
        {
          prop: 'oldpsw',
          label: '原密码',
          type: 'password',
          maxlength: 50,
          placeholder: '请输入您的原密码'
        },
        {
          prop: 'psw',
          label: '密码',
          type: 'password',
          maxlength: 50,
          placeholder: '请输入您的密码'
        },
        {
          prop: 'psw2',
          label: '重复密码',
          type: 'password',
          maxlength: 50,
          placeholder: '请再次输入您的密码'
        }
      ],
      updateButtons: [
        {
          text: '保存',
          type: 'Submit'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['user', 'setting'])
  },
  watch: {
    'user.needChangePassword' (newData) {
      if (newData && !this.$refs.updateDialog.dialogVisible) {
        this.$refs.updateDialog.showDialog()
      }
    }
  },
  methods: {
    ...mapActions('app', ['SetNeedChangePassword']),
    showDialog () {
      this.$refs.updateDialog.showDialog()
    },
    handleClose (done) {
      this.$message.error('请修改密码')
    },
    async handleConfirmUpdate (data, btn) { // 密码重置
      this.updateFormLoading = true
      let params = {}
      params.oldpsw = await loginType(data.oldpsw)
      params.psw = await loginType(data.psw)
      await this.$request.fetchAdminPsw(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          console.log(this.updateButtons)
          this.SetNeedChangePassword()
          this.$emit('handleSubmit')
          this.updateFormLoading = false
        } else {
          this.$refs.updateDialog.showDialog()
          this.updateFormLoading = false
        }
      }).catch(() => {
      })
    }
  },
  mounted () {
    if (this.user.needChangePassword && !this.$refs.updateDialog.dialogVisible) {
      this.$refs.updateDialog.showDialog()
    }
  }
}
</script>
