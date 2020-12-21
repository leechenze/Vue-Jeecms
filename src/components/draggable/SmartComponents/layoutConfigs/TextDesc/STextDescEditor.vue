<template>
  <base-form
    class="s-text-desc-editor-container s-draggable-editor"
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
  <template #fontStyle="scope">
    <set-font-config v-model="scope.form.fontStyle"></set-font-config>
  </template>
  </base-form>
</template>

<script>
import setFontConfig from '@/views/Interact/Smart/detailComponents/setFontConfig'
import editorMixin from '@/components/draggable/Mixin/editorMixin'
var options = [
  { label: '左对齐 ', value: 1 },
  { label: '居中对齐 ', value: 2 },
  { label: '右对齐 ', value: 3 }
]
export default {
  name: 'STextDescEditor',
  mixins: [editorMixin],
  components: {
    setFontConfig
  },
  data () {
    return {
      options,
      formItems: [
        {
          prop: 'label',
          label: '文本内容：',
          maxlength: 150,
          type: 'textarea',
          autosize: { minRows: 3 },
          placeholder: '请输入内容'
        },
        {
          prop: 'fontStyle',
          label: '文字：',
          type: 'slot'
        },
        {
          prop: 'width',
          label: '组件宽度(%)：',
          type: 'number',
          class: 'width',
          step: 10,
          max: 100,
          min: 10
        },
        {
          prop: 'titleAilgn',
          label: '对齐方式：',
          type: 'radio',
          class: 'label-20',
          options: options
        }
      ],
      rules: {
      }
    }
  }
}
</script>

<style lang="scss">
  .s-text-desc-editor-container{
    .label-20{
      .el-form-item__label{
        padding-bottom: 15px !important;
      }
    }
    .el-form-item{
      .el-textarea{
        .el-textarea__inner{
          line-height: 1.5 !important;
        }
      }
    }
  }
</style>
