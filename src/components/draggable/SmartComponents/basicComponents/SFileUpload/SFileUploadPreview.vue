<template>
  <section class="s-file-upload-preview s-draggable-preview">
    <div v-if="deviceTab === 2">
      <el-form-item
        :prop="option.name"
        :rules="getRules"
        :label="option.label"
        :required="option.isRequired"
      >
      <div class="upload-item" :style="{width:option.width+'%'}">
        <jee-file-content-upload
          v-bind="option"
          v-model="val"
          :showLabel="false"
          :isDescShow="false"
          :uploadOption="option"
          :isBtn="true"
        ></jee-file-content-upload>
      </div>
      </el-form-item>
    </div>
    <div v-else class="smart-mobile-box">
      <el-form-item
        :prop="option.name"
        :rules="getRules"
        :label="option.label"
      >
      <div class="upload-item" :style="{width:option.width+'%'}">
        <jee-file-content-upload
          v-bind="option"
          v-model="val"
          :showLabel="false"
          :uploadOption="option"
          :isBtn="true"
        ></jee-file-content-upload>
      </div>
      </el-form-item>
    </div>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'SFileUploadPreview',
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
  .s-file-upload-preview{
    .el-form-item{
      height: auto;
      .el-form-item__label,.el-form-item__content{
        line-height: 32px;
      }
    }
    .upload-item{
      display: flex;
      .jee-content-upload-container .desc{
        padding-bottom: 8px;
        padding-top: 0;
        font-size: 14px;
        color: #666;
        .el-button--small{
          padding: 8px 15px;
          font-size: 12px;
          line-height: 14px;
        }
      }

    }
  }
</style>
