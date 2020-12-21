<template>
  <section class="s-image-radio-previews s-draggable-preview">
      <el-form-item
      v-if="deviceTab === 2"
        :label="option.label"
        :prop="option.name"
        :rules="getRules"
      >
        <div class="el-image-radio-group" :style="deviceTab === 2?{width: (option.column===1?'25%':option.column===2?'50%':option.column===3?'75%':'100%'), marginRight: '0'}:{width: '50%', marginRight: '0'} ">
          <el-checkbox-group v-model="form[option.name].value">
            <template v-for="(opt, index) in getOptions || []">
              <div :key="index" :class="opt.picUrl?'s-image-radio-inline pic-box pic-none-border':'s-image-radio-inline pic-box'"
                  :style="(index + 1) % option.column==0?{marginRight:0+(((contWidth*0.8-50)/190)-option.column)*140 +'px'}:{}">
                <div >
                  <div class="radio-box ">
                    <el-image class="radio-img"
                              :src="$getPath(opt.picUrl)"
                              fit="contain">
                      <div slot="error" class="image-slot">
                        <jee-icon style="font-size: 27px;fill: #B3B3B3;" iconClass='morentupian'></jee-icon>
                      </div>
                    </el-image>
                    <el-checkbox class="radio-item" v-model="radio"
                                 :label="opt.value">
                      {{opt.label}}
                    </el-checkbox>
                  </div>
                </div>
                <!-- <div :class="(index + 1) % option.column==0?'s-image-radio-block':'s-image-radio-inline'"></div> -->
              </div>
            </template>
          </el-checkbox-group>
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
            <div :key="index" :class="opt.picUrl?'t-inline pic-none-border':'t-inline'">
              <el-checkbox-group class="radio-box " v-model="form[option.name].value">
                <el-image class="radio-img"
                  :src="$getPath(opt.picUrl)"
                  fit="contain">
                  <div slot="error" class="image-slot">
                    <jee-icon style="font-size: 27px;fill: #B3B3B3;" iconClass='morentupian'></jee-icon>
                  </div>
                </el-image>
                <el-checkbox class="radio-item" v-model="radio"
                  :label="opt.value">
                  {{opt.label}}
                </el-checkbox>
              </el-checkbox-group>
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
.s-image-radio-previews{
  .z-tip-form-item{
    padding-left: 18px !important;
    padding-top: 7px !important;
  }
  &.s-draggable-preview > .el-form-item{
    .el-form-item__content{
      .z-tip-form-item{
        padding-left: 0;
      }
    }
    .el-form-item__label{
      line-height: unset;
    }
    .s-image-radio-inline{
      display: inline-block;
      margin-bottom: 16px;
    }
    .el-image-radio-group{
      margin-bottom: -20px;
    }
    .s-image-radio-block{
      display: block;
    }
    .pic-none-border{
      .radio-img{
        border: none !important;
      }
    }
    .el-image-radio-group{
      width: 100%;
      .el-checkbox{
        width: 100%;
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
          min-height: 18px;
          margin-bottom: 20px;
          box-sizing: border-box;
          border-radius: 4px;
          line-height: 1.5;
          .el-checkbox__input{
            vertical-align: top;
          }
          .el-checkbox__label{
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

          .radio-box {
            margin-bottom: 0;
            min-height: 164px;
            box-sizing: border-box;
            border-radius: 4px;
            .radio-item{
              padding-bottom: 0px;
              display: flex;
              white-space: normal;
            }
            .el-checkbox__input{
              margin-top: 3px;
            }
            .el-checkbox__label{
              line-height: 1.5;
              width: calc(100% - 20px);
              margin-left: 5px;
              padding-left: 0;
              display: inline-block;
              letter-spacing: -0.5px;
              // word-wrap: break-word;
            }
          }
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
        &__lable{
          line-height: 1.3;
        }
        width: 100%;
      }
      .el-checkbox{
        width: 100%;
      }
      .pic-none-border{
        .radio-img{
          border: none !important;
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
        margin-bottom: 0;
        .el-checkbox__input{
          vertical-align: top;
        }
        .el-checkbox__label{
          line-height: 1.5;
          width: calc(100% - 20px);
          margin-left: 5px;
          padding-left: 0;
          display: inline-block;
          word-wrap: break-word;
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
