<template>
  <section class="d-multi-image-upload-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
      :required="option.isRequired"
    >
      <jee-multi-image-resource-upload
        v-bind="option"
        v-model="val"
        :uploadOption="option"
      ></jee-multi-image-resource-upload>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'DMultiImageUploadPreview',
  mixins: [previewMixin],
  computed: {
    getRules () {
      const { isRequired } = this.option
      let formItemRules = []
      if (isRequired) {
        formItemRules.push(this.$rules.requiredArray())
      }
      return formItemRules
    }
  }
}
</script>

<style lang="scss">
.d-multi-image-upload-preview.z-draggable-preview{
  >.el-form-item{
    padding-top: 2px;
  }
}
</style>
