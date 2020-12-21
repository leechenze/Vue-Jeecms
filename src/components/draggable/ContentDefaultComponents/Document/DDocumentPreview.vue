<template>
  <section class="d-document-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
      :required="option.isRequired"
    >
      <jee-file-upload
        v-bind="option"
        v-model="val"
        :enableType="enableType"
        :isSecret='false'
      ></jee-file-upload>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'DDocumentPreview',
  mixins: [previewMixin],
  computed: {
    enableType () {
      return this.option.type instanceof Array ? this.option.type.join(',') : ''
    },
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
