<template>
  <section class="d-video-upload-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <jee-video-resource-upload
        v-bind="option"
        v-model="val"
        :uploadOption="option"
      ></jee-video-resource-upload>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'DVideoUploadPreview',
  mixins: [previewMixin]
}
</script>

<style lang="scss">
.d-video-upload-preview.z-draggable-preview{
  >.el-form-item{
    padding-top: 2px;
  }
}
</style>
