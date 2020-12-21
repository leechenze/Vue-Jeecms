<template>
  <section class="v-ques-preview z-draggable-preview">
    <el-form-item
      label-width="0"
      :prop="option.name"
      :rules="getRules"
    >
      <div class="input-label"><span class="t-red" v-if="config.isAnswer">*</span>{{option.label}}</div>
      <div v-if="config.prompt" class="gray-prompt">{{config.prompt}}</div>
      <div class='title-input'>
        <el-input
          autocomplete='new-password'
          v-model="val"
          :style="{height:config.option.inputHeight+'px',width:config.option.inputWidth+'%',lineHeight:config.option.inputHeight+'px'}"
          :label="option.label"
          :placeholder="option.placeholder"
          :maxlength="option.isLengthLimit ? option.max : 120"
          :disabled="option.disabled"
          :type="inputType"
          resize="none"
        ></el-input>
      </div>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'VQuestionPreview',
  mixins: [previewMixin],
  data () {
    return {
      inputType: 'textarea'
    }
  },
  props: {
    value: {
      type: [String, Object],
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
    },
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    'cssConfig': function (newData) {
      this.setColor(newData)
    },
    'config': function (newData) {
    }
  },
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
      try {
        if (this.siteExtendConfig.cfg.titleRepeat !== '1') {
          formItemRules.push({
            validator: this.validatorTitle,
            trigger: 'blur'
          })
        }
      } catch (error) {}
      return formItemRules
    }
  },
  methods: {
    setColor (item) {
      const inputs = document.querySelectorAll('.v-ques-preview .input-label')
      const options = document.querySelectorAll('.v-ques-preview .title-input')
      inputs.forEach(input => {
        if (input && item.color) {
          input.style.color = item.color
        }
        if (input && item.fontSize) {
          input.style.fontSize = item.fontSize
        }
        if (input && item.fontWeight) {
          input.style.fontWeight = item.fontWeight
        }
      })
      options.forEach(option => {
        if (option && item.optionFontColor) {
          option.style.color = item.optionFontColor
        }
        if (option && item.optionFontSize) {
          option.style.fontSize = item.optionFontSize
        }
        if (option && item.optionFontWeight) {
          option.style.fontWeight = item.optionFontWeight
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setColor(this.cssConfig)
    })
  }
}
</script>

<style lang="scss">
.v-ques-preview .el-form-item{
  padding: 20px 10px;
  .input-label{
    color: #333333;
    line-height: 1;
    padding-bottom: 20px;
  }
  .title-input{
    line-height: 28px;
    .el-textarea{
      max-width: 100%;
      &__inner{
        width: 100%;
        height: 100%;
        min-height: 0px !important;
        line-height: 28px;
      }
    }
  }
  .el-form-item__error{
    margin-top: 2px;
    padding-left: 20px;
    z-index: 1;
  }
}
</style>
