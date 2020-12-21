<template>
  <section class="d-document-preview z-draggable-preview new-content">
    <el-form-item
      :prop="option.name"
      :rules="getRules"
      :required="option.isRequired"
    >
      <div v-if="isShowPdf&&showPdf">
        <iframe :src="pdfUrl" id="iframepage"
          width="100%" height="700px" frameborder="0" scrolling="yes"></iframe>
      </div>
      <div v-else>
        <div class="document-tip">{{option.tip}}</div>
        <jee-file-resource-upload
          v-bind="option"
          v-model="val"
          :typeLimit="4"
          docType="2"
          :tipShow="false"
          :isDescShow="false"
          :uploadOption="option"
          :enableType="enableType"
          :isSecret='false'
        ></jee-file-resource-upload>
      </div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'NewDDocumentPreview',
  mixins: [previewMixin],
  props: {
    isShowPdf: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      pdfUrl: '',
      showPdf: false,
      pdfId: ''
    }
  },
  computed: {
    activeContent () {
      return this.option.label
    },
    enableType () {
      return this.option.type instanceof Array ? this.option.type.join(',') : ''
    },
    getRules () {
      const { isRequired } = this.option
      let formItemRules = []
      if (isRequired) {
        formItemRules.push(this.$rules.requiredArray())
      }
      return formItemRules
    }
  },
  watch: {
    val (newVal, oldVal) {
      if (newVal.length) {
        this.showPdf = true
        this.contentConversionDoc(newVal[0].resId)
        this.pdfId = newVal[0].resId
        if (newVal[0].resourcesSpaceData) {
          this.$emit('input', [{ resId: newVal[0].resourcesSpaceData.id }])
        }
      } else {
        this.showPdf = false
      }
    }
  },
  methods: {
    contentConversionDoc (id) {
      if (id) {
        this.$request.fetchContentConversionDoc({ id: id }).then(res => {
          if (res.code === 200) {
            this.pdfUrl = this.$getPath(res.data)
          }
        })
      } else {
        this.contentConversionDoc(this.pdfId)
      }
    }
  }
}
</script>
<style lang="scss">
.d-document-preview.z-draggable-preview.new-content{
  .document-tip{
    line-height: 34px;
    color: #999999;
    padding-left: 15px;
    font-size: 12px;
    border-bottom: 1px solid #e8e8e8;
  }
}
.content-detail-container .d-document-preview.z-draggable-preview {
    >.el-form-item {
      padding: 0;
    }
  }
</style>
