<template>
  <section class='action-setting-container'>
    <base-form
      ref='form'
      label-width="140px"
      :form="form"
      :formItems="getFormItems"
      :rules="rules"
      :options="{
        actionOptions: getActions
      }"
      :showSubmitButton='false'
      :popperAppendToBody='false'
    >
      <template #reasonOpen="scope">
        <div class='reason-wrap'>
          <el-checkbox v-model="scope.form.reasonOpen">输入意见</el-checkbox>
          <el-checkbox v-model="scope.form.reasonMust" v-if="scope.form.reasonOpen">是否必填</el-checkbox>
        </div>
      </template>
    </base-form>
  </section>
</template>
<script>
import BaseForm from '@/components/form/BaseForm'

export default {
  name: 'ActionSetting',
  components: {
    BaseForm
  },
  props: {
    form: {
      type: Object,
      default: () => ({
        id: '',
        name: '',
        actionCode: '',
        reasonOpen: false,
        reasonMust: false,
        allowRevoke: true,
        infoNotify: true,
        mailNotify: false,
        smsNotify: false,
        autoRevoke: false,
        autoRevokeHour: 10,
        overtimeReminder: false,
        reminderBegin: 10,
        reminderInterval: 10
      })
    },
    hiddenAllowRevoke: {
      type: Boolean,
      default: false
    },
    actions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      rules: {
        name: [
          this.$rules.required()
        ],
        actionCode: [
          this.$rules.required()
        ],
        autoRevokeHour: [
          this.$rules.number()
        ],
        reminderBegin: [
          this.$rules.number()
        ],
        reminderInterval: [
          this.$rules.number()
        ]
      }
    }
  },
  computed: {
    getFormItems () {
      const hiddenReason = (form) => {
        if (form.actionCode) {
          return true
        }
        return false
      }
      const hiddenAllowRevoke = () => {
        return !this.hiddenAllowRevoke
      }
      return [
        {
          prop: 'name',
          label: '动作名称：',
          maxlength: 10
        },
        {
          prop: 'actionCode',
          label: '动作类型：',
          type: 'select',
          clearable: true,
          options: 'actionOptions'
        },
        {
          prop: 'reasonOpen',
          label: '',
          hidden: hiddenReason,
          class: 'sm-height',
          type: 'slot'
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
          hidden: hiddenReason,
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
          hidden: hiddenReason,
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
          hidden: hiddenReason,
          options: [
            {
              value: false,
              label: '短信通知'
            }
          ]
        },
        {
          prop: 'autoRevoke',
          label: '开启超时自动驳回：',
          hiddenKey: 'actionCode',
          hiddenValue: 'disagree',
          type: 'switch',
          enableText: '开启'
        },
        {
          prop: 'autoRevokeHour',
          label: '流转时长（小时）：',
          type: 'number',
          min: 1,
          max: 120,
          popoverText: '设置该节点的流转时长；只能输入0~120之间的正整数；',
          popoverWidth: '160',
          hiddenKeys: ['actionCode', 'autoRevoke'],
          hiddenValues: ['disagree', true]
        },
        {
          prop: 'overtimeReminder',
          label: '开启超时提醒：',
          type: 'switch',
          hiddenKeys: ['actionCode', 'autoRevoke'],
          hiddenValues: ['disagree', true],
          enableText: '开启'
        },
        {
          prop: 'reminderBegin',
          label: '提醒时间（小时）：',
          type: 'number',
          min: 1,
          max: 120,
          popoverText: '从流转到该节点后第几个小时开始提醒；只能输入0~120之间的正整数；',
          popoverWidth: '160',
          hiddenKeys: ['actionCode', 'autoRevoke', 'overtimeReminder'],
          hiddenValues: ['disagree', true, true]
        },
        {
          prop: 'reminderInterval',
          label: '提醒间隔（小时）：',
          type: 'number',
          min: 1,
          max: 120,
          popoverText: '每隔几个小时提醒一次；只能输入0~120之间的正整数；',
          popoverWidth: '160',
          hiddenKeys: ['actionCode', 'autoRevoke', 'overtimeReminder'],
          hiddenValues: ['disagree', true, true]
        }
      ]
    },
    getActions () {
      return (this.form.actionOptions || []).map(d => {
        if (this.actions instanceof Array && this.actions.find(code => code === d.value)) {
          d.disabled = true
        }
        if (this.hiddenAllowRevoke && !['agree', 'disagree'].includes(d.value)) {
          d.disabled = true
        }
        return d
      })
    }
  }
}
</script>

<style lang="scss">
.action-setting-container{
  .el-form{
    .form-item-wrap{
      .el-form-item.notify{
        margin-bottom: 20px;
      }
    }
  }
}
</style>
