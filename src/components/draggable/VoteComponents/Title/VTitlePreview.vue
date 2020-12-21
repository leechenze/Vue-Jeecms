<template>
  <section class="v-title-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :required="option.isRequired"
    >
      <div class="input-wrap">
        <el-input
          class='title-input'
          v-model="val"
          :label="option.label"
          :placeholder="option.placeholder"
          maxlength="50"
          :show-word-limit="option.isLengthLimit"
        ></el-input>
      </div>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'VTitlePreview',
  mixins: [previewMixin],
  props: {
    cssConfig: {
      type: Object,
      default: () => {
        return {}
      }
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
  watch: {
    'cssConfig': function (newData) {
      this.setColor(newData)
    }
  },
  methods: {
    setColor (item) {
      const input = document.querySelector('.v-title-preview .title-input .el-input__inner')
      if (input && item.color) {
        input.style.color = item.color
      }
      if (input && item.fontSize) {
        input.style.fontSize = item.fontSize
      }
      if (input && item.fontWeight) {
        input.style.fontWeight = item.fontWeight
      }
      if (input && item.textAlign) {
        input.style.textAlign = item.textAlign
      }
    },
    // 验证标题名称
    validatorTitle (rule, value, callback) {
      if (value) {
        var params = {
          title: value,
          channelId: this.form.channelId
        }
        if (this.form.id) params.contentId = this.form.id
        this.$request.fetchContentTitleUnique(params).then(res => {
          if (res.code === 200 && res.data) {
            callback()
          } else {
            callback(new Error('标题不允许重复'))
          }
        })
      }
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
.v-title-preview .el-form-item{
  padding: 10px 0;
  .input-wrap{
    width: 100%;
    align-items: center;
    .el-input{
      width: 100%;
      max-width: 100%;
      &__inner{
        padding: 0 10px;
        border: none;
        font-size: 24px;
        text-align: center;
        &::-webkit-input-placeholder {
          font-size: 24px;
        }
        &::-moz-placeholder {
          font-size: 24px;
        }
        &::-ms-input-placeholder {
          font-size: 24px;
        }
      }
      .el-input__suffix{
        line-height: normal;
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
