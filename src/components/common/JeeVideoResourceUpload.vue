<template>
  <section class="jee-video-resource-upload-container">
    <div class="desc" v-if="getImageDesc">{{getImageDesc}}</div>
    <!-- 上传区 -->
    <div class="resource-upload-wrap">
      <div class="z-video-uploader jee-hover-border"
        @click="showResourceDialog"
      >
        <div class="text-wrap">
          <jee-icon :iconClass="iconClass"></jee-icon>
          <div class="text">点击上传{{getFileText}}</div>
        </div>
        <div slot="tip">
          <!-- 说明文字 -->
          <div class="z-tip-form-item" v-if="tip">{{tip}}</div>
        </div>
      </div>
      <div class="file-item-wrap" v-if="file.fileName">
        <div class="file-name">
          <span>{{file.fileName}}</span>
          <jee-icon iconClass="guanbi" @click="handleRemove"/>
        </div>
      </div>
    </div>
    <!-- 资源上传 -->
    <upload
      ref="resourceUpload"
      :resourceType="compType === 'video' ? 'insertvideo' : 'music'"
      :uploadOption="uploadOption"
      @handleConfirm="handleConfirm"
    ></upload>
  </section>
</template>
<script>
import Upload from '@/components/editor/Upload'

export default {
  name: 'JeeVideoResourceUpload',
  props: {
    value: {
      validator (value) {
        return true
      }
    },
    uploadOption: {
      type: Object,
      default: () => ({})
    },
    isDescShow: {
      type: Boolean,
      default: true
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    compType: {
      type: String,
      default: 'video'
    },
    desc: {
      type: String,
      default: ''
    },
    tip: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '点击上传文件'
    },
    iconClass: {
      type: String,
      default: 'shangchuanicon'
    },
    width: {
      type: [Number, String],
      default: 100
    },
    height: {
      type: [Number, String],
      default: 100
    },
    type: {
      type: [Array, String],
      default: () => []
    },
    size: {
      type: [String, Number],
      default: ''
    },
    unit: {
      type: String,
      default: ''
    },
    defaultFileName: {
      type: String,
      default: ''
    },
    defaultUrl: {
      type: String,
      default: ''
    },
    limit: {
      type: [String, Number],
      default: ''
    }
  },
  components: {
    Upload
  },
  data () {
    return {
      loading: false,
      file: {},
      formData: {},
      percentage: 0
    }
  },
  computed: {
    val () {
      return this.value
    },
    getFileText () {
      switch (this.compType) {
        case 'audio':
          return '音频'
        default:
          return '视频'
      }
    },
    getImageDesc () {
      if (this.desc) return this.desc
      const allowType = this.type instanceof Array ? this.type.join(', ') : this.type
      let desc = allowType ? `支持 ${allowType} ${this.getFileText}格式` : ''
      if (Number(this.size) && this.unit) desc = desc + ` (文件大小不超过${this.size}${this.unit})`
      return this.isDescShow ? desc : ''
    },
    getFileList () {
      return this.file.fileName ? [{
        name: this.file.fileName
      }] : []
    },
    getAccept () {
      const allowTypes = this.type instanceof Array ? this.type : (this.type ? this.type.split(',') : [])
      return allowTypes.length ? allowTypes.map(t => `${this.compType}/${t}`).join(',') : `${this.compType}/*`
    }
  },
  watch: {
    value (newVal) {
      if (!newVal) {
        this.file = {}
      }
      if (typeof newVal === 'object') {
        this.initData()
      }
    }
  },
  methods: {
    showResourceDialog () {
      this.$refs.resourceUpload.showDialog()
    },
    // 移除
    handleRemove () {
      this.file = {}
      this.$emit('input', '')
    },
    initData () {
      // if (!this.autoUpload) {
      //   return
      // }
      if ((this.value && typeof this.value === 'object') || this.value.id) {
        this.file = {
          fileName: this.value.alias + this.value.suffix
        }
        this.$emit('input', this.value.id || '')
      }
    },
    // 资源上传提交
    handleConfirm (url, data, file) {
      // data: { url, id, fileName }
      // 上传file: {uploadFile, mark, addToRes, spaceId}
      // 资源库file：{uploadFile，typeStr, addToRes, spaceId}
      console.log(url, data, file)
      this.formData = Object.assign({}, file)
      if (file && file.uploadFile) {
        const theFile = file.uploadFile.get('uploadFile')
        this.$set(this.file, 'fileName', theFile.name)
      } else {
        if (data.fileName) {
          this.$set(this.file, 'fileName', data.fileName)
        }
      }
      this.$emit('input', data.id || '')
    }
  },
  mounted () {
    console.log(this.uploadOption)
    this.initData()
  }
}
</script>
<style lang="scss">
.jee-video-resource-upload-container{
  margin-right: 2px;
  .desc{
    color: #B3B3B3;
    font-size: 12px;
    line-height: 1.5;
    padding-top: 11px;
    padding-bottom: 17px;
  }
  .resource-upload-wrap{
    .z-video-uploader{
      cursor: pointer;
      border: 1px dashed #E2E2E2;
      border-radius: 4px;
      max-width: 414px;
      width: 100%;
      height: 91px;
    }
  }

  .file-item-wrap{
    padding: 10px 0 0;
    max-width: 414px;
    .file-name{
      padding: 0 10px 0 20px;
      line-height: 38px;
      color: #3178EE;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      >span{
        max-width: 90%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .jee-svg-icon{
        fill: #B3B3B3;
        cursor: pointer;
        &:hover{
          fill: #3178EE;
        }
      }
    }
  }
}
</style>
