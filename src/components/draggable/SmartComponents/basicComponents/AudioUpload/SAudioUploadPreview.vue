<template>
  <section class="s-audio-upload-preview s-draggable-preview">
    <div v-if="deviceTab === 2">
      <el-form-item
        :prop="option.name"
        :rules="getRules"
        :label="option.label"
      >
        <div class="upload-item value" >
          <jee-audio-content-upload
            v-bind="option"
            v-model="val"
            :uploadOption="option"
          ></jee-audio-content-upload>
        </div>
      </el-form-item>
    </div>
    <div v-else class="upload-smart-box smart-mobile-box">
      <el-form-item
        :prop="option.name"
        :rules="getRules"
        :label="option.label"
      >
        <div class="upload-item value" >
          <jee-audio-content-upload
            v-bind="option"
            v-model="val"
            :uploadOption="option"
          ></jee-audio-content-upload>
        </div>
      </el-form-item>
    </div>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'SAudioUploadPreview',
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
.s-audio-upload-preview.s-draggable-preview{
  >.el-form-item{
    padding-top: 2px;
  }
  .el-form-item__label{
      line-height: unset;
    }
  .upload-item{
    display: flex;
    .jee-audio-resource-upload-container .desc{
      padding-bottom: 8px;
      padding-top: 0;
      font-size: 14px;
      color: #666;
    }
  }
  .upload-smart-box{
    .jee-audio-resource-upload-container{
      width: 100%;
      .resource-upload-wrap{
        width: 100%;
        .z-image-uploader{
          width: 100%;
          .text-wrap{
            width: 100%;
            height: 100%;
            .jee-svg-icon{
              padding-top: 73px;
              padding-bottom: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
