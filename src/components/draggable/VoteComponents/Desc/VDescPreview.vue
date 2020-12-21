<template>
  <section class="v-desc-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :required="option.isRequired"
    >
      <div class="input-wrap">
        <el-input
          class='title-input'
          type="textarea"
          autosize
          resize="none"
          v-model="val"
          :label="option.label"
          :placeholder="option.placeholder"
          maxlength="150"
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
  name: 'VDescPreview',
  mixins: [previewMixin],
  props: {
    cssConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    'cssConfig': function (newData) {
      this.setColor(newData)
    }
  },
  methods: {
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
    setColor (item) {
      const input = document.querySelector('.v-desc-preview .input-wrap .title-input .el-textarea__inner')
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
.v-desc-preview .el-form-item{
  padding: 10px 0;
  .input-wrap{
    width: 100%;
    align-items: center;
    .el-textarea{
      min-height: 40px;
      &__inner{
        border: none;
        min-height: 40px !important;
        height: 40px ;
        font-size: 14px;
        line-height: 1.5;
        padding: 10px;
      }
      width: 100%;
      max-width: 100%;
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
