<template>
  <section class="d-file-upload-preview z-draggable-preview new-content">
    <!--<el-form-item-->
      <!--:label="option.label"-->
      <!--:prop="option.name"-->
      <!--:rules="getRules"-->
      <!--:required="option.isRequired"-->
    <!--&gt;-->
    <el-form-item
      :prop="option.name"
      :rules="getRules"
    >
    <div class="upload-item">
      <!--<p class="form-label"><span class="t-red" v-if="option.isRequired">*</span>{{option.label}}:</p>-->
      <jee-file-content-upload
        v-bind="option"
        v-model="val"
        :tipShow="false"
        :isDescShow="false"
        :uploadOption="option"
        :isBtn="true"
      ></jee-file-content-upload>
    </div>

    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'NewDFileUploadPreview',
  mixins: [previewMixin],
  computed: {
    getRules () {
      const { isRequired } = this.option
      let formItemRules = []
      if (isRequired) {
        formItemRules.push(this.$rules.requiredArray())
      }
      return formItemRules
    }
  }
}
</script>

<style lang="scss">
.d-file-upload-preview.z-draggable-preview.new-content{
  margin-bottom: 0;
  min-width: 330px;
  >.el-form-item{
    padding: 15px !important;
    padding-bottom:12px !important;
    height: auto;
    // margin: 3px 0;
    .el-form-item__content{
      line-height: 32px !important;
    }
  }
  .upload-item{
    display: flex;
  }
  .form-label{
    display: inline;
    white-space:normal;
    word-break:break-all;
  }
}
.model-left-label {
  :not(.widgetBr){
    .model-left-label{
      .ghost_list_box{
        &:last-of-type{
          .d-file-upload-preview.z-draggable-preview.new-content{
            margin-bottom: 12px;
            >.el-form-item{
              padding-bottom:0 !important;
            }
          }
        }
      }
      >.widget-view{
        &:last-of-type{
          .d-file-upload-preview.z-draggable-preview.new-content{
            margin-bottom: 15px;
          }
        }
      }
    }
  }
}
.content-block-right {
  .ghost_list_box {
    .d-file-upload-preview.new-content{
      margin-bottom: 0;
      .file-name{
        margin-bottom: 10px;
      }
    }
    &:last-of-type{
      .d-file-upload-preview.new-content{
        margin-bottom: 5px;
      }
    }
  }
}
</style>
