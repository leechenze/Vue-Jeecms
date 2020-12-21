<template>
  <base-form
    class="d-image-upload-editor-container z-draggable-editor"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
    :rules="rules"
    label-suffix="："
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
  name: 'DDocumentEditor',
  mixins: [editorMixin],
  data () {
    return {
      formItems: [
        {
          prop: 'label',
          label: '字段名称',
          maxlength: 50
        },
        {
          prop: 'name',
          label: '标签名称',
          maxlength: 50
        },
        {
          prop: 'tip',
          label: '帮助信息',
          maxlength: 50
        },
        {
          prop: 'limit',
          label: '文档最大个数'
        },
        {
          prop: 'type',
          label: '限制文件类型',
          type: 'select',
          multiple: true,
          options: this.$enums.fileType
        },
        {
          prop: 'size',
          label: '单个文件大小不超过',
          type: 'slot',
          options: this.$enums.size
        },
        {
          prop: 'isRequired',
          label: '是否必填：',
          class: 'width',
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
        limit: [
          this.$rules.number()
        ],
        isRequired: [
          this.$rules.required()
        ],
        size: [
          this.$rules.float()
        ]
      }
    }
  }
}
</script>
