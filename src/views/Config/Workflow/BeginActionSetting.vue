<template>
  <section class='begin-action-setting-container'>
    <base-form
      ref='form'
      label-width="auto"
      :form="form"
      :formItems="formItems"
      :rules="rules"
      :showSubmitButton='false'
    ></base-form>
  </section>
</template>
<script>
import BaseForm from '@/components/form/BaseForm'

export default {
  name: 'BeginActionSetting',
  components: {
    BaseForm
  },
  props: {
    form: {
      type: Object,
      default: () => ({
        id: '',
        name: '',
        allowRevoke: true,
        infoNotify: true,
        mailNotify: false,
        smsNotify: false
      })
    },
    hiddenAllowRevoke: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const hiddenAllowRevoke = () => {
      return !this.hiddenAllowRevoke
    }
    return {
      formItems: [
        {
          prop: 'name',
          label: '动作名称：',
          placeholder: '请输入动作名称',
          maxlength: 10
        },
        {
          prop: 'allowRevoke',
          label: '允许撤回：',
          type: 'switch',
          popoverText: '任务在发送给下一个办理人之后，发现任务发送错误了，此时在下一个办理人还没有办理之前，可以撤回当前任务',
          popoverWidth: '160',
          hidden: hiddenAllowRevoke
        },
        {
          prop: 'infoNotify',
          label: '通知下一步处理人：',
          type: 'checkbox',
          class: 'notify',
          options: [
            {
              value: true,
              label: '站内消息通知'
            }
          ]
        },
        {
          prop: 'mailNotify',
          label: '',
          type: 'checkbox',
          class: 'notify',
          popoverText: '若用户未录入邮箱信息或邮箱信息错误，邮件将不能正常发送；为保证此功能正常使用，请确认邮件服务已开启；',
          popoverWidth: '160',
          options: [
            {
              value: false,
              label: '邮件通知'
            }
          ]
        },
        {
          prop: 'smsNotify',
          label: '',
          type: 'checkbox',
          popoverText: '若用户未录入手机信息或手机信息错误，短信将不能正常发送；为保证此功能正常使用，请确认手机短信服务已开启',
          popoverWidth: '160',
          options: [
            {
              value: false,
              label: '短信通知'
            }
          ]
        }
      ],
      rules: {
        name: [
          this.$rules.required()
        ]
      }
    }
  }
}
</script>

<style lang="scss">
.begin-action-setting-container{
  .el-form{
    .form-item-wrap{
      .el-form-item.notify{
        margin-bottom: 20px;
      }
    }
  }
}
</style>
