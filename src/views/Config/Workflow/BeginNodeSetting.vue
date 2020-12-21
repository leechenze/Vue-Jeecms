<template>
  <section class='begin-setting-container'>
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
  name: 'BeginNodeSetting',
  components: {
    BaseForm
  },
  props: {
    form: {
      type: Object,
      default: () => ({
        name: ''
      })
    }
  },
  data () {
    return {
      placeholder: '请输入节点名称',
      formItems: [
        {
          prop: 'name',
          label: '节点名称：',
          maxlength: 10
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
