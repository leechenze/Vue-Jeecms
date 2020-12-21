<template>
  <section class="v-radio-preview z-draggable-preview">
    <el-form-item
      label-width="0"
      :prop="option.name"
      :rules="isValidator ? getMyRules : []"
      :required="isValidator && option.isRequired"
      class="sm-height"
    >
      <div class="radio-label"><span class="t-red" v-if="config.isAnswer">*</span>{{option.label}}</div>
      <div v-if="config.prompt" class="gray-prompt">{{config.prompt}}</div>
      <div class="el-radio-group">
        <template v-for="(opt, index) in getOptions || []">
          <div :key="index"   v-if="opt.pic&&opt.picUrl" class="t-inline"
            :style="{width: (100/config.option.column)+'%', marginRight: '0'} ">
            <div class="radio-box ">
              <el-image class="radio-img"
                :src="$getPath(opt.picUrl)"
                fit="contain">
                <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
              </el-image>
              <el-radio class="radio-item" v-model="radio"
                :label="opt.value">
                {{opt.label}}
              </el-radio>
            </div>
          </div>
          <div  v-else :key="index"  class="t-inline"
            :style="{width: (100/config.option.column)+'%', marginRight: '0'} ">
            <el-radio class="radio-item" v-model="radio"
              :label="opt.value">
              {{opt.label}}
            </el-radio>
          </div>
        </template>
      </div>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'VRadioPreview',
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
      radio: '' // 默认选中项
    }
  },
  watch: {
    'cssConfig': function (newData) {
      this.setColor(newData)
    },
    'config': {
      deep: true,
      handler: function (newVal, oldVal) {
        // 判断类型是不是单选项
        if (newVal.type === 1) {
          // 循环判断是否是默认值，如果是默认值，设置选中项
          for (let i = 0; i < newVal.option.options.length; i++) {
            if (newVal.option.options[i].isDefault) {
              this.radio = newVal.option.options[i].sortNum
            }
          }
        }
      }
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
  },
  methods: {
    setColor (item) {
      const inputs = document.querySelectorAll('.v-radio-preview .radio-label')
      const options = document.querySelectorAll('.v-radio-preview .radio-item .el-radio__label')
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
.v-radio-preview{
  &.z-draggable-preview > .el-form-item{
    padding: 20px 10px 5px;
    .el-radio-group{
      width: 100%;
       .el-radio{
          padding-bottom: 15px;
          display: inline-block;
          vertical-align: top;
          white-space:unset;
          &__lable{
            line-height: 1.3;
          }
        }
        .radio-box{
          width: 152px;
          min-height: 191px;
          border: 1px solid #e8e8e8;
          background-color: #fff;
          margin-bottom: 15px;
          padding: 6px;
          box-sizing: border-box;
          border-radius: 4px;
        }
        .radio-img{
          max-width: 100%;
          height: 140px;
          margin-bottom: 10px;
          border-radius: 4px;
          background-color: #f8f8f8;
        }
    }
  }
  .radio-label{
    color: #333333;
    padding-bottom: 20px;
  }
}
</style>
