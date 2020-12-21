<template>
  <section class="s-radio-preview s-draggable-preview">
    <el-form-item
      v-if="deviceTab === 2"
      :label="option.label"
      :prop="option.name"
      :rules="isValidator? getMyRules : []"
      :required="option.isRequired"
      :class="{'sm-height': !option.isOtherOption}"
    >
      <el-radio-group v-model="form[option.name].value" >
        <el-radio v-for="(opt, index) in getOptions || []" :key="index" :label="opt.value"
          :style="deviceTab === 2?{width: (100/option.radioBtns)+'%', marginRight: '0'}:{width: '50%', marginRight: '0'} ">
          {{opt.label}}
        </el-radio>
        <el-radio :label="option.otherOption.value"  v-if="option.isOtherOption" class="radio-other-option">
          {{option.otherOptionLabel}}
          <el-form-item label-width="0" class="t-inline">
            <el-input size="small" class="line" :style="{width: '120px', marginLeft: '10px'}" v-model="form[option.name].otherValue" :maxlength="10"></el-input>
          </el-form-item>
        </el-radio>
      </el-radio-group>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
    <el-form-item
      v-else
      :label="option.label"
      :prop="option.name"
      :rules="isValidator? getMyRules : []"
      :required="option.isRequired"
      :class="{'sm-height': !option.isOtherOption}"
    >
      <el-radio-group v-model="form[option.name].value" class="phone-radio">
        <el-radio v-for="(opt, index) in getOptions || []" :key="index" :label="opt.value"
          style="width:100%;marginRight: 0;margin-bottom: 18px;">
          {{opt.label}}
        </el-radio>
        <el-radio :label="option.otherOption.value"  v-if="option.isOtherOption" class="radio-other-option">
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
  name: 'SradioPreview',
  mixins: [previewMixin],
  props: {
    value: {
      type: Object,
      default: () => ({
        value: '',
        otherValue: ''
      })
    },
    cssConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    getOptions () {
      let options = [...this.option.options]
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
.s-radio-preview{
  .el-form-item__label{
    line-height: 20px !important;
  }
  .el-form-item__content{
    .el-form-item__error{
      display: none;
    }
  }
  .el-radio-group{
    // width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: -18px;
    margin-left: -20px;
    .radio-other-option{
      .el-radio__label{
      }
    }
    .el-radio{
      display: flex;
      margin-bottom: 18px;
      .el-radio__input{
        margin-left: 20px;
        .el-radio__inner{
          margin-top: 3px;
        }
      }
      .el-radio__label{
        white-space: normal;
        padding-left: 10px;
        line-height: 20px !important;
        color: #333;
        display: flex;
      }
    }
  }
  .z-tip-form-item{
    padding-left: 22px !important;
    padding-top: 10px !important;
  }
  .phone-radio{
    margin-bottom: -20px;
    display: initial;
    .el-radio {
      .el-form-item__label{
        padding-bottom: 0 !important;
      }

    }
  }
}
</style>
