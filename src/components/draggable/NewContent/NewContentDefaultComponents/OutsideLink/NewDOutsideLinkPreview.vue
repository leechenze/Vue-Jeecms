<template>
  <section class="d-link-preview z-draggable-preview new-link-preview new-content">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
      :required="option.isRequired"
    >
      <el-form-item
        label-width="0"
        :prop="`${option.name}.outLink`"
        :rules="getRules"
      >
        <el-input
          v-model="form[option.name].outLink"
          :label="option.label"
          :placeholder="option.placeholder"
          :maxlength="120"
        ></el-input>
      </el-form-item>
      <el-checkbox v-model="form[option.name].isNewTarget" >
        {{option.selectLabel}}
      </el-checkbox>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'NewDOutsideLinkPreview',
  mixins: [previewMixin],
  computed: {
    getRules () {
      const { isRequired, isInputLimit, inputLimit, rules } = this.option
      let formItemRules = []
      if (isRequired) {
        formItemRules.push(this.$rules.required())
      }
      if (isInputLimit && inputLimit) {
        formItemRules.push(this.$rules[inputLimit]())
      }
      if (rules instanceof Array && rules.length) {
        rules.forEach(r => {
          const { rule, params = [] } = r
          if (rule) formItemRules.push(this.$rules[rule](...params))
        })
      }
      return formItemRules
    }
  }
}
</script>
