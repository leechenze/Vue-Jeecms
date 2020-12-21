<template>
  <section class="d-radio-preview z-draggable-preview new-content">
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
          <el-form-item label-width="0" class="t-inline">
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
  name: 'NewDRadioPreview',
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
.d-radio-preview.new-content{
  .el-radio-group{
    width: 100%;
  }
  /deep/ &.z-draggable-preview > .el-form-item{
    padding-bottom:0;
    &__label{
      margin-bottom: 18px;
    }
    .el-radio-group{
      height: auto;
      .el-radio{
        margin-right: 40px;
        margin-bottom: 8px;
        &:not(.is-checked){
          .el-radio__inner{
            border-color: 1px solid #ccc;
          }
        }
      }
    }
    .el-checkbox-group{
      width:100%;
      .el-checkbox{
        line-height:1;
        padding-bottom:10px;
      }
    }
    .el-radio-group .el-radio{
      padding-bottom: 10px;
    }
  }
}
.content-block-right .d-radio-preview.new-content{
  &.z-draggable-preview > .el-form-item{
    padding-bottom: 10px !important;
    .el-radio-group .el-radio{
      margin-right: 30px;
      .t-inline{
        padding: 0;
      }
    }
  }
}
</style>
