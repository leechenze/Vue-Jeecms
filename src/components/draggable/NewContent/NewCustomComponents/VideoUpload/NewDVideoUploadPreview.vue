<template>
  <section class="d-video-upload-preview z-draggable-preview new-content">
    <!--<el-form-item-->
      <!--:label="option.label"-->
      <!--:prop="option.name"-->
      <!--:rules="getRules"-->
    <!--&gt;-->
    <el-form-item
      :prop="option.name"
      :rules="getRules"
    >
      <jee-video-content-upload
        v-bind="option"
        v-model="val"
        :isDescShow="false"
        :uploadOption="option"
        :tipShow="false"
      ></jee-video-content-upload>
      <p class="form-label"><span class="t-red" v-if="option.isRequired">*</span>{{option.label}}</p>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'NewDVideoUploadPreview',
  mixins: [previewMixin]
}
</script>

<style lang="scss">
.d-video-upload-preview.z-draggable-preview.new-content{
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
.content-block-right .d-video-upload-preview.z-draggable-preview.new-content {
  .el-form-item {
    padding: 12px 15px!important;
  }
}
</style>
