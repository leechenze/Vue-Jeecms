<template>
  <section class="s-image-radio-preview s-draggable-preview">
      <el-form-item
      v-if="deviceTab === 2"
        :label="option.label"
        :prop="option.name"
        :rules="getRules"
      >
        <div class="el-image-radio-group">
          <template v-for="(opt, index) in getOptions || []">
             <!-- :style="(index + 1) % option.column==0?{marginRight:0+(((contWidth*0.8-50)/190)-option.column)*140 +'px'}:{}"
              :class="opt.picUrl?'s-image-radio-inline pic-box pic-none-border':'s-image-radio-inline pic-box'"
              -->
            <div :key="index"
            class="s-image-radio-inline pic-box"
              :class="opt.picUrl?'s-image-radio-inline pic-box pic-none-border':'s-image-radio-inline pic-box'"
              :style="(index + 1) % option.column==0?{
                marginRight:0+(((contWidth*0.8-50)/190)-option.column)
                *140 +'px',}:{}"
              >
              <div >
                <div class="radio-box ">
                  <el-image class="radio-img"
                    :src="$getPath(opt.picUrl)"
                    fit="contain">
                    <div slot="error" class="image-slot">
                      <jee-icon style="font-size: 27px;fill: #B3B3B3;" iconClass='morentupian'></jee-icon>
                    </div>
                  </el-image>
                  <el-radio class="radio-item" v-model="form[option.name].value"
                    :label="opt.value">
                    {{opt.label}}
                  </el-radio>
                </div>
              </div>
              <!-- <div :class="(index + 1) % option.column==0?'s-image-radio-block':'s-image-radio-inline'"></div> -->
            </div>
          </template>
        </div>
        <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
      </el-form-item>
      <el-form-item
      v-else class="smart-mobile-box"
        :label="option.label"
        :prop="option.name"
        :rules="getRules"
      >
      <div class="el-image-radio-group">
          <template v-for="(opt, index) in getOptions || []">
            <div :key="index"  :class="opt.picUrl?'t-inline pic-none-border':'t-inline'">
              <div class="radio-box ">
                <el-image class="radio-img"
                  :src="$getPath(opt.picUrl)"
                  fit="contain">
                  <div slot="error" class="image-slot">
                    <jee-icon style="font-size: 27px;fill: #B3B3B3;" iconClass='morentupian'></jee-icon>
                  </div>
                </el-image>
                <el-radio class="radio-item" v-model="radio"
                  :label="opt.value">
                  {{opt.label}}
                </el-radio>
              </div>
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
  name: 'SImageRadioPreview',
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
    },
    contWidth: {
      type: Number,
      default: 1000
    }
  },
  data () {
    return {
      radio: '', // 默认选中项
      titleWidth: ''
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
      const inputs = document.querySelectorAll('.s-image-radio-preview .radio-label')
      const options = document.querySelectorAll('.s-image-radio-preview .radio-item .el-radio__label')
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
.s-image-radio-preview{
  .z-tip-form-item{
    padding-left: 18px !important;
    font-size: 12px;
    padding-top: 7px !important;
  }
  &.s-draggable-preview > .el-form-item{
    .el-form-item__content{
      .z-tip-form-item{
        padding-left: 0;
      }
    }
    .pic-none-border{
      .radio-img{
        border: none !important;
      }
    }
    .el-form-item__label{
      line-height: unset;
    }
    .s-image-radio-inline{
      display: inline-block;
      margin-bottom: 16px;
    }
    .s-image-radio-block{
      display: block;
    }
    .el-image-radio-group{
      width: 100%;
      line-height: 1;
      margin-bottom: -20px;
       .el-radio{
          display: inline-block;
          vertical-align: top;
          white-space:unset;
          width: 100%;
          &__lable{
            line-height: 1.3;
          }
        }
        .radio-box{
          width: 140px;
          min-height: 164px;
          box-sizing: border-box;
          border-radius: 4px;
          .radio-item{
            padding-bottom: 0px;
            display: flex;
          }
          .el-radio__input{
            margin-top: 3px;
          }
          .el-radio__label{
            line-height: 1.5;
            width: calc(100% - 20px);
            margin-left: 5px;
            padding-left: 0;
            display: inline-block;
            word-wrap: break-word;
          }
        }
        .radio-img{
          width: 140px;
          background:rgba(255,255,255,1);
          border:1px dashed rgba(226,226,226,1);
          border-radius:4px;
          height: 140px;
          margin-bottom: 10px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          img{
            background-color: #F0F0F0;
          }
        }
        .pic-box{
          margin-right: 58px;
          // margin-right: 0px;
        }
        .s-image-radio-right{
          margin-right: 0;
        }
    }
  }
  .radio-label{
    color: #333333;
  }
  &.s-draggable-preview > .el-form-item.smart-mobile-box{
    .el-image-radio-group{
      line-height: 1;
      margin-bottom: -20px;
      width: 100%;
      .t-inline{
        margin-right: 6px;
        margin-bottom: 20px;
      }
      .t-inline:nth-child(2n+2){
        margin-right: 0;
      }
      .el-radio{
        display: inline-block;
        vertical-align: top;
        white-space:unset;
        width: 100%;
        &__lable{
          line-height: 1.3;
        }
      }
      .radio-box{
        width: 140px;
        min-height: 164px;
        box-sizing: border-box;
        border-radius: 4px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(226,226,226,1);
        border-radius:4px;
        padding: 6px;
        .el-radio__input{
          vertical-align: top;
        }
        .el-radio__label{
          line-height: 1.5;
          width: calc(100% - 20px);
          margin-left: 5px;
          padding-left: 0;
          display: inline-block;
          word-wrap: break-word;
          padding-bottom: 10px;
        }
      }
      .pic-none-border{
        .radio-img{
          border: none !important;
        }
      }
      .radio-img{
        width: 126px;
        height: 126px;
        margin-bottom: 10px;
        border-radius: 4px;
        box-sizing: border-box;
      }
    }
  }
}
</style>
