<template>
  <section class="v-checkbox-preview z-draggable-preview" :class="{'d-checkbox-preview__horizontal': horizontal}">
    <el-form-item
      label-width="0"
      :prop="option.name"
      :required="option.isRequired"
      class="sm-height"
    >
      <div class="checkbox-label"><span class="t-red" v-if="config.isAnswer">*</span>{{option.label}}</div>
      <div v-if="config.prompt" class="gray-prompt">{{config.prompt}}</div>
      <el-checkbox-group v-model="checkList" class="z-checkbox-group">
        <template v-for="(opt, index) in getOptions || []">
          <div :key="index"  v-if="opt.pic&&opt.picUrl" class="t-inline"
          :style="{width: (100/config.option.column)+'%', marginRight: '0'} ">
            <div class="radio-box ">
              <el-image class="radio-img"
                :src="$getPath(opt.picUrl)"
                fit="contain">
                <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
              </el-image>
              <el-checkbox class="checkbox-item" :label="opt.value">
                {{opt.label}}
              </el-checkbox>
            </div>
          </div>
          <div class="t-inline" :key="index" v-else :style="{width: (100/config.option.column)+'%', marginRight: '0'} ">
            <el-checkbox class="checkbox-item"  :label="opt.value">
              {{opt.label}}
            </el-checkbox>
          </div>
        </template>
      </el-checkbox-group>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'VCheckPreview',
  mixins: [previewMixin],
  props: {
    value: {
      type: [String, Object, Array],
      default: () => ({
        value: [],
        otherValue: ''
      })
    },
    horizontal: {
      type: Boolean,
      default: true
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
      checkList: [] // 默认勾选项
    }
  },
  watch: {
    'cssConfig': function (newData) {
      this.setColor(newData)
    },
    'config': {
      deep: true,
      handler: function (newVal, oldVal) {
        // 判断类型是不是多选项
        if (newVal.type === 2) {
          // 循环判断是否是默认值，如果是默认值，设置选中项
          this.checkList = newVal.option.options.map(t => {
            if (t.isDefault) {
              return t.sortNum
            }
          })
        }
      }
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
    setColor (item) {
      const inputs = document.querySelectorAll('.v-checkbox-preview .checkbox-label')
      const options = document.querySelectorAll('.v-checkbox-preview .checkbox-item .el-checkbox__label')
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
.v-checkbox-preview{
  .el-form-item{
    padding: 20px 10px 10px;
  }
  .z-checkbox-group.el-checkbox-group{
    display: block;
    width:100%;
    .el-checkbox{
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
  .checkbox-label{
    color: #333333;
    padding-bottom: 20px;
  }
}
</style>
