<template>
  <section class="d-title-preview z-draggable-preview new-content">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :required="option.isRequired"
    >
      <div class="input-wrapper">
        <el-form-item
          label-width="0"
          :prop="`${option.name}.title`"
          :rules="getRules"
          :class="option.tip?'banShow':''"
        >
          <div class="input-wrap">
            <el-input
              class='title-input'
              v-model="form[option.name].title"
              :label="option.label"
              :placeholder="option.placeholder"
              :maxlength="option.isLengthLimit ? option.max : 120"
              :show-word-limit="option.isLengthLimit"
              @blur="banBlur(form[option.name].title)"
              :ref="option.label"
              :style="{'opacity': !banShow ? '1': '0'}"
            ></el-input>
            <div class="flex-1">
              <div class="btn-35 t-flex">
                <div class="btn-strong" @click="handleTextStrong"
                  :style="{fontWeight: val.titleIsBold ? 'bold': 'normal'}"
                >B</div>
                <color-picker v-model="form[option.name].titleColor"></color-picker>
              </div>
            </div>
          </div>
          <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
          <div class="ban-box" @click="banClick(option.label)" v-show="banShow" v-html="banVal"></div>
        </el-form-item>
      </div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
import colorPicker from '@/components/plugin/color-picker'
import {
  mapGetters, mapActions
} from 'vuex'
export default {
  name: 'NewDTitlePreview',
  mixins: [previewMixin],
  components: {
    colorPicker
  },
  computed: {
    ...mapGetters(['siteExtendConfig']),
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
    'value.titleColor': function (newData) {
      this.setColor()
    },
    'value.titleIsBold': function (newData) {
      this.setBold()
    }
  },
  methods: {
    ...mapActions('config', ['FetchSiteExtentConfig']),
    setColor () {
      const input = document.querySelector('.d-title-preview .title-input .el-input__inner')
      if (input && this.value.titleColor) {
        input.style.color = this.value.titleColor
      }
    },
    setBold () {
      const input = document.querySelector('.d-title-preview .title-input .el-input__inner')
      if (input) {
        input.style.fontWeight = this.value.titleIsBold ? 800 : 400
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
    },
    handleTextStrong () {
      let data = { ...this.val }
      data.titleIsBold = !data.titleIsBold
      this.$emit('input', data)
    }
  },
  mounted () {
    this.FetchSiteExtentConfig()
    this.$nextTick(() => {
      this.setColor()
      this.setBold()
      this.replace(this.value.title)
    })
  }
}
</script>

<style lang="scss">
.d-title-preview.new-content .el-form-item{
  .input-wrap{
    height: 35px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    line-height: 33px;
    .el-input{
      max-width: 414px;
      &.title-input{
        .el-input__inner {
          padding-right: 50px!important;
        }
      }
      .el-input__suffix{
        line-height: normal;
        right: 6px;
        .el-input__count-inner{
          background-color: transparent;
        }
      }
    }
    .btn-35{
      height: 33px;
      .m-colorPicker{
        width: auto;
        height: 34px;
      }
    }
    .btn-strong{
      font-size: 20px;
      padding-right: 10px;
      color: #666666;
      cursor: pointer;
    }
    .box{
      z-index: 1102;
    }
  }
  .el-form-item{
      margin-bottom: 0;
      border-bottom: 0!important;
      padding: 0!important;
      width: 100%;
    .z-tip-form-item{
      line-height: 1;
      padding-top: 8px;
    }
  }
  .el-form-item__error{
    line-height: 1 !important;
    margin-top: 8px;
    padding-left: 20px;
    z-index: 1;
  }
  .el-form-item.banShow{
    .el-form-item__error{
      padding-left:0px !important;
    }
  }
  .ban-box{
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;
    right: 70px;
    line-height: 35px;
  }
}
.content-block-right .d-title-preview.new-content{
  .el-form-item{
    &__label{
      line-height: 35px;
    }
    &__content{
      line-height: 35px;
    }
  }
  .input-wrap{
    width: 100%;
    border: 1px solid #e8e8e8;
    padding-right: 10px;
    background-color: #fff;
    overflow: hidden;
    border-radius: 4px;
    .el-input{
      .el-input__inner{
        border: none;
      }
      .el-input__suffix{
        right: 5px;
      }
    }
    .btn-strong{
      padding-right: 10px;
    }
  }
  .z-tip-form-item{
    padding-left: 20px !important;
  }
}
</style>
