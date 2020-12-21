<template>
  <base-form
    class="d-textarea-editor-container z-draggable-editor"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
    :rules="rules"
    :popperAppendToBody='false'
  >
    <template #rules="scope">
      <div class="rules-wrap">
        <div class="rule-item">
          <el-checkbox v-model="scope.form.isLengthLimit" class="z-checkbox-single limit default">限制字数</el-checkbox>
          <div class="rule-item-length"
              v-if="scope.form.isLengthLimit"
          >
            <el-form-item
              prop='max'
              style="marginBottom: 0"
            >
              <el-input-number
                v-model.number="scope.form.max"
                size="small"
                :min="1"
                :max="249"
              ></el-input-number>
              <span class="z-append-text">请输入1-249之间的整数</span>
            </el-form-item>
          </div>
        </div>
        <div class="rule-item">
          <el-checkbox v-model="scope.form.isInputLimit" class="z-checkbox-single default">输入限制</el-checkbox>
          <div class="rule-item-input">
            <el-select
              v-if="scope.form.isInputLimit"
              v-model="scope.form.inputLimit"
              popper-class="jee-border"
              size="small"
              :popper-append-to-body="false"
              placeholder="请选择">
              <el-option
                v-for="item in scope.item.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </template>
  </base-form>
</template>

<script>
import editorMixin from '@/components/draggable/Mixin/editorMixin'

export default {
  name: 'DTextareaEditor',
  mixins: [editorMixin],
  data () {
    return {
      labelWidth: 'auto',
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
          prop: 'rules',
          label: '填写限制：',
          type: 'slot',
          options: this.$enums.rulesMap
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
        isRequired: [
          this.$rules.required()
        ],
        max: [
          this.$rules.number(),
          this.$rules.rangeNum(1, 249)
        ],
        isRegister: [
          this.$rules.required()
        ]
      }
    }
  }
}
</script>
