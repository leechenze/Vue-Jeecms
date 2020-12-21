<template>
  <section class="d-checkbox-preview z-draggable-preview new-content"
    :class="{'d-checkbox-preview__horizontal': horizontal}">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="isValidator ? getMyRules : []"
      :required="option.isRequired"
      :class="{'sm-height': !option.isOtherOption}"
    >
      <el-checkbox-group v-model="form[option.name].value" class="z-checkbox-group">
        <el-checkbox v-for="(opt, index) in getOptions || []" :key="index" :label="opt.value">
          {{opt.label}}
        </el-checkbox>
        <el-checkbox :label="option.otherOption.value" v-if="option.isOtherOption" class="radio-other-option">
          {{option.otherOptionLabel}}
          <el-form-item label-width="0" class="t-inline">
            <el-input size="small"  class="line" :style="{width: '120px', marginLeft: '10px'}" v-model="form[option.name].otherValue" :maxlength="10"></el-input>
          </el-form-item>
        </el-checkbox>
      </el-checkbox-group>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'NewDCheckboxPreview',
  mixins: [previewMixin],
  props: {
    value: {
      type: Object,
      default: () => ({
        value: [],
        otherValue: ''
      })
    },
    horizontal: {
      type: Boolean,
      default: true
    }
  },
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
  },
  methods: {
    otherOptionValidator (rule, value, callback) {
      if (value && (value.value || []).includes(this.option.otherOption.value)) {
        if (value.otherValue) {
          callback()
        } else {
          callback(new Error('请输入其他选项'))
        }
      } else {
        callback()
      }
    }
  }
}
</script>
<style lang="scss">
.d-checkbox-preview.new-content{
  >.el-form-item{
    padding-bottom:10px;
    &__label{
      margin-bottom: 18px;
    }
  }
  .el-checkbox-group{
    width:100%;
    height: auto;
    .el-checkbox{
      padding-bottom:10px;
      min-height: 35px;
      margin-right: 40px;
      .el-checkbox__inner{
        border-color: #ccc;
      }
    }
  }
  .z-checkbox-group.el-checkbox-group{
      margin-bottom: 0;
    .el-checkbox{
      padding-bottom: 0px;
    }
  }
  &.d-checkbox-preview__horizontal{
    .z-checkbox-group.el-checkbox-group{
      .el-checkbox{
        min-height: 35px;
        padding-bottom: 0px;
      }
    }
  }
}
.content-block-right .d-checkbox-preview.new-content{
  &.z-draggable-preview > .el-form-item{
    padding-bottom: 10px !important;
    .el-checkbox-group .el-checkbox{
      margin-right: 40px;
      padding-bottom: 0px;
      line-height: 32px !important;
      height: auto;
      &.radio-other-option{
        // display: inline-block;
        .el-checkbox__label{
          line-height: 32px !important;
          display: inline;
        }
      }
    }
  }
}
</style>
