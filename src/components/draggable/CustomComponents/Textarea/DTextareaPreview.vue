<template>
  <section class="d-textarea-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <el-input
        type="textarea"
        v-model="val"
        :label="option.label"
        :placeholder="option.placeholder"
        :maxlength="option.isLengthLimit ? option.max : 249"
        :show-word-limit="option.isLengthLimit"
      ></el-input>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'DTextareaPreview',
  mixins: [previewMixin]
}
</script>

<style lang="scss">
.d-textarea-preview .el-form-item{
  .el-textarea {
      .el-textarea__inner{
        min-height: 80px!important;
      }
  }
}
</style>
