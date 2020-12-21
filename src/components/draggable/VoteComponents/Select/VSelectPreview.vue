<template>
  <section class="v-select-preview z-draggable-preview">
    <el-form-item
      label-width="0"
      :prop="option.name"
      :required="option.isRequired"
    >
      <div class="select-label"><span class="t-red" v-if="config.isAnswer">*</span>{{option.label}}</div>
      <div v-if="config.prompt" class="gray-prompt">{{config.prompt}}</div>
      <el-select
        v-model="selectValueList"
        popper-class="jee-border"
        placeholder='请选择'
        clearable
        :multiple="multiple"
        :popperAppendToBody='false'
        v-show="multiple"
      >
        <el-option
          v-for="opt in getOptions || []"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value">
        </el-option>
      </el-select>
      <el-select
        v-model="selectValue"
        popper-class="jee-border"
        placeholder='请选择'
        clearable
        :popperAppendToBody='false'
        v-show="!multiple"
      >
        <el-option
          v-for="opt in getOptions || []"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value">
        </el-option>
      </el-select>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'VSelectPreview',
  mixins: [previewMixin],
  props: {
    value: {
      type: Object,
      default: () => ({
        value: ''
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
      selectValue: '', // 选择默认值
      selectValueList: [], // 多选默认值
      multiple: false // 是否是多选
    }
  },
  watch: {
    'cssConfig': function (newData) {
      this.setColor(newData)
    },
    'config.option': {
      deep: true,
      handler: function (newVal, oldVal) {
        // 判断类型是不是下拉题
        if (this.config.type === 4) {
          // 初始化选中项
          this.selectValue = ''
          if (newVal.isRadio === 0) {
            this.selectValueList = []
          }
          // 初始化是否是多选
          this.multiple = !newVal.isRadio
          // 循环判断是否是默认值，如果是默认值，设置选中项
          for (let i = 0; i < newVal.options.length; i++) {
            if (newVal.options[i].isDefault) {
              // 判断是否是支持多选
              if (newVal.isRadio === 0) {
                this.selectValueList.push(newVal.options[i].name)
              } else {
                this.selectValue = newVal.options[i].name
                break
              }
            }
          }
        }
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
  },
  methods: {
    setColor (item) {
      const inputs = document.querySelectorAll('.v-select-preview .select-label')
      const options = document.querySelectorAll('.v-select-preview .el-select')
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
.v-select-preview .el-form-item{
  padding: 20px 10px;
  .select-label{
    color: #333333;
    line-height: 1;
    padding-bottom: 20px;
  }
}
</style>
