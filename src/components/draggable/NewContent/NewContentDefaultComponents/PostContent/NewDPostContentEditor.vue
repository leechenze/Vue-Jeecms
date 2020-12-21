<template>
  <base-form
    class="d-postcontent-editor-container z-draggable-editor new-content"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
    :rules="rules"
    label-position="left"
    :popperAppendToBody='false'
  ></base-form>
</template>

<script>
import editorMixin from '@/components/draggable/Mixin/editorMixin'

export default {
  name: 'DPostContentEditor',
  mixins: [editorMixin],
  data () {
    return {
      labelWidth: '72px',
      formItems: [
        {
          prop: 'label',
          label: '字段名称：',
          maxlength: 50
        },
        {
          prop: 'name',
          label: '标签名称：',
          maxlength: 50
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
          type: 'radio',
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
  }
}
</script>
<style lang="scss">
  .d-postcontent-editor-container.z-draggable-editor.new-content{
    .el-form-item{
      .el-form-item__content{
        margin-left: 0 !important;
      }
    }
    .form-item-wrap:nth-child(3){
      .el-form-item__label{
        width: 100px !important;
      }
    }
    .form-item-wrap:nth-child(5){
      .el-form-item__label{
        width: 85px !important;
      }
    }
  }
</style>
