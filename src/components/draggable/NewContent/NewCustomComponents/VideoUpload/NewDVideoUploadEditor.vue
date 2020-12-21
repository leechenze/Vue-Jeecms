<template>
  <base-form
    class="d-video-upload-editor-container z-draggable-editor"
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
  name: 'NewDVideoUploadEditor',
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
          prop: 'type',
          label: '限制视频类型：',
          type: 'select',
          multiple: true,
          options: this.$enums.videoType
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
