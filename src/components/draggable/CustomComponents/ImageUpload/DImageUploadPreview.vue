<template>
  <section class="d-image-upload-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <jee-image-resource-upload
        v-bind="option"
        :uploadOption="option"
        :defaultUrl="defaultUrl"
        v-model="val"
      ></jee-image-resource-upload>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'DImageUploadPreview',
  mixins: [previewMixin],
  data () {
    return {
      defaultUrl: ''
    }
  },
  watch: {
    value: {
      handler (newData) {
        if (typeof newData === 'object' && newData.url) {
          this.defaultUrl = newData.url
        }
      },
      deep: true
    }
  },
  mounted () {
    if (typeof this.value === 'object' && this.value.url) {
      this.defaultUrl = this.value.url
    }
  }
}
</script>
<style lang="scss">
.d-image-upload-preview.z-draggable-preview{
  >.el-form-item{
    padding-top: 2px;
  }
}
</style>
