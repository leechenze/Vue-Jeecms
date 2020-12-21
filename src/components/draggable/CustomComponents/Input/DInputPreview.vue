<template>
  <section class="d-input-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <el-input
        autocomplete='new-password'
        v-model="val"
        :label="option.label"
        :placeholder="option.placeholder"
        :maxlength="option.isLengthLimit ? option.max : 120"
        :disabled="option.disabled"
        :type="inputType"
      ></el-input>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'DInputPreview',
  mixins: [previewMixin],
  data () {
    return {
      inputType: 'text'
    }
  }
}
</script>
