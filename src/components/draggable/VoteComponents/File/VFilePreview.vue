<template>
  <section class="v-file-preview z-draggable-preview">
    <el-form-item
      label-width="0"
      :prop="option.name"
      :rules="getRules"
      :required="option.isRequired"
    >
      <div class="file-label"><span class="t-red" v-if="config.isAnswer">*</span>{{option.label}}</div>
      <div v-if="config.prompt" class="gray-prompt ">{{config.prompt}}</div>
      <jee-file-upload
        class="file-cont"
        v-bind="options"
        v-model="val"
      ></jee-file-upload>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'VFilePreview',
  mixins: [previewMixin],
  props: {
    value: {
      type: [String, Object, Array],
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
  data () {
    return {
      options: {
        typeLimit: 5
      }
    }
  },
  watch: {
    'cssConfig': function (newData) {
      this.setColor(newData)
    }
  },
  computed: {
    getRules () {
      const { isRequired } = this.option
      let formItemRules = []
      if (isRequired) {
        formItemRules.push(this.$rules.requiredArray())
      }
      return formItemRules
    }
  },
  methods: {
    setColor (item) {
      const inputs = document.querySelectorAll('.v-file-preview .file-label')
      const options = document.querySelectorAll('.v-file-preview .file-cont')
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
.v-file-preview.z-draggable-preview{
  >.el-form-item{
    padding: 20px 10px;
    .file-label{
      color: #333333;
      line-height: 1;
      padding-bottom: 20px;
    }
  }
}
</style>
