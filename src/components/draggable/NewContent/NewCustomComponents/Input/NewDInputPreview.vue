<template>
  <section class="d-input-preview z-draggable-preview new-content">
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
      <div class="ban-box" @click="banClick(option.label)" v-show="banShow" v-html="banVal"></div>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'NewDInputPreview',
  mixins: [previewMixin],
  data () {
    return {
      inputType: 'text'
    }
  }
}
</script>

<style scoped lang="scss">
.d-input-preview.new-content{
  /deep/ .el-form-item {
    .el-input {
      .el-input__inner {
        padding-right: 0!important;
      }
    }
  }
}
</style>
