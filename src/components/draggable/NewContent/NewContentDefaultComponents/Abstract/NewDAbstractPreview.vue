<template>
  <section class="d-abstr-preview z-draggable-preview d-textarea-preview new-draggable-preview new-content">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <el-input
        type="textarea"
        v-model="val"
        :label="option.label"
        :placeholder="option.placeholder"
        :maxlength="option.isLengthLimit ? option.max : 249"
        :show-word-limit="option.isLengthLimit"
      ></el-input>
      <el-link
        v-loading='loading'
        :underline="false"
        type="primary"
        @click="handleClick"
      >自动获取摘要</el-link>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'NewDAbstractPreview',
  mixins: [previewMixin],
  props: {
    getContentText: {
      type: Function,
      default: () => ''
    }
  },
  methods: {
    handleClick () {
      const text = this.getContentText()
      if (!text) {
        this.$message('正文内容不能为空')
        return
      }
      this.loading = true
      this.$request.fetchSummary({
        text,
        size: 100,
        keySentence: 100
      }).then(res => {
        if (res.code === 200) {
          const max = this.option.isLengthLimit ? this.option.max : 249
          if (res.data.length > max) {
            this.$emit('input', res.data.substr(0, max))
          } else {
            this.$emit('input', res.data)
          }
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
.d-abstr-preview.new-draggable-preview {
  .el-form-item{
    position: relative !important;
    display: flex;
    padding: 15px 0;
    .el-textarea {
      max-width: 100% ;
      .el-textarea__inner{
          min-height: 80px;
          width: 100% ;
          border:none;
        }
    }
    .el-input__count{
      background-color: transparent;
    }
    .el-form-item__content{
      flex:1;
    }
    .el-link{
      display: block;
      line-height: 1;
      padding: 10px 0;
      text-align: right;
    }
  }
}
.content-block-left .d-abstr-preview.new-draggable-preview{
  margin-right: -21px;
  .el-input{
    .el-input__inner{
      border: 1px solid #e8e8e8;
    }
  }
}
.content-block-right .d-abstr-preview.new-draggable-preview > .el-form-item{
  display: block;
}
</style>
