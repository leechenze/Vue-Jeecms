<template>
  <base-form
    ref="baseForm"
    class="d-multi-image-upload-editor-container z-draggable-editor"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
    :rules="rules"
    :popperAppendToBody='false'
  >
    <template #size="scope">
      <el-form-item class="size-wrap" style="marginBottom: 0" prop="size">
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
    <template #rules="scope">
      <div class="rules-wrap">
        <div class="rule-item">
          <el-checkbox v-model="scope.form.isLengthLimit" class="z-checkbox-single default">限制字数</el-checkbox>
          <div class="rule-item-length" v-if="scope.form.isLengthLimit">
            <el-form-item
              prop='max'
              style="marginBottom: 0"
            >
              <el-input-number
                v-model.number="scope.form.max"
                size="small"
                :min="1"
                :max="120"
              ></el-input-number>
              <span class="z-append-text">请输入1-120之间的整数</span>
            </el-form-item>
          </div>
        </div>
      </div>
    </template>
  </base-form>
</template>

<script>
import editorMixin from '@/components/draggable/Mixin/editorMixin'

export default {
  name: 'DMultiImageUploadEditor',
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
          prop: 'limit',
          label: '图片最大张数：',
          appendText: '(留空为不限制)'
        },
        {
          prop: 'imgSize',
          label: '图片建议宽高：',
          class: 'width',
          type: 'slot'
        },
        {
          prop: 'isImageDesc',
          label: '图片描述：',
          class: 'width',
          type: 'checkbox',
          options: [
            {
              value: true,
              label: '允许每张图片添加文字描述'
            }
          ]
        },
        {
          prop: 'rules',
          label: '填写限制：',
          type: 'slot',
          hiddenKey: 'isImageDesc',
          hiddenValue: true
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
        max: [
          this.$rules.number()
        ],
        limit: [
          this.$rules.number()
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
.d-multi-image-upload-editor-container{
  .image-size-wrap{
    display: flex;
    .text{
      padding: 0 3px;
      color: #666666;
    }
    .el-input{
      max-width: 65px;
    }
  }
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
