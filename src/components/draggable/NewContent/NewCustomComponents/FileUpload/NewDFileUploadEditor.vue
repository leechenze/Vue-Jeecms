<template>
  <base-form
    class="d-file-upload-editor-container z-draggable-editor"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
    :rules="rules"
    label-position="top"
    :popperAppendToBody='false'
  >
    <template #size="scope">
      <el-form-item class="size-wrap" style="margin-bottim: 0" prop="size">
        <el-input
          class="jee-input-append-select"
          v-model.number="scope.form.size">
          <el-select popper-class="jee-border"
            :popper-append-to-body="false"
            slot="append" v-model="scope.form.unit" placeholder="请选择">
            <el-option
              v-for="item in scope.item.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-input>
        <span class="z-append-text">(留空表示不限制)</span>
      </el-form-item>
    </template>
  </base-form>
</template>

<script>
import editorMixin from '@/components/draggable/Mixin/editorMixin'

export default {
  name: 'NewDFileUploadEditor',
  mixins: [editorMixin],
  data () {
    return {
      labelWidth: '125px',
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
          prop: 'limit',
          label: '附件最大个数：',
          appendText: '(留空为不限制)'
        },
        {
          prop: 'typeLimit',
          label: '限制附件类型：',
          type: 'select',
          options: this.$enums.fileTypeLimit
        },
        {
          prop: 'enableType',
          label: '',
          placeholder: '多个附件类型以逗号隔开',
          hiddenKey: 'typeLimit',
          hiddenValue: 2
        },
        {
          prop: 'disableType',
          label: '',
          placeholder: '多个附件类型以逗号隔开',
          hiddenKey: 'typeLimit',
          hiddenValue: 3
        },
        {
          prop: 'size',
          label: '单个大小不超过：',
          type: 'slot',
          options: this.$enums.size
        },
        {
          prop: 'isRequired',
          label: '是否必填：',
          type: 'radio',
          class: 'width',
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
        limit: [
          this.$rules.number()
        ],
        size: [
          this.$rules.float()
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
.d-file-upload-editor-container{
  .el-form-item{
    .append-text{
      display: block;
      line-height: 12px;
      padding-top: 10px;
      padding-left: 0;
      color: #999999;
    }
  }
}
</style>
