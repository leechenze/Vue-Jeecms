<template>
  <section class="d-release-platform d-checkbox-preview z-draggable-preview new-content">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :required="option.isRequired"
      :rules="getRules"
    >
      <el-checkbox-group v-model="val" class="z-checkbox-group">
        <el-checkbox v-for="(opt, index) in getOptions || []" :key="index" :label="opt.value">
          {{opt.label}}
        </el-checkbox>
      </el-checkbox-group>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import compoment from '@/components/draggable/NewContent/NewCustomComponents/Checkbox/NewDSimpleCheckboxPreview'
export default {
  name: 'NewDReleasePlatformPreview',
  extends: compoment
}
</script>
<style lang="scss">
  .d-release-platform.d-checkbox-preview.new-content{
    .z-checkbox-group{
      height: auto;
      .el-checkbox{
        margin-right: 40px;
      }
    }
  }
</style>
