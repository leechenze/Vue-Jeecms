<template>
  <section class="d-radio-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
      class="sm-height"
    >
      <el-radio-group v-model="val">
        <el-radio v-for="(opt, index) in getOptions || []" :key="index" :label="opt.value">
          {{opt.label}}
        </el-radio>
      </el-radio-group>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'DSimpleRadioPreview',
  mixins: [previewMixin]
}
</script>

<style lang="scss">
.d-radio-preview{
  &.z-draggable-preview > .el-form-item{
    padding-bottom: 5px;
    .el-radio-group .el-radio{
      padding-bottom: 10px;
    }
  }
}
</style>
