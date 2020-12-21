<template>
  <section class="d-title-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :required="option.isRequired"
    >
      <div class="input-wrap">
        <el-form-item
          label-width="0"
          :prop="`${option.name}.title`"
          :rules="getRules"
        >
          <el-input
            class='title-input'
            v-model="form[option.name].title"
            :label="option.label"
            :placeholder="option.placeholder"
            :maxlength="option.isLengthLimit ? option.max : 120"
            :show-word-limit="option.isLengthLimit"
          ></el-input>
        </el-form-item>
        <!-- <div>
          <div class="btn-35 t-flex"> -->
            <div class="btn-strong" @click="handleTextStrong"
              :style="{fontWeight: val.titleIsBold ? 'bold': 'normal'}"
            >B</div>
            <color-picker v-model="form[option.name].titleColor"></color-picker>
          <!-- </div>
        </div> -->
      </div>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
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
  name: 'DTitlePreview',
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
    })
  }
}
</script>

<style lang="scss">
.d-title-preview .el-form-item{
  .input-wrap{
    display: flex;
    align-items: center;
    .el-input{
      max-width: 414px;
      .el-input__suffix{
        line-height: normal;
        .el-input__suffix-inner{
          background-color: transparent;
        }
      }
    }
    .btn-35{
      height: 35px;
      .m-colorPicker{
        width: 36px;
        height: 34px;
      }
    }
    .btn-strong{
      font-size: 20px;
      padding-right: 20px;
      color: #666666;
      cursor: pointer;
    }
    .box{
      z-index: 1102;
    }
    .el-form-item{
      margin-bottom: 0;
      border-bottom: 0!important;
      padding: 0!important;
      width: 100%;
    }
  }
  .el-form-item__error{
    margin-top: 2px;
    padding-left: 20px;
    z-index: 1;
  }
}
</style>
