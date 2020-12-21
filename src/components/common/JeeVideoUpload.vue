<template>
  <section class="jee-video-upload-container">
    <div class="desc" v-if="getImageDesc">{{getImageDesc}}</div>
    <!-- 上传区 -->
    <div class="upload-wrap">
      <el-upload
        ref="upload"
        class="z-video-uploader"
        drag
        action=""
        :accept="getAccept"
        :before-upload="beforeImageUpload"
        :on-change="handleChange"
        :show-file-list="false"
        :auto-upload="false"
      >
        <div class="text-wrap">
          <jee-icon :iconClass="iconClass"></jee-icon>
          <div class="text">将{{getFileText}}文件拖拽至此，或<span>点击上传</span></div>
        </div>
        <div slot="tip">
          <!-- 说明文字 -->
          <div class="z-tip-form-item" v-if="tip">{{tip}}</div>
          <!-- 进度条 -->
          <el-progress :stroke-width='2' :percentage="percentage" v-if="percentage>0 && percentage <=100" style="maxWidth: 414px"></el-progress>
        </div>
      </el-upload>
      <div class="file-item-wrap" v-if="file.fileName">
        <div class="file-name">
          <span>{{file.fileName}}</span>
          <jee-icon iconClass="guanbi" @click="handleRemove"/>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'JeeVideoUpload',
  props: {
    value: {
      validator (value) {
        return true
      }
    },
    modeObj: {
      type: Object,
      default: () => {
        return {
          modelId: '',
          fieldName: ''
        }
      }
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
  data () {
    return {
      loading: false,
      file: {},
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
      return desc
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
    // 上传-文件类型
    uploadType (file) {
      var type = file.raw.type
      var i = type.indexOf('/')
      var suffix = type.slice(0, i).toLowerCase()
      var fileType = ''
      // File文件 Flash Flash Image图片 Media视频 Audio音频 为空则默认Image
      switch (suffix) {
        case 'image':
          fileType = ''
          break
        case 'text':
          fileType = 'File'
          break
        case 'application':
          fileType = 'File'
          break
        case 'video':
          fileType = 'Media'
          break
        case 'audio':
          fileType = 'Audio'
          break
        default:
          fileType = ''
          break
      }
      return fileType
    },
    // 上传-选择文件
    handleChange (file, fileList) {
      if (!this.beforeImageUpload(file)) return
      this.file = {
        file: file,
        fileName: this.defaultFileName || file.name,
        fileType: this.uploadType(file)
      }
      this.handleUpload()
    },
    // 上传到服务器
    handleUpload () {
      const param = new FormData() // 创建form对象
      param.append('uploadFile', this.file.file.raw, this.file.fileName) // 通过append向form对象添加数据
      if (this.autoUpload) {
        // param.append('spaceId', this.id)
        param.append('typeStr', this.file.fileType)
        param.append('addToRes', true)
        if (this.modeObj) {
          param.append('modelId', this.modeObj.modelId || '')
          param.append('fieldName', this.modeObj.fieldName)
        }

        const that = this
        const onUploadProgress = function (e) {
          // 属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          // 如果lengthComputable为false，就获取不到e.total和e.loaded
          if (e.lengthComputable) {
            var rate = e.loaded / e.total // 已上传的比例
            if (rate < 1) {
              that.percentage = Number((rate * 100).toFixed(0))
            // 这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
            // 因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
            } else {
              that.percentage = 100
            }
          }
        }
        this.$request.fetchUpload(param, onUploadProgress).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '上传成功',
              type: 'success'
            })
            this.$emit('input', res.data.resourceId)
          } else {
            this.handleRemove()
          }
          this.percentage = 0
        })
      } else {
        this.$emit('input', param)
      }
    },
    // 移除
    handleRemove () {
      this.file = {}
      this.$emit('input', '')
    },
    // 上传到页面前进行检查
    beforeImageUpload (file) {
      // 判断文件类型 windows下accept无效
      let isJPG = true
      var i = file.name.lastIndexOf('.')
      var suffix = file.name.substring(i + 1).toLowerCase()

      const allowTypes = this.type instanceof Array ? this.type : (this.type ? this.type.split(',') : [])

      if (allowTypes.length) {
        isJPG = allowTypes.includes(suffix)
      }
      // 判断文件大小
      let isLt2M = true
      if (Number(this.size)) {
        const allowSize = this.unit === 'MB' ? (1024 * 1024) : 1024
        isLt2M = file.size / allowSize < Number(this.size)
      }
      // 提示错误信息
      if (!isJPG) {
        this.$message.error(`上传${this.getFileText}只能是 ${allowTypes.join(',')} 格式!`)
      }
      if (!isLt2M) {
        this.$message.error(`上传${this.getFileText}大小不能超过 ${this.size}${this.unit || 'KB'}!`)
      }
      return isJPG && isLt2M
    },
    initData () {
      // if (!this.autoUpload) {
      //   return
      // }
      if (this.value && typeof this.value === 'object' && this.value.id) {
        this.file = {
          fileName: this.value.alias + this.value.suffix
        }
        this.$emit('input', this.value.id || '')
      }
    }
  },
  mounted () {
    this.initData()
  }
}
</script>
<style lang="scss">
.jee-video-upload-container{
  margin-right: 2px;
  .desc{
    color: #B3B3B3;
    font-size: 12px;
    line-height: 1.5;
    padding-top: 11px;
    padding-bottom: 17px;
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
