<template>
  <base-form
    class="d-level-editor-container z-draggable-editor"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
    :rules="rules"
    :options="{
      memberLevelOptions
    }"
    :popperAppendToBody='false'
  ></base-form>
</template>

<script>
import editorMixin from '@/components/draggable/Mixin/editorMixin'
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'DLevelEditor',
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
          prop: 'defaultValue',
          label: '默认值：',
          type: 'select',
          clearable: true,
          options: 'memberLevelOptions'
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
        },
        {
          prop: 'isSmsVerification',
          label: '注册时开启手机短信验证：',
          type: 'radio',
          options: this.$enums.boolYes,
          hiddenKey: 'isRegister',
          hiddenValue: true
        },
        {
          prop: 'isSmsFindPassword',
          label: '开启手机短信找回密码：',
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
        isRequired: [
          this.$rules.required()
        ],
        isRegister: [
          this.$rules.required()
        ],
        isSmsVerification: [
          this.$rules.required()
        ],
        isSmsFindPassword: [
          this.$rules.required()
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['memberLevelOptions'])
  },
  methods: {
    ...mapActions('vip', ['FetchMembersLevelOptions'])
  },
  mounted () {
    this.FetchMembersLevelOptions()
  }
}
</script>
