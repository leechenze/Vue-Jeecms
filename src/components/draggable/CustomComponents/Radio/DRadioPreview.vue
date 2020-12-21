<template>
  <section class="d-radio-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="isValidator? getMyRules : []"
      :required="option.isRequired"
      :class="{'sm-height': !option.isOtherOption}"
    >
      <el-radio-group v-model="form[option.name].value">
        <el-radio v-for="(opt, index) in getOptions || []" :key="index" :label="opt.value">
          {{opt.label}}
        </el-radio>
        <el-radio :label="option.otherOption.value" v-if="option.isOtherOption" class="radio-other-option">
          {{option.otherOptionLabel}}
          <el-form-item label-width="0"  class="t-inline">
            <el-input size="small" class="line" :style="{width: '120px', marginLeft: '10px'}" v-model="form[option.name].otherValue" :maxlength="10"></el-input>
          </el-form-item>
        </el-radio>
      </el-radio-group>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'DRadioPreview',
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
.d-radio-preview{
  &.z-draggable-preview > .el-form-item{
    padding-bottom: 5px;
    .el-radio-group .el-radio{
      padding-bottom: 10px;
    }
  }
}
</style>
