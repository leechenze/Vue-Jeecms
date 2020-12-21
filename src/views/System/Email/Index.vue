<template>
  <div class="system-setting-container">
    <base-header v-bind="headers"/>
    <base-form
      v-bind="form"
      v-on:handleConfirm="handleConfirm"
      v-on:handleConfirmVerify="handleConfirmVerify"
    ></base-form>
    <form-dialog class="email-dialog"
      ref="addDialog"
      :buttons='dialogBtn'
      :loading="addFormLoading"
      :form="addForm"
      :title="dialogTitle"
      :rules="addRules"
      :formItems="addFormItems"
      v-on:handleConfirm="handleConfirmAdd"
    ></form-dialog>
  </div>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import formDialog from '@/components/mixins/formDialog'
import {
  mapActions
} from 'vuex'
export default {
  name: 'email',
  mixins: [baseHeader, baseForm, formDialog],
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '选择统一使用后，需要填写统一的配置信息，在站点配置的邮件服务那里只能查看此配置信息不可再编辑；选择否，不需要填写配置信息，在站点配置的邮件服务那里需要用户去填写自身的配置；'
      },
      form: {
        api: 'fetchEmailDetail',
        labelWidth: '236px',
        showSubmitButton: true,
        submitBtns: [
          {
            text: '保存',
            subType: 'submit',
            disabled: !this._checkPermission('/email', 'POST')
          },
          {
            text: '邮箱检验',
            subType: 'Verify',
            hiddenFunc (form) {
              return form.isGloable && form.isEnable
            },
            disabled: !this._checkPermission('/email/calibration', 'POST')
          }
        ],
        form: {
          isEnable: true,
          isGloable: true,
          id: '',
          smtpService: '',
          smtpPort: '',
          emailName: '',
          emailPassword: '',
          isSsl: true
        },
        formItems: [
          {
            prop: 'isEnable',
            label: '是否开启邮件服务：',
            type: 'radio',
            options: this.$enums.boolYes
          },
          {
            prop: 'isGloable',
            label: '是否全站群统一使用：',
            type: 'radio',
            options: this.$enums.boolYes,
            hiddenKey: 'isEnable',
            hiddenValue: true
          },
          {
            prop: 'smtpService',
            label: 'SMTP服务器：',
            placeholder: '请输入SMTP服务器',
            hiddenFunc: (item) => item.isEnable && item.isGloable,
            appendText: '设置 SMTP 邮件服务器主机地址，不推荐使用QQ个人邮箱'
          },
          {
            prop: 'smtpPort',
            label: 'SMTP端口：',
            placeholder: '请输入SMTP端口',
            hiddenFunc: (item) => item.isEnable && item.isGloable,
            appendText: '邮件服务器端口，25默认http协议，465默认为https协议，推荐使用465',
            maxlength: 50
          },
          {
            prop: 'emailName',
            label: '发件账号：',
            placeholder: '请输入发件账号',
            hiddenFunc: (item) => item.isEnable && item.isGloable,
            maxlength: 150
          },
          {
            prop: 'emailPassword',
            label: '邮箱密码：',
            placeholder: '请输入邮箱密码',
            hiddenFunc: (item) => item.isEnable && item.isGloable,
            appendText: '一般为验证邮箱密码，如果使用网易邮箱，请填写授权码',
            'show-password': true,
            autocomplete: 'new-password',
            maxlength: 50
          },
          {
            prop: 'isSsl',
            label: '是否使用SSL协议：',
            type: 'radio',
            options: this.$enums.boolYes,
            hiddenFunc: (item) => item.isEnable && item.isGloable
          }
        ],
        rules: {
          isEnable: [this.$rules.required()],
          isGloable: [this.$rules.required()],
          smtpService: [this.$rules.required(), this.$rules.max(255)],
          smtpPort: [this.$rules.required(), this.$rules.number(), this.$rules.rangeNum(1, 65535)],
          emailName: [this.$rules.required(), this.$rules.email()],
          emailPassword: [this.$rules.required(), this.$rules.max(50)]
        }
      },
      addFormLoading: false,
      addForm: {
        toAddress: ''
      },
      addRules: {
        toAddress: [this.$rules.required(), this.$rules.email(), this.$rules.max(50)]
      },
      addFormItems: [
        {
          prop: 'toAddress',
          label: '收件邮箱',
          placeholder: '请输入收件邮箱'
        }
      ],
      dialogTitle: '邮箱检验',
      dialogBtn: [{ text: '发送', type: 'Submit' }]
    }
  },
  methods: {
    ...mapActions('system', ['FetchEmailDetail']),
    handleConfirm (data) {
      this.$request.fetchEmailUpdate(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.FetchEmailDetail()
        }
      }).catch()
    },
    handleConfirmVerify () {
      this.$refs.addDialog.showDialog()
    },
    handleConfirmAdd (data) {
      data.smtpService = this.form.form.smtpService
      data.smtpPort = this.form.form.smtpPort
      data.emailName = this.form.form.emailName
      data.emailPassword = this.form.form.emailPassword
      data.isSsl = this.form.form.isSsl
      this.$request.fetchEmailTest(data).then(res => {
        if (res.code === 200) {
          if (res.data === 0) {
            this.$message({
              message: '发送成功',
              type: 'success'
            })
          } else if (res.data === 1) {
            this.$message({ message: '发送失败', type: 'warning' })
          } else if (res.data === 2) {
            this.$message.error('非法邮箱')
          }
        }
      })
    }
  },
  created () {
    this.$request.fetchEmailDetail().then(res => {
      if (res.code === 200) {
        this.form.form = res.data
      }
    })
  },
  handleHeaderCreate () {
    this.$refs.addDialog.showDialog()
  }
}
</script>

<style lang="scss" scoped>
.system-setting-container{
  font-size: 16px;
  header{
    padding-bottom: 20px;
    span{
      padding-right: 10px;
    }
  }
  .el-alert{
    margin-bottom: 20px;
  }

}
.email-dialog .el-dialog__header .el-dialog__title{
    font-size: 14px;
  }
</style>
