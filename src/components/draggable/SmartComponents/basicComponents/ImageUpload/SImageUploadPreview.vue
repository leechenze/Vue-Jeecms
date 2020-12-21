<template>
  <section class="s-image-upload-preview s-draggable-preview">
    <div v-if="deviceTab === 2">
      <el-form-item
        :prop="option.name"
        :rules="getRules"
        :label="option.label"
      >
        <div class="upload-item value" >
          <jee-image-resource-upload
            v-bind="option"
            :uploadOption="option"
            :defaultUrl="defaultUrl"
            :isBan="isBan"
            v-model="val"
          ></jee-image-resource-upload>
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
          <jee-image-resource-upload
            v-bind="option"
            :uploadOption="option"
            :defaultUrl="defaultUrl"
            :isBan="isBan"
            v-model="val"
          ></jee-image-resource-upload>
        </div>
      </el-form-item>
    </div>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'SImageUploadPreview',
  mixins: [previewMixin],
  data () {
    return {
      defaultUrl: '',
      isBan: false
    }
  },
  watch: {
    value: {
      handler (newData) {
        if (typeof newData === 'object' && newData.url) {
          this.defaultUrl = newData.url
          this.replaceImg(this.defaultUrl)
        } else {
          this.replaceImg(this.value)
        }
      },
      deep: true
    }
  },
  mounted () {
    if (typeof this.value === 'object' && this.value.url) {
      this.defaultUrl = this.value.url
      this.replaceImg(this.defaultUrl)
    } else {
      this.replaceImg(this.value)
    }
  },
  methods: {
    replaceImg (img) {
      // 图片类违禁词
      if (this.form.banJson && this.form.banJson[this.option.name] && this.form.banJson[this.option.name].img) {
        this.form.banJson[this.option.name].img.forEach(d => {
          if (d.indexOf(img) !== -1) {
            this.isBan = true
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .s-image-upload-preview{
    .el-form-item{
      .el-form-item__label{
        line-height: unset;
      }
    }
  }
</style>
<style lang="scss">
.s-image-upload-preview.s-draggable-preview{
  >.el-form-item{
    padding-top: 2px;
  }
  .el-form-item__label{
      line-height: 1;
  }
  .upload-item{
    display: flex;
    .jee-image-resource-upload-container .desc{
      padding-bottom: 8px;
      padding-top: 0;
      font-size: 14px;
      color: #666;
    }
  }
  .upload-smart-box{
    .jee-image-resource-upload-container{
      width: 100%;
      .resource-upload-wrap{
        height: 190px;
        width: 100%;
        .z-image-uploader{
          width: 100%;
          .text-wrap{
            width: 100%;
            height: 100%;
            .jee-svg-icon{
              padding-top: 64px;
              padding-bottom: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
