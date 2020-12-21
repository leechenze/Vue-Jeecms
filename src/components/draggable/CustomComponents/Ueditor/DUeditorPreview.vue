<template>
  <section class="d-ueditor-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <div style="border:1px solid #e8e8e8">
        <u-editor
          ref='editor'
          v-model="val"
          :options="{initialFrameHeight: 500}"
        ></u-editor>
      </div>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
import UEditor from '@/components/editor/UEditor'

export default {
  name: 'DUeditorPreview',
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
