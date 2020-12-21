<template>
  <section class="d-ueditor-preview z-draggable-preview new-content">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <u-editor
        ref='editor'
        v-model="val"
      ></u-editor>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
import UEditor from '@/components/editor/UEditor'

export default {
  name: 'NewDUeditorPreview',
  mixins: [previewMixin],
  components: {
    UEditor
  },
  watch: {
    val (newVal) {
      console.log(newVal)
    }
  }
}
</script>
