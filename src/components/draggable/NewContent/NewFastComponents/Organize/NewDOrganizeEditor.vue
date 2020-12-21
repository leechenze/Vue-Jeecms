<template>
  <base-form
    class="d-organize-editor-container z-draggable-editor"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
    :rules="rules"
    :popperAppendToBody='false'
  ></base-form>
</template>

<script>
import editorMixin from '@/components/draggable/Mixin/editorMixin'

export default {
  name: 'NewDOrganizeEditor',
  mixins: [editorMixin],
  data () {
    return {
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
          prop: 'tip',
          label: '帮助信息：',
          maxlength: 50
        },
        {
          prop: 'isIncludeVirtual',
          label: '是否包含虚拟组织：',
          type: 'radio',
          options: this.$enums.boolYes
        },
        {
          prop: 'isRequired',
          label: '是否必填：',
          type: 'radio',
          options: this.$enums.boolYes
        },
        {
          prop: 'isRegister',
          label: '应用到会员注册：',
          type: 'radio',
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
        isIncludeVirtual: [
          this.$rules.required()
        ],
        isRequired: [
          this.$rules.required()
        ],
        isRegister: [
          this.$rules.required()
        ]
      }
    }
  }
}
</script>

<style lang="scss">
.d-organize-editor-container.z-draggable-editor{
  .form-item-wrap{
    .el-form-item__content{
      margin-left: 0 !important;
    }
    .el-form-item__label-wrap{
      // margin-bottom: 9px;
      margin-left: 0 !important;
    }
    .el-input__inner{
      margin-top: 9px;
    }
  }
}
</style>
