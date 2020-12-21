<template>
  <section class="d-textarea-preview z-draggable-preview new-content">
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
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'NewDTextareaPreview',
  mixins: [previewMixin]
}
</script>

<style lang="scss">
.new-content.d-textarea-preview{
  >.el-form-item{
    padding-bottom:3px;
    .el-form-item__label{
      padding:0;
    }
  }
  .el-textarea {
     max-width: 100% ;
      .el-textarea__inner{
        min-height: 80px!important;
        padding:7px 10px;
        line-height: 1.5;
        width: 100% ;
        border:none;
      }
  }
}
.content-block-right{
  .new-content.d-textarea-preview,.d-abstr-preview.new-content{
    .el-textarea{
      .el-textarea__inner{
        min-height: 80px;
        padding:5px 10px;
        border: 1px solid #e8e8e8;
      }
    }
  }
}
</style>
