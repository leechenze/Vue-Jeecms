<template>
  <section class="s-textarea-preview s-draggable-preview ">
    <div >
      <el-form-item
        :label="option.label"
        :prop="option.name"
        :rules="getRules"
      >
        <el-input
          :style="(deviceTab === 2?{width: option.width+'%'}:{width: '100%'})"
          autocomplete='new-password'
          v-model="val"
          :label="option.label"
          :placeholder="option.placeholder"
          :maxlength="option.isLengthLimit ? option.max : 120"
          :disabled="option.disabled"
          :type="inputType"
        ></el-input>
        <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
      </el-form-item>
    </div>
    <!-- <div v-else>
      <el-form-item
        :label="option.label"
        :prop="option.name"
        :rules="getRules"
      >
        <el-input
          autocomplete='new-password'
          v-model="val"
          :label="option.label"
          :placeholder="option.placeholder"
          :maxlength="option.isLengthLimit ? option.max : 120"
          :disabled="option.disabled"
          :type="inputType"
        ></el-input>
        <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
      </el-form-item>
    </div> -->
  </section>
</template>
<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'StextareaPreview',
  mixins: [previewMixin],
  data () {
    return {
      inputType: 'textarea'
    }
  },
  props: {
    cssConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
<style lang="scss">
.s-textarea-preview{
  .el-form-item{
    // padding-bottom:3px;
    .el-form-item__label{
      line-height: unset;
    }
  }
  .el-textarea {
    max-width: 100% ;
    .el-textarea__inner{
      width: 100% ;
      height: 100%;
      padding: 7px 20px;
    }
  }
}
</style>
