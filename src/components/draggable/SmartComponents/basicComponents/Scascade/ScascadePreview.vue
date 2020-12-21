<template>
  <section class="s-cascade-preview s-draggable-preview">
    <el-form-item
      v-if="deviceTab === 2"
      :label="option.label"
      :prop="option.name"
      :required="option.isRequired"
    >
      <!-- <div class="cascade-label"><span class="t-red" v-if="config.isAnswer">*</span></div> -->
      <!-- <div v-if="config.prompt" class="gray-prompt">{{config.prompt}}</div> -->
      <div class="cascade-wrap">
        <template v-for="(item,index) in form[option.name]">
          <el-select  :style="{width: option.width+'%'}"
            :key="index"
            v-model="form[option.name][index]"
            popper-class="jee-border"
            placeholder='请选择'
            clearable
            :popperAppendToBody='false'
          >
            <el-option
              v-for="opt in option.options || []"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value">
            </el-option>
          </el-select>
        </template>
        <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
      </div>
    </el-form-item>
    <el-form-item
      v-else
      :label="option.label"
      :prop="option.name"
      :required="option.isRequired"
    >
      <!-- <div class="cascade-label"><span class="t-red" v-if="config.isAnswer">*</span></div> -->
      <!-- <div v-if="config.prompt" class="gray-prompt">{{config.prompt}}</div> -->
      <div class="cascade-wrap">
        <template v-for="(item,index) in form[option.name]">
          <el-select style="width:100%"
            :key="index"
            v-model="form[option.name][index]"
            popper-class="jee-border"
            placeholder='请选择'
            clearable
            :popperAppendToBody='false'
          >
            <el-option
              v-for="opt in option.options || []"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value">
            </el-option>
          </el-select>
        </template>
        <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
      </div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'ScascadePreview',
  mixins: [previewMixin],
  props: {
    value: {
      type: [Array, Object, String],
      default: () => {
        return []
      }
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
    'value': function (newData) {
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
      const inputs = document.querySelectorAll('.v-cascade-preview .cascade-label')
      const options = document.querySelectorAll('.v-cascade-preview .cascade-wrap')
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
.s-cascade-preview{
  >.el-form-item{
    padding-bottom:3px;
    .el-form-item__content{
      // padding:0;
      // .cascade-label {
      //   float: left;
      //   line-height: 3;
      // }

    }
  }
}
// .s-cascade-preview .el-form-item{
//   padding: 20px 10px;
//   .cascade-label{
//     color: #333333;
//     line-height: 1;
//     padding-bottom: 20px;
//   }
//   .cascade-wrap{
//     .el-select{
//       width: 130px;
//       margin-right: 10px;
//       margin-bottom: 10px;
//     }
//   }
// }
</style>
