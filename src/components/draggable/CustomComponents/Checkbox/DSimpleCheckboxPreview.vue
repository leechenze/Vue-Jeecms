<template>
  <section class="d-checkbox-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
      class='sm-height'
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
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'DSimpleCheckboxPreview',
  mixins: [previewMixin]
}
</script>
