<template>
  <section class="d-audio-upload-preview z-draggable-preview new-content">
    <!--<el-form-item-->
      <!--:label="option.label"-->
      <!--:prop="option.name"-->
      <!--:rules="getRules"-->
    <!--&gt;-->
    <el-form-item
      :prop="option.name"
      :rules="getRules"
    >
      <jee-audio-content-upload
        v-bind="option"
        v-model="val"
        :tipShow="false"
        :isDescShow="false"
        :uploadOption="uploadOption"
      ></jee-audio-content-upload>
      <p class="form-label"><span class="t-red" v-if="option.isRequired">*</span>{{option.label}}</p>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'NewDAudioUploadPreview',
  mixins: [previewMixin],
  computed: {
    uploadOption () {
      return {
        ...this.option,
        iconClass: 'yinpin',
        compType: 'audio'
      }
    }
  }
}
</script>

<style lang="scss">
.d-audio-upload-preview.z-draggable-preview.new-content{
  >.el-form-item{
    padding:15px 15px 0px 30px;
    .form-label{
      color: #666;
      line-height:1.5;
      margin-top: 10px;
      letter-spacing: -0.2px;
    }
  }
  .form-label{
    white-space:normal;
    word-break:break-all;
  }
}
.content-block-right .d-audio-upload-preview.z-draggable-preview.new-content {
  .el-form-item {
    padding: 12px 15px!important;
  }
}
</style>
