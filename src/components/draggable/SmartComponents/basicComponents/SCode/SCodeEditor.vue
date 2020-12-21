<template>
  <base-form
    class="s-code-editor-container s-draggable-editor"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
    :rules="rules"
    :lineShow="true"
    label-position="top"
    :popperAppendToBody='false'
  >
  </base-form>
</template>

<script>
import editorMixin from '@/components/draggable/Mixin/editorMixin'

export default {
  name: 'SCodeEditor',
  mixins: [editorMixin],
  data () {
    return {
      formItems: [
        {
          prop: 'label',
          label: '字段名称：',
          maxlength: 15
        },
        {
          prop: 'placeholder',
          label: '默认提示文字：',
          maxlength: 50
        },
        {
          prop: 'tip',
          label: '帮助信息：',
          maxlength: 50
        },
        {
          prop: 'isRequired',
          label: '是否必填：',
          type: 'text',
          class: 'width',
          options: this.$enums.boolYes
        }
      ],
      rules: {
        label: [
          this.$rules.required()
        ],
        name: [
          this.$rules.enNumLine(),
          this.$rules.required()
        ],
        isRequired: [
          this.$rules.required()
        ]
      }
    }
  },
  methods: {
    // 判断是否有限制输入
    handleChangeInputLimit () {
      // 如没有，则情况限制条件
      if (!this.value.isInputLimit) {
        this.value.rules = []
        this.$emit('input', this.value)
      }
    }
  }
}
</script>
