<template>
  <dialog-form
    ref="form"
    class="resource-upload-container"
    :showSubmitButton="false"
    :form="form"
    :showFoot="false"
    :formItems="formItems"
    :labelWidth="labelWidth"
  >
    <template #spaceId="scope">
      <div class="resource-item">
        <resource-tree v-bind="tree" v-model="scope.form.spaceId"/>
      </div>
    </template>
  </dialog-form>
</template>
<script>
import dialogForm from '@/components/mixins/dialogForm'
import ResourceTree from './ResourceTree'
import { mapGetters } from 'vuex'
export default {
  name: 'ResourceUpload',
  mixins: [dialogForm],
  components: {
    ResourceTree
  },
  inject: ['uploadOption'],
  props: ['resourceType', 'uploadOption'],
  data () {
    return {
      labelWidth: '220px',
      form: {
        uploadFile: this.resourceType === 'insertimage' || this.resourceType === 'attachment' ? [] : '',
        mark: false,
        addToRes: false,
        spaceId: ''
      },
      tree: {
        loading: false,
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    }
  },
  computed: {
    ...mapGetters(['siteExtendConfig']),
    formItems () {
      switch (this.resourceType) {
        case 'insertimage':
          return [
            {
              prop: 'uploadFile',
              label: '选择文件',
              type: 'multiImageUpload',
              option: {
                autoUpload: false,
                isImageDesc: false,
                defaultFileName: '',
                type: this.uploadOption && this.uploadOption.modeObj && this.uploadOption.modeObj.modelId ? [] : this.siteExtendConfig.uploadPicSuffix,
                size: this.siteExtendConfig.cfg.uploadPicSize, // 图片大小
                unit: this.siteExtendConfig.cfg.uploadPicSizeType === '1' ? 'KB' : 'MB', // 图片大小单位
                // type: ['jpg', 'jpeg', 'gif', 'png', 'bmp'],
                ...this.uploadOption
              }
            },
            {
              prop: 'mark',
              label: '是否添加水印',
              type: 'radio',
              options: this.$enums.boolYes
            },
            {
              prop: 'addToRes',
              label: '是否添加到资源库',
              type: 'radio',
              options: this.$enums.boolYes
            },
            {
              prop: 'spaceId',
              type: 'slot',
              hiddenKey: 'addToRes',
              hiddenValue: true
            }
          ]
        case 'insertvideo':
          return [
            {
              prop: 'uploadFile',
              label: '选择文件',
              type: 'videoUpload',
              option: {
                autoUpload: false,
                defaultFileName: '',
                type: this.uploadOption && this.uploadOption.modeObj && this.uploadOption.modeObj.modelId ? [] : this.siteExtendConfig.uploadVideoSuffix,
                size: this.siteExtendConfig.cfg.uploadVideoSize, // 图片大小
                unit: this.siteExtendConfig.cfg.uploadVideoSizeType === '1' ? 'KB' : 'MB', // 图片大小单位
                // type: ['mov', 'mp4', 'rmvb', '3gp', 'mkv'],
                ...this.uploadOption
              }
            },
            {
              prop: 'addToRes',
              label: '是否添加到资源库',
              type: 'radio',
              options: this.$enums.boolYes
            },
            {
              prop: 'spaceId',
              type: 'slot',
              hiddenKey: 'addToRes',
              hiddenValue: true
            }
          ]
        case 'music':
          return [
            {
              prop: 'uploadFile',
              label: '选择文件',
              type: 'audioUpload',
              option: {
                autoUpload: false,
                defaultFileName: '',
                type: this.uploadOption && this.uploadOption.modeObj && this.uploadOption.modeObj.modelId ? [] : this.siteExtendConfig.uploadAudioSuffix,
                size: this.siteExtendConfig.cfg.uploadAudioSize, // 图片大小
                unit: this.siteExtendConfig.cfg.uploadAudioSizeType === '1' ? 'KB' : 'MB', // 图片大小单位
                // type: ['mp3', 'wav', 'ogg', 'acc'],
                ...this.uploadOption
              }
            },
            {
              prop: 'addToRes',
              label: '是否添加到资源库',
              type: 'radio',
              options: this.$enums.boolYes
            },
            {
              prop: 'spaceId',
              type: 'slot',
              hiddenKey: 'addToRes',
              hiddenValue: true
            }
          ]
        case 'attachment':
          return [
            {
              prop: 'uploadFile',
              label: '选择文件',
              type: 'fileUpload',
              option: {
                autoUpload: false,
                defaultFileName: '',
                typeLimit: Number(this.siteExtendConfig.cfg.uploadAttachmentSuffixType),
                enableType: this.uploadOption && this.uploadOption.modeObj && this.uploadOption.modeObj.modelId ? '' : this.siteExtendConfig.uploadAttachmentSuffix.join(','),
                disableType: this.uploadOption && this.uploadOption.modeObj && this.uploadOption.modeObj.modelId ? '' : this.siteExtendConfig.uploadAttachmentSuffix.join(','),
                size: this.siteExtendConfig.cfg.uploadAttachmentSize, // 图片大小
                unit: this.siteExtendConfig.cfg.uploadAttachmentSizeType === '1' ? 'KB' : 'MB', // 图片大小单位
                ...this.uploadOption
              }
            },
            {
              prop: 'addToRes',
              label: '是否添加到资源库',
              type: 'radio',
              options: this.$enums.boolYes
            },
            {
              prop: 'spaceId',
              type: 'slot',
              hiddenKey: 'addToRes',
              hiddenValue: true
            }
          ]
        default:
          return [
            {
              prop: 'uploadFile',
              label: '选择文件',
              type: 'imageUpload',
              option: {
                autoUpload: false,
                type: this.uploadOption && this.uploadOption.modeObj && this.uploadOption.modeObj.modelId ? [] : this.siteExtendConfig.uploadPicSuffix,
                size: this.siteExtendConfig.cfg.uploadPicSize, // 图片大小
                unit: this.siteExtendConfig.cfg.uploadPicSizeType === '1' ? 'KB' : 'MB', // 图片大小单位
                // type: ['jpg', 'jpeg', 'gif', 'png', 'bmp'],
                ...this.uploadOption
              }
            },
            {
              prop: 'mark',
              label: '是否添加水印',
              type: 'radio',
              options: this.$enums.boolYes
            },
            {
              prop: 'addToRes',
              label: '是否添加到资源库',
              type: 'radio',
              options: this.$enums.boolYes
            },
            {
              prop: 'spaceId',
              type: 'slot',
              hiddenKey: 'addToRes',
              hiddenValue: true
            }
          ]
      }
    },
    getResourceType () {
      let type = ''
      switch (this.resourceType) {
        case 'insertvideo':
          type = 2
          break
        case 'music':
          type = 3
          break
        case 'attachment':
          type = 4
          break
        default:
          type = 1
      }
      return type
    }
  },
  methods: {
    getHtml (url, name) {
      let html = ''
      switch (this.resourceType) {
        case 'insertvideo':
          html = `<p><video controls src='${url}' style='max-width:750px'>no video</video></p>`
          break
        case 'music':
          html = `<p><audio controls src='${url}'>no audio</audio></p>`
          break
        case 'attachment':
          html = `<a href='${url}' download='${url}'>${name}</a>`
          break
        default:
          html = `<p style="text-align: center"><img src='${url}' style='max-width:750px'/></p>`
      }
      return html
    },
    async handleConfirm () {
      if (!this.form.uploadFile) {
        this.$message('请先上传文件')
        return
      }
      if (this.form.uploadFile instanceof Array) {
        if (!this.form.uploadFile.length) {
          this.$message('请先上传文件')
          return
        }
        const that = this
        for (let index = 0; index < this.form.uploadFile.length; index++) {
          const d = that.form.uploadFile[index]
          await that.handleUpload({
            ...that.form,
            ...d
          })
        }
      } else {
        this.handleUpload(this.form)
      }
    },
    async handleUpload (form) {
      this.$emit('handleLoading', true)
      let { uploadFile, ...data } = form
      Object.keys(data).forEach(k => {
        uploadFile.append(k, data[k])
      })
      console.log(this.uploadOption)
      if (this.uploadOption && this.uploadOption.modeObj) {
        uploadFile.append('modelId', this.uploadOption.modeObj.modelId || '')
        uploadFile.append('fieldName', this.uploadOption.modeObj.fieldName)
      }
      const dt = await this.$request.fetchUpload(uploadFile).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          const fileUrl = this.$getPath(res.data.fileUrl)
          this.$emit('handleInsertHtml', this.getHtml(fileUrl, data.fileName), { url: fileUrl, id: res.data.resourceId, fileName: data.fileName, videoCover: res.data.videoCover }, form)
        }
        this.$emit('handleLoading', false)
      }).catch(() => {
        this.$emit('handleLoading', false)
      })
      return dt
    }
  },
  mounted () {
    console.log(this.uploadOption)
    // uploadVideoSuffix uploadPicSuffix uploadDocumentSuffix uploadAudioSuffix uploadAttachmentSuffix
    // console.log(this.siteExtendConfig)
  }
}
</script>
<style lang="scss" scoped>
.resource-upload-container{
  .resource-item{
    height: 290px;
    border: 1px solid #e8e8e8;
    padding-top: 10px;
    border-radius: 4px;
  }
}
</style>
