<template>
  <section class="d-radio-preview z-draggable-preview new-content">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :required="option.isRequired"
      :rules="getRules"
    >
      <el-radio-group v-model="val">
        <el-radio style="line-height: 40px;" v-for="(opt, index) in getOptions || []" :key="index" :label="opt.value">
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
  name: 'NewDSimpleRadioPreview',
  mixins: [previewMixin],
  props: {
    value: {
      type: [Number, String],
      default: ''
    }
  }
}
</script>

<style lang="scss">
.d-radio-preview.new-content{
  &.z-draggable-preview > .el-form-item{
    .el-form-item__content{
      line-height: 32px;
    }
    .el-radio-group .el-radio{
      padding-bottom: 0px;
      line-height: 32px !important;
      height: auto;
    }
  }
}
// 左边区域单选
.content-block-left .d-radio-preview.new-content{
  &.z-draggable-preview{
    padding: 11px 0;
    > .el-form-item{
      padding: 0px !important;
    }
  }
}
</style>
