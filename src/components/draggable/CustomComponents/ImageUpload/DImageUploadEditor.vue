<template>
  <base-form
    class="d-image-upload-editor-container z-draggable-editor"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
    :rules="rules"
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
    <template #imgSize="scope">
      <div class="image-size-wrap">
        <span class='text'>宽</span>
        <el-form-item prop='width' style="marginBottom: 0">
          <el-input v-model.number="scope.form.width" size="small" class="z-input-line"></el-input>
        </el-form-item>
        <span class='text'>PX，高</span>
        <el-form-item prop='height' style="marginBottom: 0">
          <el-input v-model.number="scope.form.height" size="small" class="z-input-line"></el-input>
        </el-form-item>
        <span class='text'>PX</span>
      </div>
    </template>
  </base-form>
</template>

<script>
import editorMixin from '@/components/draggable/Mixin/editorMixin'

export default {
  name: 'DImageUploadEditor',
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
          label: '限制图片类型：',
          type: 'select',
          multiple: true,
          options: this.$enums.imageType
        },
        {
          prop: 'size',
          label: '图片大小不超过：',
          type: 'slot',
          options: this.$enums.size
        },
        {
          prop: 'imgSize',
          label: '图片建议宽高：',
          type: 'slot'
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
        width: [
          this.$rules.number()
        ],
        height: [
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
.d-image-upload-editor-container{
  .image-size-wrap{
    display: flex;
    .text{
      padding: 0 10px;
      color: #666666;
    }
    .el-input{
      max-width: 65px;
    }
  }
}
</style>
