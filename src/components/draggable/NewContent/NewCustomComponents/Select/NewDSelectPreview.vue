<template>
  <section class="d-select-preview z-draggable-preview new-content">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="isValidator ? getMyRules : []"
      :required="option.isRequired"
    >
      <el-select
        v-model="form[option.name].value"
        popper-class="jee-border"
        placeholder='请选择'
        clearable
        :popperAppendToBody='false'
      >
        <el-option
          v-for="opt in getOptions || []"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value">
        </el-option>
      </el-select>
      <el-form-item label-width="0" :style="{marginBottom: 0, display: 'inline-block'}"
        v-if="option.isOtherOption && option.otherOption.value === value.value"
      >
        <el-input class="line" :style="{width: '120px', marginLeft: '10px'}"  v-model="form[option.name].otherValue" :maxlength="10"></el-input>
      </el-form-item>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'NewDSelectPreview',
  mixins: [previewMixin],
  props: {
    value: {
      type: Object,
      default: () => ({
        value: '',
        otherValue: ''
      })
    }
  },
  computed: {
    getOptions () {
      let options = [...this.option.options]
      if (this.option.isOtherOption) {
        options.push(this.option.otherOption)
      }
      return options
    },
    getMyRules () {
      const requiredRule = {
        validator: (rule, value, callback) => {
          if (value && value.value) {
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
<style lang="scss">
  .widget-view.edit .d-select-preview{
    .el-form-item{
      .el-form-item__content{
        position: relative;
      }
    }
  }
</style>
