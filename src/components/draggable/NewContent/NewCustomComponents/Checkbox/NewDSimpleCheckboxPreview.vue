<template>
  <section class="d-checkbox-preview z-draggable-preview new-content">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :required="option.isRequired"
      :rules="isValidator ? getMyRules : []"
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
  name: 'NewDSimpleCheckboxPreview',
  mixins: [previewMixin],
  computed: {
    getMyRules () {
      const requiredRule = {
        validator: (rule, value, callback) => {
          if (value && value.value instanceof Array && value.value.length) {
            callback()
          } else {
            callback(new Error('此项必填'))
          }
        },
        trigger: ['blur', 'change']
      }
      let rules = this.getRules
      if (this.option.isRequired) rules.push(requiredRule)
      return rules
    }
  }
}
</script>
