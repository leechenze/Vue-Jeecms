<template>
  <section class="d-sub-title-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <el-input
        v-model="val"
        :label="option.label"
        :placeholder="option.placeholder"
        :maxlength="option.isLengthLimit ? option.max : 120"
        :show-word-limit="option.isLengthLimit"
      ></el-input>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'DSubTitlePreview',
  mixins: [previewMixin]
}
</script>

<style lang="scss">
.d-sub-title-preview .el-form-item{
  .el-input{
    .el-input__suffix{
      line-height: normal;
      right: -5px;
    }
  }
  .el-form-item__error{
    padding-left: 20px;
    z-index: 1;
  }
}
</style>
