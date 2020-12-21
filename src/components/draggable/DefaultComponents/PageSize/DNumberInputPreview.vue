<template>
  <section class="d-number-input-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <el-input-number
        v-model="val"
        :min="option.min"
        :max="option.max"
      ></el-input-number>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'DNumberInputPreview',
  mixins: [previewMixin]
}
</script>
