<template>
  <section class="d-link-preview z-draggable-preview">
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
          :maxlength="option.isLengthLimit ? option.max : 120"
        ></el-input>
      </el-form-item>
      <el-checkbox v-model="form[option.name].isNewTarget" class="z-checkbox-single default">
        {{option.selectLabel}}
      </el-checkbox>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'DContentOutsideLinkPreview',
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

<style lang="scss">
.d-link-preview .el-form-item{
  .el-form-item{
    margin-bottom: 10px!important;
  }
  .el-checkbox{
    display: block;
    height: 14px;
    line-height: 14px;
  }
}
</style>
